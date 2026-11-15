import { FETCH_DEFAULTS, UGC_PLAY_URL_API, BANGUMI_PLAY_URL_API, QUALITY_LABELS } from './constants';
import { DashDataSchema, ErrorCode } from './schemas';
import type { DashStream, DurlSegment } from './schemas';
import { signWbi, clearWbiKeys, fetchWbiKeys } from './wbi';
import { extractInitialState } from './bilibili-types';
import { logInfo, logWarn, logError, logFetch } from './logger';

const MODULE = 'api';

export interface PlayUrlResult {
	code: number;
	dash?: { audio: DashStream; video: DashStream };
	durl?: DurlSegment[];
	qualityDescription?: string;
	message?: string;
}

/** Normalize a dash stream's URL/backup fields to the snake_case form regardless of API casing. */
function normalizeStream(stream: DashStream): DashStream {
	return {
		...stream,
		base_url: stream.base_url ?? stream.baseUrl ?? '',
		backup_url: stream.backup_url ?? stream.backupUrl
	};
}

function buildDashResult(dash: unknown, quality: number, codecid: number): PlayUrlResult {
	const parsedDash = DashDataSchema.safeParse(dash);
	if (!parsedDash.success) {
		logWarn(MODULE, 'buildDashResult: invalid DASH data');
		return { code: ErrorCode.INVALID_RESPONSE, message: '该视频暂时不支持下载' };
	}

	const { audio, video: videos } = parsedDash.data;
	const video =
		videos.find(
			(v) => `${v.codecid ?? ''}` === `${codecid}` && `${v.id}` === `${quality}`
		) ?? videos[0];
	const audioStream = audio[0];

	if (!audioStream || !video) {
		logWarn(MODULE, 'buildDashResult: no matching audio/video', {
			quality,
			codecid,
			audioCount: audio.length,
			videoCount: videos.length,
			videoIds: videos.map((v) => v.id)
		});
		return { code: ErrorCode.INVALID_RESPONSE, message: '该视频暂时不支持下载' };
	}

	logInfo(MODULE, 'buildDashResult: matched', {
		videoId: video.id,
		videoCodecid: video.codecid,
		audioId: audioStream.id,
		qualityLabel: QUALITY_LABELS[video.id] ?? ''
	});

	return {
		code: ErrorCode.OK,
		dash: { audio: normalizeStream(audioStream), video: normalizeStream(video) },
		qualityDescription: QUALITY_LABELS[video.id] ?? ''
	};
}

function buildDurlResult(durl: DurlSegment[]): PlayUrlResult {
	logInfo(MODULE, 'buildDurlResult: segments', durl.length);
	return {
		code: ErrorCode.OK,
		durl,
		qualityDescription: ''
	};
}

/** True if the user is not logged in (no SESSDATA cookie). */
function isLoggedOut(): boolean {
	return !document.cookie.includes('SESSDATA');
}

/** Apply quality-label updates from an API response into the shared QUALITY_LABELS map. */
function updateQualityLabels(data: {
	accept_quality?: number[];
	accept_description?: string[];
	support_formats?: Array<{ quality: number; new_description?: string; display_desc?: string }>;
}): void {
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
}

interface PlayUrlJson {
	code: number;
	message?: string;
	data?: {
		dash?: unknown;
		durl?: DurlSegment[];
		video_codecid?: number;
		accept_quality?: number[];
		accept_description?: string[];
		support_formats?: Array<{ quality: number; new_description?: string; display_desc?: string }>;
	};
}

/** Parse a UGC playurl JSON response into a PlayUrlResult. */
function parseUgcResponse(json: PlayUrlJson, quality: number): PlayUrlResult {
	if (json.code !== ErrorCode.OK) {
		logWarn(MODULE, 'UGC API returned error code', json.code, json.message);
		if (json.code === ErrorCode.VIP_ONLY) {
			return {
				code: ErrorCode.VIP_ONLY,
				message:
					'该视频只能登陆大会员账号之后下载，如登录后仍然报错，可以尝试清除浏览器cookies和缓存后重试'
			};
		}
		return { code: json.code, message: json.message ?? '未知错误' };
	}

	const data = json.data!;
	updateQualityLabels(data);

	if (data.dash) return buildDashResult(data.dash, quality, data.video_codecid ?? 0);
	if (data.durl) return buildDurlResult(data.durl);
	return { code: ErrorCode.UNKNOWN, message: '未知错误' };
}

/**
 * Fetch play URL info for a UGC (normal) video, with WBI signing.
 * Retries once with fresh WBI keys on risk-control errors.
 */
export async function fetchUgcPlayUrl(
	avid: number | undefined,
	bvid: string | undefined,
	cid: number,
	quality = 120
): Promise<PlayUrlResult> {
	const params: Record<string, string> = {
		qn: String(quality),
		fnver: '0',
		fnval: '4048',
		fourk: '1',
		otype: 'json',
		cid: String(cid)
	};
	if (avid) params.avid = String(avid);
	if (bvid) params.bvid = bvid;
	if (isLoggedOut()) params.try_look = '1';

	logInfo(MODULE, 'fetchUgcPlayUrl', { avid, bvid, cid, quality, loggedOut: isLoggedOut() });

	const attempt = async (forceRefresh: boolean): Promise<PlayUrlResult> => {
		if (forceRefresh) {
			logWarn(MODULE, 'WBI key refresh triggered by risk-control error');
			clearWbiKeys();
		}
		const signed = await signWbi(params);
		const url = `${UGC_PLAY_URL_API}?${new URLSearchParams(signed).toString()}`;
		const done = logFetch(MODULE, url, 'GET');
		let response: Response;
		try {
			response = await window.fetch(url, FETCH_DEFAULTS);
		} catch (err) {
			done(null);
			logError(MODULE, 'fetchUgcPlayUrl network error', err);
			return { code: ErrorCode.FAILED_TO_FETCH, message: '网络请求失败' };
		}
		done(response);
		const json: PlayUrlJson = await response.json();

		// Risk-control / signature errors: refresh WBI keys and retry once.
		if (json.code === -509 || json.code === -403 || json.code === -352) {
			logWarn(MODULE, 'risk-control error', json.code, json.message, 'retrying with fresh WBI keys');
			if (!forceRefresh) return attempt(true);
		}
		return parseUgcResponse(json, quality);
	};

	return attempt(false);
}

