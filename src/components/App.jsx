import { observer } from 'mobx-react'
import React from 'react'

import state, { ActiveStep } from 'state/state'

import Loading from 'ui/Loading'

import SignedOut from './SignedOut'
import Inactive from './Inactive'
import Active from './Active'



@observer
class App extends React.Component {
	componentWillMount() {
		state.load()
	}

	render() {
		
		if (state.$user === undefined) {
			return <Loading />
		}
		else if (state.$user === null) {
			return <SignedOut />
		}
		else if (state.$user < ActiveStep.ACTIVE) {
			return <Inactive />
		}
		else if (state.$user === ActiveStep.ACTIVE) {
			return <Active />
		}
		else {
			return null
		}
	}

}

export default App
