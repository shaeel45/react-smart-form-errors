import { useMemo, useState, useCallback } from 'react';

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _createForOfIteratorHelperLoose(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (t) return (t = t.call(r)).next.bind(t);
  if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
    t && (r = t);
    var o = 0;
    return function () {
      return o >= r.length ? {
        done: !0
      } : {
        done: !1,
        value: r[o++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

/**
 * Validates email format
 * @param {string} value - The email to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
function email(value) {
  if (!value) return null;

  // RFC 5322 simplified regex
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return {
      type: 'email'
    };
  }
  return null;
}

/**
 * Validates phone numbers (international format support)
 * Supports formats: 03001234567, +923001234567, 923001234567
 * @param {string} value - The phone number to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
function phone(value) {
  if (!value) return null;

  // Remove spaces and hyphens
  var cleaned = value.replace(/[\s\-()]/g, '');

  // Pakistani phone patterns:
  // 03XX-XXXXXXX (with or without formatting)
  // +923XX-XXXXXXX
  // 923XX-XXXXXXX
  var phoneRegex = /^(\+92|0092|92)?3[0-9]{9}$/;
  if (!phoneRegex.test(cleaned)) {
    return {
      type: 'phone'
    };
  }
  return null;
}

/**
 * Validates password strength
 * Requires: uppercase, lowercase, number, special character, minimum length
 * @param {string} value - The password to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 8)
 * @returns {null|Object} null if valid, error object if invalid
 */
function password(value, options) {
  if (options === void 0) {
    options = {};
  }
  if (!value) return null;
  var minLength = options.minLength || 8;

  // Check minimum length
  if (value.length < minLength) {
    return {
      type: 'password',
      rule: 'minLength',
      value: minLength
    };
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(value)) {
    return {
      type: 'password',
      rule: 'uppercase'
    };
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(value)) {
    return {
      type: 'password',
      rule: 'lowercase'
    };
  }

  // Check for number
  if (!/[0-9]/.test(value)) {
    return {
      type: 'password',
      rule: 'number'
    };
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    return {
      type: 'password',
      rule: 'special'
    };
  }
  return null;
}

/**
 * Validates date of birth
 * @param {string|Date} value - The date of birth to validate (YYYY-MM-DD or Date object)
 * @param {Object} options - Validation options
 * @param {number} options.minAge - Minimum age in years
 * @returns {null|Object} null if valid, error object if invalid
 */
function dob(value, options) {
  if (options === void 0) {
    options = {};
  }
  if (!value) return null;
  var dateObj;

  // Parse date string or Date object
  if (typeof value === 'string') {
    var dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return {
        type: 'dob',
        reason: 'invalid_format'
      };
    }
    dateObj = new Date(value);
  } else if (value instanceof Date) {
    dateObj = value;
  } else {
    return {
      type: 'dob',
      reason: 'invalid_type'
    };
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return {
      type: 'dob',
      reason: 'invalid_date'
    };
  }

  // Check if date is in the future
  if (dateObj > new Date()) {
    return {
      type: 'dob',
      reason: 'future_date'
    };
  }

  // Check minimum age if specified
  if (options.minAge) {
    var today = new Date();
    var age = today.getFullYear() - dateObj.getFullYear();
    var monthDiff = today.getMonth() - dateObj.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < dateObj.getDate()) {
      age--;
    }
    if (age < options.minAge) {
      return {
        type: 'dob',
        reason: 'min_age',
        value: options.minAge
      };
    }
  }
  return null;
}

/**
 * Validates full name (must contain at least 2 parts)
 * @param {string} value - The full name to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
function fullname(value) {
  if (!value) return null;
  var trimmed = value.trim();

  // Must have at least 2 parts separated by space
  var parts = trimmed.split(/\s+/);
  if (parts.length < 2) {
    return {
      type: 'fullname'
    };
  }

  // Each part must start with a letter
  if (!parts.every(function (part) {
    return /^[a-zA-Z]/.test(part);
  })) {
    return {
      type: 'fullname'
    };
  }

  // Each part must contain only letters, hyphens, or apostrophes
  if (!parts.every(function (part) {
    return /^[a-zA-Z'-]+$/.test(part);
  })) {
    return {
      type: 'fullname'
    };
  }
  return null;
}

/**
 * Validates that a field has a value
 * @param {*} value - The value to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
function required(value) {
  if (value == null || String(value).trim() === '') {
    return {
      type: 'required'
    };
  }
  if (Array.isArray(value) && value.length === 0) {
    return {
      type: 'required'
    };
  }
  return null;
}

/**
 * Validates first name
 * @param {string} value - The first name to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
function firstName(value) {
  if (!value) return null;
  var trimmed = value.trim();

  // Must start with a letter
  if (!/^[a-zA-Z]/.test(trimmed)) {
    return {
      type: 'firstName'
    };
  }

  // Only letters, hyphens, or apostrophes allowed
  if (!/^[a-zA-Z'-]+$/.test(trimmed)) {
    return {
      type: 'firstName'
    };
  }

  // Minimum 2 characters
  if (trimmed.length < 2) {
    return {
      type: 'firstName',
      reason: 'minLength',
      value: 2
    };
  }
  return null;
}

/**
 * Validates last name
 * @param {string} value - The last name to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
function lastName(value) {
  if (!value) return null;
  var trimmed = value.trim();

  // Must start with a letter
  if (!/^[a-zA-Z]/.test(trimmed)) {
    return {
      type: 'lastName'
    };
  }

  // Only letters, hyphens, or apostrophes allowed
  if (!/^[a-zA-Z'-]+$/.test(trimmed)) {
    return {
      type: 'lastName'
    };
  }

  // Minimum 2 characters
  if (trimmed.length < 2) {
    return {
      type: 'lastName',
      reason: 'minLength',
      value: 2
    };
  }
  return null;
}

/**
 * Validates username (alphanumeric and underscore only)
 * @param {string} value - The username to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 3)
 * @param {number} options.maxLength - Maximum length (default: 20)
 * @returns {null|Object} null if valid, error object if invalid
 */
function username(value, options) {
  if (options === void 0) {
    options = {};
  }
  if (!value) return null;
  var minLength = options.minLength || 3;
  var maxLength = options.maxLength || 20;

  // Check length
  if (value.length < minLength) {
    return {
      type: 'username',
      reason: 'minLength',
      value: minLength
    };
  }
  if (value.length > maxLength) {
    return {
      type: 'username',
      reason: 'maxLength',
      value: maxLength
    };
  }

  // Only letters, numbers, and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return {
      type: 'username',
      reason: 'invalid_chars'
    };
  }

  // Cannot start with number or underscore
  if (!/^[a-zA-Z]/.test(value)) {
    return {
      type: 'username',
      reason: 'invalid_start'
    };
  }
  return null;
}

