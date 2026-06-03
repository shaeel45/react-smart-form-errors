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
  // Ensure initialValues is a plain object
  const cleanInitialValues = useMemo(() => {
    return typeof initialValues === 'object' && initialValues !== null
      ? { ...initialValues }
      : {};
  }, [initialValues]);

  const [values, setValues] = useState(cleanInitialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Merge custom messages with default messages
  const mergedMessages = useMemo(() => {
    return { ...defaultMessages, ...messages };
  }, [messages]);

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
    if (typeof rule === 'object' && rule !== null) {
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
   * Validates all fields and sets touched to true for all fields with rules
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    const newTouched = {};

    Object.keys(rules).forEach((fieldName) => {
      newTouched[fieldName] = true;
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [rules, values, validateField]);

  /**
   * Gets the error message for a field
   */
  const getFieldError = useCallback(
    (fieldName) => {
      const error = errors[fieldName];
      if (!error) return '';
      return getErrorMessage(error, fieldName, mergedMessages);
    },
    [errors, mergedMessages]
  );

  /**
   * Handle input change - supports both React events and manual calls
   */
  const handleChange = useCallback(
    (nameOrEvent, manualValue) => {
      let fieldName;
      let newValue;

      // Support both React events and manual usage: handleChange("fieldName", value)
      if (typeof nameOrEvent === 'string') {
        fieldName = nameOrEvent;
        newValue = manualValue;
      } else if (nameOrEvent && typeof nameOrEvent === 'object') {
        // React event
        const { target } = nameOrEvent;
        fieldName = target.name;
        const { type, checked, value } = target;
        newValue = type === 'checkbox' ? checked : value;
      } else {
        return;
      }

      setValues((prev) => ({
        ...prev,
        [fieldName]: newValue,
      }));

      // Validate on change if field has been touched
      if (touched[fieldName]) {
        const error = validateField(fieldName, newValue);
        if (error) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: error,
          }));
        } else {
          // Remove error if validation passes
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          });
        }
      }
    },
    [touched, validateField]
  );

  /**
   * Handle blur event - supports both React events and manual calls
   */
  const handleBlur = useCallback(
    (nameOrEvent) => {
      let fieldName;

      // Support both React events and manual usage: handleBlur("fieldName")
      if (typeof nameOrEvent === 'string') {
        fieldName = nameOrEvent;
      } else if (nameOrEvent && typeof nameOrEvent === 'object') {
        // React event
        fieldName = nameOrEvent.target.name;
      } else {
        return;
      }

      setTouched((prev) => ({
        ...prev,
        [fieldName]: true,
      }));

      // Validate on blur
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: error,
        }));
      } else {
        // Remove error if validation passes
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    },
    [values, validateField]
  );

  /**
   * Set a single field value and validate if touched
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
        if (error) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: error,
          }));
        } else {
          // Remove error if validation passes
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          });
        }
      }
    },
    [touched, validateField]
  );

  /**
   * Set a field error manually
   */
  const setError = useCallback((fieldName, error) => {
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, []);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setValues(cleanInitialValues);
    setErrors({});
    setTouched({});
  }, [cleanInitialValues]);

  /**
   * Check if form is valid (no errors)
   */
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  /**
   * Check if form is dirty by comparing values with initialValues
   */
  const isDirty = useMemo(() => {
    return Object.keys(cleanInitialValues).some(
      (key) => values[key] !== cleanInitialValues[key]
    );
  }, [values, cleanInitialValues]);

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
