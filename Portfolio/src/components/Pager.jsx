/** Pagination controls for a paged grid (projects / IoT projects / certs). */
export default function Pager({ pages, page, goToPage, next, prev, label }) {
  if (pages < 2) return null;

  return (
    <nav className="pager" aria-label={label}>
      <button
        type="button"
        className="pg-btn pg-arrow"
        data-dir="-1"
        aria-label="Previous page"
        disabled={page === 0}
        onClick={prev}
      >
        <svg className="ic" aria-hidden="true">
          <use href="#i-arrow-left" />
        </svg>
      </button>
      {Array.from({ length: pages }, (_, i) => (
        <span key={i} className="pg-group">
          <span className="pg-link" aria-hidden="true" />
          <button
            type="button"
            className={'pg-btn pg-num' + (i === page ? ' is-active' : '')}
            aria-current={i === page ? 'page' : undefined}
            onClick={() => goToPage(i)}
          >
            {i + 1}
          </button>
        </span>
      ))}
      <span className="pg-link" aria-hidden="true" />
      <button
        type="button"
        className="pg-btn pg-arrow"
        data-dir="1"
        aria-label="Next page"
        disabled={page === pages - 1}
        onClick={next}
      >
        <svg className="ic" aria-hidden="true">
          <use href="#i-arrow-right" />
        </svg>
      </button>
    </nav>
  );
}
