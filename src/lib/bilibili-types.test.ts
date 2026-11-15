import { describe, expect, it, vi } from 'vitest';
import { detectBangumiPage, extractInitialState } from './bilibili-types';

vi.mock('./logger', () => ({
	logInfo: vi.fn(),
	logWarn: vi.fn(),
	logError: vi.fn()
}));

function nextDataHtml(state: unknown): string {
	const payload = {
		props: {
			pageProps: {
				dehydratedState: {
					queries: [{ state }]
				}
			}
		}
	};
	return `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify(payload)}</script>`;
}

describe('detectBangumiPage', () => {
	it('extracts state from the Next.js payload', () => {
		const state = { status: 'success', data: { episode: 1 } };

		expect(detectBangumiPage(nextDataHtml(state), 'next')).toEqual({
			code: 0,
			data: state
		});
	});

	it('marks an unsuccessful Next.js query with a nonzero code', () => {
		const state = { status: 'error' };

		expect(detectBangumiPage(nextDataHtml(state), 'next')).toEqual({
			code: -1,
			data: state
		});
	});

	it('parses the next2025 initial state', () => {
		const state = { season: { title: 'series' } };
		const html = `<script>window.__INITIAL_STATE__=${JSON.stringify(state)}</script>`;

		expect(detectBangumiPage(html, 'next2025')).toEqual({ code: 0, data: state });
	});

	it('returns null for missing or malformed page state', () => {
		expect(detectBangumiPage('<html></html>', 'next')).toBeNull();
		expect(detectBangumiPage('<script id="__NEXT_DATA__">{bad}</script>', 'next')).toBeNull();
	});
});

describe('extractInitialState', () => {
	it('extracts and cleans next2025 initial state', () => {
		const state = { aid: 42, title: 'video' };
		const cleanup =
			';(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);})();';
		const html = `<script>window.__INITIAL_STATE__=${JSON.stringify(state)}${cleanup}</script>`;

		expect(extractInitialState(html)).toEqual({ code: 0, data: state });
	});

	it('falls back to the Next.js payload after malformed initial state', () => {
		const state = { status: 'success', data: { aid: 42 } };
		const html = `<script>window.__INITIAL_STATE__={bad}</script>${nextDataHtml(state)}`;

		expect(extractInitialState(html)).toEqual({ code: 0, data: state });
	});

	it('preserves an unsuccessful Next.js query state', () => {
		const state = { status: 'error', error: 'not found' };

		expect(extractInitialState(nextDataHtml(state))).toEqual({ code: -1, data: state });
	});

	it('returns a localized error when neither page format is present', () => {
		expect(extractInitialState('<html></html>')).toMatchObject({
			code: -2,
			message: expect.stringContaining('获取视频信息失败')
		});
	});
});
