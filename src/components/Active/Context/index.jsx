import { observer } from 'mobx-react'
import React from 'react'
import { withRouter } from 'react-router'

import state from 'state/state'

import s from './context.less'

@withRouter
@observer
class Context extends React.Component {

	render() {
		const backButton = this.props.history.index > 0
			? (
				<a className={s.back} onClick={this._onBack}>
					<i style={{marginRight: '5px'}} className='fas fa-arrow-left' /> Back
					
				</a>
			) : null
		const actionItem = state.$actionItem
			? <div className={s.actionItem}>{state.$actionItem}</div>
			: null

		return (
			<div className={s.context}>
				{backButton}
				
				{/* REMOVING GREEN AREA <div className={[s.title, this.props.history.index > 0 ? '' : s.root].join(' ')}><span className={s.span}>{state.$title}</span></div> */}
				{actionItem}
			</div>
		)
	}

	_onBack = () => {
		if (this.props.history.index > 0) {
			this.props.history.goBack()
		}
	}

}

export default Context
