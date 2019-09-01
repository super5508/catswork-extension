import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import state from 'state/state'

import GraphQL, { gql } from 'services/GraphQL'

import Loading from 'ui/Loading'
import Button from 'ui/Button'

import Header from './Header'
import Info from './Info'
import Activity from './Activity'

import s from './person.less'

const PERSON_QUERY = gql`
query userRootQueryType($id: Int!){
	catWorksSingleDashboardUser(id: $id)  {
			personId
			userId
			first
			last
			company
			industry
			position
			email
			phone
			location
			education
			hometown
			extracurriculars
			website
			notes
			source
			sourceCustom
			userActivity {
				activityId
				userId
				activity
				activityCustom
				date
				status
			}
		}
	}
`
const TOGGLE_ACTIVITY_QUERY = gql`
	mutation ToggleActivity($id: Int!) {
		ToggleActivity(id: $id) {
			status
		}
	}
`

// DeleteActivity
const DELETE_ACTIVITY_QUERY = gql`
mutation DeleteActivity($id: Int!) {
	DeleteActivity(id: $id) {
		userId
	}
}
`

@observer
class Person extends React.Component {

	@observable.ref _$person = null

	componentWillMount() {
		// state.setContext('View person', <Button size='small' onClick={this._onEdit}>Edit</Button>)

		GraphQL.query(PERSON_QUERY, { id: parseInt(this.props.match.params.id) })
			.then(action((response) => {
				console.log(`Response from person Query:`, response)
				this._$person = response.data.catWorksSingleDashboardUser
			}))
	}

	render() {
		if (!this._$person) {
			return <Loading />
		}

		return (
			<section className={s.person}>
				<Header person={this._$person} />
				<Info person={this._$person} />
				<Activity activity={this._$person.userActivity}
					onToggle={this._onToggleActivity}
					onDelete={this._onDeleteActivity}
					onAddActivity={this._onAddActivity} />
			</section>
		)
	}

	// _onEdit = () => {
	// 	this.props.history.push(`/person/${this.props.match.params.id}/edit`)
	// }

	_onToggleActivity = (id) => {
		return GraphQL.query(TOGGLE_ACTIVITY_QUERY, {
			id: id
		})
			.then(action((response) => {
				const activity = this._$person.userActivity.map((activity) => ({
          ...activity,
          status: activity.activityId === id
            ? activity.status === 1 ? 0 : 1
            : activity.status,
        }));

				this._$person = { ...this._$person, userActivity: activity }
			}))
	}

	_onDeleteActivity = (id) => {
		return GraphQL.query(DELETE_ACTIVITY_QUERY, {
			id: id
		})
			.then(action(() => {
				const activity = this._$person.userActivity.filter((activity) => {
					return activity.activityId !== id
				})

				this._$person = { ...this._$person, activity }
			}))
	}

	_onAddActivity = () => {
		this.props.history.push(`/person/${this.props.match.params.id}/add-activity`)
	}

}

export default Person
