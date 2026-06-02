/**
 * Example: Using validators directly
 * Shows how to use validators outside of the hook
 */

import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateDOB,
  validateFullName,
  validateUsername,
  validateURL,
  validateNumber,
  validateRequired,
} from 'react-smart-form-errors';

// Example 1: Simple validation
const emailError = validateEmail('user@example.com');
console.log('Email validation:', emailError); // null

const invalidEmail = validateEmail('invalid');
console.log('Invalid email:', invalidEmail); // { type: 'email' }

// Example 2: Password validation with options
const weakPassword = validatePassword('weak', { minLength: 8 });
console.log('Weak password:', weakPassword); // { type: 'password', rule: 'minLength', value: 8 }

const strongPassword = validatePassword('SecurePass123!', { minLength: 8 });
console.log('Strong password:', strongPassword); // null

// Example 3: Age validation
const today = new Date();
const birthDate = new Date();
birthDate.setFullYear(today.getFullYear() - 20);

const ageError = validateDOB(birthDate, { minAge: 18 });
console.log('Age validation:', ageError); // null

const underageError = validateDOB(
  new Date(today.getFullYear() - 16, 0, 1),
  { minAge: 18 }
);
console.log('Underage error:', underageError); // { type: 'dob', reason: 'min_age', value: 18 }

// Example 4: Custom validation wrapper
function validateForm(formData, rules) {
  const errors = {};

  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const fieldValue = formData[fieldName];
    const fieldRuleArray = Array.isArray(fieldRules) ? fieldRules : [fieldRules];

    for (const rule of fieldRuleArray) {
      const validationFn = typeof rule === 'string' 
        ? window.validatorMap[rule]
        : rule;

      if (validationFn) {
        const error = validationFn(fieldValue);
        if (error) {
          errors[fieldName] = error;
          break; // Stop after first error
        }
      }
    }
  }

  return errors;
}

// Validator map for dynamic lookup
const validatorMap = {
  email: validateEmail,
  phone: validatePhone,
  password: validatePassword,
  dob: validateDOB,
  fullName: validateFullName,
  username: validateUsername,
  url: validateURL,
  number: validateNumber,
  required: validateRequired,
};

// Example 5: Usage with form submission
const formData = {
  email: 'john@example.com',
  phone: '03001234567',
  password: 'Secure123!',
};

const validationRules = {
  email: 'email',
  phone: 'phone',
  password: { rule: 'password', minLength: 8 },
};

const formErrors = validateForm(formData, validationRules);
console.log('Form validation result:', formErrors); // {} if all valid

// Example 6: Chaining validators
function createChainedValidator(...validators) {
  return (value) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
}

const emailAndPhoneValidator = createChainedValidator(
  validateRequired,
  validateEmail
);

console.log('Chained validation:', emailAndPhoneValidator('')); // required error
console.log('Chained validation:', emailAndPhoneValidator('invalid')); // email error
console.log('Chained validation:', emailAndPhoneValidator('valid@email.com')); // null

// Example 7: Conditional validation
function conditionalPhoneValidator(value, options = {}) {
  if (options.required) {
    const requiredError = validateRequired(value);
    if (requiredError) return requiredError;
  }

  if (value) {
    return validatePhone(value);
  }

  return null;
}

console.log('Optional phone:', conditionalPhoneValidator(''));
console.log('Required phone:', conditionalPhoneValidator('', { required: true }));

export {
  validateForm,
  validatorMap,
  createChainedValidator,
  conditionalPhoneValidator,
};
