# Olea — Modern Mediterranean

A fictional restaurant website: a sleek promo site for **Olea** plus a table
assistant that recommends dishes from the menu based on a guest's preferences.

A **Next.js frontend** is backed by a **REST API** (Express + SQLite) that
serves the menu and powers the assistant. The assistant runs on a deterministic
rule-based engine out of the box, and upgrades to an LLM (Google Gemini) when an
API key is provided.

## Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion
- **Backend:** Node + TypeScript + Express, SQLite via Drizzle ORM (libsql)
- **AI:** Google Gemini (AI Studio free tier) — optional, key left to env
- **pnpm workspaces** monorepo, runs entirely in **Docker**

## Structure

```
apps/
  web/                 # Next.js client (port 3000)
  api/                 # Express REST API + SQLite (port 4000)
packages/
  menu-data/           # shared types, menu data (DB seed), recommendation engine
```

`packages/menu-data` is the single source of truth: its **types** are the API
contract, its **menu data** seeds the database, and its rule-based
`recommendDishes` engine is the assistant's fallback.

The frontend talks to data only through `apps/web/src/lib/menu-client.ts` (the
`MenuClient` interface) — `HttpMenuClient` calls the API, `MockMenuClient` is a
bundled fallback, selected via `NEXT_PUBLIC_DATA_SOURCE`.

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health + assistant mode |
| GET | `/api/categories` | Menu categories |
| GET | `/api/dishes` | All dishes (`?featured=true`, `?category=`) |
| GET | `/api/dishes/:id` | Single dish |
| POST | `/api/assistant/recommend` | `{ preferences, message? }` → recommendations + reply |

## Develop

Everything runs in Docker; no host installs.

```bash
docker compose up        # api on :4000 (seeds SQLite), web on :3000
```

The `api` container installs workspace deps and seeds the database; `web` waits
for it to be healthy, then starts. Run commands inside a container:

```bash
docker compose exec web pnpm --filter @olea/web build   # production build
docker compose exec api pnpm --filter @olea/api build   # typecheck the API
```

### Enabling the LLM assistant (optional)

The assistant works without any key (rule-based). To enable Gemini:

1. Get a free key at <https://aistudio.google.com/apikey>.
2. Set `GEMINI_API_KEY` in the environment (e.g. export it before
   `docker compose up`, or add it to an `.env`). The `api` service reads it.
3. Restart the API. `/api/health` will report `"llm":"enabled"`.

## Pages

- `/` — home (hero, signature dishes, story, hours)
- `/menu` — full menu with dietary & spice filters
- `/about` — the story
- `/contact` — details, Google Maps embed, reservation form (mock submit)

The table assistant is the floating button on every page.
