/// <reference types="chrome" />

import { FETCH_DEFAULTS, QUALITY_LABELS } from '$lib/constants';
import { ErrorCode } from '$lib/schemas';
import type { DashData, DurlSegment } from '$lib/schemas';
import {
	waitForElement,
	isBilibili,
	isVideoPage,
	isBangumiPage
} from '$lib/utils';
import { setupCleanup } from '$lib/ffmpeg';
import { showDownloadInfo, log, clearLogs } from '$lib/host';
import { fetchUgcPlayUrl, fetchBangumiPlayUrl } from '$lib/bilibili-api';
import type { PlayUrlResult } from '$lib/bilibili-api';
import { logInfo, logWarn, logError } from '$lib/logger';
import { dispatchContentScriptError } from '$lib/sentry-reporting';

const MODULE = 'main';

window.addEventListener('error', (event) => {
	if (!event.filename.includes('bilibili-helper-content-script')) return;
	dispatchContentScriptError(event.error ?? event.message, 'runtime');
});

window.addEventListener('unhandledrejection', (event) => {
	const stack = event.reason instanceof Error ? event.reason.stack ?? '' : '';
	if (!stack.includes('bilibili-helper-content-script')) return;
	dispatchContentScriptError(event.reason, 'runtime');
});

// ── Types ──

interface BangumiVideoInfo {
	ep_id?: number;
	dash?: DashData;
	durl?: DurlSegment[];
	avid?: number;
	cid?: number;
}

// ── State ──

const appState: { videoInfo: BangumiVideoInfo | null; interval: number } = {
	videoInfo: null,
	interval: 0
};

const pendingBlobUrls = new Set<string>();
const pendingUsedFiles = new Set<string>();

// ── Quality resolution ──

async function getQualityFromPlayer(): Promise<number | null> {
	const el = await waitForElement(
		'.squirtle-quality-select-list li.active, .bpx-player-ctrl-quality-menu .bpx-state-active'
	);
	if (!el) {
		logInfo(MODULE, 'getQualityFromPlayer: no quality element found');
		return null;
	}
	let quality = parseInt((el as HTMLElement).dataset.value ?? '0', 10);
	if (quality === 0) {
		const first = el.parentElement?.querySelector('li:first-child') as HTMLElement | null;
		if (first) quality = parseInt(first.dataset.value ?? '0', 10);
	}
	log('quality from player is', quality);
	return quality;
}

async function getPreferredQuality(): Promise<number> {
	let quality = 120;
	try {
		const settingsStr = localStorage.bilibili_player_settings;
		if (settingsStr && settingsStr !== 'undefined') {
			quality = JSON.parse(settingsStr).setting_config.defquality ?? 120;
			logInfo(MODULE, 'quality from localStorage', { quality });
		}
	} catch {
		logWarn(MODULE, 'failed to parse bilibili_player_settings');
	}
	const playerQ = await getQualityFromPlayer();
	const result = playerQ ?? quality;
	logInfo(MODULE, 'preferred quality resolved', { result });
	return result;
}

// ── Global page state fetcher ──

