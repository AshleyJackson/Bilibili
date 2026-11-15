/**
 * Download options model for the popup. Turns a playurl result into the
 * concrete files a user can save (merged MP4, video-only, audio-only, or DURL
 * files), each with its segments, filename and known size. Pure data: no DOM,
 * no network.
 */

import { ErrorCode } from './schemas';
import type { DashStream, DurlSegment } from './schemas';
import { extensionForUrl, streamToSegment, type SegmentDescriptor } from './downloader/orchestration';

export interface DisplayInfo {
	code: number;
	title?: string;
	quality?: string;
	message?: string;
	dash?: { audio: DashStream; video: DashStream };
	durl?: DurlSegment[];
}

/** `merged` carries [audio, video]; every other kind carries exactly one segment. */
export type DownloadKind = 'merged' | 'video' | 'audio' | 'file';

export interface DownloadOption {
	/** Stable per stream URL, so task state survives re-renders but resets on quality change. */
	id: string;
	kind: DownloadKind;
	label: string;
	detail: string;
	format: string;
	filename: string;
	segments: SegmentDescriptor[];
	size?: number;
	recommended: boolean;
}

const RESERVED_FILENAME_CHARS = /[\\/:*?"<>|]/g;
const MAX_FILENAME_LENGTH = 180;

export function sanitizeFilename(name: string): string {
	const printable = Array.from(name, (c) => (c.charCodeAt(0) < 32 ? ' ' : c)).join('');
	const cleaned = printable
		.replace(RESERVED_FILENAME_CHARS, '_')
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/^\.+|\.+$/g, '');
	return cleaned.slice(0, MAX_FILENAME_LENGTH) || 'bilibili';
}

function safeExtension(url: string, fallback: string): string {
	try {
		return extensionForUrl(url) || fallback;
	} catch {
		return fallback;
	}
}

function knownSum(sizes: Array<number | undefined>): number | undefined {
	if (sizes.some((s) => !s)) return undefined;
	return sizes.reduce<number>((sum, s) => sum + (s ?? 0), 0);
}

export function buildDownloadOptions(info: DisplayInfo): DownloadOption[] {
	if (info.code !== ErrorCode.OK) return [];
	const base = sanitizeFilename(info.title || 'bilibili');

	if (info.dash) {
		const audio = streamToSegment(info.dash.audio);
		const video = streamToSegment(info.dash.video);
		const options: DownloadOption[] = [];
		if (audio.url && video.url) {
			options.push({
				id: `merged:${video.url}`,
				kind: 'merged',
				label: '完整视频',
				detail: '画面 + 声音',
				format: 'MP4',
				filename: `${base}.mp4`,
				segments: [audio, video],
				size: knownSum([audio.size, video.size]),
				recommended: true
			});
		}
		if (video.url) {
			options.push({
				id: `video:${video.url}`,
				kind: 'video',
				label: '仅画面',
				detail: '无声音',
				format: 'MP4',
				filename: `${base}_视频.mp4`,
				segments: [video],
				size: video.size,
				recommended: false
			});
		}
		if (audio.url) {
			options.push({
				id: `audio:${audio.url}`,
				kind: 'audio',
				label: '仅声音',
				detail: '音频轨',
				format: 'M4A',
				filename: `${base}_音频.m4a`,
				segments: [audio],
				size: audio.size,
				recommended: false
			});
		}
		return options;
	}

	const durl = (info.durl ?? []).filter((seg) => !!seg.url);
	const multiple = durl.length > 1;
	return durl.map((seg, i) => {
		const ext = safeExtension(seg.url, '.flv');
		return {
			id: `file:${seg.url}`,
			kind: 'file',
			label: multiple ? `分段 ${i + 1}/${durl.length}` : '完整视频',
			detail: multiple ? `第 ${i + 1} 段` : '画面 + 声音',
			format: ext.slice(1).toUpperCase(),
			filename: multiple ? `${base}_分段${i + 1}${ext}` : `${base}${ext}`,
			segments: [{ url: seg.url, backups: seg.backup_url ?? [], size: seg.size }],
			size: seg.size,
			recommended: !multiple
		};
	});
}

const CODEC_BY_PREFIX: Array<[string, string]> = [
	['avc', 'AVC'],
	['hev', 'HEVC'],
	['hvc', 'HEVC'],
	['av01', 'AV1']
];
const CODEC_BY_ID: Record<number, string> = { 7: 'AVC', 12: 'HEVC', 13: 'AV1' };

export function codecLabel(stream: Pick<DashStream, 'codecs' | 'codecid'>): string | undefined {
	const codecs = stream.codecs?.toLowerCase() ?? '';
	const byPrefix = CODEC_BY_PREFIX.find(([prefix]) => codecs.startsWith(prefix));
	if (byPrefix) return byPrefix[1];
	return stream.codecid !== undefined ? CODEC_BY_ID[stream.codecid] : undefined;
}

/** Short facts about the selected streams, shown as chips under the title. */
export function describeStreams(info: DisplayInfo): string[] {
	if (info.code !== ErrorCode.OK) return [];
	const facts: string[] = [];
	const video = info.dash?.video;
	if (video?.width && video.height) facts.push(`${video.width}×${video.height}`);
	const codec = video ? codecLabel(video) : undefined;
	if (codec) facts.push(codec);
	if (!info.dash && info.durl?.length) {
		facts.push(safeExtension(info.durl[0].url, '.flv').slice(1).toUpperCase());
	}
	return facts;
}
