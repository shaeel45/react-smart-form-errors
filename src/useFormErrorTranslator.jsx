import { defaultMessages } from './messages';

export function useFormErrorTranslator(errors, options = {}) {
  const messages = { ...defaultMessages, ...options.messages };

  const translatedErrors = {};

  if (!errors) return translatedErrors;

  Object.keys(errors).forEach(field => {
    const error = errors[field];
    if (!error) return;

    const fieldName =
      options.labels?.[field] || capitalize(field);

    const messageFn = messages[error.type];

    if (messageFn) {
      translatedErrors[field] = messageFn(
        fieldName,
        error.value
      );
    } else {
      translatedErrors[field] = `${fieldName} is invalid`;
    }
  });

  return translatedErrors;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
