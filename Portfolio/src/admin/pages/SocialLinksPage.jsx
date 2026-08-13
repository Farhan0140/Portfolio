import CrudSection from '../components/CrudSection';
import Hero from '../../components/Hero';
import Contact from '../../sections/Contact';

function SocialPreview() {
  return (
    <>
      <Hero />
      <Contact />
    </>
  );
}

const fields = [
  { name: 'platform', label: 'Platform key', type: 'text', required: true, placeholder: 'github', hint: 'Internal identifier, lowercase.' },
  { name: 'label', label: 'Label', type: 'text', required: true, placeholder: 'GitHub' },
  { name: 'icon', label: 'Icon', type: 'icon', required: true },
  { name: 'url', label: 'URL', type: 'text', required: true, placeholder: 'https://github.com/you' },
  { name: 'showInHero', label: 'Show on hero dev-card', type: 'checkbox' },
  { name: 'showInFooter', label: 'Show in contact footer', type: 'checkbox' },
];

const defaultValues = { platform: '', label: '', icon: '', url: '', showInHero: true, showInFooter: true };

export default function SocialLinksPage() {
  return (
    <CrudSection
      resource="social-links"
      title="Social link"
      description="Feeds the Hero dev-card icon row and the Contact footer's social pills."
      fields={fields}
      defaultValues={defaultValues}
      emptyLabel="No social links yet."
      previewSection={SocialPreview}
      dataKey="socialLinks"
      renderRow={(item) => (
        <div className="flex items-center gap-2 min-w-0">
          <svg className="w-4 h-4 text-sky-400 shrink-0" aria-hidden="true">
            <use href={`#${item.icon}`} />
          </svg>
          <p className="font-medium text-slate-100 truncate">{item.label}</p>
          <p className="text-sm text-slate-500 truncate">{item.url}</p>
        </div>
      )}
    />
  );
}
