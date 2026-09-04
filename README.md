# Studify

Studify is a full-stack study platform built specifically for Cambridge O Level and A Level students. The idea is simple: take everything a student needs to prepare for these exams and put it in one place. That includes official past papers, an AI tutor that can solve questions or mark answers, mock exams generated from real past-paper patterns, and tools that try to predict where the grade boundaries will land and which topics are likely to come up next.

The whole thing is wrapped in a 3D, glassmorphic interface with WebGL hero scenes, floating geometry, and smooth scroll. It is meant to feel more like a command center than a typical edtech site.

## What it does

**Past paper library** — every Cambridge paper organized by subject, year, and session. You can filter down quickly and view PDFs inline.

**AI Solver** — paste a question or upload a photo of one and the AI returns a full worked solution. Math is rendered with KaTeX, examiner tips are included, and there's a button to generate a similar practice question. Image-based questions go through Claude's vision API.

**Mock Maker** — pick a subject, configure difficulty and topics, and the AI generates a custom exam. You take it in full-screen mode with a timer, can flag questions, pause if you need to, and your progress is saved to localStorage so a refresh won't kill you. When you submit, you get a score, an estimated grade, a topic radar chart showing where you're strong and weak, and a per-question breakdown.

**AI Checker** — type or photograph your answer to a question and the AI marks it like a Cambridge examiner would, with a breakdown of which marking points you hit, a model answer, and suggestions for improvement.

**Grade Threshold Guesser** — pick a subject, paper, and upcoming session, and the AI looks at 10+ years of historical boundary data (plus any community difficulty reports) to predict where the A*, A, B, C thresholds will land. There's also a chart showing the historical trend.

**Paper Guesser** — feed in a subject, level, and upcoming session, and the AI predicts topic probabilities for the next exam, surfaces recurring question patterns, and generates a revision checklist.

**Subscriptions** — Free tier with daily limits, Pro at $7.99/mo (unlimited papers, 50 AI solves/day, Mock Maker, AI Checker), and Premium at $14.99/mo (everything unlimited plus the two guesser tools). Stripe handles the billing and webhooks update the user's plan in the database.

## Tech stack

The frontend is Next.js 14 with the App Router and TypeScript. Tailwind handles styling, with a custom design system on top — Space Grotesk for display text, Inter for body, JetBrains Mono for data. Three.js with React Three Fiber powers the 3D hero, Framer Motion handles entrance animations, GSAP-style reveals are done with Framer, and Lenis gives the smooth scroll.

On the backend, Next.js API routes handle everything in TypeScript. Supabase is the database, auth provider, and file storage. Anthropic Claude (Sonnet 4.5) does all the AI work, including vision for image-based questions. Stripe handles payments. Resend handles transactional email.

It's deployed on Vercel.

## Running it locally

Clone the repo, then:

```
npm install
cp .env.example .env.local
```

Fill in the keys in `.env.local`. You'll need:

- A Supabase project (run the SQL in `scripts/schema.sql` to set up tables and RLS)
- An Anthropic API key
- Stripe test keys and product/price IDs
- A Resend API key

Then:

```
npm run dev
```

Visit http://localhost:3000.

There are seed scripts in `scripts/seed/` for subjects, sample papers, and historical thresholds. Run them with `npm run seed:subjects`, `npm run seed:papers`, and `npm run seed:thresholds`.

## Project layout

```
app/
  (auth)/login, signup, forgot-password
  (dashboard)/dashboard, papers, solver, mock, checker, thresholds, predict, settings
  api/ — all backend routes
components/
  3d/ — Three.js hero scene
  landing/ — hero, features, pricing, subjects, etc.
  ui/ — buttons, inputs, modals, tilt cards
  layout/ — navbar, sidebar, footer
lib/
  supabase/ — client, server, middleware
  claude/ — AI integration with system prompts
  stripe/ — checkout, webhooks
  rateLimit, subjects, utils, email
scripts/
  schema.sql, seed/*.ts
```

## A note on the AI

Everything the AI generates is for educational purposes. Always verify answers against the official Cambridge mark schemes. Past paper PDFs are sourced from publicly available educational resources — Studify is not affiliated with Cambridge Assessment International Education.

## License

MIT