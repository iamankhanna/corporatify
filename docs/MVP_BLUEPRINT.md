# Corpartify MVP Blueprint

## 1. Product overview

### Product promise

Corpartify lets users write what they really feel and transforms it into polished, professional communication that preserves the underlying intent while removing emotional excess, insults, and phrasing that could escalate conflict.

### What we should not promise

We should not claim the output is guaranteed safe for legal, HR, compliance, or reputational situations. The product should help users communicate more professionally, not replace judgment.

### Core value proposition

- Users can vent naturally first
- AI converts the message into respectful, workplace-appropriate language
- The message still carries the original context and ask
- Users can compare tones before sending

## 2. Target users

### Primary segments

- Employees writing to managers, HR, coworkers, or clients
- Students writing to professors, administrators, or placement teams
- Job seekers writing follow-ups, complaints, or negotiation emails
- Non-native English speakers who need a more corporate tone

### High-value use cases

- Complaint email after a frustrating event
- Escalation message to HR or support
- Follow-up after being ignored
- Declining a request politely
- Giving firm but professional feedback
- Translating blunt notes into polished English

## 3. MVP goals

### User goals

- Turn raw text into professional communication in under 30 seconds
- Preserve meaning while improving tone
- Offer variants for different levels of diplomacy
- Feel confident enough to copy and send after review

### Business goals

- Validate demand for the rewrite workflow
- Measure repeat usage and retention
- Collect real usage patterns for better prompts and templates
- Establish a strong base for paid plans and team features

### Success metrics

- Time to first rewrite
- Rewrite completion rate
- Copy button usage rate
- Return-user rate
- Positive feedback on output quality
- Percentage of users trying multiple variants

## 4. MVP feature scope

### Must-have

- Landing page with interactive demo
- Rewrite workspace
- Input box for raw message
- Audience selector
- Tone selector
- Goal selector
- Output length selector
- AI-generated polished output
- Softer, firmer, and concise variants
- Explanation of changes
- Copy to clipboard
- Basic history for signed-in users
- Input and output moderation
- Mobile-friendly responsive design

### Should-have

- Subject line suggestion
- Language detection
- Empty-state examples
- Prompt presets for common situations
- Lightweight analytics

### Not in MVP

- Browser extension
- Gmail/Outlook integrations
- Team collaboration
- Billing
- Fine-tuning pipeline
- Mobile app
- Public sharing feed

## 5. User stories

- As a user, I can paste emotional text and get a professional version quickly.
- As a user, I can choose who I am writing to so the output fits the audience.
- As a user, I can select a tone like polite, assertive, or neutral.
- As a user, I can compare multiple versions before deciding what to send.
- As a user, I can understand what changed so I do not lose trust in the rewrite.
- As a returning user, I can see my previous rewrites.

## 6. UX flows

### Anonymous user flow

1. Land on homepage
2. See before/after demo and examples
3. Click into workspace
4. Paste raw text
5. Choose audience, tone, goal, and length
6. Submit rewrite
7. Review output, variants, and explanation
8. Copy output or create another version

### Signed-in user flow

1. Open workspace
2. Rewrite message
3. Save result automatically to history
4. Re-open prior rewrites for reuse

## 7. Safety and trust requirements

### Non-negotiable rules

- Preserve facts unless the user explicitly asks for reframing
- Do not invent context, dates, policies, or accusations
- Remove slurs, threats, harassment, and discriminatory content
- Refuse to help professionalize extortion, abuse, or illegal threats
- Flag ambiguity when the model is unsure about meaning
- Show a review reminder before sending

### Product safeguards

- Input moderation before generation
- Output moderation after generation
- Safety refusal state with gentle fallback messaging
- “Review before sending” disclaimer near results
- Logging for moderation outcomes without storing raw secrets in analytics

## 8. Functional requirements

### Rewrite engine

Inputs:

- Raw message
- Audience
- Tone
- Goal
- Length
- Optional target language

Outputs:

- Polished message
- Softer version
- Firmer version
- Concise version
- Suggested subject line
- Summary of changes
- Detected language
- Optional warning if intent is ambiguous

### History

- Save rewrite requests and outputs for authenticated users
- Allow reopening a previous rewrite
- Show created timestamp and configuration metadata

### Analytics

- Track page visits
- Track rewrite requests
- Track copy actions
- Track variant toggles
- Track safety refusals

## 9. Technical architecture

### Recommended stack

- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS
- Backend: Route handlers and server utilities inside Next.js
- AI: OpenAI Responses API with structured output
- Safety: OpenAI Moderation API
- Auth and DB: Supabase
- Hosting: Vercel
- Analytics: PostHog or Plausible

### Why this stack

