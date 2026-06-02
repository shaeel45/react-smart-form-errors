/**
 * Validates minimum string length
 * @param {string} value - The value to validate
 * @param {Object} options - Validation options
 * @param {number} options.length - Minimum length required
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function minLength(value, options = {}) {
  if (!value || !options.length) return null;

  if (String(value).length < options.length) {
    return { type: 'minLength', value: options.length };
  }

  return null;
}
