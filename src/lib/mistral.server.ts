type Msg = { role: "system" | "user" | "assistant"; content: string };
type AiResult = { content: string; finishReason?: string };

// In-memory daily token tracking (resets on cold start; safe MVP fallback).
const DAILY_LIMIT = Number(process.env.DAILY_TOKEN_LIMIT || 100_000_000);
const PER_IP_MSG = Number(process.env.PER_IP_DAILY_MESSAGE_LIMIT || 30);
const PER_IP_INTERVIEW = Number(process.env.PER_IP_DAILY_INTERVIEW_LIMIT || 1);
const PER_IP_CV = Number(process.env.PER_IP_DAILY_CV_AI_LIMIT || 2);

type Counter = { day: string; n: number };
const globalTokens: Counter = { day: "", n: 0 };
const ipMsg = new Map<string, Counter>();
const ipInterview = new Map<string, Counter>();
const ipCv = new Map<string, Counter>();

function today() {
  return new Date().toISOString().slice(0, 10);
}

function bump(map: Map<string, Counter>, key: string, limit: number) {
  const d = today();
  const c = map.get(key);
  if (!c || c.day !== d) {
    map.set(key, { day: d, n: 1 });
    return;
  }
  if (c.n >= limit) throw new Error("RATE_LIMIT");
  c.n += 1;
}

export function checkIpMessage(ip: string) {
  bump(ipMsg, ip, PER_IP_MSG);
}
export function checkIpInterview(ip: string) {
  bump(ipInterview, ip, PER_IP_INTERVIEW);
}
export function checkIpCv(ip: string) {
  bump(ipCv, ip, PER_IP_CV);
}

export function checkGlobalBudget(estimate: number) {
  const d = today();
  if (globalTokens.day !== d) {
    globalTokens.day = d;
    globalTokens.n = 0;
  }
  if (globalTokens.n + estimate > DAILY_LIMIT) throw new Error("DAILY_TOKEN_LIMIT_REACHED");
}

export function recordTokens(used: number) {
  const d = today();
  if (globalTokens.day !== d) {
    globalTokens.day = d;
    globalTokens.n = 0;
  }
  globalTokens.n += used;
}

// Round-robin index across requests for load distribution.
let rrIndex = 0;

function getApiKeys(): string[] {
  const keys = [
    process.env.MISTRAL_API_KEY_1,
    process.env.MISTRAL_API_KEY_2,
    process.env.MISTRAL_API_KEY,
    process.env.MISTRAL_API_KEY_3,
  ].filter((k): k is string => !!k && k.length > 0);
  return keys;
}

async function attemptCall(
  apiKey: string,
  body: Record<string, unknown>,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function callMistral({
  messages,
  temperature = 0.4,
  maxTokens = 800,
  json = true,
}: {
  messages: Msg[];
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
}): Promise<AiResult> {
  const keys = getApiKeys();
  // Default to a fast, low-cost specialized model. Big enough for HR/CV reasoning, ~3-5x faster than mistral-large.
  const model = process.env.MISTRAL_MODEL || "mistral-small-latest";
  if (keys.length === 0) throw new Error("MISTRAL_API_KEY missing");

  checkGlobalBudget(maxTokens + 500);

  let msgs = messages;
  if (json) {
    const hasJson = msgs.some((m) => /json/i.test(m.content));
    if (!hasJson) {
      msgs = [{ role: "system", content: "Respond with valid JSON only." }, ...msgs];
    }
  }
  const body: Record<string, unknown> = {
    model,
    messages: msgs,
    temperature,
    max_tokens: maxTokens,
  };
  if (json) body.response_format = { type: "json_object" };

  // Build attempt order: start at round-robin offset, then try every other key,
  // then retry the whole rotation once for transient failures.
  const start = rrIndex++ % keys.length;
  const ordered: string[] = [];
  for (let i = 0; i < keys.length; i++) ordered.push(keys[(start + i) % keys.length]);
  const attempts = [...ordered, ...ordered]; // 2 passes total

  let lastErr: unknown = null;
  for (let i = 0; i < attempts.length; i++) {
    const key = attempts[i];
    const isLast = i === attempts.length - 1;
    try {
      const res = await attemptCall(key, body, 45_000);
      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || "";
        const finishReason = data.choices?.[0]?.finish_reason;
        recordTokens(data.usage?.total_tokens || maxTokens);
        if (!content.trim()) throw new Error("AI_EMPTY_RESPONSE");
        if (finishReason === "length") throw new Error("AI_TRUNCATED_RESPONSE");
        return { content, finishReason };
      }
      // Non-2xx: classify
      const text = await res.text().catch(() => "");
      if (res.status === 401 || res.status === 403) {
        // Bad key — try the next key without backoff.
        lastErr = new Error(`AUTH_${res.status}`);
        continue;
      }
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`UPSTREAM_${res.status}`);
        // brief backoff with jitter before next attempt
        if (!isLast) await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
        continue;
      }
      // Other 4xx — non-retryable
      throw new Error(`Mistral API error: ${res.status} ${text.slice(0, 300)}`);
    } catch (e) {
      const name = (e as Error)?.name;
      const msg = (e as Error)?.message || "";
      lastErr = e;
      // Network / abort / transient — retry next
      if (name === "AbortError" || /fetch|network|ECONN|timeout/i.test(msg) || /UPSTREAM_|AUTH_/.test(msg)) {
        if (!isLast) await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));
        continue;
      }
      throw e;
    }
  }
  // All attempts failed
  const m = (lastErr as Error)?.message || "AI_UNAVAILABLE";
  if (/UPSTREAM_429/.test(m)) throw new Error("RATE_LIMIT");
  if (/AbortError|timeout/i.test(m)) throw new Error("AI_TIMEOUT");
  throw new Error("AI_UNAVAILABLE");
}

