# React Smart Form Errors

A lightweight, production-ready form validation library for React. Zero dependencies, full TypeScript support, and comprehensive validation rules out of the box.

## Features

✅ **15+ Built-in Validators** - email, phone, password, DOB, URLs, and more
✅ **Lightweight** - No external dependencies, tiny bundle size
✅ **TypeScript Support** - Complete type definitions included
✅ **Flexible** - String rules, object rules with options, or custom functions
✅ **Framework Agnostic** - Works with React useState, React Hook Form, or Formik
✅ **Accessible** - Full form state management with touched/untouched tracking
✅ **Customizable Messages** - Override default error messages globally or per-field
✅ **90%+ Test Coverage** - Comprehensive test suite with Vitest

## Installation

```bash
npm install react-smart-form-errors
```

## Quick Start

```jsx
import { useSmartForm } from 'react-smart-form-errors';

function MyForm() {
  const { values, errors, handleChange, handleBlur, validateForm } = useSmartForm({
    initialValues: {
      email: '',
      password: '',
      fullName: '',
    },
    rules: {
      email: ['required', 'email'],
      password: ['required', { rule: 'password', minLength: 8 }],
      fullName: ['required', 'fullName'],
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form is valid!', values);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {errors.email && <span>{errors.email.type}</span>}

      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <input
        name="fullName"
        value={values.fullName}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Available Validators

### Basic Validators

#### `required`
Validates that a field has a value.

```javascript
rules: {
  email: 'required',
  // or in array
  email: ['required', 'email'],
}
```

#### `email`
Validates email format.

```javascript
rules: {
  email: 'email',
}
```

#### `phone`
Validates phone numbers (supports Pakistani format by default: 03001234567, +923001234567, 923001234567).

```javascript
rules: {
  phone: 'phone',
}
```

### Text Validators

#### `fullName`
Validates full names (must have at least first and last name).

```javascript
rules: {
  fullName: 'fullName',
}
```

#### `firstName`
Validates first names.

```javascript
rules: {
  firstName: 'firstName',
}
```

#### `lastName`
Validates last names.

```javascript
rules: {
  lastName: 'lastName',
}
```

#### `username`
Validates usernames (alphanumeric and underscore only).

```javascript
rules: {
  username: [
    'required',
    { rule: 'username', minLength: 3, maxLength: 20 },
  ],
}
```

### Password Validators

#### `password`
Validates password strength (requires uppercase, lowercase, number, and special character).

```javascript
rules: {
  password: [
    'required',
    { rule: 'password', minLength: 8 },
  ],
}
```

#### `confirmPassword`
Validates that a password matches another field.

```javascript
rules: {
  password: ['required', { rule: 'password', minLength: 8 }],
  confirmPassword: [
    'required',
    { rule: 'confirmPassword', password: values.password },
  ],
}
```

### Specialized Validators

#### `dob` (Date of Birth)
Validates date of birth with optional minimum age check.

```javascript
rules: {
  dob: [
    'required',
    { rule: 'dob', minAge: 18 },
  ],
}
```

Supports YYYY-MM-DD format or Date objects.

#### `url`
Validates HTTP/HTTPS URLs.

```javascript
rules: {
  website: 'url',
}
```

#### `number`
Validates numeric values with optional min/max constraints.

```javascript
rules: {
  age: [
    'required',
    { rule: 'number', min: 0, max: 150 },
  ],
}
```

### Length & Pattern Validators

#### `minLength`
Validates minimum string length.

```javascript
rules: {
  bio: ['required', { rule: 'minLength', length: 10 }],
}
```

#### `maxLength`
Validates maximum string length.

```javascript
rules: {
  title: { rule: 'maxLength', length: 100 },
}
```

#### `pattern`
Validates against a regular expression.

```javascript
rules: {
  zipCode: {
    rule: 'pattern',
    regex: /^\d{5}$/,
  },
}
```

## Hook API

### `useSmartForm(config)`

#### Parameters

```typescript
{
  initialValues?: Record<string, any>,
  rules?: ValidationRulesMap,
  messages?: ErrorMessages,
}
```

#### Return Value

```typescript
{
  // State
  values: Record<string, any>,
  errors: Record<string, ValidationError>,
  touched: Record<string, boolean>,

  // Validation methods
  validateField: (fieldName, value) => ValidationError | null,
  validateForm: () => boolean,
  getFieldError: (fieldName) => string | null,

  // State setters
  setValue: (fieldName, value) => void,
  setError: (fieldName, error) => void,
  setValues: (values) => void,
  setTouched: (touched) => void,
  resetForm: () => void,

  // Event handlers
  handleChange: (e: ChangeEvent) => void,
  handleBlur: (e: FocusEvent) => void,

  // Computed state
  isValid: boolean,
  isDirty: boolean,
}
```

## Direct Validator Imports

You can also import validators directly without the hook:

```javascript
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateDOB,
  validateFullName,
  validateUsername,
  validateURL,
  validateNumber,
} from 'react-smart-form-errors';

const error = validateEmail('test@example.com');
// error will be null if valid, or an error object if invalid
```

## Error Messages

### Default Messages

The library comes with sensible default error messages:

```javascript
{
  required: (field) => `${field} is required`,
  email: (field) => `${field} must be a valid email address`,
  phone: (field) => `${field} must be a valid phone number`,
  password: {
    minLength: (field, value) => `${field} must be at least ${value} characters`,
    uppercase: (field) => `${field} must contain at least one uppercase letter`,
    lowercase: (field) => `${field} must contain at least one lowercase letter`,
    number: (field) => `${field} must contain at least one number`,
    special: (field) => `${field} must contain at least one special character`,
  },
  // ... more messages
}
```

### Custom Messages

Override messages globally or per-validation:

```javascript
import { useSmartForm, messages } from 'react-smart-form-errors';

