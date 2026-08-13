import CrudSection from '../components/CrudSection';
import { ProjectCard } from '../../sections/Projects';
import { IotCard } from '../../sections/Hobbies';
import { usePortfolioData } from '../../context/PortfolioDataContext';

// Shows just the one card being added/edited, styled exactly like its real
// card (software or IoT, whichever "Type" is currently selected) — not the
// whole grid of every other project.
function ProjectPreview({ previewId }) {
  const { softwareProjects, iotCards } = usePortfolioData();
  const card = softwareProjects.find((c) => c.id === previewId) || iotCards.find((c) => c.id === previewId);
  const isIot = iotCards.some((c) => c.id === previewId);

  if (!card) {
    return <div className="flex items-center justify-center h-full text-slate-500 text-sm p-8">Nothing to preview yet.</div>;
  }

  return (
    <div className="p-8">
      <p className="text-xs uppercase tracking-wide text-slate-500 mb-4">Card preview</p>
      <div className="max-w-sm">
        {isIot ? <IotCard card={card} className="reveal in" /> : <ProjectCard card={card} className="reveal in" />}
      </div>
    </div>
  );
}

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true, maxLength: 200 },
  {
    name: 'type',
    label: 'Section',
    type: 'select',
    required: true,
    options: [
      { value: 'software', label: 'Projects grid' },
      { value: 'iot', label: 'Hobbies / IoT grid' },
    ],
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'none', label: 'None' },
      { value: 'live', label: 'Live' },
      { value: 'progress', label: 'In progress' },
    ],
  },
  { name: 'shortDesc', label: 'Short description (card)', type: 'textarea', rows: 3 },
  { name: 'fullDesc', label: 'Full description (details modal)', type: 'textarea', rows: 5 },
  { name: 'image', label: 'Image', type: 'image' },
  { name: 'imageAlt', label: 'Image alt text', type: 'text' },
  { name: 'emoji', label: 'Emoji (fallback banner)', type: 'text', placeholder: '🌱' },
  { name: 'tagsLabel', label: 'Tags label', type: 'text', placeholder: 'Built with / Components used' },
  { name: 'tags', label: 'Tags', type: 'tags', placeholder: 'Go, React' },
  { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
  { name: 'liveUrl', label: 'Live URL', type: 'url' },
  { name: 'slug', label: 'Slug', type: 'text', required: true, maxLength: 80, hint: 'Internal identifier, lowercase-with-dashes.' },
  { name: 'featured', label: 'Featured', type: 'checkbox' },
];

const defaultValues = {
  title: '', type: 'software', status: 'none', shortDesc: '', fullDesc: '', image: '', imageAlt: '',
  emoji: '', tagsLabel: 'Built with', tags: [], githubUrl: '', liveUrl: '', slug: '', featured: false,
};

export default function ProjectsPage() {
  return (
    <CrudSection
      resource="projects"
      title="Project"
      description="Feeds both the Projects grid and the Hobbies / IoT grid, plus their shared details modal."
      fields={fields}
      defaultValues={defaultValues}
      emptyLabel="No projects yet."
      previewSection={ProjectPreview}
      dataKey="projects"
      renderRow={(item) => (
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={
              'text-[11px] uppercase tracking-wide px-2 py-0.5 rounded shrink-0 ' +
              (item.type === 'iot' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-sky-900/50 text-sky-300')
            }
          >
            {item.type === 'iot' ? 'IoT' : 'Software'}
          </span>
          <p className="font-medium text-slate-100 truncate">{item.title}</p>
        </div>
      )}
    />
  );
}
