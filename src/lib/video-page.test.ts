import { describe, expect, it } from 'vitest';
import { parseVideoPageData } from './video-page';

const videoPageData = {
	aid: 1,
	bvid: 'BV123',
	cid: 2,
	title: 'A video',
	pages: [{ page: 1, part: 'Part one', cid: 2 }]
};

describe('parseVideoPageData', () => {
	it('returns valid video page metadata', () => {
		expect(parseVideoPageData({ videoData: videoPageData })).toEqual(videoPageData);
	});

	it.each([undefined, null, {}, { videoData: undefined }, { videoData: { aid: 1 } }])(
		'returns null when video page metadata is unavailable or malformed',
		(data) => {
			expect(parseVideoPageData(data)).toBeNull();
		}
	);
});
