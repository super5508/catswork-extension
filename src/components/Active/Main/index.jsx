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
	query userRootQueryType {
		catWorksDashboard {
			personId
			first
			last
			company
			position
		}
	}
`
const NOTIFICATIONS_QUERY = gql`
	query userRootQueryType {
	catWorksNotification {
		notificationId
		personId
		activity
		type
		message
		createdAt
		}
	}
`

const ACTIVITIES_QUERY = gql`
	query userRootQueryType {
    catWorksActivity {
      activityId
      userId
      activityCustom
      activity
      status
      personId
      updatedAt
      createdAt
      date
		}
	}
`

const UPDATE_ACTIVITY_QUERY = gql`
	mutation updateActivity($id: Int!, $parameter: user_activity_input!) {
		updateActivity(id: $id, parameter: $parameter) {
				id
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

@observer
class Main extends React.Component {

	@observable _$checkedPerson = false
	@observable.ref _$people = null
	@observable.ref _$notifications = null
  @observable.ref _$activities = null

	componentWillMount() {
		chrome.storage.local.get(['person'], action(({ person }) => {
			if (person) {
				this.props.history.push('/add-person')
			}

			this._$checkedPerson = true
		}))

		GraphQL.query(PEOPLE_QUERY)
			.then(action((response) => {
				console.log(`Response from people Query:`, response)
				this._$people = response.data.catWorksDashboard
			}))
		GraphQL.query(NOTIFICATIONS_QUERY)
			.then(action((response) => {
				console.log(`Response from Notificstion Query:`, response)
				this._$notifications = response.data.catWorksNotification
			}))

    GraphQL.query(ACTIVITIES_QUERY)
      .then(action((response) => {
        console.log('activities list: ', response);
        this._$activities = response.data.catWorksActivity;
      }));

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
				<Todo
          activities={this._$activities}
          notifications={this._$notifications}
          people={this._$people}
          onToggle={this._onToggleActivity}
          onReschedule={this._onReschedule}
        />
				<Notifications
          notifications={this._$notifications}
          onShowPerson={this._onPersonSelect}
        />
			</section>
		)
	}

	_onPersonSelect = (id) => {
		console.log(id)
		this.props.history.push(`/person/${id}`)
	}

	_onViewPeople = () => {
		this.props.history.push('/people')
	}

	_onAddPerson = () => {
		this.props.history.push('/add-person')
	}

  _onToggleActivity = (id) => {
		return GraphQL.query(TOGGLE_ACTIVITY_QUERY, {
			id: id
		})
			.then(action((response) => {
        const updatedResult = this._$activities.map(activity => {
          if (activity.activityId === id) {
            return {
              ...activity,
              status: activity.status === 0 ? 1 : 0,
            };
          }
          return activity;
        });

        this._$activities = updatedResult;
			}))
  }

  _onReschedule = (id, value) => {
      GraphQL.query(UPDATE_ACTIVITY_QUERY, {
        id: parseInt(id),
        parameter: {
          date: value.toISOString()
        }
      })
        .then(() => {
          const updatedActivities = this._$activities.map(activity => {
            if (activity.activityId === id) {
              return {
                ...activity,
                date: value.toISOString()
              };
            }
            return activity;
          });

          this._$activities = updatedActivities
        })
  }
}

export default Main
