import { useEffect, useState } from 'react';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { usePreviewBase } from '../context/PreviewDataContext';
import Field from './Field';
import { validateFields } from '../lib/validate';
import LivePreviewPane from './LivePreviewPane';

export default function SingletonForm({ resource, title, description, fields, previewSection, previewDataKey }) {
  const toast = useToast();
  const { refresh: refreshPreviewBase } = usePreviewBase();
  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setError(null);
    adminApi
      .getSingleton(resource)
      .then(setValues)
      .catch((err) => setError(err.message));
  };

  useEffect(load, [resource]);

  const handleChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateFields(fields, values);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setSaving(true);
    try {
      const updated = await adminApi.updateSingleton(resource, values);
      setValues(updated);
      toast.success(`${title} saved.`);
      refreshPreviewBase();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-800 bg-red-950/60 text-red-100 text-sm px-4 py-3 flex items-center justify-between">
        <span>{error}</span>
        <button type="button" onClick={load} className="underline shrink-0 ml-3">
          Retry
        </button>
      </div>
    );
  }

  if (!values) {
    return <div className="h-40 rounded-lg bg-slate-800/60 animate-pulse" />;
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
        {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
      </div>
      <div className={previewSection ? 'grid grid-cols-1 md:grid-cols-2 gap-6 items-start' : ''}>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          {fields.map((field) => (
            <Field key={field.name} field={field} value={values[field.name]} error={errors[field.name]} onChange={handleChange} />
          ))}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white transition"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
        {previewSection && (
          <div className="rounded-xl border border-slate-800 overflow-hidden h-[70vh]">
            <LivePreviewPane PreviewSection={previewSection} dataKey={previewDataKey} draftItem={values} editingId={1} />
          </div>
        )}
      </div>
    </div>
  );
}
