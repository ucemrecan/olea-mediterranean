# Olea — Modern Mediterranean

A fictional restaurant website: a sleek promo site for **Olea** plus a table
assistant that recommends dishes based on a guest's preferences.

A single **Next.js** app (App Router). The menu is static data; the assistant
runs on a deterministic rule-based engine and upgrades to an LLM (Google Gemini)
when an API key is provided. The Gemini key stays server-side in a Route
Handler, so nothing sensitive reaches the browser — and the whole thing deploys
to **Vercel** as one project.

## Stack

- **Next.js 15** (App Router), TypeScript, Tailwind CSS v4, Framer Motion
- **AI:** Google Gemini (AI Studio free tier) — optional, key in env
- **pnpm workspaces** monorepo, local dev in Docker

## Structure

```
apps/
  web/                 # Next.js app (UI + assistant route handler)
packages/
  menu-data/           # shared types, menu data, recommendation engine
```

`packages/menu-data` is the single source of truth: its **types**, **menu
data**, and rule-based `recommendDishes` engine are all consumed directly by the
app — no database needed (the menu is static).

- Server Components read the menu in-process via `apps/web/src/lib/menu.ts`.
- The assistant (client) calls `POST /api/assistant/recommend` — a Route Handler
  (`apps/web/src/app/api/assistant/recommend/route.ts`) that runs Gemini when a
  key is set, otherwise the rule-based engine. Key never leaves the server.

## Develop

```bash
docker compose up        # dev server on http://localhost:3000
```

Optional: enable the LLM locally by creating `apps/web/.env` (gitignored) with
`GEMINI_API_KEY=...` — see `apps/web/.env.example`. Without it, the assistant
uses the rule-based engine.

```bash
docker compose exec web pnpm --filter @olea/web build   # production build
docker compose exec web pnpm --filter @olea/web lint
```

## Deploy (Vercel)

1. Import the repo in Vercel.
2. **Root Directory:** `apps/web` (Vercel detects the pnpm workspace and installs
   from the repo root automatically).
3. **Environment Variables:** add `GEMINI_API_KEY` (and optionally
   `GEMINI_MODEL`). Leave them out to ship the rule-based assistant.
4. Deploy. Framework preset is auto-detected as Next.js.

## Pages

- `/` — home (hero, signature dishes, story, hours)
- `/menu` — full menu with dietary & spice filters
- `/about` — the story
- `/contact` — details, Google Maps embed, reservation form (mock submit)

The table assistant is the floating button on every page.
