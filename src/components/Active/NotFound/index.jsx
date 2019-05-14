import React from 'react'

import state from 'state/state'

class NotFound extends React.Component {

	componentWillMount() {
		state.setContext('Not found')
	}

	render() {
		return <div>Not found</div>
	}

}

export default NotFound
