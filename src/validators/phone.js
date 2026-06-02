/**
 * Validates phone numbers (international format support)
 * Supports formats: 03001234567, +923001234567, 923001234567
 * @param {string} value - The phone number to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function phone(value) {
  if (!value) return null;

  // Remove spaces and hyphens
  const cleaned = value.replace(/[\s\-()]/g, '');

  // Pakistani phone patterns:
  // 03XX-XXXXXXX (with or without formatting)
  // +923XX-XXXXXXX
  // 923XX-XXXXXXX
  const phoneRegex = /^(\+92|0092|92)?3[0-9]{9}$/;

  if (!phoneRegex.test(cleaned)) {
    return { type: 'phone' };
  }

  return null;
}
