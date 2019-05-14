import React from 'react'

import s from './header.less'

const Header = ({ person }) => (
	<div className={s.header}>
		<div className={s.name}>{person.first} {person.last}</div>
		<div className={s.position}>{person.position || <span className={s.na}>No position</span>}</div>
		<div className={s.company}>{person.company}</div>
	</div>
)

export default Header
