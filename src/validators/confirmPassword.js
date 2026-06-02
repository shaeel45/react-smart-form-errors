/**
 * Validates that a password matches a confirmation password
 * @param {string} value - The confirmation password to validate
 * @param {Object} options - Validation options
 * @param {string} options.password - The original password to match against
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function confirmPassword(value, options = {}) {
  if (!value) return null;

  if (value !== options.password) {
    return { type: 'confirmPassword' };
  }

  return null;
}
