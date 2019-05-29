import { observer } from 'mobx-react'
import React from 'react'
import { MemoryRouter, Switch, Route } from 'react-router'

import state from 'state/state'

import Nav from './Nav'
import Context from './Context'
import Main from './Main'
import People from './People'
import AddPerson from './AddPerson'
import Person from './Person'
import AddActivity from './Person/AddActivity'
import NotFound from './NotFound'
import Chat from './Chat'

@observer
class Active extends React.Component {

	componentWillMount() {
		state.resetSignedIn()
	}

	render() {
		if (state.$tab === 'track') {
			return (
				<MemoryRouter>
					<>
						<Nav />
						<Context />
						<Switch>
							<Route path='/'
								exact
								component={Main} />
							<Route path='/people'
								exact
								component={People} />
							<Route path='/add-person'
								exact
								component={AddPerson} />
							<Route path='/person/:id'
								exact
								component={Person} />
							<Route path='/person/:id/add-activity'
								exact
								component={AddActivity} />
							<Route component={NotFound} />
						</Switch>
					</>
				</MemoryRouter>
			)
		}
		else {
			return (
				<>
					<Nav />
					<Chat />
				</>
			)
		}
	}

}

export default Active
