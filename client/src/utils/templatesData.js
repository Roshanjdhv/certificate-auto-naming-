// Predefined Certificate Templates Data for CertFlow
// Each template contains structured background graphic specs and editable canvas elements.

export const TEMPLATE_CATEGORIES = [
  'All',
  'Education',
  'Graduation',
  'Courses',
  'Workshops',
  'Events',
  'Awards',
  'Professional',
  'Appreciation',
  'My Templates',
];

// Helper to generate canvas background artwork Data URLs for templates
export function generateTemplateBackground(themeStyle = 'classic-gold', w = 1920, h = 1080) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (themeStyle === 'classic-gold') {
    // Rich Dark Navy/Black background with Gold Ornamental Border
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, w, h);

    // Subtle radial gradient center
    const radial = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, 800);
    radial.addColorStop(0, '#16161a');
    radial.addColorStop(1, '#08080a');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, w, h);

    // Double Outer Gold Border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 14;
    ctx.strokeRect(36, 36, w - 72, h - 72);

    ctx.strokeStyle = '#f3e5ab';
    ctx.lineWidth = 3;
    ctx.strokeRect(54, 54, w - 108, h - 108);

    // Corner Ornaments
    const drawCorner = (x, y, rot) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(40, 0);
      ctx.lineTo(40, 6);
      ctx.lineTo(6, 6);
      ctx.lineTo(6, 40);
      ctx.lineTo(0, 40);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    drawCorner(54, 54, 0);
    drawCorner(w - 54, 54, Math.PI / 2);
    drawCorner(w - 54, h - 54, Math.PI);
    drawCorner(54, h - 54, -Math.PI / 2);

    // Bottom Watermark Badge Seal
    ctx.save();
    ctx.translate(w / 2, h - 140);
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  } else if (themeStyle === 'modern-minimal') {
    // Crisp Dark Monochrome with Thin White Geometry
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 20;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, w - 110, h - 110);

    // Corner Accents
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(55, 55, 24, 4);
    ctx.fillRect(55, 55, 4, 24);

    ctx.fillRect(w - 79, 55, 24, 4);
    ctx.fillRect(w - 59, 55, 4, 24);

    ctx.fillRect(55, h - 59, 24, 4);
    ctx.fillRect(55, h - 79, 4, 24);

    ctx.fillRect(w - 79, h - 59, 24, 4);
    ctx.fillRect(w - 59, h - 79, 4, 24);
  } else if (themeStyle === 'executive-slate') {
    // Slate Gray Premium Framing
    ctx.fillStyle = '#121214';
    ctx.fillRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1c1c20');
    grad.addColorStop(1, '#0e0e10');
    ctx.fillStyle = grad;
    ctx.fillRect(40, 40, w - 80, h - 80);

    ctx.strokeStyle = '#71717a';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, w - 120, h - 120);

    ctx.strokeStyle = '#e4e4e7';
    ctx.lineWidth = 1;
    ctx.strokeRect(70, 70, w - 140, h - 140);
  } else {
    // Elegant Dark Theme with Silver Borders
    ctx.fillStyle = '#0f0f11';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#e4e4e7';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 2;
    ctx.strokeRect(56, 56, w - 112, h - 112);
  }

  return canvas.toDataURL('image/png');
}

