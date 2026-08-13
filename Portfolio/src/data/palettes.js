// The 10 selectable colour palettes, in menu order. Swatch colours are the
// *light*-theme base/paper/accent triple used for the little preview chip.
export const palettes = [
  { id: 'midnight', name: 'Midnight Blue + Cyan', tagline: 'Best overall', swatch: ['#0F172A', '#F8FAFC', '#0284C7'] },
  { id: 'emerald', name: 'Charcoal + Emerald', tagline: 'Calm & premium', swatch: ['#111827', '#FAFAF9', '#059669'] },
  { id: 'amber', name: 'Slate Grey + Amber', tagline: 'Creative, professional', swatch: ['#111827', '#F8FAFC', '#D97706'] },
  { id: 'crimson', name: 'Graphite + Red', tagline: 'Bold & energetic', swatch: ['#111111', '#FFFFFF', '#DC2626'] },
  { id: 'navy', name: 'Navy + Gold', tagline: 'Elegant & premium', swatch: ['#0B1B3A', '#F5F7FF', '#B7791F'] },
  { id: 'violet', name: 'Deep Violet + Purple', tagline: 'Creative & futuristic', swatch: ['#1E1B4B', '#F8F7FF', '#7C3AED'] },
  { id: 'forest', name: 'Forest Green + Lime', tagline: 'Fresh & unique', swatch: ['#0F1A12', '#F7FBF7', '#65A30D'] },
  { id: 'steel', name: 'Steel Blue + Orange', tagline: 'Confident & friendly', swatch: ['#152238', '#F6F8FA', '#EA580C'] },
  { id: 'teal', name: 'Black + Teal', tagline: 'Clean minimal', swatch: ['#111827', '#FFFFFF', '#0D9488'] },
  { id: 'copper', name: 'Carbon + Copper Brown', tagline: 'Warm & mature', swatch: ['#292018', '#FBF8F4', '#B45309'] },
];

export const KNOWN_PALETTE_IDS = palettes.map((p) => p.id);
