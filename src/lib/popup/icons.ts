/** Inline SVG icons (Lucide-style strokes, 24px grid) for the download popup. */

const svg = (body: string): string =>
	`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const ICONS = {
	download: svg('<path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/>'),
	film: svg(
		'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M10 9.2v5.6a.5.5 0 0 0 .76.43l4.5-2.8a.5.5 0 0 0 0-.86l-4.5-2.8a.5.5 0 0 0-.76.43z" fill="currentColor"/>'
	),
	image: svg('<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m3 16 5-5 4 4 3-3 6 6"/>'),
	music: svg('<path d="M9 18V6l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'),
	check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
	alert: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5"/><path d="M12 16.5h.01"/>'),
	close: svg('<path d="M6 6l12 12"/><path d="M18 6 6 18"/>'),
	link: svg(
		'<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>'
	),
	retry: svg('<path d="M20 12a8 8 0 1 1-2.34-5.66L20 8.5"/><path d="M20 3.5v5h-5"/>'),
	info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.5h.01"/>'),
	chevron: svg('<path d="m6 9 6 6 6-6"/>'),
	copy: svg(
		'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'
	)
} as const;

export type IconName = keyof typeof ICONS;
