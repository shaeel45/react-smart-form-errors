/**
 * Validates date of birth
 * @param {string|Date} value - The date of birth to validate (YYYY-MM-DD or Date object)
 * @param {Object} options - Validation options
 * @param {number} options.minAge - Minimum age in years
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function dob(value, options = {}) {
  if (!value) return null;

  let dateObj;

  // Parse date string or Date object
  if (typeof value === 'string') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return { type: 'dob', reason: 'invalid_format' };
    }
    dateObj = new Date(value);
  } else if (value instanceof Date) {
    dateObj = value;
  } else {
    return { type: 'dob', reason: 'invalid_type' };
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return { type: 'dob', reason: 'invalid_date' };
  }

  // Check if date is in the future
  if (dateObj > new Date()) {
    return { type: 'dob', reason: 'future_date' };
  }

  // Check minimum age if specified
  if (options.minAge) {
    const today = new Date();
    let age = today.getFullYear() - dateObj.getFullYear();
    const monthDiff = today.getMonth() - dateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dateObj.getDate())
    ) {
      age--;
    }

    if (age < options.minAge) {
      return { type: 'dob', reason: 'min_age', value: options.minAge };
    }
  }

  return null;
}
