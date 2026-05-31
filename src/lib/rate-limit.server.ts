const DAILY_LIMIT = Number(process.env.DAILY_TOKEN_LIMIT || 1_000_000);
const PER_IP_MSG = Number(process.env.PER_IP_DAILY_MESSAGE_LIMIT || 30);
const PER_IP_INTERVIEW = Number(process.env.PER_IP_DAILY_INTERVIEW_LIMIT || 1);
const PER_IP_CV = Number(process.env.PER_IP_DAILY_CV_AI_LIMIT || 2);

function today() {
  return new Date().toISOString().slice(0, 10);
}

// In-memory fallback
type Counter = { day: string; n: number };
const memGlobal: Counter = { day: "", n: 0 };
const memIpMsg = new Map<string, Counter>();
const memIpInterview = new Map<string, Counter>();
const memIpCv = new Map<string, Counter>();

function getKv(): any {
  // Support Cloudflare bindings via worker env, fallback to globalThis or process.env
  const kv = (globalThis as any).IX_STORE ?? (process.env as any).IX_STORE ?? null;
  if (!kv && process.env.NODE_ENV === "production") {
    throw new Error("KV binding IX_STORE is mandatory in production for rate limits.");
  }
  return kv;
}

async function bumpKv(namespace: string, key: string, limit: number): Promise<void> {
  const kv = getKv();
  const d = today();
  const fullKey = `rl:${namespace}:${d}:${key}`;

  if (kv) {
    try {
      const val = await kv.get(fullKey);
      let n = val ? parseInt(val, 10) : 0;
      if (n >= limit) throw new Error("RATE_LIMIT");
      n += 1;
      // Expiration: 24 hours (86400 seconds)
      await kv.put(fullKey, n.toString(), { expirationTtl: 86400 });
      return;
    } catch (e) {
      if ((e as Error).message === "RATE_LIMIT") throw e;
      if (process.env.NODE_ENV === "production") throw e;
      // Fallback to in-memory if KV fails
      console.warn("KV rate limit failed, falling back to memory:", e);
    }
  }

  // In-memory fallback
  let map: Map<string, Counter>;
  if (namespace === "msg") map = memIpMsg;
  else if (namespace === "interview") map = memIpInterview;
  else map = memIpCv;

  const c = map.get(key);
  if (!c || c.day !== d) {
    map.set(key, { day: d, n: 1 });
    return;
  }
  if (c.n >= limit) throw new Error("RATE_LIMIT");
  c.n += 1;
}

export async function checkIpMessage(ip: string) {
  await bumpKv("msg", ip, PER_IP_MSG);
}

export async function checkIpInterview(ip: string) {
  await bumpKv("interview", ip, PER_IP_INTERVIEW);
}

export async function checkIpCv(ip: string) {
  await bumpKv("cv", ip, PER_IP_CV);
}

export async function checkGlobalBudget(estimate: number) {
  const kv = getKv();
  const d = today();
  const fullKey = `rl:global:${d}`;

  if (kv) {
    try {
      const val = await kv.get(fullKey);
      const n = val ? parseInt(val, 10) : 0;
      if (n + estimate > DAILY_LIMIT) throw new Error("DAILY_TOKEN_LIMIT_REACHED");
      return;
    } catch (e) {
      if ((e as Error).message === "DAILY_TOKEN_LIMIT_REACHED") throw e;
      if (process.env.NODE_ENV === "production") throw e;
    }
  }

  // Memory fallback
  if (memGlobal.day !== d) {
    memGlobal.day = d;
    memGlobal.n = 0;
  }
  if (memGlobal.n + estimate > DAILY_LIMIT) throw new Error("DAILY_TOKEN_LIMIT_REACHED");
}

export async function recordTokens(used: number) {
  const kv = getKv();
  const d = today();
  const fullKey = `rl:global:${d}`;

  if (kv) {
    try {
      const val = await kv.get(fullKey);
      const n = val ? parseInt(val, 10) : 0;
      await kv.put(fullKey, (n + used).toString(), { expirationTtl: 86400 });
      return;
    } catch (e) {
      if (process.env.NODE_ENV === "production") throw e;
      console.warn("KV recordTokens failed, falling back to memory:", e);
    }
  }

  // Memory fallback
  if (memGlobal.day !== d) {
    memGlobal.day = d;
    memGlobal.n = 0;
  }
  memGlobal.n += used;
}
