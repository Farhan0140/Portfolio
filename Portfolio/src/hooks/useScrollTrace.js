import { useEffect } from 'react';

const $ = (s, c) => (c || document).querySelector(s);
const $$ = (s, c) => Array.prototype.slice.call((c || document).querySelectorAll(s));
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/**
 * Ports sections 5, 6 and 7 of the original inline script almost verbatim:
 *   5. the hand-built scroll-linked SVG circuit-trace path drawer
 *   6. nav reading-progress bar, scrollspy pointer, back-to-top ring
 *   7. rebuild-on-layout-change plumbing (resize / fonts / ResizeObserver)
 *
 * It expects the following ids to already exist in the DOM (rendered by
 * Rail, TraceOverlay and ToTop): #trace-wrap #traceSvg #traceBase #traceLit
 * #traceNodes #tracePulse #nav #navBar #navLinks (a...) #railPointer #toTop
 * #topRing. Exposes window.fnRefreshTrace(), same as the source, so other
 * pieces (the project/IoT/cert pagers) can ask for a rebuild after they
 * change page height.
 */
export default function useScrollTrace() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const wrap = $('#trace-wrap');
    const svg = $('#traceSvg');
    const baseP = $('#traceBase');
    const litP = $('#traceLit');
    const nodesG = $('#traceNodes');
    const pulse = $('#tracePulse');
    const nav = $('#nav');
    const railPtr = $('#railPointer');
    const toTop = $('#toTop');
    const topRing = $('#topRing');

    if (!wrap || !svg || !baseP || !litP || !nodesG || !pulse || !nav || !railPtr || !toTop || !topRing) {
      return undefined;
    }

    let SX = [];
    let SY = [];
    let SL = [];
    let totalLen = 0;
    let traceNodes = [];
    let building = false;
    let lastLink = null;
    let stopped = false;
    let frameId = null;
    let rebuildTimer = null;
    let lastSig = '';
    let scheduled = false;
    let litCur = 0;
    let litTarget = 0;
    let ticking = false;
    let settleFrames = 0;

    function chamferPath(pts, c) {
      let d = 'M ' + pts[0].x + ' ' + pts[0].y;
      for (let i = 1; i < pts.length - 1; i++) {
        const p = pts[i];
        const a = pts[i - 1];
        const b = pts[i + 1];
        const inLen = Math.abs(p.x - a.x) + Math.abs(p.y - a.y);
        const outLen = Math.abs(b.x - p.x) + Math.abs(b.y - p.y);
        const r = Math.min(c, inLen / 2, outLen / 2);
        const ux = Math.sign(p.x - a.x);
        const uy = Math.sign(p.y - a.y);
        const vx = Math.sign(b.x - p.x);
        const vy = Math.sign(b.y - p.y);
        d += ' L ' + (p.x - ux * r) + ' ' + (p.y - uy * r);
        d += ' L ' + (p.x + vx * r) + ' ' + (p.y + vy * r);
      }
      const last = pts[pts.length - 1];
      return d + ' L ' + last.x + ' ' + last.y;
    }

    function svgEl(tag, attrs) {
      const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      return e;
    }

    function lengthAtY(y) {
      if (!SY.length) return 0;
      if (y <= SY[0]) return 0;
      if (y >= SY[SY.length - 1]) return totalLen;
      let lo = 0;
      let hi = SY.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (SY[mid] < y) lo = mid;
        else hi = mid;
      }
      const span = SY[hi] - SY[lo];
      const f = span > 0 ? (y - SY[lo]) / span : 0;
      return SL[lo] + (SL[hi] - SL[lo]) * f;
    }

    function pointAtLength(L) {
      if (!SL.length) return { x: 0, y: 0 };
      let lo = 0;
      let hi = SL.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (SL[mid] < L) lo = mid;
        else hi = mid;
      }
      const span = SL[hi] - SL[lo];
      const f = span > 0 ? (L - SL[lo]) / span : 0;
      return { x: SX[lo] + (SX[hi] - SX[lo]) * f, y: SY[lo] + (SY[hi] - SY[lo]) * f };
    }

    function buildTrace() {
      if (building) return;
      building = true;

      const W = document.documentElement.clientWidth;
      const H = document.body.scrollHeight;
      const wide = W >= 1120;
      const labels = W >= 1260;
      const cx = Math.round(W / 2);
      const lanes = wide ? [cx - Math.min(470, cx - 120), cx + Math.min(470, cx - 120)] : [18, 44];

      const scrollY = window.scrollY;
      const sections = $$('[data-label]');

      traceNodes = sections.map((sec, i) => {
        const head = sec.querySelector('.section-title') || sec.querySelector('.footer-title') || sec;
        const hr = head.getBoundingClientRect();
        const sr = sec.getBoundingClientRect();
        return {
          el: sec,
          label: sec.dataset.label,
          x: lanes[i % 2],
          y: Math.round(hr.top + scrollY + hr.height / 2),
          jogY: Math.round(sr.top + scrollY + (wide ? 46 : 30)),
          top: Math.round(sr.top + scrollY),
        };
      });

      const pts = [{ x: traceNodes.length ? traceNodes[0].x : lanes[0], y: 0 }];
      let prevX = pts[0].x;
      traceNodes.forEach((n) => {
        if (n.x !== prevX) {
          const jy = clamp(n.jogY, pts[pts.length - 1].y + 30, n.y - 30);
          pts.push({ x: prevX, y: jy });
          pts.push({ x: n.x, y: jy });
        }
        pts.push({ x: n.x, y: n.y });
        prevX = n.x;
      });
      if (wide) {
        pts.push({ x: prevX, y: H - 46 });
        pts.push({ x: cx, y: H - 46 });
        pts.push({ x: cx, y: H - 8 });
      } else {
        pts.push({ x: prevX, y: H - 8 });
      }

      const d = chamferPath(pts, wide ? 30 : 12);

      wrap.style.height = H + 'px';
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      baseP.setAttribute('d', d);
      litP.setAttribute('d', d);

      totalLen = litP.getTotalLength();
      litP.style.strokeDasharray = totalLen;
      litP.style.strokeDashoffset = totalLen;

      const N = 700;
      SX = new Array(N + 1);
      SY = new Array(N + 1);
      SL = new Array(N + 1);
      for (let k = 0; k <= N; k++) {
        const L = (totalLen * k) / N;
        const pt = litP.getPointAtLength(L);
        SX[k] = pt.x;
        SY[k] = pt.y;
        SL[k] = L;
      }

      nodesG.textContent = '';
      traceNodes.forEach((n) => {
        const g = svgEl('g', { class: 'tr-node' });
        g.appendChild(svgEl('circle', { class: 'ring', cx: n.x, cy: n.y, r: 7 }));
        g.appendChild(svgEl('circle', { class: 'pad', cx: n.x, cy: n.y, r: wide ? 6 : 4.5 }));
        g.appendChild(svgEl('circle', { class: 'core', cx: n.x, cy: n.y, r: wide ? 2.2 : 1.8 }));
        if (labels) {
          const left = n.x < cx;
          const t = svgEl('text', {
            class: 'tr-label',
            x: n.x + (left ? -16 : 16),
            y: n.y + 4,
            'text-anchor': left ? 'end' : 'start',
          });
          t.textContent = n.label;
          g.appendChild(t);
        }
        nodesG.appendChild(g);
        n.g = g;
        n.len = lengthAtY(n.y);
      });

      pulse.setAttribute('r', wide ? 5.5 : 4);
      building = false;
      update(true);
    }

    function movePointer(a) {
      if (!railPtr) return;
      lastLink = a;
      if (!a) {
        railPtr.classList.remove('on');
        return;
      }
      railPtr.classList.add('on');
      railPtr.style.setProperty('--ptr-y', a.offsetTop + (a.offsetHeight - 26) / 2 + 'px');
      railPtr.style.setProperty('--ptr-x', a.offsetLeft + (a.offsetWidth - 26) / 2 + 'px');

      const strip = a.parentNode;
      if (strip && strip.scrollWidth > strip.clientWidth + 4) {
        const want = a.offsetLeft - (strip.clientWidth - a.offsetWidth) / 2;
        const max = strip.scrollWidth - strip.clientWidth;
        strip.scrollTo({ left: Math.max(0, Math.min(want, max)), behavior: reduce ? 'auto' : 'smooth' });
      }
    }

    const RING = 2 * Math.PI * 23;
    topRing.style.strokeDasharray = RING;
    topRing.style.strokeDashoffset = RING;

    function onToTopClick() {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    }
    toTop.addEventListener('click', onToTopClick);

    function update(snap) {
      const navAs = $$('#navLinks a');
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = Math.max(1, document.body.scrollHeight - vh);
      const prog = clamp(y / max, 0, 1);

      nav.style.setProperty('--prog', prog);
      topRing.style.strokeDashoffset = RING * (1 - prog);
      toTop.classList.toggle('show', y > vh * 0.7);

      nav.classList.toggle('stuck', y > 30);

      let activeId = null;
      for (let i = 0; i < traceNodes.length; i++) {
        if (traceNodes[i].top - 160 <= y) activeId = traceNodes[i].el.id;
      }
      let hit = null;
      navAs.forEach((a) => {
        const on = activeId !== null && a.getAttribute('href') === '#' + activeId;
        a.classList.toggle('active', on);
        if (on) hit = a;
      });
      movePointer(hit);

      if (totalLen) {
        litTarget = lengthAtY(y + vh * 0.58);
        if (snap || reduce) litCur = litTarget;
        litP.style.strokeDashoffset = totalLen - litCur;
        const p = pointAtLength(litCur);
        pulse.setAttribute('cx', p.x);
        pulse.setAttribute('cy', p.y);
        pulse.classList.toggle('on', y > 40 && litCur < totalLen - 4);
        for (let j = 0; j < traceNodes.length; j++) {
          const n = traceNodes[j];
          if (n.g) n.g.classList.toggle('on', litCur >= n.len - 6);
        }
      }

      if (!reduce && y < vh * 1.2) {
        $$('.float-emoji').forEach((em) => {
          em.style.setProperty('--py', y * (parseFloat(em.dataset.depth) || 0.05) * -1 + 'px');
        });
      }
    }

    function frame() {
      if (stopped) return;
      const diff = litTarget - litCur;
      if (Math.abs(diff) > 0.4) {
        litCur += diff * 0.14;
        litP.style.strokeDashoffset = totalLen - litCur;
        const p = pointAtLength(litCur);
        pulse.setAttribute('cx', p.x);
        pulse.setAttribute('cy', p.y);
        for (let j = 0; j < traceNodes.length; j++) {
          const n = traceNodes[j];
          if (n.g) n.g.classList.toggle('on', litCur >= n.len - 6);
        }
        settleFrames = 0;
      } else {
        litCur = litTarget;
        settleFrames++;
      }
      if (settleFrames < 90) {
        frameId = requestAnimationFrame(frame);
      } else {
        ticking = false;
      }
    }

    function kick() {
      if (!ticking && !reduce) {
        ticking = true;
        settleFrames = 0;
        frameId = requestAnimationFrame(frame);
      }
    }

    function onScroll() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        update(false);
        kick();
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    function layoutSignature() {
      let s = document.documentElement.clientWidth + 'x' + document.body.scrollHeight;
      $$('[data-label]').forEach((sec) => {
        const head = sec.querySelector('.section-title') || sec.querySelector('.footer-title') || sec;
        const r = head.getBoundingClientRect();
        s += '|' + Math.round(r.top + window.scrollY);
      });
      return s;
    }

    function scheduleRebuild(force) {
      clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(() => {
        const sig = layoutSignature();
        if (!force && sig === lastSig) return;
        lastSig = sig;
        buildTrace();
        movePointer(lastLink);
      }, 140);
    }

    window.fnRefreshTrace = () => scheduleRebuild(true);

    function onResize() {
      scheduleRebuild(false);
    }
    window.addEventListener('resize', onResize);

    let resizeObserver = null;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => scheduleRebuild(false));
      resizeObserver.observe(document.body);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!stopped) scheduleRebuild(true);
      });
    }
    function onLoad() {
      scheduleRebuild(true);
    }
    window.addEventListener('load', onLoad);

    buildTrace();
    lastSig = layoutSignature();
    update(true);

    return () => {
      stopped = true;
      toTop.removeEventListener('click', onToTopClick);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onLoad);
      if (resizeObserver) resizeObserver.disconnect();
      clearTimeout(rebuildTimer);
      if (frameId !== null) cancelAnimationFrame(frameId);
      if (window.fnRefreshTrace) delete window.fnRefreshTrace;
    };
  }, []);
}
