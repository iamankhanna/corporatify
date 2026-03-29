export type ModerationResult = {
  flagged: boolean;
  reasons: string[];
};

export async function moderateText(_text: string): Promise<ModerationResult> {
  // Placeholder until the OpenAI moderation call is wired in.
  return {
    flagged: false,
    reasons: []
  };
}
