import { VideoPageDataSchema, type VideoPageData } from './schemas';

export function parseVideoPageData(data: unknown): VideoPageData | null {
	const state = data as { videoData?: unknown } | null | undefined;
	const result = VideoPageDataSchema.safeParse(state?.videoData);
	return result.success ? result.data : null;
}
