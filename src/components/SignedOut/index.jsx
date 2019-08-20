import React from 'react'

import config from 'config'

import Heading from 'ui/Heading'
import Button from 'ui/Button'

import s from './signedOut.less'

const SignedOut = () => (
	<div className={s.signedOut}>
		<nav className={s.nav}>
			<div className={s.logo}></div>
		</nav>
		<div className={s.content}>
			<Heading size={1} primary>Hi there</Heading>
			<Heading size={2}>Welcome to <span className={s.catsTrack}>CatsWork</span></Heading>
			<p>Sign in using your Google account to start using the app.</p>
			<Button size='large'
				href={`${config.server.url}auth/google`}
				target='_blank'>Sign in</Button>
		</div>
	</div>
)

export default SignedOut
