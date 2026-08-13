import { useEffect, useState } from 'react';
import Field from './Field';
import { validateFields } from '../lib/validate';

export default function EntityForm({ fields, initialValues, onCancel, onSubmit, onValuesChange, submitting, showPublished = true }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  useEffect(() => {
    onValuesChange?.(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const handleChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateFields(fields, values);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="p-5 space-y-4">
        {fields.map((field) => (
          <Field key={field.name} field={field} value={values[field.name]} error={errors[field.name]} onChange={handleChange} />
        ))}
        {showPublished && (
          <Field
            field={{ name: 'isPublished', label: 'Published (visible on the live site)', type: 'checkbox' }}
            value={values.isPublished}
            onChange={handleChange}
          />
        )}
      </div>
      <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-800 shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
