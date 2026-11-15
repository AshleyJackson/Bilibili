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
export const SETTING_SHOW = 'bilibili_helper_show';

// ── Fetch defaults ──
export const FETCH_DEFAULTS: RequestInit = { credentials: 'include' };

// For CDN stream downloads (upos-sz-*.bilivideo.com etc.). Bilibili's CDN validates
// the Referer header. The extension service worker also installs a scoped
// declarativeNetRequest rule because extension fetch() does not reliably send its
// RequestInit.referrer value.
export const STREAM_FETCH_DEFAULTS: RequestInit = {
	credentials: 'include',
	referrer: 'https://www.bilibili.com/',
	referrerPolicy: 'unsafe-url'
};

// ── Size constants ──
export const GB = 1024 * 1024 * 1024;
export const MB = 1024 * 1024;
export const KB = 1024;
