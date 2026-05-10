import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { callJson, getIp } from "./mistral.server";
import type { CandidateProfile, Evaluation, FinalReport, InterviewQuestion } from "./types";

const MAX_CV = Number(process.env.MAX_CV_CHARS || 12000);
const MAX_ANS = Number(process.env.MAX_ANSWER_CHARS || 1200);
const MAX_JD = Number(process.env.MAX_JOB_DESCRIPTION_CHARS || 3000);

const appCtxSchema = z.object({
  candidateName: z.string().max(100).optional(),
  experienceLevel: z.string().max(40).optional(),
  education: z.string().max(500).optional(),
  mainSkills: z.string().max(500).optional(),
  targetJob: z.string().min(1).max(120),
  targetCompany: z.string().max(120).optional(),
  companyType: z.string().max(120).optional(),
  jobDescription: z.string().max(MAX_JD).optional(),
  motivation: z.string().max(500).optional(),
});

const startSchema = z.object({
  applicationContext: appCtxSchema,
  cvText: z.string().max(MAX_CV).optional(),
  language: z.enum(["ar", "en", "mixed"]),
  interviewType: z.enum([
    "friendly_hr",
    "strict_hr",
    "technical",
    "behavioral",
    "fresh_graduate",
    "career_change",
  ]),
  totalQuestions: z.union([z.literal(5), z.literal(8), z.literal(10)]).optional().default(8),
});

const SYS_INTERVIEWER =
  "You are a SENIOR HR Director and hiring expert with 15+ years of experience interviewing candidates for ALL kinds of jobs — manual jobs (cleaner, cashier, driver, technician, waiter, security guard, delivery), service jobs (nurse, teacher, receptionist), and professional jobs (accountant, marketer, engineer, developer, data analyst). You ask SHARP, REALISTIC, JOB-SPECIFIC interview questions that real employers actually ask in the candidate's exact field. You probe weaknesses, demand concrete examples, push for measurable results, and never accept vague answers. You are bilingual (Arabic/English) and culturally aware of the MENA job market. You are honest, direct, supportive, and practical. ALWAYS return valid JSON only when asked.";

const SYS_CV_EXPERT =
  "You are a world-class CV / resume writer and ATS expert. You have reviewed 50,000+ CVs and know exactly what recruiters and ATS scanners look for. You spot weak verbs, vague achievements, missing metrics, formatting issues, ATS-killer mistakes, missing keywords, and grammar problems instantly. You rewrite CVs to sound professional WITHOUT inventing fake experience. You give honest, specific, actionable feedback. ALWAYS return valid JSON only when asked.";

const SYS_BASE = SYS_INTERVIEWER;

function langText(language: "ar" | "en" | "mixed", ar: string, en: string) {
  return language === "en" ? en : ar;
}

function fallbackProfile(ctx: z.infer<typeof appCtxSchema>): CandidateProfile {
  const skills = ctx.mainSkills?.split(/[,،\n]/).map((s) => s.trim()).filter(Boolean).slice(0, 5) ?? [];
  return {
    candidateName: ctx.candidateName || "",
    estimatedLevel: ctx.experienceLevel || "",
    targetJob: ctx.targetJob,
    candidateSummary: `${ctx.candidateName || "Candidate"} is preparing for ${ctx.targetJob}.`,
    strengthsForThisJob: skills.length ? skills : ["Motivation", "Learning ability"],
    weaknessesForThisJob: ["Needs more interview practice"],
    interviewFocus: ["Job fit", "Practical examples", "Communication"],
    suggestedQuestionTopics: ["Experience", "Motivation", "Problem solving", "Teamwork"],
    jobFitScore: 6,
  };
}

function fallbackQuestion(data: { language: "ar" | "en" | "mixed"; applicationContext: { targetJob: string } }): InterviewQuestion {
  const job = data.applicationContext.targetJob;
  return {
    question: langText(
      data.language,
      `احكي لي عن موقف عملي يثبت إنك مناسب لوظيفة ${job}؟`,
      `Tell me about a practical situation that shows you are a good fit for the ${job} role?`,
    ),
    questionType: "practical",
    whyThisQuestion: langText(data.language, "لقياس خبرتك العملية وطريقة تفكيرك.", "To assess your practical experience and thinking."),
    expectedGoodAnswerPoints: ["Clear example", "Specific action", "Result", "Lesson learned"],
  };
}

