import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callMistral } from "./mistral.server";

export type ToolKind =
  | "cover_letter"
  | "salary_coach"
  | "linkedin_bio"
  | "thank_you_email"
  | "skill_gap"
  | "career_roadmap";

const schema = z.object({
  kind: z.enum([
    "cover_letter",
    "salary_coach",
    "linkedin_bio",
    "thank_you_email",
    "skill_gap",
    "career_roadmap",
  ]),
  language: z.enum(["ar", "en"]).default("ar"),
  inputs: z.record(z.string(), z.string().max(4000)),
});

const SYS = {
  cover_letter:
    "You are the world's most-hired cover letter writer. You have placed candidates at Google, Stripe, McKinsey, Goldman Sachs, BCG, Meta, and unicorn startups. You write tailored, specific, recruiter-grade cover letters in 180-260 words. Structure: line 1 hook that names the company and a specific, concrete reason; middle paragraph(s) with QUANTIFIED proof (numbers, %, $, scale); close that ties candidate's strengths to one real thing about the company (product, value, recent move). Use the candidate's actual voice and only the facts they gave you. NEVER use clichés ('passionate', 'team player', 'hard worker', 'results-driven', 'dynamic'), filler, or hallucinated facts, names, or metrics. If a fact is missing, omit it — do not invent. Plain text only with real paragraph breaks. No markdown.",
  salary_coach:
    "You are the top salary negotiation coach in MENA, Europe, and the US, with 500+ closed offers ranging from $40k to $400k. You write a complete, sayable script the candidate can read out loud verbatim: (1) opening anchor that frames value, (2) market-based justification with a real benchmark range and the candidate's specific leverage, (3) exact counter-offer phrasing including a SPECIFIC number based on their target, (4) full fallback ladder (base→bonus→equity→signing bonus→benefits→remote days→start date→title), (5) graceful close that protects the relationship. Confident, never apologetic, never aggressive. Use the candidate's REAL numbers. No fluff. No emojis. Plain text.",
  linkedin_bio:
    "You are the top-1% LinkedIn profile strategist who has rewritten 1000+ profiles that landed interviews at FAANG, McKinsey, BCG, and high-growth startups. Output exactly: 5 ultra-specific HEADLINE options under 220 chars each (each with a different angle: outcome-driven / role+stack / niche authority / problem solved / personality-led), then a 3-5 paragraph ABOUT section (hook → proof with numbers → unique value prop → social proof or credentials → clear CTA), then a KEYWORDS block of 12-20 high-signal terms recruiters actually search. No emojis unless asked. No buzzwords. Never use 'results-driven', 'passionate', 'synergy'. Use the candidate's real achievements only. Plain text.",
  thank_you_email:
    "You are an executive communications coach who has written post-interview emails for partners at McKinsey, MDs at Goldman, and VPs at Google. Write a short post-interview thank-you email (90-130 words) that: references ONE specific moment from the conversation, reinforces ONE specific reason this candidate fits THIS role, and ends with a calm, forward-looking line. Subject line must be specific and concrete (NEVER 'Thank you' or 'Following up'). No flattery, no clichés, no over-eagerness, no emojis. Plain text only.",
  skill_gap:
    "You are a senior technical recruiter and learning architect who has hired 2000+ engineers, PMs, and analysts. Compare the real job description against the candidate's actual skills and produce: (1) a calibrated FIT SCORE 0-10 with one-line rationale (be honest, not flattering), (2) 5-8 STRONG MATCHES, each mapped to a specific JD requirement, (3) 4-7 real GAPS, each tagged HIGH/MEDIUM/LOW with a one-line WHY it matters for THIS role, (4) a realistic 4-WEEK PLAN with concrete daily/weekly actions, named real free resources (specific course names, docs, repos), and a measurable checkpoint at the end of each week, (5) TOP 3 ACTIONS THIS WEEK. No generic advice. No 'learn more about X'. Plain text.",
  career_roadmap:
    "You are a senior career strategist and executive coach who has built personalized roadmaps for 800+ professionals moving into senior, lead, director, and VP roles across tech, product, design, marketing, finance, and data. Build a precise, time-boxed roadmap from CURRENT role to TARGET role within the user's timeframe. Output must be concrete, calendar-shaped, and personally tailored — never generic. Include: (1) one-line honest REALITY CHECK on feasibility given timeframe + constraints, (2) 5-8 highest-leverage SKILLS ranked by impact, (3) phase-by-phase plan (every 1-3 months) with specific projects, REAL named learning resources (book titles, course names, communities), networking actions, and a measurable checkpoint, (4) PORTFOLIO/visibility plan (what to ship publicly), (5) SALARY trajectory expectations per phase with currency, (6) TOP 3 RISKS + mitigation, (7) FIRST 7 DAYS action list. No fluff. No 'work hard'. No emojis. Plain text.",
} as const;

function langHeader(language: "ar" | "en"): string {
  if (language === "ar") {
    return `اكتب الرد بالكامل باللغة العربية الفصحى المبسطة فقط. ممنوع أي كلمة إنجليزية إلا أسماء العلم (مثل أسماء الشركات أو الأدوات التقنية).
ممنوع تماماً استخدام أي رموز Markdown: لا نجوم (*) ولا (**) ولا شرطات سفلية (_) ولا علامات (#) ولا backticks. استخدم نص عادي مع فواصل أسطر فقط.
استخدم العناوين بالعربية بين علامتي === === كما هو موضح في الهيكل.`;
  }
  return `Write the entire response in clear English only.
Strictly forbidden: any Markdown symbols — no asterisks (*, **), no underscores (_), no hash (#) headings, no backticks. Plain text with line breaks only.
Use the === === section headers exactly as shown.`;
}

