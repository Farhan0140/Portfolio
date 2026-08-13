import DepthText from './DepthText';
import useTypedRole from '../hooks/useTypedRole';
import useDevCardTilt from '../hooks/useDevCardTilt';
import { usePortfolioData } from '../context/PortfolioDataContext';

export default function Hero() {
  const { profile, socialLinks } = usePortfolioData();
  const typedRef = useTypedRole(profile.typedRoles);
  const devCardRef = useDevCardTilt();
  // Excludes the download-icon social link specifically from the profile
  // card's row — it duplicates the "Download CV" action button and reads as
  // a broken/dead button there. Still shown wherever else socialLinks render.
  const heroLinks = socialLinks.filter((l) => l.showInHero && l.icon !== 'i-download');

  return (
    <section className="hero" id="top">
      <div className="hero-emojis" id="heroEmojis">
        <span className="float-emoji e1" data-depth="0.06">💻</span>
        <span className="float-emoji e2" data-depth="0.10">🔧</span>
        <span className="float-emoji e3" data-depth="0.04">⚡</span>
        <span className="float-emoji e4" data-depth="0.08">🌱</span>
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-kicker lift" style={{ '--d': '80ms' }}>
            {profile.kicker}
          </div>
          <h1 className="hero-name">
            <span className="line">
              <span style={{ '--d': '180ms' }}>
                <DepthText text={profile.firstName} />
              </span>
            </span>
            <span className="line">
              <span style={{ '--d': '300ms' }}>
                <DepthText text={profile.lastName} />
              </span>
            </span>
          </h1>
          <div className="hero-role lift" style={{ '--d': '520ms' }}>
            CSE Student <span style={{ opacity: 0.5 }}>·</span>{' '}
            <span className="typed" id="typed" ref={typedRef} />
            <span className="cursor" />
          </div>
          <p className="hero-desc lift" style={{ '--d': '640ms' }}>
            {profile.description}
          </p>
          <div className="hero-actions lift" style={{ '--d': '760ms' }}>
            <a href={profile.cvUrl} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
              <svg className="ic em" aria-hidden="true">
                <use href="#i-eye" />
              </svg>{' '}
              View CV
            </a>
            {/* TODO: add click/analytics tracking */}
            <a href={profile.cvUrl} className="btn btn-ghost" target="_blank" download>
              <svg className="ic em" aria-hidden="true">
                <use href="#i-download" />
              </svg>{' '}
              Download CV
            </a>
          </div>
        </div>

        <div className="dev-card-wrap lift" style={{ '--d': '520ms' }}>
          <article className="dev-card" id="devCard" ref={devCardRef}>
            <div className="dev-card-top">
              <span className="dev-dots" aria-hidden="true">
                <i />
                <i />
              </span>
              <span className="dev-id">DEV_ID: 0140</span>
            </div>

            <a
              className="dev-photo"
              href={profile.photoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open full photo of ${profile.firstName} ${profile.lastName}`}
            >
              <img src={profile.photoUrl} alt={`${profile.firstName} ${profile.lastName}`} loading="eager" decoding="async" />
              <span className="dev-info">
                <span className="dev-name">{profile.firstName} {profile.lastName}</span>
                <span className="dev-handle">{profile.handle}</span>
                <span className="dev-meta">
                  <span>
                    <svg className="ic" aria-hidden="true">
                      <use href="#i-pin" />
                    </svg>{' '}
                    {profile.location}
                  </span>
                  <span className="sep" aria-hidden="true">·</span>
                  <span className="dev-status">
                    <span className="dot" aria-hidden="true" /> Online
                  </span>
                </span>
              </span>
            </a>

            <div className="dev-social">
              {/* TODO: add click/analytics tracking */}
              {heroLinks.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label} title={link.label}>
                  {/* i-github ships as a solid-fill glyph in the sprite; everything else is stroke-based. */}
                  <svg className={link.icon === 'i-github' ? 'ic ic-solid' : 'ic'} aria-hidden="true">
                    <use href={`#${link.icon}`} />
                  </svg>
                </a>
              ))}
              {/* TODO: add click/analytics tracking */}
              <a href="#contact" aria-label="Contact me" title="Contact me">
                <svg className="ic" aria-hidden="true">
                  <use href="#i-mail" />
                </svg>
              </a>
            </div>
          </article>
        </div>
      </div>
      <div className="scroll-cue lift" style={{ '--d': '900ms' }}>
        scroll <span className="rail" />
      </div>
    </section>
  );
}
