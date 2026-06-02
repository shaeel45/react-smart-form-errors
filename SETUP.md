# Development Setup Guide

## Quick Start

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development
npm test              # Run tests
npm run build         # Build the library
```

## Available Scripts

### `npm test`
Runs the test suite using Vitest. Watch mode can be enabled with `--watch`.

```bash
npm test
npm test -- --watch
npm test -- validators.test.js
```

### `npm run test:coverage`
Generates a coverage report. Aims for 90%+ coverage.

```bash
npm run test:coverage
```

### `npm run build`
Builds the library using microbundle. Generates:
- `dist/react-smart-form-errors.cjs` - CommonJS
- `dist/react-smart-form-errors.esm.js` - ES Module
- `dist/react-smart-form-errors.modern.js` - Modern JavaScript

```bash
npm run build
```

## Project Structure

```
react-smart-form-errors/
├── src/
│   ├── hooks/                    # React hooks
│   ├── validators/               # All validators
│   ├── messages/                 # Default error messages
│   ├── utils/                    # Utility functions
│   ├── __tests__/                # Test files
│   └── index.js                  # Main entry point
├── examples/                     # Usage examples
├── dist/                         # Built files (generated)
├── index.d.ts                    # TypeScript definitions
├── package.json
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── vitest.config.js              # Vitest configuration
└── .gitignore
```

## Development Workflow

### 1. Making Changes

Edit files in `src/` directory. The structure is organized by feature:

- **validators/** - Individual validator functions
- **hooks/** - React hooks (useSmartForm)
- **messages/** - Error message strings
- **utils/** - Helper functions

### 2. Testing Changes

```bash
# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- validators.test.js

# Run with coverage
npm run test:coverage
```

### 3. Building

```bash
# Build once
npm run build

# Output will be in dist/
```

### 4. Local Testing

To test locally before publishing:

```bash
# Link the package locally
npm link

# In a test project
npm link react-smart-form-errors
```

## Code Standards

### File Naming
- Validators: `lowercase.js` (e.g., `email.js`, `fullname.js`)
- Hooks: `camelCase.js` (e.g., `useSmartForm.js`)
- Tests: `*.test.js`

### Function Documentation

All public functions should have JSDoc comments:

```javascript
/**
 * Validates email format
 * @param {string} value - The email to validate
 * @returns {null|Object} null if valid, error object if invalid
 */
export default function email(value) {
  // implementation
}
```

### Error Objects

Validators return consistent error objects:

```javascript
{
  type: 'validatorName',     // Required: validator type
  rule?: 'specificRule',     // Optional: specific rule that failed
  reason?: 'specific',       // Optional: specific reason
  value?: any                // Optional: additional data (min age, length, etc.)
}
```

Return `null` for valid values.

## TypeScript Support

TypeScript definitions are in `index.d.ts`. Update this file when:

- Adding new validators
- Changing function signatures
- Modifying the hook API

## Testing Guidelines

### Unit Tests
- Test each validator independently
- Cover both valid and invalid inputs
- Test edge cases

### Integration Tests
- Test the hook with various configurations
- Test event handlers (handleChange, handleBlur)
- Test form validation flow

### Coverage Requirements
- Aim for 90%+ code coverage
- Check coverage report: `npm run test:coverage`

## Common Issues

### Tests Failing
```bash
# Clear test cache
npm test -- --clearCache

# Run with more verbose output
npm test -- --reporter=verbose
```

### Build Issues
```bash
# Clean dist directory
rm -rf dist/

# Rebuild
npm run build
```

### Dependency Issues
```bash
# Clear node_modules
rm -rf node_modules/
npm install
```

## Performance Tips

- Use `npm test -- --watch` for development
- Check bundle size: `npm run build` then check `dist/`
- Use Chrome DevTools for runtime profiling

## Troubleshooting

### Vitest Issues

If tests fail to run:
```bash
npm install -D vitest @vitest/coverage-v8 jsdom
```

### TypeScript Errors

Run type checking:
```bash
npx tsc --noEmit
```

### Missing Dependencies

Update all dependencies:
```bash
npm install
npm audit fix
```

## Publishing Process

See [CONTRIBUTING.md](CONTRIBUTING.md#release-process) for publishing guidelines.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Microbundle Docs](https://github.com/developit/microbundle)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support

For questions or issues:
1. Check existing GitHub issues
2. Read the README.md
3. Check examples/ folder for usage patterns
4. Open a new issue with details
