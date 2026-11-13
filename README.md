# Gab Espineli portfolio

React + TypeScript + Vite portfolio hosted on Vercel, with a Cloudflare Worker and D1 (SQLite) for shared golf statistics. Includes the résumé PDF and mouse, touch, and keyboard golf controls.

## Run locally

Install Node.js 22.12+ (Node 24 LTS recommended). From Windows Command Prompt:

```cmd
cd /d "C:\Users\Gab\Documents\GitHub\portfolio"
npm ci
npm run dev
```

Open **http://127.0.0.1:5173**. The command builds the frontend, applies local database migrations, and starts Vite plus the API on port 8787. No Cloudflare account, API keys, or `.env` file is required for local development. The first dependency installation requires internet access. Wrangler may also make initialization/telemetry requests.

The local database persists under the ignored `.wrangler/state` directory. Other tabs using this server share its counts. Local counts are labeled **Local server** and do not affect a deployed database. Stop both servers with Ctrl+C. Subsequent starts use `npm run dev`; reinstall only after dependency changes.

## Backend choice and cost

Cloudflare Workers + D1 keeps hosting, API, and storage in one service. At the time of setup, Workers Free includes 100,000 dynamic requests per day; D1 Free includes 5 million rows read/day, 100,000 rows written/day, and 5 GB total storage. Static asset requests are free and unlimited. This should be sufficient for typical personal-portfolio traffic, but API polling and database writes consume those quotas. Free-tier operations fail when limits are reached; review the current pricing before enabling a paid plan.

- [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)

The game runs in the browser. Only aggregate statistics are shared; this is not synchronous multiplayer. Counts refresh after shots and once per minute while the page is visible. Totals start at zero, with no simulated visitors or successful putts. If the API is unavailable, the game remains playable and reports that shared counts are unavailable.

## Live hosting: Vercel frontend + Cloudflare golf API

The portfolio stays at https://gabespineli.vercel.app/. Shared golf counts are served directly by https://gab-portfolio-golf.gabespineli.workers.dev/api/golf/counts.

`wrangler.api.jsonc` deploys only `worker/api.ts`, connected to the `portfolio-golf` D1 database. The production database ID is a public resource identifier, not a credential. The API allows browser requests from `https://gabespineli.vercel.app`, rejects other origins, and uses Cloudflare's visitor IP for per-visitor rate limiting. Its hourly retention job deletes expired shot receipts and rate limits while preserving totals.

To deploy backend changes from this checkout:

```cmd
npx wrangler login
npm run db:remote
npm run deploy:api
```

The checked-in migration is applied only if it has not already run. Do not recreate the database or rerun its SQL manually. The original `wrangler.jsonc` remains available for local combined frontend/API development; production deployment uses `wrangler.api.jsonc` instead.

The production frontend uses the public Worker URL in `src/golf/store.ts`; `VITE_GOLF_API_URL` can override it at build time. No Vercel environment variable is required. Local `npm run dev` still uses the local API via Vite's `/api` proxy. Vercel Git deployment publishes frontend updates from `main`; deploy backend changes separately using `npm run deploy:api`.

## Integrity and limits

- Both browser and server import the same typed physics model. The API derives success from the submitted launch velocity, rather than accepting a claimed result.
- SQL triggers update aggregate counts atomically. UUID shot IDs make start/finish retries idempotent while their receipts are retained (seven days).
- Starts are limited to 30 per minute per visitor IP, using a short-lived hash. Same-origin checks, bounded JSON bodies, and input validation guard the write endpoints.
- Finishes cannot count an unknown shot or arrive before the simulated roll completes. Concurrent finish requests count once.
- This is a casual minigame, not a cheat-proof leaderboard: an automated client can still submit valid velocities, and distributed traffic can consume free quotas. There are no prizes, accounts, or personal profiles.

## Checks

```cmd
npm run build
npm test
```

With `npm run dev` running in another terminal:

```cmd
npm run test:api
```

The integration test uses only the local API and adds real test shots to the local database. It checks server scoring, shared totals, input/origin validation, duplicate starts, concurrent finishes, and early/unknown finishes. Visual browser and physical touch testing are separate from these checks.

## Source map

- `src/App.tsx`: shared shell and route selection.
- `src/Home.tsx`, `src/Experience.tsx`, `src/TechnologyStack.tsx`: portfolio content.
- `src/projects.ts`, `src/Project.tsx`: selected project summaries and preview cards.
- `public/social-preview-v6.png`: current share-preview image, referenced by `index.html`.
- `src/golf/`: React canvas lifecycle, controls, physics, and API client.
- `worker/index.ts`: golf API and retention job.
- `migrations/`: versioned D1 schema.
- `wrangler.jsonc`: Worker hosting and database binding.

Changes to frontend content use Vite hot reload. The Worker reloads when its TypeScript source changes. `npm run build` checks both frontend and backend TypeScript and produces the frontend in `dist`.