export const PRESET_TEMPLATES = [
  {
    id: 'festive-achievement-01',
    name: 'Festive Achievement Certificate',
    category: 'Awards',
    description: 'Vibrant celebratory certificate design with festive stars and confetti motifs. Ideal for competitions, events, and special honors.',
    background: '/certificates/certificate1.png',
    naturalW: 1414,
    naturalH: 1000,
    fields: [
      { id: 'f1', key: 'title', label: 'Title', isDynamic: false, text: 'Congratulations', x: 0.5, y: 0.23, font: "'Cinzel', serif", size: 48, color: '#1e1b4b', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 1 },
      { id: 'f2', key: 'subtitle', label: 'Subtitle', isDynamic: false, text: 'Certificate of Appreciation', x: 0.5, y: 0.35, font: "'Inter', sans-serif", size: 18, color: '#374151', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 2 },
      { id: 'f3', key: 'name', label: 'Recipient Name', isDynamic: true, text: 'Roshan Jadhav', x: 0.5, y: 0.46, font: "'Playfair Display', serif", size: 54, color: '#1e1b4b', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 3 },
      { id: 'f4', key: 'description', label: 'Description', isDynamic: false, text: 'This certificate is proudly presented to Roshan Jadhav\nin recognition of your dedication and valuable contribution.\nYour sincere efforts have made a remarkable difference.\nYour commitment and enthusiasm are truly appreciated.', x: 0.5, y: 0.60, font: "'Inter', sans-serif", size: 16, color: '#4b5563', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 4 },
      { id: 'f5', key: 'date', label: 'Date', isDynamic: true, text: '05-10-2026', x: 0.3, y: 0.79, font: "'Inter', sans-serif", size: 16, color: '#1f2937', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 5 },
      { id: 'f6', key: 'signature', label: 'Signature', isDynamic: false, text: 'Authorized Signatory', x: 0.7, y: 0.79, font: "'Great Vibes', cursive", size: 36, color: '#1e1b4b', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 6 },
    ]
  },
  {
    id: 'retro-geometric-02',
    name: 'Retro Geometric Certificate (Portrait)',
    category: 'Professional',
    description: 'Modern vertical (portrait) certificate framing with rich retro geometric shapes in orange, teal, and gold.',
    background: '/certificates/certificate2.png',
    naturalW: 1000,
    naturalH: 1414,
    fields: [
      { id: 'f1', key: 'title', label: 'Title', isDynamic: false, text: 'Congratulations', x: 0.5, y: 0.20, font: "'Cinzel', serif", size: 44, color: '#1f2937', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 1 },
      { id: 'f2', key: 'subtitle', label: 'Subtitle', isDynamic: false, text: 'Certificate of Appreciation', x: 0.5, y: 0.30, font: "'Raleway', sans-serif", size: 16, color: '#6b7280', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 2 },
      { id: 'f3', key: 'name', label: 'Recipient Name', isDynamic: true, text: 'Roshan Jadhav', x: 0.5, y: 0.40, font: "'Playfair Display', serif", size: 52, color: '#7c2d12', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 3 },
      { id: 'f4', key: 'description', label: 'Description', isDynamic: false, text: 'This certificate is proudly presented to Roshan Jadhav\nin recognition of your dedication and valuable contribution.\nYour sincere efforts have made a remarkable difference.\nYour commitment and enthusiasm are truly appreciated.', x: 0.5, y: 0.54, font: "'Cormorant Garamond', serif", size: 18, color: '#374151', bold: false, italic: true, align: 'center', locked: false, hidden: false, layer: 4 },
      { id: 'f5', key: 'date', label: 'Date', isDynamic: true, text: '05-10-2026', x: 0.30, y: 0.78, font: "'Inter', sans-serif", size: 15, color: '#1f2937', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 5 },
      { id: 'f6', key: 'signature', label: 'Signature', isDynamic: false, text: 'Authorized Signatory', x: 0.70, y: 0.78, font: "'Satisfy', cursive", size: 30, color: '#111827', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 6 },
    ]
  },
  {
    id: 'corporate-hex-03',
    name: 'Modern Corporate Hex Certificate',
    category: 'Courses',
    description: 'Sleek corporate certificate template with tech-inspired navy blue and gold geometric hexagon border.',
    background: '/certificates/certificate3.png',
    naturalW: 1414,
    naturalH: 1000,
    fields: [
      { id: 'f1', key: 'title', label: 'Title', isDynamic: false, text: 'Congratulations', x: 0.5, y: 0.22, font: "'Cinzel', serif", size: 48, color: '#1e3a8a', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 1 },
      { id: 'f2', key: 'subtitle', label: 'Subtitle', isDynamic: false, text: 'Certificate of Appreciation', x: 0.5, y: 0.35, font: "'Inter', sans-serif", size: 16, color: '#4b5563', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 2 },
      { id: 'f3', key: 'name', label: 'Recipient Name', isDynamic: true, text: 'Roshan Jadhav', x: 0.5, y: 0.46, font: "'Playfair Display', serif", size: 56, color: '#0f172a', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 3 },
      { id: 'f4', key: 'description', label: 'Description', isDynamic: false, text: 'This certificate is proudly presented to Roshan Jadhav\nin recognition of your dedication and valuable contribution.\nYour sincere efforts have made a remarkable difference.\nYour commitment and enthusiasm are truly appreciated.', x: 0.5, y: 0.59, font: "'Inter', sans-serif", size: 16, color: '#334155', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 4 },
      { id: 'f5', key: 'date', label: 'Date', isDynamic: true, text: '05-10-2026', x: 0.3, y: 0.80, font: "'Inter', sans-serif", size: 16, color: '#1e293b', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 5 },
      { id: 'f6', key: 'signature', label: 'Signature', isDynamic: false, text: 'Authorized Signatory', x: 0.7, y: 0.80, font: "'Great Vibes', cursive", size: 34, color: '#1e3a8a', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 6 },
    ]
  },
  {
    id: 'science-tech-04',
    name: 'Science & STEM Innovation Certificate',
    category: 'Education',
    description: 'Artistic STEM template featuring science icons (atoms, flasks, bulbs, microscope) for science fairs and tech bootcamps.',
    background: '/certificates/certificate4.png',
    naturalW: 1414,
    naturalH: 1000,
    fields: [
      { id: 'f1', key: 'title', label: 'Title', isDynamic: false, text: 'Congratulations', x: 0.5, y: 0.22, font: "'Cinzel', serif", size: 46, color: '#0369a1', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 1 },
      { id: 'f2', key: 'subtitle', label: 'Subtitle', isDynamic: false, text: 'Certificate of Appreciation', x: 0.5, y: 0.35, font: "'Raleway', sans-serif", size: 16, color: '#475569', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 2 },
      { id: 'f3', key: 'name', label: 'Recipient Name', isDynamic: true, text: 'Roshan Jadhav', x: 0.5, y: 0.46, font: "'Playfair Display', serif", size: 54, color: '#0f172a', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 3 },
      { id: 'f4', key: 'description', label: 'Description', isDynamic: false, text: 'This certificate is proudly presented to Roshan Jadhav\nin recognition of your dedication and valuable contribution.\nYour sincere efforts have made a remarkable difference.\nYour commitment and enthusiasm are truly appreciated.', x: 0.5, y: 0.60, font: "'Inter', sans-serif", size: 16, color: '#334155', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 4 },
      { id: 'f5', key: 'date', label: 'Date', isDynamic: true, text: '05-10-2026', x: 0.3, y: 0.80, font: "'Inter', sans-serif", size: 16, color: '#0f172a', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 5 },
      { id: 'f6', key: 'signature', label: 'Signature', isDynamic: false, text: 'Authorized Signatory', x: 0.7, y: 0.80, font: "'Satisfy', cursive", size: 32, color: '#0369a1', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 6 },
    ]
  },
  {
    id: 'course-completion-01',
    name: 'Course Completion Certificate',
    category: 'Courses',
    description: 'Sleek dark certificate template tailored for online bootcamps, tech courses, and skill certifications.',
    background: '/certificates/certificate5.png',
    naturalW: 1920,
    naturalH: 1080,
    fields: [
      { id: 'f1', key: 'title', label: 'Title', isDynamic: false, text: 'Congratulations', x: 0.5, y: 0.22, font: "'Cinzel', serif", size: 52, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 1 },
      { id: 'f2', key: 'subtitle', label: 'Subtitle', isDynamic: false, text: 'Certificate of Appreciation', x: 0.5, y: 0.35, font: "'Inter', sans-serif", size: 18, color: '#d4af37', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 2 },
      { id: 'f3', key: 'name', label: 'Recipient Name', isDynamic: true, text: 'Roshan Jadhav', x: 0.5, y: 0.46, font: "'Playfair Display', serif", size: 56, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 3 },
      { id: 'f4', key: 'description', label: 'Description', isDynamic: false, text: 'This certificate is proudly presented to Roshan Jadhav\nin recognition of your dedication and valuable contribution.\nYour sincere efforts have made a remarkable difference.\nYour commitment and enthusiasm are truly appreciated.', x: 0.5, y: 0.58, font: "'Cormorant Garamond', serif", size: 20, color: '#e4e4e7', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 4 },
      { id: 'f5', key: 'date', label: 'Date', isDynamic: true, text: '05-10-2026', x: 0.3, y: 0.78, font: "'Inter', sans-serif", size: 16, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 5 },
      { id: 'f6', key: 'signature', label: 'Signature', isDynamic: false, text: 'Authorized Signatory', x: 0.7, y: 0.78, font: "'Great Vibes', cursive", size: 36, color: '#d4af37', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 6 },
    ]
  },
  {
    id: 'academic-excellence-02',
    name: 'Academic Excellence Award',
    category: 'Education',
    description: 'Formal academic honor template designed for universities, schools, and academic distinction programs.',
    background: '/certificates/certificate6.png',
    naturalW: 1920,
    naturalH: 1080,
    fields: [
      { id: 'f1', key: 'title', label: 'Title', isDynamic: false, text: 'Congratulations', x: 0.5, y: 0.20, font: "'Cinzel', serif", size: 52, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 1 },
      { id: 'f2', key: 'subtitle', label: 'Subtitle', isDynamic: false, text: 'Certificate of Appreciation', x: 0.5, y: 0.34, font: "'Inter', sans-serif", size: 18, color: '#a1a1aa', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 2 },
      { id: 'f3', key: 'name', label: 'Recipient Name', isDynamic: true, text: 'Roshan Jadhav', x: 0.5, y: 0.46, font: "'Playfair Display', serif", size: 58, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 3 },
      { id: 'f4', key: 'description', label: 'Description', isDynamic: false, text: 'This certificate is proudly presented to Roshan Jadhav\nin recognition of your dedication and valuable contribution.\nYour sincere efforts have made a remarkable difference.\nYour commitment and enthusiasm are truly appreciated.', x: 0.5, y: 0.60, font: "'Cormorant Garamond', serif", size: 20, color: '#d4d4d8', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 4 },
      { id: 'f5', key: 'date', label: 'Date', isDynamic: true, text: '05-10-2026', x: 0.30, y: 0.78, font: "'Inter', sans-serif", size: 16, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 5 },
      { id: 'f6', key: 'signature', label: 'Signature', isDynamic: false, text: 'Authorized Signatory', x: 0.70, y: 0.78, font: "'Satisfy', cursive", size: 32, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 6 },
    ]
  },
  {
    id: 'graduation-cert-03',
    name: 'Graduation Diploma Certificate',
    category: 'Graduation',
    description: 'High-contrast graduation diploma certificate layout with formal typography and honors placement.',
    background: '/certificates/certificate7.png',
    naturalW: 1920,
    naturalH: 1080,
    fields: [
      { id: 'f1', key: 'title', label: 'Title', isDynamic: false, text: 'Congratulations', x: 0.5, y: 0.22, font: "'Cinzel', serif", size: 50, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 1 },
      { id: 'f2', key: 'subtitle', label: 'Subtitle', isDynamic: false, text: 'Certificate of Appreciation', x: 0.5, y: 0.35, font: "'Raleway', sans-serif", size: 18, color: '#a1a1aa', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 2 },
      { id: 'f3', key: 'name', label: 'Graduate Name', isDynamic: true, text: 'Roshan Jadhav', x: 0.5, y: 0.47, font: "'Playfair Display', serif", size: 58, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 3 },
      { id: 'f4', key: 'description', label: 'Description', isDynamic: false, text: 'This certificate is proudly presented to Roshan Jadhav\nin recognition of your dedication and valuable contribution.\nYour sincere efforts have made a remarkable difference.\nYour commitment and enthusiasm are truly appreciated.', x: 0.5, y: 0.60, font: "'EB Garamond', serif", size: 20, color: '#e4e4e7', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 4 },
      { id: 'f5', key: 'date', label: 'Date', isDynamic: true, text: '05-10-2026', x: 0.3, y: 0.78, font: "'Inter', sans-serif", size: 16, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 5 },
      { id: 'f6', key: 'signature', label: 'Signature', isDynamic: false, text: 'Authorized Signatory', x: 0.7, y: 0.78, font: "'Great Vibes', cursive", size: 34, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 6 },
    ]
  },
  {
    id: 'workshop-participation-04',
    name: 'Workshop Participation Certificate',
    category: 'Workshops',
    description: 'Clean modern template designed for hands-on intensive workshops, seminars, and masterclasses.',
    background: '/certificates/certificate5.png',
    naturalW: 1920,
    naturalH: 1080,
    fields: [
      { id: 'f1', key: 'title', label: 'Title', isDynamic: false, text: 'Congratulations', x: 0.5, y: 0.22, font: "'Raleway', sans-serif", size: 48, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 1 },
      { id: 'f2', key: 'subtitle', label: 'Subtitle', isDynamic: false, text: 'Certificate of Appreciation', x: 0.5, y: 0.35, font: "'Inter', sans-serif", size: 18, color: '#d4af37', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 2 },
      { id: 'f3', key: 'name', label: 'Participant Name', isDynamic: true, text: 'Roshan Jadhav', x: 0.5, y: 0.46, font: "'Playfair Display', serif", size: 56, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 3 },
      { id: 'f4', key: 'description', label: 'Description', isDynamic: false, text: 'This certificate is proudly presented to Roshan Jadhav\nin recognition of your dedication and valuable contribution.\nYour sincere efforts have made a remarkable difference.\nYour commitment and enthusiasm are truly appreciated.', x: 0.5, y: 0.59, font: "'Inter', sans-serif", size: 18, color: '#d4d4d8', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 4 },
      { id: 'f5', key: 'date', label: 'Date', isDynamic: true, text: '05-10-2026', x: 0.3, y: 0.78, font: "'Inter', sans-serif", size: 15, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 5 },
      { id: 'f6', key: 'signature', label: 'Signature', isDynamic: false, text: 'Authorized Signatory', x: 0.7, y: 0.78, font: "'Satisfy', cursive", size: 30, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 6 },
    ]
  },
  {
    id: 'event-attendance-05',
    name: 'Event Attendance Certificate',
    category: 'Events',
    description: 'Sleek monochromatic layout for tech summits, global conferences, and networking events.',
    background: '/certificates/certificate6.png',
    naturalW: 1920,
    naturalH: 1080,
    fields: [
      { id: 'f1', key: 'title', label: 'Title', isDynamic: false, text: 'Congratulations', x: 0.5, y: 0.22, font: "'Cinzel', serif", size: 48, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 1 },
      { id: 'f2', key: 'subtitle', label: 'Subtitle', isDynamic: false, text: 'Certificate of Appreciation', x: 0.5, y: 0.34, font: "'Inter', sans-serif", size: 18, color: '#a1a1aa', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 2 },
      { id: 'f3', key: 'name', label: 'Attendee Name', isDynamic: true, text: 'Roshan Jadhav', x: 0.5, y: 0.45, font: "'Playfair Display', serif", size: 54, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 3 },
      { id: 'f4', key: 'description', label: 'Description', isDynamic: false, text: 'This certificate is proudly presented to Roshan Jadhav\nin recognition of your dedication and valuable contribution.\nYour sincere efforts have made a remarkable difference.\nYour commitment and enthusiasm are truly appreciated.', x: 0.5, y: 0.58, font: "'Inter', sans-serif", size: 18, color: '#a1a1aa', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 4 },
      { id: 'f5', key: 'date', label: 'Date', isDynamic: true, text: '05-10-2026', x: 0.3, y: 0.78, font: "'Inter', sans-serif", size: 15, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 5 },
      { id: 'f6', key: 'signature', label: 'Signature', isDynamic: false, text: 'Authorized Signatory', x: 0.7, y: 0.78, font: "'Great Vibes', cursive", size: 34, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 6 },
    ]
  },
  {
    id: 'achievement-award-06',
    name: 'Excellence & Achievement Award',
    category: 'Awards',
    description: 'Prestigious award template for top performers, competition winners, and quarterly leaders.',
    background: '/certificates/certificate7.png',
    naturalW: 1920,
    naturalH: 1080,
    fields: [
      { id: 'f1', key: 'title', label: 'Title', isDynamic: false, text: 'Congratulations', x: 0.5, y: 0.21, font: "'Cinzel', serif", size: 54, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 1 },
      { id: 'f2', key: 'subtitle', label: 'Subtitle', isDynamic: false, text: 'Certificate of Appreciation', x: 0.5, y: 0.34, font: "'Raleway', sans-serif", size: 18, color: '#a1a1aa', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 2 },
      { id: 'f3', key: 'name', label: 'Winner Name', isDynamic: true, text: 'Roshan Jadhav', x: 0.5, y: 0.46, font: "'Playfair Display', serif", size: 58, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 3 },
      { id: 'f4', key: 'description', label: 'Description', isDynamic: false, text: 'This certificate is proudly presented to Roshan Jadhav\nin recognition of your dedication and valuable contribution.\nYour sincere efforts have made a remarkable difference.\nYour commitment and enthusiasm are truly appreciated.', x: 0.5, y: 0.60, font: "'EB Garamond', serif", size: 20, color: '#e4e4e7', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 4 },
      { id: 'f5', key: 'date', label: 'Date', isDynamic: true, text: '05-10-2026', x: 0.3, y: 0.78, font: "'Inter', sans-serif", size: 16, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 5 },
      { id: 'f6', key: 'signature', label: 'Signature', isDynamic: false, text: 'Authorized Signatory', x: 0.7, y: 0.78, font: "'Great Vibes', cursive", size: 34, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 6 },
    ]
  },
  {
    id: 'employee-recognition-07',
    name: 'Employee Recognition Certificate',
    category: 'Professional',
    description: 'Corporate employee appreciation certificate for quarterly performance, tenure, and leadership.',
    background: '/certificates/certificate5.png',
    naturalW: 1920,
    naturalH: 1080,
    fields: [
      { id: 'f1', key: 'title', label: 'Title', isDynamic: false, text: 'Congratulations', x: 0.5, y: 0.22, font: "'Raleway', sans-serif", size: 48, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 1 },
      { id: 'f2', key: 'subtitle', label: 'Subtitle', isDynamic: false, text: 'Certificate of Appreciation', x: 0.5, y: 0.34, font: "'Inter', sans-serif", size: 18, color: '#d4af37', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 2 },
      { id: 'f3', key: 'name', label: 'Employee Name', isDynamic: true, text: 'Roshan Jadhav', x: 0.5, y: 0.45, font: "'Playfair Display', serif", size: 56, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 3 },
      { id: 'f4', key: 'description', label: 'Description', isDynamic: false, text: 'This certificate is proudly presented to Roshan Jadhav\nin recognition of your dedication and valuable contribution.\nYour sincere efforts have made a remarkable difference.\nYour commitment and enthusiasm are truly appreciated.', x: 0.5, y: 0.58, font: "'Cormorant Garamond', serif", size: 20, color: '#d4d4d8', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 4 },
      { id: 'f5', key: 'date', label: 'Date', isDynamic: true, text: '05-10-2026', x: 0.3, y: 0.78, font: "'Inter', sans-serif", size: 15, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 5 },
      { id: 'f6', key: 'signature', label: 'Signature', isDynamic: false, text: 'Authorized Signatory', x: 0.7, y: 0.78, font: "'Satisfy', cursive", size: 30, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 6 },
    ]
  },
  {
    id: 'volunteer-appreciation-08',
    name: 'Volunteer Appreciation Certificate',
    category: 'Appreciation',
    description: 'Warm appreciation certificate for non-profits, community volunteers, and social initiatives.',
    background: '/certificates/certificate6.png',
    naturalW: 1920,
    naturalH: 1080,
    fields: [
      { id: 'f1', key: 'title', label: 'Title', isDynamic: false, text: 'Congratulations', x: 0.5, y: 0.22, font: "'Cinzel', serif", size: 48, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 1 },
      { id: 'f2', key: 'subtitle', label: 'Subtitle', isDynamic: false, text: 'Certificate of Appreciation', x: 0.5, y: 0.34, font: "'Inter', sans-serif", size: 18, color: '#a1a1aa', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 2 },
      { id: 'f3', key: 'name', label: 'Volunteer Name', isDynamic: true, text: 'Roshan Jadhav', x: 0.5, y: 0.45, font: "'Playfair Display', serif", size: 56, color: '#ffffff', bold: true, italic: false, align: 'center', locked: false, hidden: false, layer: 3 },
      { id: 'f4', key: 'description', label: 'Description', isDynamic: false, text: 'This certificate is proudly presented to Roshan Jadhav\nin recognition of your dedication and valuable contribution.\nYour sincere efforts have made a remarkable difference.\nYour commitment and enthusiasm are truly appreciated.', x: 0.5, y: 0.59, font: "'Inter', sans-serif", size: 18, color: '#e4e4e7', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 4 },
      { id: 'f5', key: 'date', label: 'Date', isDynamic: true, text: '05-10-2026', x: 0.3, y: 0.78, font: "'Inter', sans-serif", size: 15, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 5 },
      { id: 'f6', key: 'signature', label: 'Signature', isDynamic: false, text: 'Authorized Signatory', x: 0.7, y: 0.78, font: "'Great Vibes', cursive", size: 34, color: '#ffffff', bold: false, italic: false, align: 'center', locked: false, hidden: false, layer: 6 },
    ]
  }
];


