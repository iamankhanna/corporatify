export type RewriteResponse = {
  mode: "mock" | "openai";
  detectedLanguage: string;
  intentSummary: string;
  subjectLine: string;
  polishedMessage: string;
  variants: {
    softer: string;
    firmer: string;
    concise: string;
  };
  summaryOfChanges: string[];
  warnings: string[];
};
