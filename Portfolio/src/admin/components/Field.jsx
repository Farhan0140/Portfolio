import { ALL_ICONS } from '../lib/iconList';

const baseInputClass =
  'w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 transition hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent';

function Label({ field }) {
  return (
    <label htmlFor={field.name} className="block text-sm font-medium text-slate-300 mb-1">
      {field.label}
      {field.required && <span className="text-red-400"> *</span>}
    </label>
  );
}

function ErrorText({ error }) {
  if (!error) return null;
  return <p className="mt-1 text-xs text-red-400">{error}</p>;
}

export default function Field({ field, value, error, onChange }) {
  const set = (v) => onChange(field.name, v);

  if (field.type === 'checkbox') {
    return (
      <div className="flex items-center gap-2 py-1">
        <input
          id={field.name}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => set(e.target.checked)}
          className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-sky-500"
        />
        <label htmlFor={field.name} className="text-sm text-slate-300">
          {field.label}
        </label>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <Label field={field} />
        <textarea
          id={field.name}
          rows={field.rows || 4}
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => set(e.target.value)}
          className={baseInputClass}
        />
        <ErrorText error={error} />
      </div>
    );
  }

  if (field.type === 'tags') {
    const text = Array.isArray(value) ? value.join(', ') : value || '';
    return (
      <div>
        <Label field={field} />
        <input
          id={field.name}
          type="text"
          value={text}
          placeholder={field.placeholder || 'Comma-separated'}
          onChange={(e) =>
            set(
              e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          className={baseInputClass}
        />
        {field.hint && <p className="mt-1 text-xs text-slate-500">{field.hint}</p>}
        <ErrorText error={error} />
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        <Label field={field} />
        <select id={field.name} value={value ?? ''} onChange={(e) => set(e.target.value)} className={baseInputClass}>
          <option value="" disabled>
            Select…
          </option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ErrorText error={error} />
      </div>
    );
  }

  if (field.type === 'icon') {
    return (
      <div>
        <Label field={field} />
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center h-9 w-9 shrink-0 rounded-lg bg-slate-800 border border-slate-700">
            {value ? (
              <svg className="w-5 h-5 text-sky-400" aria-hidden="true">
                <use href={`#${value}`} />
              </svg>
            ) : (
              <span className="text-slate-600 text-xs">?</span>
            )}
          </span>
          <select id={field.name} value={value ?? ''} onChange={(e) => set(e.target.value)} className={baseInputClass}>
            <option value="" disabled>
              Select an icon…
            </option>
            {ALL_ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>
        <ErrorText error={error} />
      </div>
    );
  }

  if (field.type === 'image') {
    return (
      <div>
        <Label field={field} />
        <div className="flex items-start gap-3">
          <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
            {value ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img src={value} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
            ) : (
              <span className="text-slate-600 text-xs">img</span>
            )}
          </div>
          <div className="flex-1">
            <input
              id={field.name}
              type="text"
              value={value ?? ''}
              placeholder={field.placeholder || 'https://…'}
              onChange={(e) => set(e.target.value)}
              className={baseInputClass}
            />
            <p className="mt-1 text-xs text-slate-500">Paste a hosted image URL (e.g. an imgbb link).</p>
          </div>
        </div>
        <ErrorText error={error} />
      </div>
    );
  }

  // text / url (default)
  return (
    <div>
      <Label field={field} />
      <input
        id={field.name}
        type="text"
        value={value ?? ''}
        placeholder={field.placeholder}
        onChange={(e) => set(e.target.value)}
        className={baseInputClass}
      />
      <ErrorText error={error} />
    </div>
  );
}
