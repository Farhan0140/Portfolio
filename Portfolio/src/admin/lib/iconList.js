// The admin's icon pickers choose from this fixed, curated set — every id
// here has a matching inline SVG symbol in src/components/IconSprite.jsx.
// Adding a brand-new glyph (not just reusing one of these) still requires a
// one-time code change to IconSprite.jsx; that's a deliberate, narrow
// exception to "no code changes for content updates" (see the project plan).
export const BRAND_ICONS = [
  'b-arduino', 'b-c', 'b-cpp', 'b-css3', 'b-django', 'b-drf', 'b-git', 'b-github',
  'b-go', 'b-html5', 'b-js', 'b-neon', 'b-netlify', 'b-platformio', 'b-postgres',
  'b-python', 'b-react', 'b-render', 'b-rest', 'b-sql', 'b-supabase', 'b-vercel', 'b-vscode',
];

export const UI_ICONS = [
  'i-arrow-left', 'i-arrow-right', 'i-award', 'i-bars', 'i-battery', 'i-book',
  'i-brackets', 'i-branch', 'i-bulb', 'i-calendar', 'i-cap', 'i-check', 'i-chef',
  'i-clock', 'i-copy', 'i-cpu', 'i-download', 'i-eye', 'i-github', 'i-globe',
  'i-layers', 'i-link', 'i-linkedin', 'i-mail', 'i-monitor', 'i-moon', 'i-nut',
  'i-palette', 'i-phone', 'i-pin', 'i-plug', 'i-rocket', 'i-signal', 'i-sun', 'i-toolbox',
];

export const ALL_ICONS = [...BRAND_ICONS, ...UI_ICONS];
