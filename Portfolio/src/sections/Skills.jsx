import { usePortfolioData } from '../context/PortfolioDataContext';

export default function Skills() {
  const { skillCategories } = usePortfolioData();

  return (
    <section id="skills" data-label="Skills">
      <div className="eyebrow reveal">
        <svg className="ic" aria-hidden="true">
          <use href="#i-bulb" />
        </svg>{' '}
        What I work with
      </div>
      <h2 className="section-title reveal">Skills &amp; tools</h2>
      <div className="skills-grid" data-stagger="120">
        {skillCategories.map((cat) => (
          <div className="skills-card reveal" key={cat.id}>
            <div className="tech-head">
              <span className="tech-badge">
                <svg className="ic" aria-hidden="true">
                  <use href={`#${cat.icon}`} />
                </svg>
              </span>
              <h3>{cat.title}</h3>
            </div>
            <div className="tech-items" data-stagger="60">
              {cat.items.map((item) => (
                <span className="tech-tile" key={item.label}>
                  <span className="tech-mark">
                    <svg className="bic" aria-hidden="true">
                      <use href={`#${item.icon}`} />
                    </svg>
                  </span>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