function fallbackEvaluation(data: { language: "ar" | "en" | "mixed" }): Evaluation {
  return {
    score: 6,
    shortFeedback: langText(data.language, "إجابتك مقبولة، لكنها محتاجة مثال أوضح ونتيجة محددة.", "Your answer is acceptable, but it needs a clearer example and specific result."),
    strengths: [langText(data.language, "أجبت على السؤال مباشرة", "You answered the question directly")],
    weaknesses: [langText(data.language, "ينقصها تفاصيل قابلة للقياس", "It lacks measurable details")],
    improvedAnswer: langText(data.language, "أفضل إجابة تكون: الموقف، دورك، التصرف الذي قمت به، والنتيجة التي تحققت.", "A stronger answer should include: situation, your role, the action you took, and the result achieved."),
    practicalAdvice: langText(data.language, "استخدم طريقة STAR واكتب مثالًا حقيقيًا مختصرًا.", "Use the STAR method and give a concise real example."),
    nextTip: langText(data.language, "في السؤال القادم ركّز على أرقام أو نتائج واضحة.", "In the next question, focus on clear numbers or outcomes."),
  };
}

function fallbackReport(data: { language: "ar" | "en" | "mixed"; evaluations: Array<{ score?: number }> }): FinalReport {
  const avg = data.evaluations.length
    ? data.evaluations.reduce((sum, e) => sum + Number(e?.score || 0), 0) / data.evaluations.length
    : 6;
  return {
    overallScore: Math.round(avg * 10) / 10,
    verdict: langText(data.language, "أداء جيد كبداية ويحتاج أمثلة عملية أقوى.", "Good starting performance; stronger practical examples are needed."),
    topStrengths: [langText(data.language, "الاستمرارية في الإجابة", "Consistency in answering")],
    topWeaknesses: [langText(data.language, "قلة التفاصيل والنتائج المحددة", "Limited detail and specific outcomes")],
    mostImportantImprovements: [langText(data.language, "استخدم أمثلة واقعية بطريقة STAR", "Use real examples with the STAR method")],
    recommendedPracticePlan: [langText(data.language, "تدرّب يوميًا على 3 أسئلة مرتبطة بالوظيفة", "Practice 3 job-related questions daily")],
    bestAnswerTemplate: langText(data.language, "الموقف: ... دوري: ... تصرفي: ... النتيجة: ...", "Situation: ... My role: ... Action: ... Result: ..."),
    cvImprovementTips: [langText(data.language, "اربط مهاراتك بمتطلبات الوظيفة", "Connect your skills to the job requirements")],
    nextInterviewTips: [langText(data.language, "جاوب بهدوء وبأمثلة قصيرة ومحددة", "Answer calmly with short, specific examples")],
  };
}

function objectToText(obj: Record<string, unknown>): string {
  // Common shapes: {step, description}, {title, description}, {day, task}, {name, value}
  const preferredOrder = ["step", "title", "day", "name", "label", "header", "task", "action", "description", "details", "tip", "value", "text", "content"];
  const entries = Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== "");
  entries.sort(([a], [b]) => {
    const ai = preferredOrder.indexOf(a);
    const bi = preferredOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
  // If only one meaningful field, just return it.
  if (entries.length === 1) return String(entries[0][1]).trim();
  // Combine: "Title — Description" / "Step 1: ..."
  const values = entries.map(([, v]) => (typeof v === "string" ? v : JSON.stringify(v))).filter(Boolean);
  return values.join(" — ").trim();
}

function stringifyItem(item: unknown): string {
  if (item == null) return "";
  if (typeof item === "string") return item.trim();
  if (typeof item === "number" || typeof item === "boolean") return String(item);
  if (Array.isArray(item)) return item.map(stringifyItem).filter(Boolean).join(", ");
  if (typeof item === "object") return objectToText(item as Record<string, unknown>);
  return "";
}

function asList(value: unknown, fallback: string[] = []): string[] {
  if (Array.isArray(value)) {
    const out = value.map(stringifyItem).filter(Boolean).slice(0, 8);
    return out.length ? out : fallback;
  }
  if (value && typeof value === "object") {
    const out = stringifyItem(value);
    return out ? [out] : fallback;
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return fallback;
}

function asText(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value.trim() || fallback;
  if (value == null) return fallback;
  if (typeof value === "object") return stringifyItem(value) || fallback;
  return String(value);
}

function asScore(value: unknown, fallback = 6): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(10, Math.round(n * 10) / 10)) : fallback;
}

