import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { callJson, getIp } from "./mistral.server";
import { checkIpTool } from "./rate-limit.server";

const networkingSniperSchema = z.object({
  masterCv: z.string().min(10).optional(),
  targetName: z.string().min(2),
  targetTitle: z.string().min(2),
  company: z.string().min(2),
  goal: z.string().min(5),
  tone: z.enum(["professional", "casual", "bold"]).default("professional"),
  language: z.enum(["ar", "en"]).default("ar"),
});

export const runNetworkingSniper = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => networkingSniperSchema.parse(d))
  .handler(async ({ data }) => {
    // Rate limit: protect this AI endpoint from abuse / cost attacks (C1).
    const req = getRequest();
    if (req) {
      await checkIpTool("networking", getIp(req.headers));
    }

    const prompt = `You are an expert career coach and networking strategist.
The user wants to reach out to a professional on LinkedIn or via Email.
Draft highly effective, non-spammy outreach messages.

Target Info:
- Name: ${data.targetName}
- Title: ${data.targetTitle}
- Company: ${data.company}
- Goal: ${data.goal}

User Context (CV snippet, if provided):
${data.masterCv ? data.masterCv.slice(0, 2000) : "Not provided. Keep the message generic but highly relevant to the target's role."}

Tone: ${data.tone}
Language: ${data.language === "ar" ? "Arabic" : "English"}

Return a JSON object with:
{
  "subjectLines": ["Subject option 1", "Subject option 2", "Subject option 3"],
  "emailDraft": "The full body of the email message...",
  "linkedinMessage": "A shorter version for a LinkedIn connection request (max 300 characters)...",
  "tips": ["Tip 1 on when to send", "Tip 2 on how to follow up"]
}

Respond ONLY in ${data.language === "ar" ? "Arabic" : "English"}.
Never use placeholders like [Insert Name], use the provided target info.
The linkedinMessage MUST be 300 characters or fewer.
`;

    try {
      const result = await callJson<{
        subjectLines: string[];
        emailDraft: string;
        linkedinMessage: string;
        tips: string[];
      }>(
        {
          messages: [{ role: "user", content: prompt }],
          model: "mistral-medium-latest"
        },
        () => ({
          subjectLines: ["Could not generate"],
          emailDraft: "Error generating draft.",
          linkedinMessage: "Error generating message.",
          tips: ["Try again later."]
        })
      );
      return result;
    } catch (error) {
      console.error("AI Error:", error);
      throw new Error("Failed to generate networking messages");
    }
  });
