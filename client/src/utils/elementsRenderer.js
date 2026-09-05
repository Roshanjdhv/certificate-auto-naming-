// Canva-inspired Elements Catalog & Vector Rendering Engine for WiMailer

export const ELEMENT_CATALOG = {
  lines: [
    {
      id: 'line_straight',
      name: 'Straight Line',
      type: 'line',
      lineStyle: 'solid',
      strokeColor: '#d4af37',
      strokeWidth: 4,
      width: 300,
      height: 4,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12" /></svg>`
    },
    {
      id: 'line_dotted',
      name: 'Dotted Line',
      type: 'line',
      lineStyle: 'dotted',
      strokeColor: '#d4af37',
      strokeWidth: 4,
      width: 300,
      height: 4,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="1 3"><line x1="3" y1="12" x2="21" y2="12" /></svg>`
    },
    {
      id: 'line_dashed',
      name: 'Dashed Line',
      type: 'line',
      lineStyle: 'dashed',
      strokeColor: '#d4af37',
      strokeWidth: 4,
      width: 300,
      height: 4,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 3"><line x1="3" y1="12" x2="21" y2="12" /></svg>`
    },
    {
      id: 'line_arrow',
      name: 'Arrow',
      type: 'line',
      lineStyle: 'solid',
      hasArrowHead: true,
      strokeColor: '#ffffff',
      strokeWidth: 4,
      width: 260,
      height: 20,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12" /><polyline points="14 6 20 12 14 18" /></svg>`
    },
    {
      id: 'line_curved_arrow',
      name: 'Curved Arrow',
      type: 'line',
      lineStyle: 'solid',
      isCurved: true,
      hasArrowHead: true,
      strokeColor: '#ffffff',
      strokeWidth: 4,
      width: 260,
      height: 80,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 18 C 8 8, 16 8, 20 14" /><polyline points="14 14 20 14 20 8" /></svg>`
    }
  ],
  shapes: [
    {
      id: 'shape_circle',
      name: 'Circle',
      type: 'shape',
      shapeKind: 'circle',
      fillColor: 'rgba(212, 175, 55, 0.2)',
      strokeColor: '#d4af37',
      strokeWidth: 3,
      width: 140,
      height: 140,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /></svg>`
    },
    {
      id: 'shape_square',
      name: 'Square',
      type: 'shape',
      shapeKind: 'square',
      fillColor: 'rgba(255, 255, 255, 0.1)',
      strokeColor: '#ffffff',
      strokeWidth: 3,
      width: 140,
      height: 140,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="1" /></svg>`
    },
    {
      id: 'shape_rectangle',
      name: 'Rectangle',
      type: 'shape',
      shapeKind: 'rectangle',
      fillColor: 'rgba(255, 255, 255, 0.08)',
      strokeColor: '#e4e4e7',
      strokeWidth: 2,
      width: 220,
      height: 120,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="12" rx="1" /></svg>`
    },
    {
      id: 'shape_rounded_rect',
      name: 'Rounded Rectangle',
      type: 'shape',
      shapeKind: 'rounded_rect',
      cornerRadius: 16,
      fillColor: 'rgba(212, 175, 55, 0.15)',
      strokeColor: '#d4af37',
      strokeWidth: 3,
      width: 200,
      height: 110,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="12" rx="4" /></svg>`
    },
    {
      id: 'shape_triangle',
      name: 'Triangle',
      type: 'shape',
      shapeKind: 'triangle',
      fillColor: 'rgba(212, 175, 55, 0.2)',
      strokeColor: '#d4af37',
      strokeWidth: 3,
      width: 140,
      height: 130,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 4 21 20 3 20" /></svg>`
    },
    {
      id: 'shape_diamond',
      name: 'Diamond',
      type: 'shape',
      shapeKind: 'diamond',
      fillColor: 'rgba(255, 255, 255, 0.12)',
      strokeColor: '#ffffff',
      strokeWidth: 3,
      width: 130,
      height: 130,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 3 21 12 12 21 3 12" /></svg>`
    },
    {
      id: 'shape_hexagon',
      name: 'Hexagon',
      type: 'shape',
      shapeKind: 'hexagon',
      fillColor: 'rgba(212, 175, 55, 0.18)',
      strokeColor: '#d4af37',
      strokeWidth: 3,
      width: 140,
      height: 130,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5" /></svg>`
    },
    {
      id: 'shape_star',
      name: 'Star',
      type: 'shape',
      shapeKind: 'star',
      fillColor: '#d4af37',
      strokeColor: '#ffffff',
      strokeWidth: 2,
      width: 130,
      height: 130,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>`
    }
  ],
  decorations: [
    {
      id: 'deco_trophy',
      name: 'Trophy',
      type: 'decoration',
      decoKind: 'trophy',
      fillColor: '#d4af37',
      strokeColor: '#ffffff',
      strokeWidth: 2,
      width: 120,
      height: 140,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.45 1-1 1H7" /><path d="M14 14.66V17c0 .55.45 1 1 1h2" /><path d="M18 4H6v7a6 6 0 0 0 12 0V4z" /></svg>`
    },
    {
      id: 'deco_medal',
      name: 'Medal',
      type: 'decoration',
      decoKind: 'medal',
      fillColor: '#d4af37',
      strokeColor: '#ffffff',
      strokeWidth: 2,
      width: 110,
      height: 140,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="14" r="6" /><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" /><path d="M12 7v1" /></svg>`
    },
    {
      id: 'deco_badge',
      name: 'Award Badge',
      type: 'decoration',
      decoKind: 'badge',
      fillColor: '#d4af37',
      strokeColor: '#ffffff',
      strokeWidth: 2,
      width: 130,
      height: 150,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.75z" /></svg>`
    },
    {
      id: 'deco_ribbon',
      name: 'Ribbon',
      type: 'decoration',
      decoKind: 'ribbon',
      fillColor: '#d4af37',
      strokeColor: '#ffffff',
      strokeWidth: 2,
      width: 180,
      height: 80,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16l-2 4 2 4H4l2-4-2-4z" /></svg>`
    },
    {
      id: 'deco_crown',
      name: 'Crown',
      type: 'decoration',
      decoKind: 'crown',
      fillColor: '#d4af37',
      strokeColor: '#ffffff',
      strokeWidth: 2,
      width: 130,
      height: 100,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" /></svg>`
    },
    {
      id: 'deco_checkmark',
      name: 'Checkmark',
      type: 'decoration',
      decoKind: 'checkmark',
      fillColor: '#22c55e',
      strokeColor: '#ffffff',
      strokeWidth: 3,
      width: 110,
      height: 110,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></svg>`
    },
    {
      id: 'deco_heart',
      name: 'Heart',
      type: 'decoration',
      decoKind: 'heart',
      fillColor: '#ef4444',
      strokeColor: '#ffffff',
      strokeWidth: 2,
      width: 120,
      height: 110,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>`
    },
    {
      id: 'deco_plus',
      name: 'Plus',
      type: 'decoration',
      decoKind: 'plus',
      fillColor: '#ffffff',
      strokeColor: '#ffffff',
      strokeWidth: 4,
      width: 90,
      height: 90,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>`
    },
    {
      id: 'deco_cross',
      name: 'Cross',
      type: 'decoration',
      decoKind: 'cross',
      fillColor: '#ffffff',
      strokeColor: '#ffffff',
      strokeWidth: 4,
      width: 90,
      height: 90,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>`
    },
    {
      id: 'deco_dot',
      name: 'Dot',
      type: 'decoration',
      decoKind: 'dot',
      fillColor: '#d4af37',
      strokeColor: 'transparent',
      strokeWidth: 0,
      width: 50,
      height: 50,
      opacity: 100,
      rotation: 0,
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6" /></svg>`
    }
  ]
};

