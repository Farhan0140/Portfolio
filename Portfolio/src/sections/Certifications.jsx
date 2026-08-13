import { usePortfolioData } from '../context/PortfolioDataContext';
import { useModal } from '../context/ModalContext';
import useOpenOnActivate from '../hooks/useOpenOnActivate';
import usePager from '../hooks/usePager';
import Pager from '../components/Pager';

function CertCard({ card, cardRef, className }) {
  const { openCert } = useModal();
  const activate = useOpenOnActivate(() => openCert(card.id));

  return (
    <article
      className={`cert-card ${className}`}
      data-cert={card.id}
      tabIndex={0}
      role="button"
      aria-haspopup="dialog"
      ref={cardRef}
      {...activate}
    >
      <div className="cert-top">
        <span className="cert-badge" aria-hidden="true">
          <svg className="ic">
            <use href="#i-award" />
          </svg>
        </span>
        <span className="cert-date">{card.badgeDate}</span>
      </div>
      <h3 className="cert-title">{card.title}</h3>
      <p className="cert-issuer">{card.issuer}</p>
      <div className="cert-tags">
        {card.tags.map((t) => (
          <span className="cert-tag" key={t}>{t}</span>
        ))}
      </div>
      <span className="cert-hint">
        <svg className="ic" aria-hidden="true" style={{ width: 13, height: 13 }}>
          <use href="#i-eye" />
        </svg>{' '}
        Tap to view the certificate
      </span>
    </article>
  );
}

export default function Certifications() {
  const { certifications: certCards } = usePortfolioData();
  const { page, pages, gridRef, cardRef, cardClassName, next, prev, goToPage } = usePager(certCards.length);

  return (
    <section id="certifications" data-label="Certifications">
      <div className="eyebrow reveal">
        <svg className="ic" aria-hidden="true">
          <use href="#i-award" />
        </svg>{' '}
        Recognised work
      </div>
      <h2 className="section-title reveal">Certifications</h2>
      <div className="cert-grid" data-stagger="120" ref={gridRef}>
        {certCards.map((card, i) => (
          <CertCard key={card.id} card={card} cardRef={cardRef(i)} className={cardClassName(i)} />
        ))}
      </div>
      <Pager pages={pages} page={page} goToPage={goToPage} next={next} prev={prev} label="Certification pages" />
    </section>
  );
}
