
chrome.runtime.onMessage.addListener(function (message) {
	if (message._type === 'addPerson') {
		chrome.storage.local.set({ person: message.person })
		chrome.browserAction.setBadgeText({ text: 'ADD' })
		chrome.browserAction.setBadgeBackgroundColor({ color: '#fd6b54' })
	}
})
