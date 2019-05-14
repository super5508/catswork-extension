import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import { EnumIndustry, EnumSource } from 'models/enums'

import s from './info.less'

@observer
class Info extends React.Component {

	@observable _$showMore = false

	render() {
		const { industry, email, phone, location, education, hometown, extracurriculars, website, notes, source, sourceCustom } = this.props.person

		let rowElements = [
			<div key='email' className={s.row}>
				<div className={s.label}>Email</div>
				<div className={s.value}>{email || '-'}</div>
			</div>,
			<div key='phone' className={s.row}>
				<div className={s.label}>Phone</div>
				<div className={s.value}>{phone || '-'}</div>
			</div>,
			<div key='location' className={s.row}>
				<div className={s.label}>Location</div>
				<div className={s.value}>{location || '-'}</div>
			</div>,
			<div key='industry' className={s.row}>
				<div className={s.label}>Industry</div>
				<div className={s.value}>{industry ? EnumIndustry[industry] : '-'}</div>
			</div>,
			<div key='source' className={s.row}>
				<div className={s.label}>Source</div>
				<div className={s.value}>{source ? (source === 'OTHER' ? sourceCustom || '-' : EnumSource[source]) : '-'}</div>
			</div>
		]
		if (this._$showMore) {
			rowElements = rowElements.concat(
				<div key='education' className={s.row}>
					<div className={s.label}>Education</div>
					<div className={s.value}>{education || '-'}</div>
				</div>,
				<div key='hometown' className={s.row}>
					<div className={s.label}>Hometown</div>
					<div className={s.value}>{hometown || '-'}</div>
				</div>,
				<div key='extracurriculars' className={s.row}>
					<div className={s.label}>Extracurriculars</div>
					<div className={s.value}>{extracurriculars || '-'}</div>
				</div>,
				<div key='website' className={s.row}>
					<div className={s.label}>Website</div>
					<div className={s.value}>{website || '-'}</div>
				</div>,
				<div key='notes' className={s.row}>
					<div className={s.label}>Notes</div>
					<div className={s.value}>{notes || '-'}</div>
				</div>,
			)
		}

		return (
			<div className={s.info}>
				<div className={s.table}>{rowElements}</div>
				<a className={s.toggle} onClick={this._onToggle}>{this._$showMore ? 'Show less' : 'Show more'} <i className={`fas fa-caret-${this._$showMore ? 'up' : 'down'}`} /></a>
			</div>
		)
	}

	@action
	_onToggle = () => {
		this._$showMore = !this._$showMore
	}

}

export default Info