// Helper: Rounded Rectangle Path
function pathRoundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, Math.min(w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

// Helper: Polygon Path
function pathPolygon(ctx, points) {
  ctx.beginPath();
  points.forEach(([px, py], i) => {
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
}

// Helper: Star Path
function pathStar(ctx, cx, cy, spikes = 5, outerR = 50, innerR = 25) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerR;
    y = cy + Math.sin(rot) * outerR;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerR;
    y = cy + Math.sin(rot) * innerR;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
}

// Draw Canvas Element Routine (Line, Shape, Decoration, Text, Image)
export function drawCanvasElement(ctx, field, naturalW, naturalH, options = {}) {
  if (!field || field.hidden) return;

  const x = field.x * naturalW;
  const y = field.y * naturalH;
  const opacity = (field.opacity ?? 100) / 100;
  const rotation = (field.rotation || 0) * (Math.PI / 180);

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
  if (rotation !== 0) ctx.rotate(rotation);

  const strokeW = field.strokeWidth ?? field.lineWidth ?? 2;
  const strokeC = field.strokeColor || field.color || '#ffffff';
  const fillC = field.fillColor || 'transparent';

  // --- LINE ELEMENTS ---
  if (field.type === 'line') {
    const len = field.width || 300;
    const halfLen = len / 2;
    ctx.strokeStyle = strokeC;
    ctx.lineWidth = strokeW;

    // Line Style (solid, dashed, dotted)
    if (field.lineStyle === 'dashed') {
      ctx.setLineDash([strokeW * 3, strokeW * 2]);
    } else if (field.lineStyle === 'dotted') {
      ctx.setLineDash([strokeW, strokeW * 1.5]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    if (field.isCurved) {
      const arcH = Math.min(60, len * 0.25);
      ctx.moveTo(-halfLen, arcH / 2);
      ctx.quadraticCurveTo(0, -arcH, halfLen, arcH / 2);
    } else {
      ctx.moveTo(-halfLen, 0);
      ctx.lineTo(halfLen, 0);
    }
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Arrowhead tip
    if (field.hasArrowHead) {
      const arrowSize = Math.max(10, strokeW * 2.5);
      ctx.fillStyle = strokeC;
      ctx.beginPath();
      if (field.isCurved) {
        ctx.moveTo(halfLen + arrowSize, 0);
        ctx.lineTo(halfLen - arrowSize, -arrowSize * 0.8);
        ctx.lineTo(halfLen - arrowSize, arrowSize * 0.8);
      } else {
        ctx.moveTo(halfLen + arrowSize, 0);
        ctx.lineTo(halfLen - arrowSize, -arrowSize * 0.7);
        ctx.lineTo(halfLen - arrowSize, arrowSize * 0.7);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
  // --- SHAPE ELEMENTS ---
  else if (field.type === 'shape') {
    const w = field.width || 120;
    const h = field.height || 120;
    ctx.strokeStyle = strokeC;
    ctx.lineWidth = strokeW;
    ctx.fillStyle = fillC;

    const kind = field.shapeKind || 'rectangle';

    if (kind === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(w, h) / 2, 0, Math.PI * 2);
    } else if (kind === 'square' || kind === 'rectangle') {
      ctx.beginPath();
      ctx.rect(-w / 2, -h / 2, w, h);
    } else if (kind === 'rounded_rect') {
      pathRoundRect(ctx, -w / 2, -h / 2, w, h, field.cornerRadius || 16);
    } else if (kind === 'triangle') {
      pathPolygon(ctx, [[0, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]);
    } else if (kind === 'diamond') {
      pathPolygon(ctx, [[0, -h / 2], [w / 2, 0], [0, h / 2], [-w / 2, 0]]);
    } else if (kind === 'hexagon') {
      pathPolygon(ctx, [
        [0, -h / 2],
        [w / 2, -h / 4],
        [w / 2, h / 4],
        [0, h / 2],
        [-w / 2, h / 4],
        [-w / 2, -h / 4]
      ]);
    } else if (kind === 'star') {
      pathStar(ctx, 0, 0, 5, Math.min(w, h) / 2, Math.min(w, h) / 4);
    }

    if (fillC && fillC !== 'transparent') ctx.fill();
    if (strokeW > 0 && strokeC && strokeC !== 'transparent') ctx.stroke();
  }
  // --- DECORATION ELEMENTS ---
  else if (field.type === 'decoration') {
    const w = field.width || 120;
    const h = field.height || 120;
    const kind = field.decoKind || 'badge';

    ctx.strokeStyle = strokeC;
    ctx.lineWidth = strokeW;
    ctx.fillStyle = fillC;

    if (kind === 'trophy') {
      ctx.beginPath();
      ctx.moveTo(-w * 0.3, -h * 0.4);
      ctx.lineTo(w * 0.3, -h * 0.4);
      ctx.lineTo(w * 0.25, h * 0.05);
      ctx.bezierCurveTo(w * 0.2, h * 0.25, -w * 0.2, h * 0.25, -w * 0.25, h * 0.05);
      ctx.closePath();
      if (fillC !== 'transparent') ctx.fill();
      if (strokeW > 0) ctx.stroke();

      ctx.beginPath();
      ctx.arc(-w * 0.3, -h * 0.2, w * 0.12, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(w * 0.3, -h * 0.2, w * 0.12, Math.PI * 1.5, Math.PI * 0.5);
      if (strokeW > 0) ctx.stroke();

      ctx.beginPath();
      ctx.rect(-w * 0.08, h * 0.15, w * 0.16, h * 0.15);
      ctx.rect(-w * 0.3, h * 0.3, w * 0.6, h * 0.12);
      if (fillC !== 'transparent') ctx.fill();
      if (strokeW > 0) ctx.stroke();

    } else if (kind === 'medal') {
      ctx.beginPath();
      ctx.moveTo(-w * 0.2, -h * 0.4);
      ctx.lineTo(0, -h * 0.1);
      ctx.lineTo(w * 0.2, -h * 0.4);
      ctx.lineWidth = Math.max(3, strokeW * 1.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, h * 0.15, Math.min(w, h) * 0.3, 0, Math.PI * 2);
      if (fillC !== 'transparent') ctx.fill();
      if (strokeW > 0) ctx.stroke();

      pathStar(ctx, 0, h * 0.15, 5, Math.min(w, h) * 0.14, Math.min(w, h) * 0.07);
      ctx.fillStyle = strokeC;
      ctx.fill();

    } else if (kind === 'badge') {
      pathStar(ctx, 0, -h * 0.08, 12, Math.min(w, h) * 0.4, Math.min(w, h) * 0.34);
      if (fillC !== 'transparent') ctx.fill();
      if (strokeW > 0) ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-w * 0.18, h * 0.18);
      ctx.lineTo(-w * 0.25, h * 0.45);
      ctx.lineTo(-w * 0.12, h * 0.38);
      ctx.lineTo(0, h * 0.45);
      ctx.lineTo(w * 0.12, h * 0.38);
      ctx.lineTo(w * 0.25, h * 0.45);
      ctx.lineTo(w * 0.18, h * 0.18);
      ctx.closePath();
      if (fillC !== 'transparent') ctx.fill();
      if (strokeW > 0) ctx.stroke();

    } else if (kind === 'ribbon') {
      ctx.beginPath();
      ctx.moveTo(-w * 0.4, -h * 0.25);
      ctx.lineTo(w * 0.4, -h * 0.25);
      ctx.lineTo(w * 0.32, 0);
      ctx.lineTo(w * 0.4, h * 0.25);
      ctx.lineTo(-w * 0.4, h * 0.25);
      ctx.lineTo(-w * 0.32, 0);
      ctx.closePath();
      if (fillC !== 'transparent') ctx.fill();
      if (strokeW > 0) ctx.stroke();

    } else if (kind === 'crown') {
      ctx.beginPath();
      ctx.moveTo(-w * 0.4, -h * 0.3);
      ctx.lineTo(-w * 0.2, h * 0.1);
      ctx.lineTo(0, -h * 0.35);
      ctx.lineTo(w * 0.2, h * 0.1);
      ctx.lineTo(w * 0.4, -h * 0.3);
      ctx.lineTo(w * 0.35, h * 0.3);
      ctx.lineTo(-w * 0.35, h * 0.3);
      ctx.closePath();
      if (fillC !== 'transparent') ctx.fill();
      if (strokeW > 0) ctx.stroke();

    } else if (kind === 'checkmark') {
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(w, h) * 0.4, 0, Math.PI * 2);
      if (fillC !== 'transparent') ctx.fill();
      if (strokeW > 0) ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-w * 0.18, 0);
      ctx.lineTo(-w * 0.05, h * 0.14);
      ctx.lineTo(w * 0.18, -h * 0.14);
      ctx.lineWidth = Math.max(3, strokeW * 1.5);
      ctx.strokeStyle = strokeC === '#ffffff' ? '#ffffff' : strokeC;
      ctx.stroke();

    } else if (kind === 'heart') {
      ctx.beginPath();
      ctx.moveTo(0, h * 0.3);
      ctx.bezierCurveTo(-w * 0.5, -h * 0.1, -w * 0.5, -h * 0.4, 0, -h * 0.2);
      ctx.bezierCurveTo(w * 0.5, -h * 0.4, w * 0.5, -h * 0.1, 0, h * 0.3);
      ctx.closePath();
      if (fillC !== 'transparent') ctx.fill();
      if (strokeW > 0) ctx.stroke();

    } else if (kind === 'plus') {
      const arm = Math.min(w, h) * 0.35;
      ctx.lineWidth = Math.max(4, strokeW);
      ctx.beginPath();
      ctx.moveTo(0, -arm); ctx.lineTo(0, arm);
      ctx.moveTo(-arm, 0); ctx.lineTo(arm, 0);
      ctx.stroke();

    } else if (kind === 'cross') {
      const arm = Math.min(w, h) * 0.3;
      ctx.lineWidth = Math.max(4, strokeW);
      ctx.beginPath();
      ctx.moveTo(-arm, -arm); ctx.lineTo(arm, arm);
      ctx.moveTo(arm, -arm); ctx.lineTo(-arm, arm);
      ctx.stroke();

    } else if (kind === 'dot') {
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(w, h) * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = fillC !== 'transparent' ? fillC : strokeC;
      ctx.fill();
    }
  }

  ctx.restore();
}

// Bounding box helper for selection box and hit testing
export function getElementBounds(field, naturalW, naturalH, ctx, resolveValueFn) {
  const x = field.x * naturalW;
  const y = field.y * naturalH;
  let w = field.width || 120;
  let h = field.height || 120;

  if (field.type === 'line') {
    w = field.width || 300;
    h = Math.max(20, (field.strokeWidth || 4) * 4);
  } else if (field.type === 'text') {
    if (ctx && resolveValueFn) {
      const val = resolveValueFn(field.key);
      const tw = ctx.measureText(val).width;
      const th = (field.size || 40) * 1.3;
      w = tw;
      h = th;
    } else {
      w = (field.size || 40) * (field.key?.length || 10) * 0.6;
      h = (field.size || 40) * 1.3;
    }
  }

  return { x, y, w, h };
}