export const startInterview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => startSchema.parse(d))
  .handler(async ({ data }) => {
    const ip = getIp(getRequest().headers);
    try {
      // rate limiting disabled
    } catch {
      throw new Error("RATE_LIMIT");
    }

    // 1) Extract candidate profile
    const profilePrompt = `Extract a compact candidate profile for interview prep. Return JSON only.
Candidate basic info: ${JSON.stringify({
      name: data.applicationContext.candidateName,
      level: data.applicationContext.experienceLevel,
      education: data.applicationContext.education,
      skills: data.applicationContext.mainSkills,
    })}
Application context: ${JSON.stringify(data.applicationContext)}
CV text: ${data.cvText || "(none)"}
Return JSON: {"candidateName":"","estimatedLevel":"","targetJob":"","candidateSummary":"","strengthsForThisJob":[],"weaknessesForThisJob":[],"interviewFocus":[],"suggestedQuestionTopics":[],"jobFitScore":0}
Rules: Be concise. Do not invent fake experience. If CV is weak, use form data.`;

    const profileRaw = await callJson<CandidateProfile>({
      messages: [
        { role: "system", content: SYS_BASE },
        { role: "user", content: profilePrompt },
      ],
      maxTokens: 1500,
    }, () => fallbackProfile(data.applicationContext));
    const profileFallback = fallbackProfile(data.applicationContext);
    const profile: CandidateProfile = {
      ...profileFallback,
      ...profileRaw,
      strengthsForThisJob: asList(profileRaw.strengthsForThisJob, profileFallback.strengthsForThisJob ?? []),
      weaknessesForThisJob: asList(profileRaw.weaknessesForThisJob, profileFallback.weaknessesForThisJob ?? []),
      interviewFocus: asList(profileRaw.interviewFocus, profileFallback.interviewFocus ?? []),
      suggestedQuestionTopics: asList(profileRaw.suggestedQuestionTopics, profileFallback.suggestedQuestionTopics ?? []),
      jobFitScore: asScore(profileRaw.jobFitScore, profileFallback.jobFitScore),
    };

    // 2) First question
    const firstQ = await generateQuestion({
      data: {
        language: data.language,
        interviewType: data.interviewType,
        applicationContext: data.applicationContext,
        candidateProfile: profile,
        currentQuestionNumber: 1,
        totalQuestions: data.totalQuestions,
        previousSummary: "",
      },
    });

    return { profile, firstQuestion: firstQ };
  });

const questionSchema = z.object({
  language: z.enum(["ar", "en", "mixed"]),
  interviewType: z.string(),
  applicationContext: appCtxSchema,
  candidateProfile: z.any(),
  currentQuestionNumber: z.number().int().min(1).max(20),
  totalQuestions: z.number().int().min(1).max(20),
  previousSummary: z.string().max(2000).optional().default(""),
  previousQuestions: z.array(z.string().max(500)).max(20).optional().default([]),
});

