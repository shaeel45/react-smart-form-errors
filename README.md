# react-smart-form-errors

A lightweight React library for intelligent form error handling and validation.

## Features

- **Smart Error Management** - Automatically handle and display form validation errors
- **Flexible Validation** - Support for custom validation rules and built-in validators
- **Real-time Feedback** - Show errors as users interact with forms
- **Easy Integration** - Works seamlessly with any React form library
- **TypeScript Support** - Fully typed for better developer experience

## Installation

```bash
npm install react-smart-form-errors
```

## Quick Start

```javascript
import { useFormErrorTranslator } from 'react-smart-form-errors';

function MyForm() {
    const { errors, validate, clearErrors } = useFormErrorTranslator();

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