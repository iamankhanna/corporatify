# Corpartify

Corpartify helps people turn emotional, blunt, or messy text into polished professional communication without changing the core intent.

## MVP focus

- Let users paste raw text in any language
- Select audience, tone, and communication goal
- Generate a polished workplace-safe version
- Offer softer, firmer, and concise variants
- Explain what changed so users keep control of the message

## Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- OpenAI Responses API
- OpenAI Moderation API
- Supabase for auth and persistence
- Vercel for deployment

## Project docs

- Blueprint: `docs/MVP_BLUEPRINT.md`
- Environment template: `.env.example`

## Local development

1. Install dependencies with `npm install`
2. Copy `.env.example` to `.env.local`
3. Set `OPENAI_API_KEY` or `HUGGINGFACE_API_KEY` in `.env.local` if you want live AI rewrites
3. Start the dev server with `npm run dev`

If no live provider key is set, the rewrite endpoint falls back to a local mock response so the UI can still be explored.
