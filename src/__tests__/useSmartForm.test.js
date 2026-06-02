import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useSmartForm from '../src/hooks/useSmartForm';

describe('useSmartForm Hook', () => {
  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useSmartForm());
      expect(result.current.values).toEqual({});
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });

    it('should initialize with initial values', () => {
      const initialValues = { name: 'John', email: 'john@example.com' };
      const { result } = renderHook(() => useSmartForm({ initialValues }));
      expect(result.current.values).toEqual(initialValues);
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

    it('should compute isDirty correctly', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { name: '' },
        })
      );

      expect(result.current.isDirty).toBe(false);

      act(() => {
        result.current.setTouched({ name: true });
      });

      expect(result.current.isDirty).toBe(true);
    });
  });

  describe('Field Validation', () => {
    it('should validate single field', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          rules: { email: 'email' },
        })
      );

      const invalidError = result.current.validateField('email', 'invalid');
      expect(invalidError).toBeDefined();

      const validError = result.current.validateField('email', 'test@example.com');
      expect(validError).toBeNull();
    });

    it('should support array of rules', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          rules: {
            password: [
              'required',
              { rule: 'password', minLength: 8 },
            ],
          },
        })
      );

      const emptyError = result.current.validateField('password', '');
      expect(emptyError?.type).toBe('required');

      const weakError = result.current.validateField('password', 'weak');
      expect(weakError?.rule).toBe('minLength');
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

    it('should support function validators', () => {
      const customValidator = (value) => {
        if (value === 'forbidden') {
          return { type: 'custom' };
        }
        return null;
      };

      const { result } = renderHook(() =>
        useSmartForm({
          rules: {
            field: customValidator,
          },
        })
      );

      const error = result.current.validateField('field', 'forbidden');
      expect(error?.type).toBe('custom');
    });
  });

  describe('Form Validation', () => {
    it('should validate all fields', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { email: 'invalid', phone: '' },
          rules: {
            email: 'email',
            phone: 'required',
          },
        })
      );

      const isValid = result.current.validateForm();
      expect(isValid).toBe(false);
      expect(result.current.errors.email).toBeDefined();
      expect(result.current.errors.phone).toBeDefined();
    });

    it('should return true when all fields valid', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: {
            email: 'test@example.com',
            phone: '03001234567',
          },
          rules: {
            email: 'email',
            phone: 'phone',
          },
        })
      );

      const isValid = result.current.validateForm();
      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual({});
    });
  });

  describe('Field Value Management', () => {
    it('should update field value with setValue', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { name: '' },
        })
      );

      act(() => {
        result.current.setValue('name', 'John');
      });

      expect(result.current.values.name).toBe('John');
    });

    it('should update all values with setValues', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { name: '', email: '' },
        })
      );

      act(() => {
        result.current.setValues({ name: 'John', email: 'john@example.com' });
      });

      expect(result.current.values).toEqual({
        name: 'John',
        email: 'john@example.com',
      });
    });
  });

  describe('Error Management', () => {
    it('should set error manually', () => {
      const { result } = renderHook(() => useSmartForm());

      act(() => {
        result.current.setError('email', { type: 'email' });
      });

      expect(result.current.errors.email).toBeDefined();
      expect(result.current.errors.email.type).toBe('email');
    });

    it('should get field error message', () => {
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
      expect(errorMessage).toContain('email');
    });
  });

  describe('Form Reset', () => {
    it('should reset form to initial state', () => {
      const initialValues = { name: 'John', email: 'john@example.com' };
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

  describe('Event Handlers', () => {
    it('should handle change event', () => {
      const { result } = renderHook(() =>
        useSmartForm({
          initialValues: { name: '' },
        })
      );

      const event = {
        target: { name: 'name', value: 'John', type: 'text' },
      };

      act(() => {
        result.current.handleChange(event);
      });

      expect(result.current.values.name).toBe('John');
    });

    it('should handle blur event and mark as touched', () => {
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

  describe('Custom Messages', () => {
    it('should use custom messages', () => {
      const customMessages = {
        email: () => 'Custom email error',
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
      expect(errorMessage).toBe('Custom email error');
    });
  });
});