/**
 * Validates URL format (HTTP and HTTPS)
 * @param {string} value - The URL to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
function url(value) {
  if (!value) return null;
  try {
    var urlObj = new URL(value);
    // Only allow http and https protocols
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return {
        type: 'url'
      };
    }
    return null;
  } catch (error) {
    return {
      type: 'url'
    };
  }
}

/**
 * Validates numeric value with optional min/max constraints
 * @param {string|number} value - The value to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum allowed value
 * @param {number} options.max - Maximum allowed value
 * @returns {null|Object} null if valid, error object if invalid
 */
function number(value, options) {
  if (options === void 0) {
    options = {};
  }
  if (value === null || value === undefined || value === '') return null;
  var numValue = Number(value);

  // Check if it's a valid number
  if (isNaN(numValue)) {
    return {
      type: 'number',
      reason: 'not_a_number'
    };
  }

  // Check minimum value
  if (options.min !== undefined && numValue < options.min) {
    return {
      type: 'number',
      reason: 'min',
      value: options.min
    };
  }

  // Check maximum value
  if (options.max !== undefined && numValue > options.max) {
    return {
      type: 'number',
      reason: 'max',
      value: options.max
    };
  }
  return null;
}

/**
 * Validates that a password matches a confirmation password
 * @param {string} value - The confirmation password to validate
 * @param {Object} options - Validation options
 * @param {string} options.password - The original password to match against
 * @returns {null|Object} null if valid, error object if invalid
 */
