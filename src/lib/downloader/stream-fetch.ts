/**
 * Robust stream fetcher for Bilibili CDN .m4s / .mp4 segments.
 *
 * The modern Bilibili CDN (upos-sz-mirror*.bilivideo.com) serves segments as
 * `206 Partial Content` with signed `deadline`-bounded URLs, and each stream
 * comes with a `backup_url` array. This fetcher:
 *
 *   - Tries the primary URL, then each backup URL in order on failure.
 *   - Streams the response body with a progress callback.
 *   - Falls back to a non-streaming arrayBuffer() if the reader is unavailable.
 *   - Honors STREAM_FETCH_DEFAULTS (Referer pinned to bilibili.com) so the CDN
 *     doesn't 403 the request.
 */

import { logInfo, logWarn, logError } from '../logger';
import { fetchStreamThroughExtension } from '../stream-download-client';

const MODULE = 'stream';

export interface ProgressInfo {
	/** Total bytes expected, if known. -1 when unknown. */
	total: number;
	/** Bytes received so far. */
	received: number;
	/** True once the response stream is exhausted. */
	done: boolean;
}

export type ProgressFn = (info: ProgressInfo) => void;

export interface FetchSegmentResult {
	blob: Blob;
	/** The URL that actually succeeded (primary or one of the backups). */
	usedUrl: string;
}

/**
 * Fetch a single URL with streaming progress and exponential backoff
 * on network errors, rate-limits and server errors. Does NOT handle
 * fallbacks (fetchSegment does that). Throws when all retries are
 * exhausted.
 */
async function fetchOne(url: string, onProgress?: ProgressFn, signal?: AbortSignal, maxRetries = 2): Promise<Blob> {
	for (let attempt = 0; ; attempt++) {
		let response: Response;
		try {
			response = await fetchStreamThroughExtension(url, signal);
		} catch (err) {
			if (signal?.aborted) throw err;
			// Network error (DNS / TCP / TLS failure) — retry with backoff.
			if (attempt < maxRetries) {
				const delay = Math.min(1000 * Math.pow(2, attempt), 10_000);
				logWarn(MODULE, `network error, retry ${attempt + 1}/${maxRetries} in ${delay}ms`, {
					url: url.slice(0, 80),
					error: (err as Error).message
				});
				await new Promise((r) => setTimeout(r, delay));
				continue;
			}
			throw err;
		}

		if (!response.ok) {
			const status = response.status;
			if (attempt < maxRetries && (status === 429 || status >= 500)) {
				const delay = Math.min(1000 * Math.pow(2, attempt), 30_000);
				logWarn(MODULE, `HTTP ${status}, retry ${attempt + 1}/${maxRetries} in ${delay}ms`, {
					url: url.slice(0, 80)
				});
				await new Promise((r) => setTimeout(r, delay));
				continue;
			}
			throw new Error(`HTTP ${status} ${response.statusText}`);
		}

		const contentLength = parseInt(response.headers.get('content-length') ?? '-1', 10);
		let received = 0;

		const reader = response.body?.getReader();
		if (!reader) {
			// No streaming: read whole body at once.
			logWarn(MODULE, 'no body reader, falling back to arrayBuffer', { url: url.slice(0, 80) });
			const buf = await response.arrayBuffer();
			onProgress?.({ total: buf.byteLength, received: buf.byteLength, done: true });
			return new Blob([buf]);
		}

		const chunks: Uint8Array[] = [];
		let aborted = false;

		try {
			for (;;) {
				const result = await reader.read();
				if (result.done) {
					onProgress?.({ total: contentLength, received, done: true });
					break;
				}
				chunks.push(result.value);
				received += result.value.byteLength;
				onProgress?.({ total: contentLength, received, done: false });
			}
		} catch (err) {
			aborted = true;
			logWarn(MODULE, `read stream error, retry ${attempt + 1}/${maxRetries}`, {
				url: url.slice(0, 80),
				error: (err as Error).message
			});
			await reader.cancel().catch(() => {});
			if (signal?.aborted) throw err;
			if (attempt < maxRetries) {
				continue;
			}
			throw err;
		}
		if (aborted) continue;

		const merged = new Blob(chunks as BlobPart[]);
		logInfo(MODULE, 'fetchOne complete', {
			url: url.slice(0, 80),
			received,
			blobSize: merged.size,
			contentLength
		});
		return merged;
	}
}

/**
 * Fetch a segment from a list of candidate URLs (primary first, then backups).
 *
 * On network/HTTP errors, advances to the next backup URL. Returns the Blob
 * and the URL that succeeded.
 */
export async function fetchSegment(
	urls: string[],
	onProgress?: ProgressFn,
	signal?: AbortSignal
): Promise<FetchSegmentResult> {
	if (urls.length === 0) throw new Error('fetchSegment: no URLs provided');

	let lastErr: unknown;
	for (let i = 0; i < urls.length; i++) {
		const url = urls[i];
		const isBackup = i > 0;
		if (isBackup) logWarn(MODULE, `trying backup URL ${i}`, { url: url.slice(0, 80) });
		try {
			const blob = await fetchOne(url, onProgress, signal);
			return { blob, usedUrl: url };
		} catch (err) {
			lastErr = err;
			logError(MODULE, `fetch failed for URL ${i}`, { url: url.slice(0, 80) }, err);
			if (signal?.aborted) throw err;
		}
	}
	throw new Error(`all segment URLs failed; last error: ${(lastErr as Error)?.message ?? lastErr}`);
}

/**
 * Collect all candidate URLs for a stream into a flat array: primary first,
 * then backups. Tolerates missing/empty fields.
 */
export function collectUrls(stream: {
	base_url?: string;
	baseUrl?: string;
	backup_url?: string[];
	backupUrl?: string[];
}): string[] {
	const primary = stream.base_url ?? stream.baseUrl ?? '';
	const backups = stream.backup_url ?? stream.backupUrl ?? [];
	const urls = [primary, ...backups].filter((u): u is string => !!u && typeof u === 'string');
	return urls;
}
