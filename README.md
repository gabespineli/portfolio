# Gab Espineli portfolio

A lightweight static portfolio inspired by the layout and reading flow of jedtan.dev, with original copy, styling, and cover illustrations.

Run `npm run build` to generate `dist`, then `npm start` for http://127.0.0.1:4173.

Edit `projects.mjs` for project stories and remaining placeholders; edit `build.mjs` for homepage and résumé content. Styling lives in `styles.css`. The résumé is a printable HTML summary.

## Still to add

- A personal/exhibit photo in the hero.
- Actual exhibit photography and product screenshots in place of labeled cover illustrations.
- Out of Body collaborator credits and exact dates.
- Talentados demo/repository, final naming, and team credits.
- WTP Coffee live URL and analytics reporting period.
- Academic reports, verified benchmarks, and current exploration demos.

No invented testimonials, production screenshots, or unverified live-demo links are included. Project metrics are based on the user’s supplied history and November 2026 résumé.

Design update: subtle desktop grid, frosted navigation, silver window frames, glossy green links, and an original CSS landscape inspired by early desktop interfaces. LinkedIn is connected.

## Technology tiles

Technology cards appear only in Experience. Hover or keyboard-focus an experience entry to reveal a staggered, animated fan; leaving the entry hides it again. Touch users can tap the entry to focus it. The selected projects and project detail pages have no technology stacks. `presentation.mjs` defines their project mappings.

Verified on November 11, 2026 from repository manifests and source:

- WTP Coffee: Shopify Dawn (`config/settings_schema.json`), Liquid (`layout/theme.liquid`), JavaScript and CSS (`assets/`). Repository: https://github.com/gabespineli/wtp-coffee-shopify
- CleanHAUL: TypeScript, Next.js, React, Tailwind CSS, Supabase (`package.json`); PostgreSQL and Resend are documented in its README. Repository: https://github.com/gabespineli/cleanhaul-contracts
- Out of Body: TypeScript, Next.js, React, Supabase, MediaPipe (`package.json`). Repository: https://github.com/gabespineli/out-of-body
- Asceoft: stack supplied by Gab from the project documentation on November 11, 2026. Next.js / React / Tailwind frontend; TypeScript / Node.js / Express backend; PostgreSQL on Supabase, Prisma ORM, JWT / Passport, Nodemailer, Vitest, and Cypress. Repository: https://github.com/Kermit-King/ASCEOFT_ATS. NextAuth and Zustand are omitted because they remain unconfirmed. The portfolio continues to describe Gab as Lead Analyst, not as sole developer.

## Single-hole putting strip

A slim, top-down putting green sits immediately above Selected Work, outside the page's two-column sections. One straight lane, a ball on the right, a cup on the left, and two mock global counters. The surface uses a cached, procedurally rendered sunlit grass texture with fine blades and varied natural patches. No dotted outlines or aim guides are drawn; keyboard focus uses a subtle solid indicator. No window frame, hole selector, sliders, scorecard, or game dashboard.

- Desktop: the cursor becomes a putter. Move it through the ball from right to left. Forward pointer velocity sets impact speed. First entry into the canvas does not hit the ball.
- Touch: pull right from the ball and release. Pointer capture allows a stroke to extend outside the canvas; cancelled gestures do not count.
- Keyboard: focus the green, hold Space to draw back, and release to putt. Left/right adjust aim; Escape cancels.
- Each shot counts once at impact, whether made or missed. A new ball appears automatically after the result.
- `putting-physics.js` uses metre/second units, rolling deceleration, stronger rough resistance, substeps, a larger, forgiving cup and speed/offset-dependent capture with a wider pace tolerance. This is a simplified flat-green golf simulation, not a calibrated full golf simulator. There are no wall bounces or auto-aim.
- `putting-store.js` exposes `getCounts()`, `beginShot(id)`, and `finishShot(id, made)`. The baseline of 1,248 attempts / 317 made is explicitly mock global data. This browser's additions persist in localStorage; blocked storage falls back to memory. There is no real shared backend or cross-device aggregation. Replace this adapter with an atomic server counter service when ready.
- `putting.js` owns rendering, input, and the automatic reset. `putting.css` owns the layout and cursor.

Run `npm run build` then `npm test`. Tests cover shot pace, misses, capture, time-step independence, mouse impact, counter idempotency and persistence, storage fallback, touch/keyboard/cancellation, automatic reset, placement above projects, Asceoft icons, and local links. UI state checks use a DOM test double. Visual browser QA remains unverified because this environment blocks preview connectivity.
