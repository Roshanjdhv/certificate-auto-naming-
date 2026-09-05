export const FONTS = [
  { label: 'Great Vibes',         value: "'Great Vibes', cursive",        category: 'Handwriting' },
  { label: 'Pinyon Script',       value: "'Pinyon Script', cursive",       category: 'Handwriting' },
  { label: 'Allura',              value: "'Allura', cursive",              category: 'Handwriting' },
  { label: 'Alex Brush',          value: "'Alex Brush', cursive",          category: 'Handwriting' },
  { label: 'Sacramento',          value: "'Sacramento', cursive",          category: 'Handwriting' },
  { label: 'Tangerine',           value: "'Tangerine', cursive",           category: 'Handwriting' },
  { label: 'Dancing Script',      value: "'Dancing Script', cursive",      category: 'Handwriting' },
  { label: 'Satisfy',             value: "'Satisfy', cursive",             category: 'Handwriting' },
  { label: 'Pacifico',            value: "'Pacifico', cursive",            category: 'Handwriting' },
  { label: 'Cinzel',              value: "'Cinzel', serif",                category: 'Elegant Serif' },
  { label: 'Cormorant Garamond',  value: "'Cormorant Garamond', serif",    category: 'Elegant Serif' },
  { label: 'Playfair Display',    value: "'Playfair Display', serif",      category: 'Elegant Serif' },
  { label: 'EB Garamond',         value: "'EB Garamond', serif",           category: 'Elegant Serif' },
  { label: 'Crimson Text',        value: "'Crimson Text', serif",          category: 'Elegant Serif' },
  { label: 'Libre Baskerville',   value: "'Libre Baskerville', serif",     category: 'Elegant Serif' },
  { label: 'Georgia',             value: 'Georgia, serif',                 category: 'Classic' },
  { label: 'Palatino',            value: "'Palatino Linotype', serif",     category: 'Classic' },
  { label: 'Times New Roman',     value: "'Times New Roman', serif",       category: 'Classic' },
  { label: 'Raleway',             value: "'Raleway', sans-serif",          category: 'Sans-serif' },
  { label: 'Lato',                value: "'Lato', sans-serif",             category: 'Sans-serif' },
  { label: 'Arial',               value: 'Arial, sans-serif',              category: 'Sans-serif' },
  { label: 'Verdana',             value: 'Verdana, sans-serif',            category: 'Sans-serif' },
  { label: 'Courier New',         value: "'Courier New', monospace",       category: 'Monospace' },
];

export function defaultTypography() {
  return {
    font:          FONTS[0].value,
    size:          72,
    color:         '#2c1a0e',
    bold:          false,
    italic:        false,
    align:         'center',
    textTransform: 'none',
    shadowEnabled: false,
    shadowColor:   '#000000',
    shadowBlur:    6,
    shadowOffsetX: 2,
    shadowOffsetY: 3,
    shadowOpacity: 60,
  };
}

export function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity / 100})`;
}

export function safeName(n) {
  return String(n).replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').slice(0, 60) || 'certificate';
}

export function applyTextTransform(value, transform) {
  if (transform === 'uppercase') return value.toUpperCase();
  if (transform === 'titlecase') return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  return value;
}

export function buildFieldFont(field, overrideFont) {
  const parts = [];
  if (field.italic) parts.push('italic');
  if (field.bold)   parts.push('bold');
  parts.push(`${field.size}px`);
  parts.push(overrideFont || field.font);
  return parts.join(' ');
}
