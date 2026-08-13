import useTargetCursor from '../hooks/useTargetCursor';

/** Corner-bracket cursor that snaps to hovered interactive elements. */
export default function TargetCursor() {
  useTargetCursor();

  return (
    <div className="target-cursor-wrapper" id="targetCursor" aria-hidden="true">
      <div className="target-cursor-dot" id="targetCursorDot" />
      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
}
