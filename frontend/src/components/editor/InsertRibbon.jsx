import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  File, 
  Scissors, 
  Table as TableIcon, 
  Image as ImageIcon, 
  Shapes, 
  Compass, 
  Network, 
  BarChart3, 
  Camera, 
  Video, 
  Link as LinkIcon, 
  Bookmark, 
  GitMerge, 
  MessageSquare, 
  ArrowUpToLine, 
  ArrowDownToLine, 
  Hash, 
  Type, 
  Sparkles, 
  Heading, 
  Calendar, 
  PenTool, 
  Box, 
  Calculator, 
  Sigma, 
  Code, 
  Terminal, 
  Quote, 
  TextQuote, 
  Minus,
  Eye
} from 'lucide-react';
import RibbonGroup from './RibbonGroup';
import RibbonButton from './RibbonButton';

export default function InsertRibbon({
  canEdit,
  quillInstance,
  onInsertTable,
  onInsertImage,
  onInsertLink,
  onInsertPageBreak,
  onInsertDivider,
  rightSidebarCollapsed,
  setRightSidebarCollapsed,
  setRightTab,
  showToast,
  isMobile
}) {
  const [activePopover, setActivePopover] = useState(null); // 'table' | 'link' | 'symbol' | 'video' | null
  const [hoverTableSize, setHoverTableSize] = useState({ rows: 0, cols: 0 });
  const [linkUrl, setLinkUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const popoverRef = useRef(null);

  // Click outside listener to close popovers
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setActivePopover(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!canEdit) {
    return (
      <div className="px-4 py-2 text-xs italic text-[#6B7280] dark:text-[#94A3B8]/80 flex items-center gap-2">
        <Eye size={16} /> You are viewing this document in read-only mode.
      </div>
    );
  }

  // --- Popover Toggles ---
  const togglePopover = (type) => {
    setActivePopover(prev => prev === type ? null : type);
  };

  // --- Insertion Actions ---
  const handleInsertCoverPage = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection(true);
    
    // Insert a beautifully pre-formatted cover page template
    quillInstance.insertText(range.index, '\n[ COVER PAGE ]\n\n', { bold: true });
    quillInstance.insertText(range.index + 16, 'Document Title\n', { size: 'large', bold: true });
    quillInstance.insertText(range.index + 31, 'Subtitle / Description\n\n\n', { italic: true });
    quillInstance.insertEmbed(range.index + 55, 'pagebreak', true);
    quillInstance.insertText(range.index + 56, '\n');
    quillInstance.setSelection(range.index + 57);
    
    showToast('Cover page template inserted', 'success');
  };

  const handleInsertBlankPage = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection(true);
    quillInstance.insertEmbed(range.index, 'pagebreak', true);
    quillInstance.insertText(range.index + 1, '\n\n[Blank Page]\n\n');
    quillInstance.insertEmbed(range.index + 16, 'pagebreak', true);
    quillInstance.setSelection(range.index + 17);
    
    showToast('Blank page inserted', 'success');
  };

  const handleInsertOnlineVideo = () => {
    if (!quillInstance || !videoUrl.trim()) return;
    let formattedUrl = videoUrl.trim();
    const range = quillInstance.getSelection(true);
    
    // Quill natively supports video embed format
    quillInstance.insertEmbed(range.index, 'video', formattedUrl);
    quillInstance.setSelection(range.index + 1);
    
    showToast('Online video inserted', 'success');
    setVideoUrl('');
    setActivePopover(null);
  };

  const handleInsertComment = () => {
    if (setRightSidebarCollapsed && setRightTab) {
      if (rightSidebarCollapsed) {
        setRightSidebarCollapsed();
      }
      setRightTab('comments');
      showToast('Opened Comments panel', 'info');
    }
  };

  const handleInsertWordArt = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection(true);
    quillInstance.insertText(range.index, ' WordArt ', { bold: true, size: 'large' });
    showToast('WordArt template inserted', 'success');
  };

  const handleInsertDropCap = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection();
    if (range && range.length > 0) {
      quillInstance.formatText(range.index, 1, 'size', 'huge');
      quillInstance.formatText(range.index, 1, 'bold', true);
      showToast('Drop cap applied to first character', 'success');
    } else {
      showToast('Select text first to apply a drop cap.', 'warning');
    }
  };

  const handleInsertDateTime = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection(true);
    const dateString = ` ${new Date().toLocaleString()} `;
    quillInstance.insertText(range.index, dateString);
    quillInstance.setSelection(range.index + dateString.length);
    showToast('Inserted current date and time', 'success');
  };

  const handleInsertSignature = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection(true);
    const signatureTemplate = '\n\n___________________________\nAuthorized Signature / Date\n';
    quillInstance.insertText(range.index, signatureTemplate);
    quillInstance.setSelection(range.index + signatureTemplate.length);
    showToast('Signature block inserted', 'success');
  };

  const handleInsertEquation = () => {
    if (!quillInstance) return;
    const equationStr = prompt('Enter mathematical formula:', 'f(x) = a_0 + \\sum_{n=1}^{\\infty} (a_n \\cos(n x) + b_n \\sin(n x))');
    if (equationStr) {
      const range = quillInstance.getSelection(true);
      quillInstance.insertText(range.index, ` ${equationStr} `);
      quillInstance.setSelection(range.index + equationStr.length + 2);
      showToast('Equation inserted', 'success');
    }
  };

  const handleInsertSymbol = (symbol) => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection(true);
    quillInstance.insertText(range.index, symbol);
    quillInstance.setSelection(range.index + symbol.length);
    showToast(`Symbol '${symbol}' inserted`, 'success');
    setActivePopover(null);
  };

  const handleToggleInlineCode = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection();
    if (range && range.length > 0) {
      const currentFormat = quillInstance.getFormat(range);
      quillInstance.format('code', !currentFormat.code);
    } else {
      const selection = quillInstance.getSelection(true);
      quillInstance.insertText(selection.index, 'code', 'code', true);
      quillInstance.setSelection(selection.index + 4);
    }
  };

  const handleToggleCodeBlock = () => {
    if (!quillInstance) return;
    const currentFormat = quillInstance.getFormat();
    quillInstance.format('code-block', !currentFormat['code-block']);
  };

  const handleToggleQuote = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection();
    if (range && range.length > 0) {
      const currentFormat = quillInstance.getFormat(range);
      quillInstance.formatText(range.index, range.length, 'italic', !currentFormat.italic);
    } else {
      const selection = quillInstance.getSelection(true);
      quillInstance.insertText(selection.index, '"Quote"', 'italic', true);
      quillInstance.setSelection(selection.index + 7);
    }
  };

  const handleToggleBlockQuote = () => {
    if (!quillInstance) return;
    const currentFormat = quillInstance.getFormat();
    quillInstance.format('blockquote', !currentFormat.blockquote);
  };

  const showUnavailableToast = (feature) => {
    showToast(`${feature} is not supported in linear web documents.`, 'info');
  };

  const SYMBOLS_LIST = [
    'Ω', 'π', '∑', '√', '∞', '≈', '≠', '≤', '≥', 'α', 'β', 'γ', 'δ', 'θ', 'λ', 'μ',
    '±', '×', '÷', '→', '↑', '↓', '←', '©', '®', '™', '§', '¶', '¢', '£', '€', '¥'
  ];

  return (
    <div className="flex items-center h-full w-max gap-0 relative" ref={popoverRef}>
      
      {/* 1. PAGES GROUP */}
      <RibbonGroup label="Pages">
        <RibbonButton 
          icon={FileText} 
          label="Cover Page" 
          onClick={handleInsertCoverPage} 
          tooltip="Insert a formatted Cover Page template" 
        />
        <RibbonButton 
          icon={File} 
          label="Blank Page" 
          onClick={handleInsertBlankPage} 
          tooltip="Insert a new blank page layout" 
        />
        <RibbonButton 
          icon={Scissors} 
          label="Page Break" 
          onClick={onInsertPageBreak} 
          shortcut="Ctrl+Enter" 
          tooltip="Start the next page at current position" 
        />
      </RibbonGroup>
      
      <div className="ribbon-group-separator" />

      {/* 2. TABLES GROUP */}
      <RibbonGroup label="Tables">
        <div className="relative">
          <RibbonButton
            icon={TableIcon}
            label="Table"
            active={activePopover === 'table'}
            onClick={() => togglePopover('table')}
            tooltip="Insert a grid table"
          />
          {activePopover === 'table' && (
            <div className="absolute top-full left-0 z-[100] bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-xl shadow-xl p-3 mt-1.5 w-[140px] text-left">
              <div className="flex flex-col gap-1 select-none">
                {Array.from({ length: 5 }).map((_, r) => (
                  <div key={r} className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, c) => {
                      const isActive = r < hoverTableSize.rows && c < hoverTableSize.cols;
                      return (
                        <div
                          key={c}
                          className={`w-4 h-4 border border-slate-200 dark:border-slate-700/60 rounded cursor-pointer transition-colors ${
                            isActive ? 'bg-[#0D6EFD] border-[#0D6EFD]' : 'bg-slate-50 dark:bg-slate-800'
                          }`}
                          onMouseEnter={() => setHoverTableSize({ rows: r + 1, cols: c + 1 })}
                          onClick={() => {
                            onInsertTable(r + 1, c + 1);
                            setActivePopover(null);
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-semibold text-[#081B3A] dark:text-[#E5E7EB] mt-2 text-center">
                {hoverTableSize.rows > 0 ? `${hoverTableSize.rows} x ${hoverTableSize.cols} Table` : 'Select grid'}
              </div>
            </div>
          )}
        </div>
      </RibbonGroup>

      <div className="ribbon-group-separator" />

      {/* 3. ILLUSTRATIONS GROUP */}
      <RibbonGroup label="Illustrations">
        <RibbonButton 
          icon={ImageIcon} 
          label="Picture" 
          onClick={onInsertImage} 
          tooltip="Insert image from your computer" 
        />
        
        {/* Vertical stack of 3 small buttons for advanced graphics */}
        <div className="flex flex-col justify-center h-full gap-0.5 min-w-[90px]">
          <RibbonButton 
            icon={Shapes} 
            label="Shapes" 
            size="small" 
            onClick={() => showUnavailableToast('Drawing shapes')} 
            tooltip="Draw visual shapes" 
          />
          <RibbonButton 
            icon={Compass} 
            label="Icons" 
            size="small" 
            onClick={() => showUnavailableToast('Insert icons')} 
            tooltip="Insert graphics icons" 
          />
          <RibbonButton 
            icon={Network} 
            label="SmartArt" 
            size="small" 
            onClick={() => showUnavailableToast('SmartArt')} 
            tooltip="Insert SmartArt relationship graphics" 
          />
        </div>

        <div className="flex flex-col justify-center h-full gap-0.5 min-w-[90px]">
          <RibbonButton 
            icon={BarChart3} 
            label="Chart" 
            size="small" 
            onClick={() => showUnavailableToast('Charts')} 
            tooltip="Insert interactive charts" 
          />
          <RibbonButton 
            icon={Camera} 
            label="Screenshot" 
            size="small" 
            onClick={() => showUnavailableToast('Screenshots')} 
            tooltip="Capture screen clipping" 
          />
        </div>
      </RibbonGroup>

      <div className="ribbon-group-separator" />

      {/* 4. MEDIA GROUP */}
      <RibbonGroup label="Media">
        <div className="relative">
          <RibbonButton 
            icon={Video} 
            label="Online Video" 
            active={activePopover === 'video'}
            onClick={() => togglePopover('video')} 
            tooltip="Embed an online video from YouTube/Vimeo" 
          />
          {activePopover === 'video' && (
            <div className="absolute top-full left-0 z-[100] bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-xl shadow-xl p-3 mt-1.5 w-[220px] flex flex-col gap-2">
              <input
                type="text"
                placeholder="Enter YouTube Video URL..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#0D6EFD]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleInsertOnlineVideo();
                }}
              />
              <button
                type="button"
                onClick={handleInsertOnlineVideo}
                className="w-full bg-[#0D6EFD] text-white hover:bg-blue-600 rounded-lg text-xs py-1.5 font-medium transition-colors cursor-pointer"
              >
                Insert Video
              </button>
            </div>
          )}
        </div>
      </RibbonGroup>

      <div className="ribbon-group-separator" />

      {/* 5. LINKS GROUP */}
      <RibbonGroup label="Links">
        <div className="relative">
          <RibbonButton
            icon={LinkIcon}
            label="Link"
            active={activePopover === 'link'}
            onClick={() => togglePopover('link')}
            shortcut="Ctrl+K"
            tooltip="Add a hyperlink to selection"
          />
          {activePopover === 'link' && (
            <div className="absolute top-full left-0 z-[100] bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-xl shadow-xl p-3 mt-1.5 w-[220px] flex flex-col gap-2.5">
              <input
                type="text"
                placeholder="Enter URL (https://...)"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#0D6EFD]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onInsertLink(linkUrl);
                    setActivePopover(null);
                    setLinkUrl('');
                  }
                }}
              />
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    onInsertLink(linkUrl);
                    setActivePopover(null);
                    setLinkUrl('');
                  }}
                  className="flex-1 bg-[#0D6EFD] text-white hover:bg-blue-600 rounded-lg text-xs py-1.5 font-medium transition-colors cursor-pointer"
                >
                  Insert
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActivePopover(null);
                    setLinkUrl('');
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/60 text-[#6B7280] dark:text-[#E5E7EB] rounded-lg text-xs py-1.5 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col justify-center h-full gap-0.5 min-w-[90px]">
          <RibbonButton 
            icon={Bookmark} 
            label="Bookmark" 
            size="small" 
            onClick={() => showUnavailableToast('Bookmarks')} 
            tooltip="Set bookmark locator" 
          />
          <RibbonButton 
            icon={GitMerge} 
            label="Cross-Ref" 
            size="small" 
            onClick={() => showUnavailableToast('Cross References')} 
            tooltip="Insert link to headings/objects" 
          />
        </div>
      </RibbonGroup>

      <div className="ribbon-group-separator" />

      {/* 6. COMMENTS GROUP */}
      <RibbonGroup label="Comments">
        <RibbonButton 
          icon={MessageSquare} 
          label="Comment" 
          onClick={handleInsertComment} 
          tooltip="Insert a comment in right sidebar" 
        />
      </RibbonGroup>

      <div className="ribbon-group-separator" />

      {/* 7. HEADER & FOOTER GROUP */}
      <RibbonGroup label="Header & Footer">
        <div className="flex flex-col justify-center h-full gap-0.5 min-w-[90px]">
          <RibbonButton 
            icon={ArrowUpToLine} 
            label="Header" 
            size="small" 
            onClick={() => showUnavailableToast('Header settings')} 
            tooltip="Insert document header" 
          />
          <RibbonButton 
            icon={ArrowDownToLine} 
            label="Footer" 
            size="small" 
            onClick={() => showUnavailableToast('Footer settings')} 
            tooltip="Insert document footer" 
          />
          <RibbonButton 
            icon={Hash} 
            label="Page Num" 
            size="small" 
            onClick={() => showUnavailableToast('Page numbers')} 
            tooltip="Add dynamic page numbers" 
          />
        </div>
      </RibbonGroup>

      <div className="ribbon-group-separator" />

      {/* 8. TEXT GROUP */}
      <RibbonGroup label="Text">
        <div className="flex flex-col justify-center h-full gap-0.5 min-w-[90px]">
          <RibbonButton 
            icon={Type} 
            label="Text Box" 
            size="small" 
            onClick={() => showUnavailableToast('Floating Text Box')} 
            tooltip="Draw text frame container" 
          />
          <RibbonButton 
            icon={Sparkles} 
            label="WordArt" 
            size="small" 
            onClick={handleInsertWordArt} 
            tooltip="Insert pre-styled heading art text" 
          />
          <RibbonButton 
            icon={Heading} 
            label="Drop Cap" 
            size="small" 
            onClick={handleInsertDropCap} 
            tooltip="Apply huge drop-cap letter styling" 
          />
        </div>

        <div className="flex flex-col justify-center h-full gap-0.5 min-w-[95px]">
          <RibbonButton 
            icon={Calendar} 
            label="Date & Time" 
            size="small" 
            onClick={handleInsertDateTime} 
            tooltip="Insert current timestamp text at cursor" 
          />
          <RibbonButton 
            icon={PenTool} 
            label="Signature" 
            size="small" 
            onClick={handleInsertSignature} 
            tooltip="Add authorized signature template" 
          />
          <RibbonButton 
            icon={Box} 
            label="Object" 
            size="small" 
            onClick={() => showUnavailableToast('Object embedding')} 
            tooltip="Embed external document object" 
          />
        </div>
      </RibbonGroup>

      <div className="ribbon-group-separator" />

      {/* 9. SYMBOLS GROUP */}
      <RibbonGroup label="Symbols">
        <div className="flex flex-col justify-center h-full gap-0.5 min-w-[90px]">
          <RibbonButton 
            icon={Calculator} 
            label="Equation" 
            size="small" 
            onClick={handleInsertEquation} 
            tooltip="Insert mathematical LaTeX equation placeholder" 
          />
          <div className="relative">
            <RibbonButton 
              icon={Sigma} 
              label="Symbol" 
              size="small" 
              active={activePopover === 'symbol'}
              onClick={() => togglePopover('symbol')} 
              tooltip="Insert special greek or math symbol character" 
            />
            {activePopover === 'symbol' && (
              <div className="absolute top-full left-0 z-[100] bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-xl shadow-xl p-2 mt-1.5 w-[190px] grid grid-cols-6 gap-1 select-none">
                {SYMBOLS_LIST.map((symbol) => (
                  <button
                    key={symbol}
                    type="button"
                    onClick={() => handleInsertSymbol(symbol)}
                    className="w-6 h-6 text-xs text-[#081B3A] dark:text-[#E5E7EB] hover:bg-[#0D6EFD] hover:text-white rounded flex items-center justify-center transition-colors cursor-pointer font-sans"
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </RibbonGroup>

      <div className="ribbon-group-separator" />

      {/* 10. CODE GROUP */}
      <RibbonGroup label="Code">
        <div className="flex flex-col justify-center h-full gap-0.5 min-w-[90px]">
          <RibbonButton 
            icon={Code} 
            label="Inline Code" 
            size="small" 
            onClick={handleToggleInlineCode} 
            tooltip="Toggle selection as inline mono code" 
          />
          <RibbonButton 
            icon={Terminal} 
            label="Code Block" 
            size="small" 
            onClick={handleToggleCodeBlock} 
            tooltip="Toggle multi-line syntax block" 
          />
        </div>
      </RibbonGroup>

      <div className="ribbon-group-separator" />

      {/* 11. QUOTES GROUP */}
      <RibbonGroup label="Quotes">
        <div className="flex flex-col justify-center h-full gap-0.5 min-w-[90px]">
          <RibbonButton 
            icon={Quote} 
            label="Quote" 
            size="small" 
            onClick={handleToggleQuote} 
            tooltip="Toggle selection format as italic Quote" 
          />
          <RibbonButton 
            icon={TextQuote} 
            label="Block Quote" 
            size="small" 
            onClick={handleToggleBlockQuote} 
            tooltip="Toggle selection indentation as Block Quote" 
          />
        </div>
      </RibbonGroup>

      <div className="ribbon-group-separator" />

      {/* 12. DIVIDER GROUP */}
      <RibbonGroup label="Divider">
        <RibbonButton 
          icon={Minus} 
          label="Line" 
          onClick={onInsertDivider} 
          tooltip="Insert a horizontal layout divider rule" 
        />
      </RibbonGroup>

    </div>
  );
}
