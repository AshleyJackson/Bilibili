# AGENTS.md — AI/Agent Development Guide

This file is for AI coding agents (Claude, Copilot, Cursor, etc.) working with this template repo. It provides conventions, architecture context, and automation tips.

## Overview

This is a **SvelteKit Chrome Extension** that downloads videos from bilibili.com. It uses Svelte 5, Skeleton 3, Tailwind 4, and Vite, and builds into a static Chrome extension via `sveltekit-adapter-chrome-extension`. The download logic runs in Bilibili's page context via a two-stage content script (seed + main).

## Project Structure

| Path | Purpose |
|---|---|
| `src/routes/` | SvelteKit pages (built as extension pages) |
| `src/app.html` | Root HTML shell |
| `src/app.css` | Global styles + Tailwind entry |
| `src/content-script/seed.ts` | MV3 isolated-world content script — injects `main.ts` into the page |
| `src/content-script/main.ts` | Page-world logic: XHR interception, `__INITIAL_STATE__`/`__PLAYURL_HYDRATE_DATA__` parsing, playurl fetch, UI render |
| `src/lib/wbi.ts` | WBI parameter signing (mixin key + `w_rid`/`wts`) required by `/x/player/wbi/playurl` |
| `src/lib/bilibili-api.ts` | UGC (`fetchUgcPlayUrl`, WBI-signed) and bangumi (`fetchBangumiPlayUrl`, PGC v2) playurl clients |
| `src/lib/download.ts` | Normal + advanced (merge) download flows |
| `src/lib/ffmpeg.ts` | WASM FFmpeg audio/video merge |
| `src/lib/host.ts` | Shadow-DOM helper UI |
| `src/lib/schemas.ts` | Zod schemas (DashData, DurlSegment, DashStream, ErrorCode, etc.) |
| `src/lib/constants.ts` | API endpoints, quality labels, fetch defaults |
| `static/` | Static assets (icons, `manifest.json`, built content scripts) |
| `build/` | Built extension output (load as unpacked extension) |
| `vite.config.ts` | Vite + SvelteKit config (also drives vitest) |
| `vite.content.config.ts` | Vite config for the content-script bundle |
| `tsconfig.content.json` | Standalone tsconfig for content-script type-checking |
| `svelte.config.js` | Adapter static config |

## Key Scripts

- `bun run dev` — dev server
- `bun run build:content` — build content scripts to `static/` (runs `svelte-kit sync` first for tsconfig)
- `bun run build:worker` — build the MV3 service worker to `static/`
- `bun run build` — build the MV3 service worker and SvelteKit extension to `build/`
- `bun run build:all` — `build:content` then `build`
- `bun run package` — build + zip into `extension.zip`
- `bun run test:unit` — run vitest tests
- `bun run check` — type-check with svelte-check (note: svelte-check may crash on some TS versions; use `bunx tsc --noEmit -p tsconfig.content.json` to type-check the content scripts)

## Conventions

- **Bun** is the package manager (see `bun.lock`).
- **Svelte 5** syntax — use `$state`, `$derived`, `$effect` runes, not Svelte 4 stores.
- **Skeleton 3** components for UI — import from `@skeletonlabs/skeleton-svelte`.
- **Tailwind 4** — configure via `@import "tailwindcss"` in CSS, no `tailwind.config.js`.
- Chrome extension APIs via `@types/chrome` — use `chrome.*` APIs freely.
- Tests use **vitest** — co-located or in `src/`.
- **Tests must be created, reviewed, and updated** whenever a function is added or changed. No function ships without a corresponding test — unit for logic, integration for extension behavior.
- **Keep files focused and small.** If a file grows too large or starts doing multiple things, split it into smaller, single-purpose files. This keeps the codebase maintainable for both humans and AI agents.

## Testing & Launching the Built Extension

Because this project produces a **Chrome extension** (not a web app), testing requires loading the built output into a browser runtime. The [`agent-browser`](https://github.com/vercel-labs/agent-browser) npm package (by Vercel Labs) is already installed and handles this — it's a browser automation CLI that can launch Chrome with the built extension loaded.

### Basic Launch

```bash
# Build then launch Chrome with the extension loaded as unpacked
bun run build && bunx agent-browser

# Launch in headless mode (no visible window)
bunx agent-browser --headless

# Launch with a specific Chrome/Chromium binary
bunx agent-browser --chrome /path/to/chrome
```

### Loading the Built Extension

The extension is already built into `build/` by `bun run build`. `agent-browser` launches a fresh Chrome profile each time, so there's no cached state — you always get a clean environment with the extension loaded. On launch, navigate to `chrome://extensions` (via CDP) or simply interact with your extension's pages directly.

### Example: Programmatic Usage with Tests

Use `agent-browser` in your test scripts to control the browser via CDP protocol:

```bash
# Launch with a remote debugging port for attaching tools/debuggers
bunx agent-browser --remote-debugging-port=9222

# Pipe browser logs to stdout for debugging
bunx agent-browser 2>&1
```

Combine with vitest for integration checks — the agent-browser process can be spawned in a test's `beforeAll` and killed in `afterAll`, giving you end-to-end coverage against the real extension build.

## AI Agent Tips

- When adding a new page/route, create the `.svelte` file in `src/routes/` and update manifest permissions if needed in `static/manifest.json`.
- The build output directory is `build/` — this is what gets loaded into Chrome. Do not edit `build/` directly; it is overwritten on every build.
- If you need a background service worker or content script, add them to `static/` and reference them in `static/manifest.json`.
- **Content scripts are built separately** via `bun run build:content` (config in `vite.content.config.ts`). The seed script (`src/content-script/seed.ts`) runs in the MV3 isolated world and injects `main.ts` into the page's main world as an ES module. After editing anything in `src/content-script/` or `src/lib/`, re-run `build:content` to regenerate `static/bilibili-helper-content-script*.js`.
- **WBI signing is required** for the UGC `/x/player/wbi/playurl` endpoint. Use `signWbi(params)` from `src/lib/wbi.ts` before fetching. Keys are fetched from the nav API and cached (~1h TTL); on a risk-control error (`-509`/`-403`/`-352`), `fetchUgcPlayUrl` clears the cache and retries once. Bangumi (`/pgc/player/web/v2/playurl`) does **not** use WBI signing.
- **Bilibili CDN downloads need a Referer header.** `STREAM_FETCH_DEFAULTS` in `src/lib/constants.ts` pins `referrer: 'https://www.bilibili.com/'` + `referrerPolicy: 'unsafe-url'` so `*.bilivideo.com` stream fetches don't get 403'd. Use it for any new CDN fetch.
- Keep `PlayUrlResult` (in `bilibili-api.ts`) as the shared return shape — `host.ts` and `download.ts` consume it and should not need changes when you extend the API clients.
- When type-checking content scripts, use `bunx tsc --noEmit -p tsconfig.content.json` (the root tsconfig relies on SvelteKit's generated `.svelte-kit/tsconfig.json`).