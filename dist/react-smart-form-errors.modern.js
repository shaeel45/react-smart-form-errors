import { useState, useCallback } from 'react';

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

function email(value) {
  if (!value) return null;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value) ? null : {
    type: 'email'
  };
}

function phone(value) {
  if (!value) return null;
  const re = /^\+?[0-9]{7,15}$/;
  return re.test(value) ? null : {
    type: 'phone'
  };
}

function password(value) {
  if (!value) return null;
  return value.length >= 8 ? null : {
    type: 'password',
    value: 8
  };
}

function dob(value) {
  if (!value) return null;
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(value);
  return ok ? null : {
    type: 'dob'
  };
}

function fullname(value) {
  if (!value) return null;
  return value.trim().split(/\s+/).length >= 2 ? null : {
    type: 'fullname'
  };
}

function required(value) {
  return value == null || String(value).trim() === '' ? {
    type: 'required'
  } : null;
}

var validators = {
  email,
  phone,
  password,
  dob,
  fullname,
  required
};

function useSmartForm(initial = {}, schema = {}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const setField = (name, value) => setValues(v => _extends({}, v, {
    [name]: value
  }));
  const validateField = useCallback((name, value) => {
    const rules = schema[name];
    if (!rules) return null;
    const runRule = rule => {
      if (typeof rule === 'string') {
        const fn = validators[rule];
        if (!fn) return null;
        return fn(value);
      }
      if (typeof rule === 'function') return rule(value);
      return null;
    };
    if (Array.isArray(rules)) {
      for (const r of rules) {
        const res = runRule(r);
        if (res) return res;
      }
      return null;
    }

    // single rule
    return runRule(rules);
  }, [schema]);
  const validateAll = useCallback(() => {
    const next = {};
    Object.keys(schema).forEach(key => {
      const res = validateField(key, values[key]);
      if (res) next[key] = res;
    });
    setErrors(next);
    return next;
  }, [schema, validateField, values]);
  const handleChange = (name, value) => {
    setField(name, value);
    const res = validateField(name, value);
    setErrors(e => {
      const copy = _extends({}, e);
      if (res) copy[name] = res;else delete copy[name];
      return copy;
    });
  };
  return {
    values,
    setValues,
    setField,
    handleChange,
    errors,
    setErrors,
    validateField,
    validateAll
  };
}

var defaultMessages = {
  required: field => `${field} is required`,
  invalid: field => `${field} is invalid`,
  email: field => `Please enter a valid ${field.toLowerCase()}`,
  phone: field => `Please enter a valid ${field.toLowerCase()}`,
  password: (field, value) => `${field} must be at least ${value || 8} characters`,
  dob: field => `Please enter a valid date of birth for ${field}`,
  fullname: field => `Please enter your full name for ${field}`,
  minLength: (field, value) => `${field} must be at least ${value} characters`,
  maxLength: (field, value) => `${field} must be less than ${value} characters`,
  pattern: field => `${field} format is invalid`
};

function formatFieldName(name) {
  if (!name) return '';
  return name.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function useFormErrorTranslator(errors, options = {}) {
  const messages = _extends({}, defaultMessages, options.messages);
  const translatedErrors = {};
  if (!errors) return translatedErrors;
  Object.keys(errors).forEach(field => {
    var _options$labels;
    const error = errors[field];
    if (!error) return;
    const fieldName = ((_options$labels = options.labels) == null ? void 0 : _options$labels[field]) || capitalize(field);
    const messageFn = messages[error.type];
    if (messageFn) {
      translatedErrors[field] = messageFn(fieldName, error.value);
    } else {
      translatedErrors[field] = `${fieldName} is invalid`;
    }
  });
  return translatedErrors;
}
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export { formatFieldName, defaultMessages as messages, useFormErrorTranslator, useSmartForm, validators };
//# sourceMappingURL=react-smart-form-errors.modern.js.map