export function parseJson<T>(content: string): T {
  let cleaned = (content || "")
    .replace(/^\uFEFF/, "")
    .replace(/^```json\s*/im, "")
    .replace(/^```\s*/im, "")
    .replace(/```\s*$/im, "")
    .trim();

  const tryParse = (s: string): T | null => {
    try {
      return JSON.parse(s) as T;
    } catch {
      return null;
    }
  };

  let r = tryParse(cleaned);
  if (r) return r;

  // Extract first balanced { ... } or [ ... ]
  const objStart = cleaned.indexOf("{");
  const arrStart = cleaned.indexOf("[");
  const isArr = arrStart !== -1 && (objStart === -1 || arrStart < objStart);
  const start = isArr ? arrStart : objStart;
  const open = isArr ? "[" : "{";
  const close = isArr ? "]" : "}";
  if (start !== -1) {
    let depth = 0;
    let inStr = false;
    let esc = false;
    for (let i = start; i < cleaned.length; i++) {
      const ch = cleaned[i];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === "\\") esc = true;
        else if (ch === '"') inStr = false;
      } else {
        if (ch === '"') inStr = true;
        else if (ch === open) depth++;
        else if (ch === close) {
          depth--;
          if (depth === 0) {
            const slice = cleaned.slice(start, i + 1);
            r = tryParse(slice);
            if (r) return r;
            break;
          }
        }
      }
    }
    // Try last-resort: from start to last close
    const lastClose = cleaned.lastIndexOf(close);
    if (lastClose > start) {
      r = tryParse(cleaned.slice(start, lastClose + 1));
      if (r) return r;
    }
  }

  console.error("Invalid AI JSON. Raw content:", cleaned.slice(0, 500));
  throw new Error("Invalid AI JSON response");
}

export async function callJson<T>(
  request: Parameters<typeof callMistral>[0],
  fallback: (reason: string) => T,
): Promise<T> {
  let lastError: unknown;
  const baseTokens = request.maxTokens || 800;
  const baseTemp = request.temperature ?? 0.4;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await callMistral({
        ...request,
        // Increase token budget on each retry; reduce temp on last try for stability
        maxTokens: i === 0 ? baseTokens : Math.min(baseTokens + i * 700, 3500),
        temperature: i === 2 ? Math.min(baseTemp, 0.3) : baseTemp,
      });
      return parseJson<T>(res.content);
    } catch (error) {
      lastError = error;
      const msg = (error as Error)?.message || "";
      // Daily token limit and explicit user-facing rate limit must surface to UI
      if (/DAILY_TOKEN_LIMIT|^RATE_LIMIT$/i.test(msg)) throw error;
      // Everything else: keep retrying, then fall back gracefully
    }
  }

  console.error("AI JSON fallback used:", lastError);
  return fallback((lastError as Error)?.message || "AI_UNAVAILABLE");
}

export function getIp(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
