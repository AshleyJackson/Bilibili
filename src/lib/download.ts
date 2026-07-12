/**
 * Link builders for the download popup. Pure HTML-string generators — no
 * orchestration logic lives here. Each link carries a JSON-encoded
 * SegmentDescriptor[] (with backup URLs) in a data attribute, which host.ts
 * decodes and passes to the downloader module on click.
 *
 * Segments use { url, backups?, size? } so the downloader can fall back to
 * backup URLs when the primary .m4s CDN URL fails or its signed deadline
 * expires.
 */

import { formatSize } from './utils';

export interface LinkSegment {
	url: string;
	backups?: string[];
	size?: number;
}

export interface LinkOptions {
	filename: string;
	segments: LinkSegment[];
	/** True for DASH (audio+video) responses; false for DURL (whole-file) responses. */
	isDash: boolean;
}

function encode(segments: LinkSegment[]): string {
	return encodeURIComponent(JSON.stringify(segments));
}

/**
 * Normal-mode: plain anchor links. Bilibili's CDN requires a Referer header
 * that the browser only sends on right-click → save-as, so the label tells
 * the user that.
 */
export function createNormalDownloadLink({ filename, segments, isDash }: LinkOptions): string {
	return segments
		.map((seg, i) => {
			const label = isDash ? (i === 0 ? '音频' : '视频') : `分段${i + 1}`;
			const name = `${filename}_${label}`;
			return `
        <li>
          <a title="${name}" download="${name}.mp4" href="${seg.url}">${label}（请点右键选择链接另存为，直接点击无法下载）</a>
          <span class="size">(${formatSize(seg.size)})</span>
        </li>`;
		})
		.join('');
}

/** Advanced mode, no merge: inline click-to-download links per segment. */
export function createAdvancedNoMergeLinks({ filename, segments, isDash }: LinkOptions): string {
	return segments
		.map((seg, i) => {
			const label = isDash ? (i === 0 ? '音频' : '视频') : `分段${i + 1}`;
			const name = `${filename}_${label}`;
			const encoded = encode([seg]);
			return `
        <li>
          <a title="${name}" mode="advanced" merge="off" href="#nogo" durl="${encoded}">${label}</a>
          <span class="size">(${formatSize(seg.size)})</span>
          <span durl="${encoded}" class="progress"></span>
        </li>`;
		})
		.join('');
}

/** Advanced mode, merge on: single "合并下载" link carrying all dash segments. */
export function createMergeLink({ filename, segments }: LinkOptions): string {
	const total = segments.reduce((sum, s) => sum + (s.size ?? 0), 0);
	const encoded = encode(segments);
	return `
      <li>
        <a title="${filename}" durls="${encoded}" mode="advanced" type="a+v" merge="on" href="#nogo">合并下载</a>
        <span class="size">(共${formatSize(total)})</span>
        <ul style="margin-top: 8px;" durls="${encoded}" class="progress"></ul>
      </li>`;
}
