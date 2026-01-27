export const defaultMessages = {
  required: field => `${field} is required`,
  minLength: (field, value) =>
    `${field} must be at least ${value} characters`,
  maxLength: (field, value) =>
    `${field} must be less than ${value} characters`,
  pattern: field => `${field} format is invalid`,
};