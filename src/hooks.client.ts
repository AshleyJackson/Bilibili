import { reportErrorToSentry } from '$lib/sentry-reporting';

window.addEventListener('error', (event) => {
	reportErrorToSentry(event.error ?? event.message, 'extension-popup');
});

window.addEventListener('unhandledrejection', (event) => {
	reportErrorToSentry(event.reason, 'extension-popup');
});

export const handleError = ({ error }: { error: unknown }) => {
	reportErrorToSentry(error, 'extension-popup');
	return { message: 'An unexpected error occurred.' };
};
