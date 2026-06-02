import { useState, useCallback, useMemo } from 'react';
import validators from '../validators';
import defaultMessages from '../messages/defaultMessages';
import { getErrorMessage } from '../utils/getErrorMessage';

/**
 * A comprehensive form validation hook
 * @param {Object} config - Configuration object
 * @param {Object} config.initialValues - Initial form values
 * @param {Object} config.rules - Validation rules
 * @param {Object} config.messages - Custom error messages (optional)
 * @returns {Object} Form state and handlers
 */
export default function useSmartForm({
  initialValues = {},
  rules = {},
  messages = defaultMessages,
} = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Merge custom messages with default messages
  const mergedMessages = useMemo(() => {
    return { ...defaultMessages, ...messages };
  }, [messages]);

  /**
   * Validates a single field against its rules
   */
  const validateField = useCallback(
    (fieldName, fieldValue) => {
      const fieldRules = rules[fieldName];
      
      if (!fieldRules) return null;

      // Handle array of rules
      if (Array.isArray(fieldRules)) {
        for (const rule of fieldRules) {
          const error = executeRule(rule, fieldValue);
          if (error) return error;
        }
        return null;
      }

      // Handle single rule
      return executeRule(fieldRules, fieldValue);
    },
    [rules]
  );

  /**
   * Executes a single validation rule
   */
  const executeRule = (rule, value) => {
    if (!rule) return null;

    // String rule: references validator by name
    if (typeof rule === 'string') {
      const validator = validators[rule];
      if (validator) {
        return validator(value);
      }
      return null;
    }

    // Object rule: custom configuration
    if (typeof rule === 'object') {
      const { rule: ruleName, ...options } = rule;
      const validator = validators[ruleName];
      if (validator) {
        return validator(value, options);
      }
      return null;
    }

    // Function rule: custom validator
    if (typeof rule === 'function') {
      return rule(value);
    }

    return null;
  };

  /**
   * Validates all fields
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    Object.keys(rules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [rules, values, validateField]);

  /**
   * Gets the error message for a field
   */
  const getFieldError = useCallback(
    (fieldName) => {
      const error = errors[fieldName];
      if (!error) return null;
      return getErrorMessage(error, fieldName, mergedMessages);
    },
    [errors, mergedMessages]
  );

  /**
   * Handle input change
   */
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
      
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      // Validate on change if field has been touched
      if (touched[name]) {
        const error = validateField(name, newValue);
        setErrors((prev) => ({
          ...prev,
          [name]: error || undefined,
        }));
      }
    },
    [touched, validateField]
  );

  /**
   * Handle blur event
   */
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Validate on blur
      const error = validateField(name, values[name]);
      setErrors((prev) => ({
        ...prev,
        [name]: error || undefined,
      }));
    },
    [values, validateField]
  );

  /**
   * Set a single field value
   */
  const setValue = useCallback(
    (fieldName, value) => {
      setValues((prev) => ({
        ...prev,
        [fieldName]: value,
      }));

      // Validate if field has been touched
      if (touched[fieldName]) {
        const error = validateField(fieldName, value);
        setErrors((prev) => ({
          ...prev,
          [fieldName]: error || undefined,
        }));
      }
    },
    [touched, validateField]
  );

  /**
   * Set a field error manually
   */
  const setError = useCallback((fieldName, error) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  }, []);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * Check if form is valid (no errors)
   */
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  /**
   * Check if any fields have been touched
   */
  const isDirty = useMemo(() => {
    return Object.keys(touched).length > 0;
  }, [touched]);

  return {
    // State
    values,
    errors,
    touched,

    // Validation
    validateField,
    validateForm,
    getFieldError,

    // State setters
    setValue,
    setError,
    setValues,
    setTouched,
    resetForm,

    // Event handlers
    handleChange,
    handleBlur,

    // Computed state
    isValid,
    isDirty,
  };
}
