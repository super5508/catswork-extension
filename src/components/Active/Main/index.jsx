import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import state from 'state/state'

import GraphQL, { gql } from 'services/GraphQL'

import Loading from 'ui/Loading'
import Button from 'ui/Button'

import Search from './Search'
import Todo from './Todo'
import Notifications from './Notifications'

import s from './main.less'

const PEOPLE_QUERY = gql`
	query PeopleQuery {
		people {
			id
			first
			last
			company
			position
		}
	}
`
const NOTIFICATIONS_QUERY = gql`
	query NotificationsQuery {
		notifications {
			id
			person
			activity
			type
			message
			date
		}
	}
`

@observer
class Main extends React.Component {

	@observable _$checkedPerson = false
	@observable.ref _$people = null
	@observable.ref _$notifications = null

	componentWillMount() {
		chrome.storage.local.get(['person'], action(({ person }) => {
			if (person) {
				this.props.history.push('/add-person')
			}

			this._$checkedPerson = true
		}))

		GraphQL.query(PEOPLE_QUERY)
			.then(action(({ data }) => {
				this._$people = data.people
			}))
		GraphQL.query(NOTIFICATIONS_QUERY)
			.then(action(({ data }) => {
				this._$notifications = data.notifications
			}))

		state.setContext('Dashboard')
	}

	render() {
		if (!(this._$checkedPerson && this._$people && this._$notifications)) {
			return <Loading />
		}

		return (
			<section className={s.main}>
				<div className={s.buttons}>
					<Button className={s.button} onClick={this._onViewPeople}>View people</Button>
					<Button className={s.button} onClick={this._onAddPerson}>Add person</Button>
				</div>
				<Search people={this._$people} onSelect={this._onPersonSelect} />
				<Todo />
				<Notifications notifications={this._$notifications} onShowPerson={this._onPersonSelect} />
			</section>
		)
	}

	_onPersonSelect = (id) => {
		this.props.history.push(`/person/${id}`)
	}

	_onViewPeople = () => {
		this.props.history.push('/people')
	}

	_onAddPerson = () => {
		this.props.history.push('/add-person')
	}

}

export default Main
