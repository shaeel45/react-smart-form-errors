/**
 * Validates full name (must contain at least 2 parts)
 * @param {string} value - The full name to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function fullname(value) {
  if (!value) return null;

  const trimmed = value.trim();
  
  // Must have at least 2 parts separated by space
  const parts = trimmed.split(/\s+/);
  
  if (parts.length < 2) {
    return { type: 'fullname' };
  }

  // Each part must start with a letter
  if (!parts.every(part => /^[a-zA-Z]/.test(part))) {
    return { type: 'fullname' };
  }

  // Each part must contain only letters, hyphens, or apostrophes
  if (!parts.every(part => /^[a-zA-Z'-]+$/.test(part))) {
    return { type: 'fullname' };
  }

  return null;
}
