import { navLinks } from '../data/nav';
import { palettes } from '../data/palettes';
import useTheme from '../hooks/useTheme';
import usePalette from '../hooks/usePalette';

export default function Rail() {
  const { theme, toggleTheme } = useTheme();
  const { palette, open, setOpen, choose, btnRef, menuRef } = usePalette();

  return (
    <nav id="nav" className="rail" aria-label="Section navigation">
      <a href="#top" className="rail-logo" aria-label="Farhan Nadim — back to top">
        <span className="rail-icon">
          <span className="dot" />
        </span>
        <span className="rail-label">Farhan Nadim</span>
      </a>

      <div className="rail-links" id="navLinks">
        <span className="rail-pointer" id="railPointer" aria-hidden="true" />
        {navLinks.map((link, i) => (
          <a key={link.href} href={link.href} className="rail-link" style={{ '--i': i + 1 }}>
            <span className="rail-icon">
              <svg className="ic" aria-hidden="true">
                <use href={`#${link.icon}`} />
              </svg>
            </span>
            <span className="rail-label">{link.label}</span>
          </a>
        ))}
      </div>

      <div className="nav-tools">
        <div className="palette-wrap">
          <button
            className="nav-tool-row"
            id="paletteBtn"
            type="button"
            ref={btnRef}
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls="paletteMenu"
            aria-label="Colour Palette"
            title="Colour Palette"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            <span className="theme-toggle palette-btn" aria-hidden="true">
              <svg className="ic" aria-hidden="true">
                <use href="#i-palette" />
              </svg>
            </span>
            <span className="rail-label">Colour Palette</span>
          </button>
          <div
            className={'palette-menu' + (open ? ' open' : '')}
            id="paletteMenu"
            role="menu"
            aria-label="Colour palette"
            ref={menuRef}
          >
            <div className="palette-menu-head">Colour palette</div>
            {palettes.map((p) => (
              <button
                key={p.id}
                className="palette-option"
                type="button"
                role="menuitemradio"
                aria-checked={palette === p.id}
                data-palette-choice={p.id}
                onClick={() => choose(p.id)}
              >
                <span className="palette-swatch" aria-hidden="true">
                  <i style={{ background: p.swatch[0] }} />
                  <i style={{ background: p.swatch[1] }} />
                  <i style={{ background: p.swatch[2] }} />
                </span>
                <span className="palette-name">
                  {p.name}
                  <em>{p.tagline}</em>
                </span>
                <svg className="ic palette-check" aria-hidden="true">
                  <use href="#i-check" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        <button
          className="nav-tool-row"
          id="themeToggle"
          type="button"
          aria-label={theme === 'dark' ? 'Day Mode' : 'Night Mode'}
          title={theme === 'dark' ? 'Day Mode' : 'Night Mode'}
          onClick={toggleTheme}
        >
          <span className="theme-toggle" aria-hidden="true">
            <svg className="ic i-light" aria-hidden="true">
              <use href="#i-sun" />
            </svg>
            <svg className="ic i-dark" aria-hidden="true">
              <use href="#i-moon" />
            </svg>
          </span>
          <span className="rail-label">{theme === 'dark' ? 'Day Mode' : 'Night Mode'}</span>
        </button>
      </div>

      <div className="rail-progress" aria-hidden="true">
        <i id="navBar" />
      </div>
    </nav>
  );
}
