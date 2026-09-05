import React, { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import CanvasArea from './components/CanvasArea';
import Modals from './components/Modals';
import HowToUse from './components/HowToUse';
import LandingPage from './components/LandingPage';
import TemplatesGallery from './components/TemplatesGallery';

import JSZip from 'jszip';
import { buildFieldFont } from './utils/constants';
import { generateTemplateBackground, PRESET_TEMPLATES } from './utils/templatesData';
import { drawCanvasElement } from './utils/elementsRenderer';
import { FolderOpen, ArrowLeft, Save, Sparkles, LayoutGrid } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const initialView = () => {
    const hash = window.location.hash;
    if (hash === '#templates' || hash === '#gallery') return 'gallery';
    if (hash === '#studio') return 'studio';
    return 'landing';
  };

  const [currentView, setCurrentView] = useState(initialView); // 'landing', 'gallery', 'studio'

  const navigateToView = (view) => {
    setCurrentView(view);
    if (view === 'gallery') {
      if (window.location.hash !== '#templates') {
        window.location.hash = 'templates';
      }
    } else if (view === 'studio') {
      if (window.location.hash !== '#studio') {
        window.location.hash = 'studio';
      }
    } else if (view === 'landing') {
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  };

  // App State
  const [image, setImage] = useState(null);
  const [bgDataUrl, setBgDataUrl] = useState(null);
  const [naturalW, setNaturalW] = useState(1920);
  const [naturalH, setNaturalH] = useState(1080);
  const [scale, setScale] = useState(0.55);
  const [fields, setFields] = useState([]);
  const [activeFieldIdx, setActiveFieldIdx] = useState(-1);
  const [currentTemplateTitle, setCurrentTemplateTitle] = useState('Custom Design');
  const [sidebarTab, setSidebarTab] = useState('elements'); // lifted from Sidebar
  
  const [excelData, setExcelData] = useState([]);
  const [excelColumns, setExcelColumns] = useState([]);
  const [previewRowIdx, setPreviewRowIdx] = useState(0);
  const [editingRowIdx, setEditingRowIdx] = useState(-1);
  const [rowOverrides, setRowOverrides] = useState({});

  const [smtpConfig, setSmtpConfig] = useState(null);
  const [smtpModalOpen, setSmtpModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [saveCertModalOpen, setSaveCertModalOpen] = useState(false);
  const [emailDraft, setEmailDraft] = useState({ subject: '', bodyHtml: '' });

  const [customTemplates, setCustomTemplates] = useState([]);

  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState({ current: 0, total: 0, percent: 0, label: '' });
  const [sendLogs, setSendLogs] = useState([]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  // Body scroll control
  useEffect(() => {
    if (currentView === 'landing' || currentView === 'gallery') {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.height = 'auto';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, [currentView]);

  // Load custom templates, SMTP, and draft from localStorage
  useEffect(() => {
    try {
      const savedCustom = JSON.parse(localStorage.getItem('cert_custom_templates') || '[]');
      setCustomTemplates(savedCustom);
    } catch (_) {}

    try {
      const savedSmtp = JSON.parse(localStorage.getItem('certgen_smtp') || 'null');
      if (savedSmtp) setSmtpConfig(savedSmtp);
    } catch (_) {}

    try {
      const savedDraft = JSON.parse(localStorage.getItem('cert_email_draft') || 'null');
      if (savedDraft) setEmailDraft(savedDraft);
    } catch (_) {}
  }, []);

  // URL Popstate & Hash Navigation
  useEffect(() => {
    const checkUrl = () => {
      const hash = window.location.hash;
      const isHowToUse = window.location.pathname.includes('how-to-use') || hash === '#how-to-use';
      setShowHowToUse(isHowToUse);

      if (hash === '#templates' || hash === '#gallery') {
        setCurrentView('gallery');
      } else if (hash === '#studio') {
        setCurrentView('studio');
      } else if (hash === '#home' || hash === '#landing') {
        setCurrentView('landing');
      }
    };
    checkUrl();
    window.addEventListener('popstate', checkUrl);
    window.addEventListener('hashchange', checkUrl);
    return () => {
      window.removeEventListener('popstate', checkUrl);
      window.removeEventListener('hashchange', checkUrl);
    };
  }, []);

  const openHowToUse = (e) => {
    if (e) e.preventDefault();
    window.history.pushState({ page: 'howToUse' }, '', '/how-to-use.html');
    setShowHowToUse(true);
  };

  const closeHowToUse = (e) => {
    if (e) e.preventDefault();
    window.history.pushState({ page: 'editor' }, '', '/');
    setShowHowToUse(false);
  };

  const handleFileObjectUpload = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      // Clear all previous canvas state before loading new image
      setFields([]);
      setActiveFieldIdx(-1);
      setRowOverrides({});

      setImage(img);
      setBgDataUrl(url);
      setNaturalW(img.width);
      setNaturalH(img.height);
      const availW = (window.innerWidth - 380) * 0.85;
      const availH = (window.innerHeight - 120) * 0.85;
      const fitScale = Math.min(1, Math.max(0.2, Math.min(availW / img.width, availH / img.height)));
      setScale(fitScale);
      setCurrentTemplateTitle(file.name.split('.')[0] || 'Custom Certificate');
      setSidebarTab('excel'); // auto-switch sidebar to Data tab on image upload
      navigateToView('studio');
    };
    img.src = url;
  };

  const handleTemplateUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileObjectUpload(file);
  };

  // Select template from gallery
  const handleSelectTemplate = (template) => {
    if (!template) return;
    setCurrentTemplateTitle(template.name);

    // Reset all previous canvas state immediately
    setFields([]);
    setActiveFieldIdx(-1);
    setRowOverrides({});
    setSidebarTab('elements'); // auto-switch sidebar to Elements tab on template select

    let backgroundUrl = template.bgUrl || template.background;
    const themeKey = template.bgStyle || template.themeStyle;
    if (themeKey) {
      backgroundUrl = generateTemplateBackground(themeKey, 1920, 1080);
    }

    if (backgroundUrl) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setBgDataUrl(backgroundUrl);
        setNaturalW(img.width || 1920);
        setNaturalH(img.height || 1080);
        
        // Deep clone template fields (fresh copy, no stale state)
        const tplFields = JSON.parse(JSON.stringify(template.fields || []));
        setFields(tplFields);
        setActiveFieldIdx(-1);

        const availW = (window.innerWidth - 380) * 0.85;
        const availH = (window.innerHeight - 120) * 0.85;
        const fitScale = Math.min(1, Math.max(0.2, Math.min(availW / (img.width || 1920), availH / (img.height || 1080))));
        setScale(fitScale);

        navigateToView('studio');
      };
      img.src = backgroundUrl;
    }
  };

  // Save active setup as custom template
  const handleConfirmSaveCertTemplate = ({ name, category, description }) => {
    const newCustomTpl = {
      id: 'custom_' + Date.now(),
      name,
      category,
      description,
      background: bgDataUrl || (image ? image.src : null),
      fields: fields,
      isCustom: true
    };

    const updated = [newCustomTpl, ...customTemplates];
    setCustomTemplates(updated);
    try {
      localStorage.setItem('cert_custom_templates', JSON.stringify(updated));
      alert(`Template "${name}" saved successfully to "My Templates"!`);
    } catch (e) {
      alert('Failed to save to localStorage: storage full');
    }
  };

  // Delete custom template
  const handleDeleteCustomTemplate = (id) => {
    if (!window.confirm('Delete this custom template?')) return;
    const updated = customTemplates.filter(t => t.id !== id);
    setCustomTemplates(updated);
    localStorage.setItem('cert_custom_templates', JSON.stringify(updated));
  };

  // Token replacement helper for canvas export
  const resolveFieldValue = (fieldKey, previewRow) => {
    if (!fieldKey) return '';
    let text = fieldKey;
    const sampleDefaults = {
      name: 'Roshan Jadhav',
      course: 'Certification Course',
      date: '05-10-2026',
      grade: 'Distinction (A+)',
      certificateId: 'CERT-2026-8942'
    };

    if (previewRow) {
      text = text.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
        const cleanKey = key.trim().toLowerCase();
        const foundCol = Object.keys(previewRow).find(k => k.toLowerCase().trim() === cleanKey);
        return foundCol && previewRow[foundCol] !== undefined ? previewRow[foundCol] : (sampleDefaults[cleanKey] || match);
      });
      if (text.startsWith('[') && text.endsWith(']')) {
        const colKey = text.slice(1, -1);
        return previewRow[colKey] || `[${colKey}]`;
      } else if (previewRow[fieldKey] !== undefined) {
        return previewRow[fieldKey];
      }
    } else {
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

  // Render full resolution certificate image for export
  const getBlob = async (rowIdx) => {
    if (!image) return null;

    if (document.fonts) {
      await Promise.all(
        fields.map(baseField => {
          if (baseField.type !== 'image') {
            const override = (rowIdx >= 0) ? rowOverrides[rowIdx]?.[baseField.key] : null;
            const field = override ? { ...baseField, ...override } : baseField;
            return document.fonts.load(buildFieldFont(field)).catch(() => {});
          }
          return Promise.resolve();
        })
      );
    }

    const canvas = document.createElement('canvas');
    canvas.width = naturalW;
    canvas.height = naturalH;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, naturalW, naturalH);
    
    const row = (rowIdx >= 0) ? excelData[rowIdx] : null;
    
    for (const baseField of fields) {
      const override = (rowIdx >= 0) ? rowOverrides[rowIdx]?.[baseField.key] : null;
      const field = override ? { ...baseField, ...override } : baseField;

      if (field.hidden) continue;

      const x = field.x * naturalW;
      const y = field.y * naturalH;
      const opacity = (field.opacity ?? 100) / 100;
      const rotation = (field.rotation || 0) * (Math.PI / 180);

      if (field.type === 'line' || field.type === 'shape' || field.type === 'decoration') {
        drawCanvasElement(ctx, field, naturalW, naturalH);
      } else if (field.type === 'image' && field.src) {
        await new Promise(resolve => {
          const imgObj = new Image();
          imgObj.onload = () => {
            const w = field.width || 120;
            const h = field.height || 120;
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.translate(x, y);
            if (rotation !== 0) ctx.rotate(rotation);
            ctx.drawImage(imgObj, -w / 2, -h / 2, w, h);
            ctx.restore();
            resolve();
          };
          imgObj.onerror = () => resolve();
          imgObj.src = field.src;
        });
      } else {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(x, y);
        if (rotation !== 0) ctx.rotate(rotation);
        const value = resolveFieldValue(field.text || field.key, row);
        ctx.font = buildFieldFont(field);
        ctx.fillStyle = field.color || '#000000';
        ctx.textAlign = field.align || 'center';
        ctx.textBaseline = 'middle';

        // Multiline support: split on \n then word-wrap
        const lineHeight = (field.size || 40) * 1.35;
        const maxWidth = naturalW * 0.72;
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
        ctx.restore();
      }
    }
    
    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const esc = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const applyVariables = (template, rowData) => {
    const nameKey = Object.keys(rowData).find(k => k.toLowerCase().includes('name')) || Object.keys(rowData)[0];
    const emailKey = Object.keys(rowData).find(k => k.toLowerCase().includes('email')) || '';
    const name = rowData[nameKey] || '';
    const email = rowData[emailKey] || '';
    const firstName = String(name).trim().split(/\s+/)[0] || '';
    const enriched = { ...rowData, firstName, name, email };
    let result = template;
    for (const [key, val] of Object.entries(enriched)) {
      result = result.replace(new RegExp(`\\{\\{${escapeRegex(key)}\\}\\}`, 'g'), String(val || ''));
    }
    return result;
  };

  const applyVariablesHtml = (htmlTemplate, rowData) => {
    const nameKey = Object.keys(rowData).find(k => k.toLowerCase().includes('name')) || Object.keys(rowData)[0];
    const emailKey = Object.keys(rowData).find(k => k.toLowerCase().includes('email')) || '';
    const name = rowData[nameKey] || '';
    const email = rowData[emailKey] || '';
    const firstName = String(name).trim().split(/\s+/)[0] || '';
    const enriched = { ...rowData, firstName, name, email };
    let result = htmlTemplate;
    for (const [key, val] of Object.entries(enriched)) {
      result = result.replace(new RegExp(`\\{\\{${escapeRegex(key)}\\}\\}`, 'g'), esc(String(val || '')));
    }
    return result;
  };

  const HAS_TAGS = /<[a-z][\s\S]*?>/i;
  const P_STYLE = 'margin:0 0 1em 0';

  const plainTextToHtml = (text) => {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const lines = escaped.split('\n');
    const paragraphs = [];
    let cur = [];
    for (const line of lines) {
      if (line === '') {
        if (cur.length) { paragraphs.push(cur.join('<br>')); cur = []; }
      } else {
        cur.push(line);
      }
    }
    if (cur.length) paragraphs.push(cur.join('<br>'));
    return paragraphs.map(p => `<p style="${P_STYLE}">${p}</p>`).join('');
  };

  const normaliseBodyHtml = (raw) => {
    if (!HAS_TAGS.test(raw)) {
      return plainTextToHtml(raw);
    }
    const s1 = raw.replace(/<\/div>\s*<div>\s*<br\s*\/?>\s*<\/div>\s*<div>/gi, '§P§');
    const s2 = s1.replace(/<\/div>\s*<div>/gi, '<br>');
    const s3 = s2.replace(/<\/?div>/gi, '');
    const paragraphs = s3.split('§P§');
    return paragraphs.map(p => `<p style="${P_STYLE}">${p}</p>`).join('');
  };

  const buildEmailHtml = (bodyHtml) => {
    const content = normaliseBodyHtml(bodyHtml);
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#000000;line-height:1.5;background:#ffffff">${content}</body></html>`;
  };

  const handleSendEmails = async () => {
    if (!excelData.length) { alert('No Excel data loaded'); return; }
    if (!smtpConfig || !smtpConfig.host) { alert('Please setup SMTP first'); setSmtpModalOpen(true); return; }
    if (!smtpConfig.user || !smtpConfig.pass) { alert('Please enter your SMTP credentials'); setSmtpModalOpen(true); return; }
    if (!image) { alert('Upload a certificate template first'); return; }

    const recipients = excelData.filter(r => {
      const emailKey = Object.keys(r).find(k => k.toLowerCase().includes('email'));
      return emailKey && r[emailKey] && String(r[emailKey]).trim().length > 0;
    });

    if (!recipients.length) {
      alert('No email addresses found in Excel data (make sure your Excel file has an "email" column)');
      return;
    }

    const confirmed = window.confirm(`Send ${recipients.length} certificate email${recipients.length > 1 ? 's' : ''} via SMTP?\n\nHost: ${smtpConfig.host}\nFrom: ${smtpConfig.user}`);
    if (!confirmed) return;

    setIsSending(true);
    setSendLogs([]);
    setSendProgress({ current: 0, total: recipients.length, percent: 0, label: `Starting dispatch…` });

    const subjectTpl = emailDraft?.subject?.trim() || 'Your Certificate';
    const bodyTpl = emailDraft?.bodyHtml?.trim() || 'Hi {{firstName}},<br><br>Please find your certificate attached.';
    const apiUrl = 'http://localhost:3001/api/send-email';

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < recipients.length; i++) {
      const rowData = recipients[i];
      const dataIdx = excelData.indexOf(rowData);
      const nameKey = Object.keys(rowData).find(k => k.toLowerCase().includes('name')) || Object.keys(rowData)[0];
      const emailKey = Object.keys(rowData).find(k => k.toLowerCase().includes('email'));
      const name = rowData[nameKey] || `Recipient ${i + 1}`;
      const email = rowData[emailKey];

      const pct = Math.round(((i + 1) / recipients.length) * 100);
      setSendProgress({
        current: i + 1,
        total: recipients.length,
        percent: pct,
        label: `Sending ${i + 1} / ${recipients.length}: ${name}`
      });

      try {
        const blob = await getBlob(dataIdx);
        const base64 = await blobToBase64(blob);
        const finalSubject = applyVariables(subjectTpl, rowData);
        const finalHtml = buildEmailHtml(applyVariablesHtml(bodyTpl, rowData));
        const filename = `${String(name).replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').slice(0, 60) || 'certificate'}_certificate.png`;

        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            smtp: smtpConfig,
            to: email,
            subject: finalSubject,
            html: finalHtml,
            attachmentBase64: base64,
            filename
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: res.statusText }));
          throw new Error(errData.error || res.statusText);
        }

        successCount++;
        setSendLogs(prev => [...prev, { id: Date.now() + i, name, email, ok: true }]);
      } catch (err) {
        failCount++;
        setSendLogs(prev => [...prev, { id: Date.now() + i, name, email, ok: false, errMsg: err.message }]);
      }

      await new Promise(r => setTimeout(r, 200));
    }

    setSendProgress({
      current: recipients.length,
      total: recipients.length,
      percent: 100,
      label: `Done — ${successCount} sent, ${failCount} failed`
    });

    setTimeout(() => {
      setIsSending(false);
    }, 4000);
  };

  const handleDownloadPreview = async () => {
    if (!image) return alert('Upload or select a certificate template first.');
    const blob = await getBlob(previewRowIdx);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTemplateTitle.replace(/\s+/g, '_')}_preview.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    if (!image || !excelData.length || !fields.length) return alert('No data to download.');
    const zip = new JSZip();
    for (let i = 0; i < excelData.length; i++) {
      const blob = await getBlob(i);
      if (blob) {
        const row = excelData[i];
        const nameKey = Object.keys(row).find(k => k.toLowerCase().includes('name')) || Object.keys(row)[0];
        const name = row[nameKey] || `cert_${i+1}`;
        zip.file(`${name}.png`, blob);
      }
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTemplateTitle.replace(/\s+/g, '_')}_batch.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage 
          onUploadCertificate={handleFileObjectUpload}
          onSelectTemplate={(name) => navigateToView('gallery')}
          onOpenGallery={() => navigateToView('gallery')}
          onOpenStudio={() => navigateToView('studio')}
          onOpenHowToUse={openHowToUse}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {currentView === 'gallery' && (
        <TemplatesGallery 
          customTemplates={customTemplates}
          onSelectTemplate={handleSelectTemplate}
          onDeleteCustomTemplate={handleDeleteCustomTemplate}
          onBackToHome={() => navigateToView('landing')}
          onOpenBlankStudio={() => {
            // Load a default clean template with default content
            const defaultTpl = {
              name: 'Blank Certificate Canvas',
              bgStyle: 'classic-gold',
              fields: [
                { id: 'f1', type: 'text', key: 'title', text: 'Congratulations', x: 0.5, y: 0.22, font: "'Cinzel', serif", size: 52, color: '#ffffff', bold: true, align: 'center' },
                { id: 'f2', type: 'text', key: 'subtitle', text: 'Certificate of Appreciation', x: 0.5, y: 0.35, font: "'Inter', sans-serif", size: 18, color: '#d4af37', bold: true, align: 'center' },
                { id: 'f3', type: 'text', key: 'name', text: 'Roshan Jadhav', x: 0.5, y: 0.46, font: "'Playfair Display', serif", size: 56, color: '#ffffff', bold: true, align: 'center' },
                { id: 'f4', type: 'text', key: 'description', text: 'This certificate is proudly presented to Roshan Jadhav in recognition of your dedication, valuable contribution, and sincere efforts. Your commitment and enthusiasm are truly appreciated.', x: 0.5, y: 0.59, font: "'Cormorant Garamond', serif", size: 20, color: '#e4e4e7', bold: false, align: 'center' },
                { id: 'f5', type: 'text', key: 'date', text: '05-10-2026', x: 0.3, y: 0.78, font: "'Inter', sans-serif", size: 16, color: '#ffffff', bold: false, align: 'center' },
                { id: 'f6', type: 'text', key: 'signature', text: 'Authorized Signatory', x: 0.7, y: 0.78, font: "'Great Vibes', cursive", size: 36, color: '#d4af37', bold: false, align: 'center' }
              ]
            };
            handleSelectTemplate(defaultTpl);
          }}
        />
      )}

      {currentView === 'studio' && (
        <>
          <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-muted)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => navigateToView('landing')}
              style={{ background: 'var(--surface2)', border: '1px solid var(--border-muted)', color: 'var(--text)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}
              title="Return to Home Landing Page"
            >
              <ArrowLeft size={14} /> Home
            </button>

            <button 
              onClick={() => navigateToView('gallery')}
              style={{ background: 'var(--surface2)', border: '1px solid var(--border-muted)', color: 'var(--text)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}
              title="Browse Template Gallery"
            >
              <LayoutGrid size={14} /> Templates Gallery
            </button>

            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'var(--surface2)', border: '1px solid var(--border-muted)', color: 'var(--text)', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Toggle Sidebar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text)' }}>WiMailer Studio</h1>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', borderLeft: '1px solid var(--border-muted)', paddingLeft: '8px' }}>{currentTemplateTitle}</span>
            </div>

            <div style={{ flex: 1 }}></div>

            <button 
              onClick={() => setSaveCertModalOpen(true)}
              style={{ background: 'var(--accent)', color: 'var(--bg)', border: 'none', padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Save size={14} /> Save Template
            </button>

            <a 
              href="/how-to-use.html" 
              onClick={openHowToUse}
              style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '12px', fontWeight: 500, background: 'var(--surface2)', border: '1px solid var(--border-muted)', padding: '7px 12px', borderRadius: '6px' }}
            >
              How to Use
            </a>

            <button 
              onClick={toggleTheme}
              style={{ background: 'var(--surface2)', border: '1px solid var(--border-muted)', color: 'var(--text)', padding: '7px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </header>

          <div className="app">
            <Sidebar 
              open={sidebarOpen}
              activeTab={sidebarTab}
              setActiveTab={setSidebarTab}
              fields={fields}
              setFields={setFields}
              activeFieldIdx={activeFieldIdx}
              setActiveFieldIdx={setActiveFieldIdx}
              excelData={excelData}
              setExcelData={setExcelData}
              excelColumns={excelColumns}
              setExcelColumns={setExcelColumns}
              previewRowIdx={previewRowIdx}
              setPreviewRowIdx={setPreviewRowIdx}
              editingRowIdx={editingRowIdx}
              setEditingRowIdx={setEditingRowIdx}
              rowOverrides={rowOverrides}
              setRowOverrides={setRowOverrides}
              setSmtpModalOpen={setSmtpModalOpen}
              setEmailModalOpen={setEmailModalOpen}
              handleDownloadPreview={handleDownloadPreview}
              handleDownloadZip={handleDownloadZip}
              smtpConfig={smtpConfig}
              emailDraft={emailDraft}
              isSending={isSending}
              sendProgress={sendProgress}
              sendLogs={sendLogs}
              handleSendEmails={handleSendEmails}
              onOpenGallery={() => setCurrentView('gallery')}
              onSaveTemplate={() => setSaveCertModalOpen(true)}
            />

            <CanvasArea 
              image={image}
              naturalW={naturalW}
              naturalH={naturalH}
              scale={scale}
              setScale={setScale}
              fields={fields}
              setFields={setFields}
              activeFieldIdx={activeFieldIdx}
              setActiveFieldIdx={setActiveFieldIdx}
              excelData={excelData}
              excelColumns={excelColumns}
              previewRowIdx={previewRowIdx}
              editingRowIdx={editingRowIdx}
              rowOverrides={rowOverrides}
              setRowOverrides={setRowOverrides}
              handleTemplateUpload={handleTemplateUpload}
            />
          </div>

          <Modals 
            smtpModalOpen={smtpModalOpen}
            setSmtpModalOpen={setSmtpModalOpen}
            emailModalOpen={emailModalOpen}
            setEmailModalOpen={setEmailModalOpen}
            smtpConfig={smtpConfig}
            setSmtpConfig={setSmtpConfig}
            emailDraft={emailDraft}
            setEmailDraft={setEmailDraft}
            excelColumns={excelColumns}
            saveCertModalOpen={saveCertModalOpen}
            setSaveCertModalOpen={setSaveCertModalOpen}
            onConfirmSaveCertTemplate={handleConfirmSaveCertTemplate}
          />
        </>
      )}

      {showHowToUse && (
        <HowToUse 
          onClose={closeHowToUse} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
      )}
    </>
  );
}

export default App;

