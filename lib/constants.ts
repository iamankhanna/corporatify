export const selectors = {
  audiences: ["Manager", "HR", "Professor", "Client", "Coworker", "Support"],
  tones: ["Polite", "Assertive", "Neutral", "Apologetic", "Firm"],
  goals: [
    "Complaint",
    "Follow-up",
    "Request",
    "Escalation",
    "Feedback",
    "Boundary-setting"
  ],
  lengths: ["Short", "Medium", "Detailed"]
} as const;

export const presets = [
  {
    audience: "Manager",
    title: "Missed follow-up",
    description:
      "Rewrite a frustrated nudge into something calm, clear, and hard to ignore."
  },
  {
    audience: "HR",
    title: "Workplace concern",
    description:
      "Turn emotional complaints into respectful, documented, professional communication."
  },
  {
    audience: "Professor",
    title: "Extension request",
    description:
      "Keep the urgency while making the request sound thoughtful and responsible."
  },
  {
    audience: "Client",
    title: "Boundary-setting",
    description:
      "Say no, push back, or reset expectations without sounding combative."
  }
] as const;

export const rewriteDefaults = {
  rawText:
    "I have followed up multiple times and still have not received a clear update. This delay is becoming frustrating and it is affecting my ability to plan next steps.",
  audience: "Manager",
  tone: "Polite",
  goal: "Follow-up",
  length: "Medium",
  targetLanguage: "English"
};