function confirmPassword(value, options) {
  if (options === void 0) {
    options = {};
  }
  if (!value) return null;
  if (value !== options.password) {
    return {
      type: 'confirmPassword'
    };
  }
  return null;
}

/**
 * Validates minimum string length
 * @param {string} value - The value to validate
 * @param {Object} options - Validation options
 * @param {number} options.length - Minimum length required
 * @returns {null|Object} null if valid, error object if invalid
 */
function minLength(value, options) {
  if (options === void 0) {
    options = {};
  }
  if (!value || !options.length) return null;
  if (String(value).length < options.length) {
    return {
      type: 'minLength',
      value: options.length
    };
  }
  return null;
}

/**
 * Validates maximum string length
 * @param {string} value - The value to validate
 * @param {Object} options - Validation options
 * @param {number} options.length - Maximum length allowed
 * @returns {null|Object} null if valid, error object if invalid
 */
function maxLength(value, options) {
  if (options === void 0) {
    options = {};
  }
  if (!value || !options.length) return null;
  if (String(value).length > options.length) {
    return {
      type: 'maxLength',
      value: options.length
    };
  }
  return null;
}

/**
 * Validates value against a regex pattern
 * @param {string} value - The value to validate
 * @param {Object} options - Validation options
 * @param {RegExp|string} options.regex - The regex pattern to match
 * @returns {null|Object} null if valid, error object if invalid
 */
function pattern(value, options) {
  if (options === void 0) {
    options = {};
  }
  if (!value || !options.regex) return null;
  var regex = typeof options.regex === 'string' ? new RegExp(options.regex) : options.regex;
  if (!regex.test(value)) {
    return {
      type: 'pattern'
    };
  }
  return null;
}

var validators = {
  email: email,
  phone: phone,
  password: password,
  dob: dob,
  fullname: fullname,
  fullName: fullname,
  required: required,
  firstName: firstName,
  lastName: lastName,
  username: username,
  url: url,
  number: number,
  confirmPassword: confirmPassword,
  minLength: minLength,
  maxLength: maxLength,
  pattern: pattern
};

var defaultMessages = {
  // Required validation
  required: function required(field) {
    return field + " is required";
  },
  // Email validation
  email: function email(field) {
    return field + " must be a valid email address";
  },
  // Phone validation
  phone: function phone(field) {
    return field + " must be a valid phone number";
  },
  // Password validation
  password: {
    minLength: function minLength(field, value) {
      return field + " must be at least " + value + " characters";
    },
    uppercase: function uppercase(field) {
      return field + " must contain at least one uppercase letter";
    },
    lowercase: function lowercase(field) {
      return field + " must contain at least one lowercase letter";
    },
    number: function number(field) {
      return field + " must contain at least one number";
    },
    special: function special(field) {
      return field + " must contain at least one special character (!@#$%^&*)";
    }
  },
  // Date of birth validation
  dob: {
    invalid_format: function invalid_format(field) {
      return field + " must be in YYYY-MM-DD format";
    },
    invalid_type: function invalid_type(field) {
      return field + " must be a valid date";
    },
    invalid_date: function invalid_date(field) {
      return field + " is not a valid date";
    },
    future_date: function future_date(field) {
      return field + " cannot be a future date";
    },
    min_age: function min_age(field, value) {
      return field + " must be at least " + value + " years old";
    }
  },
  // Full name validation
  fullname: function fullname(field) {
    return field + " must contain at least first and last name";
  },
  // First name validation
  firstName: function firstName(field) {
    return field + " must be a valid first name";
  },
  // Last name validation
  lastName: function lastName(field) {
    return field + " must be a valid last name";
  },
  // Username validation
  username: {
    minLength: function minLength(field, value) {
      return field + " must be at least " + value + " characters";
    },
    maxLength: function maxLength(field, value) {
      return field + " must be less than " + value + " characters";
    },
    invalid_chars: function invalid_chars(field) {
      return field + " can only contain letters, numbers, and underscores";
    },
    invalid_start: function invalid_start(field) {
      return field + " must start with a letter";
    }
  },
  // URL validation
  url: function url(field) {
    return field + " must be a valid HTTP or HTTPS URL";
  },
  // Number validation
  number: {
    not_a_number: function not_a_number(field) {
      return field + " must be a valid number";
    },
    min: function min(field, value) {
      return field + " must be at least " + value;
    },
    max: function max(field, value) {
      return field + " must be no more than " + value;
    }
  },
  // Min length validation
  minLength: function minLength(field, value) {
    return field + " must be at least " + value + " characters";
  },
  // Max length validation
  maxLength: function maxLength(field, value) {
    return field + " must be no more than " + value + " characters";
  },
  // Pattern validation
  pattern: function pattern(field) {
    return field + " does not match the required pattern";
  },
  // Confirm password validation
  confirmPassword: function confirmPassword(field) {
    return field + " does not match";
  },
  // Generic invalid message
  invalid: function invalid(field) {
    return field + " is invalid";
  }
};

