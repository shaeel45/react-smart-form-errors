/**
 * Validates first name
 * @param {string} value - The first name to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function firstName(value) {
  if (!value) return null;

  const trimmed = value.trim();

  // Must start with a letter
  if (!/^[a-zA-Z]/.test(trimmed)) {
    return { type: 'firstName' };
  }

  // Only letters, hyphens, or apostrophes allowed
  if (!/^[a-zA-Z'-]+$/.test(trimmed)) {
    return { type: 'firstName' };
  }

  // Minimum 2 characters
  if (trimmed.length < 2) {
    return { type: 'firstName', reason: 'minLength', value: 2 };
  }

  return null;
}
