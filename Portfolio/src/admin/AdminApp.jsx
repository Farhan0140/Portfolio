import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './admin.css';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { PreviewDataProvider } from './context/PreviewDataContext';
import AuthGuard from './AuthGuard';
import AdminLayout from './AdminLayout';
import LoginPage from './LoginPage';
import OverviewPage from './pages/OverviewPage';
import ProfilePage from './pages/ProfilePage';
import EducationPage from './pages/EducationPage';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import CertificationsPage from './pages/CertificationsPage';
import CareerHobbiesPage from './pages/CareerHobbiesPage';
import SocialLinksPage from './pages/SocialLinksPage';
import CodingProfilesPage from './pages/CodingProfilesPage';
import SettingsPage from './pages/SettingsPage';

export default function AdminApp() {
  // design-system.css reserves --rail-w on <body> for the public site's
  // fixed side rail (see .rail in Rail.jsx); the admin UI doesn't mount
  // that rail, so undo the reserved space for as long as /admin is active.
  useEffect(() => {
    const prev = document.body.style.paddingLeft;
    document.body.style.paddingLeft = '0px';
    document.body.classList.add('admin-scroll');
    return () => {
      document.body.style.paddingLeft = prev;
      document.body.classList.remove('admin-scroll');
    };
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <PreviewDataProvider>
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route element={<AuthGuard />}>
              <Route element={<AdminLayout />}>
                <Route index element={<OverviewPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="education" element={<EducationPage />} />
                <Route path="skills" element={<SkillsPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="certifications" element={<CertificationsPage />} />
                <Route path="career" element={<CareerHobbiesPage />} />
                <Route path="social-links" element={<SocialLinksPage />} />
                <Route path="coding-profiles" element={<CodingProfilesPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </PreviewDataProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
