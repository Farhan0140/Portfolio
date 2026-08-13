/**
 * Static markup for the scroll-drawn circuit trace. All the actual drawing
 * (path data, sampled points, node markers, the travelling pulse) is done
 * imperatively by the useScrollTrace hook, exactly like the source — this
 * component only needs to put the right ids in the DOM for that hook to
 * find.
 */
export default function TraceOverlay() {
  return (
    <div id="trace-wrap" aria-hidden="true">
      <svg id="traceSvg" preserveAspectRatio="xMidYMin meet">
        <defs>
          <linearGradient id="traceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop className="g0" offset="0%" />
            <stop className="g1" offset="55%" />
            <stop className="g2" offset="100%" />
          </linearGradient>
        </defs>
        <path id="traceBase" className="tr-base" />
        <path id="traceLit" className="tr-lit" />
        <g id="traceNodes" />
        <circle id="tracePulse" className="tr-pulse" r="5.5" />
      </svg>
    </div>
  );
}
