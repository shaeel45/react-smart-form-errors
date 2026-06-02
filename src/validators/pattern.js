/**
 * Validates value against a regex pattern
 * @param {string} value - The value to validate
 * @param {Object} options - Validation options
 * @param {RegExp|string} options.regex - The regex pattern to match
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function pattern(value, options = {}) {
  if (!value || !options.regex) return null;

  const regex = typeof options.regex === 'string' ? new RegExp(options.regex) : options.regex;

  if (!regex.test(value)) {
    return { type: 'pattern' };
  }

  return null;
}
