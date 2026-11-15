# Privacy Policy

**Last updated:** November 15, 2026

## Overview

bilibili哔哩哔哩下载助手 ("the Extension") is a Chrome extension that allows users to download videos from bilibili.com. We are committed to protecting your privacy.

## Data Collection

**The Extension does not collect, store, transmit, or sell any personal data.** Specifically:

- We do not collect personally identifiable information (name, email, address, etc.)
- We do not collect browsing history
- We do not collect cookies or authentication tokens
- We do not track user behavior or analytics
- We do not use any third-party analytics or tracking services

## Data Access

The Extension accesses the following data solely to perform its core function of downloading videos:

- **Bilibili page data** (`window.__INITIAL_STATE__`, `window.__playinfo__`): Read from the page context to identify the video being viewed and retrieve stream URLs. This data is used only within the browser session and is never transmitted externally.
- **Video stream URLs**: Read from Bilibili's CDN servers to download the selected video. Downloads happen directly between the user's browser and Bilibili's CDN — no intermediary servers are involved.

## Data Storage

- All processing occurs locally in the user's browser.
- Downloaded video files are saved directly to the user's local filesystem via the browser's download API.
- No data is stored on any external server operated by us or any third party.

## Third-Party Services

The Extension uses FFmpeg (compiled to WebAssembly) to merge audio and video streams. FFmpeg runs entirely in-browser using a Web Worker — no data is sent to any external service.

## Permissions

The Extension requests the following browser permissions:

| Permission                                                     | Purpose                                                                                                  |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Access to `*.bilibili.com` pages (content script)              | Read video metadata and stream URLs from the page                                                        |
| Access to `*.bilivideo.com` and Bilibili's Akamai mirror hosts | Fetch selected video streams through the extension service worker when page-origin CORS blocks downloads |
| Access to the Sentry ingest endpoint                           | Send sanitized runtime error reports                                                                     |
| `web_accessible_resources` (JS, CSS, WASM files)               | Serve FFmpeg assets to the page context for in-browser video merging                                     |

Stream downloads and merging still run locally in the browser. The extension does not use an intermediary download server.

## Changes to This Policy

We may update this privacy policy from time to time. Changes will be reflected by updating the "Last updated" date above.

## Contact

If you have questions about this privacy policy, please open an issue on the Extension's GitHub repository.