/**
 * Utility function to get error message for a validation error
 * @param {string|Object} error - The validation error (string or object from a validator)
 * @param {string} fieldName - The name of the field
 * @param {Object} messages - The messages object with custom messages
 * @returns {string} The error message
 */
function getErrorMessage(error, fieldName, messages) {
  if (messages === void 0) {
    messages = {};
  }
  if (!error) return '';

  // Generate field label from field name
  var label = fieldName.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, function (c) {
    return c.toUpperCase();
  }).trim();

  // If error is a string, return it directly
  if (typeof error === 'string') {
    return error;
  }

  // If error is not an object, return generic message
  if (typeof error !== 'object' || error === null) {
    return label + " is invalid";
  }

  // Error is an object
  var errorType = error.type;
  var messageConfig = messages[errorType];

  // If no message config for this error type, return generic message
  if (!messageConfig) {
    return label + " is invalid";
  }

  // If message is a function, call it with label and value/reason
  if (typeof messageConfig === 'function') {
    return messageConfig(label, error.value || error.reason);
  }

  // If message is an object (nested error types like password.minLength)
  if (typeof messageConfig === 'object' && messageConfig !== null) {
    var reason = error.reason || error.rule;
    if (reason) {
      var reasonMessage = messageConfig[reason];
      if (typeof reasonMessage === 'function') {
        return reasonMessage(label, error.value);
      }
      if (typeof reasonMessage === 'string') {
        return reasonMessage;
      }
    }
  }

  // Fallback to generic message
  return label + " is invalid";
}

var _excluded = ["rule"];

/**
 * A comprehensive form validation hook
 * @param {Object} config - Configuration object
 * @param {Object} config.initialValues - Initial form values
 * @param {Object} config.rules - Validation rules
 * @param {Object} config.messages - Custom error messages (optional)
 * @returns {Object} Form state and handlers
 */
