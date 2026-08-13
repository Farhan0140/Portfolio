import { useState } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useModal } from '../context/ModalContext';
import useOpenOnActivate from '../hooks/useOpenOnActivate';
import usePager from '../hooks/usePager';
import Pager from '../components/Pager';
import BannerImage from '../components/BannerImage';

export function ProjectCard({ card, cardRef, className }) {
  const { openProject } = useModal();
  const activate = useOpenOnActivate(() => openProject(card.id));
  const [hasShot, setHasShot] = useState(false);

  return (
    <div
      className={`project-card ${className}`}
      data-project={card.id}
      tabIndex={0}
      role="button"
      aria-haspopup="dialog"
      ref={cardRef}
      {...activate}
    >
      <div className={'project-banner' + (hasShot ? ' has-shot' : '')}>
        <span className="banner-grid" />
        <BannerImage src={card.image} alt={card.imageAlt} width="1200" height="750" onHasShot={setHasShot} />
        {card.status === 'live' && (
          <span className="status-flag live">
            <span className="blip" />
            Live
          </span>
        )}
        {card.status === 'progress' && (
          <span className="status-flag progress">
            <span className="blip" />
            In Progress
          </span>
        )}
        {card.emoji && <span className="banner-emoji">{card.emoji}</span>}
      </div>
      <div className="project-body">
        <h3>{card.title}</h3>
        <p>{card.desc}</p>
        <div className="lang-tags">
          {card.langTags.map((t) => (
            <span className="lang-tag" key={t}>{t}</span>
          ))}
        </div>
        <span className="tap-hint">
          <svg className="ic" aria-hidden="true" style={{ width: 13, height: 13 }}>
            <use href="#i-link" />
          </svg>{' '}
          Tap the card for full details
        </span>
        <div className="project-links">
          {card.links.code && (
            <a className="code-link" href={card.links.code} target="_blank" rel="noopener">
              <svg className="ic" aria-hidden="true">
                <use href="#i-branch" />
              </svg>{' '}
              Code
            </a>
          )}
          {card.links.live ? (
            <a className="live-link" href={card.links.live} target="_blank" rel="noopener">
              <svg className="ic" aria-hidden="true">
                <use href="#i-link" />
              </svg>{' '}
              Live
            </a>
          ) : (
            <span className="progress-link">
              <svg className="ic" aria-hidden="true">
                <use href="#i-clock" />
              </svg>{' '}
              Building
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { softwareProjects: projectCards } = usePortfolioData();
  const { page, pages, gridRef, cardRef, cardClassName, next, prev, goToPage } = usePager(projectCards.length);

  const liveCount = projectCards.filter((c) => c.status === 'live').length;
  const progressCount = projectCards.filter((c) => c.status === 'progress').length;

  return (
    <section id="projects" data-label="Projects">
      <div className="eyebrow reveal">
        <svg className="ic" aria-hidden="true">
          <use href="#i-branch" />
        </svg>{' '}
        What I&apos;ve shipped
      </div>
      <h2 className="section-title reveal">Projects</h2>
      <div className="projects-stats reveal">
        <span className="stat-pill live"><span className="num" data-count={liveCount}>0</span> live</span>
        <span className="stat-pill progress"><span className="num" data-count={progressCount}>0</span> in progress</span>
        <span className="stat-pill"><span className="num" data-count={projectCards.length}>0</span> total</span>
      </div>
      <div className="projects-grid" data-stagger="130" ref={gridRef}>
        {projectCards.map((card, i) => (
          <ProjectCard key={card.id} card={card} cardRef={cardRef(i)} className={cardClassName(i)} />
        ))}
      </div>
      <Pager pages={pages} page={page} goToPage={goToPage} next={next} prev={prev} label="Project pages" />
    </section>
  );
}