function buildPrompt(kind: ToolKind, language: "ar" | "en", inputs: Record<string, string>): string {
  const lang = language === "ar" ? "Arabic" : "English";
  const safe = (k: string) => (inputs[k] || "").slice(0, 4000);
  const header = langHeader(language);
  const body = (() => {
  switch (kind) {
    case "cover_letter":
      return `Write a tailored cover letter in ${lang}.
Candidate name: ${safe("name")}
Target job: ${safe("job")}
Target company: ${safe("company")}
Candidate background / CV summary: ${safe("background")}
Job description (optional): ${safe("jd")}
Return PLAIN TEXT only. No markdown. Use real paragraphs separated by blank lines.`;
    case "salary_coach":
      return `Write a complete salary negotiation script in ${lang}.
Job title: ${safe("job")}
Country / city: ${safe("location")}
Years of experience: ${safe("experience")}
Current salary (optional): ${safe("current")}
Offered salary: ${safe("offer")}
Target salary: ${safe("target")}
Return PLAIN TEXT with these sections:
1) Opening line
2) Justification (3-5 sentences using strengths + market context)
3) Counter-offer phrasing (exact words)
4) If they say no — fallback ask (benefits, bonus, remote days)
5) Graceful closing
No markdown.`;
    case "linkedin_bio":
      return `Write a LinkedIn profile rewrite in ${lang}.
Name: ${safe("name")}
Current role / target role: ${safe("role")}
Top skills: ${safe("skills")}
Achievements: ${safe("achievements")}
Years of experience: ${safe("experience")}
Return PLAIN TEXT with:
=== HEADLINES (5 options, each under 220 chars) ===
=== ABOUT SECTION (3-5 short paragraphs) ===
=== KEYWORDS TO ADD ===
No markdown symbols.`;
    case "thank_you_email":
      return `Write a thank-you email after a job interview in ${lang}.
Candidate name: ${safe("name")}
Interviewer name: ${safe("interviewer")}
Company: ${safe("company")}
Job: ${safe("job")}
Topics discussed: ${safe("topics")}
Reason candidate is great fit (1 line): ${safe("fit")}
Return PLAIN TEXT email with:
Subject: ...
Body: greeting + 2-3 short paragraphs + sign off
90-130 words. No markdown.`;
    case "skill_gap":
      return `Analyze skill gap in ${lang}.
Target job description: ${safe("jd")}
Candidate's current skills / experience: ${safe("skills")}
Return PLAIN TEXT with these sections:
=== FIT SCORE (0-10) ===
=== STRONG MATCHES ===
- skill 1
- ...
=== MISSING / WEAK SKILLS ===
- skill — severity (HIGH/MEDIUM/LOW) — why it matters
=== 4-WEEK LEARNING PLAN ===
Week 1: ...
Week 2: ...
Week 3: ...
Week 4: ...
=== TOP 3 ACTIONS THIS WEEK ===
No markdown.`;
    case "career_roadmap":
      return `Build a personalized career roadmap in ${lang}.
Candidate name: ${safe("name")}
Current role / level: ${safe("current_role")}
Target role / level: ${safe("target_role")}
Industry / domain: ${safe("industry")}
Years of experience: ${safe("experience")}
Timeframe to reach the target: ${safe("timeframe")}
Current top skills: ${safe("skills")}
Constraints (location, hours, budget, family, etc.): ${safe("constraints")}
Return PLAIN TEXT with these sections (no markdown):
=== REALITY CHECK (1-2 sentences) ===
=== TOP SKILLS TO ACQUIRE (ranked) ===
=== PHASE 1 — Months X-Y (title) ===
- focus
- 2-3 concrete projects
- learning resources (real names)
- networking actions
- checkpoint
=== PHASE 2 — Months X-Y (title) ===
...
=== PHASE 3 — Months X-Y (title) ===
...
=== PORTFOLIO / VISIBILITY PLAN ===
=== SALARY TRAJECTORY (per phase, with currency) ===
=== TOP 3 RISKS + MITIGATION ===
=== FIRST 7 DAYS — DO THIS NOW ===`;
    }
  })();
  return header + "\n\n" + body;
}

export const runCareerTool = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const prompt = buildPrompt(data.kind, data.language, data.inputs);
    const maxTokens =
      data.kind === "career_roadmap" || data.kind === "skill_gap" || data.kind === "linkedin_bio"
        ? 2200
        : 1600;
    const langGuard =
      data.language === "ar"
        ? "CRITICAL: The user's chosen output language is Arabic (العربية). The ENTIRE response MUST be in Arabic only. Do not output any English text. Do not use any Markdown formatting (no *, **, _, #, backticks). Plain text with line breaks and === === headers only."
        : "CRITICAL: The output language is English. No Markdown (no *, **, _, #, backticks). Plain text only with === === headers.";
    try {
      const res = await callMistral({
        messages: [
          { role: "system", content: SYS[data.kind] + "\n\n" + langGuard },
          { role: "user", content: prompt },
        ],
        json: false,
        temperature: 0.45,
        maxTokens,
      });
      // Strip any leftover markdown the model might emit despite instructions.
      const cleaned = res.content
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/(^|\s)\*(?!\s)([^*\n]+?)\*(?=\s|$)/g, "$1$2")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")
        .replace(/^\s*[-•]\s*/gm, "• ")
        .trim();
      return { text: cleaned };
    } catch (e) {
      const msg = (e as Error).message || "";
      console.error("[runCareerTool]", data.kind, msg);
      // Surface real errors so the UI can show a proper toast via handleServerError.
      throw e;
    }
  });
