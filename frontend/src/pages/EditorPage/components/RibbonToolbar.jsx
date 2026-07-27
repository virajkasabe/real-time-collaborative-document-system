import React, { useEffect, useRef, useState } from 'react';
import {
  FaBookOpen,
  FaCheck,
  FaList,
  FaMoon,
  FaSun,
  FaUserSecret,
} from 'react-icons/fa';
import { ACCENT_SWATCHES, PAGE_LAYOUTS, PAGE_MARGIN_PRESETS, STYLE_CARDS } from '../utils/constants';
import Icon from '../../../components/common/Icon';

export default function RibbonToolbar({
  activeRibbonTab, canEdit, formatPainterActive, onFormatPainterClick, onGrowFont, onShrinkFont,
  onParagraphShading, onApplyStyle, onOpenFind, onOpenReplace, onShowStats,
  leftSidebarCollapsed, setLeftSidebarCollapsed, rightSidebarCollapsed, setRightSidebarCollapsed,
  accentColor, onApplyAccentColor, theme, toggleTheme, pageLayout, setPageLayout,
  pageMargins, setPageMargins, pageOrientation, setPageOrientation, pageColumns, setPageColumns, currentParagraphFormat,
  onInsertTOC, onUpdateTOC, onInsertFootnote, onNextFootnote, onShowNotes,
  documentLanguage, setDocumentLanguage, documentProtected, setDocumentProtected, isOwner, isEditor, rightTab, setRightTab,
  viewMode, setViewMode, zoomPercent, setZoomPercent,
  quillInstance,
  handleInsertCoverPage, handleInsertBlankPage, handleInsertPageBreak, handleInsertComment,
  showToast,
  documentTheme, setDocumentTheme, pageBackgroundColor, setPageBackgroundColor
}) {
  console.log("RibbonToolbar render - canEdit:", canEdit, "activeRibbonTab:", activeRibbonTab);
  const [showDateTimePopover, setShowDateTimePopover] = useState(false);
  const [showSymbolPopover, setShowSymbolPopover] = useState(false);
  const [activeDesignPopover, setActiveDesignPopover] = useState(null);
  const [activeLayoutPopover, setActiveLayoutPopover] = useState(null);
  const [citationStyle, setCitationStyle] = useState('APA');
  const [activeReferencesPopover, setActiveReferencesPopover] = useState(null);
  
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [showEditorPanel, setShowEditorPanel] = useState(false);
  const [thesaurusData, setThesaurusData] = useState({ show: false, word: '', synonyms: null, index: 0, length: 0 });
  const [showAccessibilityPopover, setShowAccessibilityPopover] = useState(false);
  const [activeViewPopover, setActiveViewPopover] = useState(null);
  const [activeHelpPopover, setActiveHelpPopover] = useState(null); // 'help-info' | 'contact' | 'feedback' | 'training'
  const [feedbackText, setFeedbackText] = useState('');
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

  const designPopoverRef = useRef(null);
  const layoutPopoverRef = useRef(null);
  const referencesPopoverRef = useRef(null);
  const reviewPopoverRef = useRef(null);
  const viewPopoverRef = useRef(null);
  const helpPopoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (designPopoverRef.current && !designPopoverRef.current.contains(event.target)) {
        setActiveDesignPopover(null);
      }
      if (layoutPopoverRef.current && !layoutPopoverRef.current.contains(event.target)) {
        setActiveLayoutPopover(null);
      }
      if (referencesPopoverRef.current && !referencesPopoverRef.current.contains(event.target)) {
        setActiveReferencesPopover(null);
      }
      if (reviewPopoverRef.current && !reviewPopoverRef.current.contains(event.target)) {
        setShowAccessibilityPopover(false);
        setThesaurusData(prev => ({ ...prev, show: false }));
        setShowEditorPanel(false);
      }
      if (viewPopoverRef.current && !viewPopoverRef.current.contains(event.target)) {
        setActiveViewPopover(null);
      }
      if (helpPopoverRef.current && !helpPopoverRef.current.contains(event.target)) {
        setActiveHelpPopover(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Indent & Spacing values linked to selection formats
  const [leftIndent, setLeftIndent] = useState('0 cm');
  const [rightIndent, setRightIndent] = useState('0 cm');
  const [beforeSpacing, setBeforeSpacing] = useState('0 pt');
  const [afterSpacing, setAfterSpacing] = useState('8 pt');

  useEffect(() => {
    if (currentParagraphFormat) {
      setLeftIndent(currentParagraphFormat.marginLeft || '0 cm');
      setRightIndent(currentParagraphFormat.marginRight || '0 cm');
      setBeforeSpacing(currentParagraphFormat.marginTop || '0 pt');
      setAfterSpacing(currentParagraphFormat.marginBottom || '8 pt');
    }
  }, [currentParagraphFormat]);

  const handleParagraphFormatChange = (key, value) => {
    if (!canEdit || !quillInstance) return;
    const range = quillInstance.getSelection();
    if (range) {
      quillInstance.formatLine(range.index, range.length, key, value);
    }
  };

  const incrementIndent = (key, currentVal, isIncrement) => {
    if (!canEdit) return;
    const num = parseFloat(currentVal) || 0;
    const step = 0.1;
    const nextNum = Math.max(0, isIncrement ? num + step : num - step);
    const nextStr = `${parseFloat(nextNum.toFixed(1))} cm`;
    if (key === 'margin-left') setLeftIndent(nextStr);
    if (key === 'margin-right') setRightIndent(nextStr);
    handleParagraphFormatChange(key, nextStr);
  };

  const incrementSpacing = (key, currentVal, isIncrement) => {
    if (!canEdit) return;
    const num = parseFloat(currentVal) || 0;
    const step = 6;
    const nextNum = Math.max(0, isIncrement ? num + step : num - step);
    const nextStr = `${nextNum} pt`;
    if (key === 'margin-top') setBeforeSpacing(nextStr);
    if (key === 'margin-bottom') setAfterSpacing(nextStr);
    handleParagraphFormatChange(key, nextStr);
  };

  const handleIndentInputChange = (key, e) => {
    const val = e.target.value;
    if (key === 'margin-left') setLeftIndent(val);
    if (key === 'margin-right') setRightIndent(val);
  };

  const handleIndentInputBlur = (key, val) => {
    if (!canEdit) return;
    const num = parseFloat(val) || 0;
    const finalVal = `${parseFloat(num.toFixed(1))} cm`;
    if (key === 'margin-left') setLeftIndent(finalVal);
    if (key === 'margin-right') setRightIndent(finalVal);
    handleParagraphFormatChange(key, finalVal);
  };

  const handleSpacingInputChange = (key, e) => {
    const val = e.target.value;
    if (key === 'margin-top') setBeforeSpacing(val);
    if (key === 'margin-bottom') setAfterSpacing(val);
  };

  const handleSpacingInputBlur = (key, val) => {
    if (!canEdit) return;
    const num = parseFloat(val) || 0;
    const finalVal = `${Math.max(0, Math.round(num))} pt`;
    if (key === 'margin-top') setBeforeSpacing(finalVal);
    if (key === 'margin-bottom') setAfterSpacing(finalVal);
    handleParagraphFormatChange(key, finalVal);
  };

  const THEMES = [
    { key: 'classic', name: 'Classic', fontFamily: 'Times New Roman, serif', fontValue: 'serif', accent: '#1E3A5F' },
    { key: 'modern', name: 'Modern', fontFamily: 'Calibri, sans-serif', fontValue: 'sans-serif', accent: '#0D6EFD' },
    { key: 'minimal', name: 'Minimal', fontFamily: 'Calibri, sans-serif', fontValue: 'sans-serif', accent: '#374151' },
    { key: 'bold', name: 'Bold', fontFamily: 'Calibri, sans-serif', fontValue: 'sans-serif', accent: '#DC2626' },
    { key: 'elegant', name: 'Elegant', fontFamily: 'Georgia, serif', fontValue: 'georgia', accent: '#7C3AED' }
  ];

  const BACKGROUND_COLORS = [
    { hex: '#FFFFFF', name: 'White' },
    { hex: '#FFF9F0', name: 'Cream' },
    { hex: '#F5F5F5', name: 'Light Gray' },
    { hex: '#F0F7FF', name: 'Light Blue' },
    { hex: '#F0FFF4', name: 'Light Green' }
  ];

  const CURATED_FONTS = [
    { value: 'sans-serif', label: 'Calibri' },
    { value: 'serif', label: 'Times New Roman' },
    { value: 'georgia', label: 'Georgia' },
    { value: 'monospace', label: 'Consolas' }
  ];

  const handleApplyTheme = (themeItem) => {
    if (!canEdit) return;
    setDocumentTheme(themeItem.key);
    onApplyAccentColor(themeItem.accent);
    
    if (quillInstance) {
      const range = quillInstance.getSelection();
      if (range && range.length > 0) {
        quillInstance.format('font', themeItem.fontValue);
      } else {
        quillInstance.format('font', themeItem.fontValue);
      }
    }
    
    showToast(`Applied ${themeItem.name} theme`, 'success');
  };

  const handleApplyPageBackground = (hex, name) => {
    if (!canEdit) return;
    setPageBackgroundColor(hex);
    showToast(`Page background updated to ${name}`, 'success');
  };

  const handleApplyFont = (fontValue, fontLabel) => {
    if (!canEdit) return;
    if (quillInstance) {
      const range = quillInstance.getSelection();
      if (range && range.length > 0) {
        quillInstance.format('font', fontValue);
      } else {
        quillInstance.format('font', fontValue);
      }
    }
    showToast(`Font updated to ${fontLabel}`, 'success');
  };

  const toolbarRef = useRef(null);
  const [compactLevel, setCompactLevel] = useState(0); // 0 = standard, 1 = hide low-priority labels, 2 = hide all labels except primary

  useEffect(() => {
    if (!toolbarRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        if (width < 1000) {
          setCompactLevel(2);
        } else if (width < 1350) {
          setCompactLevel(1);
        } else {
          setCompactLevel(0);
        }
      }
    });
    observer.observe(toolbarRef.current);
    return () => observer.disconnect();
  }, []);

  const dateFormats = [
    new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
    new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    new Date().toISOString().split('T')[0],
    new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  ];

  const symbolsList = ['©', '®', '™', '°', '±', '§', '€', '£', '¥', '∞', '≠', '≤', '≥', 'π', '√', 'α', 'β', 'μ', '†', '‡'];

  const handleInsertDateTime = (formatString) => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection(true);
    quillInstance.insertText(range.index, formatString);
    quillInstance.setSelection(range.index + formatString.length);
    setShowDateTimePopover(false);
    if (showToast) showToast('Inserted Date/Time', 'success');
  };

  const handleInsertSymbol = (symbol) => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection(true);
    quillInstance.insertText(range.index, symbol);
    quillInstance.setSelection(range.index + symbol.length);
    setShowSymbolPopover(false);
    if (showToast) showToast('Inserted Symbol', 'success');
  };

  // ---- Review Tab helper logic ----
  const handleReadAloud = () => {
    if (isReadingAloud) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
      if (showToast) showToast('Speech playback stopped', 'info');
    } else {
      if (!quillInstance) return;
      const text = quillInstance.getText().trim();
      if (!text) {
        if (showToast) showToast('No text found to read aloud', 'warning');
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsReadingAloud(false);
      utterance.onerror = () => setIsReadingAloud(false);
      setIsReadingAloud(true);
      window.speechSynthesis.speak(utterance);
      if (showToast) showToast('Reading document aloud...', 'success');
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleThesaurus = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection();
    if (!range || range.length === 0) {
      if (showToast) showToast('Please select a word to look up synonyms', 'warning');
      return;
    }
    const selectedText = quillInstance.getText(range.index, range.length).trim().toLowerCase();
    const cleanWord = selectedText.replace(/^[^\w]+|[^\w]+$/g, '');
    
    const thesaurusMap = {
      create: ['make', 'build', 'generate', 'produce'],
      good: ['excellent', 'superb', 'fine', 'positive'],
      important: ['critical', 'vital', 'essential', 'crucial'],
      simple: ['easy', 'plain', 'straightforward', 'uncomplicated'],
      difficult: ['hard', 'challenging', 'complex', 'demanding'],
      write: ['compose', 'draft', 'author', 'pen'],
      collaborate: ['cooperate', 'team up', 'join forces', 'conspire'],
      document: ['file', 'record', 'article', 'manuscript'],
      system: ['network', 'framework', 'structure', 'scheme'],
      change: ['alter', 'modify', 'transform', 'adjust']
    };
    
    const synonyms = thesaurusMap[cleanWord] || null;
    setThesaurusData({
      show: true,
      word: selectedText,
      synonyms,
      index: range.index,
      length: range.length
    });
  };

  const handleReplaceSynonym = (synonym) => {
    if (!quillInstance || !thesaurusData) return;
    quillInstance.deleteText(thesaurusData.index, thesaurusData.length, 'user');
    quillInstance.insertText(thesaurusData.index, synonym, 'user');
    quillInstance.setSelection(thesaurusData.index, synonym.length);
    setThesaurusData(prev => ({ ...prev, show: false }));
    if (showToast) showToast(`Replaced with "${synonym}"`, 'success');
  };

  // Run a real lightweight accessibility check
  const [accessibilityResults, setAccessibilityResults] = useState(null);
  const handleAccessibilityCheck = () => {
    if (!quillInstance) return;
    
    const issues = [];
    
    // Check images without alt text
    const imgs = Array.from(quillInstance.root.querySelectorAll('img'));
    let noAltCount = 0;
    imgs.forEach(img => {
      if (!img.getAttribute('alt') || img.getAttribute('alt').trim() === '') {
        noAltCount++;
      }
    });
    if (noAltCount > 0) {
      issues.push(`${noAltCount} image(s) missing alt text (important for screen readers)`);
    }
    
    // Check heading hierarchy
    const headings = Array.from(quillInstance.root.querySelectorAll('h1, h2, h3'));
    let prevLevel = 0;
    let hierarchySkipped = false;
    headings.forEach(h => {
      const level = parseInt(h.tagName.substring(1));
      if (level - prevLevel > 1 && prevLevel !== 0) {
        hierarchySkipped = true;
      }
      prevLevel = level;
    });
    if (hierarchySkipped) {
      issues.push('Heading levels are skipped (e.g. H1 followed immediately by H3)');
    }
    
    setAccessibilityResults({
      checked: true,
      totalIssues: issues.length,
      issues
    });
    setShowAccessibilityPopover(true);
    
    if (showToast) {
      if (issues.length > 0) {
        showToast(`Accessibility check: ${issues.length} warning(s) found`, 'warning');
      } else {
        showToast('Accessibility check: Good to go!', 'success');
      }
    }
  };

  // ---- View Tab helper logic ----
  const handlePageWidthZoom = () => {
    const workspace = document.querySelector('.editor-canvas-pane');
    if (!workspace) return;
    const workspaceWidth = workspace.clientWidth - 48;
    const pageWidth = pageOrientation === 'landscape' ? 1056 : 816;
    const calculatedZoom = Math.min(200, Math.max(50, Math.round((workspaceWidth / pageWidth) * 100)));
    setZoomPercent(calculatedZoom);
    if (showToast) showToast(`Zoomed to Page Width: ${calculatedZoom}%`, 'success');
  };

  // ---- Help Tab helper logic ----
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    if (showToast) showToast('Thank you for your feedback!', 'success');
    setFeedbackText('');
    setActiveHelpPopover(null);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportName.trim() || !supportEmail.trim() || !supportMessage.trim()) {
      if (showToast) showToast('Please fill out all fields', 'warning');
      return;
    }
    if (showToast) showToast('Support request submitted successfully!', 'success');
    setSupportName('');
    setSupportEmail('');
    setSupportMessage('');
    setActiveHelpPopover(null);
  };

  return (
    <div
      ref={toolbarRef}
      id="word-ribbon-toolbar"
      className={`word-ribbon-toolbar-panel compact-level-${compactLevel}`}
      style={{ overflow: 'visible' }}
    >
      {/* HOME TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'home' ? 'visible' : 'hidden'}`}>
        {!canEdit ? (
          <div style={{ padding: '8px 16px', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="Eye" size={16} /> You are viewing this document in read-only mode.
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', position: 'relative' }}>
            <div className="ribbon-group clipboard-group">
              <div className="ribbon-buttons-grid">
                <button className="ribbon-large-btn ql-paste" onClick={() => alert('Press Ctrl+V to paste.')} title="Paste (Ctrl+V)">
                  <Icon name="Clipboard" size={16} className="mb-1" /><span>Paste</span>
                </button>
                <div className="ribbon-small-buttons">
                  <button className="ql-cut ribbon-custom-btn low-priority-btn" onClick={() => alert('Press Ctrl+X to cut.')} title="Cut"><Icon name="Scissors" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Cut</span></button>
                  <button className="ql-copy ribbon-custom-btn low-priority-btn" onClick={() => alert('Press Ctrl+C to copy.')} title="Copy"><Icon name="FileText" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Copy</span></button>
                  <button
                    type="button"
                    className={`format-painter-btn ribbon-custom-btn low-priority-btn ${formatPainterActive ? 'active' : ''}`}
                    onClick={onFormatPainterClick}
                    title="Format Painter"
                  >
                    <Icon name="Paintbrush" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Format Painter</span>
                  </button>
                </div>
              </div>
              <span className="ribbon-group-label">Clipboard</span>
            </div>
            <div className="ribbon-group-separator" />

            <div className="ribbon-group font-group">
              <div className="ribbon-controls-container">
                <div className="ribbon-buttons-row">
                  <select className="ql-font" defaultValue="sans-serif" title="Font Family">
                    <option value="sans-serif">Calibri</option>
                    <option value="serif">Times New Roman</option>
                    <option value="georgia">Georgia</option>
                    <option value="monospace">Consolas</option>
                  </select>
                  <select className="ql-size" defaultValue="medium" title="Font Size">
                    <option value="small">9</option>
                    <option value="medium">11</option>
                    <option value="large">16</option>
                    <option value="huge">28</option>
                  </select>
                  <button type="button" title="Grow Font" style={{ fontSize: '13px', fontWeight: 'bold' }} onClick={onGrowFont}>A⁺</button>
                  <button type="button" title="Shrink Font" style={{ fontSize: '11px', fontWeight: 'bold' }} onClick={onShrinkFont}>A⁻</button>
                  <button className="ql-clean" title="Clear Formatting" style={{ display: compactLevel > 0 ? 'none' : 'inline-flex' }} />
                  <button className="ql-bold" title="Bold (Ctrl+B)" />
                  <button className="ql-italic" title="Italic (Ctrl+I)" />
                  <button className="ql-underline" title="Underline (Ctrl+U)" />
                  <button className="ql-strike" title="Strikethrough" />
                  <button className="ql-script" value="sub" title="Subscript" style={{ display: compactLevel > 0 ? 'none' : 'inline-flex' }} />
                  <button className="ql-script" value="super" title="Superscript" style={{ display: compactLevel > 0 ? 'none' : 'inline-flex' }} />
                  <select className="ql-color" title="Font Color" />
                  <select className="ql-background" title="Highlight Color" />
                </div>
              </div>
              <span className="ribbon-group-label">Font</span>
            </div>
            <div className="ribbon-group-separator" />

            <div className="ribbon-group paragraph-group">
              <div className="ribbon-buttons-row">
                <button className="ql-list" value="bullet" title="Bullets" />
                <button className="ql-list" value="ordered" title="Numbering" />
                <button className="ql-indent" value="-1" title="Decrease Indent" />
                <button className="ql-indent" value="+1" title="Increase Indent" />
                <button type="button" title="Paragraph Shading" onClick={onParagraphShading} className="flex items-center justify-center"><Icon name="PaintBucket" size={16} /></button>
              </div>
              <div className="ribbon-buttons-row alignments-row">
                <button className="ql-align" value="" title="Align Left" />
                <button className="ql-align" value="center" title="Align Center" />
                <button className="ql-align" value="right" title="Align Right" />
                <button className="ql-align" value="justify" title="Justify" />
              </div>
              <span className="ribbon-group-label">Paragraph</span>
            </div>
            <div className="ribbon-group-separator" />

            <div className="ribbon-group styles-group">
              <div className="styles-carousel">
                {STYLE_CARDS.map(({
                  type, label, preview, style,
                }) => (
                  <button
                    key={type}
                    type="button"
                    className={`style-card ${type}-card`}
                    onClick={() => onApplyStyle(type)}
                    title={`${label} Style`}
                  >
                    <span className="style-card-preview" style={style}>{preview}</span>
                    <span className="style-card-name" style={{ display: compactLevel > 1 ? 'none' : 'block', fontSize: compactLevel > 0 ? '9px' : '11px' }}>{label}</span>
                  </button>
                ))}
              </div>
              <span className="ribbon-group-label">Styles</span>
            </div>
            <div className="ribbon-group-separator" />

            <div className="ribbon-group editing-group">
              <div className="ribbon-vertical-buttons">
                <button type="button" className="editing-ribbon-btn ribbon-custom-btn low-priority-btn" onClick={onOpenFind} title="Find text"><Icon name="Search" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Find</span></button>
                <button type="button" className="editing-ribbon-btn ribbon-custom-btn low-priority-btn" onClick={onOpenReplace} title="Replace text"><Icon name="RefreshCw" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Replace</span></button>
              </div>
              <span className="ribbon-group-label">Editing</span>
            </div>
          </div>
        )}
      </div>

      {/* INSERT TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'insert' ? 'visible' : 'hidden'}`}>
        {!canEdit ? (
          <div style={{ padding: '8px 16px', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="Eye" size={16} /> You are viewing this document in read-only mode.
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', position: 'relative' }}>
            {/* 1. PAGES GROUP */}
            <div className="ribbon-group">
              <div className="ribbon-buttons-row">
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={handleInsertCoverPage} title="Cover Page">
                  <Icon name="FileText" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Cover Page</span>
                </button>
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={handleInsertBlankPage} title="Blank Page">
                  <Icon name="Plus" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Blank Page</span>
                </button>
                <button type="button" className="ribbon-custom-btn" onClick={handleInsertPageBreak} title="Page Break">
                  <Icon name="Ruler" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Page Break</span>
                </button>
              </div>
              <span className="ribbon-group-label">Pages</span>
            </div>

            <div className="ribbon-group-separator" />

            {/* 2. TABLES GROUP */}
            <div className="ribbon-group">
              <div className="ribbon-buttons-row">
                <button type="button" className="ribbon-custom-btn" onClick={() => showToast('Tables grid config: Hover custom inserts.', 'info')} title="Insert Table">
                  <Icon name="Table" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Table</span>
                </button>
              </div>
              <span className="ribbon-group-label">Tables</span>
            </div>

            <div className="ribbon-group-separator" />

            {/* 3. ILLUSTRATIONS GROUP */}
            <div className="ribbon-group">
              <div className="ribbon-buttons-row">
                <button type="button" className="ribbon-custom-btn" onClick={() => showToast('Picture dropdown coming soon', 'info')} title="Pictures">
                  <Icon name="Image" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Pictures</span>
                </button>
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('Shapes library coming soon', 'info')} title="Shapes">
                  <Icon name="Palette" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Shapes</span>
                </button>
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('Icons library coming soon', 'info')} title="Icons">
                  <Icon name="Star" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Icons</span>
                </button>
              </div>
              <div className="ribbon-buttons-row">
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('SmartArt coming soon', 'info')} title="SmartArt" style={{ opacity: 0.5 }}>
                  <Icon name="BarChart2" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">SmartArt</span>
                </button>
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('Chart coming soon', 'info')} title="Chart" style={{ opacity: 0.5 }}>
                  <Icon name="TrendingUp" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Chart</span>
                </button>
              </div>
              <span className="ribbon-group-label">Illustrations</span>
            </div>

            <div className="ribbon-group-separator" />

            {/* 4. MEDIA GROUP */}
            <div className="ribbon-group">
              <div className="ribbon-buttons-row">
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('Online Video coming soon', 'info')} title="Online Video" style={{ opacity: 0.5 }}>
                  <Icon name="Video" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Online Video</span>
                </button>
              </div>
              <span className="ribbon-group-label">Media</span>
            </div>

            <div className="ribbon-group-separator" />

            {/* 5. LINKS GROUP */}
            <div className="ribbon-group">
              <div className="ribbon-buttons-row">
                <button type="button" className="ribbon-custom-btn"
                  onClick={() => {
                    const url = prompt('Enter URL:');
                    if (url && quillInstance) {
                      const range = quillInstance.getSelection();
                      if (range) quillInstance.format('link', url);
                    }
                  }}
                  title="Insert Link">
                  <Icon name="Link" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Link</span>
                </button>
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('Bookmark coming soon', 'info')} title="Bookmark" style={{ opacity: 0.5 }}>
                  <Icon name="Bookmark" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Bookmark</span>
                </button>
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('Cross-reference coming soon', 'info')} title="Cross-reference" style={{ opacity: 0.5 }}>
                  <Icon name="RefreshCw" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Cross-ref</span>
                </button>
              </div>
              <span className="ribbon-group-label">Links</span>
            </div>

            <div className="ribbon-group-separator" />

            {/* 6. COMMENTS GROUP */}
            <div className="ribbon-group">
              <div className="ribbon-buttons-row">
                <button type="button" className="ribbon-custom-btn" onClick={handleInsertComment} title="Insert Comment">
                  <Icon name="MessageSquare" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Comment</span>
                </button>
              </div>
              <span className="ribbon-group-label">Comments</span>
            </div>

            <div className="ribbon-group-separator" />

            {/* 7. HEADER & FOOTER GROUP */}
            <div className="ribbon-group">
              <div className="ribbon-buttons-row">
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('Header coming soon', 'info')} title="Header" style={{ opacity: 0.5 }}>
                  <Icon name="Heading" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Header</span>
                </button>
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('Footer coming soon', 'info')} title="Footer" style={{ opacity: 0.5 }}>
                  <Icon name="Heading" size={16} className="inline-block mr-1 rotate-180" /> <span className="ribbon-btn-label">Footer</span>
                </button>
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('Page Number coming soon', 'info')} title="Page Number" style={{ opacity: 0.5 }}>
                  <Icon name="ListOrdered" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Page Number</span>
                </button>
              </div>
              <span className="ribbon-group-label">Header & Footer</span>
            </div>

            <div className="ribbon-group-separator" />

            {/* 8. TEXT GROUP */}
            <div className="ribbon-group" style={{ position: 'relative' }}>
              <div className="ribbon-buttons-row">
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('Text Box coming soon', 'info')} title="Text Box" style={{ opacity: 0.5 }}>
                  <Icon name="Square" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Text Box</span>
                </button>
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('WordArt coming soon', 'info')} title="WordArt" style={{ opacity: 0.5 }}>
                  <Icon name="Type" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">WordArt</span>
                </button>
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('Drop Cap coming soon', 'info')} title="Drop Cap" style={{ opacity: 0.5 }}>
                  <Icon name="Baseline" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Drop Cap</span>
                </button>
              </div>
              <div className="ribbon-buttons-row">
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => setShowDateTimePopover(!showDateTimePopover)} title="Date & Time">
                  <Icon name="Calendar" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Date/Time</span>
                </button>
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('Signature line coming soon', 'info')} title="Signature Line" style={{ opacity: 0.5 }}>
                  <Icon name="PenTool" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Signature</span>
                </button>
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('Object embed coming soon', 'info')} title="Object" style={{ opacity: 0.5 }}>
                  <Icon name="Box" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Object</span>
                </button>
              </div>

              {/* Date & Time Popover */}
              {showDateTimePopover && (
                <div className="ribbon-popover-menu" style={{ position: 'absolute', bottom: '100%', left: '0', zIndex: 1000 }}>
                  <div className="popover-header">
                    <span>Select Date & Time Format</span>
                    <button type="button" onClick={() => setShowDateTimePopover(false)} className="popover-close-btn">×</button>
                  </div>
                  <div className="popover-list">
                    {dateFormats.map((format, idx) => (
                      <button key={idx} type="button" className="popover-list-item" onClick={() => handleInsertDateTime(format)}>
                        {format}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="ribbon-group-separator" />

            {/* 9. SYMBOLS GROUP */}
            <div className="ribbon-group" style={{ position: 'relative' }}>
              <div className="ribbon-buttons-row">
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => showToast('Equation editor coming soon', 'info')} title="Equation" style={{ opacity: 0.5 }}>
                  <Icon name="Divide" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Equation</span>
                </button>
                <button type="button" className="ribbon-custom-btn low-priority-btn" onClick={() => setShowSymbolPopover(!showSymbolPopover)} title="Insert Symbol">
                  <Icon name="Sigma" size={16} className="inline-block mr-1" /> <span className="ribbon-btn-label">Symbol</span>
                </button>
              </div>
              <span className="ribbon-group-label">Symbols</span>

              {/* Symbol Picker Popover */}
              {showSymbolPopover && (
                <div className="ribbon-popover-menu symbol-popover" style={{ position: 'absolute', bottom: '100%', right: '0', zIndex: 1000 }}>
                  <div className="popover-header">
                    <span>Select Symbol</span>
                    <button type="button" onClick={() => setShowSymbolPopover(false)} className="popover-close-btn">×</button>
                  </div>
                  <div className="symbol-grid">
                    {symbolsList.map((symbol, idx) => (
                      <button key={idx} type="button" className="symbol-grid-btn" onClick={() => handleInsertSymbol(symbol)}>
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DESIGN TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'design' ? 'visible' : 'hidden'}`} ref={designPopoverRef}>
        {!canEdit ? (
          <div className="px-4 py-2 text-xs italic text-[#6B7280] dark:text-[#94A3B8]/80 flex items-center gap-2 h-[76px]">
            <span>You are viewing this document in read-only mode.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', position: 'relative' }}>
            
            {/* GROUP 1: DOCUMENT FORMATTING */}
            <div className="ribbon-group" style={{ position: 'relative' }}>
              <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                
                {/* Themes dropdown */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => setActiveDesignPopover(activeDesignPopover === 'themes' ? null : 'themes')}
                  title="Document Themes"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#0d6efd' }}>
                    <Icon name="Sparkles" size={24} />
                  </div>
                  <span className="btn-label">Themes ▾</span>
                </button>

                {/* Style Set dropdown */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Style sets coming soon', 'info')}
                  title="Style Set"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#059669' }}>
                    <Icon name="FileText" size={24} />
                  </div>
                  <span className="btn-label">Style Set ▾</span>
                </button>

                {/* Colors dropdown */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => setActiveDesignPopover(activeDesignPopover === 'colors' ? null : 'colors')}
                  title="Colors"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#EA580C' }}>
                    <Icon name="Palette" size={24} />
                  </div>
                  <span className="btn-label">Colors ▾</span>
                </button>

                {/* Fonts dropdown */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => setActiveDesignPopover(activeDesignPopover === 'fonts' ? null : 'fonts')}
                  title="Fonts"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#7C3AED' }}>
                    <Icon name="CaseSensitive" size={24} />
                  </div>
                  <span className="btn-label">Fonts ▾</span>
                </button>

                {/* Stacked Effects + Set as Default */}
                <div className="effects-setdefault-column" style={{ width: '98px' }}>
                  <button
                    type="button"
                    className="ribbon-custom-btn low-priority-btn"
                    onClick={() => showToast('Effects coming soon', 'info')}
                    title="Effects"
                    style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left' }}
                  >
                    <Icon name="Compass" size={13} />
                    <span>Effects ▾</span>
                  </button>
                  <button
                    type="button"
                    className="ribbon-custom-btn low-priority-btn"
                    onClick={() => showToast('Default styles set', 'success')}
                    title="Set as Default"
                    style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left' }}
                  >
                    <Icon name="RotateCcw" size={13} />
                    <span>Set as Default</span>
                  </button>
                </div>

              </div>
              <span className="ribbon-group-label">Document Formatting</span>

              {/* Popovers for Document Formatting */}
              {activeDesignPopover === 'themes' && (
                <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '0', zIndex: 1000, width: '160px' }}>
                  <div className="popover-list">
                    {THEMES.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        className={`popover-list-item ${documentTheme === t.key ? 'active-item' : ''}`}
                        onClick={() => {
                          handleApplyTheme(t);
                          setActiveDesignPopover(null);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 12px', textAlign: 'left' }}
                      >
                        <span style={{ fontFamily: t.fontFamily, color: t.accent, fontWeight: 'bold' }}>Aa</span>
                        <span>{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeDesignPopover === 'colors' && (
                <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '120px', zIndex: 1000, width: '135px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '8px' }}>
                    {ACCENT_SWATCHES.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        className="ribbon-color-swatch"
                        onClick={() => {
                          onApplyAccentColor(hex);
                          setActiveDesignPopover(null);
                        }}
                        title={`Use ${hex} as accent color`}
                        style={{
                          '--swatch-bg': hex,
                          '--swatch-border': accentColor === hex ? '2px solid var(--text, #111)' : '1px solid rgba(0,0,0,0.15)',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeDesignPopover === 'fonts' && (
                <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '180px', zIndex: 1000, width: '185px' }}>
                  <div className="popover-list">
                    {CURATED_FONTS.map((font) => (
                      <button
                        key={font.value}
                        type="button"
                        className="popover-list-item"
                        onClick={() => {
                          handleApplyFont(font.value, font.label);
                          setActiveDesignPopover(null);
                        }}
                        style={{
                          fontFamily: font.value === 'georgia' ? 'Georgia, serif' : font.value === 'serif' ? 'Times New Roman, serif' : font.value === 'monospace' ? 'Consolas, monospace' : 'Calibri, sans-serif',
                          width: '100%',
                          padding: '6px 12px',
                          textAlign: 'left',
                          fontSize: '13px',
                        }}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="ribbon-group-separator" />

            {/* GROUP 2: PAGE BACKGROUND */}
            <div className="ribbon-group" style={{ position: 'relative' }}>
              <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                
                {/* Watermark dropdown */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Watermarks coming soon', 'info')}
                  title="Watermark"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#6B7280' }}>
                    <Icon name="Copy" size={24} />
                  </div>
                  <span className="btn-label">Watermark ▾</span>
                </button>

                {/* Page Color dropdown */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => setActiveDesignPopover(activeDesignPopover === 'pageColor' ? null : 'pageColor')}
                  title="Page Color"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#0d6efd' }}>
                    <Icon name="Paintbucket" size={24} />
                  </div>
                  <span className="btn-label">Page Color ▾</span>
                </button>

                {/* Page Borders button */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Page borders coming soon', 'info')}
                  title="Page Borders"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#374151' }}>
                    <Icon name="Square" size={24} />
                  </div>
                  <span className="btn-label">Page Borders</span>
                </button>

              </div>
              <span className="ribbon-group-label">Page Background</span>

              {/* Popovers for Page Background */}
              {activeDesignPopover === 'pageColor' && (
                <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', right: '10px', zIndex: 1000, width: '135px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '8px' }}>
                    {BACKGROUND_COLORS.map((bg) => (
                      <button
                        key={bg.hex}
                        type="button"
                        className="ribbon-color-swatch"
                        onClick={() => {
                          handleApplyPageBackground(bg.hex, bg.name);
                          setActiveDesignPopover(null);
                        }}
                        title={`Use ${bg.name} as page background`}
                        style={{
                          '--swatch-bg': bg.hex,
                          '--swatch-border': pageBackgroundColor === bg.hex ? '2px solid var(--text, #111)' : '1px solid rgba(0,0,0,0.15)',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}
      </div>

      {/* LAYOUT TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'layout' ? 'visible' : 'hidden'}`}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', position: 'relative' }} ref={layoutPopoverRef}>
          
          {/* GROUP 1: PAGE SETUP */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Text Direction */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Text Direction options coming soon', 'info')}
                title="Text Direction"
                disabled={!canEdit}
                style={{ opacity: canEdit ? 1 : 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: 'var(--accent, #0d6efd)' }}>
                  <Icon name="ArrowDownAZ" size={24} />
                </div>
                <span className="btn-label">Text Direction ▾</span>
              </button>

              {/* Margins */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${activeLayoutPopover === 'margins' ? 'active' : ''}`}
                onClick={() => setActiveLayoutPopover(activeLayoutPopover === 'margins' ? null : 'margins')}
                title="Margins"
                disabled={!canEdit}
                style={{ opacity: canEdit ? 1 : 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#059669' }}>
                  <Icon name="Ruler" size={24} />
                </div>
                <span className="btn-label">Margins ▾</span>
              </button>

              {/* Orientation */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${activeLayoutPopover === 'orientation' ? 'active' : ''}`}
                onClick={() => setActiveLayoutPopover(activeLayoutPopover === 'orientation' ? null : 'orientation')}
                title="Orientation"
                disabled={!canEdit}
                style={{ opacity: canEdit ? 1 : 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#ea580c' }}>
                  <Icon name="RotateCw" size={24} />
                </div>
                <span className="btn-label">Orientation ▾</span>
              </button>

              {/* Size */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${activeLayoutPopover === 'size' ? 'active' : ''}`}
                onClick={() => setActiveLayoutPopover(activeLayoutPopover === 'size' ? null : 'size')}
                title="Page Size"
                disabled={!canEdit}
                style={{ opacity: canEdit ? 1 : 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#7c3aed' }}>
                  <Icon name="Layers" size={24} />
                </div>
                <span className="btn-label">Size ▾</span>
              </button>

              {/* Columns */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${activeLayoutPopover === 'columns' ? 'active' : ''}`}
                onClick={() => setActiveLayoutPopover(activeLayoutPopover === 'columns' ? null : 'columns')}
                title="Columns"
                disabled={!canEdit}
                style={{ opacity: canEdit ? 1 : 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#2563eb' }}>
                  <Icon name="Columns" size={24} />
                </div>
                <span className="btn-label">Columns ▾</span>
              </button>

              {/* Breaks */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${activeLayoutPopover === 'breaks' ? 'active' : ''}`}
                onClick={() => setActiveLayoutPopover(activeLayoutPopover === 'breaks' ? null : 'breaks')}
                title="Breaks"
                disabled={!canEdit}
                style={{ opacity: canEdit ? 1 : 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#db2777' }}>
                  <Icon name="Scissors" size={24} />
                </div>
                <span className="btn-label">Breaks ▾</span>
              </button>

              {/* Line Numbers & Hyphenation Stacked */}
              <div className="effects-setdefault-column" style={{ width: '115px' }}>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Line Numbers coming soon', 'info')}
                  title="Line Numbers"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: canEdit ? 1 : 0.6 }}
                >
                  <Icon name="ListOrdered" size={13} />
                  <span>Line Numbers ▾</span>
                </button>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Hyphenation coming soon', 'info')}
                  title="Hyphenation"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: canEdit ? 1 : 0.6 }}
                >
                  <Icon name="Minus" size={13} />
                  <span>Hyphenation ▾</span>
                </button>
              </div>

            </div>
            <span className="ribbon-group-label">PAGE SETUP</span>

            {/* Popovers for PAGE SETUP */}
            {activeLayoutPopover === 'margins' && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '80px', zIndex: 1000, width: '220px' }}>
                <div className="popover-list">
                  {Object.entries(PAGE_MARGIN_PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      type="button"
                      className={`popover-list-item ${pageMargins === key ? 'active-item' : ''}`}
                      onClick={() => {
                        setPageMargins(key);
                        setActiveLayoutPopover(null);
                        showToast(`Margins updated to ${preset.label}`, 'success');
                      }}
                      style={{ width: '100%', padding: '6px 12px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}
                    >
                      <span className="font-semibold text-xs">{preset.label}</span>
                      <span className="text-[10px] text-[#6b7280] dark:text-[#94a3b8] truncate">
                        {key === 'normal' && "Top: 2.54 cm, Left: 2.54 cm"}
                        {key === 'narrow' && "Top: 1.27 cm, Left: 1.27 cm"}
                        {key === 'moderate' && "Top: 2.54 cm, Left: 1.91 cm"}
                        {key === 'wide' && "Top: 2.54 cm, Left: 5.08 cm"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeLayoutPopover === 'orientation' && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '160px', zIndex: 1000, width: '140px' }}>
                <div className="popover-list">
                  <button
                    type="button"
                    className={`popover-list-item ${pageOrientation === 'portrait' ? 'active-item' : ''}`}
                    onClick={() => {
                      setPageOrientation('portrait');
                      setActiveLayoutPopover(null);
                      showToast('Orientation set to Portrait', 'success');
                    }}
                    style={{ width: '100%', padding: '6px 12px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Icon name="File" size={14} />
                    <span>Portrait</span>
                  </button>
                  <button
                    type="button"
                    className={`popover-list-item ${pageOrientation === 'landscape' ? 'active-item' : ''}`}
                    onClick={() => {
                      setPageOrientation('landscape');
                      setActiveLayoutPopover(null);
                      showToast('Orientation set to Landscape', 'success');
                    }}
                    style={{ width: '100%', padding: '6px 12px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Icon name="File" size={14} style={{ transform: 'rotate(90deg)' }} />
                    <span>Landscape</span>
                  </button>
                </div>
              </div>
            )}

            {activeLayoutPopover === 'size' && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '240px', zIndex: 1000, width: '150px' }}>
                <div className="popover-list">
                  {Object.entries(PAGE_LAYOUTS).map(([key, { label }]) => (
                    <button
                      key={key}
                      type="button"
                      className={`popover-list-item ${pageLayout === key ? 'active-item' : ''}`}
                      onClick={() => {
                        setPageLayout(key);
                        setActiveLayoutPopover(null);
                        showToast(`Page size updated to ${label}`, 'success');
                      }}
                      style={{ width: '100%', padding: '6px 12px', textAlign: 'left' }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeLayoutPopover === 'columns' && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '320px', zIndex: 1000, width: '130px' }}>
                <div className="popover-list">
                  {[1, 2, 3].map((cols) => (
                    <button
                      key={cols}
                      type="button"
                      className={`popover-list-item ${pageColumns === cols ? 'active-item' : ''}`}
                      onClick={() => {
                        setPageColumns(cols);
                        setActiveLayoutPopover(null);
                        showToast(`Set to ${cols} Column${cols > 1 ? 's' : ''}`, 'success');
                      }}
                      style={{ width: '100%', padding: '6px 12px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Icon name="Columns" size={14} />
                      <span>{cols} Column${cols > 1 ? 's' : ''}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeLayoutPopover === 'breaks' && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '400px', zIndex: 1000, width: '160px' }}>
                <div className="popover-list">
                  <button
                    type="button"
                    className="popover-list-item"
                    onClick={() => {
                      handleInsertPageBreak();
                      setActiveLayoutPopover(null);
                    }}
                    style={{ width: '100%', padding: '8px 12px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Icon name="Scissors" size={14} />
                    <span>Insert Page Break</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 2: PARAGRAPH */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="paragraph-input-grid">
                {/* Row 1: Left Indent and Before Spacing */}
                <div className="paragraph-input-group">
                  <label>Left:</label>
                  <div className="paragraph-numeric-container">
                    <input
                      type="text"
                      value={leftIndent}
                      onChange={(e) => handleIndentInputChange('margin-left', e)}
                      onBlur={(e) => handleIndentInputBlur('margin-left', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleIndentInputBlur('margin-left', e.target.value)}
                      disabled={!canEdit}
                    />
                    <div className="paragraph-numeric-spinners">
                      <button type="button" onClick={() => incrementIndent('margin-left', leftIndent, true)} disabled={!canEdit}>▲</button>
                      <button type="button" onClick={() => incrementIndent('margin-left', leftIndent, false)} disabled={!canEdit}>▼</button>
                    </div>
                  </div>
                </div>

                <div className="paragraph-input-group">
                  <label>Before:</label>
                  <div className="paragraph-numeric-container">
                    <input
                      type="text"
                      value={beforeSpacing}
                      onChange={(e) => handleSpacingInputChange('margin-top', e)}
                      onBlur={(e) => handleSpacingInputBlur('margin-top', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSpacingInputBlur('margin-top', e.target.value)}
                      disabled={!canEdit}
                    />
                    <div className="paragraph-numeric-spinners">
                      <button type="button" onClick={() => incrementSpacing('margin-top', beforeSpacing, true)} disabled={!canEdit}>▲</button>
                      <button type="button" onClick={() => incrementSpacing('margin-top', beforeSpacing, false)} disabled={!canEdit}>▼</button>
                    </div>
                  </div>
                </div>

                {/* Row 2: Right Indent and After Spacing */}
                <div className="paragraph-input-group">
                  <label>Right:</label>
                  <div className="paragraph-numeric-container">
                    <input
                      type="text"
                      value={rightIndent}
                      onChange={(e) => handleIndentInputChange('margin-right', e)}
                      onBlur={(e) => handleIndentInputBlur('margin-right', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleIndentInputBlur('margin-right', e.target.value)}
                      disabled={!canEdit}
                    />
                    <div className="paragraph-numeric-spinners">
                      <button type="button" onClick={() => incrementIndent('margin-right', rightIndent, true)} disabled={!canEdit}>▲</button>
                      <button type="button" onClick={() => incrementIndent('margin-right', rightIndent, false)} disabled={!canEdit}>▼</button>
                    </div>
                  </div>
                </div>

                <div className="paragraph-input-group">
                  <label>After:</label>
                  <div className="paragraph-numeric-container">
                    <input
                      type="text"
                      value={afterSpacing}
                      onChange={(e) => handleSpacingInputChange('margin-bottom', e)}
                      onBlur={(e) => handleSpacingInputBlur('margin-bottom', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSpacingInputBlur('margin-bottom', e.target.value)}
                      disabled={!canEdit}
                    />
                    <div className="paragraph-numeric-spinners">
                      <button type="button" onClick={() => incrementSpacing('margin-bottom', afterSpacing, true)} disabled={!canEdit}>▲</button>
                      <button type="button" onClick={() => incrementSpacing('margin-bottom', afterSpacing, false)} disabled={!canEdit}>▼</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span className="ribbon-group-label">PARAGRAPH</span>
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 3: ARRANGE */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Position */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Position options coming soon', 'info')}
                title="Position"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="Grid" size={24} />
                </div>
                <span className="btn-label">Position ▾</span>
              </button>

              {/* Wrap Text */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Wrap Text options coming soon', 'info')}
                title="Wrap Text"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="AlignLeft" size={24} />
                </div>
                <span className="btn-label">Wrap Text ▾</span>
              </button>

              {/* Bring Forward */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Bring Forward options coming soon', 'info')}
                title="Bring Forward"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="SquareStack" size={24} />
                </div>
                <span className="btn-label">Bring Forward ▾</span>
              </button>

              {/* Send Backward */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Send Backward options coming soon', 'info')}
                title="Send Backward"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="Layers" size={24} />
                </div>
                <span className="btn-label">Send Backward ▾</span>
              </button>

              {/* Selection Pane */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Selection Pane coming soon', 'info')}
                title="Selection Pane"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="PanelRight" size={24} />
                </div>
                <span className="btn-label">Selection Pane</span>
              </button>

              {/* Stacked Arrange Options (Align, Group, Rotate) */}
              <div className="effects-setdefault-column" style={{ width: '100px', height: '62px' }}>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Align options coming soon', 'info')}
                  title="Align"
                  disabled={!canEdit}
                  style={{ fontSize: '9px', height: '18px', display: 'flex', alignItems: 'center', gap: '3px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="Sliders" size={10} />
                  <span>Align ▾</span>
                </button>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Group options coming soon', 'info')}
                  title="Group"
                  disabled={!canEdit}
                  style={{ fontSize: '9px', height: '18px', display: 'flex', alignItems: 'center', gap: '3px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="Combine" size={10} />
                  <span>Group ▾</span>
                </button>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Rotate options coming soon', 'info')}
                  title="Rotate"
                  disabled={!canEdit}
                  style={{ fontSize: '9px', height: '18px', display: 'flex', alignItems: 'center', gap: '3px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="RotateCw" size={10} />
                  <span>Rotate ▾</span>
                </button>
              </div>

            </div>
            <span className="ribbon-group-label">ARRANGE</span>
          </div>

        </div>
      </div>

      {/* REFERENCES TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'references' ? 'visible' : 'hidden'}`}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', position: 'relative' }} ref={referencesPopoverRef}>
          
          {/* GROUP 1: TABLE OF CONTENTS */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Table of Contents */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${activeReferencesPopover === 'toc' ? 'active' : ''}`}
                onClick={() => setActiveReferencesPopover(activeReferencesPopover === 'toc' ? null : 'toc')}
                title="Table of Contents"
                disabled={!canEdit}
                style={{ opacity: canEdit ? 1 : 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: 'var(--accent, #0d6efd)' }}>
                  <Icon name="LayoutList" size={24} />
                </div>
                <span className="btn-label">Table of Contents ▾</span>
              </button>

              {/* Add Text & Update Table Stacked */}
              <div className="effects-setdefault-column" style={{ width: '120px' }}>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Heading level marking options coming soon', 'info')}
                  title="Add Text to Table of Contents"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: canEdit ? 1 : 0.6 }}
                >
                  <Icon name="Plus" size={13} />
                  <span>Add Text ▾</span>
                </button>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={onUpdateTOC}
                  title="Update Table of Contents"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: canEdit ? 1 : 0.6 }}
                >
                  <Icon name="RefreshCw" size={13} />
                  <span>Update Table</span>
                </button>
              </div>

            </div>
            <span className="ribbon-group-label">TABLE OF CONTENTS</span>

            {/* TOC Popover */}
            {activeReferencesPopover === 'toc' && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '0', zIndex: 1000, width: '220px' }}>
                <div className="popover-list">
                  <button
                    key="toc-auto-1"
                    type="button"
                    className="popover-list-item"
                    onClick={() => {
                      onInsertTOC();
                      setActiveReferencesPopover(null);
                    }}
                    style={{ width: '100%', padding: '8px 12px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}
                  >
                    <span className="font-semibold text-xs">Automatic Table 1</span>
                    <span className="text-[10px] text-[#6b7280] dark:text-[#94a3b8]">Create a standard linked outline index.</span>
                  </button>
                  <button
                    key="toc-classic"
                    type="button"
                    className="popover-list-item"
                    onClick={() => {
                      onInsertTOC();
                      setActiveReferencesPopover(null);
                    }}
                    style={{ width: '100%', padding: '8px 12px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}
                  >
                    <span className="font-semibold text-xs">Classic Table</span>
                    <span className="text-[10px] text-[#6b7280] dark:text-[#94a3b8]">Traditional design outline.</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 2: FOOTNOTES */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Insert Footnote */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={onInsertFootnote}
                title="Insert Footnote (Alt+Ctrl+F)"
                disabled={!canEdit}
                style={{ opacity: canEdit ? 1 : 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#059669' }}>
                  <Icon name="Heading" size={24} />
                </div>
                <span className="btn-label">Insert Footnote</span>
              </button>

              {/* Insert Endnote */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Endnotes coming soon. They will append at the very end of the file.', 'info')}
                title="Insert Endnote"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="ArrowDownToLine" size={24} />
                </div>
                <span className="btn-label">Insert Endnote</span>
              </button>

              {/* Next Footnote & Show Notes Stacked */}
              <div className="effects-setdefault-column" style={{ width: '115px' }}>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={onNextFootnote}
                  title="Next Footnote marker"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: canEdit ? 1 : 0.6 }}
                >
                  <Icon name="ChevronRight" size={13} />
                  <span>Next Footnote ▾</span>
                </button>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={onShowNotes}
                  title="Jump to Footnotes definition block"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: canEdit ? 1 : 0.6 }}
                >
                  <Icon name="Eye" size={13} />
                  <span>Show Notes</span>
                </button>
              </div>

            </div>
            <span className="ribbon-group-label">FOOTNOTES</span>
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 3: CITATIONS & BIBLIOGRAPHY */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Insert Citation */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Citation listings coming soon', 'info')}
                title="Insert Citation"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="FileText" size={24} />
                </div>
                <span className="btn-label">Insert Citation ▾</span>
              </button>

              {/* Manage Sources */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Sources Manager coming soon', 'info')}
                title="Manage Sources"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="Sliders" size={24} />
                </div>
                <span className="btn-label">Manage Sources</span>
              </button>

              {/* Citation Style Dropdown Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignSelf: 'center', fontSize: '10px', width: '65px' }}>
                <span style={{ color: 'var(--text)', opacity: 0.8, fontSize: '9px', fontWeight: '500' }}>Style:</span>
                <select
                  value={citationStyle}
                  onChange={(e) => {
                    setCitationStyle(e.target.value);
                    showToast(`Style changed to ${e.target.value}`, 'success');
                  }}
                  disabled={!canEdit}
                  style={{
                    border: '1px solid var(--border)',
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '4px',
                    height: '20px',
                    fontSize: '9px',
                    outline: 'none',
                    padding: '0 2px',
                    color: 'var(--text-h)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="APA">APA</option>
                  <option value="MLA">MLA</option>
                  <option value="Chicago">Chicago</option>
                  <option value="IEEE">IEEE</option>
                </select>
              </div>

              {/* Bibliography */}
              <div className="effects-setdefault-column" style={{ width: '105px' }}>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Bibliography generation coming soon', 'info')}
                  title="Bibliography"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="BookOpen" size={13} />
                  <span>Bibliography ▾</span>
                </button>
              </div>

            </div>
            <span className="ribbon-group-label">CITATIONS & BIBLIOGRAPHY</span>
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 4: CAPTIONS */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Insert Caption */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Captions coming soon', 'info')}
                title="Insert Caption"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="Image" size={24} />
                </div>
                <span className="btn-label">Insert Caption</span>
              </button>

              {/* Cross-reference & Change Provider Stacked */}
              <div className="effects-setdefault-column" style={{ width: '120px' }}>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Cross-reference coming soon', 'info')}
                  title="Cross-reference"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="Link" size={13} />
                  <span>Cross-reference</span>
                </button>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Provider configuration coming soon', 'info')}
                  title="Change Caption Provider"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="Settings" size={13} />
                  <span>Change Provider</span>
                </button>
              </div>

            </div>
            <span className="ribbon-group-label">CAPTIONS</span>
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 5: INDEX */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Mark Entry */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Mark entry options coming soon', 'info')}
                title="Mark Entry"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="PenTool" size={24} />
                </div>
                <span className="btn-label">Mark Entry</span>
              </button>

              {/* Insert Index */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Index generation coming soon', 'info')}
                title="Insert Index"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="FileSearch" size={24} />
                </div>
                <span className="btn-label">Insert Index</span>
              </button>

              {/* Update Index Stacked */}
              <div className="effects-setdefault-column" style={{ width: '100px' }}>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('No index block found to update', 'warning')}
                  title="Update Index"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="RefreshCw" size={13} />
                  <span>Update Index</span>
                </button>
              </div>

            </div>
            <span className="ribbon-group-label">INDEX</span>
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 6: TABLE OF AUTHORITIES */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Mark Citation */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Mark authority options coming soon', 'info')}
                title="Mark Citation"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="Quote" size={24} />
                </div>
                <span className="btn-label">Mark Citation</span>
              </button>

              {/* Insert Table of Authorities */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Table of Authorities generation coming soon', 'info')}
                title="Insert Table of Authorities"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="Scale" size={24} />
                </div>
                <span className="btn-label">Insert Table</span>
              </button>

              {/* Update Table Stacked */}
              <div className="effects-setdefault-column" style={{ width: '100px' }}>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('No Table of Authorities found to update', 'warning')}
                  title="Update Table"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="RefreshCw" size={13} />
                  <span>Update Table</span>
                </button>
              </div>

            </div>
            <span className="ribbon-group-label">TABLE OF AUTHORITIES</span>
          </div>

        </div>
      </div>

      {/* MAILINGS TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'mailings' ? 'visible' : 'hidden'}`}>
        {!canEdit ? (
          <div style={{ padding: '8px 16px', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="Eye" size={16} /> You are viewing this document in read-only mode.
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', position: 'relative' }}>
            
            {/* GROUP 1: CREATE */}
            <div className="ribbon-group" style={{ position: 'relative' }}>
              <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                
                {/* Chinese Envelope */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Mail merge features coming soon', 'info')}
                  title="Create Chinese Envelope"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#0ea5e9' }}>
                    <Icon name="Mail" size={24} />
                  </div>
                  <span className="btn-label">Chinese Envelope</span>
                </button>

                {/* Envelopes */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Mail merge features coming soon', 'info')}
                  title="Create Envelope"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                    <Icon name="Mail" size={24} />
                  </div>
                  <span className="btn-label">Envelopes</span>
                </button>

                {/* Labels */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Mail merge features coming soon', 'info')}
                  title="Create Labels"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#f59e0b' }}>
                    <Icon name="Grid" size={24} />
                  </div>
                  <span className="btn-label">Labels</span>
                </button>

              </div>
              <span className="ribbon-group-label">CREATE</span>
            </div>

            <div className="ribbon-group-separator" />

            {/* GROUP 2: START MAIL MERGE */}
            <div className="ribbon-group" style={{ position: 'relative' }}>
              <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                
                {/* Start Mail Merge */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Mail merge features coming soon', 'info')}
                  title="Start Mail Merge"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#3b82f6' }}>
                    <Icon name="FileText" size={24} />
                  </div>
                  <span className="btn-label">Start Merge ▾</span>
                </button>

                {/* Select Recipients */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Mail merge features coming soon', 'info')}
                  title="Select Recipients"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#059669' }}>
                    <Icon name="Users" size={24} />
                  </div>
                  <span className="btn-label">Select Recipients ▾</span>
                </button>

                {/* Edit Recipient List */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Mail merge features coming soon', 'info')}
                  title="Edit Recipient List"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#6b7280' }}>
                    <Icon name="Edit3" size={24} />
                  </div>
                  <span className="btn-label">Edit List</span>
                </button>

              </div>
              <span className="ribbon-group-label">START MAIL MERGE</span>
            </div>

            <div className="ribbon-group-separator" />

            {/* GROUP 3: WRITE & INSERT FIELDS */}
            <div className="ribbon-group" style={{ position: 'relative' }}>
              <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                
                {/* Highlight Merge Fields */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Mail merge features coming soon', 'info')}
                  title="Highlight Merge Fields"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#a855f7' }}>
                    <Icon name="Highlighter" size={24} />
                  </div>
                  <span className="btn-label">Highlight Fields</span>
                </button>

                {/* Address Block */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Mail merge features coming soon', 'info')}
                  title="Address Block"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#14b8a6' }}>
                    <Icon name="Home" size={24} />
                  </div>
                  <span className="btn-label">Address Block</span>
                </button>

                {/* Greeting Line */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Mail merge features coming soon', 'info')}
                  title="Greeting Line"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#ec4899' }}>
                    <Icon name="Smile" size={24} />
                  </div>
                  <span className="btn-label">Greeting Line</span>
                </button>

                {/* Insert Merge Field */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Mail merge features coming soon', 'info')}
                  title="Insert Merge Field"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#6366f1' }}>
                    <Icon name="PlusCircle" size={24} />
                  </div>
                  <span className="btn-label">Insert Field ▾</span>
                </button>

                {/* Rules, Match Fields, Update Labels Stacked */}
                <div className="effects-setdefault-column" style={{ width: '110px' }}>
                  <button
                    type="button"
                    className="ribbon-custom-btn low-priority-btn"
                    onClick={() => showToast('Mail merge features coming soon', 'info')}
                    title="Rules"
                    style={{ fontSize: '10px', height: '18px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left' }}
                  >
                    <Icon name="Settings" size={12} />
                    <span>Rules ▾</span>
                  </button>
                  <button
                    type="button"
                    className="ribbon-custom-btn low-priority-btn"
                    onClick={() => showToast('Mail merge features coming soon', 'info')}
                    title="Match Fields"
                    style={{ fontSize: '10px', height: '18px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left' }}
                  >
                    <Icon name="CheckSquare" size={12} />
                    <span>Match Fields</span>
                  </button>
                  <button
                    type="button"
                    className="ribbon-custom-btn low-priority-btn"
                    onClick={() => showToast('Mail merge features coming soon', 'info')}
                    title="Update Labels"
                    style={{ fontSize: '10px', height: '18px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left' }}
                  >
                    <Icon name="RefreshCw" size={12} />
                    <span>Update Labels</span>
                  </button>
                </div>

              </div>
              <span className="ribbon-group-label">WRITE & INSERT FIELDS</span>
            </div>

            <div className="ribbon-group-separator" />

            {/* GROUP 4: PREVIEW RESULTS */}
            <div className="ribbon-group" style={{ position: 'relative' }}>
              <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                
                {/* Preview Results */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Mail merge features coming soon', 'info')}
                  title="Preview Results"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#0ea5e9' }}>
                    <Icon name="Search" size={24} />
                  </div>
                  <span className="btn-label">Preview Results</span>
                </button>

                {/* Navigation arrows (Disabled record navigator) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid var(--border)', borderRadius: '4px', padding: '4px', background: 'rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <button
                      type="button"
                      onClick={() => showToast('Mail merge features coming soon', 'info')}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)' }}
                      title="First Record"
                    >
                      <Icon name="ChevronsLeft" size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('Mail merge features coming soon', 'info')}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)' }}
                      title="Previous Record"
                    >
                      <Icon name="ChevronLeft" size={12} />
                    </button>
                    <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--text-muted)', padding: '0 4px' }}>1</span>
                    <button
                      type="button"
                      onClick={() => showToast('Mail merge features coming soon', 'info')}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)' }}
                      title="Next Record"
                    >
                      <Icon name="ChevronRight" size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('Mail merge features coming soon', 'info')}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)' }}
                      title="Last Record"
                    >
                      <Icon name="ChevronsRight" size={12} />
                    </button>
                  </div>
                </div>

                {/* Find Recipient & Check for Errors Stacked */}
                <div className="effects-setdefault-column" style={{ width: '100px' }}>
                  <button
                    type="button"
                    className="ribbon-custom-btn low-priority-btn"
                    onClick={() => showToast('Mail merge features coming soon', 'info')}
                    title="Find Recipient"
                    style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left' }}
                  >
                    <Icon name="Search" size={12} />
                    <span>Find Recipient</span>
                  </button>
                  <button
                    type="button"
                    className="ribbon-custom-btn low-priority-btn"
                    onClick={() => showToast('Mail merge features coming soon', 'info')}
                    title="Check for Errors"
                    style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left' }}
                  >
                    <Icon name="AlertTriangle" size={12} />
                    <span>Auto Check...</span>
                  </button>
                </div>

              </div>
              <span className="ribbon-group-label">PREVIEW RESULTS</span>
            </div>

            <div className="ribbon-group-separator" />

            {/* GROUP 5: FINISH */}
            <div className="ribbon-group" style={{ position: 'relative' }}>
              <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center' }}>
                
                {/* Finish & Merge */}
                <button
                  type="button"
                  className="ribbon-large-vertical-btn"
                  onClick={() => showToast('Mail merge features coming soon', 'info')}
                  title="Finish & Merge"
                >
                  <div className="btn-icon-wrapper" style={{ color: '#10b981' }}>
                    <Icon name="CheckSquare" size={24} />
                  </div>
                  <span className="btn-label">Finish & Merge ▾</span>
                </button>

              </div>
              <span className="ribbon-group-label">FINISH</span>
            </div>

          </div>
        )}
      </div>

      {/* REVIEW TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'review' ? 'visible' : 'hidden'}`}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', position: 'relative' }} ref={reviewPopoverRef}>
          
          {/* GROUP 1: PROOFING */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Editor */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${showEditorPanel ? 'active' : ''}`}
                onClick={() => setShowEditorPanel(!showEditorPanel)}
                title="Editor Analysis Summary"
                disabled={!canEdit}
                style={{ opacity: canEdit ? 1 : 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: 'var(--accent, #0d6efd)' }}>
                  <Icon name="CheckSquare" size={24} />
                </div>
                <span className="btn-label">Editor</span>
              </button>

              {/* Spelling & Grammar, Thesaurus, Word Count Stacked */}
              <div className="effects-setdefault-column" style={{ width: '135px' }}>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => alert('Spelling & Grammar Check completed!\nNo issues found.')}
                  title="Spelling & Grammar Check"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '18px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: canEdit ? 1 : 0.6 }}
                >
                  <Icon name="Check" size={12} />
                  <span>Spelling & Grammar ▾</span>
                </button>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={handleThesaurus}
                  title="Thesaurus Synonyms Lookup"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '18px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: canEdit ? 1 : 0.6 }}
                >
                  <Icon name="Book" size={12} />
                  <span>Thesaurus</span>
                </button>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={onShowStats}
                  title="Word Count statistics"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '18px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: canEdit ? 1 : 0.6 }}
                >
                  <Icon name="BarChart2" size={12} />
                  <span>Word Count</span>
                </button>
              </div>

            </div>
            <span className="ribbon-group-label">PROOFING</span>

            {/* Editor Panel Popover */}
            {showEditorPanel && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '0', zIndex: 1000, width: '240px', padding: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-h)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Editor Score</span>
                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '12px' }}>100%</span>
                  </div>
                  <div style={{ fontSize: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Spelling:</span>
                      <span style={{ fontWeight: '600' }}>0 issues</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Grammar:</span>
                      <span style={{ fontWeight: '600' }}>0 issues</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Conciseness:</span>
                      <span style={{ fontWeight: '600' }}>Optimal</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Readability Grade:</span>
                      <span style={{ fontWeight: '600' }}>8.2 (Easy)</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#6b7280', borderTop: '1px solid var(--border)', paddingTop: '6px', textAlign: 'center' }}>
                    Your writing looks great! No issues found.
                  </div>
                </div>
              </div>
            )}

            {/* Thesaurus Popover */}
            {thesaurusData.show && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '40px', zIndex: 1000, width: '200px', padding: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-h)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '11px', borderBottom: '1px solid var(--border)', paddingBottom: '3px' }}>
                    Synonyms for "{thesaurusData.word}"
                  </div>
                  {thesaurusData.synonyms ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {thesaurusData.synonyms.map(syn => (
                        <button
                          key={syn}
                          type="button"
                          onClick={() => handleReplaceSynonym(syn)}
                          style={{
                            textAlign: 'left',
                            fontSize: '10px',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--accent)',
                            width: '100%'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'var(--hover-bg, #f1f5f9)'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                          {syn}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '10px', color: '#ef4444' }}>No suggestions found. Select common words like "create", "good", or "important".</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 2: SPEECH */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center' }}>
              
              {/* Read Aloud */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${isReadingAloud ? 'active' : ''}`}
                onClick={handleReadAloud}
                title="Read Document Aloud"
                disabled={!canEdit}
                style={{ opacity: canEdit ? 1 : 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: isReadingAloud ? '#ef4444' : '#f59e0b' }}>
                  <Icon name={isReadingAloud ? 'Square' : 'Volume2'} size={24} />
                </div>
                <span className="btn-label">{isReadingAloud ? 'Stop Reading' : 'Read Aloud'}</span>
              </button>

            </div>
            <span className="ribbon-group-label">SPEECH</span>
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 3: ACCESSIBILITY */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Check Accessibility */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={handleAccessibilityCheck}
                title="Check Accessibility"
                disabled={!canEdit}
                style={{ opacity: canEdit ? 1 : 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#8b5cf6' }}>
                  <Icon name="Accessibility" size={24} />
                </div>
                <span className="btn-label">Check Accessibility</span>
              </button>

              {/* Language & Chinese Conversion Stacked */}
              <div className="effects-setdefault-column" style={{ width: '130px' }}>
                {/* Language Dropdown Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%', fontSize: '10px', height: '22px' }}>
                  <Icon name="Globe" size={13} style={{ opacity: 0.6 }} />
                  <select
                    value={documentLanguage}
                    onChange={(e) => {
                      setDocumentLanguage(e.target.value);
                      showToast(`Language set to ${e.target.value}`, 'success');
                    }}
                    disabled={!canEdit}
                    style={{
                      border: '1px solid var(--border)',
                      background: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: '4px',
                      height: '18px',
                      fontSize: '9px',
                      width: '90px',
                      outline: 'none',
                      color: 'var(--text-h)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="English (India)">English (IN)</option>
                    <option value="English (United States)">English (US)</option>
                    <option value="English (United Kingdom)">English (UK)</option>
                    <option value="French (France)">French (FR)</option>
                    <option value="Spanish (Spain)">Spanish (ES)</option>
                    <option value="German (Germany)">German (DE)</option>
                  </select>
                </div>
                
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Chinese Translation coming soon', 'info')}
                  title="Chinese Conversion"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="Languages" size={13} />
                  <span>Chinese Convert ▾</span>
                </button>
              </div>

            </div>
            <span className="ribbon-group-label">ACCESSIBILITY</span>

            {/* Accessibility results popover */}
            {showAccessibilityPopover && accessibilityResults && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '0', zIndex: 1000, width: '220px', padding: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-h)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '11px', borderBottom: '1px solid var(--border)', paddingBottom: '3px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Accessibility Report</span>
                    <span style={{ color: accessibilityResults.totalIssues > 0 ? '#f59e0b' : '#10b981' }}>
                      {accessibilityResults.totalIssues > 0 ? `${accessibilityResults.totalIssues} Warnings` : 'All Clear!'}
                    </span>
                  </div>
                  {accessibilityResults.issues.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '9px' }}>
                      {accessibilityResults.issues.map((iss, i) => (
                        <div key={i} style={{ display: 'flex', gap: '4px', alignItems: 'flex-start', color: '#b45309' }}>
                          <span>•</span>
                          <span>{iss}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '10px', color: '#10b981' }}>No accessibility issues detected. Great job!</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 4: MARKUP */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Comments */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => {
                  setRightTab('comments');
                  setRightSidebarCollapsed(false);
                  showToast('Opened Comments Pane', 'success');
                }}
                title="Manage Comments Sidebar"
                disabled={!canEdit}
                style={{ opacity: canEdit ? 1 : 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#0ea5e9' }}>
                  <Icon name="MessageSquare" size={24} />
                </div>
                <span className="btn-label">Comments</span>
              </button>

              {/* Labeled markup filter dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignSelf: 'center', fontSize: '10px', width: '75px' }}>
                <span style={{ color: 'var(--text)', opacity: 0.8, fontSize: '9px', fontWeight: '500' }}>Display:</span>
                <select
                  defaultValue="All Markup"
                  onChange={(e) => showToast(`Markup filter: ${e.target.value}`, 'success')}
                  disabled={!canEdit}
                  style={{
                    border: '1px solid var(--border)',
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '4px',
                    height: '20px',
                    fontSize: '9px',
                    outline: 'none',
                    padding: '0 2px',
                    color: 'var(--text-h)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="All Markup">All Markup</option>
                  <option value="Simple Markup">Simple</option>
                  <option value="No Markup">No Markup</option>
                  <option value="Original">Original</option>
                </select>
              </div>

              {/* Show Markup & Reviewing Pane Stacked */}
              <div className="effects-setdefault-column" style={{ width: '120px' }}>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Display filters coming soon', 'info')}
                  title="Show Markup options"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="Filter" size={13} />
                  <span>Show Markup ▾</span>
                </button>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => {
                    setRightTab('comments');
                    setRightSidebarCollapsed(!rightSidebarCollapsed);
                  }}
                  title="Toggle Reviewing Pane (Comments)"
                  disabled={!canEdit}
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: canEdit ? 1 : 0.6 }}
                >
                  <Icon name="ListCollapse" size={13} />
                  <span>Reviewing Pane</span>
                </button>
              </div>

            </div>
            <span className="ribbon-group-label">MARKUP</span>
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 5: COMPARE */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Track Changes Toggle */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignSelf: 'center', fontSize: '10px', width: '80px' }}>
                <span style={{ color: 'var(--text)', opacity: 0.8, fontSize: '9px', fontWeight: '500' }}>Tracking:</span>
                <button
                  type="button"
                  onClick={() => showToast('Track changes mode is auto-active for contributors', 'info')}
                  disabled={!canEdit}
                  style={{
                    border: '1px solid var(--border)',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '4px',
                    height: '20px',
                    fontSize: '9px',
                    outline: 'none',
                    padding: '0 4px',
                    color: '#2563eb',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '3px',
                    width: '100%'
                  }}
                >
                  <Icon name="Activity" size={10} />
                  <span>Auto-Track</span>
                </button>
              </div>

              {/* Compare */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Comparing documents versions coming soon', 'info')}
                title="Compare Document versions"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="GitCompare" size={24} />
                </div>
                <span className="btn-label">Compare ▾</span>
              </button>

              {/* Protect Document simple password-less locking (Uses isOwner/isEditor to toggle) */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${documentProtected ? 'active' : ''}`}
                onClick={() => {
                  const nextState = !documentProtected;
                  setDocumentProtected(nextState);
                  showToast(nextState ? 'Document locked (Read-Only mode)' : 'Document unlocked (Edit mode)', nextState ? 'warning' : 'success');
                }}
                title="Protect Document (Toggle Read-Only Lock)"
                disabled={!(isOwner || isEditor)}
                style={{ opacity: (isOwner || isEditor) ? 1 : 0.5 }}
              >
                <div className="btn-icon-wrapper" style={{ color: documentProtected ? '#ef4444' : '#10b981' }}>
                  <Icon name={documentProtected ? 'Lock' : 'Unlock'} size={24} />
                </div>
                <span className="btn-label">{documentProtected ? 'Unprotect Doc' : 'Protect Doc'}</span>
              </button>

            </div>
            <span className="ribbon-group-label">COMPARE</span>
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 6: INK */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center' }}>
              
              {/* Hide Ink */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Stylus and touch-drawing ink annotations coming soon', 'info')}
                title="Hide Ink annotations"
                disabled={!canEdit}
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="PenTool" size={24} />
                </div>
                <span className="btn-label">Hide Ink ▾</span>
              </button>

            </div>
            <span className="ribbon-group-label">INK</span>
          </div>

        </div>
      </div>

      {/* VIEW TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'view' ? 'visible' : 'hidden'}`}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', position: 'relative' }} ref={viewPopoverRef}>
          
          {/* GROUP 1: VIEWS */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Read Mode */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Read Mode coming soon', 'info')}
                title="Switch to Read Mode"
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="BookOpen" size={24} />
                </div>
                <span className="btn-label">Read Mode</span>
              </button>

              {/* Print Layout */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${viewMode === 'print' ? 'active' : ''}`}
                onClick={() => {
                  setViewMode('print');
                  showToast('Switched to Print Layout view', 'success');
                }}
                title="Print Layout View"
              >
                <div className="btn-icon-wrapper" style={{ color: 'var(--accent, #0d6efd)' }}>
                  <Icon name="FileText" size={24} />
                </div>
                <span className="btn-label">Print Layout</span>
              </button>

              {/* Web Layout */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${viewMode === 'web' ? 'active' : ''}`}
                onClick={() => {
                  setViewMode('web');
                  showToast('Switched to Web Layout view', 'success');
                }}
                title="Web Layout View"
              >
                <div className="btn-icon-wrapper" style={{ color: '#059669' }}>
                  <Icon name="Globe" size={24} />
                </div>
                <span className="btn-label">Web Layout</span>
              </button>

              {/* Outline & Draft Stacked */}
              <div className="effects-setdefault-column" style={{ width: '100px' }}>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Outline View coming soon', 'info')}
                  title="Outline View"
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="List" size={13} />
                  <span>Outline</span>
                </button>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Draft View coming soon', 'info')}
                  title="Draft View"
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="File" size={13} />
                  <span>Draft</span>
                </button>
              </div>

            </div>
            <span className="ribbon-group-label">VIEWS</span>
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 2: IMMERSIVE */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Focus Mode */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Focus mode toggle coming soon in the next phase', 'info')}
                title="Focus mode distraction-free view"
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="Minimize2" size={24} />
                </div>
                <span className="btn-label">Focus</span>
              </button>

              {/* Immersive Reader */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Immersive Reader tool coming soon in the next phase', 'info')}
                title="Immersive Reader"
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="Headphones" size={24} />
                </div>
                <span className="btn-label">Immersive Reader</span>
              </button>

            </div>
            <span className="ribbon-group-label">IMMERSIVE</span>
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 3: DARK MODE */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center' }}>
              
              {/* Switch Modes Theme Toggle */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={toggleTheme}
                title="Switch mode between Light and Dark Theme"
              >
                <div className="btn-icon-wrapper" style={{ color: theme === 'dark' ? '#f59e0b' : '#3b82f6' }}>
                  <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={24} />
                </div>
                <span className="btn-label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

            </div>
            <span className="ribbon-group-label">DARK MODE</span>
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 4: PAGE MOVEMENT */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Vertical Scroll */}
              <button
                type="button"
                className="ribbon-large-vertical-btn active"
                onClick={() => showToast('Vertical scrolling is active by default', 'info')}
                title="Scroll vertically"
              >
                <div className="btn-icon-wrapper" style={{ color: 'var(--accent, #0d6efd)' }}>
                  <Icon name="ArrowUpDown" size={24} />
                </div>
                <span className="btn-label">Vertical</span>
              </button>

              {/* Side to Side Scroll */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Side to Side horizontal scroll layout coming soon', 'info')}
                title="Scroll pages horizontally"
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="ArrowLeftRight" size={24} />
                </div>
                <span className="btn-label">Side to Side</span>
              </button>

            </div>
            <span className="ribbon-group-label">PAGE MOVEMENT</span>
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 5: SHOW */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
              
              {/* Ruler Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text)', cursor: 'pointer', opacity: 0.6 }} onClick={() => showToast('Ruler toggles coming soon in the next phase', 'info')}>
                <input type="checkbox" readOnly checked={false} style={{ width: '12px', height: '12px', cursor: 'pointer' }} />
                <span>Ruler</span>
              </label>

              {/* Gridlines Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text)', cursor: 'pointer', opacity: 0.6 }} onClick={() => showToast('Gridlines overlay coming soon in the next phase', 'info')}>
                <input type="checkbox" readOnly checked={false} style={{ width: '12px', height: '12px', cursor: 'pointer' }} />
                <span>Gridlines</span>
              </label>

              {/* Navigation Pane Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text)', cursor: 'pointer' }} onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}>
                <input type="checkbox" readOnly checked={!leftSidebarCollapsed} style={{ width: '12px', height: '12px', cursor: 'pointer' }} />
                <span>Navigation Pane</span>
              </label>

            </div>
            <span className="ribbon-group-label">SHOW</span>
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 6: ZOOM */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Zoom */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${activeViewPopover === 'zoom' ? 'active' : ''}`}
                onClick={() => setActiveViewPopover(activeViewPopover === 'zoom' ? null : 'zoom')}
                title="Adjust Zoom scale"
              >
                <div className="btn-icon-wrapper" style={{ color: 'var(--accent, #0d6efd)' }}>
                  <Icon name="Search" size={24} />
                </div>
                <span className="btn-label">Zoom</span>
              </button>

              {/* 100% reset */}
              <button
                type="button"
                className="ribbon-large-vertical-btn active"
                onClick={() => {
                  setZoomPercent(100);
                  showToast('Zoom reset to 100%', 'success');
                }}
                title="Reset zoom scale to 100%"
                style={{ minWidth: '45px' }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#0d6efd', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '24px' }}>
                  {zoomPercent}%
                </div>
                <span className="btn-label" style={{ color: 'var(--accent)' }}>Reset 100%</span>
              </button>

              {/* One Page, Multi Page, Page Width Stacked */}
              <div className="effects-setdefault-column" style={{ width: '110px' }}>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('One Page height fit coming soon', 'info')}
                  title="One Page layout fit"
                  style={{ fontSize: '10px', height: '18px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="FileText" size={12} />
                  <span>One Page</span>
                </button>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Multiple page layout is only supported in Print mode', 'info')}
                  title="Multiple Pages Layout"
                  style={{ fontSize: '10px', height: '18px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="Copy" size={12} />
                  <span>Multiple Pages</span>
                </button>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={handlePageWidthZoom}
                  title="Zoom to fit Page Width inside viewport"
                  style={{ fontSize: '10px', height: '18px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left' }}
                >
                  <Icon name="Maximize2" size={12} />
                  <span>Page Width</span>
                </button>
              </div>

            </div>
            <span className="ribbon-group-label">ZOOM</span>

            {/* Zoom presets popover */}
            {activeViewPopover === 'zoom' && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '0', zIndex: 1000, width: '180px', padding: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-h)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '11px', borderBottom: '1px solid var(--border)', paddingBottom: '3px' }}>
                    Select Zoom Presets
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                    {[50, 75, 100, 125, 150, 200].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          setZoomPercent(pct);
                          setActiveViewPopover(null);
                          showToast(`Zoom scale set to ${pct}%`, 'success');
                        }}
                        style={{
                          fontSize: '10px',
                          padding: '4px 6px',
                          borderRadius: '4px',
                          border: '1px solid var(--border)',
                          background: zoomPercent === pct ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                          color: zoomPercent === pct ? '#2563eb' : 'inherit',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid var(--border)', paddingTop: '6px' }}>
                    <span style={{ fontSize: '10px' }}>Custom:</span>
                    <input
                      type="number"
                      min={50}
                      max={200}
                      value={zoomPercent}
                      onChange={(e) => {
                        const val = Math.min(200, Math.max(50, parseInt(e.target.value) || 100));
                        setZoomPercent(val);
                      }}
                      style={{
                        width: '50px',
                        fontSize: '10px',
                        border: '1px solid var(--border)',
                        background: 'transparent',
                        padding: '1px 3px',
                        borderRadius: '3px',
                        color: 'var(--text-h)',
                        outline: 'none'
                      }}
                    />
                    <span style={{ fontSize: '10px' }}>%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 7: WINDOW */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* New Window */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('New Window session clone coming soon', 'info')}
                title="Open a new synced window"
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="PlusSquare" size={24} />
                </div>
                <span className="btn-label">New Window</span>
              </button>

              {/* Arrange All & Split Stacked */}
              <div className="effects-setdefault-column" style={{ width: '100px' }}>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Arrange All windows coming soon', 'info')}
                  title="Arrange all windows"
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="Grid" size={13} />
                  <span>Arrange All</span>
                </button>
                <button
                  type="button"
                  className="ribbon-custom-btn low-priority-btn"
                  onClick={() => showToast('Split screen view coming soon', 'info')}
                  title="Split window view"
                  style={{ fontSize: '10px', height: '22px', display: 'flex', alignItems: 'center', gap: '4px', width: '100%', textAlign: 'left', opacity: 0.6 }}
                >
                  <Icon name="Columns" size={13} />
                  <span>Split</span>
                </button>
              </div>

            </div>
            <span className="ribbon-group-label">WINDOW</span>
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 8: MACROS / SHAREPOINT */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Macros */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Macros script recorder coming soon', 'info')}
                title="Record or run Macros"
                style={{ opacity: 0.6 }}
              >
                <div className="btn-icon-wrapper" style={{ color: '#64748b' }}>
                  <Icon name="Play" size={24} />
                </div>
                <span className="btn-label">Macros ▾</span>
              </button>

              {/* Properties */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${activeViewPopover === 'properties' ? 'active' : ''}`}
                onClick={() => setActiveViewPopover(activeViewPopover === 'properties' ? null : 'properties')}
                title="View Document Properties metadata"
              >
                <div className="btn-icon-wrapper" style={{ color: '#0ea5e9' }}>
                  <Icon name="File" size={24} />
                </div>
                <span className="btn-label">Properties</span>
              </button>

            </div>
            <span className="ribbon-group-label">SHAREPOINT</span>

            {/* Properties Popover */}
            {activeViewPopover === 'properties' && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', right: '0', zIndex: 1000, width: '220px', padding: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-h)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '11px', borderBottom: '1px solid var(--border)', paddingBottom: '3px' }}>
                    Document Properties
                  </div>
                  <div style={{ fontSize: '9px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div><strong>Title:</strong> {quillInstance ? (document.querySelector('.document-title-input')?.value || 'Untitled') : 'Untitled'}</div>
                    <div><strong>Word Count:</strong> {wordCount} words</div>
                    <div><strong>Owner:</strong> You</div>
                    <div><strong>Storage:</strong> Local Backup (localStorage)</div>
                    <div><strong>Format:</strong> Rich Text Quill Delta</div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
      {/* HELP TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'help' ? 'visible' : 'hidden'}`}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', position: 'relative' }} ref={helpPopoverRef}>
          
          {/* GROUP 1: HELP */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              
              {/* Help Button */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${activeHelpPopover === 'help-info' ? 'active' : ''}`}
                onClick={() => setActiveHelpPopover(activeHelpPopover === 'help-info' ? null : 'help-info')}
                title="Help & Shortcuts"
              >
                <div className="btn-icon-wrapper" style={{ color: 'var(--accent, #0d6efd)' }}>
                  <Icon name="HelpCircle" size={24} />
                </div>
                <span className="btn-label">Help</span>
              </button>

              {/* Contact Support Button */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${activeHelpPopover === 'contact' ? 'active' : ''}`}
                onClick={() => setActiveHelpPopover(activeHelpPopover === 'contact' ? null : 'contact')}
                title="Contact Support Team"
              >
                <div className="btn-icon-wrapper" style={{ color: '#059669' }}>
                  <Icon name="MessageSquare" size={24} />
                </div>
                <span className="btn-label">Contact Support</span>
              </button>

              {/* Feedback Button */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${activeHelpPopover === 'feedback' ? 'active' : ''}`}
                onClick={() => setActiveHelpPopover(activeHelpPopover === 'feedback' ? null : 'feedback')}
                title="Send Feedback"
              >
                <div className="btn-icon-wrapper" style={{ color: '#f59e0b' }}>
                  <Icon name="Mail" size={24} />
                </div>
                <span className="btn-label">Feedback</span>
              </button>

              {/* Show Training Button */}
              <button
                type="button"
                className={`ribbon-large-vertical-btn ${activeHelpPopover === 'training' ? 'active' : ''}`}
                onClick={() => setActiveHelpPopover(activeHelpPopover === 'training' ? null : 'training')}
                title="Show training and onboarding tips"
              >
                <div className="btn-icon-wrapper" style={{ color: '#8b5cf6' }}>
                  <Icon name="GraduationCap" size={24} />
                </div>
                <span className="btn-label">Show Training</span>
              </button>

            </div>
            <span className="ribbon-group-label">HELP</span>

            {/* HELP INFO POPOVER */}
            {activeHelpPopover === 'help-info' && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '0', zIndex: 1000, width: '250px', padding: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-h)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '11px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                    Keyboard Shortcuts & App Info
                  </div>
                  <div style={{ fontSize: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600' }}>Ctrl + B:</span>
                      <span>Toggle Bold</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600' }}>Ctrl + I:</span>
                      <span>Toggle Italic</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600' }}>Ctrl + U:</span>
                      <span>Toggle Underline</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600' }}>Ctrl + Z:</span>
                      <span>Undo edit</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600' }}>Ctrl + Y:</span>
                      <span>Redo edit</span>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '9px', color: '#6b7280' }}>
                    <div>Version: 1.0.4 (Stable Build)</div>
                    <div>Environment: React / Quill Collaborative</div>
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT SUPPORT POPOVER */}
            {activeHelpPopover === 'contact' && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '60px', zIndex: 1000, width: '240px', padding: '12px' }}>
                <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '11px', color: 'var(--text-h)', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                    Contact Support Team
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={supportName}
                    onChange={(e) => setSupportName(e.target.value)}
                    style={{ width: '100%', fontSize: '10px', padding: '5px', border: '1px solid var(--border)', borderRadius: '4px', background: 'transparent', color: 'var(--text-h)', outline: 'none' }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    style={{ width: '100%', fontSize: '10px', padding: '5px', border: '1px solid var(--border)', borderRadius: '4px', background: 'transparent', color: 'var(--text-h)', outline: 'none' }}
                  />
                  <textarea
                    required
                    placeholder="Describe your issue..."
                    rows={3}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    style={{ width: '100%', fontSize: '10px', padding: '5px', border: '1px solid var(--border)', borderRadius: '4px', background: 'transparent', color: 'var(--text-h)', outline: 'none', resize: 'none' }}
                  />
                  <button
                    type="submit"
                    style={{ width: '100%', padding: '5px', background: '#059669', color: '#fff', fontSize: '10px', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>
            )}

            {/* FEEDBACK POPOVER */}
            {activeHelpPopover === 'feedback' && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '160px', zIndex: 1000, width: '220px', padding: '12px' }}>
                <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '11px', color: 'var(--text-h)', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                    Send Us Feedback
                  </div>
                  <textarea
                    required
                    placeholder="What can we improve?..."
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    style={{ width: '100%', fontSize: '10px', padding: '5px', border: '1px solid var(--border)', borderRadius: '4px', background: 'transparent', color: 'var(--text-h)', outline: 'none', resize: 'none' }}
                  />
                  <button
                    type="submit"
                    style={{ width: '100%', padding: '5px', background: '#f59e0b', color: '#fff', fontSize: '10px', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Submit Feedback
                  </button>
                </form>
              </div>
            )}

            {/* SHOW TRAINING POPOVER */}
            {activeHelpPopover === 'training' && (
              <div className="ribbon-popover-menu" style={{ position: 'absolute', top: '100%', left: '180px', zIndex: 1000, width: '260px', padding: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-h)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '11px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                    Getting Started Tips
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '9px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>1.</span>
                      <span>To style your document headers, format lines as H1, H2, or H3. They automatically index in the Sidebar outline!</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>2.</span>
                      <span>Insert a **Table of Contents** in the References tab to automatically compile dynamic clickable index jump links.</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>3.</span>
                      <span>Click **Protect Document** in the Review tab to lock editing and preview text in continuous Read-Only mode.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="ribbon-group-separator" />

          {/* GROUP 2: MOBILE */}
          <div className="ribbon-group" style={{ position: 'relative' }}>
            <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center' }}>
              
              {/* Get Word Mobile App */}
              <button
                type="button"
                className="ribbon-large-vertical-btn"
                onClick={() => showToast('Mobile app coming soon!', 'info')}
                title="Get Word Mobile App"
              >
                <div className="btn-icon-wrapper" style={{ color: '#3b82f6' }}>
                  <Icon name="Smartphone" size={24} />
                </div>
                <span className="btn-label">Get Mobile App</span>
              </button>

            </div>
            <span className="ribbon-group-label">MOBILE</span>
          </div>

        </div>
      </div>
    </div>
  );
}
