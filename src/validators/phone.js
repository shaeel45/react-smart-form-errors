export default function phone(value) {
  if (!value) return null;
  const re = /^\+?[0-9]{7,15}$/;
  return re.test(value) ? null : { type: 'phone' };
}
