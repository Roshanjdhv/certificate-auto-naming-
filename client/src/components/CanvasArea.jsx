import React, { useRef, useEffect, useState } from 'react';
import { buildFieldFont, defaultTypography } from '../utils/constants';
import { drawCanvasElement, getElementBounds } from '../utils/elementsRenderer';

function CanvasArea({ 
  image, naturalW, naturalH, scale, setScale,
  fields, setFields, activeFieldIdx, setActiveFieldIdx,
  excelData, excelColumns, previewRowIdx, editingRowIdx,
  rowOverrides, setRowOverrides, handleTemplateUpload
}) {
  const canvasRef = useRef(null);
  const imageCacheRef = useRef({});

  // Helper to resolve field text token against active preview row or sample defaults
  const resolveFieldValue = (fieldKey, previewRow) => {
    if (!fieldKey) return '';
    
    // Check if it's a dynamic tag like {{name}} or {{course}}
    let text = fieldKey;
    const sampleDefaults = {
      name: 'Roshan Jadhav',
      course: 'Certification Course',
      date: '05-10-2026',
      grade: 'Distinction (A+)',
      certificateId: 'CERT-2026-8942'
    };

    if (previewRow) {
      // Find matching column case-insensitively
      text = text.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
        const cleanKey = key.trim().toLowerCase();
        const foundCol = Object.keys(previewRow).find(k => k.toLowerCase().trim() === cleanKey);
        return foundCol && previewRow[foundCol] !== undefined ? previewRow[foundCol] : (sampleDefaults[cleanKey] || match);
      });

      // Handle raw column keys [ColumnName] or ColumnName
      if (text.startsWith('[') && text.endsWith(']')) {
        const colKey = text.slice(1, -1);
        return previewRow[colKey] || `[${colKey}]`;
      } else if (previewRow[fieldKey] !== undefined) {
        return previewRow[fieldKey];
      }
    } else {
      // No Excel file loaded - display sample default placeholders for tags
      text = text.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
        const cleanKey = key.trim().toLowerCase();
        return sampleDefaults[cleanKey] || match;
      });
      if (text.startsWith('[') && text.endsWith(']')) {
        const colName = text.slice(1, -1);
        return sampleDefaults[colName.toLowerCase()] || `[${colName}]`;
      }
    }

    return text;
  };

  const getEffectiveField = (baseField, rowIdx) => {
    const override = (rowIdx >= 0) ? rowOverrides[rowIdx]?.[baseField.key] : null;
    return override ? { ...baseField, ...override } : baseField;
  };

  // Keyboard Shortcuts (Delete, Duplicate, Nudge)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore keybindings if active element is being edited inside an input/textarea
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (activeFieldIdx < 0 || activeFieldIdx >= fields.length) return;

      const activeField = fields[activeFieldIdx];

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        const updated = fields.filter((_, idx) => idx !== activeFieldIdx);
        setFields(updated);
        setActiveFieldIdx(-1);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D' || e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        const dup = {
          ...JSON.parse(JSON.stringify(activeField)),
          id: 'elem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          x: Math.min(0.95, activeField.x + 0.03),
          y: Math.min(0.95, activeField.y + 0.03)
        };
        setFields([...fields, dup]);
        setActiveFieldIdx(fields.length);
      } else if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        const step = e.shiftKey ? 0.01 : 0.002;
        let dx = 0, dy = 0;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;

        const newFields = [...fields];
        newFields[activeFieldIdx] = {
          ...newFields[activeFieldIdx],
          x: Math.max(0, Math.min(1, newFields[activeFieldIdx].x + dx)),
          y: Math.max(0, Math.min(1, newFields[activeFieldIdx].y + dy))
        };
        setFields(newFields);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFieldIdx, fields, setFields, setActiveFieldIdx]);

  // Main Canvas Render Loop
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (canvas.width !== naturalW || canvas.height !== naturalH) {
      canvas.width = naturalW;
      canvas.height = naturalH;
    }

    const drawAll = () => {
      if (!canvasRef.current) return;
      ctx.clearRect(0, 0, naturalW, naturalH);
      if (image) {
        ctx.drawImage(image, 0, 0, naturalW, naturalH);
      } else {
        // Fallback: white canvas background when no image loaded
        ctx.fillStyle = 'var(--text)';
        ctx.fillRect(0, 0, naturalW, naturalH);
      }

      const previewRow = excelData[previewRowIdx] || null;

      fields.forEach((baseField, i) => {
        const field = getEffectiveField(baseField, previewRowIdx);

        // Skip rendering hidden elements
        if (field.hidden) return;

        const opacity = (field.opacity ?? 100) / 100;
        const rotation = (field.rotation || 0) * (Math.PI / 180);

        if (field.type === 'line' || field.type === 'shape' || field.type === 'decoration') {
          drawCanvasElement(ctx, field, naturalW, naturalH);
        } else {
          const x = field.x * naturalW;
          const y = field.y * naturalH;

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.translate(x, y);
          if (rotation !== 0) ctx.rotate(rotation);

          if (field.type === 'image' && field.src) {
            // Render Image Graphic
            let imgObj = imageCacheRef.current[field.src];
            if (!imgObj) {
              imgObj = new Image();
              imgObj.src = field.src;
              imgObj.onload = () => drawAll();
              imageCacheRef.current[field.src] = imgObj;
            }

            if (imgObj.complete) {
              const w = field.width || 120;
              const h = field.height || 120;
              ctx.drawImage(imgObj, -w / 2, -h / 2, w, h);
            }
          } else {
            // Render Text Element â€” supports multiline (\n) and auto word-wrap
            const value = resolveFieldValue(field.text || field.key, previewRow);
            ctx.font = buildFieldFont(field);
            ctx.fillStyle = field.color || 'var(--bg)';
            ctx.textAlign = field.align || 'center';
            ctx.textBaseline = 'middle';

            const lineHeight = (field.size || 40) * 1.35;
            const maxWidth = naturalW * 0.72; // wrap at 72% of canvas width

            // Split on explicit \n first, then word-wrap each segment
            const paragraphs = value.split('\n');
            const lines = [];
            for (const para of paragraphs) {
              const words = para.split(' ');
              let current = '';
              for (const word of words) {
                const test = current ? current + ' ' + word : word;
                if (ctx.measureText(test).width > maxWidth && current) {
                  lines.push(current);
                  current = word;
                } else {
                  current = test;
                }
              }
              lines.push(current);
            }

            const totalH = lines.length * lineHeight;
            const startY = -(totalH - lineHeight) / 2;
            lines.forEach((line, li) => {
              ctx.fillText(line, 0, startY + li * lineHeight);
            });
          }
          ctx.restore();
        }

        // Active Selection Box & Outline
        if (i === activeFieldIdx) {
          const x = field.x * naturalW;
          const y = field.y * naturalH;
          ctx.save();
          ctx.translate(x, y);
          if (rotation !== 0) ctx.rotate(rotation);

          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = Math.max(2, naturalW / 600);
          ctx.setLineDash([6, 4]);

          let w = field.width || 120;
          let h = field.height || 120;
          let x1 = -w / 2;

          if (field.type === 'line') {
            w = field.width || 300;
            h = Math.max(20, (field.strokeWidth || 4) * 4);
            x1 = -w / 2;
          } else if (field.type === 'text' || !field.type) {
            const value = resolveFieldValue(field.text || field.key, previewRow);
            ctx.font = buildFieldFont(field);
            const tw = ctx.measureText(value).width;
            const th = (field.size || 40) * 1.3;
            w = tw;
            h = th;
            if (field.align === 'center') x1 = -tw / 2;
            else if (field.align === 'left') x1 = 0;
            else x1 = -tw;
          }

          ctx.strokeRect(x1 - 8, -h / 2 - 8, w + 16, h + 16);

          // Draw Corner Resize Handle Dots
          ctx.setLineDash([]);
          ctx.fillStyle = 'var(--text)';
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          const handleSize = Math.max(8, naturalW / 240);

          const handles = [
            [x1 - 8, -h / 2 - 8],
            [x1 + w + 8, -h / 2 - 8],
            [x1 + w + 8, h / 2 + 8],
            [x1 - 8, h / 2 + 8]
          ];
          handles.forEach(([hx, hy]) => {
            ctx.fillRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
            ctx.strokeRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
          });

          ctx.restore();
        }
      });
    };

    drawAll();

    // Font loading trigger
    if (document.fonts) {
      fields.forEach(baseField => {
        if (baseField.type !== 'image') {
          const field = getEffectiveField(baseField, previewRowIdx);
          const fontSpec = buildFieldFont(field);
          document.fonts.load(fontSpec).then(() => drawAll()).catch(() => {});
        }
      });
      document.fonts.ready.then(() => drawAll());
    }

  }, [image, fields, activeFieldIdx, excelData, previewRowIdx, rowOverrides, naturalW, naturalH]);


  const [dragState, setDragState] = useState(null);

  const getPointerPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };
  };

  const handleMouseDown = (e) => {
    const pos = getPointerPos(e);
    let clickedIdx = -1;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Top-to-bottom hit testing
    for (let i = fields.length - 1; i >= 0; i--) {
      const field = fields[i];
      if (field.hidden) continue;

      const previewRow = excelData[previewRowIdx] || null;
      const effectiveField = getEffectiveField(field, previewRowIdx);
      
      const x = effectiveField.x;
      const y = effectiveField.y;

      let x1, x2, y1, y2;

      if (effectiveField.type === 'image') {
        const tw = (effectiveField.width || 120) / naturalW;
        const th = (effectiveField.height || 120) / naturalH;
        x1 = x - tw / 2;
        x2 = x + tw / 2;
        y1 = y - th / 2;
        y2 = y + th / 2;
      } else {
        const value = resolveFieldValue(effectiveField.key, previewRow);
        ctx.font = buildFieldFont(effectiveField);
        const tw = ctx.measureText(value).width / naturalW;
        const th = ((effectiveField.size || 40) * 1.4) / naturalH;
        
        if (effectiveField.align === 'center') { x1 = x - tw/2; x2 = x + tw/2; }
        else if (effectiveField.align === 'left') { x1 = x; x2 = x + tw; }
        else { x1 = x - tw; x2 = x; }
        y1 = y - th/2;
        y2 = y + th/2;
      }

      // Slightly enlarged hit area for easier selection
      if (pos.x >= x1 - 0.02 && pos.x <= x2 + 0.02 && pos.y >= y1 - 0.02 && pos.y <= y2 + 0.02) {
        clickedIdx = i;
        break;
      }
    }

    if (clickedIdx >= 0) {
      setActiveFieldIdx(clickedIdx);
      const clickedField = fields[clickedIdx];

      if (!clickedField.locked) {
        setDragState({
          active: true,
          startX: pos.x,
          startY: pos.y,
          initialX: clickedField.x,
          initialY: clickedField.y
        });
      } else {
        setDragState(null);
      }
    } else {
      setActiveFieldIdx(-1);
      setDragState(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!dragState || !dragState.active || activeFieldIdx < 0) return;
    const activeField = fields[activeFieldIdx];
    if (activeField?.locked) return;

    const pos = getPointerPos(e);
    const dx = pos.x - dragState.startX;
    const dy = pos.y - dragState.startY;
    
    const newFields = [...fields];
    newFields[activeFieldIdx] = {
      ...newFields[activeFieldIdx],
      x: Math.max(0, Math.min(1, dragState.initialX + dx)),
      y: Math.max(0, Math.min(1, dragState.initialY + dy))
    };
    setFields(newFields);
  };

  const handleMouseUp = () => {
    if (dragState) {
      setDragState({ ...dragState, active: false });
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const key = e.dataTransfer.getData('text/plain');
    if (!key) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const newField = { 
      id: 'field_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: 'text',
      key: `{{${key}}}`, 
      x, 
      y, 
      ...defaultTypography(),
      size: 40,
      font: "'Playfair Display', serif",
      color: '#111111',
      align: 'center',
      rotation: 0,
      opacity: 100,
      locked: false,
      hidden: false
    };
    setFields([...fields, newField]);
    setActiveFieldIdx(fields.length);
  };

  const onDragOver = (e) => e.preventDefault();

  const handleWheel = (e) => {
    // If Ctrl/Meta key is held OR no text field is selected, zoom the certificate scale
    if (e.ctrlKey || e.metaKey || activeFieldIdx < 0) {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05;
      setScale(s => Math.max(0.1, Math.min(3.0, Math.round((s + zoomDelta) * 100) / 100)));
    } else if (activeFieldIdx >= 0) {
      const activeField = fields[activeFieldIdx];
      if (activeField && activeField.type !== 'image') {
        e.preventDefault();
        const fontDelta = e.deltaY > 0 ? -2 : 2;
        const newFields = [...fields];
        const currentSize = newFields[activeFieldIdx].size || 40;
        newFields[activeFieldIdx] = {
          ...newFields[activeFieldIdx],
          size: Math.max(8, Math.min(300, currentSize + fontDelta))
        };
        setFields(newFields);
      }
    }
  };

  const fitToScreen = () => {
    if (!naturalW || !naturalH) return;
    const availW = (window.innerWidth - 380) * 0.85;
    const availH = (window.innerHeight - 120) * 0.85;
    const fitScale = Math.min(1, Math.max(0.1, Math.min(availW / naturalW, availH / naturalH)));
    setScale(Math.round(fitScale * 100) / 100);
  };

  return (
    <main className="canvas-wrap" onWheel={handleWheel}>
      {!image ? (
        <div id="certDropZone" className="cert-drop-zone">
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleTemplateUpload} />
          <div className="cert-drop-inner">
            <div className="cert-drop-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2.5" />
                <path d="M3 16l5-5 4 4 3-3 6 5.5" />
                <circle cx="8.5" cy="8.5" r="1.5" />
              </svg>
            </div>
            <div className="cert-drop-title">Drop your certificate background here</div>
            <div className="cert-drop-sub">Drag &amp; drop or click to browse custom image</div>
            <div className="cert-drop-formats">PNG &nbsp;Â·&nbsp; JPG &nbsp;Â·&nbsp; WebP</div>
          </div>
        </div>
      ) : (

        <>
          <button className="change-template-btn">
            Change Background
            <input type="file" accept="image/png,image/jpeg" onChange={handleTemplateUpload} style={{opacity:0, position:'absolute', inset:0}} />
          </button>
          
          <div 
            className="canvas-container" 
            onDoubleClick={fitToScreen}
            title="Double-click to Fit to Screen"
            style={{ 
              width: `${Math.round(naturalW * scale)}px`, 
              height: `${Math.round(naturalH * scale)}px`,
              background: 'transparent',
              position: 'relative'
            }}
          >
            <canvas 
              ref={canvasRef} 
              onDrop={onDrop} 
              onDragOver={onDragOver}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ 
                width: '100%', 
                height: '100%', 
                display: 'block',
                cursor: dragState?.active ? 'grabbing' : 'default' 
              }}
            />
          </div>

          <div className="zoom-controls">
            <button className="zoom-btn" onClick={() => setScale(s => Math.max(0.1, Math.round((s - 0.1) * 10) / 10))} title="Zoom Out (âˆ’)">âˆ’</button>
            <input 
              type="range" 
              min="10" 
              max="300" 
              value={Math.round(scale * 100)} 
              onChange={e => setScale(parseInt(e.target.value, 10) / 100)}
              className="zoom-slider" 
              title="Zoom Slider"
            />
            <button className="zoom-level" onClick={fitToScreen} title="Click to Fit to Screen">
              {Math.round(scale * 100)}%
            </button>
            <button className="zoom-btn" onClick={() => setScale(s => Math.min(3, Math.round((s + 0.1) * 10) / 10))} title="Zoom In (+)">+</button>
            <button className="zoom-btn text-btn" onClick={fitToScreen} title="Fit to Screen">Fit</button>
          </div>
        </>
      )}
    </main>
  );
}

export default CanvasArea;


