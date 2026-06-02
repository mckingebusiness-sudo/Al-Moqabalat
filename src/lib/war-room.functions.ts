import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callJson } from "./mistral.server";

const analyzeAppSchema = z.object({
  masterCv: z.string().min(10),
  jobDescription: z.string().min(10),
  language: z.enum(["ar", "en"]).default("ar"),
});

export const analyzeApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => analyzeAppSchema.parse(d))
  .handler(async ({ data }) => {
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
          model: "mistral-medium-latest"
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
