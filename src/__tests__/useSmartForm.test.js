import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useSmartForm from '../hooks/useSmartForm';

describe('useSmartForm Hook', () => {
  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useSmartForm());
      expect(result.current.values).toEqual({});
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });

    it('should initialize with initial values', () => {
      const initialValues = {
        email: '',
        password: '',
        fullName: '',
        phone: '',
        dob: '',
      };
      const { result } = renderHook(() => useSmartForm({ initialValues }));
      expect(result.current.values).toEqual(initialValues);
    });

    it('should not add undefined or object keys to values', () => {
      const initialValues = {
        email: '',
        password: '',
        fullName: '',
      };
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues,
          rules: {
            email: 'required',
          },
        })
      );

      const valueKeys = Object.keys(result.current.values);
      expect(valueKeys).toEqual(['email', 'password', 'fullName']);
      expect(valueKeys.includes('[object Object]')).toBe(false);
    });
  });

  describe('Form State', () => {
    it('should compute isValid correctly', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: '' },
          rules: { email: 'required' },
        })
      );

      expect(result.current.isValid).toBe(false);

      act(() => {
        result.current.setValue('email', 'test@example.com');
      });

      expect(result.current.isValid).toBe(true);
    });

    it('should compute isDirty by comparing with initialValues', () => {
      const initialValues = {
        email: 'john@example.com',
        name: 'John',
      };

      const { result } = renderHook(() =>
        useSmartForm({ initialValues })
      );

      expect(result.current.isDirty).toBe(false);

      act(() => {
        result.current.setValue('name', 'Jane');
      });

      expect(result.current.isDirty).toBe(true);

      act(() => {
        result.current.setValue('name', 'John');
      });

      expect(result.current.isDirty).toBe(false);
    });

    it('should keep errors and touched as objects', () => {
      const { result } = renderHook(() => useSmartForm());
      expect(typeof result.current.errors).toBe('object');
      expect(typeof result.current.touched).toBe('object');
      expect(Array.isArray(result.current.errors)).toBe(false);
      expect(Array.isArray(result.current.touched)).toBe(false);
    });
  });

  describe('Required Validation', () => {
    it('should validate required field', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: '' },
          rules: { email: 'required' },
        })
      );

      const error = result.current.validateField('email', '');
      expect(error).not.toBeNull();
      expect(error.type).toBe('required');

      const validError = result.current.validateField('email', 'test@example.com');
      expect(validError).toBeNull();
    });
  });

  describe('Email Validation', () => {
    it('should validate email format', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          rules: { email: 'email' },
        })
      );

      const invalidEmail = result.current.validateField('email', 'invalid');
      expect(invalidEmail).not.toBeNull();
      expect(invalidEmail.type).toBe('email');

      const validEmail = result.current.validateField('email', 'test@example.com');
      expect(validEmail).toBeNull();
    });
  });

  describe('Phone Validation', () => {
    it('should validate phone format', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          rules: { phone: 'phone' },
        })
      );

      const invalidPhone = result.current.validateField('phone', '123');
      expect(invalidPhone).not.toBeNull();
      expect(invalidPhone.type).toBe('phone');

      const validPhone = result.current.validateField('phone', '03001234567');
      expect(validPhone).toBeNull();

      const validPhoneWithPlus = result.current.validateField('phone', '+923001234567');
      expect(validPhoneWithPlus).toBeNull();
    });
  });

  describe('Password Validation', () => {
    it('should validate password strength', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          rules: { password: { rule: 'password', minLength: 8 } },
        })
      );

      const error = result.current.validateField('password', 'weak');
      expect(error).not.toBeNull();

      const validPassword = result.current.validateField('password', 'Test1234!');
      expect(validPassword).toBeNull();
    });
  });

  describe('Full Name Validation', () => {
    it('should validate full name', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          rules: { fullName: 'fullname' },
        })
      );

      const invalidName = result.current.validateField('fullName', 'John');
      expect(invalidName).not.toBeNull();

      const validName = result.current.validateField('fullName', 'John Doe');
      expect(validName).toBeNull();
    });
  });

  describe('DOB minAge Validation', () => {
    it('should validate minAge requirement', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          rules: { dob: { rule: 'dob', minAge: 18 } },
        })
      );

      const tooYoung = new Date();
      tooYoung.setFullYear(tooYoung.getFullYear() - 16);

      const error = result.current.validateField('dob', tooYoung);
      expect(error).not.toBeNull();
      expect(error.reason).toBe('min_age');

      const oldEnough = new Date();
      oldEnough.setFullYear(oldEnough.getFullYear() - 25);

      const validError = result.current.validateField('dob', oldEnough);
      expect(validError).toBeNull();
    });
  });

  describe('Form Validation', () => {
    it('should validate all fields and return false when invalid', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: {
            email: 'invalid',
            password: '',
            fullName: '',
          },
          rules: {
            email: 'email',
            password: 'required',
            fullName: 'required',
          },
        })
      );

      const isValid = result.current.validateForm();
      expect(isValid).toBe(false);
      expect(result.current.errors.email).toBeDefined();
      expect(result.current.errors.password).toBeDefined();
      expect(result.current.errors.fullName).toBeDefined();
    });

    it('should validate all fields and return true when valid', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: {
            email: 'test@example.com',
            password: 'Test1234!',
            fullName: 'John Doe',
          },
          rules: {
            email: ['required', 'email'],
            password: ['required', { rule: 'password', minLength: 8 }],
            fullName: ['required', 'fullname'],
          },
        })
      );

      const isValid = result.current.validateForm();
      expect(isValid).toBe(true);
      expect(Object.keys(result.current.errors).length).toBe(0);
    });

    it('should set all touched fields to true when validateForm is called', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: {
            email: '',
            password: '',
          },
          rules: {
            email: 'required',
            password: 'required',
          },
        })
      );

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.touched.email).toBe(true);
      expect(result.current.touched.password).toBe(true);
    });
  });

  describe('Error Management', () => {
    it('should not store undefined error keys', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: '' },
          rules: { email: 'required' },
        })
      );

      act(() => {
        result.current.validateField('email', '');
      });

      const errorKeys = Object.keys(result.current.errors);
      expect(errorKeys.includes('undefined')).toBe(false);
    });

    it('should delete error key when error is fixed', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: 'invalid' },
          rules: { email: 'email' },
        })
      );

      act(() => {
        result.current.handleBlur({ target: { name: 'email' } });
      });

      expect(result.current.errors.email).toBeDefined();

      act(() => {
        result.current.handleChange('email', 'test@example.com');
      });

      expect(result.current.errors.email).toBeUndefined();
    });

    it('should allow setting and clearing errors with setError', () => {
      const { result } = renderHook(() => useSmartForm());

      act(() => {
        result.current.setError('email', { type: 'custom' });
      });

      expect(result.current.errors.email).toBeDefined();

      act(() => {
        result.current.setError('email', null);
      });

      expect(result.current.errors.email).toBeUndefined();
    });
  });

  describe('Event Handlers', () => {
    it('should handle React change events', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: '' },
        })
      );

      const event = {
        target: { name: 'email', value: 'test@example.com', type: 'text' },
      };

      act(() => {
        result.current.handleChange(event);
      });

      expect(result.current.values.email).toBe('test@example.com');
    });

    it('should support manual handleChange with field name and value', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: '' },
        })
      );

      act(() => {
        result.current.handleChange('email', 'test@example.com');
      });

      expect(result.current.values.email).toBe('test@example.com');
    });

    it('should handle React blur events', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: 'invalid' },
          rules: { email: 'email' },
        })
      );

      const event = {
        target: { name: 'email' },
      };

      act(() => {
        result.current.handleBlur(event);
      });

      expect(result.current.touched.email).toBe(true);
      expect(result.current.errors.email).toBeDefined();
    });

    it('should support manual handleBlur with field name', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: 'invalid' },
          rules: { email: 'email' },
        })
      );

      act(() => {
        result.current.handleBlur('email');
      });

      expect(result.current.touched.email).toBe(true);
      expect(result.current.errors.email).toBeDefined();
    });

    it('should validate on change after field is touched', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: 'invalid' },
          rules: { email: 'email' },
        })
      );

      // First blur to mark as touched
      act(() => {
        result.current.handleBlur('email');
      });

      expect(result.current.errors.email).toBeDefined();

      // Now change should validate
      act(() => {
        result.current.handleChange('email', 'test@example.com');
      });

      expect(result.current.errors.email).toBeUndefined();
    });

    it('should handle checkbox change', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { agreed: false },
        })
      );

      const event = {
        target: { name: 'agreed', checked: true, type: 'checkbox' },
      };

      act(() => {
        result.current.handleChange(event);
      });

      expect(result.current.values.agreed).toBe(true);
    });
  });

  describe('Field Validation', () => {
    it('should validate field and update errors', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: '' },
          rules: { email: 'required' },
        })
      );

      act(() => {
        result.current.validateField('email', '');
      });

      expect(result.current.errors.email).toBeDefined();
    });

    it('should support array of rules', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          rules: {
            password: ['required', { rule: 'password', minLength: 8 }],
          },
        })
      );

      const emptyError = result.current.validateField('password', '');
      expect(emptyError?.type).toBe('required');

      const weakError = result.current.validateField('password', 'weak');
      expect(weakError?.type).toBe('password');
    });

    it('should support object rules with options', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          rules: {
            dob: {
              rule: 'dob',
              minAge: 18,
            },
          },
        })
      );

      const underageDate = new Date();
      underageDate.setFullYear(underageDate.getFullYear() - 16);

      const error = result.current.validateField('dob', underageDate);
      expect(error?.reason).toBe('min_age');
    });
  });

  describe('getFieldError', () => {
    it('should return error message string', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: 'invalid' },
          rules: { email: 'email' },
        })
      );

      act(() => {
        result.current.validateForm();
      });

      const errorMessage = result.current.getFieldError('email');
      expect(typeof errorMessage).toBe('string');
      expect(errorMessage.length).toBeGreaterThan(0);
    });

    it('should return empty string for valid field', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: 'test@example.com' },
          rules: { email: 'email' },
        })
      );

      const errorMessage = result.current.getFieldError('email');
      expect(errorMessage).toBe('');
    });

    it('should return empty string for field with no rules', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { name: 'John' },
        })
      );

      const errorMessage = result.current.getFieldError('name');
      expect(errorMessage).toBe('');
    });
  });

  describe('Custom Messages', () => {
    it('should use custom messages', () => {
      const customMessages = {
        email: () => 'Please enter a valid email',
      };

      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: 'invalid' },
          rules: { email: 'email' },
          messages: customMessages,
        })
      );

      act(() => {
        result.current.validateForm();
      });

      const errorMessage = result.current.getFieldError('email');
      expect(errorMessage).toBe('Please enter a valid email');
    });

    it('should merge custom messages with default messages', () => {
      const customMessages = {
        email: () => 'Custom email',
      };

      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: 'invalid', name: '' },
          rules: { email: 'email', name: 'required' },
          messages: customMessages,
        })
      );

      act(() => {
        result.current.validateForm();
      });

      const emailError = result.current.getFieldError('email');
      const nameError = result.current.getFieldError('name');

      expect(emailError).toBe('Custom email');
      expect(nameError).toContain('required');
    });
  });

  describe('Form Reset', () => {
    it('should reset form to initial state', () => {
      const initialValues = { email: 'john@example.com', name: 'John' };
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues,
        })
      );

      act(() => {
        result.current.setValue('name', 'Jane');
        result.current.setTouched({ name: true });
        result.current.setError('name', { type: 'error' });
      });

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });
  });

  describe('Multiple Rules', () => {
    it('should apply multiple validators in sequence', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: {
            email: '',
            password: '',
            fullName: '',
            phone: '',
            dob: '',
          },
          rules: {
            email: ['required', 'email'],
            password: ['required', { rule: 'password', minLength: 8 }],
            fullName: ['required', 'fullname'],
            phone: ['required', 'phone'],
            dob: ['required', { rule: 'dob', minAge: 18 }],
          },
        })
      );

      const isValid = result.current.validateForm();
      expect(isValid).toBe(false);
      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);

      act(() => {
        result.current.setValues({
          email: 'test@example.com',
          password: 'Test1234!',
          fullName: 'John Doe',
          phone: '03001234567',
          dob: new Date('2000-01-01'),
        });
      });

      const isValidAfter = result.current.validateForm();
      expect(isValidAfter).toBe(true);
    });
  });
});

