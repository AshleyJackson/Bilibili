/**
 * Styles for the download popup's shadow root. Colors read Bilibili's own CSS
 * custom properties (they inherit through the shadow boundary), so the popup
 * follows the site's light and dark themes; the fallbacks are the light values.
 */
export const POPUP_STYLES = `
:host {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100000;
	font-size: 13px;
	line-height: 1.5;
	color: var(--text1, #18191c);
	text-align: left;
	letter-spacing: normal;
	--pink: var(--brand_pink, #ff6699);
	--blue: var(--brand_blue, #00aeec);
	--green: #20b26c;
	--red: #f85a54;
	--surface: var(--bg1_float, var(--bg1, #ffffff));
	--muted: var(--graph_bg_regular, #f1f2f3);
	--hover: var(--graph_bg_thin, #f6f7f8);
	--line: var(--line_regular, #e3e5e7);
	--text2: var(--text2, #61666d);
	--text3: var(--text3, #9499a0);
}
* { box-sizing: border-box; }
svg { width: 16px; height: 16px; display: block; flex: none; }
button { font: inherit; color: inherit; }

.panel {
	width: 372px;
	max-width: calc(100vw - 16px);
	display: flex;
	flex-direction: column;
	background: var(--surface);
	border: 1px solid var(--line);
	border-radius: 12px;
	box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
	overflow: hidden;
	animation: pop-in 140ms ease-out;
}
@keyframes pop-in { from { opacity: 0; transform: translateY(-4px) scale(0.98); } }

.head { display: flex; align-items: flex-start; gap: 8px; padding: 14px 10px 12px 16px; }
.heading { flex: 1; min-width: 0; }
.eyebrow { display: flex; align-items: center; gap: 4px; margin: 0 0 4px; font-size: 12px; color: var(--text3); }
.eyebrow svg { width: 14px; height: 14px; color: var(--pink); }
.title {
	margin: 0;
	font-size: 14px;
	font-weight: 600;
	line-height: 20px;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	word-break: break-word;
}
.chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.chip {
	font-size: 11px;
	line-height: 18px;
	padding: 0 6px;
	border-radius: 4px;
	background: var(--muted);
	color: var(--text2);
	font-variant-numeric: tabular-nums;
}
.chip.quality { background: rgba(255, 102, 153, 0.12); color: var(--pink); font-weight: 600; }

.icon-btn {
	flex: none;
	width: 28px;
	height: 28px;
	display: grid;
	place-items: center;
	padding: 0;
	border: 0;
	border-radius: 6px;
	background: transparent;
	color: var(--text3);
	cursor: pointer;
}
.icon-btn:hover { background: var(--muted); color: var(--text1, #18191c); }
.icon-btn.copied { color: var(--green); }
.icon-btn:focus-visible, .btn:focus-visible, .text-btn:focus-visible {
	outline: 2px solid var(--blue);
	outline-offset: 1px;
}

/* The option list keeps its space; when the panel is height-capped the log panel shrinks first. */
.body { flex: 0 1 auto; min-height: 0; overflow-y: auto; border-top: 1px solid var(--line); }
.options { list-style: none; margin: 0; padding: 6px; }
.row { display: flex; align-items: center; gap: 12px; margin: 0; padding: 10px; border-radius: 8px; }
.row:hover { background: var(--hover); }
.tile {
	flex: none;
	width: 36px;
	height: 36px;
	display: grid;
	place-items: center;
	border-radius: 8px;
	background: var(--muted);
	color: var(--text2);
}
.tile svg { width: 18px; height: 18px; }
.row[data-recommended] .tile { background: rgba(255, 102, 153, 0.12); color: var(--pink); }
.row[data-status='done'] .tile { background: rgba(32, 178, 108, 0.12); color: var(--green); }
.row[data-status='error'] .tile { background: rgba(248, 90, 84, 0.12); color: var(--red); }
.main { flex: 1; min-width: 0; }
.line1 { display: flex; align-items: center; gap: 6px; font-weight: 500; }
.badge {
	font-size: 10px;
	line-height: 16px;
	padding: 0 5px;
	border-radius: 4px;
	background: var(--pink);
	color: #fff;
}
.percent { margin-left: auto; font-size: 12px; color: var(--text2); font-variant-numeric: tabular-nums; }
.line2 {
	font-size: 12px;
	color: var(--text3);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-variant-numeric: tabular-nums;
}
.row[data-status='done'] .line2 { color: var(--green); }
.row[data-status='error'] .line2 { color: var(--red); white-space: normal; word-break: break-word; }
.bar { height: 4px; margin: 6px 0 4px; border-radius: 2px; background: var(--muted); overflow: hidden; }
.bar > span { display: block; height: 100%; border-radius: inherit; background: var(--pink); transition: width 200ms linear; }
.bar.indeterminate > span { width: 40%; animation: slide 1.1s ease-in-out infinite; }
@keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(250%); } }
.actions { flex: none; display: flex; align-items: center; gap: 2px; }

.btn {
	height: 30px;
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 0 12px;
	border: 1px solid var(--line);
	border-radius: 6px;
	background: transparent;
	color: var(--text1, #18191c);
	font-size: 13px;
	font-weight: 500;
	white-space: nowrap;
	text-decoration: none;
	cursor: pointer;
}
.btn svg { width: 14px; height: 14px; }
.btn:hover { border-color: var(--pink); color: var(--pink); }
.btn.primary { border-color: var(--pink); background: var(--pink); color: #fff; }
.btn.primary:hover { filter: brightness(1.08); color: #fff; }

.state { padding: 32px 24px; text-align: center; color: var(--text3); }
.state svg { width: 28px; height: 28px; margin: 0 auto 10px; }
.state.error svg { color: var(--red); }
.state strong { display: block; margin-bottom: 4px; color: var(--text1, #18191c); font-weight: 500; }
.spinner {
	width: 22px;
	height: 22px;
	margin: 0 auto 12px;
	border: 2px solid var(--muted);
	border-top-color: var(--pink);
	border-radius: 50%;
	animation: spin 800ms linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.head, .foot { flex: none; }
.foot {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 10px 8px 16px;
	border-top: 1px solid var(--line);
	font-size: 12px;
	color: var(--text3);
}
.hint { flex: 1; min-width: 0; display: flex; align-items: center; gap: 4px; }
.hint svg, .text-btn svg { width: 14px; height: 14px; }
.text-btn {
	display: inline-flex;
	align-items: center;
	gap: 2px;
	padding: 2px 6px;
	border: 0;
	border-radius: 4px;
	background: none;
	color: var(--text3);
	font-size: 12px;
	cursor: pointer;
}
.text-btn:hover { color: var(--blue); background: var(--muted); }
.text-btn[aria-expanded='true'] svg { transform: rotate(180deg); }
.count { font-variant-numeric: tabular-nums; }

.logs {
	flex: 0 1000 auto;
	min-height: 64px;
	display: flex;
	flex-direction: column;
	border-top: 1px solid var(--line);
	background: var(--hover);
}
.logs-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px 0 16px; font-size: 12px; color: var(--text3); }
.log-lines {
	flex: 0 1 auto;
	min-height: 0;
	margin: 0;
	padding: 4px 16px 10px;
	max-height: 160px;
	overflow: auto;
	font: 11px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	color: var(--text2);
	white-space: pre-wrap;
	word-break: break-all;
}
.log-lines:empty::before { content: '暂无日志'; color: var(--text3); }

@media (prefers-reduced-motion: reduce) {
	.panel, .bar > span, .bar.indeterminate > span, .spinner { animation: none; transition: none; }
}
`;
