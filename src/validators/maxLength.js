/**
 * Validates maximum string length
 * @param {string} value - The value to validate
 * @param {Object} options - Validation options
 * @param {number} options.length - Maximum length allowed
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function maxLength(value, options = {}) {
  if (!value || !options.length) return null;

  if (String(value).length > options.length) {
    return { type: 'maxLength', value: options.length };
  }

  return null;
}
