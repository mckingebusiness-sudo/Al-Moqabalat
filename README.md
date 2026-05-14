# InterviewX AI

AI-powered Career OS for the MENA region. Mock interviews, CV builder, ATS optimizer, salary negotiation, LinkedIn rewriter, thank-you emails, skill-gap analysis, career roadmap.

## Stack
- TanStack Start (Vite SSR) + React 19
- Tailwind 4 + shadcn/ui
- Mistral AI (medium) with multi-key rotation
- Cloudflare Workers (deploy)
- Zustand (client state, persisted in localStorage)

## Run locally
```bash
bun install
cp .env.example .dev.vars
# fill in MISTRAL_API_KEY_1
bun dev
```

## Deploy
```bash
bun run build
bunx wrangler deploy
```

## Routes
- `/` — Landing
- `/interview` — Mock Interview
- `/cv-builder`, `/cv-improve` — CV tools
- `/cover-letter`, `/salary-coach`, `/linkedin`, `/thank-you`, `/skill-gap`, `/roadmap` — Career tools
- `/tools` — All tools index

## Safety defaults
- `DAILY_TOKEN_LIMIT` defaults to 1,000,000 tokens/day to protect the API budget.
- Per-IP daily caps: 30 messages, 1 interview, 2 CV-AI runs.
