/**
 * Converts a field name to a readable label
 * @param {string} fieldName - The field name to convert
 * @returns {string} The formatted field label
 */
export default function getFieldLabel(fieldName) {
  if (!fieldName) return '';
  
  return fieldName
    .replace(/[_-]+/g, ' ')        // Replace underscores and hyphens with spaces
    .replace(/([a-z])([A-Z])/g, '$1 $2')  // Handle camelCase
    .replace(/\b\w/g, (c) => c.toUpperCase())  // Capitalize each word
    .trim();
}