function useSmartForm(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
    _ref$initialValues = _ref.initialValues,
    initialValues = _ref$initialValues === void 0 ? {} : _ref$initialValues,
    _ref$rules = _ref.rules,
    rules = _ref$rules === void 0 ? {} : _ref$rules,
    _ref$messages = _ref.messages,
    messages = _ref$messages === void 0 ? defaultMessages : _ref$messages;
  // Ensure initialValues is a plain object
  var cleanInitialValues = useMemo(function () {
    return typeof initialValues === 'object' && initialValues !== null ? _extends({}, initialValues) : {};
  }, [initialValues]);
  var _useState = useState(cleanInitialValues),
    values = _useState[0],
    setValues = _useState[1];
  var _useState2 = useState({}),
    errors = _useState2[0],
    setErrors = _useState2[1];
  var _useState3 = useState({}),
    touched = _useState3[0],
    setTouched = _useState3[1];

  // Merge custom messages with default messages
  var mergedMessages = useMemo(function () {
    return _extends({}, defaultMessages, messages);
  }, [messages]);

  /**
  * Executes a single validation rule
  */
  var executeRule = function executeRule(rule, value) {
    if (!rule) return null;

    // String rule: references validator by name
    if (typeof rule === 'string') {
      var validator = validators[rule];
      if (validator) {
        return validator(value);
      }
      return null;
    }

    // Object rule: custom configuration
    if (typeof rule === 'object' && rule !== null) {
      var ruleName = rule.rule,
        options = _objectWithoutPropertiesLoose(rule, _excluded);
      var _validator = validators[ruleName];
      if (_validator) {
        return _validator(value, options);
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
  var validateField = useCallback(function (fieldName, fieldValue) {
    var fieldRules = rules[fieldName];
    if (!fieldRules) return null;

    // Handle array of rules
    if (Array.isArray(fieldRules)) {
      for (var _iterator = _createForOfIteratorHelperLoose(fieldRules), _step; !(_step = _iterator()).done;) {
        var rule = _step.value;
        var error = executeRule(rule, fieldValue);
        if (error) return error;
      }
      return null;
    }

    // Handle single rule
    return executeRule(fieldRules, fieldValue);
  }, [rules]);

  /**
   * Validates all fields and sets touched to true for all fields with rules
   */
  var validateForm = useCallback(function () {
    var newErrors = {};
    var newTouched = {};
    Object.keys(rules).forEach(function (fieldName) {
      newTouched[fieldName] = true;
      var error = validateField(fieldName, values[fieldName]);
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
  var getFieldError = useCallback(function (fieldName) {
    var error = errors[fieldName];
    if (!error) return '';
    return getErrorMessage(error, fieldName, mergedMessages);
  }, [errors, mergedMessages]);

  /**
   * Handle input change - supports both React events and manual calls
   */
  var handleChange = useCallback(function (nameOrEvent, manualValue) {
    var fieldName;
    var newValue;

    // Support both React events and manual usage: handleChange("fieldName", value)
    if (typeof nameOrEvent === 'string') {
      fieldName = nameOrEvent;
      newValue = manualValue;
    } else if (nameOrEvent && typeof nameOrEvent === 'object') {
      // React event
      var target = nameOrEvent.target;
      fieldName = target.name;
      var type = target.type,
        checked = target.checked,
        value = target.value;
      newValue = type === 'checkbox' ? checked : value;
    } else {
      return;
    }
    setValues(function (prev) {
      var _extends2;
      return _extends({}, prev, (_extends2 = {}, _extends2[fieldName] = newValue, _extends2));
    });

    // Validate on change if field has been touched
    if (touched[fieldName]) {
      var error = validateField(fieldName, newValue);
      if (error) {
        setErrors(function (prev) {
          var _extends3;
          return _extends({}, prev, (_extends3 = {}, _extends3[fieldName] = error, _extends3));
        });
      } else {
        // Remove error if validation passes
        setErrors(function (prev) {
          var newErrors = _extends({}, prev);
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  }, [touched, validateField]);

  /**
   * Handle blur event - supports both React events and manual calls
   */
  var handleBlur = useCallback(function (nameOrEvent) {
    var fieldName;

    // Support both React events and manual usage: handleBlur("fieldName")
    if (typeof nameOrEvent === 'string') {
      fieldName = nameOrEvent;
    } else if (nameOrEvent && typeof nameOrEvent === 'object') {
      // React event
      fieldName = nameOrEvent.target.name;
    } else {
      return;
    }
    setTouched(function (prev) {
      var _extends4;
      return _extends({}, prev, (_extends4 = {}, _extends4[fieldName] = true, _extends4));
    });

    // Validate on blur
    var error = validateField(fieldName, values[fieldName]);
    if (error) {
      setErrors(function (prev) {
        var _extends5;
        return _extends({}, prev, (_extends5 = {}, _extends5[fieldName] = error, _extends5));
      });
    } else {
      // Remove error if validation passes
      setErrors(function (prev) {
        var newErrors = _extends({}, prev);
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, [values, validateField]);

  /**
   * Set a single field value and validate if touched
   */
  var setValue = useCallback(function (fieldName, value) {
    setValues(function (prev) {
      var _extends6;
      return _extends({}, prev, (_extends6 = {}, _extends6[fieldName] = value, _extends6));
    });

    // Validate if field has been touched
    if (touched[fieldName]) {
      var error = validateField(fieldName, value);
      if (error) {
        setErrors(function (prev) {
          var _extends7;
          return _extends({}, prev, (_extends7 = {}, _extends7[fieldName] = error, _extends7));
        });
      } else {
        // Remove error if validation passes
        setErrors(function (prev) {
          var newErrors = _extends({}, prev);
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  }, [touched, validateField]);

  /**
   * Set a field error manually
   */
  var setError = useCallback(function (fieldName, error) {
    if (error) {
      setErrors(function (prev) {
        var _extends8;
        return _extends({}, prev, (_extends8 = {}, _extends8[fieldName] = error, _extends8));
      });
    } else {
      setErrors(function (prev) {
        var newErrors = _extends({}, prev);
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, []);

  /**
   * Reset form to initial state
   */
  var resetForm = useCallback(function () {
    setValues(cleanInitialValues);
    setErrors({});
    setTouched({});
  }, [cleanInitialValues]);

  /**
   * Check if form is valid (no errors)
   */
  var isValid = useMemo(function () {
    return Object.keys(errors).length === 0;
  }, [errors]);

  /**
   * Check if form is dirty by comparing values with initialValues
   */
  var isDirty = useMemo(function () {
    return Object.keys(cleanInitialValues).some(function (key) {
      return values[key] !== cleanInitialValues[key];
    });
  }, [values, cleanInitialValues]);
  return {
    // State
    values: values,
    errors: errors,
    touched: touched,
    // Validation
    validateField: validateField,
    validateForm: validateForm,
    getFieldError: getFieldError,
    // State setters
    setValue: setValue,
    setError: setError,
    setValues: setValues,
    setTouched: setTouched,
    resetForm: resetForm,
    // Event handlers
    handleChange: handleChange,
    handleBlur: handleBlur,
    // Computed state
    isValid: isValid,
    isDirty: isDirty
  };
}

/**
 * Converts a field name to a readable label
 * @param {string} fieldName - The field name to convert
 * @returns {string} The formatted field label
 */
function getFieldLabel(fieldName) {
  if (!fieldName) return '';
  return fieldName.replace(/[_-]+/g, ' ') // Replace underscores and hyphens with spaces
  .replace(/([a-z])([A-Z])/g, '$1 $2') // Handle camelCase
  .replace(/\b\w/g, function (c) {
    return c.toUpperCase();
  }) // Capitalize each word
  .trim();
}

function formatFieldName(name) {
  if (!name) return '';
  return name.replace(/[_-]+/g, ' ').replace(/\b\w/g, function (c) {
    return c.toUpperCase();
  });
}

export { formatFieldName, getErrorMessage, getFieldLabel, defaultMessages as messages, useSmartForm, confirmPassword as validateConfirmPassword, dob as validateDOB, email as validateEmail, firstName as validateFirstName, fullname as validateFullName, lastName as validateLastName, maxLength as validateMaxLength, minLength as validateMinLength, number as validateNumber, password as validatePassword, pattern as validatePattern, phone as validatePhone, required as validateRequired, url as validateURL, username as validateUsername, validators };
//# sourceMappingURL=react-smart-form-errors.esm.js.map
