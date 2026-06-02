/**
 * Validates that a field has a value
 * @param {*} value - The value to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function required(value) {
  if (value == null || String(value).trim() === '') {
    return { type: 'required' };
  }
  if (Array.isArray(value) && value.length === 0) {
    return { type: 'required' };
  }
  return null;
}
