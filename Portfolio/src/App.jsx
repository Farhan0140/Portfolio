import { useMemo } from 'react';
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
  const { profile, projects, certifications } = usePortfolioData();

  // Stable across incidental re-renders (see Preloader.jsx) — only recomputed
  // if the underlying static data reference changes.
  const imageUrls = useMemo(
    () =>
      Array.from(
        new Set(
          [profile.photoUrl, ...(projects || []).map((p) => p.image), ...(certifications || []).map((c) => c.image)].filter(Boolean)
        )
      ),
    [profile.photoUrl, projects, certifications]
  );

  return (
    <ModalProvider>
      <Preloader imageUrls={imageUrls} />
      <Page />
    </ModalProvider>
  );
}

export default function App() {
  return (
    <PortfolioDataProvider>
      <PublicSite />
    </PortfolioDataProvider>
  );
}
