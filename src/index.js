// Main hook
export { default as useSmartForm } from './hooks/useSmartForm';

// Validators - named exports for direct imports
export {
  email as validateEmail,
  phone as validatePhone,
  password as validatePassword,
  dob as validateDOB,
  fullname as validateFullName,
  required as validateRequired,
  firstName as validateFirstName,
  lastName as validateLastName,
  username as validateUsername,
  url as validateURL,
  number as validateNumber,
  confirmPassword as validateConfirmPassword,
  minLength as validateMinLength,
  maxLength as validateMaxLength,
  pattern as validatePattern,
} from './validators';

// Validators - default export
export { default as validators } from './validators';

// Messages
export { default as messages } from './messages/defaultMessages';

// Utilities
export { default as getFieldLabel } from './utils/getFieldLabel';
export { getErrorMessage } from './utils/getErrorMessage';
export { default as formatFieldName } from './utils/formatFieldName';
