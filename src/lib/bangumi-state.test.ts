import { describe, expect, it } from 'vitest';
import { readNext2025BangumiInfo } from './bangumi-state';

describe('readNext2025BangumiInfo', () => {
	it('reads the episode and cid from Next 2025 page state', () => {
		expect(
			readNext2025BangumiInfo({
				result: {
					supplement: {
						ogv_episode_info: {
							episode_id: 123,
							index_title: 'Episode 1',
							long_title: 'The beginning'
						}
					},
					arc: { cid: 456 }
				}
			})
		).toEqual({
			episodeId: 123,
			cid: 456,
			indexTitle: 'Episode 1',
			longTitle: 'The beginning'
		});
	});

	it('returns null when the supplement or episode information is missing', () => {
		expect(readNext2025BangumiInfo({ result: { arc: { cid: 456 } } })).toBeNull();
		expect(readNext2025BangumiInfo({ result: { supplement: {}, arc: { cid: 456 } } })).toBeNull();
	});

	it('returns null for malformed state or missing identifiers', () => {
		expect(readNext2025BangumiInfo(undefined)).toBeNull();
		expect(
			readNext2025BangumiInfo({
				result: {
					supplement: { ogv_episode_info: { episode_id: '123' } },
					arc: {}
				}
			})
		).toBeNull();
	});

	it('uses empty strings for optional title fields', () => {
		expect(
			readNext2025BangumiInfo({
				result: {
					supplement: { ogv_episode_info: { episode_id: 123 } },
					arc: { cid: 456 }
				}
			})
		).toMatchObject({ episodeId: 123, cid: 456, indexTitle: '', longTitle: '' });
	});
});
