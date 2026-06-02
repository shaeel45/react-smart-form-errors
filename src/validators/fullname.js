export default function fullname(value) {
  if (!value) return null;
  return value.trim().split(/\s+/).length >= 2 ? null : { type: 'fullname' };
}
