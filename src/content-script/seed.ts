import { HOST_ELEMENT_ID, CONTENT_SCRIPT_ELEMENT_ID } from '$lib/constants';
import {
	CONTENT_SCRIPT_ERROR_EVENT,
	forwardContentScriptErrorMessage,
	isSentryErrorMessage,
	reportErrorToSentry
} from '$lib/sentry-reporting';
import {
	decodeStreamWorkerChunk,
	isAllowedStreamUrl,
	isPageStreamControlMessage,
	isPageStreamFetchRequest,
	isStreamWorkerMessage,
	STREAM_FETCH_PORT_NAME
} from '$lib/stream-download-protocol';

// This runs in the content script isolated world.
// It injects a <script> tag into the page so we can interact with Bilibili's JS context.

function relayStreamFetch(pagePort: MessagePort, url: string): void {
	let runtimePort: chrome.runtime.Port;
	let terminal = false;

	const sendPageMessage = (message: unknown, transfer: Transferable[] = []): void => {
		try {
			pagePort.postMessage(message, transfer);
		} catch {
			runtimePort?.disconnect();
			pagePort.close();
		}
	};

	try {
		runtimePort = chrome.runtime.connect({ name: STREAM_FETCH_PORT_NAME });
	} catch (error) {
		sendPageMessage({
			type: 'error',
			message: error instanceof Error ? error.message : String(error)
		});
		pagePort.close();
		return;
	}

	pagePort.onmessage = (event: MessageEvent<unknown>): void => {
		if (isPageStreamControlMessage(event.data)) {
			try {
				runtimePort.postMessage(event.data);
			} catch {
				runtimePort.disconnect();
			}
		}
	};
	pagePort.onmessageerror = (): void => {
		try {
			runtimePort.postMessage({ type: 'abort' });
		} catch {
			// The worker may already have disconnected.
		}
		runtimePort.disconnect();
		pagePort.close();
	};
	pagePort.start();

	runtimePort.onMessage.addListener((rawMessage: unknown) => {
		if (!isStreamWorkerMessage(rawMessage)) {
			terminal = true;
			sendPageMessage({ type: 'error', message: 'Invalid response from extension worker' });
			runtimePort.disconnect();
			return;
		}

		if (rawMessage.type === 'chunk') {
			try {
				const message = decodeStreamWorkerChunk(rawMessage);
				sendPageMessage(message, [message.buffer]);
			} catch (error) {
				terminal = true;
				sendPageMessage({
					type: 'error',
					message: error instanceof Error ? error.message : String(error)
				});
				try {
					runtimePort.postMessage({ type: 'abort' });
				} catch {
					// The worker may already have disconnected.
				}
				runtimePort.disconnect();
			}
			return;
		}

		if (rawMessage.type === 'done' || rawMessage.type === 'error') {
			terminal = true;
		}
		sendPageMessage(rawMessage);
	});

	runtimePort.onDisconnect.addListener(() => {
		if (!terminal) {
			const message = chrome.runtime.lastError?.message ?? 'Extension stream worker disconnected';
			sendPageMessage({ type: 'error', message });
		}
	});

	runtimePort.postMessage({ type: 'fetch', url });
}

(function (win: Window) {
	const ns = '[bilibili downloader]';

	win.addEventListener('message', (event: MessageEvent<unknown>) => {
		if (
			event.source !== win ||
			event.origin !== win.location.origin ||
			!isPageStreamFetchRequest(event.data) ||
			event.ports.length !== 1
		) {
			return;
		}

		const pagePort = event.ports[0];
		if (!isAllowedStreamUrl(event.data.url)) {
			pagePort.postMessage({ type: 'error', message: 'Unsupported Bilibili stream URL' });
			pagePort.close();
			return;
		}
		relayStreamFetch(pagePort, event.data.url);
	});

	win.addEventListener(CONTENT_SCRIPT_ERROR_EVENT, (event) => {
		const message = (event as CustomEvent<unknown>).detail;
		if (!isSentryErrorMessage(message) || !message.error.stack?.includes('bilibili-helper-content-script')) {
			return;
		}

		forwardContentScriptErrorMessage(message);
	});

	win.addEventListener('error', (event) => {
		if (!event.filename.includes('bilibili-helper-content-script-seed')) return;
		reportErrorToSentry(event.error ?? event.message, 'content-script', 'seed');
	});

	win.addEventListener('unhandledrejection', (event) => {
		const stack = event.reason instanceof Error ? (event.reason.stack ?? '') : '';
		if (!stack.includes('bilibili-helper-content-script-seed')) return;
		reportErrorToSentry(event.reason, 'content-script', 'seed');
	});

	console.log(ns, '[seed] seed script running', { url: win.location.href });

	// Redirect /s/video/ URLs
	if (win.location.href.indexOf('bilibili.com/s/video/') !== -1) {
		console.log(ns, '[seed] redirecting /s/video/ to /video/');
		win.location.replace(win.location.href.replace('/s/', '/'));
		return;
	}

	const doc = win.document;

	// Inject z-index fix style
	const style = doc.createElement('style');
	style.textContent = `[class*="fullscreen"] #${HOST_ELEMENT_ID},[class*="webscreen-fix"] #${HOST_ELEMENT_ID} {z-index: 9!important;}`;
	(doc.head || doc.documentElement).appendChild(style);

	// Inject main script into page context
	const script = doc.createElement('script');
	script.id = CONTENT_SCRIPT_ELEMENT_ID;
	script.type = 'module';

	const { name, version } = chrome.runtime.getManifest();
	script.dataset.internals = JSON.stringify({
		baseUrl: chrome.runtime.getURL('/').replace(/\/$/, ''),
		manifest: { name, version }
	});
	script.src = chrome.runtime.getURL('bilibili-helper-content-script.js') + `?v=${version}`;

	(doc.head || doc.documentElement).appendChild(script);
	console.log(ns, '[seed] main script injected', {
		id: script.id,
		src: script.src
	});
})(window);
