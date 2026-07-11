import type { DashStream, DurlSegment } from './schemas';
import { FFMPEG_WORKER, FFMPEG_CORE_JS, FFMPEG_CORE_WASM, FFMPEG_CORE_WORKER } from './constants';
import { streamDownload } from './fetch-utils';
import { getInternals, downloadBlob, formatSize } from './utils';
import { mergeAudioVideo } from './ffmpeg';
import { logInfo, logWarn, logError } from './logger';

const MODULE = 'download';

/**
 * Download a single stream (advanced mode) with progress.
 */
export async function downloadSingle(
	linkEl: HTMLAnchorElement,
	segment: { url: string; size?: number },
	filename: string,
	progressEl: HTMLElement
): Promise<void> {
	linkEl.classList.add('disabled');
	logInfo(MODULE, 'downloadSingle start', { filename, size: segment.size });
	try {
		const blob = await streamDownload(segment.url, segment.size ?? null, (received, total) => {
			const pct = Math.ceil((received / total) * 100);
			progressEl.innerHTML = ` downloading - ${received}/${total} - ${pct}%`;
		});
		progressEl.innerHTML = ' download complete';
		logInfo(MODULE, 'downloadSingle: stream complete', { filename, blobSize: blob.size });

		let ext = new URL(segment.url).pathname.toLowerCase().match(/\.[a-z0-9]+?$/)?.[0] ?? '';
		if (ext === '.m4s') ext = '.mp4';

		downloadBlob(new Uint8Array(await blob.arrayBuffer()), filename + ext, progressEl.parentElement!);
		logInfo(MODULE, 'downloadSingle: blob download triggered', { filename: filename + ext });
	} catch (err) {
		logError(MODULE, 'downloadSingle failed', { filename, url: segment.url }, err);
		throw err;
	} finally {
		linkEl.classList.remove('disabled');
	}
}

/**
 * Download and merge audio + video (advanced mode with merge on).
 */
export async function downloadAndMerge(
	linkEl: HTMLAnchorElement,
	segments: Array<{ url: string; size?: number }>,
	filename: string,
	progressEl: HTMLElement
): Promise<void> {
	linkEl.classList.add('disabled');
	logInfo(MODULE, 'downloadAndMerge start', { filename, segmentCount: segments.length });

	// Step 1: download audio & video in parallel
	const downloadResults = await Promise.all(
		segments.map(async ({ url, size }, i) => {
			const label = i === 0 ? 'audio' : 'video';
			const subEl = document.createElement('li');
			subEl.innerHTML = `${label} (${formatSize(size)}) downloading`;
			progressEl.appendChild(subEl);

			const blob = await streamDownload(url, size ?? null, (received, total) => {
				const pct = Math.ceil((received / total) * 100);
				subEl.innerHTML = `${label} (${formatSize(size)}) downloading - ${received}/${total} - ${pct}%`;
			});

			subEl.innerHTML = `${label} (${formatSize(size ?? blob.size)}) downloaded, awaiting merge`;
			logInfo(MODULE, `downloadAndMerge: ${label} downloaded`, { blobSize: blob.size });
			return blob;
		})
	);

	// Step 2: merge
	progressEl.innerHTML = 'merging audio+video (time depends on file size)...';
	const { baseUrl } = getInternals();
	logInfo(MODULE, 'downloadAndMerge: starting ffmpeg merge');
	const [mergedData, cleanup] = await mergeAudioVideo(
		baseUrl,
		URL.createObjectURL(downloadResults[0]),
		URL.createObjectURL(downloadResults[1])
	);

	progressEl.innerHTML = 'done';
	logInfo(MODULE, 'downloadAndMerge: merge complete', { mergedSize: mergedData.byteLength });
	downloadBlob(new Uint8Array(mergedData), `${filename}.mp4`, progressEl, cleanup);
}

/**
 * Normal-mode download: just create a direct download link.
 */
export function createNormalDownloadLink(
	filename: string,
	segments: Array<{ url: string; size?: number }>,
	isDash: boolean
): string {
	return segments
		.map((seg, i) => {
			const label = isDash ? (i === 0 ? '音频' : '视频') : `分段${i + 1}`;
			const name = `${filename}_${label}`;
			return `
          <li>
            <a title="${name}" download="${name}.mp4" href="${seg.url}">${label}（请点右键选择链接另存为，直接点击无法下载）</a>
            <span class="size">(${formatSize(seg.size)})</span>
          </li>
        `;
		})
		.join('');
}

/**
 * Advanced mode, no merge: inline download links with click-to-download.
 */
export function createAdvancedNoMergeLinks(
	segments: Array<{ url: string; size?: number }>,
	filename: string,
	isDash: boolean
): string {
	return segments
		.map((seg, i) => {
			const label = isDash ? (i === 0 ? '音频' : '视频') : `分段${i + 1}`;
			const name = `${filename}_${label}`;
			const encoded = encodeURIComponent(JSON.stringify(seg));
			return `
          <li>
            <a title="${name}" mode="advanced" merge="off" href="#nogo" durl="${encoded}">${label}</a>
            <span class="size">(${formatSize(seg.size)})</span>
            <span durl="${encoded}" class="progress"></span>
          </li>
        `;
		})
		.join('');
}

/**
 * Advanced mode, merge on: single merge link for dash streams.
 */
export function createMergeLink(
	segments: Array<{ url: string; size?: number }>,
	filename: string
): string {
	const total = segments.reduce((sum, s) => sum + (s.size ?? 0), 0);
	const encoded = encodeURIComponent(JSON.stringify(segments));
	return `
      <li>
        <a title="${filename}" durls="${encoded}" mode="advanced" type="a+v" merge="on" href="#nogo">合并下载</a>
        <span class="size">(共${formatSize(total)})</span>
        <ul style="margin-top: 8px;" durls="${encoded}" class="progress"></ul>
      </li>
    `;
}