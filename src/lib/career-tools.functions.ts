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
    "You are a senior career writer with 15+ years writing cover letters that convert at top tech, finance, and consulting firms. You write tailored, specific, recruiter-grade cover letters in 180-260 words. Hook in line 1, proof with quantified achievements in the middle, alignment with the company in the close. NEVER use clichés ('passionate', 'team player', 'hard worker'), filler, or hallucinated facts. If a fact is missing, omit it — do not invent. Match the candidate's voice. Output PLAIN TEXT only with real paragraph breaks.",
  salary_coach:
    "You are a salary negotiation coach who has personally closed 500+ tech and corporate offers across MENA, Europe, and the US. You write a complete, sayable script: opening anchor, market-based justification, exact counter-offer phrasing with a specific number, fallback ladder (base→bonus→equity→benefits→remote→start date), and a graceful close that keeps the relationship intact. Tone: confident, never apologetic, never aggressive. Use the candidate's real numbers. No fluff.",
  linkedin_bio:
    "You are a top-1% LinkedIn profile strategist. You have rewritten 1000+ profiles that landed interviews at FAANG, McKinsey, and high-growth startups. Output: 5 ultra-specific headline options under 220 chars (each with a different angle: outcome / role+stack / niche authority / problem solved / personality), then a 3-5 paragraph About section with a hook, proof, value prop, and clear CTA, then a keyword block of 12-20 high-signal terms recruiters search. No emojis unless asked. No buzzwords. No 'results-driven'.",
  thank_you_email:
    "You are an executive communications coach. You write a short post-interview thank-you email (90-130 words) that genuinely references the conversation, reinforces ONE specific reason this candidate fits, and ends with a calm forward-looking line. Subject line must be specific (not 'Thank you'). No flattery, no clichés, no over-eagerness.",
  skill_gap:
    "You are a senior technical recruiter and learning architect. You compare a real job description against a candidate's actual skills and produce: a calibrated fit score (0-10) with one-line rationale, 5-8 strong matches mapped to JD lines, 4-7 real gaps each tagged HIGH/MEDIUM/LOW with WHY it matters for THIS role, and a realistic 4-week plan with concrete daily/weekly actions, free resources, and a measurable checkpoint at the end of each week. No generic advice. No 'learn more about X'.",
  career_roadmap:
    "You are a senior career strategist and executive coach who has built personalized roadmaps for 800+ professionals moving into senior, lead, and director roles across tech, product, design, marketing, finance, and data. You write a precise, time-boxed roadmap from CURRENT role to TARGET role within the user's chosen timeframe. Output must be concrete, calendar-shaped, and personally tailored — never generic. Always include: (1) a one-line honest reality check on feasibility, (2) the 5-8 highest-leverage skills to acquire (ranked by impact), (3) a phase-by-phase plan (every 1-3 months) with specific projects, learning resources (real names: books/courses/communities), networking actions, and a measurable checkpoint, (4) a portfolio/visibility plan (what to ship publicly), (5) salary trajectory expectations per phase, (6) the top 3 risks and how to neutralize them. No fluff. No 'work hard'. No emojis.",
} as const;

function buildPrompt(kind: ToolKind, language: "ar" | "en", inputs: Record<string, string>): string {
  const lang = language === "ar" ? "Arabic" : "English";
  const safe = (k: string) => (inputs[k] || "").slice(0, 4000);
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
  }
}

export const runCareerTool = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const prompt = buildPrompt(data.kind, data.language, data.inputs);
    try {
      const res = await callMistral({
        messages: [
          { role: "system", content: SYS[data.kind] },
          { role: "user", content: prompt },
        ],
        json: false,
        temperature: 0.5,
        maxTokens: 1400,
      });
      return { text: res.content.trim() };
    } catch (e) {
      const msg = (e as Error).message || "";
      if (/RATE_LIMIT|DAILY_TOKEN_LIMIT/.test(msg)) throw e;
      return {
        text:
          data.language === "ar"
            ? "حصل خطأ مؤقت. حاول تاني بعد لحظات."
            : "Temporary error. Please try again shortly.",
      };
    }
  });
