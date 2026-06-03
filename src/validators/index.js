import email from './email';
import phone from './phone';
import password from './password';
import dob from './dob';
import fullname from './fullname';
import required from './required';
import firstName from './firstName';
import lastName from './lastName';
import username from './username';
import url from './url';
import number from './number';
import confirmPassword from './confirmPassword';
import minLength from './minLength';
import maxLength from './maxLength';
import pattern from './pattern';

export default {
  email,
  phone,
  password,
  dob,
  fullname,
  fullName: fullname,
  required,
  firstName,
  lastName,
  username,
  url,
  number,
  confirmPassword,
  minLength,
  maxLength,
  pattern,
};

// Named exports for tree-shaking and direct imports
export {
  email,
  phone,
  password,
  dob,
  fullname,
  required,
  firstName,
  lastName,
  username,
  url,
  number,
  confirmPassword,
  minLength,
  maxLength,
  pattern,
};
