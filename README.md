# Bilibili 下载助手 (Bilibili Download Helper)

A Chrome/Edge extension that downloads videos from [bilibili.com](https://www.bilibili.com) — including copyright-restricted 番剧 (anime), movies, and TV dramas that can be watched but not cached offline. Built with SvelteKit, Svelte 5, Skeleton 3, Tailwind 4, and Vite.

Built from the [SvelteKit Chrome Extension template](https://github.com/lukehagar/sveltekit-chrome-extension) by Luke Hagar.

## Features

- Downloads UGC videos (`/video/BV...`) and bangumi episodes (`/bangumi/play/ep...`)
- Fetches separate DASH audio + video streams and merges them with in-browser WASM FFmpeg
- **WBI-signed** playurl requests (required by Bilibili's current API)
- Automatic quality selection from the Bilibili player
- Normal mode (browser default download) and Advanced mode (auto-merge + rename)

## Stack

- Svelte 5 (runes), Skeleton 3, Tailwind 4
- TypeScript, Zod schemas
- `@ffmpeg/ffmpeg` (WASM) for audio/video merging
- Vitest for unit tests
- Bun as the package manager

## Developing

```bash
bun install
bun run dev
```

## Building

Content scripts are built separately from the SvelteKit extension because they run in Bilibili's page context (injected via a seed script).

```bash
# Build content scripts only (outputs to static/)
bun run build:content

# Build the SvelteKit extension (outputs to build/)
bun run build

# Build everything in the right order
bun run build:all
```

> Load `build/` as an unpacked Chrome extension — see [Extension Development Basics](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/).

## Testing

```bash
bun run test:unit   # vitest unit tests
```

Tests live alongside their modules in `src/lib/*.test.ts`. The WBI signing module (`src/lib/wbi.test.ts`) verifies the documented Bilibili mixin-key and `w_rid` test vectors.

## Architecture

| Path | Purpose |
|---|---|
| `src/routes/` | SvelteKit pages (extension popup/options) |
| `src/content-script/seed.ts` | Isolated-world MV3 content script — injects `main.ts` into the page |
| `src/content-script/main.ts` | Page-world logic: XHR interception, page-state parsing, playurl fetch, UI render |
| `src/lib/wbi.ts` | WBI parameter signing (mixin key + `w_rid`/`wts`) |
| `src/lib/bilibili-api.ts` | UGC + bangumi playurl API clients |
| `src/lib/download.ts` | Normal + advanced (merge) download flows |
| `src/lib/ffmpeg.ts` | WASM FFmpeg audio/video merge |
| `src/lib/host.ts` | Shadow-DOM helper UI |
| `src/lib/schemas.ts` | Zod schemas (DashData, DurlSegment, ErrorCode, etc.) |
| `vite.content.config.ts` | Vite config for the content-script bundle |
| `tsconfig.content.json` | Standalone tsconfig for content-script type-checking |
| `static/manifest.json` | MV3 manifest |
| `build/` | Built extension output (load as unpacked) |

See [`AGENTS.md`](./AGENTS.md) for the full agent development guide.
