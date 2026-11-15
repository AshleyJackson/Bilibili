import { logInfo, logWarn } from './logger';

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
 * Page type detection
 */
export function detectBangumiPage(html: string, mode: 'next' | 'next2025'): ApiResult | null {
	try {
		if (mode === 'next2025') {
			const match = html.match(/<script>window\.__INITIAL_STATE__=([\s\S]+?)<\/script>/);
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
			/<script id="__NEXT_DATA__" type="application\/json">([\s\S]+?)<\/script>/
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
		const match = html.match(/<script>window\.__INITIAL_STATE__=([\s\S]+?)<\/script>/);
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
			/<script id="__NEXT_DATA__" type="application\/json">([\s\S]+?)<\/script>/
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