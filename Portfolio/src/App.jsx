import { lazy, Suspense, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ModalProvider, useModal } from './context/ModalContext';
import { PortfolioDataProvider, usePortfolioData } from './context/PortfolioDataContext';
import Preloader from './components/Preloader';
import IconSprite from './components/IconSprite';
import Rail from './components/Rail';
import TraceOverlay from './components/TraceOverlay';
import TargetCursor from './components/TargetCursor';
import ToTop from './components/ToTop';
import Hero from './components/Hero';
import ProjectModal from './components/ProjectModal';
import CertModal from './components/CertModal';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import ProblemSolving from './sections/ProblemSolving';
import Hobbies from './sections/Hobbies';
import Certifications from './sections/Certifications';
import Career from './sections/Career';
import Contact from './sections/Contact';
import useRevealOnScroll from './hooks/useRevealOnScroll';
import useScrollTrace from './hooks/useScrollTrace';

// Code-split so visitors to the public site never download the admin bundle.
const AdminApp = lazy(() => import('./admin/AdminApp'));

function Modals() {
  const { projectId, closeProject, certId, closeCert } = useModal();
  return (
    <>
      <ProjectModal openId={projectId} onClose={closeProject} />
      <CertModal openId={certId} onClose={closeCert} />
    </>
  );
}

function Page() {
  useRevealOnScroll();
  useScrollTrace();

  return (
    <>
      <TargetCursor />

      <IconSprite />

      <Rail />

      <TraceOverlay />

      <div className="wrap">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <ProblemSolving />
        <Certifications />
        <Hobbies />
        <Career />
        <Contact />
      </div>

      <ToTop />

      <Modals />
    </>
  );
}

function PublicSite() {
  const { loading, error, profile, projects, certifications, refetch } = usePortfolioData();

  // Stable across incidental re-renders (see Preloader.jsx) — only changes
  // once the underlying fetch resolves with new data.
  const imageUrls = useMemo(() => {
    if (loading || error) return [];
    return Array.from(
      new Set(
        [profile.photoUrl, ...(projects || []).map((p) => p.image), ...(certifications || []).map((c) => c.image)].filter(Boolean)
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, profile.photoUrl, projects, certifications]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-6 bg-[#0B1220] text-white">
        <p className="text-lg">Something went wrong loading the portfolio.</p>
        <p className="text-sm opacity-70">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
        >
          Try again
        </button>
      </div>
    );
  }

  // Preloader only mounts once the data fetch has resolved — its own
  // internal timing (min 2.4s) covers the near-instant fetch, so visitors
  // never see a layout flash between "loading" and "loaded".
  if (loading) return null;

  return (
    <ModalProvider>
      <Preloader imageUrls={imageUrls} />
      <Page />
    </ModalProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PortfolioDataProvider>
            <PublicSite />
          </PortfolioDataProvider>
        }
      />
      <Route
        path="/admin/*"
        element={
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading admin…</div>
            }
          >
            <AdminApp />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
