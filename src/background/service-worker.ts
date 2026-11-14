import * as Sentry from '@sentry/browser';
import {
	isSentryErrorMessage,
	sanitizeSentryEvent,
	SENTRY_ERROR_MESSAGE_TYPE
} from '$lib/sentry-reporting';

const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
	Sentry.init({
		dsn,
		release: `bilibili-extension@${chrome.runtime.getManifest().version}`,
		environment: import.meta.env.DEV ? 'development' : 'production',
		dataCollection: {
			userInfo: false,
			cookies: false,
			httpHeaders: false,
			httpBodies: [],
			urlQueryParams: false,
			stackFrameVariables: false
		},
		maxBreadcrumbs: 0,
		beforeSend: (event) => sanitizeSentryEvent(event)
	});
}

let rateWindowStart = Date.now();
let reportsInWindow = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (
		sender.id !== chrome.runtime.id ||
		message?.type !== SENTRY_ERROR_MESSAGE_TYPE ||
		!isSentryErrorMessage(message)
	) {
		return;
	}

	if (!dsn) {
		sendResponse({ sent: false });
		return;
	}

	if (Date.now() - rateWindowStart >= 60_000) {
		rateWindowStart = Date.now();
		reportsInWindow = 0;
	}
	if (reportsInWindow >= 20) {
		sendResponse({ sent: false });
		return;
	}
	reportsInWindow += 1;

	Sentry.withScope((scope) => {
		scope.setTag('source', message.source);
		if (message.module) scope.setTag('module', message.module);

		const error = new Error(message.error.message);
		error.name = message.error.name;
		if (message.error.stack) error.stack = message.error.stack;
		Sentry.captureException(error);
	});

	void Sentry.flush(2_000)
		.then((sent) => sendResponse({ sent }))
		.catch(() => sendResponse({ sent: false }));

	return true;
});
