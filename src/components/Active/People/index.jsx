import React from 'React'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import config from 'config'
import state from 'state/state'
import Button from 'ui/Button'
import Input from 'ui/Input'
import GraphQL, { gql } from 'services/GraphQL'
import Footer from '../Footer'
import s from './people.less'
import Loading from 'ui/Loading'
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


 
class People extends React.Component {

	state = { //TODO: Using State because not sure about the working of mobx here
		people: null,
		loading: true
	}
	
	
	_searchInput

	componentWillMount() {
		state.setContext('People')
		GraphQL.query(PEOPLE_QUERY)
		.then(action((response) => {
			console.log(`Response from peoples Query:`, response)

			// Boolean([]) is truthly 
			this.setState({
				people: response.data.catWorksDashboard,
				loading: false
			})

		}))
		.catch(err => {
			console.error(err)
		})
	}

	_onPersonSelect = (id) => {
		this.props.history.push(`/person/${id}`)
	}

	componentDidMount() {
		this._searchInput.focus()
	}

	render() {

		if (this.state.loading) {
			// just a workaround to fix 'cant read focus of undefined'
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

		if (!this.state.people.length) {
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
		
		return (
			<section className={s.people}>
				<div  style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
						<h2>Name</h2>
						<h2>Firm</h2>
				</div>
				{this.state.people.map(({ personId,	userId, first, last, company }) => {
					// Using Inline styling because .scss wasn't working or I don't know how to use
					return (
						<div key={personId} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} onClick={() => this._onPersonSelect(personId)}>
							<p>{first}{last}</p>
							<p>{company}</p>
						</div>
					)
				})}
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
