# Gab Espineli portfolio

React + TypeScript + Vite frontend, with a TypeScript Cloudflare Worker and D1 (SQLite) for shared golf statistics. The existing portfolio, case studies, résumé, and mouse/touch/keyboard golf controls are preserved.

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

## Deploy globally (one-time account setup)

The repository is ready for deployment, but does **not** create a hosted database automatically. From this directory:

```cmd
npx wrangler login
npx wrangler d1 create portfolio-golf
```

Copy the returned database ID into `wrangler.jsonc`, replacing the all-zero `database_id`. Then run:

```cmd
npm run db:remote
npm run deploy
```

Wrangler prints the deployed URL. The same Worker serves the built frontend and `/api/golf/*`, so no CORS configuration or public database key is needed. Its scheduled handler removes expired rate-limit rows and shot receipts older than seven days; aggregate totals remain. Local and remote databases are separate. Commit the assigned database ID after setup if you want future checkouts/CI to target the same database; it is an identifier, not a credential. Keep Cloudflare API tokens out of source control.

Do not deploy only the `dist` directory to a static host and expect the golf API to work. Use the Worker deployment above, or configure a separate API proxy if changing hosts. Existing project URLs and `/resume.html` use the SPA fallback.

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
- `src/Home.tsx`, `src/Resume.tsx`, `src/Experience.tsx`: portfolio content.
- `src/projects.ts`, `src/Project.tsx`: project data and reusable case-study components.
- `src/golf/`: React canvas lifecycle, controls, physics, and API client.
- `worker/index.ts`: golf API and retention job.
- `migrations/`: versioned D1 schema.
- `wrangler.jsonc`: Worker hosting and database binding.

Changes to frontend content use Vite hot reload. The Worker reloads when its TypeScript source changes. `npm run build` checks both frontend and backend TypeScript and produces the frontend in `dist`.