async function fetchInitialState(mode: 'next' | 'next2025' = 'next'): Promise<{
	code: number;
	data?: unknown;
	message?: string;
}> {
	logInfo(MODULE, 'fetchInitialState', { mode });
	try {
		if (mode === 'next2025') {
			const win = window as unknown as { __PLAYURL_HYDRATE_DATA__?: unknown };
			if (win.__PLAYURL_HYDRATE_DATA__) {
				logInfo(MODULE, 'using __PLAYURL_HYDRATE_DATA__ from window');
				return { code: 0, data: win.__PLAYURL_HYDRATE_DATA__ };
			}
		}

		// Try __INITIAL_STATE__ from the page context (contains videoData with aid/bvid/cid/title)
		const pageState = (window as unknown as Record<string, unknown>).__INITIAL_STATE__;
		if (pageState && (pageState as Record<string, unknown>).videoData) {
			logInfo(MODULE, 'using __INITIAL_STATE__ from window');
			return { code: 0, data: pageState };
		}

		// Try __playinfo__ from the page context (contains playurl dash/durl data)
		const playinfo = (window as unknown as { __playinfo__?: { data?: unknown } }).__playinfo__;
		if (playinfo?.data) {
			logInfo(MODULE, 'using __playinfo__ from window');
			return { code: 0, data: playinfo.data };
		}

		// Try __PLAYURL_HYDRATE_DATA__ from the page context
		const hydrateData = (window as unknown as Record<string, unknown>).__PLAYURL_HYDRATE_DATA__;
		if (hydrateData) {
			logInfo(MODULE, 'using __PLAYURL_HYDRATE_DATA__ from window');
			return { code: 0, data: hydrateData };
		}

		// Fallback: fetch HTML and try inline state patterns
		const html = await (await window.fetch(window.location.href, FETCH_DEFAULTS)).text();
		logInfo(MODULE, 'page HTML fetched', { length: html.length });

		// Try __playinfo__ inline in HTML
		const playinfoMatch = html.match(/window\.__playinfo__\s*=\s*(\{[\s\S]+?\});/);
		if (playinfoMatch) {
			try {
				const parsed = JSON.parse(playinfoMatch[1]);
				if (parsed?.data) {
					logInfo(MODULE, 'found __playinfo__ in HTML');
					return { code: 0, data: parsed.data };
				}
			} catch {
				logWarn(MODULE, '__playinfo__ JSON parse failed in HTML');
			}
		}

		// Try __INITIAL_STATE__ inline in HTML
		const initMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]+?\});/);
		if (initMatch) {
			try {
				const parsed = JSON.parse(initMatch[1]);
				logInfo(MODULE, 'found __INITIAL_STATE__ in HTML');
				return { code: 0, data: parsed };
			} catch {
				logWarn(MODULE, '__INITIAL_STATE__ JSON parse failed in HTML');
			}
		}

		// Try __NEXT_DATA__ format (older bangumi pages)
		const nextDataMatch = html.match(
			/<script id="__NEXT_DATA__" type="application\/json">([\s\S]+?)<\/script>/
		);
		if (nextDataMatch) {
			try {
				const nextData = JSON.parse(nextDataMatch[1]);
				const state = nextData.props?.pageProps?.dehydratedState?.queries?.[0]?.state;
				if (state) {
					logInfo(MODULE, 'found __NEXT_DATA__', { status: state.status });
					return {
						code: state.status === 'success' ? 0 : -1,
						data: state
					};
				}
			} catch {
				logWarn(MODULE, '__NEXT_DATA__ parse failed');
			}
		}

		logWarn(MODULE, 'no initial state found in page HTML');
		return {
			code: ErrorCode.INVALID_RESPONSE,
			message: '获取视频信息失败，可以尝试清除浏览器cookies和缓存后重试'
		};
	} catch (err) {
		logError(MODULE, 'fetchInitialState failed', err);
		return { code: ErrorCode.FAILED_TO_FETCH, message: '网络请求失败' };
	}
}

// ── Process play URL result ──

