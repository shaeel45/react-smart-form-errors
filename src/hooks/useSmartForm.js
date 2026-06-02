import { useState, useCallback } from 'react';
import validators from '../validators';

export default function useSmartForm(initial = {}, schema = {}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const setField = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const validateField = useCallback(
    (name, value) => {
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
    },
    [schema]
  );

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
      const copy = { ...e };
      if (res) copy[name] = res; else delete copy[name];
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
    validateAll,
  };
}
