# Contributing to React Smart Form Errors

Thank you for your interest in contributing to React Smart Form Errors!

## Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/react-smart-form-errors.git
cd react-smart-form-errors

# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the library
npm run build
```

## Project Structure

```
src/
├── hooks/
│   └── useSmartForm.js          # Main form validation hook
├── validators/
│   ├── required.js               # Required field validator
│   ├── email.js                  # Email validator
│   ├── phone.js                  # Phone validator
│   ├── password.js               # Password strength validator
│   ├── dob.js                    # Date of birth validator
│   ├── fullname.js               # Full name validator
│   ├── firstName.js              # First name validator
│   ├── lastName.js               # Last name validator
│   ├── username.js               # Username validator
│   ├── url.js                    # URL validator
│   ├── number.js                 # Number validator
│   ├── confirmPassword.js        # Confirm password validator
│   ├── minLength.js              # Min length validator
│   ├── maxLength.js              # Max length validator
│   ├── pattern.js                # Pattern validator
│   └── index.js                  # Validators export
├── messages/
│   └── defaultMessages.js        # Default error messages
├── utils/
│   ├── getFieldLabel.js          # Field name formatter
│   ├── getErrorMessage.js        # Error message generator
│   └── formatFieldName.js        # Legacy field formatter
├── __tests__/
│   ├── validators.test.js        # Validator tests
│   └── useSmartForm.test.js      # Hook tests
└── index.js                      # Main export
```

## Code Style

- Use consistent indentation (2 spaces)
- Follow ES6+ conventions
- Add JSDoc comments for public functions
- Use meaningful variable names

## Testing

We maintain 90%+ test coverage. When adding features:

1. Write tests first (TDD)
2. Ensure all tests pass
3. Check coverage report
4. Add integration tests for complex features

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- validators.test.js

# Generate coverage report
npm run test:coverage
```

## Adding New Validators

To add a new validator:

1. Create a new file in `src/validators/` (e.g., `newvalidator.js`)
2. Implement the validator function:
   ```javascript
   export default function myValidator(value, options = {}) {
     if (!value) return null;
     
     // Validation logic
     if (/* invalid */) {
       return { type: 'myValidator', reason: 'specific_reason', value: optionalValue };
     }
     
     return null;
   }
   ```

3. Export from `src/validators/index.js`:
   ```javascript
   import myValidator from './myvalidator';
   
   export default {
     // ...
     myValidator,
   };
   ```

4. Add TypeScript definition in `index.d.ts`

5. Add default error messages in `src/messages/defaultMessages.js`:
   ```javascript
   myValidator: (field) => `${field} is invalid`,
   ```

6. Add comprehensive tests in `src/__tests__/validators.test.js`

7. Update README.md with documentation and examples

## Git Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a Pull Request

## Pull Request Guidelines

- Describe the changes clearly
- Link related issues
- Ensure all tests pass
- Update documentation if needed
- Add test coverage for new code
- Follow the existing code style

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes: `git commit -m "chore: release v1.x.x"`
4. Create git tag: `git tag v1.x.x`
5. Push to repository
6. Publish to npm: `npm publish --access public`

## Questions or Need Help?

- Open an issue on GitHub
- Check existing issues and discussions
- Read the documentation in README.md

## License

By contributing to React Smart Form Errors, you agree that your contributions will be licensed under the MIT License.
