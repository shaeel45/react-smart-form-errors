export default function required(value) {
  return value == null || String(value).trim() === '' ? { type: 'required' } : null;
}
