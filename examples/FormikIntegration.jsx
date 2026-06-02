/**
 * Example: Formik Integration
 * Shows how to use react-smart-form-errors validators with Formik
 */

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateDOB,
  validateFullName,
} from 'react-smart-form-errors';

// Create a custom Yup schema that uses our validators
const createValidationSchema = () => {
  return Yup.object().shape({
    fullName: Yup.string()
      .required('Full name is required')
      .test('fullName', 'Invalid full name', (value) => {
        const error = validateFullName(value);
        return !error;
      }),
    email: Yup.string()
      .required('Email is required')
      .test('email', 'Invalid email', (value) => {
        const error = validateEmail(value);
        return !error;
      }),
    phone: Yup.string()
      .required('Phone is required')
      .test('phone', 'Invalid phone', (value) => {
        const error = validatePhone(value);
        return !error;
      }),
    password: Yup.string()
      .required('Password is required')
      .test('password', 'Password is too weak', (value) => {
        const error = validatePassword(value, { minLength: 8 });
        return !error;
      }),
    dob: Yup.string()
      .required('Date of birth is required')
      .test('dob', 'Must be 18 years old', (value) => {
        const error = validateDOB(value, { minAge: 18 });
        return !error;
      }),
  });
};

function FormikExample() {
  const validationSchema = createValidationSchema();

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Form submitted:', values);
    setTimeout(() => setSubmitting(false), 1000);
  };

  return (
    <Formik
      initialValues={{
        fullName: '',
        email: '',
        phone: '',
        password: '',
        dob: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form>
          <div>
            <label htmlFor="fullName">Full Name</label>
            <Field
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
            />
            <ErrorMessage name="fullName" component="div" />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <Field
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
            />
            <ErrorMessage name="email" component="div" />
          </div>

          <div>
            <label htmlFor="phone">Phone</label>
            <Field
              id="phone"
              name="phone"
              type="tel"
              placeholder="03001234567"
            />
            <ErrorMessage name="phone" component="div" />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <Field
              id="password"
              name="password"
              type="password"
            />
            <ErrorMessage name="password" component="div" />
          </div>

          <div>
            <label htmlFor="dob">Date of Birth</label>
            <Field
              id="dob"
              name="dob"
              type="date"
            />
            <ErrorMessage name="dob" component="div" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (!isValid && dirty)}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default FormikExample;
