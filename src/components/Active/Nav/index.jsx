import { observer } from 'mobx-react'
import React from 'react'

import config from 'config'
import state from 'state/state'

import s from './nav.less'

@observer
class Nav extends React.Component {

	render() {
		return (
			<nav className={s.nav}>
				<div className={s.tabs}>
					<a className={[s.tab, s.tabTrack, state.$tab === 'track' ? s.tabActive : ''].join(' ')} onClick={this._onTrackSelect} />
					<a className={[s.tab, s.tabChat, state.$tab === 'chat' ? s.tabActive : ''].join(' ')} onClick={this._onChatSelect} />
				</div>
				<a className={s.user} href={`${config.server.url}profile`} target='_blank' />
			</nav>
		)
	}

	_onTrackSelect() {
		state.setTab('track')
	}

	_onChatSelect() {
		state.setTab('chat')
	}

}

export default Nav
