import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { callJson, getIp } from "./mistral.server";
import { checkIpTool } from "./rate-limit.server";

const proofTailorSchema = z.object({
  language: z.enum(["ar", "en"]).default("ar"),
  masterCv: z.string().min(50).max(12000),
  jobDescription: z.string().min(50).max(8000),
  targetRole: z.string().min(2).max(120),
});

export type ProofTailorResult = {
  fitScore: number;
  shouldApply: "yes" | "maybe" | "no";
  truthTable: Array<{
    requirement: string;
    evidenceFound: boolean;
    evidenceFromCv: string;
    evidenceStrength: number;
    gap: string;
    recommendation: string;
  }>;
  missingProof: string[];
  safeKeywords: string[];
  riskyKeywords: string[];
  rewrittenBullets: string[];
  tailoredSummary: string;
  finalWarning: string;
};

export const runProofTailor = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => proofTailorSchema.parse(d))
  .handler(async ({ data }) => {
    // Dedicated counter: this tool runs 3 AI calls, so it must not share the
    // CV counter with other tools (C2).
    const ip = getIp(getRequest().headers);
    await checkIpTool("proof_tailor", ip);

    // Stage 1: Extract Requirements
    const reqPrompt = `
Extract the most important job requirements from this job description.

JOB DESCRIPTION:
"""
${data.jobDescription}
"""

Return JSON only:
{
  "requirements": [
    {
      "id": "REQ-1",
      "requirement": "",
      "category": "hard_skill|soft_skill|experience|tool|domain|education",
      "importance": "must_have|nice_to_have",
      "keywords": []
    }
  ]
}

Rules:
- Extract 8-12 requirements.
- Separate must-have from nice-to-have.
- Do not duplicate similar requirements.
- Keep requirements recruiter-realistic.
`;

    const reqResult = await callJson<{ requirements: any[] }>(
      {
        messages: [{ role: "user", content: reqPrompt }],
        maxTokens: 1200,
        temperature: 0.2,
        model: "mistral-small-latest",
      },
      () => ({ requirements: [] })
    );

    // Stage 2: Extract Evidence
    const evPrompt = `
Extract real evidence from this candidate CV.

CV:
"""
${data.masterCv}
"""

Return JSON only:
{
  "evidence": [
    {
      "text": "",
      "category": "",
      "measurable": true,
      "tools": [],
      "senioritySignal": ""
    }
  ]
}

Rules:
- Only extract evidence explicitly present in the CV.
- Do not infer missing tools or achievements.
- If a bullet is vague, keep it vague.
- Identify measurable achievements when numbers/results exist.
`;

    const evResult = await callJson<{ evidence: any[] }>(
      {
        messages: [{ role: "user", content: evPrompt }],
        maxTokens: 1500,
        temperature: 0.2,
        model: "mistral-small-latest",
      },
      () => ({ evidence: [] })
    );

    // Stage 3 & 4: Truth Table and Rewrite
    const prompt = `
You are a strict resume evidence auditor and rewrite engine.
Language: ${data.language}
Target role: ${data.targetRole}

Requirements:
${JSON.stringify(reqResult.requirements)}

Candidate Evidence:
${JSON.stringify(evResult.evidence)}

Original CV:
"""
${data.masterCv}
"""

Return JSON only:
{
  "fitScore": 0,
  "shouldApply": "yes|maybe|no",
  "truthTable": [
    {
      "requirement": "",
      "evidenceFound": true,
      "evidenceFromCv": "",
      "evidenceStrength": 0,
      "gap": "",
      "recommendation": ""
    }
  ],
  "missingProof": [],
  "safeKeywords": [],
  "riskyKeywords": [],
  "rewrittenBullets": [],
  "tailoredSummary": "",
  "finalWarning": ""
}

Rules:
- fitScore is 0-100.
- evidenceStrength is 0-10.
- truthTable must include the 8-12 most important job requirements.
- evidenceFromCv must quote or summarize only real evidence from the CV.
- If evidence does not exist, say evidenceFound false.
- Never invent experience, tools, years, metrics, certifications, or employers.
- safeKeywords are keywords supported by real CV evidence.
- riskyKeywords are keywords from the JD that the candidate should NOT claim yet.
- rewrittenBullets must only rewrite real experience from the CV (do not add tools not present). Make them sharper.
- If language is Arabic, write Arabic but keep technical tools/job titles in English when needed.
`;

    return callJson<ProofTailorResult>(
      {
        messages: [
          {
            role: "system",
            content:
              "You are a strict senior recruiter, ATS auditor, and resume evidence verifier. Never hallucinate. Return valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        maxTokens: 3500,
        temperature: 0.25,
        model: "mistral-medium-latest"
      },
      () => ({
        fitScore: 0,
        shouldApply: "maybe",
        truthTable: [],
        missingProof: [],
        safeKeywords: [],
        riskyKeywords: [],
        rewrittenBullets: [],
        tailoredSummary: "",
        finalWarning:
          data.language === "ar"
            ? "تعذر التحليل الكامل. حاول مرة أخرى."
            : "Could not complete the full analysis. Please try again.",
      }),
    );
  });
