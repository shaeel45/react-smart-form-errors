/**
 * Validates username (alphanumeric and underscore only)
 * @param {string} value - The username to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 3)
 * @param {number} options.maxLength - Maximum length (default: 20)
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function username(value, options = {}) {
  if (!value) return null;

  const minLength = options.minLength || 3;
  const maxLength = options.maxLength || 20;

  // Check length
  if (value.length < minLength) {
    return { type: 'username', reason: 'minLength', value: minLength };
  }

  if (value.length > maxLength) {
    return { type: 'username', reason: 'maxLength', value: maxLength };
  }

  // Only letters, numbers, and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return { type: 'username', reason: 'invalid_chars' };
  }

  // Cannot start with number or underscore
  if (!/^[a-zA-Z]/.test(value)) {
    return { type: 'username', reason: 'invalid_start' };
  }

  return null;
}
