export default function password(value) {
  if (!value) return null;
  return value.length >= 8 ? null : { type: 'password', value: 8 };
}
