import { z } from 'zod';
import { logInfo, logWarn, logError } from './logger';

const MODULE = 'btypes';

/**
 * Parsed response from a Bilibili API call or page scrape.
 */
export interface ApiResult<T = unknown> {
	code: number;
	data?: T;
	message?: string;
}

/**
 * Zod schemas for the __INITIAL_STATE__ data embedded in Bilibili pages.
 */

const SeasonEpisodeSchema = z.object({
	ep_id: z.number(),
	title: z.string().optional(),
	titleFormat: z.string().optional(),
	long_title: z.string().optional(),
	share_copy: z.string().optional()
});

const SeasonInfoSchema = z.object({
	mediaInfo: z.object({
		title: z.string(),
		episodes: z.array(SeasonEpisodeSchema)
	})
});

const NextDataEpisodeSchema = z.object({
	episode_id: z.number(),
	index_title: z.string(),
	long_title: z.string()
});

const NextSupplementSchema = z.object({
	supplement: z.object({
		ogv_episode_info: NextDataEpisodeSchema
	})
});

const VideoInfoResultSchema = z.object({
	result: z.object({
		video_info: z.object({
			dash: z.any().optional(),
			durl: z.any().optional(),
			avid: z.number().optional(),
			cid: z.number().optional()
		}),
		arc: z.object({
			aid: z.number(),
			cid: z.number()
		})
	})
});

/**
 * Page type detection
 */
export function detectBangumiPage(html: string, mode: 'next' | 'next2025'): ApiResult | null {
	try {
		if (mode === 'next2025') {
			const match = html.match(/<script>window\.__INITIAL_STATE__=(.+?)<\/script>/);
			if (!match) {
				logInfo(MODULE, 'detectBangumiPage(next2025): no __INITIAL_STATE__ found');
				return null;
			}
			const raw = match[1].replace(
				/;\(function\(\)\{var s;\(s=document\.currentScript\|\|document\.scripts\[document\.scripts\.length-1\]\)\.parentNode\.removeChild\(s\);\}\)\(\);/,
				''
			);
			const parsed = JSON.parse(raw);
			logInfo(MODULE, 'detectBangumiPage(next2025): parsed successfully');
			return { code: 0, data: parsed };
		}

		const match = html.match(
			/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/
		);
		if (!match) {
			logInfo(MODULE, 'detectBangumiPage(next): no __NEXT_DATA__ found');
			return null;
		}

		const nextData = JSON.parse(match[1]);
		const state = nextData.props.pageProps.dehydratedState.queries[0].state;
		logInfo(MODULE, 'detectBangumiPage(next): parsed', { status: state.status });
		return {
			code: state.status === 'success' ? 0 : -1,
			data: state
		};
	} catch (err) {
		logWarn(MODULE, 'detectBangumiPage: parse error', err);
		return null;
	}
}

/**
 * Parse INITIAL_STATE from standalone page HTML.
 */
export function extractInitialState(
	html: string
): { code: number; data?: unknown; message?: string } {
	// Try next2025 format
	try {
		const match = html.match(/<script>window\.__INITIAL_STATE__=(.+?)<\/script>/);
		if (match) {
			const raw = match[1].replace(
				/;\(function\(\)\{var s;\(s=document\.currentScript\|\|document\.scripts\[document\.scripts\.length-1\]\)\.parentNode\.removeChild\(s\);\}\)\(\);/,
				''
			);
			logInfo(MODULE, 'extractInitialState: matched __INITIAL_STATE__ (next2025)');
			return { code: 0, data: JSON.parse(raw) };
		}
	} catch (err) {
		logWarn(MODULE, 'extractInitialState: next2025 parse failed', err);
	}

	// Try __NEXT_DATA__ format
	try {
		const match = html.match(
			/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/
		);
		if (match) {
			const nextData = JSON.parse(match[1]);
			const state = nextData.props.pageProps.dehydratedState.queries[0].state;
			logInfo(MODULE, 'extractInitialState: matched __NEXT_DATA__', { status: state.status });
			return {
				code: state.status === 'success' ? 0 : -1,
				data: state
			};
		}
	} catch (err) {
		logWarn(MODULE, 'extractInitialState: __NEXT_DATA__ parse failed', err);
	}

	logWarn(MODULE, 'extractInitialState: no known state format found');
	return {
		code: -2,
		message: '获取视频信息失败，可以尝试清除浏览器cookies和缓存后重试'
	};
}