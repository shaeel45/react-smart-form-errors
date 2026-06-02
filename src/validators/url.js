/**
 * Validates URL format (HTTP and HTTPS)
 * @param {string} value - The URL to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function url(value) {
  if (!value) return null;

  try {
    const urlObj = new URL(value);
    // Only allow http and https protocols
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return { type: 'url' };
    }
    return null;
  } catch (error) {
    return { type: 'url' };
  }
}
