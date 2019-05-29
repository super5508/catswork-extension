import React from 'react'

import state from 'state/state'

import Heading from 'ui/Heading'

import s from './notFound.less'

class NotFound extends React.Component {

	componentWillMount() {
		state.setContext('Not found')
	}

	render() {
		return (
			<section className={s.notFound}>
				<Heading size={2}>Not found</Heading>
			</section>
		)
	}

}

export default NotFound
