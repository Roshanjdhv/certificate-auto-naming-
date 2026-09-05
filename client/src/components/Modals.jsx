import React, { useState, useEffect, useRef } from 'react';
import { Settings, Mail, Link as LinkIcon, Bold, Italic, Underline, Save, CheckCircle, AlertCircle, RefreshCw, Sparkles, FolderPlus } from 'lucide-react';

const API_BASE = '';

function Modals({ 
  smtpModalOpen, setSmtpModalOpen, 
  emailModalOpen, setEmailModalOpen, 
  smtpConfig, setSmtpConfig, 
  emailDraft, setEmailDraft,
  excelColumns,
  saveCertModalOpen, setSaveCertModalOpen,
  onConfirmSaveCertTemplate
}) {
  // SMTP Draft State
  const [smtpDraft, setSmtpDraft] = useState({
    host: smtpConfig?.host || '',
    port: smtpConfig?.port || 587,
    user: smtpConfig?.user || '',
    pass: smtpConfig?.pass || '',
    fromName: smtpConfig?.fromName || ''
  });
  const [smtpTestResult, setSmtpTestResult] = useState(null);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);

  // Cert Template Save Modal State
  const [certTplName, setCertTplName] = useState('');
  const [certTplCategory, setCertTplCategory] = useState('Education');
  const [certTplDesc, setCertTplDesc] = useState('');

  // Sync draft when smtpConfig changes or modal opens
  useEffect(() => {
    if (smtpConfig) {
      setSmtpDraft({
        host: smtpConfig.host || '',
        port: smtpConfig.port || 587,
        user: smtpConfig.user || '',
        pass: smtpConfig.pass || '',
        fromName: smtpConfig.fromName || ''
      });
    }
  }, [smtpConfig, smtpModalOpen]);

  // Email State
  const [subject, setSubject] = useState(emailDraft?.subject || '');
  const [bodyHtml, setBodyHtml] = useState(emailDraft?.bodyHtml || '');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  const bodyEditorRef = useRef(null);
  const subjectInputRef = useRef(null);
  const activeFocusRef = useRef(null);

  // Load saved draft and templates on mount
  useEffect(() => {
    if (emailDraft) {
      setSubject(emailDraft.subject || '');
      setBodyHtml(emailDraft.bodyHtml || '');
    }
    try {
      const savedTpls = JSON.parse(localStorage.getItem('cert_email_templates') || '[]');
      setTemplates(savedTpls);
    } catch (_) {}
  }, []);

  // Update contentEditable div innerHTML on modal open or template change
  useEffect(() => {
    if (emailModalOpen && bodyEditorRef.current) {
      bodyEditorRef.current.innerHTML = bodyHtml || '';
    }
  }, [emailModalOpen]);

  // Update parent and localStorage on change
  const handleSubjectChange = (val) => {
    setSubject(val);
    const updated = { subject: val, bodyHtml };
    setEmailDraft(updated);
    localStorage.setItem('cert_email_draft', JSON.stringify(updated));
  };

  const handleBodyChange = (html) => {
    setBodyHtml(html);
    const updated = { subject, bodyHtml: html };
    setEmailDraft(updated);
    localStorage.setItem('cert_email_draft', JSON.stringify(updated));
  };

  const saveSmtp = () => {
    const cfg = {
      host: smtpDraft.host.trim(),
      port: parseInt(smtpDraft.port, 10) || 587,
      user: smtpDraft.user.trim(),
      pass: smtpDraft.pass,
      fromName: smtpDraft.fromName.trim()
    };
    setSmtpConfig(cfg);
    localStorage.setItem('certgen_smtp', JSON.stringify(cfg));
    setSmtpModalOpen(false);
  };

  const testSmtp = async () => {
    if (!smtpDraft.host.trim()) { alert('Enter SMTP host first'); return; }
    if (!smtpDraft.user.trim()) { alert('Enter SMTP username/email'); return; }
    if (!smtpDraft.pass) { alert('Enter SMTP password'); return; }

    setIsTestingSmtp(true);
    setSmtpTestResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/test-smtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smtp: smtpDraft })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSmtpTestResult({ ok: true, message: 'Connection successful â€” SMTP is ready' });
      } else {
        setSmtpTestResult({ ok: false, message: data.error || 'Connection failed' });
      }
    } catch (err) {
      setSmtpTestResult({ ok: false, message: `Cannot reach server â€” is server.js running? (${err.message})` });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const insertVariable = (varName) => {
    const tag = `{{${varName}}}`;
    if (activeFocusRef.current === 'subject' && subjectInputRef.current) {
      const el = subjectInputRef.current;
      const start = el.selectionStart || 0;
      const end = el.selectionEnd || 0;
      const val = el.value;
      const newVal = val.substring(0, start) + tag + val.substring(end);
      handleSubjectChange(newVal);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + tag.length, start + tag.length);
      }, 0);
      return;
    }

    if (bodyEditorRef.current) {
      bodyEditorRef.current.focus();
      const sel = window.getSelection();
      if (sel && sel.rangeCount && bodyEditorRef.current.contains(sel.getRangeAt(0).commonAncestorContainer)) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const node = document.createTextNode(tag);
        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        bodyEditorRef.current.innerHTML += tag;
      }
      handleBodyChange(bodyEditorRef.current.innerHTML);
    }
  };

  const handleRichCmd = (cmd, value = null) => {
    if (bodyEditorRef.current) {
      bodyEditorRef.current.focus();
      document.execCommand(cmd, false, value);
      handleBodyChange(bodyEditorRef.current.innerHTML);
    }
  };

  const handleInsertLink = () => {
    const url = prompt('Enter URL (e.g. https://example.com):');
    if (url) {
      handleRichCmd('createLink', url);
    }
  };

  const handleSaveTemplate = () => {
    const name = prompt('Enter template name:');
    if (!name || !name.trim()) return;
    const newTpls = [...templates, { name: name.trim(), subject, bodyHtml }];
    setTemplates(newTpls);
    localStorage.setItem('cert_email_templates', JSON.stringify(newTpls));
  };

  const handleSelectTemplate = (e) => {
    const val = e.target.value;
    setSelectedTemplate(val);
    if (!val) return;

    if (val.startsWith('del_')) {
      const idx = parseInt(val.replace('del_', ''), 10);
      if (!isNaN(idx)) {
        const newTpls = templates.filter((_, i) => i !== idx);
        setTemplates(newTpls);
        localStorage.setItem('cert_email_templates', JSON.stringify(newTpls));
        setSelectedTemplate('');
      }
      return;
    }

    const idx = parseInt(val, 10);
    if (!isNaN(idx) && templates[idx]) {
      const t = templates[idx];
      handleSubjectChange(t.subject || '');
      handleBodyChange(t.bodyHtml || '');
      if (bodyEditorRef.current) {
        bodyEditorRef.current.innerHTML = t.bodyHtml || '';
      }
    }
  };

  const submitCertTemplateSave = (e) => {
    e.preventDefault();
    if (!certTplName.trim()) {
      alert('Please enter a template name');
      return;
    }
    if (onConfirmSaveCertTemplate) {
      onConfirmSaveCertTemplate({
        name: certTplName.trim(),
        category: certTplCategory,
        description: certTplDesc.trim() || 'Custom user created template design'
      });
    }
    setSaveCertModalOpen(false);
    setCertTplName('');
    setCertTplDesc('');
  };

  const allVars = ['firstName', ...excelColumns.filter(c => c !== 'firstName')];

  return (
    <>
      {/* â”€â”€ Save Certificate Layout Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {saveCertModalOpen && (
        <div className="modal-overlay open" aria-hidden="false" id="saveCertModal">
          <div className="modal" role="dialog">
            <div className="modal-header">
              <div className="modal-title">
                <FolderPlus size={18} />
                Save Custom Template to Library
              </div>
              <button className="modal-close" onClick={() => setSaveCertModalOpen(false)} aria-label="Close">&times;</button>
            </div>
            <form onSubmit={submitCertTemplateSave}>
              <div className="modal-body">
                <div className="field">
                  <label>Template Name *</label>
                  <input 
                    type="text" 
                    value={certTplName} 
                    onChange={e => setCertTplName(e.target.value)} 
                    placeholder="e.g. Executive Leadership Award 2026" 
                    required
                    autoFocus
                  />
                </div>
                <div className="field">
                  <label>Category</label>
                  <select value={certTplCategory} onChange={e => setCertTplCategory(e.target.value)}>
                    <option value="Education">Education</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Courses">Courses</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Events">Events</option>
                    <option value="Awards">Awards</option>
                    <option value="Professional">Professional</option>
                    <option value="Appreciation">Appreciation</option>
                  </select>
                </div>
                <div className="field">
                  <label>Description</label>
                  <textarea 
                    value={certTplDesc} 
                    onChange={e => setCertTplDesc(e.target.value)} 
                    placeholder="Brief description of this template layout..."
                    rows={3}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setSaveCertModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'var(--text)', color: 'var(--bg)', fontWeight: 600 }}>Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* â”€â”€ SMTP Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {smtpModalOpen && (
        <div className="modal-overlay open" aria-hidden="false" id="smtpModal">
          <div className="modal" role="dialog" aria-labelledby="smtpModalTitle">
            <div className="modal-header">
              <div className="modal-title" id="smtpModalTitle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
                </svg>
                SMTP Configuration
              </div>
              <button className="modal-close" id="smtpModalClose" onClick={() => setSmtpModalOpen(false)} aria-label="Close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="field">
                  <label>SMTP Host</label>
                  <input 
                    type="text" 
                    id="smtpHost"
                    value={smtpDraft.host} 
                    onChange={e => setSmtpDraft({...smtpDraft, host: e.target.value})} 
                    placeholder="smtp.gmail.com" 
                    autoComplete="off"
                  />
                </div>
                <div className="field" style={{maxWidth: 90}}>
                  <label>Port</label>
                  <input 
                    type="number" 
                    id="smtpPort"
                    value={smtpDraft.port} 
                    onChange={e => setSmtpDraft({...smtpDraft, port: e.target.value})} 
                    min="1" 
                    max="65535" 
                  />
                </div>
              </div>
              <div className="field">
                <label>Username / Email</label>
                <input 
                  type="email" 
                  id="smtpUser"
                  value={smtpDraft.user} 
                  onChange={e => setSmtpDraft({...smtpDraft, user: e.target.value})} 
                  placeholder="you@example.com" 
                  autoComplete="off"
                />
              </div>
              <div className="field">
                <label>Password / App password</label>
                <input 
                  type="password" 
                  id="smtpPass"
                  value={smtpDraft.pass} 
                  onChange={e => setSmtpDraft({...smtpDraft, pass: e.target.value})} 
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                  autoComplete="new-password"
                />
              </div>
              <div className="field">
                <label>From Name (display name)</label>
                <input 
                  type="text" 
                  id="smtpFromName"
                  value={smtpDraft.fromName} 
                  onChange={e => setSmtpDraft({...smtpDraft, fromName: e.target.value})} 
                  placeholder="e.g. Certificate Team" 
                  autoComplete="off"
                />
              </div>

              {smtpTestResult && (
                <div id="smtpTestResult" className={`smtp-test-result ${smtpTestResult.ok ? 'success' : 'fail'}`} style={{display: 'flex'}}>
                  {smtpTestResult.ok ? (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="2 8 6 12 14 4"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="14" y1="2" x2="2" y2="14"/><line x1="2" y1="2" x2="14" y2="14"/></svg>
                  )}
                  <span>{smtpTestResult.message}</span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-test" id="btnTestSmtp" onClick={testSmtp} disabled={isTestingSmtp} type="button">
                {isTestingSmtp ? <RefreshCw size={14} className="spin" /> : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                )}
                {isTestingSmtp ? 'Testingâ€¦' : 'Test Connection'}
              </button>
              <button className="btn btn-outline" id="btnSaveSmtp" onClick={saveSmtp} type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg> Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ Email Compose Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {emailModalOpen && (
        <div className="modal-overlay open" aria-hidden="false" id="emailModal">
          <div className="modal modal-wide" role="dialog" aria-labelledby="emailModalTitle">
            <div className="modal-header">
              <div className="modal-title" id="emailModalTitle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Compose Email
              </div>
              <button className="modal-close" id="emailModalClose" onClick={() => setEmailModalOpen(false)} aria-label="Close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>Subject</label>
                <input 
                  ref={subjectInputRef}
                  type="text" 
                  id="emailSubject"
                  value={subject} 
                  onChange={e => handleSubjectChange(e.target.value)} 
                  onFocus={() => { activeFocusRef.current = 'subject'; }}
                  placeholder="Congratulations, {{firstName}}!" 
                />
              </div>
              <div className="field">
                <label>Variables â€” click to insert at cursor</label>
                <div className="var-chips" id="varChips">
                  {!allVars.length || (allVars.length === 1 && !excelColumns.length) ? (
                    <span className="var-chip-hint">Upload an Excel file to see column variables</span>
                  ) : (
                    allVars.map(v => (
                      <span key={v} className="var-chip" onClick={() => insertVariable(v)}>
                        {`{{${v}}}`}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <div className="field">
                <label>Body</label>
                <div className="rich-toolbar" id="richToolbar">
                  <button type="button" className="rich-btn" data-cmd="bold" onClick={() => handleRichCmd('bold')} title="Bold (Ctrl+B)"><b>B</b></button>
                  <button type="button" className="rich-btn" data-cmd="italic" onClick={() => handleRichCmd('italic')} title="Italic (Ctrl+I)"><i>I</i></button>
                  <button type="button" className="rich-btn" data-cmd="underline" onClick={() => handleRichCmd('underline')} title="Underline (Ctrl+U)"><u>U</u></button>
                  <div className="rich-divider"></div>
                  <button type="button" className="rich-btn" id="btnInsertLink" onClick={handleInsertLink} title="Insert Link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                    </svg>
                    Link
                  </button>
                  <div className="rich-divider"></div>
                  <button type="button" className="rich-btn rich-btn-text" id="btnSaveTemplate" onClick={handleSaveTemplate} title="Save current email as a reusable template">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight:4}}>
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>Save Template
                  </button>
                  <select id="templateSelect" value={selectedTemplate} onChange={handleSelectTemplate} className="template-select" title="Load a saved template">
                    <option value="">Load Templateâ€¦</option>
                    {templates.map((t, i) => (
                      <option key={i} value={i}>{t.name}</option>
                    ))}
                    {templates.length > 0 && <option disabled>â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€</option>}
                    {templates.map((t, i) => (
                      <option key={`del_${i}`} value={`del_${i}`}>{`âœ• Delete: ${t.name}`}</option>
                    ))}
                  </select>
                </div>
                <div 
                  ref={bodyEditorRef}
                  id="emailBody"
                  className="email-body-editor"
                  contentEditable="true"
                  onFocus={() => { activeFocusRef.current = 'body'; }}
                  onInput={e => handleBodyChange(e.currentTarget.innerHTML)}
                  data-placeholder="Hi {{firstName}},&#10;&#10;Congratulations! Please find your certificate attached.&#10;&#10;Best regards,&#10;The Team"
                  style={{ minHeight: 180 }}
                />
                <div className="field-hint">
                  Variables are replaced per recipient when sending. <b>{"{{firstName}}"}</b> is derived from the name column automatically.
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-done" id="emailModalDone" onClick={() => setEmailModalOpen(false)} type="button">Done</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modals;



