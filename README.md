# Olea — Modern Mediterranean

A fictional restaurant website: a sleek promo site for **Olea** plus a table
assistant that recommends dishes from the menu based on a guest's preferences.

This is the **mocked frontend** — all data is served from a local mock layer.
A REST API backend will replace the mock later without touching the UI.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** for motion
- **pnpm workspaces** monorepo
- Runs entirely in **Docker**

## Structure

```
apps/
  web/                 # Next.js client
packages/
  menu-data/           # shared types, mock menu, recommendation engine
```

The UI talks to data only through `apps/web/src/lib/menu-client.ts` (the
`MenuClient` interface). Today a `MockMenuClient` serves the bundled menu; when
the backend lands, an HTTP client implements the same interface and the rest of
the app stays unchanged.

The dish recommendation logic lives in `packages/menu-data/src/recommend.ts` as
a deterministic, rule-based engine — the single seam a real AI/endpoint would
later replace.

## Develop

Everything runs in Docker; no host installs.

```bash
docker compose up        # starts the dev server on http://localhost:3000
```

Run commands inside the container:

```bash
docker compose exec web pnpm --filter @olea/web build   # production build
docker compose exec web pnpm --filter @olea/web lint
```

## Pages

- `/` — home (hero, signature dishes, story, hours)
- `/menu` — full menu with dietary & spice filters
- `/about` — the story
- `/contact` — details, map placeholder, reservation form (mock submit)

The table assistant is the floating button on every page.
