import { describe, expect, it, vi } from 'vitest';
import { createStreamRefererRule, installStreamRefererRule, STREAM_REFERER_RULE_ID } from './stream-referer-rule';

describe('stream Referer rule', () => {
	it('only sets the Bilibili Referer on this extension’s CDN fetches', () => {
		expect(createStreamRefererRule('extension-id')).toEqual({
			id: STREAM_REFERER_RULE_ID,
			priority: 1,
			action: {
				type: 'modifyHeaders',
				requestHeaders: [{ header: 'Referer', operation: 'set', value: 'https://www.bilibili.com/' }]
			},
			condition: {
				initiatorDomains: ['extension-id'],
				requestDomains: ['bilivideo.com', 'upos-hz-mirrorakam.akamaized.net', 'upos-sz-mirrorakam.akamaized.net'],
				resourceTypes: ['xmlhttprequest']
			}
		});
	});

	it('replaces the same dynamic rule on worker startup', async () => {
		const updateDynamicRules = vi.fn().mockResolvedValue(undefined);

		await installStreamRefererRule(
			{ updateDynamicRules } as unknown as Pick<typeof chrome.declarativeNetRequest, 'updateDynamicRules'>,
			'extension-id'
		);

		expect(updateDynamicRules).toHaveBeenCalledWith({
			removeRuleIds: [STREAM_REFERER_RULE_ID],
			addRules: [createStreamRefererRule('extension-id')]
		});
	});
});
