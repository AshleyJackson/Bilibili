export interface Next2025BangumiInfo {
	episodeId: number;
	cid: number;
	indexTitle: string;
	longTitle: string;
}

export function readNext2025BangumiInfo(data: unknown): Next2025BangumiInfo | null {
	if (typeof data !== 'object' || data === null) return null;

	const result = (data as { result?: unknown }).result;
	if (typeof result !== 'object' || result === null) return null;

	const { supplement, arc } = result as { supplement?: unknown; arc?: unknown };
	if (typeof supplement !== 'object' || supplement === null || typeof arc !== 'object' || arc === null) {
		return null;
	}

	const episodeInfo = (supplement as { ogv_episode_info?: unknown }).ogv_episode_info;
	if (typeof episodeInfo !== 'object' || episodeInfo === null) return null;

	const {
		episode_id: episodeId,
		index_title: indexTitle,
		long_title: longTitle
	} = episodeInfo as {
		episode_id?: unknown;
		index_title?: unknown;
		long_title?: unknown;
	};
	const cid = (arc as { cid?: unknown }).cid;

	if (
		typeof episodeId !== 'number' ||
		!Number.isFinite(episodeId) ||
		episodeId <= 0 ||
		typeof cid !== 'number' ||
		!Number.isFinite(cid) ||
		cid <= 0
	) {
		return null;
	}

	return {
		episodeId,
		cid,
		indexTitle: typeof indexTitle === 'string' ? indexTitle : '',
		longTitle: typeof longTitle === 'string' ? longTitle : ''
	};
}