- Fastest path to MVP
- Single codebase for frontend and backend
- Great deployment ergonomics on Vercel
- Easy migration from mock mode to production AI
- Supabase reduces auth and data setup time

### High-level system diagram

1. User submits raw text from the browser
2. Next.js API validates input
3. Moderation service checks raw content
4. Rewrite service calls OpenAI with structured schema
5. Output is optionally moderated
6. API returns structured result to the UI
7. If signed in, the rewrite is stored in Supabase
8. Analytics events are emitted for product learning

## 10. App architecture

### Frontend routes

- `/` landing page
- `/workspace` rewrite experience
- `/history` saved rewrites
- `/sign-in` auth entry

### Backend modules

- `lib/ai/rewrite.ts` prompt builder and result parser
- `lib/ai/moderation.ts` moderation wrapper
- `lib/validation/rewrite.ts` request validation
- `app/api/rewrite/route.ts` rewrite endpoint
- `lib/supabase/*` auth and data helpers

### Component groups

- Marketing components for homepage
- Workspace form components
- Result card components
- Reusable UI primitives

## 11. Data model

### users

- id
- email
- created_at

### rewrites

- id
- user_id nullable
- raw_text
- detected_language
- audience
- tone
- goal
- length
- target_language nullable
- moderation_status
- created_at

### rewrite_versions

- id
- rewrite_id
- polished_message
- softer_version
- firmer_version
- concise_version
- subject_line
- summary_of_changes
- safety_notes nullable
- created_at

### feedback

- id
- rewrite_id
- rating
- note nullable
- created_at

### usage_events

- id
- user_id nullable
- event_name
- metadata jsonb
- created_at

## 12. API design

### POST `/api/rewrite`

Request body:

```json
{
  "rawText": "I am tired of this mess",
  "audience": "manager",
  "tone": "polite",
  "goal": "complaint",
  "length": "medium",
  "targetLanguage": "English"
}
```

Response body:

```json
{
  "detectedLanguage": "English",
  "intentSummary": "The user wants to raise a workplace concern professionally.",
  "subjectLine": "Request to discuss an ongoing concern",
  "polishedMessage": "I wanted to raise a concern regarding the current situation...",
  "variants": {
    "softer": "I wanted to gently flag a concern...",
    "firmer": "I would like to formally raise a concern...",
    "concise": "I would like to discuss an ongoing concern."
  },
  "summaryOfChanges": [
    "Removed emotionally charged language",
    "Kept the underlying complaint intact",
    "Restructured the message for professional clarity"
  ],
  "warnings": []
}
```

## 13. AI design

### Prompt requirements

- Detect the source language
- Infer the primary intent
- Preserve all factual claims
- Remove vulgarity, insults, and escalation
- Adapt output to selected audience, tone, and goal
- Return JSON only

### Structured output fields

- detectedLanguage
- intentSummary
- subjectLine
- polishedMessage
- variants.softer
- variants.firmer
- variants.concise
- summaryOfChanges
- warnings

### Failure handling

- If the content is unsafe, return a refusal payload
- If the meaning is unclear, ask for clarification later or include warnings
- If OpenAI is unavailable, use a temporary mock in non-production mode

## 14. Interactive engagement ideas

### MVP-ready

- Split-pane raw vs polished preview
- Tone chips with instant switching
- Preset cards like “To my boss” or “To HR”
- Example carousel on homepage
- Animated transformation moment after submit

### Later

- Tone slider from direct to diplomatic
- “Explain why this sounds better”
- “Would you send this?” confidence meter
- Saved personal tone presets
- Gamified communication improvement streaks

## 15. Deployment plan

### Environment variables

- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Deployment target

- Vercel for app hosting
- Supabase for DB and auth

### Release stages

1. Local mocked MVP
2. OpenAI-backed rewrite API
3. Auth and persistence
4. Production deployment on Vercel
5. Analytics and quality tuning

## 16. Implementation phases

### Phase 1

- Project scaffold
- Landing page
- Workspace UI
- Mock rewrite API

### Phase 2

- OpenAI integration
- Structured responses
- Moderation checks
- Better loading and error states

### Phase 3

- Supabase auth
- Save history
- Feedback collection

### Phase 4

- Deploy to Vercel
- Add analytics
- Tune prompts and onboarding

## 17. Open decisions

- Whether anonymous users can save history locally
- Whether output defaults to same language or a chosen target language
- Whether refusal flows should rewrite into “safe professional boundary-setting” or hard-stop
- Whether free tier uses daily caps from day one

## 18. Immediate build target

For the first coding pass, we should create:

- Next.js app shell
- Landing page
- Workspace page
- Rewrite form
- Result panel
- Mock API route
- Blueprint and environment docs

That gives us a working demo quickly while preserving a clean path to OpenAI, Supabase, and deployment.
