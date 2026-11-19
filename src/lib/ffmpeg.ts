import { FFmpeg } from '@ffmpeg/ffmpeg';
import { FFMPEG_WORKER, FFMPEG_CORE_JS, FFMPEG_CORE_WASM } from './constants';
import { fetchAsBlob } from './fetch-utils';
import { toUint8Array } from './fetch-utils';
import { logInfo, logError } from './logger';
import { recordSentryBreadcrumb } from './sentry-reporting';

let ffmpegInstance: FFmpeg | null = null;
let ffmpegLoadPromise: Promise<FFmpeg> | null = null;
const usedFiles = new Set<string>();
const blobUrls = new Set<string>();

export function trackBlobUrl(url: string): void {
	blobUrls.add(url);
}

async function getFFmpeg(baseUrl: string): Promise<FFmpeg> {
	if (ffmpegInstance?.loaded) {
		logInfo('ffmpeg', 'reusing existing FFmpeg instance');
		return ffmpegInstance;
	}
	if (ffmpegLoadPromise) {
		logInfo('ffmpeg', 'waiting for FFmpeg instance to load');
		return ffmpegLoadPromise;
	}

	ffmpegInstance = null;
	const loadPromise = (async () => {
		logInfo('ffmpeg', 'initializing new FFmpeg instance');
		const inst = new FFmpeg();
		inst.on('log', ({ message }) => {
			console.log('[bilibili downloader]', '[ffmpeg]', message);
		});

		// All three assets must use blob URLs because:
		//   1. The content script runs in the page's main world, so
		//      new Worker(chrome-extension://...) is blocked.
		//   2. The worker is created as type:"module", so importScripts()
		//      is unavailable.  It falls back to import(blobURL), which
		//      works when all three files are blob URLs with the page's origin.
		//   3. ffmpeg-core.js must be the ESM build so import() returns a
		//      module with a default export (createFFmpegCore).
		logInfo('ffmpeg', 'fetching FFmpeg assets as blobs from', baseUrl);
		const [workerUrl, coreUrl, wasmUrl] = await Promise.all([
			fetchAsBlob(`${baseUrl}/${FFMPEG_WORKER}`, 'text/javascript'),
			fetchAsBlob(`${baseUrl}/${FFMPEG_CORE_JS}`, 'text/javascript'),
			fetchAsBlob(`${baseUrl}/${FFMPEG_CORE_WASM}`, 'application/wasm')
		]);
		trackBlobUrl(workerUrl);
		trackBlobUrl(coreUrl);
		trackBlobUrl(wasmUrl);

		logInfo('ffmpeg', 'FFmpeg blobs ready, loading...');
		try {
			await inst.load({
				classWorkerURL: workerUrl,
				coreURL: coreUrl,
				wasmURL: wasmUrl
			});
			logInfo('ffmpeg', 'FFmpeg loaded successfully');
		} catch (err) {
			logError('ffmpeg', 'FFmpeg load failed', err);
			throw err;
		}

		ffmpegInstance = inst;
		return inst;
	})();
	ffmpegLoadPromise = loadPromise;
	try {
		return await loadPromise;
	} finally {
		if (ffmpegLoadPromise === loadPromise) ffmpegLoadPromise = null;
	}
}

/**
 * Merge audio and video using FFmpeg, return the merged data buffer.
 */
export async function mergeAudioVideo(baseUrl: string, audio: Blob, video: Blob): Promise<[ArrayBuffer, () => void]> {
	recordSentryBreadcrumb('FFmpeg merge started');
	logInfo('ffmpeg', 'mergeAudioVideo: starting merge');
	const ffmpeg = await getFFmpeg(baseUrl);
	recordSentryBreadcrumb('FFmpeg ready');
	const ts = `${Date.now()}${Math.random()}`;
	const audioFile = `${ts}_audio.mp4`;
	const videoFile = `${ts}_video.mp4`;
	const mergedFile = `${ts}_merged.mp4`;

	logInfo('ffmpeg', `writing audio file (${audioFile})`);
	recordSentryBreadcrumb('Reading audio data');
	const audioData = await toUint8Array(audio);
	recordSentryBreadcrumb('Audio data read');
	await ffmpeg.writeFile(audioFile, audioData);
	logInfo('ffmpeg', `writing video file (${videoFile})`);
	recordSentryBreadcrumb('Reading video data');
	const videoData = await toUint8Array(video);
	recordSentryBreadcrumb('Video data read');
	await ffmpeg.writeFile(videoFile, videoData);
	recordSentryBreadcrumb('FFmpeg inputs written');

	logInfo('ffmpeg', 'executing ffmpeg merge command');
	recordSentryBreadcrumb('FFmpeg command started');
	await ffmpeg.exec(['-i', videoFile, '-i', audioFile, '-vcodec', 'copy', '-acodec', 'copy', mergedFile]);
	recordSentryBreadcrumb('FFmpeg command completed');
	logInfo('ffmpeg', `ffmpeg merge complete, reading ${mergedFile}`);

	recordSentryBreadcrumb('Reading merged output');
	const data = await ffmpeg.readFile(mergedFile);
	recordSentryBreadcrumb('Merged output read');
	logInfo('ffmpeg', 'merge result size', (data as unknown as ArrayBuffer).byteLength);

	const cleanup = (): void => {
		ffmpeg.deleteFile(audioFile).catch(() => {});
		ffmpeg.deleteFile(videoFile).catch(() => {});
	};
	usedFiles.add(mergedFile);

	return [data as unknown as ArrayBuffer, cleanup];
}

/**
 * Cleanup FFmpeg resources on page unload.
 */
export function setupCleanup(): void {
	window.addEventListener(
		'beforeunload',
		async () => {
			logInfo('ffmpeg', 'cleanup on beforeunload');
			await Promise.all([
				...Array.from(usedFiles).map((f) => ffmpegInstance?.deleteFile(f).catch(() => {}) ?? Promise.resolve()),
				...Array.from(blobUrls).map((url) => {
					try {
						URL.revokeObjectURL(url);
					} catch {
						/* ignore */
					}
					return Promise.resolve();
				}),
				new Promise<void>((resolve) => {
					try {
						ffmpegInstance?.terminate();
						logInfo('ffmpeg', 'FFmpeg instance terminated');
					} catch {
						/* ignore */
					}
					resolve();
				})
			]);
		},
		true
	);
}
