export default {
  // Required validation
  required: (field) => `${field} is required`,

  // Email validation
  email: (field) => `${field} must be a valid email address`,

  // Phone validation
  phone: (field) => `${field} must be a valid phone number`,

  // Password validation
  password: {
    minLength: (field, value) => `${field} must be at least ${value} characters`,
    uppercase: (field) => `${field} must contain at least one uppercase letter`,
    lowercase: (field) => `${field} must contain at least one lowercase letter`,
    number: (field) => `${field} must contain at least one number`,
    special: (field) => `${field} must contain at least one special character (!@#$%^&*)`,
  },

  // Date of birth validation
  dob: {
    invalid_format: (field) => `${field} must be in YYYY-MM-DD format`,
    invalid_type: (field) => `${field} must be a valid date`,
    invalid_date: (field) => `${field} is not a valid date`,
    future_date: (field) => `${field} cannot be a future date`,
    min_age: (field, value) => `${field} must be at least ${value} years old`,
  },

  // Full name validation
  fullname: (field) => `${field} must contain at least first and last name`,

  // First name validation
  firstName: (field) => `${field} must be a valid first name`,

  // Last name validation
  lastName: (field) => `${field} must be a valid last name`,

  // Username validation
  username: {
    minLength: (field, value) => `${field} must be at least ${value} characters`,
    maxLength: (field, value) => `${field} must be less than ${value} characters`,
    invalid_chars: (field) => `${field} can only contain letters, numbers, and underscores`,
    invalid_start: (field) => `${field} must start with a letter`,
  },

  // URL validation
  url: (field) => `${field} must be a valid HTTP or HTTPS URL`,

  // Number validation
  number: {
    not_a_number: (field) => `${field} must be a valid number`,
    min: (field, value) => `${field} must be at least ${value}`,
    max: (field, value) => `${field} must be no more than ${value}`,
  },

  // Min length validation
  minLength: (field, value) => `${field} must be at least ${value} characters`,

  // Max length validation
  maxLength: (field, value) => `${field} must be no more than ${value} characters`,

  // Pattern validation
  pattern: (field) => `${field} does not match the required pattern`,

  // Confirm password validation
  confirmPassword: (field) => `${field} does not match`,

  // Generic invalid message
  invalid: (field) => `${field} is invalid`,
};
