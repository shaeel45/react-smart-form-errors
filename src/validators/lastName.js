/**
 * Validates last name
 * @param {string} value - The last name to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function lastName(value) {
  if (!value) return null;

  const trimmed = value.trim();

  // Must start with a letter
  if (!/^[a-zA-Z]/.test(trimmed)) {
    return { type: 'lastName' };
  }

  // Only letters, hyphens, or apostrophes allowed
  if (!/^[a-zA-Z'-]+$/.test(trimmed)) {
    return { type: 'lastName' };
  }

  // Minimum 2 characters
  if (trimmed.length < 2) {
    return { type: 'lastName', reason: 'minLength', value: 2 };
  }

  return null;
}
