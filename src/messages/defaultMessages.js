export default {
  required: field => `${field} is required`,
  invalid: field => `${field} is invalid`,
  email: field => `Please enter a valid ${field.toLowerCase()}`,
  phone: field => `Please enter a valid ${field.toLowerCase()}`,
  password: (field, value) =>
    `${field} must be at least ${value || 8} characters`,
  dob: field => `Please enter a valid date of birth for ${field}`,
  fullname: field => `Please enter your full name for ${field}`,
  minLength: (field, value) => `${field} must be at least ${value} characters`,
  maxLength: (field, value) => `${field} must be less than ${value} characters`,
  pattern: field => `${field} format is invalid`,
};