interface BangumiPlayUrlJson {
	code: number;
	message?: string;
	result?: {
		video_info: {
			dash?: unknown;
			durl?: DurlSegment[];
			video_codecid?: number;
			accept_quality?: number[];
			accept_description?: string[];
			support_formats?: Array<{ quality: number; new_description?: string; display_desc?: string }>;
		};
	};
	data?: {
		dash?: unknown;
		durl?: DurlSegment[];
		video_codecid?: number;
		accept_quality?: number[];
		accept_description?: string[];
		support_formats?: Array<{ quality: number; new_description?: string; display_desc?: string }>;
	};
}

/**
 * Fetch play URL info for a bangumi (番剧/PGC) episode via the v2 endpoint.
 * No WBI signing required for the v2 PGC endpoint, only login cookies.
 */
export async function fetchBangumiPlayUrl(
	epId: number,
	cid: number,
	quality = 120
): Promise<PlayUrlResult> {
	logInfo(MODULE, 'fetchBangumiPlayUrl', { epId, cid, quality, loggedOut: isLoggedOut() });

	const params = new URLSearchParams({
		qn: String(quality),
		fnver: '0',
		fnval: '4048',
		fourk: '1',
		otype: 'json',
		cid: String(cid),
		ep_id: String(epId),
		module: 'bangumi',
		session: '',
		from_client: 'BROWSER',
		support_multi_audio: 'true'
	});
	if (isLoggedOut()) params.set('try_look', '1');

	const url = `${BANGUMI_PLAY_URL_API}?${params.toString()}`;
	const done = logFetch(MODULE, url, 'GET');
	let response: Response;
	try {
		response = await window.fetch(url, FETCH_DEFAULTS);
	} catch (err) {
		done(null);
		logError(MODULE, 'fetchBangumiPlayUrl network error', err);
		return { code: ErrorCode.FAILED_TO_FETCH, message: '网络请求失败' };
	}
	done(response);
	const json: BangumiPlayUrlJson = await response.json();

	if (json.code !== ErrorCode.OK) {
		logWarn(MODULE, 'bangumi API error', json.code, json.message);
		if (json.code === ErrorCode.VIP_ONLY) {
			return {
				code: ErrorCode.VIP_ONLY,
				message:
					'该视频只能登陆大会员账号之后下载，如登录后仍然报错，可以尝试清除浏览器cookies和缓存后重试'
			};
		}
		return { code: json.code, message: json.message ?? '未知错误' };
	}

	// v2 nests under result.video_info; fall back to data for older shapes.
	const info = json.result?.video_info ?? json.data ?? {};
	logInfo(MODULE, 'bangumi playurl response', {
		hasDash: !!info.dash,
		hasDurl: !!info.durl,
		qualityLabels: info.accept_quality
	});
	updateQualityLabels(info);

	if (info.dash) return buildDashResult(info.dash, quality, info.video_codecid ?? 0);
	if (info.durl) return buildDurlResult(info.durl);
	return { code: ErrorCode.UNKNOWN, message: '未知错误' };
}

/** Back-compat wrapper: routes to the UGC fetcher. @deprecated use fetchUgcPlayUrl */
export async function fetchPlayUrl(
	avid: number | undefined,
	bvid: string | undefined,
	cid: number,
	quality = 120
): Promise<PlayUrlResult> {
	return fetchUgcPlayUrl(avid, bvid, cid, quality);
}

/**
 * Fetch initial page state (bangumi data) by fetching the current page HTML.
 */
export async function fetchPageState(mode: 'next' | 'next2025' = 'next'): Promise<{
	code: number;
	data?: unknown;
	message?: string;
}> {
	logInfo(MODULE, 'fetchPageState', { mode });
	try {
		if (mode === 'next2025') {
			const win = window as unknown as { __PLAYURL_HYDRATE_DATA__?: unknown };
			if (win.__PLAYURL_HYDRATE_DATA__) {
				logInfo(MODULE, 'fetchPageState: found __PLAYURL_HYDRATE_DATA__ in window');
				return { code: 0, data: win.__PLAYURL_HYDRATE_DATA__ };
			}
		}

		const done = logFetch(MODULE, window.location.href, 'GET');
		let html: string;
		try {
			html = await (await window.fetch(window.location.href, FETCH_DEFAULTS)).text();
		} catch (err) {
			done(null);
			throw err;
		}
		done({ status: 200 } as Response);
		logInfo(MODULE, 'fetchPageState: page HTML length', html.length);

		const result = extractInitialState(html);
		logInfo(MODULE, 'fetchPageState: parse result', { code: result.code, hasData: !!result.data });
		return result;
	} catch (err) {
		logError(MODULE, '获取视频信息失败：', err);
		return { code: ErrorCode.FAILED_TO_FETCH, message: '网络请求失败' };
	}
}

// Re-export for any callers that need direct key access.
export { fetchWbiKeys };
