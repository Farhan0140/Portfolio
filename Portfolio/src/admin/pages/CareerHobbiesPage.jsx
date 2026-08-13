import SingletonForm from '../components/SingletonForm';
import Career from '../../sections/Career';
import Hobbies from '../../sections/Hobbies';

function CareerHobbiesPreview() {
  return (
    <>
      <Career />
      <Hobbies />
    </>
  );
}

const fields = [
  { name: 'careerBadgeLabel', label: 'Career badge label', type: 'text', placeholder: 'Software Engineer' },
  { name: 'careerText', label: 'Career text', type: 'textarea', rows: 4 },
  { name: 'hobbiesTitle', label: 'Hobbies panel title', type: 'text', placeholder: 'Building IoT projects' },
  { name: 'hobbiesText', label: 'Hobbies panel text', type: 'textarea', rows: 4 },
];

export default function CareerHobbiesPage() {
  return (
    <SingletonForm
      resource="site-content"
      title="Career & Hobbies copy"
      description="The 'Dream career' section and the intro copy at the top of the Hobbies & projects section."
      fields={fields}
      previewSection={CareerHobbiesPreview}
      previewDataKey="siteContent"
    />
  );
}
