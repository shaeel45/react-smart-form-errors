/**
 * Validates password strength
 * Requires: uppercase, lowercase, number, special character, minimum length
 * @param {string} value - The password to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 8)
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function password(value, options = {}) {
  if (!value) return null;

  const minLength = options.minLength || 8;

  // Check minimum length
  if (value.length < minLength) {
    return { type: 'password', rule: 'minLength', value: minLength };
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(value)) {
    return { type: 'password', rule: 'uppercase' };
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(value)) {
    return { type: 'password', rule: 'lowercase' };
  }

  // Check for number
  if (!/[0-9]/.test(value)) {
    return { type: 'password', rule: 'number' };
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    return { type: 'password', rule: 'special' };
  }

  return null;
}
