import { FieldProps } from 'formik';
import React from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

/** DatePickerWrapper */
const DatePickerWrapper = (props: ReactDatePickerProps & FieldProps) => {
  const handleChange = (date: any) => {
    props.form.setFieldValue(props.field.name, date);
  };

  return <DatePicker selected={props.field.value} onChange={handleChange} {...props} />;
};

export default DatePickerWrapper;