function processPlayUrlResult(
	dashData: { dash?: DashData; durl?: DurlSegment[]; accept_quality?: number[]; accept_description?: string[]; video_codecid?: number; support_formats?: Array<{ quality: number; new_description?: string; display_desc?: string }> } | null,
	quality: number
): PlayUrlResult {
	if (!dashData) {
		logWarn(MODULE, 'processPlayUrlResult: no data');
		return { code: ErrorCode.INVALID_RESPONSE, message: '该视频暂时不支持下载' };
	}

	const data = dashData;

	if (!data.dash && !data.durl) {
		logWarn(MODULE, 'processPlayUrlResult: no dash or durl', { dashData: JSON.stringify(dashData).slice(0, 500) });
		return { code: ErrorCode.UNKNOWN, message: '未知错误' };
	}

	// Update quality labels
	if (data.accept_quality && data.accept_description) {
		data.accept_quality.forEach((q, i) => {
			QUALITY_LABELS[q] = data.accept_description![i] ?? QUALITY_LABELS[q];
		});
	}
	if (data.support_formats) {
		for (const fmt of data.support_formats) {
			QUALITY_LABELS[fmt.quality] = fmt.new_description || fmt.display_desc || QUALITY_LABELS[fmt.quality];
		}
	}

	logInfo(MODULE, 'processPlayUrlResult: processing', { hasDash: !!data.dash, hasDurl: !!data.durl, quality });

	if (data.dash) {
		const video = data.dash.video.find(
			(v) => `${v.codecid}` === `${data.video_codecid}` && `${v.id}` === `${quality}`
		) ?? data.dash.video[0];
		const audio = data.dash.audio[0];

		logInfo(MODULE, 'DASH stream selected', {
			videoId: video?.id,
			videoCodecid: video?.codecid,
			audioId: audio?.id,
			videoCount: data.dash.video.length,
			audioCount: data.dash.audio.length
		});

		if (audio) {
			log('-'.repeat(20));
			log('audio:');
			log('    main link:', audio.base_url);
			audio.backup_url?.forEach((u, i) => {
				log(`    backup link ${i + 1}:`, u);
			});
		}
		if (video) {
			log('-'.repeat(20));
			log('video:');
			log('    main link:', video.base_url);
			video.backup_url?.forEach((u, i) => {
				log(`    backup link ${i + 1}:`, u);
			});
		}

		return {
			code: ErrorCode.OK,
			dash: { audio, video },
			qualityDescription: QUALITY_LABELS[video?.id ?? quality] ?? ''
		};
	}

	if (data.durl) {
		logInfo(MODULE, 'DURL segments', { count: data.durl.length });
		data.durl.forEach((seg, i) => {
			log(`video segment ${i + 1}:`);
			log('    main link:', seg.url);
			seg.backup_url?.forEach((u, j) => {
				log(`    backup link ${j + 1}:`, u);
			});
		});

		return {
			code: ErrorCode.OK,
			durl: data.durl,
			qualityDescription: QUALITY_LABELS[quality] ?? ''
		};
	}

	return { code: ErrorCode.UNKNOWN, message: '未知错误' };
}

// ── Video page processing ──

