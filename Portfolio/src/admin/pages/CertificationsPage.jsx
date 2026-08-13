import CrudSection from '../components/CrudSection';
import Certifications from '../../sections/Certifications';

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true, maxLength: 200 },
  { name: 'issuer', label: 'Issuer', type: 'text', maxLength: 120 },
  { name: 'badgeDate', label: 'Badge date / batch', type: 'text', placeholder: 'Batch 5' },
  { name: 'tags', label: 'Tags', type: 'tags' },
  { name: 'image', label: 'Certificate image', type: 'image' },
  { name: 'description', label: 'Description (details modal)', type: 'textarea', rows: 4 },
];

const defaultValues = { title: '', issuer: '', badgeDate: '', tags: [], image: '', description: '' };

export default function CertificationsPage() {
  return (
    <CrudSection
      resource="certifications"
      title="Certification"
      description="Cards shown in the Certifications section, with a details modal for the certificate image."
      fields={fields}
      defaultValues={defaultValues}
      emptyLabel="No certifications yet."
      previewSection={Certifications}
      dataKey="certifications"
      renderRow={(item) => (
        <div>
          <p className="font-medium text-slate-100 truncate">{item.title}</p>
          <p className="text-sm text-slate-400 truncate">{item.issuer}</p>
        </div>
      )}
    />
  );
}
