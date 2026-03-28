import OpenAI from "openai";
import type { RewriteResponse } from "@/lib/types";
import type { RewriteRequest } from "@/lib/validation/rewrite";
import { buildMockRewrite } from "@/lib/ai/mock-rewrite";

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function rewriteMessage(
  input: RewriteRequest
): Promise<RewriteResponse> {
  if (!client) {
    return buildMockRewrite(input);
  }

  const prompt = buildPrompt(input);

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "rewrite_response",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              mode: { type: "string", enum: ["openai"] },
              detectedLanguage: { type: "string" },
              intentSummary: { type: "string" },
              subjectLine: { type: "string" },
              polishedMessage: { type: "string" },
              variants: {
                type: "object",
                additionalProperties: false,
                properties: {
                  softer: { type: "string" },
                  firmer: { type: "string" },
                  concise: { type: "string" }
                },
                required: ["softer", "firmer", "concise"]
              },
              summaryOfChanges: {
                type: "array",
                items: { type: "string" }
              },
              warnings: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: [
              "mode",
              "detectedLanguage",
              "intentSummary",
              "subjectLine",
              "polishedMessage",
              "variants",
              "summaryOfChanges",
              "warnings"
            ]
          }
        }
      }
    });

    const rawText = response.output_text;
    return JSON.parse(rawText) as RewriteResponse;
  } catch (error) {
    console.error("OpenAI rewrite failed, using mock fallback", error);
    return buildMockRewrite(input);
  }
}

function buildPrompt(input: RewriteRequest) {
  return `
You are Corpartify, an AI communication assistant.

Your job:
- Rewrite the user's message into polished professional communication.
- Preserve the user's facts and core intent.
- Remove vulgarity, hostility, insults, and emotional excess.
- Do not invent details or claims.
- Adapt the wording for the selected audience, tone, goal, and target language.
- Return valid JSON matching the schema.
- Set "mode" to "openai".

Selected audience: ${input.audience}
Selected tone: ${input.tone}
Selected goal: ${input.goal}
Desired length: ${input.length}
Target language: ${input.targetLanguage}

User message:
"""
${input.rawText}
"""
`;
}
