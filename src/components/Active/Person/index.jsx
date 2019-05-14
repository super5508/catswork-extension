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
	query PersonQuery($id: Int!) {
		person(id: $id) {
			id
			linkedInId
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

			activity {
				id
				activity
				activityCustom
				date
				status
			}
		}
	}
`
const TOGGLE_ACTIVITY_QUERY = gql`
	mutation ToggleActivityMutation($personId: Int!, $activityId: Int!) {
		person(id: $personId) {
			anActivity(id: $activityId) {
				toggle {
					status
				}
			}
		}
	}
`
const DELETE_ACTIVITY_QUERY = gql`
	mutation DeleteActivityQuery($personId: Int!, $activityId: Int!) {
		person(id: $personId) {
			anActivity(id: $activityId) {
				delete {
					ok
				}
			}
		}
	}
`

@observer
class Person extends React.Component {

	@observable.ref _$person = null

	componentWillMount() {
		state.setContext('View person', <Button size='small' onClick={this._onEdit}>Edit</Button>)

		GraphQL.query(PERSON_QUERY, { id: parseInt(this.props.match.params.id) })
			.then(action(({ data }) => {
				this._$person = data.person
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
				<Activity activity={this._$person.activity}
					onToggle={this._onToggleActivity}
					onDelete={this._onDeleteActivity}
					onAddActivity={this._onAddActivity} />
			</section>
		)
	}

	_onEdit = () => {
		this.props.history.push(`/person/${this.props.match.params.id}/edit`)
	}

	_onToggleActivity = (id) => {
		return GraphQL.query(TOGGLE_ACTIVITY_QUERY, {
			personId: parseInt(this.props.match.params.id),
			activityId: id
		})
			.then(action(({ data }) => {
				const activity = this._$person.activity.map((activity) => {
					if (activity.id === id) {
						return {
							...activity,
							status: data.person.anActivity.toggle.status
						}
					}
					else {
						return { ...activity }
					}
				})

				this._$person = { ...this._$person, activity }
			}))
	}

	_onDeleteActivity = (id) => {
		return GraphQL.query(DELETE_ACTIVITY_QUERY, {
			personId: parseInt(this.props.match.params.id),
			activityId: id
		})
			.then(action(() => {
				const activity = this._$person.activity.filter((activity) => {
					return activity.id !== id
				})

				this._$person = { ...this._$person, activity }
			}))
	}

	_onAddActivity = () => {
		this.props.history.push(`/person/${this.props.match.params.id}/add-activity`)
	}

}

export default Person
