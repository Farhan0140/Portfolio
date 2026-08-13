import { useEffect } from 'react';
import gsap from 'gsap';

const TARGET_SELECTOR =
  '.btn, .theme-toggle, .to-top, .modal-close, .social-pill, .platform-btn, .code-link, .live-link, .project-card, .iot-project-card, .rail-link, .dev-card, .dev-social a, .pg-btn, .cert-card, button';
const SPIN_DURATION = 2;
const HOVER_DURATION = 0.2;
const PARALLAX_ON = true;
const CONSTANTS = { borderWidth: 3, cornerSize: 12 };

function isMobile() {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  const ua = (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase();
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
  return (hasTouch && isSmallScreen) || isMobileUA;
}

function resolveThemeColors() {
  const cs = getComputedStyle(document.documentElement);
  return {
    base: cs.getPropertyValue('--green-deep').trim() || '#92400E',
    target: cs.getPropertyValue('--lemon').trim() || '#D97706',
  };
}

function getContainingBlock(element) {
  let node = element ? element.parentElement : null;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      style.willChange.indexOf('transform') !== -1 ||
      style.willChange.indexOf('perspective') !== -1 ||
      style.willChange.indexOf('filter') !== -1 ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

function getContainingBlockOffset(block) {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
}

/**
 * Custom corner-bracket "target cursor" — the only thing gsap is used for
 * in this app. Ported near-verbatim from initTargetCursor(); auto-disabled
 * on touch/coarse pointers (both via isMobile() here and via the
 * `@media (hover:none), (pointer:coarse)` CSS rule that hides the wrapper).
 */
export default function useTargetCursor() {
  useEffect(() => {
    if (isMobile()) return undefined;

    const wrapper = document.getElementById('targetCursor');
    const dot = document.getElementById('targetCursorDot');
    if (!wrapper || !dot) return undefined;

    const corners = wrapper.querySelectorAll('.target-cursor-corner');
    let colors = resolveThemeColors();

    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = 'none';

    let containingBlock = getContainingBlock(wrapper);
    const getOffset = () => getContainingBlockOffset(containingBlock);

    let activeTarget = null;
    let currentLeaveHandler = null;
    let resumeTimeout = null;
    let targetCornerPositions = null;
    const activeStrength = { current: 0 };
    let spinTl = null;

    const initialOffset = getOffset();
    gsap.set(wrapper, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y,
    });

    function createSpinTimeline() {
      if (spinTl) spinTl.kill();
      spinTl = gsap.timeline({ repeat: -1 }).to(wrapper, { rotation: '+=360', duration: SPIN_DURATION, ease: 'none' });
    }
    createSpinTimeline();

    function cleanupTarget(target) {
      if (currentLeaveHandler) target.removeEventListener('mouseleave', currentLeaveHandler);
      currentLeaveHandler = null;
    }

    function moveCursor(x, y) {
      const offset = getOffset();
      gsap.to(wrapper, { x: x - offset.x, y: y - offset.y, duration: 0.1, ease: 'power3.out' });
    }

    function tickerFn() {
      if (!targetCornerPositions) return;
      const strength = activeStrength.current;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(wrapper, 'x');
      const cursorY = gsap.getProperty(wrapper, 'y');

      Array.prototype.forEach.call(corners, (corner, i) => {
        const currentX = gsap.getProperty(corner, 'x');
        const currentY = gsap.getProperty(corner, 'y');
        const targetX = targetCornerPositions[i].x - cursorX;
        const targetY = targetCornerPositions[i].y - cursorY;
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;
        const duration = strength >= 0.99 ? (PARALLAX_ON ? 0.2 : 0) : 0.05;
        gsap.to(corner, { x: finalX, y: finalY, duration, ease: duration === 0 ? 'none' : 'power1.out', overwrite: 'auto' });
      });
    }

    function onMouseMove(e) {
      moveCursor(e.clientX, e.clientY);
    }
    window.addEventListener('mousemove', onMouseMove);

    function onScroll() {
      if (!activeTarget) return;
      const offset = getOffset();
      const mouseX = gsap.getProperty(wrapper, 'x') + offset.x;
      const mouseY = gsap.getProperty(wrapper, 'y') + offset.y;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const stillOver =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget ||
          (elementUnderMouse.closest && elementUnderMouse.closest(TARGET_SELECTOR) === activeTarget));
      if (!stillOver && currentLeaveHandler) currentLeaveHandler();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    function onMouseDown() {
      gsap.to(dot, { scale: 0.7, duration: 0.3 });
      gsap.to(wrapper, { scale: 0.9, duration: 0.2 });
    }
    function onMouseUp() {
      gsap.to(dot, { scale: 1, duration: 0.3 });
      gsap.to(wrapper, { scale: 1, duration: 0.2 });
    }
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    function onMouseOver(e) {
      let current = e.target;
      let target = null;
      while (current && current !== document.body) {
        if (current.matches && current.matches(TARGET_SELECTOR)) {
          target = current;
          break;
        }
        current = current.parentElement;
      }
      if (!target || activeTarget === target) return;
      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      Array.prototype.forEach.call(corners, (corner) => gsap.killTweensOf(corner, 'x,y'));

      gsap.killTweensOf(wrapper, 'rotation');
      if (spinTl) spinTl.pause();
      gsap.set(wrapper, { rotation: 0 });

      gsap.to(corners, { borderColor: colors.target, duration: 0.15, ease: 'power2.out' });
      gsap.to(dot, { backgroundColor: colors.target, duration: 0.15, ease: 'power2.out' });

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = CONSTANTS;
      const offset = getOffset();
      const cursorX = gsap.getProperty(wrapper, 'x');
      const cursorY = gsap.getProperty(wrapper, 'y');

      targetCornerPositions = [
        { x: rect.left - borderWidth - offset.x, y: rect.top - borderWidth - offset.y },
        { x: rect.right + borderWidth - cornerSize - offset.x, y: rect.top - borderWidth - offset.y },
        { x: rect.right + borderWidth - cornerSize - offset.x, y: rect.bottom + borderWidth - cornerSize - offset.y },
        { x: rect.left - borderWidth - offset.x, y: rect.bottom + borderWidth - cornerSize - offset.y },
      ];

      gsap.ticker.add(tickerFn);
      gsap.to(activeStrength, { current: 1, duration: HOVER_DURATION, ease: 'power2.out' });

      Array.prototype.forEach.call(corners, (corner, i) => {
        gsap.to(corner, { x: targetCornerPositions[i].x - cursorX, y: targetCornerPositions[i].y - cursorY, duration: 0.2, ease: 'power2.out' });
      });

      const leaveHandler = () => {
        gsap.ticker.remove(tickerFn);
        targetCornerPositions = null;
        gsap.set(activeStrength, { current: 0, overwrite: true });
        activeTarget = null;

        gsap.to(corners, { borderColor: colors.base, duration: 0.15, ease: 'power2.out' });
        gsap.to(dot, { backgroundColor: colors.base, duration: 0.15, ease: 'power2.out' });

        gsap.killTweensOf(corners, 'x,y');
        const cs = CONSTANTS.cornerSize;
        const positions = [
          { x: -cs * 1.5, y: -cs * 1.5 },
          { x: cs * 0.5, y: -cs * 1.5 },
          { x: cs * 0.5, y: cs * 0.5 },
          { x: -cs * 1.5, y: cs * 0.5 },
        ];
        const tl = gsap.timeline();
        Array.prototype.forEach.call(corners, (corner, index) => {
          tl.to(corner, { x: positions[index].x, y: positions[index].y, duration: 0.3, ease: 'power3.out' }, 0);
        });

        resumeTimeout = setTimeout(() => {
          if (!activeTarget && spinTl) {
            const currentRotation = gsap.getProperty(wrapper, 'rotation');
            const normalizedRotation = currentRotation % 360;
            spinTl.kill();
            spinTl = gsap.timeline({ repeat: -1 }).to(wrapper, { rotation: '+=360', duration: SPIN_DURATION, ease: 'none' });
            gsap.to(wrapper, {
              rotation: normalizedRotation + 360,
              duration: SPIN_DURATION * (1 - normalizedRotation / 360),
              ease: 'none',
              onComplete: () => {
                if (spinTl) spinTl.restart();
              },
            });
          }
          resumeTimeout = null;
        }, 50);

        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    }
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    function onResize() {
      containingBlock = getContainingBlock(wrapper);
    }
    window.addEventListener('resize', onResize);

    const observer = new MutationObserver(() => {
      colors = resolveThemeColors();
      if (!activeTarget) {
        gsap.set(corners, { borderColor: colors.base });
        gsap.set(dot, { backgroundColor: colors.base });
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      if (activeTarget) cleanupTarget(activeTarget);
      if (spinTl) spinTl.kill();
      if (resumeTimeout) clearTimeout(resumeTimeout);
      gsap.killTweensOf(wrapper);
      gsap.killTweensOf(dot);
      gsap.killTweensOf(corners);
      gsap.ticker.remove(tickerFn);
      document.body.style.cursor = originalCursor;
    };
  }, []);
}
