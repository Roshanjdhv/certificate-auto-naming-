import React, { useState, useEffect, useMemo } from 'react';
import { TEMPLATE_CATEGORIES, PRESET_TEMPLATES, generateTemplateBackground } from '../utils/templatesData';
import { Search, Sparkles, Eye, ArrowRight, Trash2, Copy, Edit2, Plus, Bookmark, Check } from 'lucide-react';

function TemplatesGallery({ onSelectTemplate, onOpenStudio, onBackToLanding, onBackToHome, customTemplates = [], onDeleteCustomTemplate, onRenameCustomTemplate }) {
  const handleBack = onBackToHome || onBackToLanding || (() => window.location.hash = '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [renderedBackgrounds, setRenderedBackgrounds] = useState({});

  // Merge presets and custom user templates
  const allTemplates = useMemo(() => {
    return [...PRESET_TEMPLATES, ...customTemplates];
  }, [customTemplates]);

  // Pre-render background preview data URLs for presets
  useEffect(() => {
    const bgMap = {};
    PRESET_TEMPLATES.forEach(tpl => {
      if (!tpl.background) {
        bgMap[tpl.id] = generateTemplateBackground(tpl.themeStyle || 'classic-gold', 960, 540);
      }
    });
    setRenderedBackgrounds(bgMap);
  }, []);

  // Filter templates by Category and Search Query
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter(tpl => {
      const matchesCategory =
        selectedCategory === 'All'
          ? true
          : selectedCategory === 'My Templates'
          ? tpl.isCustom
          : tpl.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() ||
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tpl.description && tpl.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [allTemplates, selectedCategory, searchQuery]);

  const handleUseTemplate = (tpl) => {
    let bgUrl = tpl.background;
    if (!bgUrl) {
      bgUrl = generateTemplateBackground(tpl.themeStyle || 'classic-gold', tpl.naturalW || 1920, tpl.naturalH || 1080);
    }
    onSelectTemplate({
      ...tpl,
      bgUrl
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      
      {/* HEADER NAVBAR */}
      <header style={{ position: 'sticky', top: 0, zIndex: 90, background: 'var(--surface-translucent)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', height: 72, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={handleBack}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--text)', display: 'grid', placeItems: 'center', boxShadow: '0 0 20px var(--shadow-sm)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: 'var(--bg)' }}>workspace_premium</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>CertFlow</span>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', background: 'var(--surface3)', padding: '3px 10px', borderRadius: 999, border: '1px solid var(--border)' }}>Template Library</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button 
              onClick={handleBack} 
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              &larr; Back to Home
            </button>
            <button 
              onClick={onOpenStudio} 
              style={{ background: 'var(--text)', border: 'none', color: 'var(--bg)', padding: '10px 22px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(255,255,255,0.18)' }}
            >
              Open Blank Canvas &rarr;
            </button>
          </div>
        </div>
      </header>

      {/* HERO / SEARCH BANNER */}
      <section style={{ padding: '48px 32px 32px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#e4e4e7', marginBottom: 16 }}>
            <Sparkles size={14} /> 100% Fully Editable Canvas Templates
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.035em', margin: '0 0 12px', color: 'var(--text)' }}>
            Choose a Certificate Template
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
            Select any template to customize text, fonts, colors, dynamic fields, and logos in the CertFlow canvas editor.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div style={{ maxWidth: '640px', margin: '0 auto 32px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
          <input
            type="text"
            placeholder="Search certificate templates by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: 52,
              padding: '0 20px 0 52px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              color: 'var(--text)',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              boxShadow: '0 8px 24px var(--shadow-sm)'
            }}
          />
        </div>

        {/* CATEGORY TABS */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
          {TEMPLATE_CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat;
            const count = cat === 'All' ? allTemplates.length : cat === 'My Templates' ? customTemplates.length : allTemplates.filter(t => t.category.toLowerCase() === cat.toLowerCase()).length;
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 18px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--text)' : '1px solid var(--border)',
                  background: isActive ? 'var(--text)' : 'var(--surface2)',
                  color: isActive ? 'var(--bg)' : 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
              >
                {cat === 'My Templates' && <Bookmark size={13} />}
                {cat}
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 999, background: isActive ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)', color: isActive ? 'var(--bg)' : 'var(--text-muted)' }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* TEMPLATES GRID */}
        {filteredTemplates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', maxWidth: 600, margin: '0 auto' }}>
            <Bookmark size={36} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>No Templates Found</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
              {selectedCategory === 'My Templates' ? 'You have not saved any custom templates yet. Customize any certificate in the editor and click "Save as Template".' : `No templates found matching "${searchQuery}". Try selecting another category.`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 28 }}>
            {filteredTemplates.map(tpl => {
              const bgUrl = tpl.background || renderedBackgrounds[tpl.id] || generateTemplateBackground(tpl.themeStyle || 'classic-gold', 960, 540);

              return (
                <div
                  key={tpl.id}
                  className="lp-tcard"
                  style={{
                    background: 'var(--surface)',
                    borderRadius: 20,
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s',
                    position: 'relative'
                  }}
                >
                  {/* PREVIEW CANVAS CONTAINER */}
                  <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--bg)', overflow: 'hidden' }}>
                    <img src={bgUrl} alt={tpl.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                    {/* OVERLAY ELEMENTS PREVIEW SKETCH */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, pointerEvents: 'none', background: 'rgba(0,0,0,0.35)' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: 'var(--text)', textTransform: 'uppercase', marginBottom: 4, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                        {tpl.fields?.find(f => f.key === 'title')?.text || tpl.name}
                      </span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', textShadow: '0 2px 10px rgba(0,0,0,0.9)', textAlign: 'center' }}>
                        {tpl.fields?.find(f => f.isDynamic)?.text || '{{name}}'}
                      </span>
                    </div>

                    {/* HOVER OVERLAY BUTTONS */}
                    <div className="card-hover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0, transition: 'opacity 0.25s' }}>
                      <button
                        onClick={() => setPreviewTemplate(tpl)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                      >
                        <Eye size={14} /> Preview
                      </button>
                      <button
                        onClick={() => handleUseTemplate(tpl)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 999, background: 'var(--text)', border: 'none', color: 'var(--bg)', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,255,255,0.3)' }}
                      >
                        Use Template <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* DETAILS CARD FOOTER */}
                  <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', background: 'var(--surface3)', padding: '2px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>
                          {tpl.category}
                        </span>
                        {tpl.isCustom && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text)', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 6 }}>Custom</span>
                        )}
                      </div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>{tpl.name}</h3>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{tpl.description}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                      <button
                        onClick={() => setPreviewTemplate(tpl)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
                      >
                        <Eye size={13} /> Quick Preview
                      </button>

                      {tpl.isCustom ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => onDeleteCustomTemplate(tpl.id)}
                            style={{ background: 'var(--surface3)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: 6, borderRadius: 6, cursor: 'pointer' }}
                            title="Delete custom template"
                          >
                            <Trash2 size={13} />
                          </button>
                          <button
                            onClick={() => handleUseTemplate(tpl)}
                            style={{ background: 'var(--text)', border: 'none', color: 'var(--bg)', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          >
                            Use Template
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleUseTemplate(tpl)}
                          style={{ background: 'var(--text)', border: 'none', color: 'var(--bg)', padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          Use Template &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* LARGE PREVIEW MODAL */}
      {previewTemplate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, width: '100%', maxWidth: '960px', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column' }}>
            
            {/* MODAL HEADER */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{previewTemplate.category}</span>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0 }}>{previewTemplate.name}</h2>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 16 }}
              >
                ✕
              </button>
            </div>

            {/* MODAL CANVAS PREVIEW BODY */}
            <div style={{ padding: 28, background: 'var(--bg)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 16px 48px var(--shadow-lg)', position: 'relative' }}>
                <img
                  src={previewTemplate.background || renderedBackgrounds[previewTemplate.id] || generateTemplateBackground(previewTemplate.themeStyle || 'classic-gold', 1920, 1080)}
                  alt={previewTemplate.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, pointerEvents: 'none' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.12em', color: 'var(--text)', textTransform: 'uppercase', marginBottom: 8, textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
                    {previewTemplate.fields?.find(f => f.key === 'title')?.text || previewTemplate.name}
                  </span>
                  <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', textShadow: '0 2px 14px rgba(0,0,0,0.9)' }}>
                    {previewTemplate.fields?.find(f => f.isDynamic)?.text || '{{name}}'}
                  </span>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: '600px', textAlign: 'center', marginTop: 16, textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                    {previewTemplate.fields?.find(f => f.key === 'description')?.text || previewTemplate.description}
                  </p>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER ACTIONS */}
            <div style={{ padding: '20px 28px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{previewTemplate.description}</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  style={{ padding: '10px 20px', borderRadius: 999, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const tpl = previewTemplate;
                    setPreviewTemplate(null);
                    handleUseTemplate(tpl);
                  }}
                  style={{ padding: '10px 26px', borderRadius: 999, background: 'var(--text)', border: 'none', color: 'var(--bg)', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,255,255,0.2)' }}
                >
                  Use This Template &rarr;
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CARD HOVER CSS */}
      <style>{`
        .lp-tcard:hover {
          transform: translateY(-6px);
          border-color: var(--border-strong) !important;
          box-shadow: 0 20px 50px var(--shadow-lg) !important;
        }
        .lp-tcard:hover .card-hover-overlay {
          opacity: 1 !important;
        }
      `}</style>

    </div>
  );
}

export default TemplatesGallery;

