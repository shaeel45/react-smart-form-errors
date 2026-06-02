/**
 * Example: React Hook Form Integration
 * Shows how to use react-smart-form-errors validators with React Hook Form
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateDOB,
} from 'react-smart-form-errors';

function ReactHookFormExample() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    mode: 'onBlur',
  });

  const password = watch('password');

  const onSubmit = (data) => {
    console.log('Form Data:', data);
  };

  const createValidator = (validator, options = {}) => {
    return (value) => {
      const error = validator(value, options);
      if (error) {
        return `Validation failed: ${error.reason || error.type}`;
      }
      return true;
    };
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input
          {...register('email', {
            required: 'Email is required',
            validate: createValidator(validateEmail),
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label>Phone</label>
        <input
          {...register('phone', {
            required: 'Phone is required',
            validate: createValidator(validatePhone),
          })}
        />
        {errors.phone && <span>{errors.phone.message}</span>}
      </div>

      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          {...register('dob', {
            required: 'DOB is required',
            validate: createValidator(validateDOB, { minAge: 18 }),
          })}
        />
        {errors.dob && <span>{errors.dob.message}</span>}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          {...register('password', {
            required: 'Password is required',
            validate: createValidator(validatePassword, { minLength: 8 }),
          })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          {...register('confirmPassword', {
            required: 'Confirm password is required',
            validate: (value) => {
              if (value !== password) {
                return 'Passwords do not match';
              }
              return true;
            },
          })}
        />
        {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default ReactHookFormExample;
