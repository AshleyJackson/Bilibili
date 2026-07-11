import { FFmpeg } from '@ffmpeg/ffmpeg';
import { FFMPEG_WORKER, FFMPEG_CORE_JS, FFMPEG_CORE_WASM, FFMPEG_CORE_WORKER } from './constants';
import { fetchAsBlob } from './fetch-utils';
import { toUint8Array } from './fetch-utils';
import { logInfo, logWarn, logError } from './logger';

let ffmpegInstance: FFmpeg | null = null;
const usedFiles = new Set<string>();
const blobUrls = new Set<string>();

export function trackBlobUrl(url: string): void {
	blobUrls.add(url);
}

async function getFFmpeg(baseUrl: string): Promise<FFmpeg> {
	if (ffmpegInstance) {
		logInfo('ffmpeg', 'reusing existing FFmpeg instance');
		return ffmpegInstance;
	}

	logInfo('ffmpeg', 'initializing new FFmpeg instance');
	const inst = new FFmpeg();
	inst.on('log', ({ message }) => {
		console.log('[bilibili downloader]', '[ffmpeg]', message);
	});

	logInfo('ffmpeg', 'fetching FFmpeg assets from', baseUrl);
	const [workerUrl, coreJsUrl, wasmUrl, coreWorkerUrl] = await Promise.all([
		fetchAsBlob(`${baseUrl}/${FFMPEG_WORKER}`, 'text/javascript'),
		fetchAsBlob(`${baseUrl}/${FFMPEG_CORE_JS}`, 'text/javascript'),
		fetchAsBlob(`${baseUrl}/${FFMPEG_CORE_WASM}`, 'application/wasm'),
		fetchAsBlob(`${baseUrl}/${FFMPEG_CORE_WORKER}`, 'text/javascript')
	]);

	trackBlobUrl(workerUrl);
	trackBlobUrl(coreJsUrl);
	trackBlobUrl(wasmUrl);
	trackBlobUrl(coreWorkerUrl);

	logInfo('ffmpeg', 'FFmpeg assets fetched as blobs, loading...');
	try {
		await inst.load({
			classWorkerURL: workerUrl,
			coreURL: coreJsUrl,
			wasmURL: wasmUrl,
			workerURL: coreWorkerUrl
		});
		logInfo('ffmpeg', 'FFmpeg loaded successfully');
	} catch (err) {
		logError('ffmpeg', 'FFmpeg load failed', err);
		throw err;
	}

	ffmpegInstance = inst;
	return inst;
}

/**
 * Merge audio and video using FFmpeg, return the merged data buffer.
 */
export async function mergeAudioVideo(
	baseUrl: string,
	audioUrl: string,
	videoUrl: string
): Promise<[ArrayBuffer, () => void]> {
	logInfo('ffmpeg', 'mergeAudioVideo: starting merge');
	const ffmpeg = await getFFmpeg(baseUrl);
	const ts = `${Date.now()}${Math.random()}`;
	const audioFile = `${ts}_audio.mp4`;
	const videoFile = `${ts}_video.mp4`;
	const mergedFile = `${ts}_merged.mp4`;

	logInfo('ffmpeg', `writing audio file (${audioFile})`);
	await ffmpeg.writeFile(audioFile, await toUint8Array(audioUrl));
	logInfo('ffmpeg', `writing video file (${videoFile})`);
	await ffmpeg.writeFile(videoFile, await toUint8Array(videoUrl));

	logInfo('ffmpeg', 'executing ffmpeg merge command');
	await ffmpeg.exec(['-i', videoFile, '-i', audioFile, '-vcodec', 'copy', '-acodec', 'copy', mergedFile]);
	logInfo('ffmpeg', `ffmpeg merge complete, reading ${mergedFile}`);

	const data = await ffmpeg.readFile(mergedFile);
	logInfo('ffmpeg', 'merge result size', (data as ArrayBuffer).byteLength);

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
	window.addEventListener('beforeunload', async () => {
		logInfo('ffmpeg', 'cleanup on beforeunload');
		await Promise.all([
			...Array.from(usedFiles).map((f) =>
				ffmpegInstance?.deleteFile(f).catch(() => {}) ?? Promise.resolve()
			),
			...Array.from(blobUrls).map((url) => {
				try {
					URL.revokeObjectURL(url);
				} catch { /* ignore */ }
				return Promise.resolve();
			}),
			new Promise<void>((resolve) => {
				try {
					ffmpegInstance?.terminate();
					logInfo('ffmpeg', 'FFmpeg instance terminated');
				} catch { /* ignore */ }
				resolve();
			})
		]);
	}, true);
}