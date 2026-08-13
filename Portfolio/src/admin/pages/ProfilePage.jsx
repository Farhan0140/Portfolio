import SingletonForm from '../components/SingletonForm';
import Hero from '../../components/Hero';

const fields = [
  { name: 'firstName', label: 'First name', type: 'text', required: true, maxLength: 80 },
  { name: 'lastName', label: 'Last name', type: 'text', maxLength: 80 },
  { name: 'kicker', label: 'Hero kicker line', type: 'text', maxLength: 200 },
  { name: 'description', label: 'Hero description', type: 'textarea', rows: 4, maxLength: 2000 },
  { name: 'typedRoles', label: 'Rotating role words', type: 'tags', hint: 'Shown one at a time under your name, typewriter-style.' },
  { name: 'photoUrl', label: 'Profile photo', type: 'image' },
  { name: 'handle', label: 'Handle', type: 'text', placeholder: '@yourhandle' },
  { name: 'location', label: 'Short location (dev card)', type: 'text' },
  { name: 'cvUrl', label: 'CV URL', type: 'text', placeholder: '/your-cv.pdf or https://…' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'phone', label: 'Phone', type: 'text' },
  { name: 'contactLocation', label: 'Full location (contact section)', type: 'text' },
];

export default function ProfilePage() {
  return (
    <SingletonForm
      resource="profile"
      title="Profile"
      description="Your name, hero copy, photo and contact details — powers the Hero section and the Contact page."
      fields={fields}
      previewSection={Hero}
      previewDataKey="profile"
    />
  );
}
