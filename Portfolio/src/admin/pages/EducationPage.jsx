import CrudSection from '../components/CrudSection';
import About from '../../sections/About';

const fields = [
  { name: 'degree', label: 'Degree', type: 'text', required: true, maxLength: 200 },
  { name: 'school', label: 'Institution', type: 'text', required: true, maxLength: 200 },
  { name: 'duration', label: 'Duration', type: 'text', placeholder: '2023 — Present (4th year)' },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'gpa', label: 'GPA / CGPA', type: 'text', placeholder: '3.70 / 4.00' },
  { name: 'statusLabel', label: 'Status label', type: 'text', placeholder: 'Currently enrolled' },
  { name: 'description', label: 'Description', type: 'textarea', rows: 4 },
  { name: 'coursework', label: 'Relevant coursework', type: 'tags' },
];

const defaultValues = { degree: '', school: '', duration: '', location: '', gpa: '', statusLabel: '', description: '', coursework: [] };

export default function EducationPage() {
  return (
    <CrudSection
      resource="education"
      title="Education"
      description="Academic background cards shown in the About section."
      fields={fields}
      defaultValues={defaultValues}
      emptyLabel="No education entries yet."
      previewSection={About}
      dataKey="education"
      renderRow={(item) => (
        <div>
          <p className="font-medium text-slate-100 truncate">{item.degree}</p>
          <p className="text-sm text-slate-400 truncate">{item.school}</p>
        </div>
      )}
    />
  );
}
