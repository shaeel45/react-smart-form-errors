/**
 * Validates numeric value with optional min/max constraints
 * @param {string|number} value - The value to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum allowed value
 * @param {number} options.max - Maximum allowed value
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function number(value, options = {}) {
  if (value === null || value === undefined || value === '') return null;

  const numValue = Number(value);

  // Check if it's a valid number
  if (isNaN(numValue)) {
    return { type: 'number', reason: 'not_a_number' };
  }

  // Check minimum value
  if (options.min !== undefined && numValue < options.min) {
    return { type: 'number', reason: 'min', value: options.min };
  }

  // Check maximum value
  if (options.max !== undefined && numValue > options.max) {
    return { type: 'number', reason: 'max', value: options.max };
  }

  return null;
}
