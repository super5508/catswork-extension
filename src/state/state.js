import { observable, action } from 'mobx'

import Status from 'services/Status'

const ActiveStep = {
	DISABLED: 0,
	SET_UP: 1,
	CONNECT_LINKED_IN: 2,
	ACTIVE: 3,
	ADMIN: 4
}

class State {

	@observable.ref $user = undefined
	@observable $tab = ''
	@observable $title = ''
	@observable $actionItem = null

	load() {
		Status.status().then(action((status) => {
			this.$user = status.user
		}))
	}

	@action
	resetSignedIn() {
		this.$tab = 'track'
		this.$title = ''
		this.$actionItem = null
	}

	@action
	setTab(tab) {
		this.$tab = tab
	}

	@action
	setContext(title, actionItem = null) {
		this.$title = title
		this.$actionItem = actionItem
	}

}

const state = new State()
export { ActiveStep, state as default }
