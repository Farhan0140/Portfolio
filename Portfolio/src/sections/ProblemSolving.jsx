import { useEffect, useRef } from 'react';
import useLiveStats from '../hooks/useLiveStats';
import { usePortfolioData } from '../context/PortfolioDataContext';

function PfStats({ phase, stats }) {
  if (phase === 'loading') return <span className="pf-skeleton" />;
  if (phase === 'static') return <span className="platform-rating">⭐⭐ 2★ rated</span>;
  if (phase === 'live' && stats.length) {
    return stats.map(([value, label], i) => (
      <span className="pf-stat" style={{ animationDelay: `${i * 70}ms` }} key={label + value}>
        <b>{value}</b> {label}
      </span>
    ));
  }
  return <span className="pf-note">stats unavailable</span>;
}

export default function ProblemSolving() {
  const { codingProfiles } = usePortfolioData();
  const findProfile = (platform) => codingProfiles.find((p) => p.platform === platform) || {};
  const cfProfile = findProfile('codeforces');
  const ccProfile = findProfile('codechef');
  const lcProfile = findProfile('leetcode');
  const codolioProfile = findProfile('codolio');

  const { cf, cc, lc, totalSolved, live } = useLiveStats({
    codeforces: cfProfile.handle,
    codechef: ccProfile.handle,
    leetcode: lcProfile.handle,
  });
  const countRef = useRef(null);

  useEffect(() => {
    if (totalSolved == null) return;
    const el = countRef.current;
    if (el && parseInt(el.textContent, 10) > 0) el.textContent = totalSolved;
  }, [totalSolved]);

  return (
    <section id="problem-solving" data-label="Problem solving">
      <div className="eyebrow reveal">
        <svg className="ic" aria-hidden="true">
          <use href="#i-cpu" />
        </svg>{' '}
        Sharpening the mind
      </div>
      <h2 className="section-title reveal">Problem solving</h2>
      <div className="ps-hero reveal r-scale">
        <div>
          <div className="ps-count">
            <span data-count={totalSolved ?? 700} ref={countRef}>0</span>+
          </div>
          <div className="ps-count-label">Problems solved</div>
          <div className={'ps-live-flag' + (live ? ' on' : '')} id="psLive">
            <span className="blip" />
            <span>live from the platforms</span>
          </div>
        </div>
        <p className="ps-desc">
          I regularly practice competitive programming and problem solving across multiple platforms — sharpening my
          algorithmic thinking and building the muscle for writing efficient, correct code.
        </p>
      </div>
      <div className="platform-grid" data-stagger="120">
        <div className="platform-card reveal">
          <svg className="ic platform-icon" aria-hidden="true">
            <use href="#i-bars" />
          </svg>
          <h3>Codeforces</h3>
          <span className="platform-handle">{cfProfile.handle}</span>
          <div className="pf-stats" id="cfStats">
            <PfStats phase={cf.phase} stats={cf.stats} />
          </div>
          <a className="platform-btn" href={cfProfile.profileUrl} target="_blank" rel="noopener">
            <svg className="ic" aria-hidden="true">
              <use href="#i-link" />
            </svg>{' '}
            View profile
          </a>
        </div>
        <div className="platform-card reveal">
          <svg className="ic platform-icon" aria-hidden="true">
            <use href="#i-chef" />
          </svg>
          <h3>CodeChef</h3>
          <span className="platform-handle">{ccProfile.handle}</span>
          <div className="pf-stats" id="ccStats">
            <PfStats phase={cc.phase} stats={cc.stats} />
          </div>
          <a className="platform-btn" href={ccProfile.profileUrl} target="_blank" rel="noopener">
            <svg className="ic" aria-hidden="true">
              <use href="#i-link" />
            </svg>{' '}
            View profile
          </a>
        </div>
        <div className="platform-card reveal">
          <svg className="ic platform-icon" aria-hidden="true">
            <use href="#i-brackets" />
          </svg>
          <h3>LeetCode</h3>
          <span className="platform-handle">{lcProfile.handle}</span>
          <div className="pf-stats" id="lcStats">
            <PfStats phase={lc.phase} stats={lc.stats} />
          </div>
          <a className="platform-btn" href={lcProfile.profileUrl} target="_blank" rel="noopener">
            <svg className="ic" aria-hidden="true">
              <use href="#i-link" />
            </svg>{' '}
            View profile
          </a>
        </div>
      </div>

      <div className="codolio-card reveal r-scale">
        <span className="codolio-badge" aria-hidden="true">
          <svg className="ic">
            <use href="#i-layers" />
          </svg>
        </span>
        <div className="codolio-text">
          <h3>All of it in one place</h3>
          <p>
            Codolio gathers my Codeforces, CodeChef and LeetCode activity into a single profile — ratings, solved
            counts and the full submission heatmap.
          </p>
        </div>
        <a className="platform-btn" href={codolioProfile.profileUrl} target="_blank" rel="noopener noreferrer">
          <svg className="ic" aria-hidden="true">
            <use href="#i-link" />
          </svg>{' '}
          View Codolio profile
        </a>
      </div>
    </section>
  );
}