async function processVideoPage(): Promise<void> {
	logInfo(MODULE, 'processVideoPage: start');
	const state = await fetchInitialState();
	const quality = await getPreferredQuality();

	if (state.code !== ErrorCode.OK) {
		logWarn(MODULE, 'processVideoPage: initial state fetch failed', { code: state.code, message: state.message });
		showDownloadInfo({ code: state.code, message: state.message, quality: QUALITY_LABELS[quality] ?? '' });
		return;
	}

	const data = state.data as {
		videoData: { aid: number; bvid: string; cid: number; title: string; pages: Array<{ page: number; part: string; cid: number }> };
	};
	const videoData = data.videoData;
	const avid = videoData.aid;
	const bvid = videoData.bvid;
	let cid = videoData.cid;
	let pageNum: number | undefined;
	let pageTitle: string | undefined;

	if (videoData.pages.length > 1) {
		logInfo(MODULE, 'multi-page video detected', { pageCount: videoData.pages.length });
		const pMatch = location.search.match(/p=(\d+)/);
		let currentPage = videoData.pages[0];
		if (pMatch) {
			const found = videoData.pages.find((p) => String(p.page) === pMatch[1]);
			if (found) currentPage = found;
		}
		pageNum = currentPage.page;
		pageTitle = currentPage.part;
		cid = currentPage.cid;
		logInfo(MODULE, 'selected page', { pageNum, cid, pageTitle });
	}

	logInfo(MODULE, 'video info', { avid, bvid, cid, quality });

	// ── Get playurl data ──
	// Strategy: try the page-embedded __playinfo__ first (no auth required, works
	// for logged-out users), then fall back to the WBI-signed API call.
	let playResult: PlayUrlResult | null = null;

	// 1. Try __playinfo__ embedded in the page by Bilibili SSR.
	try {
		const playinfo = (
			window as unknown as {
				__playinfo__?: {
					data?: {
						dash?: DashData;
						durl?: DurlSegment[];
						video_codecid?: number;
						accept_quality?: number[];
						accept_description?: string[];
						support_formats?: Array<{
							quality: number;
							new_description?: string;
							display_desc?: string;
						}>;
					};
				};
			}
		).__playinfo__;
		if (playinfo?.data && (playinfo.data.dash || playinfo.data.durl)) {
			logInfo(MODULE, 'using __playinfo__ from page context');
			playResult = processPlayUrlResult(playinfo.data, quality);
		} else {
			logInfo(MODULE, '__playinfo__ not available on page');
		}
	} catch (err) {
		logWarn(MODULE, '__playinfo__ parse failed', err);
	}

	// 2. Fall back to WBI-signed API call.
	if (!playResult || playResult.code !== ErrorCode.OK) {
		logInfo(MODULE, 'falling back to WBI API fetch');
		playResult = await fetchUgcPlayUrl(avid, bvid, cid, quality);
	}

	// ── Handle result ──
	if (playResult.code === ErrorCode.OK) {
		let title = videoData.title;
		if (pageNum !== undefined && pageTitle) {
			title = `${videoData.title}_P${pageNum}_${pageTitle}`;
		}
		logInfo(MODULE, 'ugc playurl success', { title, quality: playResult.qualityDescription });
		showDownloadInfo({
			code: playResult.code,
			title,
			quality: playResult.qualityDescription,
			dash: playResult.dash,
			durl: playResult.durl
		});
	} else {
		logWarn(MODULE, 'ugc playurl failed', { code: playResult.code, message: playResult.message });
		showDownloadInfo({ code: playResult.code, title: videoData.title, message: playResult.message });
	}
}

// ── Bangumi page processing ──

