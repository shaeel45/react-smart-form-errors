/**
 * Utility function to get error message for a validation error
 * @param {Object} error - The validation error object from a validator
 * @param {string} fieldName - The name of the field
 * @param {Object} messages - The messages object
 * @returns {string} The error message
 */
export function getErrorMessage(error, fieldName, messages) {
  if (!error || !messages) return '';

  const label = fieldName
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

  const errorType = error.type;
  const messageConfig = messages[errorType];

  // If message is a function, call it with label and optional value
  if (typeof messageConfig === 'function') {
    return messageConfig(label, error.value || error.reason);
  }

  // If message is an object (nested error types), use the reason key
  if (typeof messageConfig === 'object' && error.reason) {
    const reasonMessage = messageConfig[error.reason];
    if (typeof reasonMessage === 'function') {
      return reasonMessage(label, error.value);
    }
  }

  // Return generic invalid message
  if (typeof messages.invalid === 'function') {
    return messages.invalid(label);
  }

  return `${label} is invalid`;
}
