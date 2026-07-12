import { z } from 'zod';

// ── Quality labels ──
export const QUALITY_LABELS: Record<number, string> = {
	16: '360P 流畅',
	32: '480P 标清',
	64: '720P 准高清',
	80: '1080P 高清',
	112: '1080P 高码率',
	120: '4K 超高清',
	125: 'HDR 真彩'
};

// ── DOM IDs ──
export const HOST_ELEMENT_ID = 'bilibili-helper-host';
export const CONTENT_SCRIPT_ELEMENT_ID = 'bilibili-helper-ext-content-script';

// ── File names ──
export const FFMPEG_WORKER = 'ffmpeg.worker.js';
export const FFMPEG_CORE_JS = 'ffmpeg-core.js';
export const FFMPEG_CORE_WASM = 'ffmpeg-core.wasm';

// ── API ──
export const UGC_PLAY_URL_API = 'https://api.bilibili.com/x/player/wbi/playurl';
export const BANGUMI_PLAY_URL_API = 'https://api.bilibili.com/pgc/player/web/v2/playurl';
export const NAV_API = 'https://api.bilibili.com/x/web-interface/nav';
// Back-compat: retained for any external references.
export const PLAY_URL_API = UGC_PLAY_URL_API;

// ── Settings keys ──
export const SETTING_DOWNLOAD_MODE = 'bilibili_helper_download_mode';
export const SETTING_MERGE_MODE = 'bilibili_helper_merge_mode';
export const SETTING_SHOW = 'bilibili_helper_show';

// ── Fetch defaults ──
export const FETCH_DEFAULTS: RequestInit = { credentials: 'include' };

// For CDN stream downloads (upos-sz-*.bilivideo.com etc.). Bilibili's CDN validates
// the Referer header; from page context the browser auto-sends the document's origin,
// but we pin the referrer policy to guarantee it (Bilibili pages sometimes set a
// restrictive <meta name="referrer">). `Referer` is a forbidden header for fetch(),
// so we set `referrer` directly instead.
export const STREAM_FETCH_DEFAULTS: RequestInit = {
	credentials: 'include',
	referrer: 'https://www.bilibili.com/',
	referrerPolicy: 'unsafe-url'
};

// ── Size constants ──
export const GB = 1024 * 1024 * 1024;
export const MB = 1024 * 1024;
export const KB = 1024;