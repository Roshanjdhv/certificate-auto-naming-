import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FONTS, defaultTypography } from '../utils/constants';
import { ELEMENT_CATALOG } from '../utils/elementsRenderer';
import { 
  Download, Upload, Mail, Settings, Layout, Type, Move, 
  Edit3, Send, Check, X, Plus, Image as ImageIcon, Layers, 
  Lock, Unlock, Eye, EyeOff, Copy, Trash2, ArrowUp, ArrowDown, 
  Maximize2, Save, Sparkles, FolderOpen, Shapes, Minus, Award
} from 'lucide-react';

function Sidebar({ 
  open, fields, setFields, activeFieldIdx, setActiveFieldIdx,
  activeTab, setActiveTab,
  excelData, setExcelData, excelColumns, setExcelColumns,
  previewRowIdx, setPreviewRowIdx, editingRowIdx, setEditingRowIdx,
  rowOverrides, setRowOverrides, setSmtpModalOpen, setEmailModalOpen,
  handleDownloadPreview, handleDownloadZip,
  smtpConfig, emailDraft, isSending, sendProgress, sendLogs, handleSendEmails,
  onOpenGallery, onSaveTemplate
}) {
  // activeTab is controlled by parent (App.jsx) so it can be set on file upload / template select
  const [elementsSubCategory, setElementsSubCategory] = useState('all');
  const [addFieldText, setAddFieldText] = useState('');
  const [addTokenType, setAddTokenType] = useState('name');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (!rows.length) return alert('No data found in file');

        const normalise = obj => {
          const result = {};
          for (const k of Object.keys(obj)) result[k.toLowerCase().trim()] = String(obj[k]).trim();
          return result;
        };

        const parsed = rows.map(normalise);
        const allKeys = Object.keys(parsed[0]);
        const nameKey = allKeys.find(k => k.includes('name')) || allKeys[0];
        const emailKey = allKeys.find(k => k.includes('email')) || allKeys[1];

        setExcelColumns(allKeys);
        setExcelData(parsed.map(r => ({
          ...r,
          name: r[nameKey] || '',
          email: emailKey ? (r[emailKey] || '') : '',
        })));
        
        setPreviewRowIdx(0);
        setEditingRowIdx(-1);
        setRowOverrides({});
        
      } catch (err) {
        alert('Failed to parse file: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClearExcel = () => {
    setExcelData([]);
    setExcelColumns([]);
    setPreviewRowIdx(0);
    setEditingRowIdx(-1);
    setRowOverrides({});
  };

  // Drag start for Excel chips
  const onDragStart = (e, col) => {
    e.dataTransfer.setData('text/plain', col);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const activeField = activeFieldIdx >= 0 ? fields[activeFieldIdx] : null;

  const updateActiveField = (updates) => {
    if (activeFieldIdx < 0) return;
    const newFields = [...fields];
    newFields[activeFieldIdx] = { ...newFields[activeFieldIdx], ...updates };
    setFields(newFields);
  };

  // Add catalog element helper
  const handleAddCatalogElement = (catalogItem) => {
    const newElem = {
      id: 'elem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: catalogItem.type,
      key: catalogItem.name,
      shapeKind: catalogItem.shapeKind,
      decoKind: catalogItem.decoKind,
      lineStyle: catalogItem.lineStyle,
      hasArrowHead: catalogItem.hasArrowHead,
      isCurved: catalogItem.isCurved,
      strokeColor: catalogItem.strokeColor || 'var(--text)',
      fillColor: catalogItem.fillColor || 'transparent',
      strokeWidth: catalogItem.strokeWidth ?? 3,
      cornerRadius: catalogItem.cornerRadius ?? 16,
      x: 0.5,
      y: 0.5,
      width: catalogItem.width || 140,
      height: catalogItem.height || 140,
      opacity: 100,
      rotation: 0,
      locked: false,
      hidden: false
    };
    setFields([...fields, newElem]);
    setActiveFieldIdx(fields.length);
  };

  // Add field helpers
  const handleAddTokenField = (tokenKey) => {
    const isToken = !!tokenKey;
    const displayText = tokenKey
      ? { name: 'Roshan Jadhav', course: 'Certification Course', date: '05-10-2026', certificateId: 'CERT-2026-0001' }[tokenKey] || `{{${tokenKey}}}`
      : (addFieldText.trim() || 'Custom Text');
    const keyTag = isToken ? `{{${tokenKey}}}` : (addFieldText.trim() || 'Custom Text');
    const newField = {
      id: 'field_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: 'text',
      key: isToken ? tokenKey : keyTag,
      text: displayText,
      x: 0.5,
      y: 0.5,
      ...defaultTypography(),
      size: 44,
      font: "'Playfair Display', serif",
      color: 'var(--text)',
      bold: false,
      italic: false,
      align: 'center',
      rotation: 0,
      opacity: 100,
      locked: false,
      hidden: false
    };
    setFields([...fields, newField]);
    setActiveFieldIdx(fields.length);
    setAddFieldText('');
  };

  const handleAddImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      const img = new Image();
      img.onload = () => {
        const aspect = img.width / img.height;
        const newImgField = {
          id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          type: 'image',
          key: file.name.split('.')[0] || 'Image Element',
          src: dataUrl,
          x: 0.5,
          y: 0.5,
          width: 140,
          height: Math.round(140 / aspect),
          opacity: 100,
          rotation: 0,
          locked: false,
          hidden: false
        };
        setFields([...fields, newImgField]);
        setActiveFieldIdx(fields.length);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Layer management functions
  const moveLayer = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= fields.length) return;
    const updated = [...fields];
    const item = updated.splice(idx, 1)[0];
    updated.splice(targetIdx, 0, item);
    setFields(updated);
    if (activeFieldIdx === idx) setActiveFieldIdx(targetIdx);
    else if (activeFieldIdx === targetIdx) setActiveFieldIdx(idx);
  };

  const moveLayerToExtreme = (idx, position) => {
    if (fields.length <= 1) return;
    const updated = [...fields];
    const item = updated.splice(idx, 1)[0];
    if (position === 'top') updated.push(item);
    else updated.unshift(item);
    setFields(updated);
    setActiveFieldIdx(position === 'top' ? updated.length - 1 : 0);
  };

  const toggleLock = (idx) => {
    const updated = [...fields];
    updated[idx] = { ...updated[idx], locked: !updated[idx].locked };
    setFields(updated);
  };

  const toggleHide = (idx) => {
    const updated = [...fields];
    updated[idx] = { ...updated[idx], hidden: !updated[idx].hidden };
    setFields(updated);
  };

  const duplicateField = (idx) => {
    const item = fields[idx];
    const copy = {
      ...item,
      id: 'copy_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      x: Math.min(0.9, item.x + 0.04),
      y: Math.min(0.9, item.y + 0.04),
      key: item.key.startsWith('{{') ? item.key : `${item.key} (Copy)`
    };
    const updated = [...fields];
    updated.splice(idx + 1, 0, copy);
    setFields(updated);
    setActiveFieldIdx(idx + 1);
  };

  const deleteField = (idx) => {
    const updated = fields.filter((_, i) => i !== idx);
    setFields(updated);
    if (activeFieldIdx === idx) setActiveFieldIdx(-1);
    else if (activeFieldIdx > idx) setActiveFieldIdx(activeFieldIdx - 1);
  };

  return (
    <aside className="sidebar" id="sidebar" style={{ display: open ? 'flex' : 'none', flexDirection: 'column' }}>
      
      {/* Sidebar Top Quick Action Header */}
      <div className="sidebar-top-bar" style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
        <button 
          className="btn btn-outline" 
          onClick={onOpenGallery}
          style={{ flex: 1, padding: '7px 10px', fontSize: '12px', gap: '6px', justifyContent: 'center' }}
          title="Browse ready-made template library"
        >
          <FolderOpen size={14} /> Templates
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onSaveTemplate}
          style={{ flex: 1, padding: '7px 10px', fontSize: '12px', gap: '6px', justifyContent: 'center', background: 'var(--text)', color: 'var(--bg)', fontWeight: 600 }}
          title="Save current layout as a reusable template"
        >
          <Save size={14} /> Save Template
        </button>
      </div>

      {/* Nav Tabs */}
      <div className="sidebar-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
        <button 
          className={`sidebar-tab-btn ${activeTab === 'elements' ? 'active' : ''}`}
          onClick={() => setActiveTab('elements')}
          style={{ flex: 1, padding: '10px 4px', fontSize: '12px', fontWeight: 600, background: activeTab === 'elements' ? 'var(--surface2)' : 'transparent', color: activeTab === 'elements' ? 'var(--text)' : 'var(--text-muted)', border: 'none', borderBottom: activeTab === 'elements' ? '2px solid var(--text)' : 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Shapes size={14} />
          <span>Elements</span>
        </button>

        <button 
          className={`sidebar-tab-btn ${activeTab === 'layers' ? 'active' : ''}`}
          onClick={() => setActiveTab('layers')}
          style={{ flex: 1, padding: '10px 4px', fontSize: '12px', fontWeight: 600, background: activeTab === 'layers' ? 'var(--surface2)' : 'transparent', color: activeTab === 'layers' ? 'var(--text)' : 'var(--text-muted)', border: 'none', borderBottom: activeTab === 'layers' ? '2px solid var(--text)' : 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Layers size={14} />
          <span>Layers ({fields.length})</span>
        </button>

        <button 
          className={`sidebar-tab-btn ${activeTab === 'excel' ? 'active' : ''}`}
          onClick={() => setActiveTab('excel')}
          style={{ flex: 1, padding: '10px 4px', fontSize: '12px', fontWeight: 600, background: activeTab === 'excel' ? 'var(--surface2)' : 'transparent', color: activeTab === 'excel' ? 'var(--text)' : 'var(--text-muted)', border: 'none', borderBottom: activeTab === 'excel' ? '2px solid var(--text)' : 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Upload size={14} />
          <span>Data ({excelData.length})</span>
        </button>

        <button 
          className={`sidebar-tab-btn ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
          style={{ flex: 1, padding: '10px 4px', fontSize: '12px', fontWeight: 600, background: activeTab === 'export' ? 'var(--surface2)' : 'transparent', color: activeTab === 'export' ? 'var(--text)' : 'var(--text-muted)', border: 'none', borderBottom: activeTab === 'export' ? '2px solid var(--text)' : 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Send size={14} />
          <span>Export</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="sidebar-content-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 14px' }}>

        {/* TAB 1: ELEMENTS & PROPERTIES */}
        {activeTab === 'elements' && (
          <>
            {/* 1. CONTEXTUAL ELEMENT INSPECTOR PANEL (PROPERTY CONTROLS AT TOP) */}
            <div className="section" style={{ marginBottom: '16px' }}>
              <div className="section-title">
                <Type size={14} /> Element Inspector
                <span className={`active-field-label ${activeField ? 'has-field' : ''}`}>
                  {activeField ? (activeField.text || activeField.key || activeField.type || 'Selected') : 'no selection'}
                </span>
              </div>

              {!activeField ? (
                <div className="empty-state" style={{ padding: '16px 12px', textAlign: 'center', background: 'var(--surface2)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                  <Move size={20} style={{ color: 'var(--text-muted)', marginBottom: '6px', opacity: 0.6 }} />
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Click any element on canvas to edit font, size, colors &amp; properties</p>
                </div>
              ) : (
                <>
                  {/* Text Content Editor â€” live canvas update */}
                  {(activeField.type === 'text' || !activeField.type) && (
                    <div className="field" style={{ marginBottom: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>Text Content</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400 }}>Enter = new line</span>
                      </label>
                      <textarea
                        value={activeField.text || activeField.key || ''}
                        onChange={e => updateActiveField({ text: e.target.value })}
                        onKeyDown={e => {
                          // Allow Enter key to insert line break (don't submit)
                          if (e.key === 'Enter') {
                            e.stopPropagation();
                            // Let the default textarea behaviour insert \n
                          }
                        }}
                        rows={activeField.key === 'description' || (activeField.text || '').includes('\n') || (activeField.text || '').length > 60 ? 5 : 2}
                        placeholder="Type text content here..."
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          background: 'var(--surface2)',
                          color: 'var(--text)',
                          fontSize: '13px',
                          resize: 'vertical',
                          lineHeight: 1.5,
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  )}

                  {/* Element key/token label (small, secondary) */}
                  <div className="field" style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>Field Key / Token</label>
                    <input 
                      type="text" 
                      value={activeField.key || ''} 
                      onChange={e => updateActiveField({ key: e.target.value })}
                      placeholder="e.g. name, title, {{name}}"
                      style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-muted)', fontSize: '11px' }}
                    />
                  </div>

                  {/* 1. LINE CONTROLS */}
                  {activeField.type === 'line' && (
                    <>
                      <div className="row">
                        <div className="field">
                          <label>Line Thickness</label>
                          <input type="number" value={activeField.strokeWidth ?? 4} onChange={e => updateActiveField({ strokeWidth: parseInt(e.target.value) || 1 })} min="1" max="50" />
                        </div>
                        <div className="field">
                          <label>Line Length (px)</label>
                          <input type="number" value={activeField.width ?? 300} onChange={e => updateActiveField({ width: parseInt(e.target.value) || 20 })} min="20" max="1200" />
                        </div>
                      </div>

                      <div className="row" style={{ marginTop: '8px' }}>
                        <div className="field">
                          <label>Line Style</label>
                          <select 
                            value={activeField.lineStyle || 'solid'} 
                            onChange={e => updateActiveField({ lineStyle: e.target.value })}
                            style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)' }}
                          >
                            <option value="solid">Solid Line</option>
                            <option value="dashed">Dashed Line</option>
                            <option value="dotted">Dotted Line</option>
                          </select>
                        </div>

                        <div className="field">
                          <label>Line Color</label>
                          <div className="color-row">
                            <input type="color" value={activeField.strokeColor || '#d4af37'} onChange={e => updateActiveField({ strokeColor: e.target.value })} />
                            <input type="text" value={activeField.strokeColor || '#d4af37'} onChange={e => updateActiveField({ strokeColor: e.target.value })} maxLength="7" />
                          </div>
                        </div>
                      </div>

                      <div className="row" style={{ marginTop: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text)', cursor: 'pointer' }}>
                          <input type="checkbox" checked={!!activeField.hasArrowHead} onChange={e => updateActiveField({ hasArrowHead: e.target.checked })} />
                          Arrowhead Tip
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text)', cursor: 'pointer' }}>
                          <input type="checkbox" checked={!!activeField.isCurved} onChange={e => updateActiveField({ isCurved: e.target.checked })} />
                          Curved Arc
                        </label>
                      </div>
                    </>
                  )}

                  {/* 2. SHAPE & DECORATION CONTROLS */}
                  {(activeField.type === 'shape' || activeField.type === 'decoration') && (
                    <>
                      <div className="row">
                        <div className="field">
                          <label>Fill Color</label>
                          <div className="color-row">
                            <input type="color" value={activeField.fillColor === 'transparent' ? 'var(--bg)' : (activeField.fillColor || '#d4af37')} onChange={e => updateActiveField({ fillColor: e.target.value })} />
                            <button 
                              className={`toggle-btn ${activeField.fillColor === 'transparent' ? 'active' : ''}`}
                              onClick={() => updateActiveField({ fillColor: activeField.fillColor === 'transparent' ? '#d4af37' : 'transparent' })}
                              style={{ fontSize: '10px', padding: '2px 6px' }}
                              title="Toggle No Fill (Transparent)"
                            >
                              {activeField.fillColor === 'transparent' ? 'None' : 'Color'}
                            </button>
                          </div>
                        </div>

                        <div className="field">
                          <label>Border Color</label>
                          <div className="color-row">
                            <input type="color" value={activeField.strokeColor === 'transparent' ? 'var(--bg)' : (activeField.strokeColor || 'var(--text)')} onChange={e => updateActiveField({ strokeColor: e.target.value })} />
                            <button 
                              className={`toggle-btn ${activeField.strokeColor === 'transparent' ? 'active' : ''}`}
                              onClick={() => updateActiveField({ strokeColor: activeField.strokeColor === 'transparent' ? 'var(--text)' : 'transparent' })}
                              style={{ fontSize: '10px', padding: '2px 6px' }}
                              title="Toggle Border Color"
                            >
                              {activeField.strokeColor === 'transparent' ? 'None' : 'Border'}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="row" style={{ marginTop: '8px' }}>
                        <div className="field">
                          <label>Width (px)</label>
                          <input type="number" value={activeField.width || 120} onChange={e => updateActiveField({ width: parseInt(e.target.value) || 10 })} min="10" max="1200" />
                        </div>
                        <div className="field">
                          <label>Height (px)</label>
                          <input type="number" value={activeField.height || 120} onChange={e => updateActiveField({ height: parseInt(e.target.value) || 10 })} min="10" max="1200" />
                        </div>
                      </div>

                      <div className="row" style={{ marginTop: '8px' }}>
                        <div className="field">
                          <label>Border Thickness</label>
                          <input type="number" value={activeField.strokeWidth ?? 2} onChange={e => updateActiveField({ strokeWidth: parseInt(e.target.value) || 0 })} min="0" max="50" />
                        </div>
                        {activeField.shapeKind === 'rounded_rect' && (
                          <div className="field">
                            <label>Corner Radius</label>
                            <input type="number" value={activeField.cornerRadius ?? 16} onChange={e => updateActiveField({ cornerRadius: parseInt(e.target.value) || 0 })} min="0" max="100" />
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* 3. TEXT CONTROLS */}
                  {(activeField.type === 'text' || !activeField.type) && (
                    <>
                      {/* Font Family */}
                      <div className="field">
                        <label>Font Family</label>
                        <select 
                          value={activeField.font || "'Inter', sans-serif"} 
                          onChange={e => updateActiveField({ font: e.target.value })}
                          style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontFamily: activeField.font || 'sans-serif' }}
                        >
                          {FONTS.map(f => <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>)}
                        </select>
                      </div>

                      {/* Font Size & Color */}
                      <div className="row">
                        <div className="field">
                          <label>Size (px)</label>
                          <input type="number" value={activeField.size || 40} onChange={e => updateActiveField({ size: parseInt(e.target.value) || 10 })} min="8" max="400" />
                        </div>
                        <div className="field">
                          <label>Color</label>
                          <div className="color-row">
                            <input type="color" value={activeField.color || 'var(--bg)'} onChange={e => updateActiveField({ color: e.target.value })} />
                            <input type="text" value={activeField.color || 'var(--bg)'} onChange={e => updateActiveField({ color: e.target.value })} placeholder="#hex" maxLength="7" />
                          </div>
                        </div>
                      </div>

                      {/* Alignment & Style toggles */}
                      <div className="row" style={{ marginTop: '8px' }}>
                        <div className="field" style={{ flex: 1 }}>
                          <label>Style</label>
                          <div className="btn-group">
                            <button className={`toggle-btn ${activeField.bold ? 'active' : ''}`} onClick={() => updateActiveField({ bold: !activeField.bold })}><b>B</b></button>
                            <button className={`toggle-btn ${activeField.italic ? 'active' : ''}`} onClick={() => updateActiveField({ italic: !activeField.italic })}><i>I</i></button>
                          </div>
                        </div>

                        <div className="field" style={{ flex: 1 }}>
                          <label>Align</label>
                          <div className="btn-group">
                            <button className={`toggle-btn ${activeField.align === 'left' ? 'active' : ''}`} onClick={() => updateActiveField({ align: 'left' })}>L</button>
                            <button className={`toggle-btn ${activeField.align === 'center' ? 'active' : ''}`} onClick={() => updateActiveField({ align: 'center' })}>C</button>
                            <button className={`toggle-btn ${activeField.align === 'right' ? 'active' : ''}`} onClick={() => updateActiveField({ align: 'right' })}>R</button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* 4. IMAGE CONTROLS */}
                  {activeField.type === 'image' && (
                    <div className="row">
                      <div className="field">
                        <label>Width (px)</label>
                        <input type="number" value={activeField.width || 120} onChange={e => updateActiveField({ width: parseInt(e.target.value) || 20 })} min="10" max="1000" />
                      </div>
                      <div className="field">
                        <label>Height (px)</label>
                        <input type="number" value={activeField.height || 120} onChange={e => updateActiveField({ height: parseInt(e.target.value) || 20 })} min="10" max="1000" />
                      </div>
                    </div>
                  )}

                  {/* Common Properties: Rotation & Opacity */}
                  <div className="row" style={{ marginTop: '8px' }}>
                    <div className="field">
                      <label>Rotation (Â°)</label>
                      <input type="number" value={activeField.rotation || 0} onChange={e => updateActiveField({ rotation: parseInt(e.target.value) || 0 })} min="-360" max="360" />
                    </div>
                    <div className="field">
                      <label>Opacity (%)</label>
                      <input type="range" min="0" max="100" value={activeField.opacity ?? 100} onChange={e => updateActiveField({ opacity: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 2. CANVAS DESIGN ELEMENTS CATALOG PANEL */}
            <div className="section" style={{ background: 'var(--surface2)', borderRadius: '12px', padding: '12px', marginBottom: '16px', border: '1px solid var(--border)' }}>
              <div className="section-title" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> Add Design Elements
              </div>

              {/* QUICK TEXT & MEDIA INSERTION (FIRST) */}
              <div style={{ paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                <div className="field" style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>Quick Insert Text Tokens</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '4px' }}>
                    <button className="btn btn-outline" style={{ padding: '5px', fontSize: '11px', justifyContent: 'center' }} onClick={() => handleAddTokenField('name')}>+ Name Tag</button>
                    <button className="btn btn-outline" style={{ padding: '5px', fontSize: '11px', justifyContent: 'center' }} onClick={() => handleAddTokenField('course')}>+ Course Tag</button>
                    <button className="btn btn-outline" style={{ padding: '5px', fontSize: '11px', justifyContent: 'center' }} onClick={() => handleAddTokenField('date')}>+ Date Tag</button>
                    <button className="btn btn-outline" style={{ padding: '5px', fontSize: '11px', justifyContent: 'center' }} onClick={() => handleAddTokenField('certificateId')}>+ Cert ID Tag</button>
                  </div>
                </div>

                <div className="field" style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input 
                      type="text" 
                      placeholder="Add custom text..." 
                      value={addFieldText}
                      onChange={(e) => setAddFieldText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTokenField('')}
                      style={{ flex: 1, padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                    />
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleAddTokenField('')}>Add</button>
                  </div>
                </div>

                <label className="btn btn-outline" style={{ display: 'flex', width: '100%', justifyContent: 'center', gap: '6px', cursor: 'pointer', padding: '6px', fontSize: '12px' }}>
                  <ImageIcon size={14} /> Upload Image / Signature
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={handleAddImageUpload} style={{ display: 'none' }} />
                </label>
              </div>

              {/* Sub-category Pill Buttons */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'lines', label: 'Lines' },
                  { id: 'shapes', label: 'Shapes' },
                  { id: 'decorations', label: 'Decorations' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setElementsSubCategory(sub.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      border: elementsSubCategory === sub.id ? '1px solid var(--text)' : '1px solid var(--border)',
                      background: elementsSubCategory === sub.id ? 'var(--text)' : 'rgba(255,255,255,0.04)',
                      color: elementsSubCategory === sub.id ? 'var(--bg)' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* LINES SECTION */}
              {(elementsSubCategory === 'all' || elementsSubCategory === 'lines') && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Minus size={12} /> Lines &amp; Dividers
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {ELEMENT_CATALOG.lines.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleAddCatalogElement(item)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justify: 'center',
                          padding: '10px 4px',
                          background: 'var(--surface2)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title={`Add ${item.name}`}
                      >
                        <span dangerouslySetInnerHTML={{ __html: item.iconSvg }} style={{ width: 22, height: 22, display: 'grid', placeItems: 'center', marginBottom: 4 }} />
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SHAPES SECTION */}
              {(elementsSubCategory === 'all' || elementsSubCategory === 'shapes') && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Shapes size={12} /> Basic Shapes
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {ELEMENT_CATALOG.shapes.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleAddCatalogElement(item)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justify: 'center',
                          padding: '8px 4px',
                          background: 'var(--surface2)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title={`Add ${item.name}`}
                      >
                        <span dangerouslySetInnerHTML={{ __html: item.iconSvg }} style={{ width: 20, height: 20, display: 'grid', placeItems: 'center', marginBottom: 4 }} />
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* DECORATIONS SECTION */}
              {(elementsSubCategory === 'all' || elementsSubCategory === 'decorations') && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Award size={12} /> Badges &amp; Icons
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {ELEMENT_CATALOG.decorations.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleAddCatalogElement(item)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justify: 'center',
                          padding: '8px 4px',
                          background: 'var(--surface2)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title={`Add ${item.name}`}
                      >
                        <span dangerouslySetInnerHTML={{ __html: item.iconSvg }} style={{ width: 20, height: 20, display: 'grid', placeItems: 'center', marginBottom: 4 }} />
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. LAYERING ORDER & ACTIONS AT BOTTOM */}
            {activeField && (
              <div className="section" style={{ background: 'var(--surface2)', borderRadius: '12px', padding: '12px', border: '1px solid var(--border)' }}>
                <div className="field" style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>Layering Order</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginTop: '4px' }}>
                    <button className="btn btn-outline" style={{ padding: '5px', fontSize: '10px', justifyContent: 'center' }} onClick={() => moveLayerToExtreme(activeFieldIdx, 'top')} title="Bring to Front">Front</button>
                    <button className="btn btn-outline" style={{ padding: '5px', fontSize: '10px', justifyContent: 'center' }} onClick={() => moveLayer(activeFieldIdx, 1)} title="Bring Forward">Up</button>
                    <button className="btn btn-outline" style={{ padding: '5px', fontSize: '10px', justifyContent: 'center' }} onClick={() => moveLayer(activeFieldIdx, -1)} title="Send Backward">Down</button>
                    <button className="btn btn-outline" style={{ padding: '5px', fontSize: '10px', justifyContent: 'center' }} onClick={() => moveLayerToExtreme(activeFieldIdx, 'bottom')} title="Send to Back">Back</button>
                  </div>
                </div>

                {/* Quick Element Action Controls */}
                <div className="btn-group-action" style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-outline" style={{ flex: 1, padding: '6px', fontSize: '11px', gap: '4px', justifyContent: 'center' }} onClick={() => toggleLock(activeFieldIdx)}>
                    {activeField.locked ? <Lock size={13} /> : <Unlock size={13} />} {activeField.locked ? 'Unlock' : 'Lock'}
                  </button>
                  <button className="btn btn-outline" style={{ flex: 1, padding: '6px', fontSize: '11px', gap: '4px', justifyContent: 'center' }} onClick={() => toggleHide(activeFieldIdx)}>
                    {activeField.hidden ? <EyeOff size={13} /> : <Eye size={13} />} {activeField.hidden ? 'Show' : 'Hide'}
                  </button>
                  <button className="btn btn-outline" style={{ flex: 1, padding: '6px', fontSize: '11px', gap: '4px', justifyContent: 'center' }} onClick={() => duplicateField(activeFieldIdx)}>
                    <Copy size={13} /> Copy
                  </button>
                  <button className="btn chip-btn danger" style={{ padding: '6px 10px', fontSize: '11px' }} onClick={() => deleteField(activeFieldIdx)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 2: LAYERS MANAGEMENT */}
        {activeTab === 'layers' && (
          <div className="section">
            <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><Layers size={14} /> Canvas Layers</span>
              <span className="name-count">{fields.length} items</span>
            </div>

            {!fields.length ? (
              <p className="field-hint" style={{ textAlign: 'center', padding: '20px' }}>No elements on canvas</p>
            ) : (
              <div className="layers-list" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                {fields.map((field, idx) => (
                  <div 
                    key={field.id || idx}
                    className={`layer-item ${idx === activeFieldIdx ? 'active' : ''}`}
                    onClick={() => setActiveFieldIdx(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: idx === activeFieldIdx ? 'var(--surface2)' : 'var(--bg)',
                      border: idx === activeFieldIdx ? '1px solid var(--text)' : '1px solid var(--border)',
                      cursor: 'pointer',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', width: '16px' }}>{fields.length - idx}</span>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {field.key || 'Element'}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {field.type === 'image' ? 'Image Graphic' : `Text Â· ${field.size || 40}px`}
                      </div>
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} onClick={e => e.stopPropagation()}>
                      <button className="icon-btn" onClick={() => moveLayer(idx, -1)} disabled={idx === 0} title="Bring Forward">
                        <ArrowUp size={13} />
                      </button>
                      <button className="icon-btn" onClick={() => moveLayer(idx, 1)} disabled={idx === fields.length - 1} title="Send Backward">
                        <ArrowDown size={13} />
                      </button>
                      <button className="icon-btn" onClick={() => toggleLock(idx)} title={field.locked ? 'Unlock' : 'Lock'}>
                        {field.locked ? <Lock size={13} style={{ color: '#ef4444' }} /> : <Unlock size={13} />}
                      </button>
                      <button className="icon-btn" onClick={() => toggleHide(idx)} title={field.hidden ? 'Show' : 'Hide'}>
                        {field.hidden ? <EyeOff size={13} style={{ color: '#ef4444' }} /> : <Eye size={13} />}
                      </button>
                      <button className="icon-btn danger" onClick={() => deleteField(idx)} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EXCEL / CSV DATA IMPORT */}
        {activeTab === 'excel' && (
          <>
            <div className="section">
              <div className="section-title">
                <Upload size={14} /> Excel / CSV Importer
                {excelData.length > 0 && <span className="name-count">{excelData.length} rows</span>}
              </div>
              
              {!excelData.length ? (
                <div className="field">
                  <label>Upload recipient sheet (.xlsx / .csv)</label>
                  <div className="upload-area">
                    <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
                    <div className="upload-inner">
                      <Upload size={24} />
                      <span>Click to upload or drag & drop file</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div id="excelPreviewWrap">
                  <div className="excel-preview-header">
                    <span>Loaded ({excelData.length} entries)</span>
                    <button className="chip-btn danger" onClick={handleClearExcel}>Clear Sheet</button>
                  </div>
                  <div className="excel-table-wrap" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <table className="excel-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          {excelColumns.slice(0,4).map(c => <th key={c}>{c}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {excelData.map((row, i) => (
                          <tr 
                            key={i} 
                            className={i === previewRowIdx ? 'active' : ''}
                            onClick={() => { setPreviewRowIdx(i); setEditingRowIdx(i); }}
                          >
                            <td>{i + 1}</td>
                            {excelColumns.slice(0,4).map(c => <td key={c}>{row[c] || 'â€”'}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {excelColumns.length > 0 && (
              <div className="section">
                <div className="section-title">
                  <Layout size={14} /> Excel Column Chips
                </div>
                <p className="field-hint" style={{ marginBottom: 10 }}>Drag column chip onto canvas to map data</p>
                <div className="column-chips">
                  {excelColumns.map(col => (
                    <div 
                      key={col} 
                      className="col-chip" 
                      draggable 
                      onDragStart={(e) => onDragStart(e, col)}
                      onClick={() => handleAddTokenField(col)}
                      title="Click or drag onto canvas"
                    >
                      <Move size={11} /> {col}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 4: EXPORT & EMAIL */}
        {activeTab === 'export' && (
          <>
            <div className="section">
              <div className="section-title">
                <Download size={14} /> Download Files
              </div>
              <div className="btn-group-action" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn btn-outline" type="button" onClick={handleDownloadPreview}>
                  <Download size={15} /> Download Active Preview PNG
                </button>
                <button className="btn btn-success" disabled={!excelData.length || !fields.length} onClick={handleDownloadZip}>
                  <Download size={15} /> Download All ({excelData.length || 0}) as ZIP
                </button>
              </div>
            </div>

            <div className="section">
              <div className="section-title">
                <Mail size={14} /> Send via Email (SMTP)
                <span className={`smtp-status-badge ${smtpConfig?.host && smtpConfig?.user ? 'configured' : 'unconfigured'}`}>
                  {smtpConfig?.host && smtpConfig?.user ? 'Configured' : 'Not set'}
                </span>
              </div>

              <div className="btn-group-action" style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn btn-outline" type="button" onClick={() => setSmtpModalOpen(true)}>
                  <Settings size={14} /> Setup SMTP Server
                </button>
                <button className="btn compose-btn" type="button" onClick={() => setEmailModalOpen(true)}>
                  <Edit3 size={14} /> Compose Email Body & Subject
                </button>
                <div className="compose-summary" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Subject: {emailDraft?.subject ? emailDraft.subject : 'No subject set'}
                </div>
              </div>

              <div className="btn-group-action" style={{ marginTop: 12 }}>
                <button 
                  className="btn btn-email" 
                  type="button"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={!excelData.length || isSending}
                  onClick={handleSendEmails}
                >
                  <Send size={15} /> Dispatch Batch Emails
                </button>

                {(isSending || (sendProgress && sendProgress.percent > 0)) && (
                  <div className={`progress-wrap ${isSending || (sendProgress && sendProgress.percent > 0) ? 'visible' : ''}`} style={{ marginTop: '10px' }}>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${sendProgress?.percent || 0}%` }}></div>
                    </div>
                    <div className="progress-label">{sendProgress?.label || 'Sendingâ€¦'}</div>
                  </div>
                )}

                {sendLogs && sendLogs.length > 0 && (
                  <div className="email-log" style={{ display: 'block', marginTop: '10px', maxHeight: '160px', overflowY: 'auto' }}>
                    {sendLogs.map(log => (
                      <div key={log.id} className={`log-row ${log.ok ? 'ok' : 'fail'}`}>
                        {log.ok ? <Check size={12} /> : <X size={12} />}
                        <span>{log.name}</span>
                        <small>{log.email}</small>
                        {log.errMsg && <small className="err">{log.errMsg}</small>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </aside>
  );
}

export default Sidebar;


