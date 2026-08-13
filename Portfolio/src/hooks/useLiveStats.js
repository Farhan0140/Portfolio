import { useEffect, useState } from 'react';

const DEFAULT_HANDLES = {
  codeforces: '_Farhan_Nadim__',
  codechef: 'farhan_nadim',
  leetcode: 'APtfcgMQdE',
};
const FALLBACK_TOTAL = 700; // shown if the live totals cannot be fetched

function fetchJSON(url, ms) {
  const ctl = 'AbortController' in window ? new AbortController() : null;
  const timer = setTimeout(() => {
    if (ctl) ctl.abort();
  }, ms || 6000);
  return fetch(url, ctl ? { signal: ctl.signal } : undefined)
    .then((r) => {
      clearTimeout(timer);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .catch((e) => {
      clearTimeout(timer);
      throw e;
    });
}

function firstOf(urls, pick) {
  let i = 0;
  function attempt() {
    if (i >= urls.length) return Promise.reject(new Error('all endpoints failed'));
    return fetchJSON(urls[i++]).then((d) => {
      const out = pick(d);
      if (!out) throw new Error('unexpected shape');
      return out;
    }).catch(attempt);
  }
  return attempt();
}

/**
 * Live competitive-programming stats fetcher (Codeforces / CodeChef /
 * LeetCode). Everything here degrades safely: a failed/timed-out/blocked
 * request just leaves that platform's card on its static fallback text —
 * nothing throws visibly and no error reaches the visitor, same as the
 * source. Returns per-platform render state plus a live "problems solved"
 * total once at least one platform reports real numbers.
 */
export default function useLiveStats(handles) {
  const CP = { ...DEFAULT_HANDLES };
  if (handles) {
    for (const key of Object.keys(handles)) {
      if (handles[key]) CP[key] = handles[key];
    }
  }
  // cf/lc start with a loading skeleton in the source; cc starts already
  // showing its static "⭐⭐ 2★ rated" markup (no skeleton).
  const [cf, setCf] = useState({ phase: 'loading', stats: [] });
  const [cc, setCc] = useState({ phase: 'static', stats: [] });
  const [lc, setLc] = useState({ phase: 'loading', stats: [] });
  const [totalSolved, setTotalSolved] = useState(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const solved = {};

    function updateTotal() {
      const keys = Object.keys(solved);
      if (!keys.length) return;
      const sum = keys.reduce((a, k) => a + solved[k], 0);
      if (sum < FALLBACK_TOTAL * 0.5) return; // sanity check, ignore odd results
      if (cancelled) return;
      setTotalSolved(sum);
      setLive(true);
    }

    // ---------- Codeforces (official API, sends CORS headers) ----------
    const cfBase = 'https://codeforces.com/api/';
    fetchJSON(cfBase + 'user.info?handles=' + encodeURIComponent(CP.codeforces))
      .then((d) => {
        if (d.status !== 'OK' || !d.result || !d.result[0]) throw new Error('bad payload');
        const u = d.result[0];
        const out = [];
        if (u.rating) out.push([u.rating, 'rating']);
        if (u.maxRating) out.push([u.maxRating, 'peak']);
        if (u.rank) out.push([String(u.rank).replace(/\b\w/g, (c) => c.toUpperCase()), '']);
        if (!out.length) throw new Error('unrated');
        if (!cancelled) setCf({ phase: 'live', stats: out });
        return fetchJSON(cfBase + 'user.status?handle=' + encodeURIComponent(CP.codeforces) + '&from=1&count=10000', 12000);
      })
      .then((d) => {
        if (!d || d.status !== 'OK') return;
        const seen = {};
        d.result.forEach((sm) => {
          if (sm.verdict === 'OK' && sm.problem) {
            seen[(sm.problem.contestId || 'x') + '-' + sm.problem.index] = 1;
          }
        });
        const n = Object.keys(seen).length;
        if (n) {
          solved.cf = n;
          if (!cancelled) {
            setCf((prev) => ({ phase: 'live', stats: [...prev.stats, [n, 'solved']] }));
          }
          updateTotal();
        }
      })
      .catch(() => {
        if (!cancelled) setCf((prev) => (prev.phase === 'live' ? prev : { phase: 'unavailable', stats: [] }));
      });

    // ---------- LeetCode (via community mirrors — no official CORS) ----------
    firstOf(
      [
        'https://leetcode-stats-api.herokuapp.com/' + encodeURIComponent(CP.leetcode),
        'https://alfa-leetcode-api.onrender.com/' + encodeURIComponent(CP.leetcode) + '/solved',
      ],
      (d) => {
        const total = d.totalSolved || d.solvedProblem;
        if (typeof total !== 'number') return null;
        const out = [[total, 'solved']];
        if (d.easySolved != null) out.push([d.easySolved, 'easy']);
        if (d.mediumSolved != null) out.push([d.mediumSolved, 'med']);
        if (d.hardSolved != null) out.push([d.hardSolved, 'hard']);
        return { stats: out, total };
      }
    )
      .then((r) => {
        if (cancelled) return;
        setLc({ phase: 'live', stats: r.stats });
        solved.lc = r.total;
        updateTotal();
      })
      .catch(() => {
        if (!cancelled) setLc({ phase: 'unavailable', stats: [] });
      });

    // ---------- CodeChef (community mirror; no official public API) ----------
    firstOf(['https://codechef-api.vercel.app/handle/' + encodeURIComponent(CP.codechef)], (d) => {
      if (!d || (!d.currentRating && !d.stars)) return null;
      const out = [];
      if (d.currentRating) out.push([d.currentRating, 'rating']);
      if (d.highestRating) out.push([d.highestRating, 'peak']);
      if (d.stars) out.push([String(d.stars).replace('★', '') + '★', 'rated']);
      return out.length ? out : null;
    })
      .then((out) => {
        if (!cancelled) setCc({ phase: 'live', stats: out });
      })
      .catch(() => {
        // static markup already rendered by the component; nothing to do
      });

    return () => {
      cancelled = true;
    };
    // Handles are stable by the time this mounts — App only renders this
    // section once the portfolio data fetch has resolved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CP.codeforces, CP.codechef, CP.leetcode]);

  return { cf, cc, lc, totalSolved, live };
}
