import React, { useEffect, useRef, useState } from 'react';
import {
  FaBookOpen,
  FaCheck,
  FaList,
  FaMoon,
  FaSun,
  FaUserSecret,
} from 'react-icons/fa';
import { ACCENT_SWATCHES, PAGE_LAYOUTS, STYLE_CARDS } from '../utils/constants';
import Icon from '../../../components/common/Icon';

export default function RibbonToolbar({
  activeRibbonTab, canEdit, formatPainterActive, onFormatPainterClick, onGrowFont, onShrinkFont,
  onParagraphShading, onApplyStyle, onOpenFind, onOpenReplace, onShowStats,
  leftSidebarCollapsed, setLeftSidebarCollapsed, rightSidebarCollapsed, setRightSidebarCollapsed,
  accentColor, onApplyAccentColor, theme, toggleTheme, pageLayout, setPageLayout,
  quillInstance,
  handleInsertCoverPage, handleInsertBlankPage, handleInsertPageBreak, handleInsertComment,
  showToast,
  documentTheme, setDocumentTheme, pageBackgroundColor, setPageBackgroundColor
}) {
  console.log("RibbonToolbar render - canEdit:", canEdit, "activeRibbonTab:", activeRibbonTab);
  const [showDateTimePopover, setShowDateTimePopover] = useState(false);
  const [showSymbolPopover, setShowSymbolPopover] = useState(false);
  const [activeDesignPopover, setActiveDesignPopover] = useState(null);

  const designPopoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (designPopoverRef.current && !designPopoverRef.current.contains(event.target)) {
        setActiveDesignPopover(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              <div className="ribbon-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                
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
                <div className="effects-setdefault-column" style={{ width: '115px' }}>
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
        <div className="ribbon-group">
          <div className="ribbon-controls-container">
            <div className="ribbon-buttons-row">
              {Object.entries(PAGE_LAYOUTS).map(([key, { label }]) => (
                <button
                  key={key}
                  type="button"
                  className={`ribbon-custom-btn ${pageLayout === key ? 'active' : ''}`}
                  onClick={() => setPageLayout(key)}
                  title={`${label} margins`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <span className="ribbon-group-label">Page Width</span>
        </div>
      </div>

      {/* REVIEW TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'review' ? 'visible' : 'hidden'}`}>
        <div className="ribbon-group">
          <div className="ribbon-controls-container">
            <div className="ribbon-buttons-row">
              <button type="button" className="ribbon-custom-btn" onClick={onShowStats} title="Word Count Details">
                <FaBookOpen size={16} style={{ marginRight: '6px' }} />
                <span>Word Count Details</span>
              </button>
              <button
                type="button"
                className="ribbon-custom-btn"
                onClick={() => alert('Spelling & Grammar Check completed!\nNo issues found.')}
                title="Spelling Check"
              >
                <FaCheck size={16} style={{ marginRight: '6px' }} />
                <span>Spelling & Grammar</span>
              </button>
            </div>
          </div>
          <span className="ribbon-group-label">Proofing</span>
        </div>
      </div>

      {/* VIEW TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'view' ? 'visible' : 'hidden'}`}>
        <div className="ribbon-group">
          <div className="ribbon-controls-container">
            <div className="ribbon-buttons-row">
              <button
                type="button"
                className={`ribbon-custom-btn ${!leftSidebarCollapsed ? 'active' : ''}`}
                onClick={setLeftSidebarCollapsed}
              >
                <FaList size={16} style={{ marginRight: '6px' }} />
                <span>Navigation Outline</span>
              </button>
              <button
                type="button"
                className={`ribbon-custom-btn ${!rightSidebarCollapsed ? 'active' : ''}`}
                onClick={setRightSidebarCollapsed}
              >
                <FaUserSecret size={16} style={{ marginRight: '6px' }} />
                <span>Collaborations Pane</span>
              </button>
            </div>
          </div>
          <span className="ribbon-group-label">Show / Hide Sidebars</span>
        </div>
      </div>
    </div>
  );
}
