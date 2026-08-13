const URL_RE = /^([a-z][a-z0-9+.-]*:|\/)\S*$/i;

export function validateFields(fields, values) {
  const errors = {};
  for (const field of fields) {
    const value = values[field.name];
    if (field.required) {
      const empty =
        value == null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0);
      if (empty) {
        errors[field.name] = `${field.label} is required`;
        continue;
      }
    }
    if (field.type === 'url' && value) {
      if (!URL_RE.test(value)) {
        errors[field.name] = 'Enter a valid URL (or leave blank)';
      }
    }
    if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
      errors[field.name] = `${field.label} must be ${field.maxLength} characters or fewer`;
    }
  }
  return errors;
}
