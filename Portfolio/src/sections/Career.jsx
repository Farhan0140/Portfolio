import { usePortfolioData } from '../context/PortfolioDataContext';

export default function Career() {
  const { siteContent } = usePortfolioData();

  return (
    <section id="career" data-label="Career">
      <div className="eyebrow reveal">
        <svg className="ic" aria-hidden="true">
          <use href="#i-rocket" />
        </svg>{' '}
        Looking ahead
      </div>
      <h2 className="section-title reveal">Dream career</h2>
      <div className="career-block reveal">
        <div className="career-badge">
          <svg className="ic em" aria-hidden="true">
            <use href="#i-rocket" />
          </svg>{' '}
          {siteContent.careerBadgeLabel}
        </div>
        <p className="career-text">{siteContent.careerText}</p>
      </div>
    </section>
  );
}
