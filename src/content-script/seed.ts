import { HOST_ELEMENT_ID, CONTENT_SCRIPT_ELEMENT_ID } from '$lib/constants';
import {
	CONTENT_SCRIPT_ERROR_EVENT,
	forwardSentryErrorMessage,
	isSentryErrorMessage,
	reportErrorToSentry
} from '$lib/sentry-reporting';

// This runs in the content script isolated world.
// It injects a <script> tag into the page so we can interact with Bilibili's JS context.

(function (win: Window) {
	const ns = '[bilibili downloader]';

	win.addEventListener(CONTENT_SCRIPT_ERROR_EVENT, (event) => {
		const message = (event as CustomEvent<unknown>).detail;
		if (
			!isSentryErrorMessage(message) ||
			message.source !== 'content-script' ||
			!message.error.stack?.includes('bilibili-helper-content-script')
		) {
			return;
		}

		forwardSentryErrorMessage(message);
	});

	win.addEventListener('error', (event) => {
		if (!event.filename.includes('bilibili-helper-content-script-seed')) return;
		reportErrorToSentry(event.error ?? event.message, 'content-script', 'seed');
	});

	win.addEventListener('unhandledrejection', (event) => {
		const stack = event.reason instanceof Error ? event.reason.stack ?? '' : '';
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
	console.log(ns, '[seed] main script injected', { id: script.id, src: script.src });
})(window);