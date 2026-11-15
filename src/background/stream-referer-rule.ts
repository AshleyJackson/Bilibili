export const STREAM_REFERER_RULE_ID = 33_001;

export function createStreamRefererRule(extensionId: string): chrome.declarativeNetRequest.Rule {
	return {
		id: STREAM_REFERER_RULE_ID,
		priority: 1,
		action: {
			type: 'modifyHeaders',
			requestHeaders: [
				{
					header: 'Referer',
					operation: 'set',
					value: 'https://www.bilibili.com/'
				}
			]
		},
		condition: {
			initiatorDomains: [extensionId],
			requestDomains: ['bilivideo.com', 'upos-hz-mirrorakam.akamaized.net', 'upos-sz-mirrorakam.akamaized.net'],
			resourceTypes: ['xmlhttprequest']
		}
	};
}

export async function installStreamRefererRule(
	declarativeNetRequest: Pick<typeof chrome.declarativeNetRequest, 'updateDynamicRules'>,
	extensionId: string
): Promise<void> {
	await declarativeNetRequest.updateDynamicRules({
		removeRuleIds: [STREAM_REFERER_RULE_ID],
		addRules: [createStreamRefererRule(extensionId)]
	});
}
