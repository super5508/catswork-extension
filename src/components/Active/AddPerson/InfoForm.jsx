import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import * as yup from 'yup'

import { EnumIndustry } from 'models/enums'

import Loading from 'ui/Loading'
import Input from 'ui/FormikInput'
import Select from 'ui/FormikSelect'
import Button from 'ui/Button'

import Footer from '../Footer'

import s from './infoForm.less'

const INITIAL_VALUES = {
	first: '',
	last: '',
	email: '',
	phone: '',
	position: '',
	industry: '',
	company: '',
	location: '',
	education: '',
	hometown: '',
	notes: ''
}
const VALIDATION_SCHEMA = yup.object().shape({
	first: yup.string().required('Required').ensure(),
	last: yup.string().required('Required').ensure(),
	email: yup.string().email('Invalid email').ensure(),
	phone: yup.string().ensure(),
	position: yup.string().ensure(),
	industry: yup.string().ensure(),
	company: yup.string().required('Required').ensure(),
	location: yup.string().ensure(),
	education: yup.string().ensure(),
	hometown: yup.string().ensure(),
	notes: yup.string().ensure()
})

class InfoForm extends React.Component {

	_initialValues

	componentWillMount() {
		const person = VALIDATION_SCHEMA.cast(this.props.person)
		this._initialValues = { ...INITIAL_VALUES, ...person }
	}

	render() {
		return (
			
			<div className={s.infoForm}>
				<Formik initialValues={this._initialValues}
					validationSchema={VALIDATION_SCHEMA}
					onSubmit={this._onSubmit}
					render={({ isSubmitting }) => (
						<Form>
							<div className={s.inputs}>
								{isSubmitting ? <div className={s.overlay} /> : null}
								{isSubmitting ? <Loading /> : null}
								<div className={s.halfContainer}>
									<div className={s.half}>
										<ErrorMessage name='first' render={error => <div className={s.error}>{error}</div>} />
										<Field name='first'
											block
											icon='fas fa-id-badge'
											type='text'
											placeholder='First'
											component={Input} />
									</div>
									<div className={s.half}>
										<ErrorMessage name='last' render={error => <div className={s.error}>{error}</div>} />
										<Field name='last'
											block
											type='text'
											placeholder='Last'
											component={Input} />
									</div>
								</div>
								<div className={s.container}>
									<ErrorMessage name='email' render={error => <div className={s.error}>{error}</div>} />
									<Field name='email'
										block
										icon='fas fa-envelope'
										type='email'
										placeholder='Email'
										component={Input} />
								</div>
								<div className={s.container}>
									<ErrorMessage name='phone' render={error => <div className={s.error}>{error}</div>} />
									<Field name='phone'
										block
										icon='fas fa-phone'
										type='text'
										placeholder='Phone number'
										component={Input} />
								</div>
								<div className={s.container}>
									<ErrorMessage name='position' render={error => <div className={s.error}>{error}</div>} />
									<Field name='position'
										block
										icon='fas fa-info-circle'
										type='text'
										placeholder='Position'
										component={Input} />
								</div>
								<div className={s.container}>
									<ErrorMessage name='company' render={error => <div className={s.error}>{error}</div>} />
									<Field name='company'
										block
										icon='fas fa-users'
										type='text'
										placeholder='Company'
										component={Input} />
								</div>
								<div className={s.container}>
									<ErrorMessage name='industry' render={error => <div className={s.error}>{error}</div>} />
									<Field name='industry'
										block
										icon='fas fa-industry'
										placeholder='Industry'
										options={EnumIndustry}
										component={Select} />
								</div>
								<div className={s.container}>
									<ErrorMessage name='location' render={error => <div className={s.error}>{error}</div>} />
									<Field name='location'
										block
										icon='fas fa-map-marker-alt'
										type='text'
										placeholder='Location'
										component={Input} />
								</div>
								<div className={s.container}>
									<ErrorMessage name='education' render={error => <div className={s.error}>{error}</div>} />
									<Field name='education'
										block
										icon='fas fa-graduation-cap'
										type='text'
										placeholder='Education'
										component={Input} />
								</div>
								<div className={s.container}>
									<ErrorMessage name='hometown' render={error => <div className={s.error}>{error}</div>} />
									<Field name='hometown'
										block
										icon='fas fa-home'
										type='text'
										placeholder='Hometown'
										component={Input} />
								</div>
								<div className={s.container}>
									<ErrorMessage name='notes' render={error => <div className={s.error}>{error}</div>} />
									<Field name='notes'
										block
										icon='fas fa-sticky-note'
										type='text'
										placeholder='Notes'
										component={Input} />
								</div>
							</div>
							<Footer>
								<Button button
									block
									center
									type='submit'
									disabled={isSubmitting}>Next</Button>
							</Footer>
						</Form>
					)} />
			</ div>
		)
	}

	_onSubmit = (values, { setSubmitting }) => {
		this.props.onSubmit(values)
		setSubmitting(false)
	}

}

export default InfoForm
