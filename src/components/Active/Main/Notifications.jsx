import React from 'react'
import TimeAgo from 'react-timeago'

import Heading from 'ui/Heading'

import dateUtil from '../../../dateUtil'

import s from './notifications.less'

const ICONS = {
	ADDED_PERSON: 'fas fa-id-card',
	COMPLETED_ACTIVITY: 'fas fa-check-square',
	SCHEDULED_ACTIVITY: 'fas fa-calendar-day'
}

const Notifications = ({ notifications, onShowPerson }) => {
	let notificationElements
	if (notifications.length) {
		notificationElements = notifications
			.sort((a, b) => new Date(b.date) - new Date(a.date))
			.map(({ notificationId, personId, type, message, createdAt }) =>{ 
			return(
				<div key={notificationId} className={s.notification} onClick={onShowPerson.bind(null, personId)}>
					<div className={s.icon}><i className={ICONS[type]} /></div>
					<div className={s.message}>{message}</div>
					<div className={s.date}><TimeAgo date={parseInt(createdAt)} /></div>
				</div>
			)}
		)
	}
	else {
		notificationElements = (
			<div className={s.empty}>Nothing here</div>
		)
	}

	return (
		<div className={s.notifications}>
			<div className={s.heading}>
				<Heading size={4}>Feed</Heading>
			</div>
			<div className={s.container}>{notificationElements}</div>
		</div>
	)
}

export default Notifications
