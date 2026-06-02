export default function dob(value) {
  if (!value) return null;
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(value);
  return ok ? null : { type: 'dob' };
}
