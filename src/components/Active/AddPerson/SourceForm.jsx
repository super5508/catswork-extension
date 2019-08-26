import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import * as yup from 'yup'

import { EnumSource } from 'models/enums'

import Loading from 'ui/Loading'
import Input from 'ui/FormikInput'
import Select from 'ui/FormikSelect'
import Button from 'ui/Button'

import Footer from '../Footer'

import s from './sourceForm.less'

const INITIAL_VALUES = {
	source: '',
	sourceCustom: ''
}
const VALIDATION_SCHEMA = yup.object().shape({
	source: yup.string().required('Required').ensure(),
	sourceCustom: yup.string().ensure()
})

class SourceForm extends React.Component {

	_initialValues

	componentWillMount() {
		this._initialValues = { ...INITIAL_VALUES }
	}

	render() {
		return (
			<div className={s.sourceForm}>
				<Formik initialValues={this._initialValues}
					validationSchema={VALIDATION_SCHEMA}
					onSubmit={this._onSubmit}
					render={({ isSubmitting, values }) => (
						<Form style={{height: '300px'}}>
							<div className={s.inputs}>
								{isSubmitting ? <div className={s.overlay} /> : null}
								{isSubmitting ? <Loading /> : null}
								<p className={s.header}>How did you meet or connect with <span className={s.name}>{this.props.first} {this.props.last}</span>?</p>
								<div className={s.container}>
									<ErrorMessage name='source' render={error => <div className={s.error}>{error}</div>} />
									<Field name='source'
										block
										icon='fas fa-handshake'
										placeholder='Source'
										options={EnumSource}
										component={Select} />
								</div>
								{values.source === 'OTHER' ? (
									<div className={s.container}>
										<ErrorMessage name='sourceCustom' render={error => <div className={s.error}>{error}</div>} />
										<Field name='sourceCustom'
											block
											icon='fas fa-info-circle'
											type='text'
											placeholder='Source'
											component={Input} />
									</div>
								) : null}
							</div>
							<Footer>
								<Button button
									block
									center
									type='submit'
									disabled={isSubmitting}>Save</Button>
							</Footer>
						</Form>
					)} />
			</div>
		)
	}

	_onSubmit = (values, { setSubmitting }) => {
		this.props.onSubmit(values)
			.then(() => {
				setSubmitting(false)
			})
			.catch((error)=> {
				console.error(`ERROR ENCOUNTERED:`, error)
			}) 
	}

}

export default SourceForm
