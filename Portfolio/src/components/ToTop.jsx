/**
 * Back-to-top button. The progress ring (#topRing), the .show class and the
 * click-to-scroll behaviour are all driven by useScrollTrace (it needs the
 * same scroll-position bookkeeping the rail progress bar already computes).
 */
export default function ToTop() {
  return (
    <button className="to-top" id="toTop" aria-label="Back to top">
      <svg viewBox="0 0 52 52" aria-hidden="true">
        <circle className="ring-bg" cx="26" cy="26" r="23" />
        <circle className="ring-fg" id="topRing" cx="26" cy="26" r="23" />
      </svg>
      <span className="arrow">↑</span>
    </button>
  );
}
