import React from 'React'

import config from 'config'
import state from 'state/state'

import Button from 'ui/Button'
import Input from 'ui/Input'

import Footer from '../Footer'

import s from './people.less'

class People extends React.Component {

	_searchInput

	componentWillMount() {
		state.setContext('People')
	}

	componentDidMount() {
		this._searchInput.focus()
	}

	render() {
		return (
			<section className={s.people}>
				<Input block
					icon='fas fa-search'
					block
					type='text'
					placeholder='Search by name or company'
					inputRef={input => this._searchInput = input}
					onFocus={this._onSearchFocus}
					onBlur={this._onSearchBlur}
					onChange={this._onSearchChange} />
				<Footer>
					<Button block
						center
						href={config.dashboard.url}
						target='_blank'>View on dashboard</Button>
				</Footer>
			</section>
		)
	}

}

export default People
