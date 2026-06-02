/**
 * Complete example of using react-smart-form-errors
 * Shows a registration form with comprehensive validation
 */

import React from 'react';
import { useSmartForm } from 'react-smart-form-errors';

function RegistrationForm() {
  const form = useSmartForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      website: '',
      agreeToTerms: false,
    },
    rules: {
      firstName: ['required', 'firstName'],
      lastName: ['required', 'lastName'],
      email: ['required', 'email'],
      phone: ['required', 'phone'],
      username: [
        'required',
        { rule: 'username', minLength: 3, maxLength: 20 },
      ],
      password: [
        'required',
        { rule: 'password', minLength: 8 },
      ],
      confirmPassword: [
        'required',
        { rule: 'confirmPassword', password: form.values.password },
      ],
      dateOfBirth: [
        'required',
        { rule: 'dob', minAge: 18 },
      ],
      website: ['url'],
      agreeToTerms: ['required'],
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (form.validateForm()) {
      console.log('Form submitted successfully!', form.values);
      // Make API call here
    } else {
      console.log('Form validation failed');
    }
  };

  const renderField = (fieldName, label, type = 'text', placeholder = '') => {
    const error = form.errors[fieldName];
    const isTouched = form.touched[fieldName];
    const hasError = error && isTouched;

    return (
      <div key={fieldName} className="form-group">
        <label htmlFor={fieldName}>{label}</label>
        <input
          id={fieldName}
          name={fieldName}
          type={type}
          value={form.values[fieldName]}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          placeholder={placeholder}
          className={`form-input ${hasError ? 'error' : ''}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${fieldName}-error` : undefined}
        />
        {hasError && (
          <span id={`${fieldName}-error`} className="error-message">
            {form.getFieldError(fieldName)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="form-container">
      <h1>Register Account</h1>
      
      <form onSubmit={handleSubmit} className="registration-form">
        <fieldset>
          <legend>Personal Information</legend>
          {renderField('firstName', 'First Name', 'text', 'John')}
          {renderField('lastName', 'Last Name', 'text', 'Doe')}
          {renderField('dateOfBirth', 'Date of Birth', 'date')}
        </fieldset>

        <fieldset>
          <legend>Contact Information</legend>
          {renderField('email', 'Email', 'email', 'john@example.com')}
          {renderField('phone', 'Phone', 'tel', '03001234567')}
          {renderField('website', 'Website', 'url', 'https://example.com')}
        </fieldset>

        <fieldset>
          <legend>Account Details</legend>
          {renderField('username', 'Username', 'text', 'john_doe')}
          {renderField('password', 'Password', 'password')}
          {renderField('confirmPassword', 'Confirm Password', 'password')}
        </fieldset>

        <fieldset>
          <legend>Agreement</legend>
          <div className="form-group">
            <label htmlFor="agreeToTerms">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={form.values.agreeToTerms}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              I agree to the terms and conditions
            </label>
            {form.errors.agreeToTerms && form.touched.agreeToTerms && (
              <span className="error-message">
                {form.getFieldError('agreeToTerms')}
              </span>
            )}
          </div>
        </fieldset>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={!form.isValid && form.isDirty}
            className="btn-primary"
          >
            Register
          </button>
          
          <button 
            type="button" 
            onClick={form.resetForm}
            className="btn-secondary"
          >
            Clear Form
          </button>
        </div>

        {form.isValid && form.isDirty && (
          <div className="success-message">
            ✓ Form is valid and ready to submit
          </div>
        )}
      </form>

      <style jsx>{`
        .form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .registration-form {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        fieldset {
          margin: 20px 0;
          padding: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background: white;
        }

        legend {
          padding: 0 10px;
          font-weight: 600;
          color: #333;
        }

        .form-group {
          margin: 15px 0;
          display: flex;
          flex-direction: column;
        }

        label {
          margin-bottom: 5px;
          font-weight: 500;
          color: #555;
        }

        .form-input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
        }

        .form-input.error {
          border-color: #dc3545;
          background-color: #fff5f5;
        }

        .error-message {
          color: #dc3545;
          font-size: 12px;
          margin-top: 5px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .btn-primary:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background-color: #545b62;
        }

        .success-message {
          color: #28a745;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          padding: 10px;
          border-radius: 4px;
          margin-top: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default RegistrationForm;
