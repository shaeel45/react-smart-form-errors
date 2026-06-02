/**
 * Utility function to get error message for a validation error
 * @param {string|Object} error - The validation error (string or object from a validator)
 * @param {string} fieldName - The name of the field
 * @param {Object} messages - The messages object with custom messages
 * @returns {string} The error message
 */
export function getErrorMessage(error, fieldName, messages = {}) {
  if (!error) return '';

  // Generate field label from field name
  const label = fieldName
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

  // If error is a string, return it directly
  if (typeof error === 'string') {
    return error;
  }

  // If error is not an object, return generic message
  if (typeof error !== 'object' || error === null) {
    return `${label} is invalid`;
  }

  // Error is an object
  const errorType = error.type;
  const messageConfig = messages[errorType];

  // If no message config for this error type, return generic message
  if (!messageConfig) {
    return `${label} is invalid`;
  }

  // If message is a function, call it with label and value/reason
  if (typeof messageConfig === 'function') {
    return messageConfig(label, error.value || error.reason);
  }

  // If message is an object (nested error types like password.minLength)
  if (typeof messageConfig === 'object' && messageConfig !== null) {
    const reason = error.reason || error.rule;
    if (reason) {
      const reasonMessage = messageConfig[reason];
      if (typeof reasonMessage === 'function') {
        return reasonMessage(label, error.value);
      }
      if (typeof reasonMessage === 'string') {
        return reasonMessage;
      }
    }
  }

  // Fallback to generic message
  return `${label} is invalid`;
}