export const generateQuestion = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => questionSchema.parse(d))
  .handler(async ({ data }) => {
    const ip = getIp(getRequest().headers);
    // rate limiting disabled
    const topicGuide = [
      "introduce yourself & WHY this exact role at this exact company (test motivation depth)",
      "deepest concrete past experience example tied DIRECTLY to a core duty of the target job (demand numbers/results)",
      "a real conflict, mistake, or failure — what happened, what you did, what you learned (push for honesty)",
      "a hard technical / practical skill the job requires — test depth, ask a mini scenario or how-would-you-handle question",
      "handling a difficult customer, manager, deadline, or pressure situation",
      "tradeoffs / decision-making question specific to the role (priorities under limited time/resources)",
      "weaknesses, gaps, or risks you'd bring — and how you'd manage them",
      "growth, salary expectation, why we should hire YOU over other candidates, and your questions for us",
    ];
    const focusTopic = topicGuide[(data.currentQuestionNumber - 1) % topicGuide.length];
    const prevList = (data.previousQuestions || []).map((q, i) => `${i + 1}. ${q}`).join("\n") || "(none)";
    const prompt = `You are conducting a REAL job interview. Question ${data.currentQuestionNumber} of ${data.totalQuestions}.
Language: ${data.language}
Interview type/style: ${data.interviewType}
Application context: ${JSON.stringify(data.applicationContext)}
Candidate profile (from their CV/info): ${JSON.stringify(data.candidateProfile)}
Previous summary: ${data.previousSummary}

PREVIOUSLY ASKED (do NOT repeat, rephrase, or ask anything similar):
${prevList}

This question MUST focus on a NEW theme: "${focusTopic}".

Return JSON only: {"question":"","questionType":"hr|practical|technical|behavioral|company_fit","whyThisQuestion":"","expectedGoodAnswerPoints":[]}

CRITICAL RULES:
- Make the question REALISTIC and SPECIFIC to the EXACT target job. Not generic.
- Use real things from the candidate's CV / context (a specific skill, project, gap, company, or duty they mentioned). Reference them by name when possible.
- For technical/professional jobs: ask a mini scenario or "how would you do X" — test depth, not memorization.
- For manual / service jobs: ask about a real on-the-job situation (a difficult customer, a busy shift, a missing inventory, etc.).
- Push the candidate. A good interviewer's question makes the candidate think 3 seconds before answering.
- ONE clear question. 1-3 sentences max. Natural conversational tone in the chosen language.
- expectedGoodAnswerPoints: 3-5 specific things a great answer should contain.
- Never repeat or rephrase any previous question.`;
    const q = await callJson<InterviewQuestion>({
      messages: [
        { role: "system", content: SYS_BASE },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      maxTokens: 800,
    }, () => fallbackQuestion(data));
    const fallback = fallbackQuestion(data);
    return {
      question: asText(q.question, fallback.question),
      questionType: asText(q.questionType, fallback.questionType),
      whyThisQuestion: asText(q.whyThisQuestion, fallback.whyThisQuestion),
      expectedGoodAnswerPoints: asList(q.expectedGoodAnswerPoints, fallback.expectedGoodAnswerPoints),
    };
  });

const evalSchema = z.object({
  language: z.enum(["ar", "en", "mixed"]),
  applicationContext: appCtxSchema,
  candidateProfile: z.any(),
  question: z.string().max(2000),
  answer: z.string().min(1).max(MAX_ANS),
});

export const evaluateAnswer = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => evalSchema.parse(d))
  .handler(async ({ data }) => {
    const ip = getIp(getRequest().headers);
    // rate limiting disabled
    const prompt = `Evaluate this candidate answer for the EXACT job/company context. Return JSON only.
Language: ${data.language}
Application context: ${JSON.stringify(data.applicationContext)}
Candidate profile: ${JSON.stringify(data.candidateProfile)}
Question: ${data.question}
Candidate answer: ${data.answer}
Return JSON: {"score":0,"shortFeedback":"","strengths":[],"weaknesses":[],"improvedAnswer":"","practicalAdvice":"","nextTip":""}
Rules:
- Score 0-10. Be honest but supportive.
- For simple jobs value honesty, responsibility, punctuality, customer handling. For professional jobs also value technical accuracy.
- Use simple natural language in the chosen Language.
- "improvedAnswer" MUST be a fully written answer in 3–6 real sentences the candidate could literally say. Use the candidate's actual context (target job, skills, situation). DO NOT use placeholders like "...", "[...]", "Situation: ...", "Action: ...", or empty templates. Write concrete sentences with real content.
- "strengths", "weaknesses": each item MUST be a plain short string sentence, NOT an object.
- All array items MUST be plain strings.`;
    const ev = await callJson<Evaluation>({
      messages: [
        { role: "system", content: SYS_BASE },
        { role: "user", content: prompt },
      ],
      maxTokens: 1500,
    }, () => fallbackEvaluation(data));
    const fallback = fallbackEvaluation(data);
    return {
      score: asScore(ev.score, fallback.score),
      shortFeedback: asText(ev.shortFeedback, fallback.shortFeedback),
      strengths: asList(ev.strengths, fallback.strengths),
      weaknesses: asList(ev.weaknesses, fallback.weaknesses),
      improvedAnswer: asText(ev.improvedAnswer, fallback.improvedAnswer),
      practicalAdvice: asText(ev.practicalAdvice, fallback.practicalAdvice),
      nextTip: asText(ev.nextTip, fallback.nextTip),
    };
  });

