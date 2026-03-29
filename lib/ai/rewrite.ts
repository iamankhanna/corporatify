import OpenAI from "openai";
import type { RewriteResponse } from "@/lib/types";
import type { RewriteRequest } from "@/lib/validation/rewrite";
import { buildMockRewrite } from "@/lib/ai/mock-rewrite";

const HUGGING_FACE_MODEL =
  process.env.HUGGINGFACE_MODEL ?? "katanemo/Arch-Router-1.5B:hf-inference";

const REWRITE_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    mode: { type: "string", enum: ["openai", "huggingface"] },
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
} as const;

const openAiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const huggingFaceClient = process.env.HUGGINGFACE_API_KEY
  ? new OpenAI({
      apiKey: process.env.HUGGINGFACE_API_KEY,
      baseURL: "https://router.huggingface.co/v1"
    })
  : null;

export async function rewriteMessage(
  input: RewriteRequest
): Promise<RewriteResponse> {
  const provider = getActiveProvider();

  if (!provider) {
    return buildMockRewrite(input);
  }

  try {
    const rawText =
      provider === "openai"
        ? await rewriteWithOpenAI(input)
        : await rewriteWithHuggingFace(input);

    if (!rawText) {
      throw new Error(`${provider} returned an empty rewrite response`);
    }

    const parsed = JSON.parse(rawText) as RewriteResponse;
    return normalizeRewriteResponse(parsed, provider);
  } catch (error) {
    console.error(`${provider} rewrite failed, using mock fallback`, error);
    return withFallbackWarning(buildMockRewrite(input), provider);
  }
}

function buildSystemPrompt() {
  return `
You are Corpartify, an AI communication assistant that transforms emotionally charged writing into polished professional communication.

Your rules:
- Rewrite the user's message into polished professional communication.
- Preserve the user's facts, timeline, and core ask.
- Rewrite the tone, not the facts.
- Remove vulgarity, insults, mockery, and emotional excess.
- Do not add claims, promises, policies, or background that the user did not provide.
- Keep the message useful for the selected audience, tone, goal, and desired length.
- If the user is ambiguous, state the ambiguity briefly in warnings instead of inventing meaning.
- Set "mode" to the current provider name.
- Keep the subject line short and realistic.
- Make the three variants meaningfully distinct:
  - softer: more diplomatic and gentle
  - firmer: more direct and formal
  - concise: shortest sendable version
- Return only valid JSON matching the schema.
`;
}

function buildUserPrompt(input: RewriteRequest) {
  return `
Rewrite this message for professional communication.

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

async function rewriteWithOpenAI(input: RewriteRequest) {
  if (!openAiClient) {
    throw new Error("OpenAI client is not configured");
  }

  const response = await openAiClient.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: buildSystemPrompt()
      },
      {
        role: "user",
        content: buildUserPrompt(input)
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "rewrite_response",
        strict: true,
        schema: REWRITE_RESPONSE_SCHEMA
      }
    }
  });

  return response.output_text;
}

async function rewriteWithHuggingFace(input: RewriteRequest) {
  if (!huggingFaceClient) {
    throw new Error("Hugging Face client is not configured");
  }

  const response = await huggingFaceClient.chat.completions.create({
    model: HUGGING_FACE_MODEL,
    messages: [
      {
        role: "system",
        content: buildSystemPrompt()
      },
      {
        role: "user",
        content: buildUserPrompt(input)
      }
    ],
    temperature: 0.4,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "rewrite_response",
        strict: true,
        schema: REWRITE_RESPONSE_SCHEMA
      }
    }
  });

  const content = response.choices[0]?.message?.content;
  return typeof content === "string" ? content : "";
}

function normalizeRewriteResponse(
  response: RewriteResponse,
  provider: "openai" | "huggingface"
): RewriteResponse {
  return {
    ...response,
    mode: provider,
    warnings: response.warnings.filter(Boolean),
    summaryOfChanges: response.summaryOfChanges.filter(Boolean)
  };
}

function withFallbackWarning(
  response: RewriteResponse,
  provider: "openai" | "huggingface" | null
): RewriteResponse {
  const providerLabel =
    provider === "huggingface"
      ? "Hugging Face"
      : provider === "openai"
        ? "OpenAI"
        : "Live AI";

  return {
    ...response,
    warnings: [
      `${providerLabel} rewrite failed, so a local fallback response was returned.`,
      ...response.warnings
    ]
  };
}

function getActiveProvider() {
  if (openAiClient) {
    return "openai" as const;
  }

  if (huggingFaceClient) {
    return "huggingface" as const;
  }

  return null;
}
