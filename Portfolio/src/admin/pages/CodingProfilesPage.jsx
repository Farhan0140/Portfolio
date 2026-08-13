import CrudSection from '../components/CrudSection';
import ProblemSolving from '../../sections/ProblemSolving';

const fields = [
  {
    name: 'platform',
    label: 'Platform',
    type: 'select',
    required: true,
    options: [
      { value: 'codeforces', label: 'Codeforces' },
      { value: 'codechef', label: 'CodeChef' },
      { value: 'leetcode', label: 'LeetCode' },
      { value: 'codolio', label: 'Codolio' },
    ],
    hint: 'Must match one of these exactly — the live-stats widget looks up by this key.',
  },
  { name: 'handle', label: 'Handle / username', type: 'text', required: true },
  { name: 'profileUrl', label: 'Profile URL', type: 'url' },
];

const defaultValues = { platform: '', handle: '', profileUrl: '' };

export default function CodingProfilesPage() {
  return (
    <CrudSection
      resource="coding-profiles"
      title="Coding profile"
      description="Handles for the Problem Solving section's live Codeforces/CodeChef/LeetCode/Codolio widgets."
      fields={fields}
      defaultValues={defaultValues}
      emptyLabel="No coding profiles yet."
      previewSection={ProblemSolving}
      dataKey="codingProfiles"
      renderRow={(item) => (
        <div>
          <p className="font-medium text-slate-100 truncate capitalize">{item.platform}</p>
          <p className="text-sm text-slate-400 truncate">{item.handle}</p>
        </div>
      )}
    />
  );
}
