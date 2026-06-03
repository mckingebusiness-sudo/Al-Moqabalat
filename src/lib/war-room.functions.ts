import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { callJson, getIp } from "./mistral.server";
import { checkIpTool } from "./rate-limit.server";

const analyzeAppSchema = z.object({
  masterCv: z.string().min(10),
  jobDescription: z.string().min(10),
  language: z.enum(["ar", "en"]).default("ar"),
});

export const analyzeApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => analyzeAppSchema.parse(d))
  .handler(async ({ data }) => {
    // Rate limit: protect this AI endpoint from abuse / cost attacks (C1).
    const req = getRequest();
    if (req) {
      await checkIpTool("war_room", getIp(req.headers));
    }

    const prompt = `You are an expert tech recruiter and interview coach.
Analyze the following Job Description against the candidate's Master CV.

User CV:
${data.masterCv}

Job Description:
${data.jobDescription}

Language: ${data.language === "ar" ? "Arabic" : "English"}

Return a JSON object with this exact structure:
{
  "gaps": ["Gap 1", "Gap 2"],
  "questionsForRecruiter": ["Question 1", "Question 2"],
  "followUpEmailDraft": "A draft email..."
}
`;

    try {
      const result = await callJson<{
        gaps: string[];
        questionsForRecruiter: string[];
        followUpEmailDraft: string;
      }>(
        {
          messages: [{ role: "user", content: prompt }],
          model: "mistral-medium-latest",
          // Enough room for gaps + questions + a full follow-up email draft (F5).
          maxTokens: 2000
        },
        () => ({
          gaps: ["Could not analyze gaps."],
          questionsForRecruiter: ["What are the main challenges for this role?"],
          followUpEmailDraft: ""
        })
      );
      return result;
    } catch (error) {
      console.error("AI Error:", error);
      throw new Error("Failed to analyze application");
    }
  });
