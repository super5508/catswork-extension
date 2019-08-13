import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import dateUtil from 'dateUtil'

import { EnumActivity } from 'models/enums'

import Loading from 'ui/Loading'
import Heading from 'ui/Heading'
import Button from 'ui/Button'

import Footer from '../Footer'

import s from './activity.less'

@observer
class Activity extends React.Component {

	@observable _$loading = false
	@observable _$selected = null

	render() {
		let rowElements
		console.log(this.props)
		if (this.props.activity.length) {
			console.log(`This is activity:`, this.props.activity)
			rowElements = this.props.activity
				.sort((a, b) => new Date(b.date) - new Date(a.date))
				.map(({ activityId, activity, activityCustom, date, status }) => {
					const newStatus = status === 0? false : true
					console.log(newStatus)
				return (
					<React.Fragment key={activityId}>
						<div className={[s.row, activityId === this._$selected ? s.active : ''].join(' ')} onClick={this._onSelect.bind(null, activityId)}>
							<div className={s.activityColumn}>{activity === 'OTHER' ? activityCustom || '-' : EnumActivity[activity]}</div>
							<div className={s.dateColumn}><span className={s.small}>{dateUtil.formatDate(new Date(date))}</span></div>
							<div className={s.timeColumn}><span className={s.small}>{dateUtil.formatTime(new Date(date))}</span></div>
							<div className={s.statusColumn}><i className={newStatus ? 'fas fa-check-square' : 'far fa-square'} /></div>
						</div>
						{activityId === this._$selected ? (
							this._$loading ? (
								<div className={s.loadingContainer}>
									<Loading small />
								</div>
							) : (
									<div className={s.actions}>
										<Button className={s.actionButton}
											size='small'
											onClick={this._onToggle}>{newStatus? 'Mark incomplete' : 'Mark complete'}</Button> 
										<Button size='small' onClick={this._onDelete}>Delete</Button>
									</div>
								)
						) : null}
					</React.Fragment>
				)})
		}
		else {
			rowElements = <div className={s.empty}>No activity. <a className={s.link} onClick={this.props.onAddActivity}>Plan something</a></div>
		}

		return (
			<div className={s.activity}>
				<Heading size={3}>Activity</Heading>
				<div className={s.table}>
					<div className={s.head}>
						<div className={s.activityColumn}><span className={s.label}>Activity</span></div>
						<div className={s.dateColumn}><span className={s.label}>Date</span></div>
						<div className={s.timeColumn}><span className={s.label}>Time</span></div>
						<div className={s.statusColumn}><span className={s.label}><i className='fas fa-check-square' /></span></div>
					</div>
					<div className={s.body}>{rowElements}</div>
				</div>
				<Footer>
					<Button block
						center
						onClick={this.props.onAddActivity}>Plan something</Button>
				</Footer>
			</div>
		)
	}

	@action
	_onSelect = (id) => {
		if (id === this._$selected) {
			this._$selected = null
		}
		else {
			this._$selected = id
		}
	}

	@action
	_onToggle = () => {
		this._$loading = true

		this.props.onToggle(this._$selected).then(action(() => {
			this._$loading = false
			this._$selected = null
		}))
	}

	@action
	_onDelete = () => {
		this._$loading = true

		this.props.onDelete(this._$selected).then(action(() => {
			this._$loading = false
			this._$selected = null
		}))
	}

}

export default Activity
