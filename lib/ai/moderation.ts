import OpenAI from "openai";

export type ModerationResult = {
  flagged: boolean;
  reasons: string[];
  degraded: boolean;
  warning?: string;
  blocking: boolean;
};

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function moderateText(text: string): Promise<ModerationResult> {
  if (!client) {
    return {
      flagged: false,
      reasons: [],
      degraded: true,
      blocking: true,
      warning:
        "Moderation is unavailable because OpenAI moderation is not configured."
    };
  }

  try {
    const response = await client.moderations.create({
      model: "omni-moderation-latest",
      input: text
    });

    const result = response.results[0];

    if (!result) {
      return {
        flagged: false,
        reasons: [],
        degraded: false,
        blocking: false
      };
    }

    return {
      flagged: result.flagged,
      reasons: extractFlaggedCategories(result.categories),
      degraded: false,
      blocking: false
    };
  } catch (error) {
    console.error("Moderation failed", error);

    return {
      flagged: false,
      reasons: [],
      degraded: true,
      blocking: true,
      warning: buildModerationWarning(error)
    };
  }
}

function extractFlaggedCategories(categories: object) {
  return Object.entries(
    categories as Record<string, boolean | null | undefined>
  )
    .filter(([, flagged]) => Boolean(flagged))
    .map(([category]) => category.replaceAll("/", " / ").replaceAll("-", " "));
}

function buildModerationWarning(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 429
  ) {
    return "OpenAI moderation is temporarily rate-limited, so live rewrites are blocked until moderation is available again.";
  }

  return "OpenAI moderation is temporarily unavailable, so live rewrites are blocked until moderation is available again.";
}
