import type { RewriteRequest } from "@/lib/validation/rewrite";
import type { RewriteResponse } from "@/lib/types";

export function buildMockRewrite(input: RewriteRequest): RewriteResponse {
  return {
    mode: "mock",
    detectedLanguage: input.targetLanguage === "English" ? "English" : "Mixed",
    intentSummary: `The user wants to communicate a ${input.goal.toLowerCase()} in a ${input.tone.toLowerCase()} way to ${withArticle(input.audience)}.`,
    subjectLine: `${input.goal}: request for alignment`,
    polishedMessage: `I wanted to reach out regarding this matter and share my concern in a constructive way. While the situation has been frustrating from my perspective, I would appreciate the opportunity to clarify expectations and identify the next steps. Please let me know how you would prefer to proceed.`,
    variants: {
      softer:
        "I wanted to gently follow up on this matter and see whether we could align on the next steps when convenient.",
      firmer:
        "I would like to formally raise this concern and request a clear update on the expected next steps.",
      concise:
        "I would appreciate a clear update on this matter and the next steps."
    },
    summaryOfChanges: [
      "Reduced emotionally charged phrasing",
      "Preserved the underlying concern and request",
      "Improved structure for professional readability"
    ],
    warnings: [
      "Mock mode is active, so this output is a local placeholder rather than a live AI rewrite."
    ]
  };
}

function withArticle(value: string) {
  const normalized = value.trim().toLowerCase();
  const first = normalized.charAt(0);
  return ["a", "e", "i", "o", "u"].includes(first)
    ? `an ${normalized}`
    : `a ${normalized}`;
}
