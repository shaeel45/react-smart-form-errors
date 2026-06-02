var react = require('react');

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
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

function email(value) {
  if (!value) return null;
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value) ? null : {
    type: 'email'
  };
}

function phone(value) {
  if (!value) return null;
  var re = /^\+?[0-9]{7,15}$/;
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
  var ok = /^\d{4}-\d{2}-\d{2}$/.test(value);
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
  email: email,
  phone: phone,
  password: password,
  dob: dob,
  fullname: fullname,
  required: required
};

function useSmartForm(initial, schema) {
  if (initial === void 0) {
    initial = {};
  }
  if (schema === void 0) {
    schema = {};
  }
  var _useState = react.useState(initial),
    values = _useState[0],
    setValues = _useState[1];
  var _useState2 = react.useState({}),
    errors = _useState2[0],
    setErrors = _useState2[1];
  var setField = function setField(name, value) {
    return setValues(function (v) {
      var _extends2;
      return _extends({}, v, (_extends2 = {}, _extends2[name] = value, _extends2));
    });
  };
  var validateField = react.useCallback(function (name, value) {
    var rules = schema[name];
    if (!rules) return null;
    var runRule = function runRule(rule) {
      if (typeof rule === 'string') {
        var fn = validators[rule];
        if (!fn) return null;
        return fn(value);
      }
      if (typeof rule === 'function') return rule(value);
      return null;
    };
    if (Array.isArray(rules)) {
      for (var _iterator = _createForOfIteratorHelperLoose(rules), _step; !(_step = _iterator()).done;) {
        var r = _step.value;
        var res = runRule(r);
        if (res) return res;
      }
      return null;
    }

    // single rule
    return runRule(rules);
  }, [schema]);
  var validateAll = react.useCallback(function () {
    var next = {};
    Object.keys(schema).forEach(function (key) {
      var res = validateField(key, values[key]);
      if (res) next[key] = res;
    });
    setErrors(next);
    return next;
  }, [schema, validateField, values]);
  var handleChange = function handleChange(name, value) {
    setField(name, value);
    var res = validateField(name, value);
    setErrors(function (e) {
      var copy = _extends({}, e);
      if (res) copy[name] = res;else delete copy[name];
      return copy;
    });
  };
  return {
    values: values,
    setValues: setValues,
    setField: setField,
    handleChange: handleChange,
    errors: errors,
    setErrors: setErrors,
    validateField: validateField,
    validateAll: validateAll
  };
}

var defaultMessages = {
  required: function required(field) {
    return field + " is required";
  },
  invalid: function invalid(field) {
    return field + " is invalid";
  },
  email: function email(field) {
    return "Please enter a valid " + field.toLowerCase();
  },
  phone: function phone(field) {
    return "Please enter a valid " + field.toLowerCase();
  },
  password: function password(field, value) {
    return field + " must be at least " + (value || 8) + " characters";
  },
  dob: function dob(field) {
    return "Please enter a valid date of birth for " + field;
  },
  fullname: function fullname(field) {
    return "Please enter your full name for " + field;
  },
  minLength: function minLength(field, value) {
    return field + " must be at least " + value + " characters";
  },
  maxLength: function maxLength(field, value) {
    return field + " must be less than " + value + " characters";
  },
  pattern: function pattern(field) {
    return field + " format is invalid";
  }
};

function formatFieldName(name) {
  if (!name) return '';
  return name.replace(/[_-]+/g, ' ').replace(/\b\w/g, function (c) {
    return c.toUpperCase();
  });
}

function useFormErrorTranslator(errors, options) {
  if (options === void 0) {
    options = {};
  }
  var messages = _extends({}, defaultMessages, options.messages);
  var translatedErrors = {};
  if (!errors) return translatedErrors;
  Object.keys(errors).forEach(function (field) {
    var _options$labels;
    var error = errors[field];
    if (!error) return;
    var fieldName = ((_options$labels = options.labels) == null ? void 0 : _options$labels[field]) || capitalize(field);
    var messageFn = messages[error.type];
    if (messageFn) {
      translatedErrors[field] = messageFn(fieldName, error.value);
    } else {
      translatedErrors[field] = fieldName + " is invalid";
    }
  });
  return translatedErrors;
}
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

exports.formatFieldName = formatFieldName;
exports.messages = defaultMessages;
exports.useFormErrorTranslator = useFormErrorTranslator;
exports.useSmartForm = useSmartForm;
exports.validators = validators;
//# sourceMappingURL=react-smart-form-errors.cjs.map