const { values, errors, ... } = useSmartForm({
  initialValues: { email: '' },
  rules: { email: ['required', 'email'] },
  messages: {
    ...messages,
    required: (field) => `Please fill in ${field}`,
    email: (field) => `Please provide a valid ${field.toLowerCase()}`,
  },
});
```

## Examples

### React with useState

```jsx
import { useSmartForm } from 'react-smart-form-errors';

function SignupForm() {
  const form = useSmartForm({
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
      fullName: ['required', 'fullName'],
      phone: ['required', 'phone'],
      dob: ['required', { rule: 'dob', minAge: 18 }],
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.validateForm()) {
      console.log('Signup:', form.values);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="email"
          type="email"
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          placeholder="Email"
        />
        {form.touched.email && form.errors.email && (
          <span>{form.getFieldError('email')}</span>
        )}
      </div>

      <div>
        <input
          name="password"
          type="password"
          value={form.values.password}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          placeholder="Password"
        />
        {form.touched.password && form.errors.password && (
          <span>{form.getFieldError('password')}</span>
        )}
      </div>

      <div>
        <input
          name="fullName"
          value={form.values.fullName}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          placeholder="Full Name"
        />
        {form.touched.fullName && form.errors.fullName && (
          <span>{form.getFieldError('fullName')}</span>
        )}
      </div>

      <div>
        <input
          name="phone"
          value={form.values.phone}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          placeholder="Phone"
        />
        {form.touched.phone && form.errors.phone && (
          <span>{form.getFieldError('phone')}</span>
        )}
      </div>

      <div>
        <input
          name="dob"
          type="date"
          value={form.values.dob}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
        {form.touched.dob && form.errors.dob && (
          <span>{form.getFieldError('dob')}</span>
        )}
      </div>

      <button type="submit" disabled={!form.isValid && form.isDirty}>
        Sign Up
      </button>
    </form>
  );
}

export default SignupForm;
```

### React Hook Form Integration

```jsx
import { useForm } from 'react-hook-form';
import { validators } from 'react-smart-form-errors';

function MyForm() {
  const { register, formState: { errors }, handleSubmit } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          validate: (value) => {
            const error = validators.email(value);
            return error ? 'Invalid email' : true;
          },
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        {...register('password', {
          validate: (value) => {
            const error = validators.password(value, { minLength: 8 });
            return error ? 'Password too weak' : true;
          },
        })}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Formik Integration

```jsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { validateEmail, validatePhone, validatePassword } from 'react-smart-form-errors';

const validationSchema = {
  email: (value) => validateEmail(value),
  phone: (value) => validatePhone(value),
  password: (value) => validatePassword(value, { minLength: 8 }),
};

function MyForm() {
  return (
    <Formik
      initialValues={{ email: '', phone: '', password: '' }}
      validate={(values) => {
        const errors = {};
        Object.keys(values).forEach((key) => {
          const error = validationSchema[key]?.(values[key]);
          if (error) errors[key] = error.type;
        });
        return errors;
      }}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <Field name="email" type="email" />
        <ErrorMessage name="email" component="div" />

        <Field name="phone" />
        <ErrorMessage name="phone" component="div" />

        <Field name="password" type="password" />
        <ErrorMessage name="password" component="div" />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}
```

### Custom Validators

```jsx
import { useSmartForm } from 'react-smart-form-errors';

function MyForm() {
  const customEvenNumber = (value) => {
    const num = Number(value);
    if (isNaN(num) || num % 2 !== 0) {
      return { type: 'evenNumber' };
    }
    return null;
  };

  const form = useSmartForm({
    initialValues: { number: '' },
    rules: {
      number: ['required', customEvenNumber],
    },
    messages: {
      evenNumber: (field) => `${field} must be an even number`,
    },
  });

  return (
    <div>
      <input
        name="number"
        value={form.values.number}
        onChange={form.handleChange}
      />
      {form.errors.number && <div>{form.getFieldError('number')}</div>}
    </div>
  );
}
```

## TypeScript Usage

```typescript
import { useSmartForm, ValidationRulesMap, UseSmartFormReturn } from 'react-smart-form-errors';

interface FormValues {
  email: string;
  password: string;
  fullName: string;
}

const rules: ValidationRulesMap = {
  email: ['required', 'email'],
  password: ['required', { rule: 'password', minLength: 8 }],
  fullName: ['required', 'fullName'],
};

function MyForm(): JSX.Element {
  const form: UseSmartFormReturn = useSmartForm({
    initialValues: {
      email: '',
      password: '',
      fullName: '',
    },
    rules,
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (form.validateForm()) {
        const data: FormValues = form.values as FormValues;
        console.log(data);
      }
    }}>
      {/* Form fields */}
    </form>
  );
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Bundle Size**: ~5KB gzipped
- **Zero Dependencies**: No external libraries
- **Tree-shakeable**: Import only what you need

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.

```javascript
import { useFormErrors } from 'react-smart-form-errors';

function MyForm() {
    const { errors, validate, clearErrors } = useFormErrors();

    const handleSubmit = async (formData) => {
        if (validate(formData)) {
            // Submit form
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="email" />
            {errors.email && <span>{errors.email}</span>}
        </form>
    );
}
```

## Benefits

- ✅ Reduce boilerplate code for error handling
- ✅ Improve user experience with instant validation feedback
- ✅ Maintain clean, readable component code
- ✅ Reusable validation logic across your application
- ✅ Better accessibility and error messaging

## Documentation

See [docs](./docs) for complete API reference and examples.

## License

MIT Shaeel Khan