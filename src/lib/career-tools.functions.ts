import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callMistral } from "./mistral.server";

export type ToolKind =
  | "cover_letter"
  | "salary_coach"
  | "linkedin_bio"
  | "thank_you_email"
  | "skill_gap";

const schema = z.object({
  kind: z.enum([
    "cover_letter",
    "salary_coach",
    "linkedin_bio",
    "thank_you_email",
    "skill_gap",
  ]),
  language: z.enum(["ar", "en"]).default("ar"),
  inputs: z.record(z.string(), z.string().max(4000)),
});

const SYS = {
  cover_letter:
    "You are a senior career writer. You produce powerful, tailored cover letters in 180-260 words. Use the candidate's real info. No clichés, no fluff, no hallucinations.",
  salary_coach:
    "You are a salary negotiation coach. You write a complete negotiation script the candidate can literally say, including: opening line, justification using market data style reasoning, counter-offer phrasing, and a graceful close.",
  linkedin_bio:
    "You are a LinkedIn branding expert. You write a compelling LinkedIn About section: 3-5 short paragraphs, hook + value + proof + call to action. Plus 5 short headline options under 220 chars.",
  thank_you_email:
    "You are a polite professional writer. You produce a short (90-130 words) thank-you email after an interview, referring to the conversation and reinforcing the candidate's fit.",
  skill_gap:
    "You are a hiring expert. You compare a job description against the candidate's skills and produce: a fit score (0-10), 5-8 strong matches, 4-7 real missing skills with severity (high/medium/low), and a 4-week practical learning plan.",
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
