import React from 'react'

import s from './loading.less'

class Loading extends React.Component {

	_timeout = undefined

	state = { hidden: true }

	componentDidMount() {
		this._timeout = setTimeout(() => {
			this.setState({ hidden: false })
		}, 500)
	}

	componentWillUnmount() {
		clearTimeout(this._timeout)
	}

	render() {
		return this.state.hidden && this.props.delay
			? null
			: (
				<div className={[s.loading, this.props.small ? s.small : ''].join(' ')}>
					<div className={[s.dot, s.grow].join(' ')} />
					<div className={[s.dot, s.growInverse].join(' ')} />
					<div className={[s.dot, s.grow].join(' ')} />
				</div>
			)
	}

}

export default Loading

