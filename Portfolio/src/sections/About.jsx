import { usePortfolioData } from '../context/PortfolioDataContext';

function EducationCard({ item }) {
  return (
    <div className="edu-card reveal r-scale">
      <div className="edu-summary">
        <h3 className="edu-degree">{item.degree}</h3>
        <p className="edu-school">{item.school}</p>
        <ul className="edu-meta">
          {item.duration && (
            <li>
              <svg className="ic" aria-hidden="true">
                <use href="#i-calendar" />
              </svg>{' '}
              {item.duration}
            </li>
          )}
          {item.location && (
            <li>
              <svg className="ic" aria-hidden="true">
                <use href="#i-pin" />
              </svg>{' '}
              {item.location}
            </li>
          )}
          {item.gpa && (
            <li>
              <svg className="ic" aria-hidden="true">
                <use href="#i-award" />
              </svg>{' '}
              CGPA: {item.gpa}
            </li>
          )}
        </ul>
        {item.statusLabel && (
          <span className="edu-status">
            <span className="dot" aria-hidden="true" /> {item.statusLabel}
          </span>
        )}
      </div>
      <div className="edu-detail">
        {item.description && <p>{item.description}</p>}
        {item.coursework && item.coursework.length > 0 && (
          <>
            <div className="edu-courses-label">
              <svg className="ic" aria-hidden="true">
                <use href="#i-book" />
              </svg>{' '}
              Relevant coursework
            </div>
            <div className="edu-courses">
              {item.coursework.map((c) => (
                <span className="course" key={c}>{c}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function About() {
  const { education } = usePortfolioData();

  return (
    <section id="about" data-label="About">
      <div className="eyebrow reveal">
        <svg className="ic" aria-hidden="true">
          <use href="#i-cap" />
        </svg>{' '}
        About me
      </div>
      <h2 className="section-title reveal">
        Academic <span className="title-soft">background.</span>
      </h2>
      <p className="section-lede reveal">
        Formal education and theoretical foundations that support my engineering journey and problem-solving
        capabilities.
      </p>
      {education.map((item) => (
        <EducationCard key={item.id} item={item} />
      ))}
    </section>
  );
}
