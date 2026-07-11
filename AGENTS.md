# AGENTS.md — AI/Agent Development Guide

This file is for AI coding agents (Claude, Copilot, Cursor, etc.) working with this template repo. It provides conventions, architecture context, and automation tips.

## Overview

This is a **SvelteKit Chrome Extension template** using Svelte 5, Skeleton 3, Tailwind 4, and Vite. It builds into a static Chrome extension via `sveltekit-adapter-chrome-extension`.

## Project Structure

| Path | Purpose |
|---|---|
| `src/routes/` | SvelteKit pages (built as extension pages) |
| `src/app.html` | Root HTML shell |
| `src/app.css` | Global styles + Tailwind entry |
| `static/` | Static assets (icons, `manifest.json`) |
| `build/` | Built extension output (load as unpacked extension) |
| `vite.config.ts` | Vite + SvelteKit config |
| `svelte.config.js` | Adapter static config |

## Key Scripts

- `bun run dev` — dev server
- `bun run build` — production build
- `bun run package` — build + zip into `extension.zip`
- `bun run test:unit` — run vitest tests
- `bun run check` — type-check with svelte-check

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