async function processBangumiPage(videoInfo?: BangumiVideoInfo | null): Promise<void> {
	const isNext2025 = !videoInfo;
	const mode: 'next' | 'next2025' = isNext2025 ? 'next2025' : 'next';
	logInfo(MODULE, 'processBangumiPage', { isNext2025, mode, hasInterceptedData: !!videoInfo });
	const state = await fetchInitialState(mode);
	const quality = await getPreferredQuality();

	if (state.code !== ErrorCode.OK) {
		logWarn(MODULE, 'processBangumiPage: initial state fetch failed', { code: state.code, message: state.message });
		showDownloadInfo({ code: state.code, message: state.message, quality: QUALITY_LABELS[quality] ?? '' });
		return;
	}

	let episodes: Array<{ ep_id: number; title?: string; titleFormat?: string; long_title?: string; share_copy?: string }> = [];
	let episodeInfo: { episode_id: number; index_title: string; long_title: string } | null = null;
	let mediaTitle = '';

	if (isNext2025) {
		const data = state.data as {
			result: { supplement: { ogv_episode_info: { episode_id: number; index_title: string; long_title: string } } };
		};
		episodeInfo = data.result.supplement.ogv_episode_info;
		mediaTitle = document.title.split('-')?.[0]?.trim() ?? '';
		logInfo(MODULE, 'next2025 episode info', { episodeId: episodeInfo?.episode_id, mediaTitle });
	} else {
		const data = state.data as {
			seasonInfo: { mediaInfo: { title: string; episodes: Array<{ ep_id: number; title?: string; titleFormat?: string; long_title?: string }> } };
		};
		episodes = data.seasonInfo.mediaInfo.episodes;
		mediaTitle = data.seasonInfo.mediaInfo.title;
		logInfo(MODULE, 'next format season info', { mediaTitle, episodeCount: episodes.length });
	}

	const epId = videoInfo?.ep_id ?? episodeInfo?.episode_id;
	const currentEp = isNext2025
		? { ...episodeInfo!, titleFormat: episodeInfo!.index_title, long_title: episodeInfo!.long_title }
		: episodes.find((ep) => epId === ep.ep_id);

	logInfo(MODULE, 'bangumi episode', { epId, quality: QUALITY_LABELS[quality] ?? quality });

	// Determine the cid to use. Prefer the intercepted XHR info, then the page state.
	let cid: number | undefined = videoInfo?.cid;
	if (cid === undefined && isNext2025) {
		const nextData = state.data as {
			result: { arc: { cid: number }; video_info: { dash?: DashData; durl?: DurlSegment[] } };
		};
		cid = nextData.result.arc.cid;
		logInfo(MODULE, 'cid from next2025 arc', { cid });
	}

	// Use the existing play URL data from the intercepted request if available; otherwise fetch fresh.
	let result: PlayUrlResult;
	if (videoInfo && videoInfo.dash) {
		logInfo(MODULE, 'using intercepted XHR playurl data');
		result = processPlayUrlResult(
			{ dash: videoInfo.dash, video_codecid: undefined, accept_quality: undefined, accept_description: undefined, support_formats: undefined },
			quality
		);
	} else if (epId !== undefined && cid !== undefined) {
		logInfo(MODULE, 'fetching bangumi playurl', { epId, cid, quality });
		result = await fetchBangumiPlayUrl(epId, cid, quality);
	} else {
		logWarn(MODULE, 'cannot determine epId or cid', { epId, cid });
		result = { code: ErrorCode.INVALID_RESPONSE, message: '未能获取番剧分集信息' };
	}

	if (result.dash || result.durl) {
		const title = isNext2025
			? `${mediaTitle}_${episodeInfo!.index_title}_${episodeInfo!.long_title}`
			: `${mediaTitle}_${currentEp?.titleFormat || (currentEp as { title?: string } | undefined)?.title || ''}_${currentEp?.long_title || ''}`;
		logInfo(MODULE, 'bangumi download info ready', { title, quality: result.qualityDescription });

		showDownloadInfo({
			code: result.code,
			title,
			dash: result.dash,
			durl: result.durl,
			quality: result.qualityDescription
		});
	} else {
		logWarn(MODULE, 'bangumi fetch failed', { code: result.code, message: result.message });
		showDownloadInfo({ code: result.code, title: mediaTitle, message: result.message });
	}
}

// ── Starting watcher ──

function interceptXMLHttpRequest(
	onPlayUrl: (data: BangumiVideoInfo) => void,
	originalXHR: typeof XMLHttpRequest,
	onReady: () => void
): void {
	let executed = false;

	logInfo(MODULE, 'XHR interception active, waiting for /playurl response');

	setTimeout(() => {
		if (!executed) {
			logInfo(MODULE, 'XHR timeout (3s) — no /playurl intercepted, falling back to fresh fetch');
			onReady();
		}
	}, 3000);

	window.XMLHttpRequest = class extends originalXHR {
		constructor() {
			super();
			this.addEventListener(
				'load',
				() => {
					if (this.responseURL.includes('/playurl')) {
						logInfo(MODULE, 'XHR intercepted /playurl', { responseURL: this.responseURL.slice(0, 200) });
						const params = new URLSearchParams(this.responseURL);
						const avid = params.get('avid');
						const cid = params.get('cid');
						const bvid = params.get('bvid');
						const epId = params.get('ep_id');

						const response = JSON.parse(this.responseText);
						logInfo(MODULE, 'XHR playurl response code', { code: response.code });
						const info = (response.result?.video_info || response.data || {}) as BangumiVideoInfo;
						info.avid = avid ? +avid : undefined;
						info.cid = cid ? +cid : undefined;
						if (bvid) (info as unknown as Record<string, unknown>).bvid = bvid;
						info.ep_id = epId ? +epId : undefined;

						logInfo(MODULE, 'intercepted video info', { avid: info.avid, cid: info.cid, epId: info.ep_id, hasDash: !!info.dash, hasDurl: !!info.durl });
						onPlayUrl(info);
						executed = true;
					}
				},
				{ capture: true, passive: true }
			);
		}
	};
}

