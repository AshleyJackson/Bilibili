/**
 * Download orchestration for Bilibili streams, decoupled from UI rendering.
 *
 * Three flows:
 *   - downloadStream: fetch a single segment (primary + backup fallback chain).
 *   - downloadAndMerge: fetch audio + video in parallel, then merge via FFmpeg.
 *   - downloadDurlSegments: fetch a sequence of DURL segments and concatenate.
 *
 * Progress is reported via callbacks so the UI layer can render it however it
 * likes. This module never touches the DOM.
 */

import { fetchSegment, collectUrls } from './stream-fetch';
import { mergeAudioVideo } from '../ffmpeg';
import { getInternals } from '../utils';
import { logInfo } from '../logger';

const MODULE = 'dl-orch';

export interface SegmentDescriptor {
	url: string;
	/** Backup URLs, tried in order if the primary fails. */
	backups?: string[];
	/** Expected size in bytes, if known (for progress before headers arrive). */
	size?: number;
}

export type DownloadProgressFn = (received: number, total: number) => void;

export interface DownloadBlobFn {
	(data: Uint8Array, filename: string, onDone?: () => void): void;
}

export interface ProgressSink {
	/** Called with status text; UI renders it. */
	setStatus(text: string): void;
}

/** Normalize a stream (audio/video) into a SegmentDescriptor. */
export function streamToSegment(stream: {
	base_url?: string;
	baseUrl?: string;
	backup_url?: string[];
	backupUrl?: string[];
	size?: number;
}): SegmentDescriptor {
	const urls = collectUrls(stream);
	return {
		url: urls[0] ?? '',
		backups: urls.slice(1),
		size: stream.size
	};
}

/**
 * Download a single segment to a Blob, with primary→backup fallback and progress.
 */
export async function downloadStream(
	segment: SegmentDescriptor,
	onProgress?: DownloadProgressFn
): Promise<Blob> {
	const urls = [segment.url, ...(segment.backups ?? [])].filter(Boolean);
	if (urls.length === 0) {
		throw new Error('downloadStream: segment has no usable URLs');
	}
	logInfo(MODULE, 'downloadStream start', { urlCount: urls.length, size: segment.size });

	return fetchSegment(
		urls,
		({ received, total, done }) => {
			if (!done) onProgress?.(received, total);
		}
	).then((r) => r.blob);
}

/**
 * Download audio + video in parallel, then merge into a single .mp4.
 * Returns the merged ArrayBuffer and a cleanup function for FFmpeg temp files.
 */
export async function downloadAndMerge(
	segments: { audio: SegmentDescriptor; video: SegmentDescriptor },
	onProgress?: (which: 'audio' | 'video', received: number, total: number) => void,
	onMerging?: () => void
): Promise<{ data: ArrayBuffer; cleanup: () => void }> {
	logInfo(MODULE, 'downloadAndMerge start', {
		audioUrl: segments.audio.url.slice(0, 80),
		videoUrl: segments.video.url.slice(0, 80)
	});

	const [audioBlob, videoBlob] = await Promise.all([
		downloadStream(segments.audio, (r, t) => onProgress?.('audio', r, t)).catch((err) => {
			throw new Error(`audio download failed: ${(err as Error).message}`);
		}),
		downloadStream(segments.video, (r, t) => onProgress?.('video', r, t)).catch((err) => {
			throw new Error(`video download failed: ${(err as Error).message}`);
		})
	]);

	logInfo(MODULE, 'downloadAndMerge: both streams downloaded', {
		audioSize: audioBlob.size,
		videoSize: videoBlob.size
	});
	onMerging?.();

	const { baseUrl } = getInternals();
	const [data, cleanup] = await mergeAudioVideo(baseUrl, audioBlob, videoBlob);
	logInfo(MODULE, 'downloadAndMerge: merge complete', { mergedSize: data.byteLength });
	return { data, cleanup };
}

/**
 * Download a list of DURL segments and concatenate them into one Blob.
 * Used for non-DASH (single-file or multi-segment MP4) responses.
 */
export async function downloadDurlSegments(
	segments: SegmentDescriptor[],
	onProgress?: (index: number, received: number, total: number) => void
): Promise<Blob> {
	logInfo(MODULE, 'downloadDurlSegments start', { count: segments.length });
	// Download all segments in parallel — much faster than sequential per-segment.
	const blobs = await Promise.all(
		segments.map((seg, i) =>
			downloadStream(seg, (r, t) => onProgress?.(i, r, t)).catch((err) => {
				throw new Error(`segment ${i} download failed: ${(err as Error).message}`);
			})
		)
	);
	const combined = new Blob(blobs);
	logInfo(MODULE, 'downloadDurlSegments complete', { totalSize: combined.size });
	return combined;
}

/** Derive a file extension from a segment URL, mapping .m4s → .mp4. */
export function extensionForUrl(url: string): string {
	const ext = new URL(url).pathname.toLowerCase().match(/\.[a-z0-9]+?$/)?.[0] ?? '';
	return ext === '.m4s' ? '.mp4' : ext;
}

/** Re-export for callers that need the raw segment fetcher. */
export { fetchSegment } from './stream-fetch';
export type { ProgressFn } from './stream-fetch';
