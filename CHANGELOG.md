# Changelog

## [2.0.0] - 2024

### Major Changes

This is a complete transformation from a simple error translation library to a comprehensive form validation library.

#### New Features

- **Complete Form Validation Hook** - `useSmartForm` with full state management, touched tracking, and form-level validation
- **15+ Built-in Validators**:
  - `required` - Field is required
  - `email` - Email format validation
  - `phone` - Phone number validation (Pakistani format support)
  - `password` - Password strength validation (uppercase, lowercase, number, special char)
  - `dob` - Date of birth validation with minimum age support
  - `fullName` - Full name validation (first and last name required)
  - `firstName` - First name validation
  - `lastName` - Last name validation
  - `username` - Username validation (alphanumeric + underscore)
  - `url` - URL validation (HTTP/HTTPS)
  - `number` - Numeric validation with min/max support
  - `confirmPassword` - Password confirmation validation
  - `minLength` - Minimum string length
  - `maxLength` - Maximum string length
  - `pattern` - Regular expression pattern validation

- **Advanced Hook Features**:
  - `values` - Form field values
  - `errors` - Field validation errors
  - `touched` - Track which fields have been touched/blurred
  - `validateField` - Validate single field
  - `validateForm` - Validate all fields
  - `getFieldError` - Get formatted error message
  - `setValue` / `setValues` - Update field values
  - `setError` / `setErrors` - Set errors manually
  - `setTouched` - Mark fields as touched
  - `resetForm` - Reset form to initial state
  - `handleChange` - Change event handler
  - `handleBlur` - Blur event handler
  - `isValid` - Check if form is valid
  - `isDirty` - Check if form has been modified

- **Flexible Rule System**:
  - String rules: `'required'`, `'email'`, `'phone'`
  - Object rules with options: `{ rule: 'password', minLength: 8 }`
  - Custom validator functions: `(value) => error || null`
  - Array of rules: `['required', 'email', customValidator]`

- **Customizable Error Messages**:
  - Global message override
  - Per-validator message customization
  - Message functions with field name and value parameters
  - Nested message structures for complex validators

- **Direct Validator Imports**:
  - Import validators individually for use outside the hook
  - Named exports: `validateEmail`, `validatePhone`, etc.
  - Validators object export for flexibility

- **Comprehensive TypeScript Support**:
  - Full type definitions for all validators
  - Hook return type documentation
  - Configuration interface types
  - Validation rule type definitions

- **Complete Test Suite**:
  - Validator unit tests (90%+ coverage)
  - Hook integration tests
  - Vitest configuration with coverage reports
  - jsdom environment for React component testing

#### API Changes

**Breaking Changes from 1.x:**

- `useSmartForm` signature changed:
  - Old: `useSmartForm(initial, schema)`
  - New: `useSmartForm({ initialValues, rules, messages })`

- Error format standardized:
  - Returns object: `{ type: 'errorType', reason?: 'specific', value?: any }`
  - Replaces previous inconsistent formats

- Validator function signature:
  - Now supports options parameter: `validator(value, options)`
  - Examples: `password(value, { minLength: 8 })`, `dob(value, { minAge: 18 })`

**Migration Guide from 1.x:**

```javascript
// Old API
const { values, errors, validateField, validateAll } = useSmartForm(
  { email: '' },
  { email: 'required' }
);

// New API
const { values, errors, validateField, validateForm } = useSmartForm({
  initialValues: { email: '' },
  rules: { email: 'required' },
});
```

#### Documentation

- Comprehensive README with examples
- React useState integration examples
- React Hook Form integration guide
- Formik integration guide
- Custom validator examples
- TypeScript usage examples
- Browser compatibility notes
- Performance characteristics

#### Framework Integrations

- **React Hook Form** - Direct validator integration
- **Formik** - Custom validation schema support
- **Vanilla React** - Full `useSmartForm` hook support
- Framework-agnostic validator functions

#### Performance Improvements

- Bundle size optimized (~5KB gzipped)
- Zero external dependencies
- Tree-shakeable exports
- Lazy validation on blur events

#### Build & Distribution

- Microbundle for multiple output formats:
  - CommonJS: `dist/react-smart-form-errors.cjs`
  - ES Module: `dist/react-smart-form-errors.esm.js`
  - Modern: `dist/react-smart-form-errors.modern.js`
- TypeScript definitions included: `index.d.ts`

#### Testing Infrastructure

- Vitest for unit and integration tests
- JSDOM environment for React testing
- Coverage reporting with @vitest/coverage-v8
- 90%+ code coverage target

### Development

- Updated all dependencies to latest versions
- Added TypeScript support
- Enhanced validator implementations
- Improved error handling and validation logic

### Removed

- Deprecated `useFormErrorTranslator` export
- Legacy validator implementation details exposed

### Fixed

- Phone validator now supports international formats
- Password validator checks all required character types
- DOB validator properly calculates age with month/day consideration
- Full name validator handles hyphenated and apostrophed names

### Notes

- This is a major rewrite focusing on production-readiness
- Maintains API compatibility where possible
- All validators thoroughly tested
- Ready for production use
