import { z } from "zod";

export const rewriteRequestSchema = z.object({
  rawText: z.string().min(10).max(5000),
  audience: z.string().min(2).max(50),
  tone: z.string().min(2).max(50),
  goal: z.string().min(2).max(50),
  length: z.string().min(2).max(50),
  targetLanguage: z.string().min(2).max(50)
});

export type RewriteRequest = z.infer<typeof rewriteRequestSchema>;
