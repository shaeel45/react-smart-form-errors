/**
 * Validates email format
 * @param {string} value - The email to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function email(value) {
  if (!value) return null;
  
  // RFC 5322 simplified regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(value)) {
    return { type: 'email' };
  }
  
  return null;
}
