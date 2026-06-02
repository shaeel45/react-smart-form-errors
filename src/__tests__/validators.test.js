import { describe, it, expect } from 'vitest';
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validatePassword,
  validateDOB,
  validateFullName,
  validateFirstName,
  validateLastName,
  validateUsername,
  validateURL,
  validateNumber,
  validateConfirmPassword,
  validateMinLength,
  validateMaxLength,
  validatePattern,
} from '../src/validators';

describe('Validators', () => {
  describe('Required Validator', () => {
    it('should reject empty string', () => {
      expect(validateRequired('')).toBeDefined();
    });

    it('should reject null', () => {
      expect(validateRequired(null)).toBeDefined();
    });

    it('should reject undefined', () => {
      expect(validateRequired(undefined)).toBeDefined();
    });

    it('should reject empty array', () => {
      expect(validateRequired([])).toBeDefined();
    });

    it('should accept non-empty string', () => {
      expect(validateRequired('test')).toBeNull();
    });

    it('should accept non-empty array', () => {
      expect(validateRequired([1])).toBeNull();
    });
  });

  describe('Email Validator', () => {
    it('should accept valid emails', () => {
      expect(validateEmail('john@gmail.com')).toBeNull();
      expect(validateEmail('test.user@example.co.uk')).toBeNull();
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('john@')).toBeDefined();
      expect(validateEmail('john')).toBeDefined();
      expect(validateEmail('@gmail.com')).toBeDefined();
    });
  });

  describe('Phone Validator', () => {
    it('should accept valid Pakistani phone numbers', () => {
      expect(validatePhone('03001234567')).toBeNull();
      expect(validatePhone('+923001234567')).toBeNull();
      expect(validatePhone('923001234567')).toBeNull();
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('0300123')).toBeDefined();
      expect(validatePhone('123')).toBeDefined();
    });
  });

  describe('Password Validator', () => {
    it('should accept strong passwords', () => {
      expect(validatePassword('SecurePass123!')).toBeNull();
      expect(validatePassword('MyPassword@2024')).toBeNull();
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('securepass123!');
      expect(result).toBeDefined();
      expect(result?.rule).toBe('uppercase');
    });

    it('should reject password without lowercase', () => {
      const result = validatePassword('SECUREPASS123!');
      expect(result).toBeDefined();
      expect(result?.rule).toBe('lowercase');
    });

    it('should reject password without number', () => {
      const result = validatePassword('SecurePass!');
      expect(result).toBeDefined();
      expect(result?.rule).toBe('number');
    });

    it('should reject password without special character', () => {
      const result = validatePassword('SecurePass123');
      expect(result).toBeDefined();
      expect(result?.rule).toBe('special');
    });

    it('should reject short password', () => {
      const result = validatePassword('Pass1!', { minLength: 8 });
      expect(result).toBeDefined();
      expect(result?.rule).toBe('minLength');
    });

    it('should accept password with custom minLength', () => {
      expect(validatePassword('Pass1!', { minLength: 6 })).toBeNull();
    });
  });

  describe('DOB Validator', () => {
    it('should accept valid past dates', () => {
      expect(validateDOB('2000-01-15')).toBeNull();
      expect(validateDOB(new Date('2000-01-15'))).toBeNull();
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = validateDOB(futureDate);
      expect(result).toBeDefined();
      expect(result?.reason).toBe('future_date');
    });

    it('should reject invalid format', () => {
      const result = validateDOB('01/15/2000');
      expect(result).toBeDefined();
      expect(result?.reason).toBe('invalid_format');
    });

    it('should check minimum age', () => {
      const underageDate = new Date();
      underageDate.setFullYear(underageDate.getFullYear() - 16);
      const result = validateDOB(underageDate, { minAge: 18 });
      expect(result).toBeDefined();
      expect(result?.reason).toBe('min_age');
    });

    it('should accept age above minimum', () => {
      const ageDate = new Date();
      ageDate.setFullYear(ageDate.getFullYear() - 20);
      expect(validateDOB(ageDate, { minAge: 18 })).toBeNull();
    });
  });

  describe('Full Name Validator', () => {
    it('should accept valid full names', () => {
      expect(validateFullName('John Doe')).toBeNull();
      expect(validateFullName('Mary-Jane Smith')).toBeNull();
      expect(validateFullName("O'Brien Murphy")).toBeNull();
    });

    it('should reject single name', () => {
      expect(validateFullName('John')).toBeDefined();
    });

    it('should reject name with numbers', () => {
      expect(validateFullName('John123 Doe')).toBeDefined();
    });
  });

  describe('First Name Validator', () => {
    it('should accept valid first names', () => {
      expect(validateFirstName('John')).toBeNull();
      expect(validateFirstName('Mary-Jane')).toBeNull();
    });

    it('should reject single character', () => {
      expect(validateFirstName('J')).toBeDefined();
    });

    it('should reject names with numbers', () => {
      expect(validateFirstName('John123')).toBeDefined();
    });
  });

  describe('Last Name Validator', () => {
    it('should accept valid last names', () => {
      expect(validateLastName('Smith')).toBeNull();
      expect(validateLastName('O\\'Brien')).toBeNull();
    });

    it('should reject single character', () => {
      expect(validateLastName('S')).toBeDefined();
    });
  });

  describe('Username Validator', () => {
    it('should accept valid usernames', () => {
      expect(validateUsername('john_doe')).toBeNull();
      expect(validateUsername('user123')).toBeNull();
    });

    it('should reject username starting with number', () => {
      expect(validateUsername('123user')).toBeDefined();
    });

    it('should reject username with invalid characters', () => {
      expect(validateUsername('user@name')).toBeDefined();
    });

    it('should check length constraints', () => {
      const result = validateUsername('ab', { minLength: 3 });
      expect(result).toBeDefined();
      expect(result?.reason).toBe('minLength');
    });
  });

  describe('URL Validator', () => {
    it('should accept valid URLs', () => {
      expect(validateURL('https://example.com')).toBeNull();
      expect(validateURL('http://localhost:3000')).toBeNull();
    });

    it('should reject invalid URLs', () => {
      expect(validateURL('not a url')).toBeDefined();
      expect(validateURL('ftp://example.com')).toBeDefined();
    });
  });

  describe('Number Validator', () => {
    it('should accept valid numbers', () => {
      expect(validateNumber('42')).toBeNull();
      expect(validateNumber(42)).toBeNull();
    });

    it('should reject non-numbers', () => {
      const result = validateNumber('abc');
      expect(result).toBeDefined();
      expect(result?.reason).toBe('not_a_number');
    });

    it('should check minimum value', () => {
      const result = validateNumber('5', { min: 10 });
      expect(result).toBeDefined();
      expect(result?.reason).toBe('min');
    });

    it('should check maximum value', () => {
      const result = validateNumber('15', { max: 10 });
      expect(result).toBeDefined();
      expect(result?.reason).toBe('max');
    });
  });

  describe('Confirm Password Validator', () => {
    it('should accept matching passwords', () => {
      expect(validateConfirmPassword('Pass123!', { password: 'Pass123!' })).toBeNull();
    });

    it('should reject non-matching passwords', () => {
      expect(validateConfirmPassword('Pass123!', { password: 'Different!' })).toBeDefined();
    });
  });

  describe('Min Length Validator', () => {
    it('should accept valid length', () => {
      expect(validateMinLength('hello', { length: 5 })).toBeNull();
    });

    it('should reject short strings', () => {
      expect(validateMinLength('hi', { length: 5 })).toBeDefined();
    });
  });

  describe('Max Length Validator', () => {
    it('should accept valid length', () => {
      expect(validateMaxLength('hello', { length: 5 })).toBeNull();
    });

    it('should reject long strings', () => {
      expect(validateMaxLength('hello world', { length: 5 })).toBeDefined();
    });
  });

  describe('Pattern Validator', () => {
    it('should accept matching pattern', () => {
      expect(validatePattern('ABC123', { regex: /^[A-Z]+[0-9]+$/ })).toBeNull();
    });

    it('should reject non-matching pattern', () => {
      expect(validatePattern('abc123', { regex: /^[A-Z]+[0-9]+$/ })).toBeDefined();
    });

    it('should accept string regex', () => {
      expect(validatePattern('ABC123', { regex: '^[A-Z]+[0-9]+$' })).toBeNull();
    });
  });
});
