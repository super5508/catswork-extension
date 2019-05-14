import React from 'react'

import Heading from 'ui/Heading'

import s from './todo.less'

const Todo = () => (
	<div className={s.todo}>
		<Heading size={4}>Todo</Heading>
		<div className={s.container}>
			<div className={s.empty}>Nothing here</div>
		</div>
	</div>
)

export default Todo
