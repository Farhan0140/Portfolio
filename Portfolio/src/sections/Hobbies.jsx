import { useState } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useModal } from '../context/ModalContext';
import useOpenOnActivate from '../hooks/useOpenOnActivate';
import usePager from '../hooks/usePager';
import Pager from '../components/Pager';
import BannerImage from '../components/BannerImage';

export function IotCard({ card, cardRef, className }) {
  const { openProject } = useModal();
  const activate = useOpenOnActivate(() => openProject(card.id));
  const [hasShot, setHasShot] = useState(false);

  return (
    <div
      className={`iot-project-card ${className}`}
      data-project={card.id}
      tabIndex={0}
      role="button"
      aria-haspopup="dialog"
      ref={cardRef}
      {...activate}
    >
      <div className={'iot-banner' + (hasShot ? ' has-shot' : '')}>
        <span className="banner-grid" />
        <BannerImage src={card.image} alt={card.imageAlt} width="900" height="600" onHasShot={setHasShot} />
        <span className="banner-emoji">{card.emoji}</span>
      </div>
      <div className="iot-body">
        <h4>{card.title}</h4>
        <p>{card.desc}</p>
        <div className="component-tags">
          {card.componentTags.map((t) => (
            <span className="component-tag" key={t}>{t}</span>
          ))}
        </div>
        <span className="tap-hint">
          <svg className="ic" aria-hidden="true" style={{ width: 13, height: 13 }}>
            <use href="#i-link" />
          </svg>{' '}
          Tap for full details
        </span>
      </div>
    </div>
  );
}

export default function Hobbies() {
  const { iotCards, siteContent } = usePortfolioData();
  const { page, pages, gridRef, cardRef, cardClassName, next, prev, goToPage } = usePager(iotCards.length);

  return (
    <section id="hobbies" data-label="Hobbies">
      <div className="eyebrow reveal">
        <svg className="ic" aria-hidden="true">
          <use href="#i-toolbox" />
        </svg>{' '}
        What I love doing
      </div>
      <h2 className="section-title reveal">Hobbies &amp; projects</h2>
      <div className="iot-panel reveal r-scale">
        <h3>
          <svg className="ic" aria-hidden="true">
            <use href="#i-plug" />
          </svg>{' '}
          {siteContent.hobbiesTitle || 'Building IoT projects'}
        </h3>
        <p>{siteContent.hobbiesText}</p>
        <div className="chip-row">
          <span className="chip">
            <svg className="ic em" aria-hidden="true">
              <use href="#i-signal" />
            </svg>{' '}
            Sensors
          </span>
          <span className="chip">
            <svg className="ic em" aria-hidden="true">
              <use href="#i-battery" />
            </svg>{' '}
            Microcontrollers
          </span>
          <span className="chip">
            <svg className="ic em" aria-hidden="true">
              <use href="#i-globe" />
            </svg>{' '}
            Connected devices
          </span>
          <span className="chip">
            <svg className="ic em" aria-hidden="true">
              <use href="#i-cpu" />
            </svg>{' '}
            Embedded logic
          </span>
        </div>
        <div className="circuit-graphic">
          <svg viewBox="0 0 500 60" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <path
              className="cg-track"
              d="M0 30 H68 L80 18 H148 L160 30 V38 L172 50 H228 L240 38 V30 H308 L320 18 H388 L400 30 V38 L412 50 H500"
            />
            <path
              className="cg-flow"
              d="M0 30 H68 L80 18 H148 L160 30 V38 L172 50 H228 L240 38 V30 H308 L320 18 H388 L400 30 V38 L412 50 H500"
            />
            <circle className="cg-node" cx="80" cy="18" r="4" style={{ animationDelay: '.15s' }} />
            <circle className="cg-node" cx="160" cy="30" r="4" style={{ animationDelay: '.6s' }} />
            <circle className="cg-node" cx="240" cy="38" r="4" style={{ animationDelay: '1.05s' }} />
            <circle className="cg-node" cx="320" cy="18" r="4" style={{ animationDelay: '1.5s' }} />
            <circle className="cg-node" cx="400" cy="30" r="4" style={{ animationDelay: '1.95s' }} />
          </svg>
        </div>

        <div className="iot-projects-grid" data-stagger="120" ref={gridRef}>
          {iotCards.map((card, i) => (
            <IotCard key={card.id} card={card} cardRef={cardRef(i)} className={cardClassName(i)} />
          ))}
        </div>
        <Pager pages={pages} page={page} goToPage={goToPage} next={next} prev={prev} label="IoT project pages" />
      </div>
    </section>
  );
}
