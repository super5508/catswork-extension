import React from 'react'

import config from 'config'

import Heading from 'ui/Heading'
import Button from 'ui/Button'

import s from './inactive.less'

const Inactive = () => (
	<div className={s.inactive}>
		<nav className={s.nav}>
			<div className={s.logo}></div>
		</nav>
		<div className={s.content}>
			<Heading size={1} primary>Welcome</Heading>
			<Heading size={2}>Your account isn't quite set up yet</Heading>
			<p>Head to the dashboard to finish setting up your account so you can start using the app.</p>
			<Button size='large'
				href={config.dashboard.url}
				target='_blank'>Dashboard</Button>
		</div>
	</div>
)

export default Inactive
