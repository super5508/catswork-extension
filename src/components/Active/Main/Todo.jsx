import React from 'react';
import Heading from 'ui/Heading';
import DatePicker, { CalendarContainer } from 'react-datepicker';

import s from './todo.less';

import { EnumActivity } from '../../../models/enums';

const CustomCalendarContainer = ({ children, className }) => (
  <div className={s.calendarContainer}>
    <CalendarContainer className={className}>{children}</CalendarContainer>
  </div>
);

const Todo = ({ activities, notifications, people, onToggle, onReschedule }) => {
  let todoElements = [];

  if (!activities) {
    return null;
  }

  if (activities.length) {
    activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(({ activity, activityId, personId, status, date }) => {
        if (status === 0) {
          const person = people.find(person => person.personId === personId) || {};

          todoElements.push(
            <div key={activityId} className={s.notification}>
              <div className={s.message}>
                {`${EnumActivity[activity]} with ${person.first} ${person.last}`}
              </div>
              <div className={s.done} onClick={onToggle.bind(null, activityId)}>
                done
              </div>
              <DatePicker
                showTimeSelect
                timeFormat="hh:mm aa"
                timeIntervals={15}
                timeCaption="Time"
                minDate={new Date()}
                customInput={<div>reschedule</div>}
                selected={Date.parse(date)}
                calendarContainer={CustomCalendarContainer}
                onChange={onReschedule.bind(null, activityId)}
              />
            </div>
          );
        }
      });
  } else {
    todoElements.push(<div className={s.empty}>Nothing here</div>);
  }

  return (
    <div className={s.todo}>
      <div className={s.heading}>
        <Heading size={4}>To-do</Heading>
      </div>
      <div className={s.container}>{todoElements.map(item => item)}</div>
    </div>
  );
};

export default Todo;
