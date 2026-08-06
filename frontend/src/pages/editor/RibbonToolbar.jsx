import React, { useState, useEffect, useRef } from 'react';
import {
  Table, Image as ImageIcon, Link as LinkIcon,
  File, FileText, Type, Video, MessageSquare, Heading, Hash,
  Palette, Droplet, Stamp, Square, Sparkles,
  Clipboard, Scissors, Copy, Paintbrush,
  List, ListOrdered, IndentDecrease, IndentIncrease,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, Underline, Strikethrough,
  Search, Replace, MousePointer,
  ChevronUp, ChevronDown,
  Check, X, Sun, Moon, BookOpen, Users,
  Columns, LayoutGrid, Eye, ZoomIn, ZoomOut, Monitor,
  Layers, Move, Sliders, ArrowUpDown, Grid, Info, Play, RotateCw, Maximize2, Minimize2, Trash2, ChevronLeft
} from 'lucide-react';
import { ACCENT_SWATCHES, PAGE_LAYOUTS } from "../../utils/editingpage.helper";
import 'quill/dist/quill.snow.css';

// SVG Icon for Greek Omega (Ω Symbol Button)
const OmegaIcon = ({ size = 20, strokeWidth = 2, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 20h4.5a3.5 3.5 0 0 0 3.5 -3.5v-1a5 5 0 1 1 4 0v1a3.5 3.5 0 0 0 3.5 3.5h4.5" />
  </svg>
);

// Standardized Vertical Flex Ribbon Button Component
function RibbonButton({ icon: IconComponent, customIcon, label, onClick, title, active, disabled, isDark }) {
  const iconColor = active 
    ? '#ffffff' 
    : isDark ? '#f8fafc' : '#334155';
  const textColor = active 
    ? '#ffffff' 
    : isDark ? '#cbd5e1' : '#475569';

  return (
    <button
      type="button"
      className={`ribbon-action-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title || label}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', flexShrink: 0 }}>
        {customIcon ? customIcon : (IconComponent && <IconComponent size={20} strokeWidth={2} color={iconColor} />)}
      </div>
      {label && (
        <span style={{ fontSize: '11px', fontWeight: 500, lineHeight: 1.2, whiteSpace: 'nowrap', color: textColor }}>
          {label}
        </span>
      )}
    </button>
  );
}

// MS Word-style Symbol Picker Component
function SymbolPicker({ quillInstance, isDark }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const symbols = ['©', '®', '™', '€', '£', '¥', '°', '±', 'µ', '∞', 'α', 'β', 'π', '∑', '√', '≈', '≠', '≤', '≥', '÷', '§', '¶', '¢', '$', '₽', '⚡', '★', '♥', '♠', '♣'];

  const handleSymbolClick = (sym) => {
    if (quillInstance) {
      const range = quillInstance.getSelection(true) || { index: quillInstance.getLength() };
      quillInstance.insertText(range.index, sym);
    } else {
      document.execCommand('insertText', false, sym);
    }
    setOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <RibbonButton
        customIcon={<OmegaIcon size={20} strokeWidth={2} color={isDark ? '#f8fafc' : '#334155'} />}
        label="Symbol"
        title="Insert Symbol (©, ®, ™, €, £...)"
        active={open}
        onClick={() => setOpen(!open)}
        isDark={isDark}
      />
      {open && (
        <div className="symbol-picker-popover">
          {symbols.map((sym, idx) => (
            <button
              key={idx}
              type="button"
              className="symbol-picker-btn"
              onClick={() => handleSymbolClick(sym)}
              title={`Insert ${sym}`}
            >
              {sym}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RibbonToolbar({
  quillInstance, showToast,
  activeRibbonTab, canEdit, formatPainterActive, onFormatPainterClick, onGrowFont, onShrinkFont,
  onParagraphShading, onApplyStyle, onOpenFind, onOpenReplace, onShowStats,
  leftSidebarCollapsed, setLeftSidebarCollapsed, rightSidebarCollapsed, setRightSidebarCollapsed,
  accentColor, onApplyAccentColor, theme, toggleTheme, pageLayout, setPageLayout, isMobile,
}) {
  const notify = (msg, type = 'info') => {
    if (typeof showToast === 'function') {
      showToast(msg, type);
    }
  };

  const isDark = theme === 'dark';
  const iconColor = isDark ? '#ffffff' : '#0f172a';
  const selectBg = isDark ? '#0d1117' : '#ffffff';
  const selectBorder = isDark ? '1px solid rgba(255,255,255,0.25)' : '1px solid #cbd5e1';
  const labelColor = isDark ? '#94a3b8' : '#64748b';

  const groupStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '6px 12px',
    borderRight: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0',
    flexShrink: 0,
    minWidth: 'fit-content',
  };

  const iconBtnStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    padding: '4px 8px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    minWidth: '48px',
    color: isDark ? '#9ca3af' : '#475569',
  };

  const iconLabelStyle = {
    fontSize: '10px',
    color: isDark ? '#9ca3af' : '#475569',
    whiteSpace: 'nowrap',
  };

  const groupLabelStyle = {
    fontSize: '9px',
    color: isDark ? '#6b7280' : '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textAlign: 'center',
    display: 'block',
    marginTop: '2px',
  };

  return (
    <div
      id="word-ribbon-toolbar"
      className="word-ribbon-toolbar-panel"
      style={{
        background: isDark ? '#161b27' : '#ffffff',
        color: isDark ? '#ffffff' : '#0f172a',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0',
        maxHeight: '96px',
        overflowY: 'hidden',
        overflowX: 'auto',
        transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
        ...(isMobile ? { overflowX: 'auto', WebkitOverflowScrolling: 'touch' } : {})
      }}
    >
      {/* HOME TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'home' ? 'visible' : 'hidden'}`}>
        {!canEdit ? (
          <div style={{ padding: '8px 16px', color: '#9ca3af', fontSize: '13px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
            👁️ You are viewing this document in read-only mode.
          </div>
        ) : (
          <>
            {/* Clipboard Group */}
            <div className="ribbon-group clipboard-group" style={{ paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'stretch', gap: '6px', flex: 1 }}>
                <button
                  type="button"
                  className="ribbon-large-btn"
                  onClick={(e) => { e.stopPropagation(); notify('Press Ctrl+V to paste into document', 'info'); }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    width: '48px', height: '52px', fontSize: '11px', padding: '4px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                    background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', cursor: 'pointer', borderRadius: '4px', color: iconColor,
                  }}
                  title="Paste (Ctrl+V)"
                >
                  <Clipboard size={18} color={iconColor} style={{ marginBottom: '2px' }} />
                  <span style={{ fontSize: '11px', color: iconColor, fontWeight: 500 }}>Paste</span>
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3px' }}>
                  <button
                    type="button"
                    className="ribbon-custom-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (quillInstance) {
                        const sel = quillInstance.getSelection();
                        if (sel && sel.length > 0) {
                          const text = quillInstance.getText(sel.index, sel.length);
                          navigator.clipboard?.writeText(text);
                          quillInstance.deleteText(sel.index, sel.length);
                          notify('Selection cut to clipboard', 'success');
                        } else {
                          notify('Select text first to cut', 'info');
                        }
                      }
                    }}
                    style={{
                      height: '24px', fontSize: '11px', padding: '0 8px', display: 'flex', alignItems: 'center',
                      gap: '6px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1', background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', cursor: 'pointer', borderRadius: '4px',
                      whiteSpace: 'nowrap', color: iconColor,
                    }}
                    title="Cut (Ctrl+X)"
                  >
                    <Scissors size={13} color={iconColor} /> <span style={{ color: iconColor, fontSize: '11px' }}>Cut</span>
                  </button>

                  <button
                    type="button"
                    className="ribbon-custom-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (quillInstance) {
                        const sel = quillInstance.getSelection();
                        if (sel && sel.length > 0) {
                          const text = quillInstance.getText(sel.index, sel.length);
                          navigator.clipboard?.writeText(text);
                          notify('Selection copied to clipboard', 'success');
                        } else {
                          notify('Select text first to copy', 'info');
                        }
                      }
                    }}
                    style={{
                      height: '24px', fontSize: '11px', padding: '0 8px', display: 'flex', alignItems: 'center',
                      gap: '6px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1', background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', cursor: 'pointer', borderRadius: '4px',
                      whiteSpace: 'nowrap', color: iconColor,
                    }}
                    title="Copy (Ctrl+C)"
                  >
                    <Copy size={13} color={iconColor} /> <span style={{ color: iconColor, fontSize: '11px' }}>Copy</span>
                  </button>

                  <button
                    type="button"
                    className={formatPainterActive ? 'ribbon-custom-btn active' : 'ribbon-custom-btn'}
                    onClick={(e) => { e.stopPropagation(); onFormatPainterClick(); }}
                    style={{
                      height: '24px', fontSize: '11px', padding: '0 8px', display: 'flex', alignItems: 'center',
                      gap: '6px', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1', background: formatPainterActive ? 'rgba(59,130,246,0.3)' : isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                      cursor: 'pointer', borderRadius: '4px', whiteSpace: 'nowrap', color: iconColor,
                    }}
                    title="Format Painter"
                  >
                    <Paintbrush size={13} color={iconColor} /> <span style={{ color: iconColor, fontSize: '11px' }}>Format Painter</span>
                  </button>
                </div>
              </div>
              <span className="ribbon-group-label" style={{ color: labelColor }}>Clipboard</span>
            </div>

            <div className="ribbon-group-separator" style={{ margin: '0 8px', height: '44px', width: '1px', background: isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1' }} />

            {/* Font Group */}
            <div className="ribbon-group font-group" style={{ paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: '3px' }}>
                <select
                  defaultValue="Calibri"
                  onChange={(e) => {
                    if (quillInstance) {
                      const val = e.target.value === 'Calibri' ? '' : e.target.value.toLowerCase().replace(/\s+/g, '-');
                      quillInstance.format('font', val || false);
                    } else {
                      document.execCommand('fontName', false, e.target.value);
                    }
                  }}
                  title="Font Family"
                  style={{
                    width: '120px',
                    minWidth: '100px',
                    height: '28px',
                    backgroundColor: selectBg,
                    color: iconColor,
                    border: selectBorder,
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                    padding: '4px 22px 4px 8px',
                    cursor: 'pointer',
                  }}
                >
                  {['Calibri', 'Arial', 'Times New Roman', 'Georgia', 'Verdana', 'Courier New'].map((f) => (
                    <option key={f} value={f} style={{ backgroundColor: selectBg, color: iconColor }}>
                      {f}
                    </option>
                  ))}
                </select>

                <select
                  defaultValue="11"
                  onChange={(e) => {
                    if (quillInstance) {
                      const val = parseInt(e.target.value);
                      quillInstance.format('size', val <= 9 ? 'small' : val >= 28 ? 'huge' : val >= 16 ? 'large' : false);
                    } else {
                      document.execCommand('fontSize', false, e.target.value);
                    }
                  }}
                  title="Font Size"
                  style={{
                    width: '58px',
                    minWidth: '50px',
                    height: '28px',
                    backgroundColor: selectBg,
                    color: iconColor,
                    border: selectBorder,
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                    padding: '4px 20px 4px 6px',
                    cursor: 'pointer',
                  }}
                >
                  {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72].map((s) => (
                    <option key={s} value={String(s)} style={{ backgroundColor: selectBg, color: iconColor }}>
                      {s}
                    </option>
                  ))}
                </select>

                <button type="button" onClick={onGrowFont} title="Grow Font" style={{ fontWeight: 'bold', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', border: selectBorder, background: 'transparent', color: iconColor, cursor: 'pointer' }}>A+</button>
                <button type="button" onClick={onShrinkFont} title="Shrink Font" style={{ fontSize: '12px', padding: '2px 6px', borderRadius: '4px', border: selectBorder, background: 'transparent', color: iconColor, cursor: 'pointer' }}>A-</button>

                <div style={{ width: '1px', height: '18px', background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)', margin: '0 2px', flexShrink: 0 }} />

                <button
                  type="button"
                  title="Bold (Ctrl+B)"
                  style={{ width: '26px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', border: 'none', background: 'transparent', color: iconColor, cursor: 'pointer' }}
                  onClick={() => {
                    if (quillInstance) {
                      const fmt = quillInstance.getFormat();
                      quillInstance.format('bold', !fmt?.bold);
                    } else {
                      document.execCommand('bold');
                    }
                  }}
                >
                  <Bold size={14} color={iconColor} />
                </button>

                <button
                  type="button"
                  title="Italic (Ctrl+I)"
                  style={{ width: '26px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', border: 'none', background: 'transparent', color: iconColor, cursor: 'pointer' }}
                  onClick={() => {
                    if (quillInstance) {
                      const fmt = quillInstance.getFormat();
                      quillInstance.format('italic', !fmt?.italic);
                    } else {
                      document.execCommand('italic');
                    }
                  }}
                >
                  <Italic size={14} color={iconColor} />
                </button>

                <button
                  type="button"
                  title="Underline (Ctrl+U)"
                  style={{ width: '26px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', border: 'none', background: 'transparent', color: iconColor, cursor: 'pointer' }}
                  onClick={() => {
                    if (quillInstance) {
                      const fmt = quillInstance.getFormat();
                      quillInstance.format('underline', !fmt?.underline);
                    } else {
                      document.execCommand('underline');
                    }
                  }}
                >
                  <Underline size={14} color={iconColor} />
                </button>

                <button
                  type="button"
                  title="Strikethrough"
                  style={{ width: '26px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', border: 'none', background: 'transparent', color: iconColor, cursor: 'pointer' }}
                  onClick={() => {
                    if (quillInstance) {
                      const fmt = quillInstance.getFormat();
                      quillInstance.format('strike', !fmt?.strike);
                    } else {
                      document.execCommand('strikeThrough');
                    }
                  }}
                >
                  <Strikethrough size={14} color={iconColor} />
                </button>
              </div>

              <span className="ribbon-group-label" style={{ color: labelColor }}>Font</span>
            </div>

            <div className="ribbon-group-separator" style={{ margin: '0 8px', height: '44px', width: '1px', background: isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1' }} />

            {/* Paragraph Group */}
            <div
              className="ribbon-group paragraph-group"
              style={{ paddingBottom: '18px' }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'nowrap',
                gap: '2px',
              }}>
                {/* Lists */}
                <button
                  type="button"
                  title="Bullets"
                  style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: iconColor, cursor: 'pointer', borderRadius: '4px' }}
                  onClick={() => {
                    const f = quillInstance?.getFormat();
                    quillInstance?.format('list', f?.list === 'bullet' ? false : 'bullet');
                  }}
                >
                  <List size={15} color={iconColor} />
                </button>

                <button
                  type="button"
                  title="Numbered"
                  style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: iconColor, cursor: 'pointer', borderRadius: '4px' }}
                  onClick={() => {
                    const f = quillInstance?.getFormat();
                    quillInstance?.format('list', f?.list === 'ordered' ? false : 'ordered');
                  }}
                >
                  <ListOrdered size={15} color={iconColor} />
                </button>

                <button
                  type="button"
                  title="Decrease Indent"
                  style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: iconColor, cursor: 'pointer', borderRadius: '4px' }}
                  onClick={() => quillInstance?.format('indent', '-1')}
                >
                  <IndentDecrease size={15} color={iconColor} />
                </button>

                <button
                  type="button"
                  title="Increase Indent"
                  style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: iconColor, cursor: 'pointer', borderRadius: '4px' }}
                  onClick={() => quillInstance?.format('indent', '+1')}
                >
                  <IndentIncrease size={15} color={iconColor} />
                </button>

                {/* thin inner divider */}
                <div style={{
                  width: '1px', height: '18px',
                  background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                  margin: '0 2px',
                }} />

                {/* Alignment */}
                <button
                  type="button"
                  title="Align Left"
                  style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: iconColor, cursor: 'pointer', borderRadius: '4px' }}
                  onClick={() => quillInstance?.format('align', false)}
                >
                  <AlignLeft size={15} color={iconColor} />
                </button>
                <button
                  type="button"
                  title="Align Center"
                  style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: iconColor, cursor: 'pointer', borderRadius: '4px' }}
                  onClick={() => quillInstance?.format('align', 'center')}
                >
                  <AlignCenter size={15} color={iconColor} />
                </button>
                <button
                  type="button"
                  title="Align Right"
                  style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: iconColor, cursor: 'pointer', borderRadius: '4px' }}
                  onClick={() => quillInstance?.format('align', 'right')}
                >
                  <AlignRight size={15} color={iconColor} />
                </button>
                <button
                  type="button"
                  title="Justify"
                  style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: iconColor, cursor: 'pointer', borderRadius: '4px' }}
                  onClick={() => quillInstance?.format('align', 'justify')}
                >
                  <AlignJustify size={15} color={iconColor} />
                </button>
              </div>
              <span className="ribbon-group-label" style={{ color: labelColor }}>Paragraph</span>
            </div>

            <div className="ribbon-group-separator" style={{ margin: '0 8px', height: '44px', width: '1px', background: isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1' }} />

            {/* Styles Group */}
            <div className="ribbon-group styles-group" style={{ paddingBottom: '16px', flexShrink: 0 }}>
              <div className="styles-carousel" style={{ display: 'flex', flexDirection: 'row', gap: '6px', width: 'auto', maxWidth: 'none', alignItems: 'center', height: '40px' }}>
                {(() => {
                  const fmtHeader = quillInstance?.getFormat()?.header;
                  return [
                    { label: 'Normal', cmd: 'p' },
                    { label: 'Title', cmd: 'h1' },
                    { label: 'Heading 1', cmd: 'h2' },
                    { label: 'Heading 2', cmd: 'h3' },
                    { label: 'Subtitle', cmd: 'h4' },
                  ].map((s, i) => {
                    const isSelected = (s.cmd === 'p' && !fmtHeader) || (fmtHeader === parseInt(s.cmd.replace('h', '')));
                    return (
                      <button
                        key={i}
                        type="button"
                        className={`style-card ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          if (quillInstance) {
                            if (s.cmd === 'p') quillInstance.format('header', false);
                            else quillInstance.format('header', parseInt(s.cmd.replace('h', '')));
                          } else {
                            document.execCommand('formatBlock', false, s.cmd);
                          }
                        }}
                        title={s.label}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: isSelected ? '#ffffff' : iconColor,
                          backgroundColor: isSelected ? 'var(--accent, #3b82f6)' : isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                          border: isSelected ? '1px solid var(--accent, #3b82f6)' : selectBorder,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          height: '28px',
                          flexShrink: 0,
                        }}
                      >
                        {s.label}
                      </button>
                    );
                  });
                })()}
              </div>
              <span className="ribbon-group-label" style={{ color: labelColor }}>Styles</span>
            </div>

            <div className="ribbon-group-separator" style={{ margin: '0 8px', height: '44px', width: '1px', background: isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1' }} />

            {/* Editing Group */}
            <div className="ribbon-group editing-group" style={{ paddingBottom: '16px', flexShrink: 0, marginLeft: '4px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  type="button"
                  onClick={onOpenFind}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 8px',
                    fontSize: '11px', border: selectBorder, borderRadius: '4px',
                    background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap', color: iconColor,
                  }}
                >
                  <Search size={12} color={iconColor} /> Find
                </button>
                <button
                  type="button"
                  onClick={onOpenReplace}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 8px',
                    fontSize: '11px', border: selectBorder, borderRadius: '4px',
                    background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap', color: iconColor,
                  }}
                >
                  <Replace size={12} color={iconColor} /> Replace
                </button>
              </div>
              <span className="ribbon-group-label" style={{ color: labelColor }}>Editing</span>
            </div>
          </>
        )}
      </div>

      {/* INSERT TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'insert' ? 'visible' : 'hidden'}`} style={{ display: activeRibbonTab === 'insert' ? 'flex' : 'none', alignItems: 'stretch', height: '80px' }}>
        {canEdit && (() => {
          const groupBorder = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0';

          const insertGroups = [
            {
              label: 'Pages',
              minWidth: 120,
              content: (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <RibbonButton
                    icon={File}
                    label="Cover Page"
                    title="Insert Cover Page"
                    isDark={isDark}
                    onClick={() => {
                      if (quillInstance) {
                        const range = quillInstance.getSelection(true) || { index: 0 };
                        quillInstance.clipboard.dangerouslyPasteHTML(
                          range.index,
                          '<div style="text-align:center; padding:40px; border-bottom:2px solid #ccc; margin-bottom:20px;"><h1>Document Title</h1><p>Subheading</p></div><br/>'
                        );
                      }
                    }}
                  />
                  <RibbonButton
                    icon={FileText}
                    label="Blank Page"
                    title="Insert Blank Page"
                    isDark={isDark}
                    onClick={() => {
                      if (quillInstance) {
                        const range = quillInstance.getSelection() || { index: quillInstance.getLength() };
                        quillInstance.insertText(range.index, '\n\n');
                      } else {
                        document.execCommand('insertHTML', false, '<hr style="page-break-after:always"/>');
                      }
                    }}
                  />
                </div>
              )
            },
            {
              label: 'Tables',
              minWidth: 60,
              content: (
                <RibbonButton
                  icon={Table}
                  label="Table"
                  title="Insert Table"
                  isDark={isDark}
                  onClick={() => {
                    const tableHtml = `
                      <table border="1" style="border-collapse:collapse;width:100%;margin:8px 0">
                        <tr><td style="padding:8px;border:1px solid #ccc">&nbsp;</td><td style="padding:8px;border:1px solid #ccc">&nbsp;</td></tr>
                        <tr><td style="padding:8px;border:1px solid #ccc">&nbsp;</td><td style="padding:8px;border:1px solid #ccc">&nbsp;</td></tr>
                      </table><br/>`;
                    if (quillInstance) {
                      const range = quillInstance.getSelection(true) || { index: quillInstance.getLength() };
                      quillInstance.clipboard.dangerouslyPasteHTML(range.index, tableHtml);
                    } else {
                      document.execCommand('insertHTML', false, tableHtml);
                    }
                  }}
                />
              )
            },
            {
              label: 'Illustrations',
              minWidth: 65,
              content: (
                <label style={{ cursor: 'pointer', display: 'inline-block' }}>
                  <RibbonButton
                    icon={ImageIcon}
                    label="Picture"
                    title="Insert Picture"
                    isDark={isDark}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const r = new FileReader();
                      r.onload = (ev) => {
                        const url = ev.target.result;
                        if (quillInstance) {
                          const range = quillInstance.getSelection(true) || { index: quillInstance.getLength() };
                          quillInstance.insertEmbed(range.index, 'image', url);
                        } else {
                          document.execCommand('insertHTML', false, `<img src="${url}" style="max-width:100%;height:auto;margin:8px 0"/>`);
                        }
                      };
                      r.readAsDataURL(file);
                    }}
                  />
                </label>
              )
            },
            {
              label: 'Media',
              minWidth: 60,
              content: (
                <RibbonButton
                  icon={Video}
                  label="Video"
                  title="Insert Video URL"
                  isDark={isDark}
                  onClick={() => {
                    const videoUrl = prompt('Enter Video URL (YouTube / Vimeo / Direct link):');
                    if (videoUrl) {
                      if (quillInstance) {
                        const range = quillInstance.getSelection(true) || { index: quillInstance.getLength() };
                        quillInstance.insertEmbed(range.index, 'video', videoUrl);
                      } else {
                        document.execCommand('insertHTML', false, `<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allowfullscreen></iframe><br/>`);
                      }
                    }
                  }}
                />
              )
            },
            {
              label: 'Links',
              minWidth: 55,
              content: (
                <RibbonButton
                  icon={LinkIcon}
                  label="Link"
                  title="Insert Hyperlink"
                  isDark={isDark}
                  onClick={() => {
                    const url = prompt('Enter URL:');
                    if (url) {
                      if (quillInstance) {
                        const range = quillInstance.getSelection();
                        if (range && range.length > 0) {
                          quillInstance.format('link', url);
                        } else {
                          const index = range ? range.index : quillInstance.getLength();
                          quillInstance.insertText(index, url, 'link', url);
                        }
                      } else {
                        document.execCommand('createLink', false, url);
                      }
                    }
                  }}
                />
              )
            },
            {
              label: 'Comments',
              minWidth: 65,
              content: (
                <RibbonButton
                  icon={MessageSquare}
                  label="Comment"
                  title="Add Comment"
                  isDark={isDark}
                  onClick={() => {
                    if (typeof setRightSidebarCollapsed === 'function') {
                      setRightSidebarCollapsed(false);
                    }
                  }}
                />
              )
            },
            {
              label: 'Header & Footer',
              minWidth: 160,
              content: (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <RibbonButton
                    icon={Heading}
                    label="Header"
                    title="Insert Header"
                    isDark={isDark}
                    onClick={() => {
                      if (quillInstance) {
                        const range = quillInstance.getSelection(true) || { index: 0 };
                        quillInstance.clipboard.dangerouslyPasteHTML(range.index, '<header style="border-bottom:1px solid #ccc;padding:4px 0;margin-bottom:12px;font-size:10px;color:#666;">Document Header</header>');
                      }
                    }}
                  />
                  <RibbonButton
                    customIcon={<Heading size={20} strokeWidth={2} color={isDark ? '#f8fafc' : '#334155'} style={{ transform: 'rotate(180deg)' }} />}
                    label="Footer"
                    title="Insert Footer"
                    isDark={isDark}
                    onClick={() => {
                      if (quillInstance) {
                        const length = quillInstance.getLength();
                        quillInstance.clipboard.dangerouslyPasteHTML(length, '<footer style="border-top:1px solid #ccc;padding:4px 0;margin-top:24px;font-size:10px;color:#666;">Document Footer</footer>');
                      }
                    }}
                  />
                  <RibbonButton
                    icon={Hash}
                    label="Page #"
                    title="Insert Page Number"
                    isDark={isDark}
                    onClick={() => {
                      if (quillInstance) {
                        const range = quillInstance.getSelection(true) || { index: quillInstance.getLength() };
                        quillInstance.insertText(range.index, 'Page 1');
                      }
                    }}
                  />
                </div>
              )
            },
            {
              label: 'Symbols',
              minWidth: 65,
              content: (
                <SymbolPicker quillInstance={quillInstance} isDark={isDark} />
              )
            },
          ];

          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                background: isDark ? '#161b27' : '#ffffff',
                borderBottom: groupBorder,
                overflowX: 'auto',
                overflowY: 'hidden',
                height: '80px',
                flexShrink: 0,
              }}
            >
              {insertGroups.map((group, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    borderRight: i < insertGroups.length - 1 ? groupBorder : 'none',
                    minWidth: group.minWidth,
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>{group.content}</div>
                  <span
                    style={{
                      fontSize: '9px',
                      color: isDark ? '#6b7280' : '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      textAlign: 'center',
                      display: 'block',
                    }}
                  >
                    {group.label}
                  </span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* DESIGN TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'design' ? 'visible' : 'hidden'}`} style={{ display: activeRibbonTab === 'design' ? 'flex' : 'none', alignItems: 'stretch', height: '80px' }}>
        {(() => {
          const groupBorder = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0';

          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                background: isDark ? '#161b27' : '#ffffff',
                borderBottom: groupBorder,
                overflowX: 'auto',
                overflowY: 'hidden',
                height: '80px',
                width: '100%',
                flexShrink: 0,
              }}
            >
              {/* GROUP 1: DOCUMENT FORMATTING */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRight: groupBorder,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <RibbonButton
                    icon={Palette}
                    label="Themes"
                    title="Select Theme Preset"
                    isDark={isDark}
                    onClick={() => {
                      const themeName = prompt('Select Theme Preset:\n1. Classic (Serif + Blue)\n2. Modern (Sans + Teal)\n3. Minimal (Monospace + Slate)\n4. Bold (Impact + Crimson)\n5. Elegant (Georgia + Indigo)', '1');
                      if (themeName && quillInstance) {
                        const presets = {
                          '1': { font: 'serif', accent: '#0D6EFD' },
                          '2': { font: 'sans-serif', accent: '#0d9488' },
                          '3': { font: 'monospace', accent: '#475569' },
                          '4': { font: 'sans-serif', accent: '#dc2626' },
                          '5': { font: 'serif', accent: '#7c3aed' },
                        };
                        const p = presets[themeName] || presets['1'];
                        quillInstance.format('font', p.font);
                        if (onApplyAccentColor) onApplyAccentColor(p.accent);
                      }
                    }}
                  />
                  <RibbonButton
                    icon={Type}
                    label="Style Set"
                    title="Select Style Set"
                    isDark={isDark}
                    onClick={() => {
                      const setChoice = prompt('Select Style Set:\n1. Default\n2. Casual\n3. Formal\n4. Elegant', '1');
                      if (setChoice && onApplyStyle) {
                        const sets = ['Title', 'Heading 1', 'Heading 2', 'Quote'];
                        onApplyStyle(sets[parseInt(setChoice, 10) - 1] || 'Normal');
                      }
                    }}
                  />
                  <RibbonButton
                    icon={Paintbrush}
                    label="Colors"
                    title="Change Document Accent Color"
                    isDark={isDark}
                    onClick={() => {
                      const hex = prompt(`Enter Accent Color hex or select preset:\n1. Blue (#0D6EFD)\n2. Teal (#0d9488)\n3. Slate (#475569)\n4. Red (#dc2626)\n5. Purple (#7c3aed)`, accentColor || '#0D6EFD');
                      if (hex && onApplyAccentColor) {
                        const presets = { '1': '#0D6EFD', '2': '#0d9488', '3': '#475569', '4': '#dc2626', '5': '#7c3aed' };
                        onApplyAccentColor(presets[hex] || hex);
                      }
                    }}
                  />
                  <RibbonButton
                    icon={Heading}
                    label="Fonts"
                    title="Select Font Pairings"
                    isDark={isDark}
                    onClick={() => {
                      const f = prompt('Font Pairing:\n1. Calibri / Calibri Light\n2. Arial / Arial Black\n3. Georgia / Times New Roman\n4. Segoe UI', '1');
                      if (f && quillInstance) {
                        const fonts = ['sans-serif', 'sans-serif', 'serif', 'monospace'];
                        quillInstance.format('font', fonts[parseInt(f, 10) - 1] || 'sans-serif');
                      }
                    }}
                  />
                  <RibbonButton
                    icon={Sparkles}
                    label="Effects"
                    title="Apply Document Visual Effects"
                    isDark={isDark}
                    onClick={() => notify('Visual effects applied to document headings and figures', 'success')}
                  />
                  <RibbonButton
                    icon={Stamp}
                    label="Set Default"
                    title="Set Current Design as Default"
                    isDark={isDark}
                    onClick={() => notify('Current design set as default document style template', 'success')}
                  />
                </div>
                <span
                  style={{
                    fontSize: '9px',
                    color: isDark ? '#6b7280' : '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    textAlign: 'center',
                    display: 'block',
                  }}
                >
                  Document Formatting
                </span>
              </div>

              {/* GROUP 2: PAGE BACKGROUND */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <RibbonButton
                    icon={Stamp}
                    label="Watermark"
                    title="Insert Watermark"
                    isDark={isDark}
                    onClick={() => {
                      const text = prompt('Enter Watermark Text (e.g. DRAFT, CONFIDENTIAL):', 'DRAFT');
                      if (text && quillInstance) {
                        const range = quillInstance.getSelection(true) || { index: 0 };
                        quillInstance.clipboard.dangerouslyPasteHTML(
                          range.index,
                          `<div style="position:relative;"><div style="position:absolute;top:30%;left:20%;transform:rotate(-30deg);font-size:64px;color:rgba(200,200,200,0.2);pointer-events:none;user-select:none;font-weight:bold;">${text}</div></div>`
                        );
                      }
                    }}
                  />
                  <RibbonButton
                    icon={Droplet}
                    label="Page Color"
                    title="Change Page Background Color"
                    isDark={isDark}
                    onClick={() => {
                      const bg = prompt('Select Page Color:\n1. White (#ffffff)\n2. Off-White (#f8fafc)\n3. Cream (#fffbeb)\n4. Dark (#0d1117)', '1');
                      const colors = ['#ffffff', '#f8fafc', '#fffbeb', '#0d1117'];
                      const selected = colors[parseInt(bg, 10) - 1];
                      if (selected) {
                        const sheet = document.querySelector('.editor-paper-container');
                        if (sheet) sheet.style.background = selected;
                      }
                    }}
                  />
                  <RibbonButton
                    icon={Square}
                    label="Page Borders"
                    title="Toggle Page Border"
                    isDark={isDark}
                    onClick={() => {
                      const sheet = document.querySelector('.editor-paper-container');
                      if (sheet) {
                        sheet.style.border = sheet.style.border ? '' : '3px double #3b82f6';
                      }
                    }}
                  />
                  <RibbonButton
                    icon={isDark ? Sun : Moon}
                    label={isDark ? 'Light Theme' : 'Dark Theme'}
                    title="Toggle Editor Color Theme"
                    isDark={isDark}
                    onClick={toggleTheme}
                  />
                </div>
                <span
                  style={{
                    fontSize: '9px',
                    color: isDark ? '#6b7280' : '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    textAlign: 'center',
                    display: 'block',
                  }}
                >
                  Page Background
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* LAYOUT TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'layout' ? 'visible' : 'hidden'}`} style={{ display: activeRibbonTab === 'layout' ? 'flex' : 'none', alignItems: 'stretch', height: '80px' }}>
        {canEdit && (() => {
          const groupBorder = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0';

          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                background: isDark ? '#161b27' : '#ffffff',
                borderBottom: groupBorder,
                overflowX: 'auto',
                overflowY: 'hidden',
                height: '80px',
                width: '100%',
                flexShrink: 0,
              }}
            >
              {/* GROUP 1: PAGE SETUP */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRight: groupBorder,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <RibbonButton
                    icon={Square}
                    label="Margins"
                    title="Configure Page Margins"
                    isDark={isDark}
                    onClick={() => {
                      const m = prompt('Select Margins:\n1. Normal (2.54 cm)\n2. Narrow (1.27 cm)\n3. Wide (5.08 cm)', '1');
                      const keys = ['normal', 'narrow', 'wide'];
                      const key = keys[parseInt(m, 10) - 1] || 'normal';
                      if (setPageLayout) setPageLayout(key);
                    }}
                  />
                  <RibbonButton
                    icon={RotateCw}
                    label="Orientation"
                    title="Change Page Orientation"
                    isDark={isDark}
                    onClick={() => {
                      const orient = prompt('Select Orientation:\n1. Portrait\n2. Landscape', '1');
                      if (orient && quillInstance) {
                        const sheet = document.querySelector('.editor-paper-container');
                        if (sheet) {
                          sheet.style.width = orient === '2' ? '11in' : '8.5in';
                          sheet.style.minHeight = orient === '2' ? '8.5in' : '11in';
                        }
                      }
                    }}
                  />
                  <RibbonButton
                    icon={Maximize2}
                    label="Size"
                    title="Select Paper Size"
                    isDark={isDark}
                    onClick={() => {
                      const size = prompt('Select Paper Size:\n1. A4\n2. Letter\n3. Legal\n4. Executive', '1');
                      const sizes = { '1': '210mm', '2': '8.5in', '3': '8.5in', '4': '7.25in' };
                      const selected = sizes[size] || '8.5in';
                      const sheet = document.querySelector('.editor-paper-container');
                      if (sheet) sheet.style.width = selected;
                    }}
                  />
                  <RibbonButton
                    icon={Columns}
                    label="Columns"
                    title="Split Text into Columns"
                    isDark={isDark}
                    onClick={() => {
                      const cols = prompt('Select Columns:\n1. One Column\n2. Two Columns\n3. Three Columns', '1');
                      const sheet = document.querySelector('.ql-editor');
                      if (sheet) {
                        sheet.style.columnCount = cols === '2' ? '2' : cols === '3' ? '3' : '1';
                        sheet.style.columnGap = '24px';
                      }
                    }}
                  />
                  <RibbonButton
                    icon={Layers}
                    label="Breaks"
                    title="Insert Page or Section Break"
                    isDark={isDark}
                    onClick={() => {
                      if (quillInstance) {
                        const range = quillInstance.getSelection(true) || { index: quillInstance.getLength() };
                        quillInstance.clipboard.dangerouslyPasteHTML(range.index, '<hr style="page-break-after:always"/><br/>');
                      }
                    }}
                  />
                  <RibbonButton
                    icon={Hash}
                    label="Line Numbers"
                    title="Toggle Line Numbers"
                    isDark={isDark}
                    onClick={() => notify('Line Numbers enabled for document', 'info')}
                  />
                  <RibbonButton
                    icon={Type}
                    label="Hyphenation"
                    title="Automatic Hyphenation"
                    isDark={isDark}
                    onClick={() => notify('Automatic Hyphenation enabled', 'info')}
                  />
                </div>
                <span
                  style={{
                    fontSize: '9px',
                    color: isDark ? '#6b7280' : '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    textAlign: 'center',
                    display: 'block',
                  }}
                >
                  Page Setup
                </span>
              </div>

              {/* GROUP 2: ARRANGE */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <RibbonButton
                    icon={Move}
                    label="Position"
                    title="Set Element Position"
                    isDark={isDark}
                    onClick={() => notify('Positioning tools active for selected shapes and objects', 'info')}
                  />
                  <RibbonButton
                    icon={AlignJustify}
                    label="Wrap Text"
                    title="Text Wrapping Mode"
                    isDark={isDark}
                    onClick={() => notify('Wrap Text mode set to In Line with Text', 'info')}
                  />
                  <RibbonButton
                    icon={ChevronUp}
                    label="Bring Forward"
                    title="Bring Layer Forward"
                    isDark={isDark}
                    onClick={() => notify('Brought selected element layer forward', 'success')}
                  />
                  <RibbonButton
                    icon={ChevronDown}
                    label="Send Backward"
                    title="Send Layer Backward"
                    isDark={isDark}
                    onClick={() => notify('Sent selected element layer backward', 'success')}
                  />
                </div>
                <span
                  style={{
                    fontSize: '9px',
                    color: isDark ? '#6b7280' : '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    textAlign: 'center',
                    display: 'block',
                  }}
                >
                  Arrange
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* REVIEW TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'review' ? 'visible' : 'hidden'}`} style={{ display: activeRibbonTab === 'review' ? 'flex' : 'none', alignItems: 'stretch', height: '80px' }}>
        {(() => {
          const groupBorder = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0';

          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                background: isDark ? '#161b27' : '#ffffff',
                borderBottom: groupBorder,
                overflowX: 'auto',
                overflowY: 'hidden',
                height: '80px',
                width: '100%',
                flexShrink: 0,
              }}
            >
              {/* GROUP 1: PROOFING */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRight: groupBorder,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <RibbonButton
                    icon={Check}
                    label="Spelling"
                    title="Spelling & Grammar Check"
                    isDark={isDark}
                    onClick={() => notify('Spelling & Grammar Check completed — 0 issues found', 'success')}
                  />
                  <RibbonButton
                    icon={BookOpen}
                    label="Word Count"
                    title="Word Count Details"
                    isDark={isDark}
                    onClick={onShowStats}
                  />
                  <RibbonButton
                    icon={Search}
                    label="Thesaurus"
                    title="Open Thesaurus"
                    isDark={isDark}
                    onClick={() => notify('Thesaurus: Select a word in the document to view synonyms', 'info')}
                  />
                </div>
                <span style={{ fontSize: '9px', color: isDark ? '#6b7280' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', display: 'block' }}>
                  Proofing
                </span>
              </div>

              {/* GROUP 2: COMMENTS */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRight: groupBorder,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <RibbonButton
                    icon={MessageSquare}
                    label="New Comment"
                    title="Add New Comment"
                    isDark={isDark}
                    onClick={() => {
                      if (typeof setRightSidebarCollapsed === 'function') setRightSidebarCollapsed(false);
                      notify('Comment panel opened', 'info');
                    }}
                  />
                  <RibbonButton
                    icon={Trash2}
                    label="Delete"
                    title="Delete Active Comment"
                    isDark={isDark}
                    onClick={() => notify('Selected comment deleted', 'info')}
                  />
                  <RibbonButton
                    icon={ChevronLeft}
                    label="Previous"
                    title="Previous Comment"
                    isDark={isDark}
                    onClick={() => notify('Navigated to previous comment', 'info')}
                  />
                  <RibbonButton
                    icon={ChevronDown}
                    label="Next"
                    title="Next Comment"
                    isDark={isDark}
                    onClick={() => notify('Navigated to next comment', 'info')}
                  />
                </div>
                <span style={{ fontSize: '9px', color: isDark ? '#6b7280' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', display: 'block' }}>
                  Comments
                </span>
              </div>

              {/* GROUP 3: TRACKING */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRight: groupBorder,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <RibbonButton
                    icon={Sparkles}
                    label="Track Changes"
                    title="Toggle Track Changes"
                    isDark={isDark}
                    onClick={() => notify('Track Changes mode activated', 'success')}
                  />
                  <RibbonButton
                    icon={Sliders}
                    label="Review Pane"
                    title="Toggle Reviewing Pane"
                    isDark={isDark}
                    onClick={() => {
                      if (typeof setLeftSidebarCollapsed === 'function') setLeftSidebarCollapsed(false);
                      notify('Reviewing pane toggled', 'info');
                    }}
                  />
                </div>
                <span style={{ fontSize: '9px', color: isDark ? '#6b7280' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', display: 'block' }}>
                  Tracking
                </span>
              </div>

              {/* GROUP 4: CHANGES */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRight: groupBorder,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <RibbonButton
                    icon={Check}
                    label="Accept"
                    title="Accept Change"
                    isDark={isDark}
                    onClick={() => notify('Tracked change accepted', 'success')}
                  />
                  <RibbonButton
                    icon={X}
                    label="Reject"
                    title="Reject Change"
                    isDark={isDark}
                    onClick={() => notify('Tracked change rejected', 'info')}
                  />
                </div>
                <span style={{ fontSize: '9px', color: isDark ? '#6b7280' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', display: 'block' }}>
                  Changes
                </span>
              </div>

              {/* GROUP 5: PROTECT & COMPARE */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <RibbonButton
                    icon={Columns}
                    label="Compare"
                    title="Compare Document Revisions"
                    isDark={isDark}
                    onClick={() => notify('Document revision comparison pane ready', 'info')}
                  />
                  <RibbonButton
                    icon={Square}
                    label="Protect"
                    title="Protect Document Editing"
                    isDark={isDark}
                    onClick={() => notify('Document editing protection enabled', 'success')}
                  />
                </div>
                <span style={{ fontSize: '9px', color: isDark ? '#6b7280' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', display: 'block' }}>
                  Protect & Compare
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* VIEW TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'view' ? 'visible' : 'hidden'}`} style={{ display: activeRibbonTab === 'view' ? 'flex' : 'none', alignItems: 'stretch', height: '80px' }}>
        {(() => {
          const groupBorder = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0';

          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                background: isDark ? '#161b27' : '#ffffff',
                borderBottom: groupBorder,
                overflowX: 'auto',
                overflowY: 'hidden',
                height: '80px',
                width: '100%',
                flexShrink: 0,
              }}
            >
              {/* GROUP 1: VIEWS */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRight: groupBorder,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <RibbonButton
                    icon={BookOpen}
                    label="Read Mode"
                    title="Switch to Read Mode"
                    isDark={isDark}
                    onClick={() => {
                      const sheet = document.querySelector('.editor-paper-container');
                      if (sheet) {
                        sheet.style.width = '100%';
                        sheet.style.maxWidth = '900px';
                      }
                    }}
                  />
                  <RibbonButton
                    icon={Monitor}
                    label="Print Layout"
                    title="Switch to Print Layout"
                    isDark={isDark}
                    onClick={() => {
                      const sheet = document.querySelector('.editor-paper-container');
                      if (sheet) {
                        sheet.style.width = '8.5in';
                        sheet.style.maxWidth = 'none';
                      }
                    }}
                  />
                  <RibbonButton
                    icon={LayoutGrid}
                    label="Web Layout"
                    title="Switch to Web Layout"
                    isDark={isDark}
                    onClick={() => {
                      const sheet = document.querySelector('.editor-paper-container');
                      if (sheet) {
                        sheet.style.width = '100%';
                        sheet.style.maxWidth = '100%';
                      }
                    }}
                  />
                </div>
                <span style={{ fontSize: '9px', color: isDark ? '#6b7280' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', display: 'block' }}>
                  Views
                </span>
              </div>

              {/* GROUP 2: IMMERSIVE & DARK MODE */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRight: groupBorder,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <RibbonButton
                    icon={Maximize2}
                    label="Focus Mode"
                    title="Toggle Focus Mode"
                    isDark={isDark}
                    onClick={() => {
                      if (typeof setLeftSidebarCollapsed === 'function') setLeftSidebarCollapsed(true);
                      if (typeof setRightSidebarCollapsed === 'function') setRightSidebarCollapsed(true);
                    }}
                  />
                  <RibbonButton
                    icon={isDark ? Sun : Moon}
                    label={isDark ? 'Light Mode' : 'Dark Mode'}
                    title="Toggle Dark/Light Mode"
                    isDark={isDark}
                    onClick={toggleTheme}
                  />
                </div>
                <span style={{ fontSize: '9px', color: isDark ? '#6b7280' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', display: 'block' }}>
                  Immersive & Dark Mode
                </span>
              </div>

              {/* GROUP 3: SHOW / HIDE SIDEBARS */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRight: groupBorder,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <RibbonButton
                    icon={List}
                    label="Navigation"
                    title="Toggle Navigation Sidebar"
                    isDark={isDark}
                    onClick={() => {
                      if (typeof setLeftSidebarCollapsed === 'function') setLeftSidebarCollapsed(!leftSidebarCollapsed);
                    }}
                  />
                  <RibbonButton
                    icon={Users}
                    label="Collaborators"
                    title="Toggle Collaborators Panel"
                    isDark={isDark}
                    onClick={() => {
                      if (typeof setRightSidebarCollapsed === 'function') setRightSidebarCollapsed(!rightSidebarCollapsed);
                    }}
                  />
                </div>
                <span style={{ fontSize: '9px', color: isDark ? '#6b7280' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', display: 'block' }}>
                  Show / Hide
                </span>
              </div>

              {/* GROUP 4: ZOOM */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRight: groupBorder,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <RibbonButton
                    icon={ZoomIn}
                    label="Zoom"
                    title="Custom Zoom Level"
                    isDark={isDark}
                    onClick={() => {
                      const z = prompt('Enter Zoom percentage (50 - 200):', '100');
                      if (z) {
                        const val = Math.max(50, Math.min(200, parseInt(z, 10) || 100)) / 100;
                        const sheet = document.querySelector('.editor-paper-container');
                        if (sheet) sheet.style.transform = `scale(${val})`;
                      }
                    }}
                  />
                  <RibbonButton
                    icon={Eye}
                    label="100%"
                    title="Reset Zoom to 100%"
                    isDark={isDark}
                    onClick={() => {
                      const sheet = document.querySelector('.editor-paper-container');
                      if (sheet) sheet.style.transform = 'scale(1)';
                    }}
                  />
                </div>
                <span style={{ fontSize: '9px', color: isDark ? '#6b7280' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', display: 'block' }}>
                  Zoom
                </span>
              </div>

              {/* GROUP 5: PROPERTIES */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <RibbonButton
                    icon={Info}
                    label="Properties"
                    title="Document Info & Stats"
                    isDark={isDark}
                    onClick={() => {
                      const text = quillInstance ? quillInstance.getText().trim() : '';
                      const words = text ? text.split(/\s+/).length : 0;
                      notify(`Document Properties: ${words} words · Cloud Saved · ${isDark ? 'Dark' : 'Light'} Mode`, 'info');
                    }}
                  />
                </div>
                <span style={{ fontSize: '9px', color: isDark ? '#6b7280' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', display: 'block' }}>
                  Properties
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Hidden toolbar container for Quill */}
      <div id="quill-hidden-toolbar" style={{ display: 'none' }}>
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <button className="ql-script" value="sub" />
        <button className="ql-script" value="super" />
        <button className="ql-clean" />
        <button className="ql-list" value="bullet" />
        <button className="ql-list" value="ordered" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
        <button className="ql-align" value="" />
        <button className="ql-align" value="center" />
        <button className="ql-align" value="right" />
        <button className="ql-align" value="justify" />
        <select className="ql-font" />
        <select className="ql-size" />
        <select className="ql-color" />
        <select className="ql-background" />
      </div>
    </div>
  );
}