const reportSchema = z.object({
  language: z.enum(["ar", "en", "mixed"]),
  applicationContext: appCtxSchema,
  candidateProfile: z.any(),
  evaluations: z.array(z.any()).max(20),
});

export const finalReport = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => reportSchema.parse(d))
  .handler(async ({ data }) => {
    const ip = getIp(getRequest().headers);
    // rate limiting disabled
    const prompt = `Create a final interview report. Return JSON only.
Language: ${data.language}
Application context: ${JSON.stringify(data.applicationContext)}
Candidate profile: ${JSON.stringify(data.candidateProfile)}
Interview evaluations: ${JSON.stringify(data.evaluations)}
Return JSON: {"overallScore":0,"verdict":"","topStrengths":[],"topWeaknesses":[],"mostImportantImprovements":[],"recommendedPracticePlan":[],"bestAnswerTemplate":"","cvImprovementTips":[],"nextInterviewTips":[]}
Rules:
- Write everything in the chosen Language.
- Every array item MUST be a plain short sentence (string), NOT an object. For example, recommendedPracticePlan must be ["Practice 3 STAR examples daily for 10 minutes", ...] not [{"step":1,"description":"..."}].
- "bestAnswerTemplate" MUST be a fully written real example answer (4–7 sentences) the candidate can literally say. DO NOT use placeholders like "...", "[name]", "Situation: ...". Write concrete sentences using the candidate's job, skills, and context.
- Be concise, practical, and specific.`;
    const report = await callJson<FinalReport>({
      messages: [
        { role: "system", content: SYS_BASE },
        { role: "user", content: prompt },
      ],
      maxTokens: 2000,
    }, () => fallbackReport(data));
    const fallback = fallbackReport(data);
    return {
      overallScore: asScore(report.overallScore, fallback.overallScore),
      verdict: asText(report.verdict, fallback.verdict),
      topStrengths: asList(report.topStrengths, fallback.topStrengths),
      topWeaknesses: asList(report.topWeaknesses, fallback.topWeaknesses),
      mostImportantImprovements: asList(report.mostImportantImprovements, fallback.mostImportantImprovements),
      recommendedPracticePlan: asList(report.recommendedPracticePlan, fallback.recommendedPracticePlan),
      bestAnswerTemplate: asText(report.bestAnswerTemplate, fallback.bestAnswerTemplate),
      cvImprovementTips: asList(report.cvImprovementTips, fallback.cvImprovementTips),
      nextInterviewTips: asList(report.nextInterviewTips, fallback.nextInterviewTips),
    };
  });

const cvSchema = z.object({
  cvData: z.any(),
  language: z.enum(["ar", "en"]),
  targetJob: z.string().max(120).optional(),
  targetCompany: z.string().max(120).optional(),
});

export const improveCv = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => cvSchema.parse(d))
  .handler(async ({ data }) => {
    const ip = getIp(getRequest().headers);
    try {
      // rate limiting disabled
    } catch {
      throw new Error("RATE_LIMIT");
    }
    const prompt = `Improve this CV without inventing fake experience. Return JSON only.
Language: ${data.language}
Optional target job: ${data.targetJob || ""}
Optional target company: ${data.targetCompany || ""}
CV data: ${JSON.stringify(data.cvData).slice(0, 8000)}
Return JSON: {"professionalSummary":"","improvedExperience":[{"title":"","company":"","description":""}],"improvedSkills":[],"atsKeywords":[],"missingSections":[],"finalTips":[]}
Rules: Do not invent. Make weak experience sound professional without lying. Concise. Tailor wording to target job if provided.`;
    return callJson<{
      professionalSummary: string;
      improvedExperience: Array<{ title: string; company: string; description: string }>;
      improvedSkills: string[];
      atsKeywords: string[];
      missingSections: string[];
      finalTips: string[];
    }>({
      messages: [
        { role: "system", content: SYS_CV_EXPERT },
        { role: "user", content: prompt },
      ],
      maxTokens: 2000,
    }, () => ({
      professionalSummary: "",
      improvedExperience: [],
      improvedSkills: [],
      atsKeywords: [],
      missingSections: [],
      finalTips: [data.language === "ar" ? "جرّب مرة أخرى بعد قليل." : "Please try again shortly."],
    }));
  });