function startWatching(
	onChange: () => void,
	timer: { interval: number }
): void {
	logInfo(MODULE, 'startWatching: setting up quality and URL change observers');

	// Monitor URL/page changes — only fire if URL actually changed
	let lastUrl = window.location.href;
	timer.interval = window.setInterval(() => {
		const currentUrl = window.location.href;
		if (currentUrl !== lastUrl) {
			logInfo(MODULE, 'URL change detected', { from: lastUrl, to: currentUrl });
			lastUrl = currentUrl;
			clearLogs();
			window.setTimeout(onChange, 0);
		}
	}, 1000);

	// Monitor quality label changes
	waitForElement('.bpx-player-ctrl-quality-result').then((el) => {
		if (!el) {
			logWarn(MODULE, 'startWatching: quality label element not found');
			return;
		}
		let lastText = el.textContent ?? '';
		logInfo(MODULE, 'startWatching: quality observer attached');

		new MutationObserver((mutations) => {
			const text = mutations[0]?.addedNodes?.[0]?.textContent ?? lastText;
			if (lastText !== text) {
				logInfo(MODULE, 'quality label changed', { from: lastText, to: text });
				lastText = text;
				clearLogs();
				onChange();
			}
		}).observe(el, { childList: true });
	});
}

// ── Entry point ──

(async function main(win: Window) {
	logInfo(MODULE, 'content script starting', { url: win.location.href, userAgent: win.navigator.userAgent.slice(0, 80) });
	const originalXHR = XMLHttpRequest;

	const refresh = async (): Promise<void> => {
		if (!isBilibili()) {
			logWarn(MODULE, 'refresh: not on bilibili.com, skipping');
			return;
		}

		if (isVideoPage()) {
			logInfo(MODULE, 'page type: video (UGC)');
			await processVideoPage();
		} else if (isBangumiPage()) {
			logInfo(MODULE, 'page type: bangumi');
			await processBangumiPage(appState.videoInfo);
		} else {
			logInfo(MODULE, 'page type: other (not video or bangumi), waiting for player');
		}
	};

	if (isBangumiPage()) {
		logInfo(MODULE, 'setting up XHR interception for bangumi page');
		interceptXMLHttpRequest(
			(info) => {
				appState.videoInfo = info;
				waitForElement(
					'#bilibili-player .squirtle-quality-wrap, #bilibili-player .bpx-player-ctrl-quality'
				).then(() => {
					logInfo(MODULE, 'bangumi player ready, refreshing');
					refresh();
				});
					},
			originalXHR,
			() => {
				waitForElement(
					'#bilibili-player .squirtle-quality-wrap, #bilibili-player .bpx-player-ctrl-quality'
				).then(() => {
					logInfo(MODULE, 'bangumi ready (fallback), refreshing');
					refresh();
				});
			}
		);
	} else {
		logInfo(MODULE, 'waiting for player element on non-bangumi page');
		waitForElement(
			'#bilibili-player .squirtle-quality-wrap, #bilibili-player .bpx-player-ctrl-quality'
		).then(() => {
			logInfo(MODULE, 'player ready, refreshing');
			refresh();
		});
	}

	logInfo(MODULE, 'starting watchers and FFmpeg cleanup');
	startWatching(refresh, appState);
	setupCleanup();
})(window);