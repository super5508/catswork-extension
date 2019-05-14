import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import DatePicker, { CalendarContainer } from 'react-datepicker'
import * as yup from 'yup'

import state from 'state/state'

import { EnumActivity } from 'models/enums'

import GraphQL, { gql } from 'services/GraphQL'

import Loading from 'ui/Loading'
import Input from 'ui/FormikInput'
import InputStandard from 'ui/Input'
import Select from 'ui/FormikSelect'
import Button from 'ui/Button'

import Footer from '../../Footer'

import s from './addActivity.less'

const ADD_ACTIVITY_QUERY = gql`
	mutation AddActivityMutation($id: Int!, $input: ActivityInput!) {
		person(id: $id) {
			addActivity(input: $input) {
				id
			}
		}
	}
`

const INITIAL_VALUES = {
	activity: '',
	activityCustom: '',
	date: null
}
const VALIDATION_SCHEMA = yup.object().shape({
	activity: yup.string().required('Required').ensure(),
	activityCustom: yup.string().ensure(),
	date: yup.date().required('Required').typeError('Required')
})

const CustomCalendarContainer = ({ children, className }) => (
	<div className={s.calendarContainer}>
		<CalendarContainer className={className}>{children}</CalendarContainer>
	</div>
)

class AddActivity extends React.Component {

	_initialValues

	componentWillMount() {
		state.setContext('Add activity')

		this._initialValues = { ...INITIAL_VALUES }
	}

	render() {
		return (
			<section className={s.addActivity}>
				<Formik initialValues={this._initialValues}
					validationSchema={VALIDATION_SCHEMA}
					onSubmit={this._onSubmit}
					render={({ isSubmitting, values, setFieldValue, handleBlur }) => (
						<Form>
							<div className={s.inputs}>
								{isSubmitting ? <div className={s.overlay} /> : null}
								{isSubmitting ? <Loading /> : null}
								<div className={s.container}>
									<ErrorMessage name='activity' render={error => <div className={s.error}>{error}</div>} />
									<Field name='activity'
										block
										icon='fas fa-info-circle'
										placeholder='Activity'
										options={EnumActivity}
										component={Select} />
								</div>
								{values.activity === 'OTHER' ? (
									<div className={s.container}>
										<ErrorMessage name='activityCustom' render={error => <div className={s.error}>{error}</div>} />
										<Field name='activityCustom'
											block
											icon='fas fa-info-circle'
											type='text'
											placeholder='Activity'
											component={Input} />
									</div>
								) : null}
								<div className={s.container}>
									<ErrorMessage name='date' render={error => <div className={s.error}>{error}</div>} />
									<DatePicker selected={values.date}
										showTimeSelect
										timeFormat='hh:mm aa'
										timeIntervals={15}
										dateFormat='MMMM d, yyyy h:mm aa'
										timeCaption='Time'
										placeholderText='Date'
										calendarContainer={CustomCalendarContainer}
										customInput={(
											<InputStandard block
												icon='fas fa-calendar-day'
												name='date'
												type='text'
												onBlur={handleBlur} />
										)}
										onChange={(date) => {
											setFieldValue('date', date)
										}} />
								</div>
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
			</section>
		)
	}

	_onSubmit = (values) => {
		GraphQL.query(ADD_ACTIVITY_QUERY, {
			id: parseInt(this.props.match.params.id),
			input: {
				activity: values.activity,
				activityCustom: values.activityCustom,
				date: values.date.toISOString()
			}
		})
			.then(() => {
				this.props.history.goBack()
			})
	}

}

export default AddActivity
