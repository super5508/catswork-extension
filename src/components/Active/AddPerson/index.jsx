import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import state from 'state/state'

import GraphQL, { gql } from 'services/GraphQL'

import Loading from 'ui/Loading'

import InfoForm from './InfoForm'
import SourceForm from './SourceForm'

const ADD_PERSON_QUERY = gql`
	mutation AddNewLinkedinUserInfo($parameter: userDashboadInputType) {
		AddNewLinkedinUserInfo(parameter: $parameter) {
			id
		}
	}
`

@observer
class AddPerson extends React.Component {

	@observable _$page

	_person

	componentWillMount() {
		console.log(`Add Person`)
		state.setContext('Add Person')
		this._$page = 0
		chrome.storage.local.get(['person'], action(({ person }) => {
			if (person) {
				this._person = person
				chrome.storage.local.set({ person: null }, action(() => {
					this._$page = 1
				}))
				chrome.browserAction.setBadgeText({ text: '' })
			}
			else {
				this._person = {}
				this._$page = 1
			}
		}))
	}

	render() {
		if (this._$page === 0) {
			return <Loading />
		}
		if (this._$page === 1) {
			return <InfoForm person={this._person} onSubmit={this._onInfoFormSubmit} />
		}
		else {
			return (
				<SourceForm first={this._person.first}
					last={this._person.last}
					onSubmit={this._onSourceFormSubmit} />
			)
		}
	}

	@action
	_onInfoFormSubmit = (values) => {
		this._person = values
		for (let key of Object.keys(this._person)) {
			if (this._person[key] === '') {
				this._person[key] = null
			}
		}

		this._$page = 2
	}

	_onSourceFormSubmit = (values) => {
		this._person = Object.assign({}, this._person, values)

		return GraphQL.query(ADD_PERSON_QUERY, { parameter: this._person })
			.then((response) => {
				console.log(`This is response from Graph Add Person Query`, response)
				this.props.history.push(`/person/${response.data.AddNewLinkedinUserInfo.id}`)
			})
	}

}

export default AddPerson
