import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Undo, Redo, Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, 
  Table, Image, ChevronLeft, ChevronRight, FileText, History, 
  Check, X, Copy, Share2, Clipboard, Scissors, Paintbrush, 
  Highlighter, Eraser, AlignJustify, Indent, Outdent, PaintBucket, 
  Grid3x3, Search, Replace
} from 'lucide-react';
import { 
  FiSave, FiRotateCcw, FiRotateCw, FiShare2, FiSun, FiMoon, 
  FiZoomIn, FiZoomOut 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { documentService } from '../utils/documentService';
import '../editor.css';

export default function EditingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { triggerToast } = useAuth();
  const [doc, setDoc] = useState(null);

  // Fetch document details on mount/id change
  useEffect(() => {
    const fetched = documentService.getById(id);
    if (!fetched) {
      triggerToast('Document not found', 'warning');
      navigate('/dashboard');
      return;
    }
    setDoc(fetched);
  }, [id, navigate, triggerToast]);

  const handleSave = (newTitle, newContent, words) => {
    const updated = documentService.update(id, { name: newTitle, content: newContent, wordCount: words });
    if (updated) {
      setDoc(updated);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (!doc) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] dark:bg-[#090D16] flex items-center justify-center transition-colors">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB] dark:border-white"></div>
      </div>
    );
  }

  return (
    <EditingPageContent
      document={doc}
      onBack={handleBack}
      onSave={handleSave}
    />
  );
}

function EditingPageContent({ document: doc, onBack, onSave }) {
  const { id } = useParams();
  const { theme, toggleTheme } = useTheme();
  const { triggerToast } = useAuth();
  
  const isDarkMode = theme === 'dark' || document.documentElement.classList.contains('dark');
  
  const [title, setTitle] = useState(doc.name || 'Untitled Document');
  const [autosaveState, setAutosaveState] = useState('saved'); // 'saved' | 'saving'
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [leftTab, setLeftTab] = useState('outline'); // 'outline' | 'pages' | 'history'
  const [activeTab, setActiveTab] = useState('Home'); // Ribbon tabs
  const [zoom, setZoom] = useState(100);
  const [showRuler, setShowRuler] = useState(true);
  const [showFormattingMarks, setShowFormattingMarks] = useState(false);
  
  // Find and Replace Pane
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  
  // Share Modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState('Editor');
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Stats
  const [wordCount, setWordCount] = useState(doc.wordCount || 0);
  const [charCount, setCharCount] = useState(0);
  
  // Heading tree outline
  const [outline, setOutline] = useState([]);
  
  // Format painter styles buffer
  const [formatPainterStyle, setFormatPainterStyle] = useState(null);
  
  // Active formatting button states
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    alignLeft: true,
    alignCenter: false,
    alignRight: false,
    fontName: 'Calibri',
    fontSize: '3'
  });

  const stripInitialHeading = (contentHTML) => {
    if (!contentHTML) return '<p>Start typing here...</p>';
    const headingRegex = /^\s*<(h1|h2|h3)[^>]*>[\s\S]*?<\/\1>\s*/i;
    return contentHTML.replace(headingRegex, '');
  };

  const editorRef = useRef(null);
  const autosaveTimeoutRef = useRef(null);
  const hasInitializedContent = useRef(false);

  // Initialize editor content once
  useEffect(() => {
    if (editorRef.current && !hasInitializedContent.current) {
      editorRef.current.innerHTML = stripInitialHeading(doc.content);
      hasInitializedContent.current = true;
      handleSelectionChange();
    }
  }, [doc]);

  // Clean up autosave timeout on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, []);

  // Calculate word & character counts
  const updateCounts = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const cleanText = text.trim();
    const words = cleanText === '' ? 0 : cleanText.split(/\s+/).length;
    setWordCount(words);
    setCharCount(text.length);
    return words;
  };

  // Re-build heading outline tree from H1, H2, H3 elements in contenteditable
  const updateOutline = () => {
    if (!editorRef.current) return;
    const headings = Array.from(editorRef.current.querySelectorAll('h1, h2, h3'));
    const outlineData = headings.map((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-ref-${index}`;
      }
      return {
        id: heading.id,
        text: heading.innerText || heading.textContent || 'Untitled Heading',
        level: heading.tagName.toLowerCase() // 'h1', 'h2', 'h3'
      };
    });
    setOutline(outlineData);
  };

  // Run formatting command and refocus editor
  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleSelectionChange();
    triggerAutosave();
  };

  // Monitor cursor selection / typing to toggle active toolbar states
  const handleSelectionChange = () => {
    if (!editorRef.current) return;
    
    updateCounts();
    updateOutline();

    setActiveStyles({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      alignLeft: document.queryCommandState('justifyLeft') || (!document.queryCommandState('justifyCenter') && !document.queryCommandState('justifyRight')),
      alignCenter: document.queryCommandState('justifyCenter'),
      alignRight: document.queryCommandState('justifyRight'),
      fontName: document.queryCommandValue('fontName') || 'Calibri',
      fontSize: document.queryCommandValue('fontSize') || '3'
    });
  };

  // Autosave title & body content changes
  const triggerAutosave = (updatedTitle = title) => {
    if (!autosaveEnabled) return;
    setAutosaveState('saving');
    
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
    
    autosaveTimeoutRef.current = setTimeout(() => {
      if (editorRef.current) {
        const currentHTML = editorRef.current.innerHTML;
        const currentWords = updateCounts();
        onSave(updatedTitle, currentHTML, currentWords);
      }
      setAutosaveState('saved');
    }, 800);
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    triggerAutosave(val);
  };

  const handleInput = () => {
    handleSelectionChange();
    triggerAutosave();
  };

  const handleManualSave = () => {
    setAutosaveState('saving');
    if (editorRef.current) {
      const currentHTML = editorRef.current.innerHTML;
      const currentWords = updateCounts();
      onSave(title, currentHTML, currentWords);
    }
    setTimeout(() => {
      setAutosaveState('saved');
      triggerToast('Document saved manually', 'success');
    }, 500);
  };

  // Clipboard commands
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        applyFormat('insertHTML', text.replace(/\n/g, '<br>'));
        triggerToast('Clipboard content pasted', 'success');
      }
    } catch (err) {
      triggerToast('Clipboard access blocked. Use Ctrl+V.', 'warning');
    }
  };

  const handleCut = () => {
    document.execCommand('cut');
    triggerToast('Text cut to clipboard', 'info');
  };

  const handleCopy = () => {
    document.execCommand('copy');
    triggerToast('Text copied to clipboard', 'info');
  };

  const handleFormatPainterClick = () => {
    triggerToast('Format Painter active. Select text to apply format.', 'info');
  };

  // Grow / Shrink Font Size
  const handleGrowFont = () => {
    const cur = parseInt(activeStyles.fontSize) || 3;
    if (cur < 7) {
      applyFormat('fontSize', (cur + 1).toString());
    }
  };

  const handleShrinkFont = () => {
    const cur = parseInt(activeStyles.fontSize) || 3;
    if (cur > 1) {
      applyFormat('fontSize', (cur - 1).toString());
    }
  };

  // Text color / highlight
  const handleHighlight = () => {
    applyFormat('backColor', 'yellow');
  };

  const handleFontColor = () => {
    applyFormat('foreColor', 'red');
  };

  // Paragraph options
  const handleSort = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString();
      if (text.trim()) {
        const sorted = text.split('\n').sort((a, b) => a.localeCompare(b)).join('\n');
        applyFormat('insertHTML', sorted.replace(/\n/g, '<br>'));
        triggerToast('Sorted selection alphabetically', 'success');
      } else {
        triggerToast('Please select text lines to sort', 'info');
      }
    }
  };

  const handleLineSpacing = (spacing) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let parent = selection.getRangeAt(0).commonAncestorContainer;
      if (parent.nodeType === 3) {
        parent = parent.parentNode;
      }
      if (parent && editorRef.current.contains(parent)) {
        parent.style.lineHeight = spacing;
        triggerAutosave();
      }
    }
  };

  const handleBorder = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let parent = selection.getRangeAt(0).commonAncestorContainer;
      if (parent.nodeType === 3) {
        parent = parent.parentNode;
      }
      if (parent && editorRef.current.contains(parent)) {
        parent.style.border = '1px solid #CCCCCC';
        parent.style.padding = '8px';
        triggerAutosave();
      }
    }
  };

  // Find and Replace Actions
  const handleFind = () => {
    if (!findText) {
      triggerToast('Enter text to search for', 'info');
      return;
    }
    try {
      const found = window.find(findText, false, false, true, false, false, false);
      if (!found) {
        triggerToast(`Could not find "${findText}"`, 'warning');
      }
    } catch (e) {
      if (editorRef.current) {
        const text = editorRef.current.innerText || '';
        if (text.includes(findText)) {
          triggerToast(`Found "${findText}" in document`, 'success');
        } else {
          triggerToast(`Could not find "${findText}"`, 'warning');
        }
      }
    }
  };

  const handleReplace = () => {
    if (findText && editorRef.current) {
      const content = editorRef.current.innerHTML;
      if (content.includes(findText)) {
        const newContent = content.replace(findText, replaceText);
        editorRef.current.innerHTML = newContent;
        triggerAutosave();
        triggerToast(`Replaced "${findText}" with "${replaceText}"`, 'success');
      } else {
        triggerToast(`Could not find "${findText}" to replace`, 'warning');
      }
    } else {
      triggerToast('Enter search and replace values', 'info');
    }
  };

  // Insertion Dialogs
  const handleInsertLink = () => {
    const url = prompt('Enter link URL (e.g. https://google.com):');
    if (url) {
      applyFormat('createLink', url);
    }
  };

  const handleInsertTable = () => {
    const rows = 2;
    const cols = 2;
    let tableHTML = '<table style="width:100%; border-collapse:collapse; margin:16px 0;"><thead><tr>';
    for (let c = 0; c < cols; c++) {
      tableHTML += `<th style="border:1px solid #CCCCCC; padding:6px 10px; background-color:#f3f3f3;">Header ${c+1}</th>`;
    }
    tableHTML += '</tr></thead><tbody>';
    for (let r = 0; r < rows; r++) {
      tableHTML += '<tr>';
      for (let c = 0; c < cols; c++) {
        tableHTML += '<td style="border:1px solid #CCCCCC; padding:6px 10px;">Cell</td>';
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table>';
    applyFormat('insertHTML', tableHTML);
  };

  const handleInsertImage = () => {
    const url = prompt('Enter image URL:', 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600');
    if (url) {
      const imgHTML = `<img src="${url}" alt="Image" style="max-width:100%; height:auto; border-radius:4px; margin:12px 0; display:block;" />`;
      applyFormat('insertHTML', imgHTML);
    }
  };

  // Outline Navigation click: scrolls matching element in editor into center view
  const handleOutlineClick = (elId) => {
    const el = document.getElementById(elId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.backgroundColor = '#FFFEE0';
      setTimeout(() => {
        el.style.backgroundColor = 'transparent';
      }, 1000);
    }
  };

  // Zoom controls
  const handleZoomOut = () => setZoom(prev => Math.max(50, prev - 10));
  const handleZoomIn = () => setZoom(prev => Math.min(200, prev + 10));

  // Copy shareable link
  const handleCopyLink = () => {
    const shareableUrl = window.location.href;
    navigator.clipboard.writeText(shareableUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  // Restore history checkpoints
  const handleRestoreVersion = (contentString) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = stripInitialHeading(contentString);
      handleSelectionChange();
      triggerAutosave();
      triggerToast('Restored selected checkpoint to canvas!', 'success');
    }
  };

  // Mock document version history checkpoints
  const historyCheckpoints = doc.versions && doc.versions.length > 0 ? doc.versions : [
    { id: 'v-1', name: 'Original Checkpoint', date: 'Just now', author: 'Eleanor Vance', content: doc.content },
    { id: 'v-2', name: 'Proposal Draft', date: '10 mins ago', author: 'Lisa Chen', content: '<h2>Draft Review</h2><p>Here is an earlier version with basic proposals outlining Q3 roadmaps...</p>' },
    { id: 'v-3', name: 'Template Initialization', date: '1 hour ago', author: 'Alex Johnson', content: '<h2>Workspace Initialized</h2><p>Welcome to your new blank sheet card.</p>' }
  ];

  const tabs = ['File', 'Home', 'Insert', 'Design', 'Layout', 'References', 'Mailings', 'Review', 'View', 'Help'];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F0F4FF] dark:bg-[#090D16] text-[#0A0F1E] dark:text-[#94A3B8] font-sans select-none animate-fade-in transition-colors">
      
      {/* Styles Injection for Formatting Marks and Page Constraints */}
      <style>{`
        .word-page {
          background-color: #FFFFFF !important;
          color: #000000 !important;
        }
        .word-page h1, .word-page h2, .word-page h3, .word-page p, .word-page div {
          color: #000000 !important;
        }
        .word-page h1 {
          font-size: 20pt;
          font-weight: bold;
          margin-top: 14pt;
          margin-bottom: 6pt;
        }
        .word-page h2 {
          font-size: 16pt;
          font-weight: bold;
          margin-top: 12pt;
          margin-bottom: 4pt;
        }
        .word-page h3 {
          font-size: 13pt;
          font-weight: bold;
          margin-top: 10pt;
          margin-bottom: 4pt;
        }
        .word-page p {
          margin-bottom: 8pt;
          font-size: 11pt;
        }
        .word-page ul, .word-page ol {
          margin-bottom: 10pt;
          padding-left: 24px;
        }
        .word-page ul {
          list-style-type: disc;
        }
        .word-page ol {
          list-style-type: decimal;
        }
        ${showFormattingMarks ? `
          .word-editor-body p::after, 
          .word-editor-body h1::after, 
          .word-editor-body h2::after, 
          .word-editor-body h3::after {
            content: " ¶";
            color: #babcbe;
            font-weight: normal;
            font-size: 10pt;
          }
        ` : ''}
      `}</style>

      {/* 1. TITLE BAR */}
      <header className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-[#E2E8F0] dark:bg-[#080E1A] dark:border-[#1E293B] text-[#0A0F1E] dark:text-white shrink-0 h-[38px] transition-colors">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {/* Autosave Switch Toggle */}
          <button 
            onClick={() => {
              setAutosaveEnabled(!autosaveEnabled);
              if (!autosaveEnabled) {
                handleManualSave();
              }
            }}
            className={`p-1 rounded-lg cursor-pointer transition-colors ${
              autosaveEnabled 
                ? 'bg-[#EEF2FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-white' 
                : 'text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B]'
            }`}
            title={autosaveEnabled ? 'AutoSave is On (Click to turn off)' : 'AutoSave is Off (Click to save)'}
          >
            <FiSave size={13} />
          </button>
          
          <button 
            onClick={() => applyFormat('undo')} 
            className="p-1 rounded-lg cursor-pointer text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] transition-colors" 
            title="Undo (Ctrl+Z)"
          >
            <FiRotateCcw size={13} />
          </button>
          <button 
            onClick={() => applyFormat('redo')} 
            className="p-1 rounded-lg cursor-pointer text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] transition-colors" 
            title="Redo (Ctrl+Y)"
          >
            <FiRotateCw size={13} />
          </button>

          <div className="flex items-center gap-1 ml-1.5">
            <input
              type="text"
              className="bg-transparent text-[#0A0F1E] dark:text-white text-xs font-semibold text-center border-none outline-none w-44 hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] focus:bg-[#EEF2FF] dark:focus:bg-[#1E293B] rounded px-1 transition-all"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled Document"
              title="Edit document title inline"
            />
            <span className="text-[#6B7280] dark:text-[#94A3B8] text-[11px] font-normal select-none">- Word</span>
          </div>

          <div className="flex items-center gap-1.5 ml-2 text-[10px] select-none text-[#6B7280] dark:text-[#94A3B8]" title="AutoSave status">
            <span className={`w-1.5 h-1.5 rounded-full ${autosaveState === 'saving' ? 'bg-amber-400 animate-pulse' : 'bg-[#107C10]'}`}></span>
            <span>{autosaveState === 'saving' ? 'Saving...' : 'Saved'}</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Avatar stack */}
          <div className="flex -space-x-1 items-center" title="Collaborators editing now">
            <div className="w-5.5 h-5.5 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center border border-white" title="Eleanor Vance (You)">EV</div>
            <div className="w-5.5 h-5.5 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center border border-white" title="Lisa Chen">LC</div>
            <div className="w-5.5 h-5.5 rounded-full bg-teal-500 text-white text-[9px] font-bold flex items-center justify-center border border-white" title="Alex Johnson">AJ</div>
          </div>

          {/* Share Button */}
          <button 
            onClick={() => setShowShareModal(true)}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FiShare2 size={12} /> Share
          </button>

          {/* Theme switcher */}
          <button 
            onClick={toggleTheme}
            className="p-1 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] text-[#6B7280] dark:text-[#94A3B8] transition-colors cursor-pointer"
            title="Toggle theme (Light / Dark mode)"
          >
            {isDarkMode ? <FiSun size={12} /> : <FiMoon size={12} />}
          </button>

          {/* Window controls */}
          <div className="flex items-center gap-1 ml-1 select-none">
            <div onClick={onBack} className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 cursor-pointer" title="Back to dashboard" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] cursor-default" title="Minimize" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] cursor-default" title="Maximize" />
          </div>
        </div>
      </header>

      {/* 2. RIBBON TABS */}
      <div className="flex items-center bg-white border-b border-[#E2E8F0] dark:bg-[#080E1A] dark:border-[#1E293B] px-2 shrink-0 select-none transition-colors">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 text-xs cursor-pointer transition-colors ${
                isActive 
                  ? 'text-[#0A0F1E] dark:text-white border-b-2 border-[#2563EB] dark:border-[#2563EB] font-semibold bg-transparent' 
                  : 'text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] hover:text-[#0A0F1E] dark:hover:text-white'
              }`}
            >
              {tab}
            </div>
          );
        })}
      </div>

      {/* 3. RIBBON TOOLBAR */}
      <div className="flex items-center gap-0 bg-[#F8FAFF] dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#1E293B] px-2 py-1.5 flex-wrap shrink-0 transition-colors">
        
        {/* HOME TAB TOOLBAR */}
        {activeTab === 'Home' && (
          <>
            {/* Clipboard group */}
            <div className="flex items-center gap-1.5 px-1">
              <button 
                onClick={handlePaste}
                className="flex flex-col items-center justify-center p-0.5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer w-10 h-10 transition-colors text-[#374151] dark:text-[#94A3B8]"
                title="Paste (Ctrl+V)"
              >
                <Clipboard size={14} />
                <span className="text-[8px] text-[#94A3B8] dark:text-[#475569] mt-0.5 leading-none">Paste</span>
              </button>
              <div className="flex flex-col justify-center gap-0.5">
                <button 
                  onClick={handleCut}
                  className="flex items-center gap-1 px-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer transition-colors text-[8px] text-[#374151] dark:text-[#94A3B8]"
                  title="Cut (Ctrl+X)"
                >
                  <Scissors size={8} />
                  <span className="ml-1 text-[8px] leading-none">Cut</span>
                </button>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer transition-colors text-[8px] text-[#374151] dark:text-[#94A3B8]"
                  title="Copy (Ctrl+C)"
                >
                  <Copy size={8} />
                  <span className="ml-1 text-[8px] leading-none">Copy</span>
                </button>
                <button 
                  onClick={handleFormatPainterClick}
                  className="flex items-center gap-1 px-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer transition-colors text-[8px] text-[#374151] dark:text-[#94A3B8]"
                  title="Format Painter"
                >
                  <Paintbrush size={8} />
                  <span className="ml-1 text-[8px] leading-none">Painter</span>
                </button>
              </div>
            </div>
            
            <div className="w-px h-10 bg-[#E2E8F0] dark:bg-[#1E293B] mx-1.5" />

            {/* Font group */}
            <div className="flex flex-col gap-1 px-1">
              <div className="flex items-center gap-1">
                <select 
                  className="bg-white dark:bg-[#080E1A] text-[#374151] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[10px] px-1 py-0.5 h-[22px] w-28 outline-none cursor-pointer hover:border-[#2563EB]/30 transition-colors"
                  value={activeStyles.fontName} 
                  onChange={(e) => applyFormat('fontName', e.target.value)}
                  title="Font Family"
                >
                  <option value="Calibri">Calibri</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Segoe UI">Segoe UI</option>
                </select>
                
                <select 
                  className="bg-white dark:bg-[#080E1A] text-[#374151] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[10px] px-0.5 py-0.5 h-[22px] w-10 outline-none cursor-pointer hover:border-[#2563EB]/30 transition-colors"
                  value={activeStyles.fontSize} 
                  onChange={(e) => applyFormat('fontSize', e.target.value)}
                  title="Font Size"
                >
                  <option value="1">8</option>
                  <option value="2">10</option>
                  <option value="3">11</option>
                  <option value="4">12</option>
                  <option value="5">14</option>
                  <option value="6">18</option>
                  <option value="7">24</option>
                </select>

                <button onClick={handleGrowFont} className="flex items-center justify-center h-[22px] w-[22px] rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] text-[10px] font-bold transition-colors" title="Grow Font">A⁺</button>
                <button onClick={handleShrinkFont} className="flex items-center justify-center h-[22px] w-[22px] rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] text-[9px] font-bold transition-colors" title="Shrink Font">A⁻</button>
                <button onClick={() => applyFormat('removeFormat')} className="flex items-center justify-center h-[22px] w-[22px] rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Clear All Formatting"><Eraser size={11} /></button>
              </div>

              <div className="flex items-center gap-0.5">
                <button 
                  onClick={() => applyFormat('bold')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${activeStyles.bold ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Bold (Ctrl+B)"
                >
                  <Bold size={10} className="font-bold" />
                </button>
                <button 
                  onClick={() => applyFormat('italic')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${activeStyles.italic ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Italic (Ctrl+I)"
                >
                  <Italic size={10} />
                </button>
                <button 
                  onClick={() => applyFormat('underline')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${activeStyles.underline ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Underline (Ctrl+U)"
                >
                  <Underline size={10} />
                </button>
                <button 
                  onClick={() => applyFormat('strikeThrough')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${activeStyles.strikeThrough ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Strikethrough"
                >
                  <Strikethrough size={10} />
                </button>
                
                <button onClick={() => applyFormat('subscript')} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] text-[8px] font-semibold transition-colors" title="Subscript">X₂</button>
                <button onClick={() => applyFormat('superscript')} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] text-[8px] font-semibold transition-colors" title="Superscript">X²</button>
                
                <button onClick={handleHighlight} className="flex flex-col items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Text Highlight">
                  <Highlighter size={9} />
                  <span className="w-3.5 h-0.5 bg-yellow-400 rounded-sm" />
                </button>
                <button onClick={handleFontColor} className="flex flex-col items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Font Color">
                  <span className="text-[9px] font-bold leading-none">A</span>
                  <span className="w-3.5 h-0.5 bg-red-600 rounded-sm" />
                </button>
              </div>
            </div>

            <div className="w-px h-10 bg-[#E2E8F0] dark:bg-[#1E293B] mx-1.5" />

            {/* Paragraph group */}
            <div className="flex flex-col gap-1 px-1">
              <div className="flex items-center gap-0.5">
                <button onClick={() => applyFormat('insertUnorderedList')} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Bullets"><List size={11} /></button>
                <button onClick={() => applyFormat('insertOrderedList')} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Numbering"><ListOrdered size={11} /></button>
                
                <button onClick={() => applyFormat('outdent')} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Decrease Indent"><Outdent size={11} /></button>
                <button onClick={() => applyFormat('indent')} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Increase Indent"><Indent size={11} /></button>
                
                <button onClick={handleSort} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] text-[8px] font-bold transition-colors" title="Sort A-Z">A-Z</button>
                
                <button 
                  onClick={() => setShowFormattingMarks(!showFormattingMarks)} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${showFormattingMarks ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`} 
                  title="Show/Hide Formatting Marks"
                >
                  <span className="text-[10px] font-bold">¶</span>
                </button>
              </div>

              <div className="flex items-center gap-0.5">
                <button 
                  onClick={() => applyFormat('justifyLeft')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${activeStyles.alignLeft ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Align Left"
                >
                  <AlignLeft size={10} />
                </button>
                <button 
                  onClick={() => applyFormat('justifyCenter')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${activeStyles.alignCenter ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Align Center"
                >
                  <AlignCenter size={10} />
                </button>
                <button 
                  onClick={() => applyFormat('justifyRight')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${activeStyles.alignRight ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Align Right"
                >
                  <AlignRight size={10} />
                </button>
                <button 
                  onClick={() => applyFormat('justifyFull')} 
                  className={`flex items-center justify-center h-5 w-5 rounded cursor-pointer transition-colors ${document.queryCommandState('justifyFull') ? 'bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] text-[#374151] dark:text-[#94A3B8]'}`}
                  title="Justify"
                >
                  <AlignJustify size={10} />
                </button>

                <select 
                  onChange={(e) => handleLineSpacing(e.target.value)}
                  className="bg-white dark:bg-[#080E1A] text-[#374151] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[8px] px-0.5 py-0.5 h-5 outline-none cursor-pointer w-10 hover:border-[#2563EB]/30 transition-colors"
                  defaultValue="1.5"
                  title="Line Spacing"
                >
                  <option value="1.0">1.0</option>
                  <option value="1.15">1.15</option>
                  <option value="1.5">1.5</option>
                  <option value="2.0">2.0</option>
                </select>

                <button onClick={() => applyFormat('backColor', '#e0f2fe')} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Shading color"><PaintBucket size={10} /></button>
                <button onClick={handleBorder} className="flex items-center justify-center h-5 w-5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors" title="Add Border"><Grid3x3 size={10} /></button>
              </div>
            </div>

            <div className="w-px h-10 bg-[#E2E8F0] dark:bg-[#1E293B] mx-1.5" />

            {/* Styles Preview Grid */}
            <div className="flex flex-col gap-0.5 px-1">
              <div className="flex items-center gap-1 overflow-x-auto max-w-[240px]">
                <div 
                  onClick={() => applyFormat('formatBlock', 'p')} 
                  className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg bg-white dark:bg-[#080E1A] p-0.5 cursor-pointer hover:border-[#2563EB]/30 hover:bg-[#F8FAFF] dark:hover:bg-[#1E293B] transition-colors w-11 h-8 flex flex-col justify-between flex-shrink-0"
                  title="Normal Text Style"
                >
                  <span className="text-[8px] font-normal leading-none text-gray-800 dark:text-gray-200">AaBb</span>
                  <span className="text-[6px] text-[#94A3B8] leading-none">Normal</span>
                </div>
                <div 
                  onClick={() => applyFormat('formatBlock', 'h1')} 
                  className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg bg-white dark:bg-[#080E1A] p-0.5 cursor-pointer hover:border-[#2563EB]/30 hover:bg-[#F8FAFF] dark:hover:bg-[#1E293B] transition-colors w-11 h-8 flex flex-col justify-between flex-shrink-0"
                  title="Title heading"
                >
                  <span className="text-[8px] font-bold leading-none text-gray-900 dark:text-white">AaBb</span>
                  <span className="text-[6px] text-[#94A3B8] leading-none">Title</span>
                </div>
                <div 
                  onClick={() => applyFormat('formatBlock', 'h2')} 
                  className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg bg-white dark:bg-[#080E1A] p-0.5 cursor-pointer hover:border-[#2563EB]/30 hover:bg-[#F8FAFF] dark:hover:bg-[#1E293B] transition-colors w-11 h-8 flex flex-col justify-between flex-shrink-0"
                  title="Heading 1"
                >
                  <span className="text-[7.5px] font-bold leading-none text-gray-900 dark:text-white">AaBb</span>
                  <span className="text-[6px] text-[#94A3B8] leading-none">Head 1</span>
                </div>
                <div 
                  onClick={() => applyFormat('formatBlock', 'h3')} 
                  className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg bg-white dark:bg-[#080E1A] p-0.5 cursor-pointer hover:border-[#2563EB]/30 hover:bg-[#F8FAFF] dark:hover:bg-[#1E293B] transition-colors w-11 h-8 flex flex-col justify-between flex-shrink-0"
                  title="Heading 2"
                >
                  <span className="text-[7.5px] font-semibold leading-none text-gray-805 dark:text-gray-200">AaBb</span>
                  <span className="text-[6px] text-[#94A3B8] leading-none">Head 2</span>
                </div>
                <div 
                  onClick={() => applyFormat('formatBlock', 'blockquote')} 
                  className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg bg-white dark:bg-[#080E1A] p-0.5 cursor-pointer hover:border-[#2563EB]/30 hover:bg-[#F8FAFF] dark:hover:bg-[#1E293B] transition-colors w-11 h-8 flex flex-col justify-between flex-shrink-0"
                  title="Subtitle quote style"
                >
                  <span className="text-[8px] italic leading-none text-gray-500">AaBb</span>
                  <span className="text-[6px] text-[#94A3B8] leading-none">Subt</span>
                </div>
              </div>
              <div className="text-[9px] text-[#94A3B8] text-center select-none leading-none mt-1">Styles</div>
            </div>

            <div className="w-px h-10 bg-[#E2E8F0] dark:bg-[#1E293B] mx-1.5" />

            {/* Editing actions */}
            <div className="flex items-center gap-1 px-1">
              <button 
                onClick={() => setShowFindReplace(true)}
                className="flex flex-col items-center justify-center p-0.5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer min-w-[26px] h-10 transition-colors text-[#374151] dark:text-[#94A3B8]"
                title="Find text (Ctrl+F)"
              >
                <Search size={12} />
                <span className="text-[7.5px] text-[#94A3B8] leading-none mt-0.5">Find</span>
              </button>
              <button 
                onClick={() => setShowFindReplace(true)}
                className="flex flex-col items-center justify-center p-0.5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer min-w-[26px] h-10 transition-colors text-[#374151] dark:text-[#94A3B8]"
                title="Replace text (Ctrl+H)"
              >
                <Replace size={12} />
                <span className="text-[7.5px] text-[#94A3B8] leading-none mt-0.5">Replace</span>
              </button>
              <button 
                onClick={() => applyFormat('selectAll')}
                className="flex flex-col items-center justify-center p-0.5 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer min-w-[26px] h-10 transition-colors text-[#374151] dark:text-[#94A3B8]"
                title="Select All"
              >
                <span className="text-[9px] font-bold leading-none">All</span>
                <span className="text-[7.5px] text-[#94A3B8] leading-none mt-0.5">Select</span>
              </button>
            </div>
          </>
        )}

        {/* INSERT TAB TOOLBAR */}
        {activeTab === 'Insert' && (
          <div className="flex items-center gap-2.5 px-2">
            <button 
              onClick={handleInsertTable}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] min-w-[36px] transition-colors"
              title="Insert Table Grid"
            >
              <Table size={14} />
              <span className="text-[8px] text-[#94A3B8] mt-0.5">Table</span>
            </button>
            
            <button 
              onClick={handleInsertImage}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] min-w-[36px] transition-colors"
              title="Insert Picture"
            >
              <Image size={14} />
              <span className="text-[8px] text-[#94A3B8] mt-0.5">Pictures</span>
            </button>

            <button 
              onClick={handleInsertLink}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] min-w-[36px] transition-colors"
              title="Insert Hyperlink"
            >
              <Link size={14} />
              <span className="text-[8px] text-[#94A3B8] mt-0.5">Link</span>
            </button>

            <div className="w-px h-8 bg-[#E2E8F0] dark:bg-[#1E293B] mx-1" />

            <div className="text-[10px] text-[#94A3B8] select-none flex items-center gap-1 italic">
              <span>Header</span> | <span>Footer</span> | <span>WordArt</span>
            </div>
          </div>
        )}

        {/* VIEW TAB TOOLBAR */}
        {activeTab === 'View' && (
          <div className="flex items-center gap-4 px-2">
            {/* Show controls group */}
            <div className="flex flex-col gap-0.5 text-[10px] text-[#6B7280] dark:text-[#94A3B8]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showRuler} 
                  onChange={(e) => setShowRuler(e.target.checked)} 
                  className="rounded accent-[#2563EB] cursor-pointer"
                />
                <span>Ruler</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!leftSidebarCollapsed} 
                  onChange={(e) => setLeftSidebarCollapsed(!e.target.checked)} 
                  className="rounded accent-[#2563EB] cursor-pointer"
                />
                <span>Navigation Pane</span>
              </label>
            </div>
            
            <div className="w-px h-8 bg-[#E2E8F0] dark:bg-[#1E293B] mx-1" />
            
            {/* Zoom presets */}
            <button 
              onClick={() => setZoom(100)} 
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] min-w-[36px] transition-colors"
              title="Set zoom to 100%"
            >
              <span className="font-bold text-[10px]">100%</span>
              <span className="text-[7.5px] text-[#94A3B8] leading-none">Zoom 100</span>
            </button>

            <button 
              onClick={() => setZoom(120)} 
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] min-w-[36px] transition-colors"
              title="Set zoom to page width"
            >
              <span className="text-[10px]">Page Width</span>
              <span className="text-[7.5px] text-[#94A3B8] leading-none">Zoom 120</span>
            </button>
          </div>
        )}

        {/* FILE TAB TOOLBAR */}
        {activeTab === 'File' && (
          <div className="flex items-center gap-3 px-2">
            <button 
              onClick={onBack}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors"
              title="Return to documents list"
            >
              <ArrowLeft size={13} />
              <span className="text-[8px] text-[#94A3B8] mt-0.5 leading-none">Dashboard</span>
            </button>

            <button 
              onClick={handleManualSave}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors"
              title="Save a backup checkpoint now"
            >
              <FiSave size={13} />
              <span className="text-[8px] text-[#94A3B8] mt-0.5 leading-none">Backup Save</span>
            </button>

            <button 
              onClick={() => {
                setLeftSidebarCollapsed(false);
                setLeftTab('history');
              }}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] cursor-pointer text-[#374151] dark:text-[#94A3B8] transition-colors"
              title="Open checkpoints history sidebar"
            >
              <History size={13} />
              <span className="text-[8px] text-[#94A3B8] mt-0.5 leading-none">Checkpoints</span>
            </button>
          </div>
        )}

        {/* DESIGN, LAYOUT, REFERENCES, MAILINGS, REVIEW, HELP */}
        {['Design', 'Layout', 'References', 'Mailings', 'Review', 'Help'].includes(activeTab) && (
          <div className="text-[10px] text-[#94A3B8] flex items-center h-8 px-2 italic">
            {activeTab} tab tools loaded. Add formatting elements in the editor below.
          </div>
        )}

      </div>

      {/* 4. RULER */}
      {showRuler && (
        <div className="flex items-center bg-[#F8FAFF] dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#1E293B] h-6 px-[96px] overflow-hidden select-none shrink-0 transition-colors">
          {/* Grey margin indent box */}
          <div className="w-[96px] h-full bg-[#E2E8F0] dark:bg-[#1E293B] border-r border-[#E2E8F0] dark:border-[#1E293B] flex-shrink-0" />
          
          {/* Main ruler ticks */}
          <div className="flex flex-1 items-center h-full relative pl-[10px]">
            {Array.from({length: 20}, (_, i) => (
              <div key={i} className="relative flex-shrink-0" style={{width: '48px'}}>
                <div className="absolute top-0 w-px h-1.5 bg-[#94A3B8] dark:bg-[#475569]"/>
                <span className="absolute top-1.5 text-[8px] text-[#94A3B8] dark:text-[#475569] -translate-x-1/2">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MAIN AREA (sidebar + document canvas) */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* LEFT SIDEBAR (Navigation Pane) */}
        {!leftSidebarCollapsed && (
          <aside className="w-52 bg-white dark:bg-[#080E1A] border-r border-[#E2E8F0] dark:border-[#1E293B] flex flex-col overflow-hidden shrink-0 transition-colors">
            {/* Sidebar header tabs */}
            <div className="flex border-b border-[#E2E8F0] dark:border-[#1E293B] h-8 shrink-0 select-none">
              {['outline', 'pages', 'history'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLeftTab(tab)}
                  className={`flex-1 text-[10px] font-bold uppercase transition-colors border-b-2 cursor-pointer ${
                    leftTab === tab 
                      ? 'border-[#2563EB] text-[#2563EB] dark:text-white' 
                      : 'border-transparent text-[#6B7280] dark:text-[#94A3B8] hover:text-[#0A0F1E] dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Sidebar content scroll container */}
            <div className="flex-1 overflow-y-auto p-2">
              {/* Outline Tab heading list */}
              {leftTab === 'outline' && (
                <div className="flex flex-col gap-1 select-none">
                  {outline.length === 0 ? (
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 p-2 italic leading-tight">
                      No outline headings found. Write using Heading Styles (Title, Head 1, etc.) to build heading structure.
                    </div>
                  ) : (
                    outline.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleOutlineClick(item.id)}
                        className={`text-left text-sm py-1 px-1.5 rounded truncate text-[#0A0F1E] dark:text-[#94A3B8] hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] cursor-pointer transition-colors ${
                          item.level === 'h1' 
                            ? 'font-semibold pl-1' 
                            : item.level === 'h2' 
                            ? 'pl-4 text-[#6B7280] dark:text-[#94A3B8]/80' 
                            : 'pl-7 text-[#94A3B8] dark:text-[#94A3B8]/60 text-xs'
                        }`}
                        title={item.text}
                      >
                        {item.text}
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Pages Tab thumbnails list */}
              {leftTab === 'pages' && (
                <div className="flex flex-col items-center gap-3 py-2 select-none">
                  <div className="w-28 h-36 bg-white dark:bg-[#080E1A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm rounded-lg p-2 flex flex-col justify-between cursor-default">
                    <div className="flex flex-col gap-1 opacity-25">
                      <div className="h-1 bg-gray-500 dark:bg-gray-400 w-full" />
                      <div className="h-1 bg-gray-500 dark:bg-gray-400 w-5/6" />
                      <div className="h-1 bg-gray-500 dark:bg-gray-400 w-full" />
                      <div className="h-1 bg-gray-500 dark:bg-gray-400 w-4/6" />
                    </div>
                    <span className="text-[9px] text-[#6B7280] dark:text-[#94A3B8] text-center font-bold">Page 1</span>
                  </div>
                </div>
              )}

              {/* History checkpoints Tab list */}
              {leftTab === 'history' && (
                <div className="flex flex-col gap-2 p-1">
                  {historyCheckpoints.map((v) => (
                    <div 
                      key={v.id}
                      onClick={() => handleRestoreVersion(v.content)}
                      className="border border-[#E2E8F0] dark:border-[#1E293B] p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] cursor-pointer transition-colors"
                      title="Click to restore this backup checkpoint"
                    >
                      <div className="text-[10px] font-bold text-[#0A0F1E] dark:text-white">{v.date}</div>
                      <div className="text-[8px] text-[#6B7280] dark:text-[#94A3B8]">By {v.author}</div>
                      <div className="text-[9px] text-[#6B7280] dark:text-[#94A3B8] mt-1 leading-snug">{v.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Collapse footer */}
            <button 
              onClick={() => setLeftSidebarCollapsed(true)}
              className="h-8 border-t border-[#E2E8F0] dark:border-[#1E293B] text-[10px] text-[#6B7280] dark:text-[#94A3B8] hover:text-[#0A0F1E] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] flex items-center justify-center gap-1 cursor-pointer shrink-0 select-none transition-colors"
            >
              <ChevronLeft size={10} /> Collapse Navigation
            </button>
          </aside>
        )}

        {/* Small expand grip tab when collapsed */}
        {leftSidebarCollapsed && (
          <div 
            onClick={() => setLeftSidebarCollapsed(false)}
            className="w-4 bg-white dark:bg-[#080E1A] hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] border-r border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-center cursor-pointer shrink-0 transition-colors"
            title="Expand Navigation Pane"
          >
            <ChevronRight size={10} className="text-gray-400" />
          </div>
        )}

        {/* DOCUMENT CANVAS CONTAINER */}
        <section className="flex-1 bg-[#E8ECF0] dark:bg-[#2C2C2C] overflow-auto flex justify-center py-8 relative transition-colors">
          
          {/* Document A4 Page Sheet */}
          <div 
            className="bg-white shadow-md min-h-[1056px] w-[816px] px-[96px] py-[96px] relative text-left word-page select-text shrink-0"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              marginBottom: `${Math.max(24, 24 * (zoom / 100))}px`,
              backgroundColor: '#FFFFFF'
            }}
          >
            {/* Title - ONLY ONCE */}
            <h1 
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                handleTitleChange(e.target.innerText);
              }}
              className="text-3xl font-bold text-[#0A0F1E] outline-none mb-2"
            >
              {title}
            </h1>
            <hr className="border-gray-200 mb-6"/>

            {/* contentEditable body area */}
            <div
              ref={editorRef}
              className={`outline-none min-h-[800px] text-[11pt] font-[Calibri] text-gray-900 leading-relaxed word-editor-body`}
              contentEditable
              placeholder="Start typing your document here..."
              onInput={handleInput}
              onKeyUp={handleSelectionChange}
              onMouseUp={handleSelectionChange}
            />
          </div>

          {/* Find and Replace float box */}
          {showFindReplace && (
            <div className="absolute top-3 right-4 bg-white dark:bg-[#080E1A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-2xl rounded-lg p-2 z-50 flex items-center gap-2 text-xs transition-colors">
              <input 
                type="text" 
                placeholder="Find text..." 
                value={findText} 
                onChange={(e) => setFindText(e.target.value)}
                className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg px-2 py-1 bg-transparent text-[#0A0F1E] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              />
              <input 
                type="text" 
                placeholder="Replace..." 
                value={replaceText} 
                onChange={(e) => setReplaceText(e.target.value)}
                className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg px-2 py-1 bg-transparent text-[#0A0F1E] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              />
              <button 
                onClick={handleFind} 
                className="bg-[#2563EB] text-white px-2 py-1 rounded-lg hover:bg-[#1D4ED8] cursor-pointer font-semibold transition-colors"
              >
                Find Next
              </button>
              <button 
                onClick={handleReplace} 
                className="bg-[#107C10] text-white px-2 py-1 rounded-lg hover:bg-[#0F6F0F] cursor-pointer font-semibold transition-colors"
              >
                Replace
              </button>
              <button 
                onClick={() => setShowFindReplace(false)} 
                className="text-[#6B7280] dark:text-[#94A3B8] hover:text-[#0A0F1E] dark:hover:text-white cursor-pointer font-bold px-1.5 transition-colors"
              >
                ✕
              </button>
            </div>
          )}
        </section>

      </div>

      {/* 6. STATUS BAR */}
      <div className="flex items-center justify-between px-4 py-1 bg-[#2563EB] text-white text-xs shrink-0 select-none">
        
        <div className="flex items-center gap-3">
          <span>Page 1 of 1</span>
          <span className="opacity-40">|</span>
          <span>{wordCount} words</span>
          <span className="opacity-40">|</span>
          <span>Characters: {charCount}</span>
          <span className="opacity-40">|</span>
          <span>English (US)</span>
        </div>

        <div className="flex items-center gap-3">
          <span>Accessibility: Good to go</span>
          <span className="opacity-40">|</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setZoom(z => Math.max(50, z - 10))}
              className="hover:bg-white/20 rounded w-5 h-5 flex items-center justify-center"
            >
              −
            </button>
            <input 
              type="range" 
              min="50" max="200" 
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="w-20 accent-white"
              step="10"
            />
            <button 
              onClick={() => setZoom(z => Math.min(200, z + 10))}
              className="hover:bg-white/20 rounded w-5 h-5 flex items-center justify-center"
            >
              +
            </button>
            <span className="w-8 text-center">
              {zoom}%
            </span>
          </div>
        </div>
      </div>

      {/* Share / Invitation Modal Overlay */}
      {showShareModal && (
        <div className="flat-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="flat-modal-card bg-white dark:bg-[#080E1A] text-[#0A0F1E] dark:text-white border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl shadow-2xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flat-modal-header border-b border-[#E2E8F0] dark:border-[#1E293B] pb-2 flex justify-between items-center">
              <h3 className="flat-modal-title text-sm font-bold text-[#0A0F1E] dark:text-white">Share Workspace Link</h3>
              <button 
                className="p-1 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B] text-[#6B7280] dark:text-[#94A3B8] transition-colors cursor-pointer" 
                onClick={() => setShowShareModal(false)}
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="flat-modal-body py-3 flex flex-col gap-3">
              <div className="flat-form-group flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#94A3B8] dark:text-[#475569] uppercase tracking-wide">Invite collaborator email</label>
                <div className="flat-form-row flex gap-2">
                  <input 
                    type="email" 
                    className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg px-2.5 py-1 bg-white dark:bg-[#080E1A] text-xs flex-1 text-[#0A0F1E] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors" 
                    placeholder="colleague@domain.com"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                  <select 
                    className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-xs px-1.5 py-1 bg-white dark:bg-[#080E1A] text-[#0A0F1E] dark:text-white cursor-pointer outline-none focus:border-[#2563EB] transition-colors"
                    value={shareRole}
                    onChange={(e) => setShareRole(e.target.value)}
                  >
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <button 
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-3 py-1 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      if (shareEmail.trim()) {
                        triggerToast(`Sent invite to ${shareEmail} as ${shareRole}`, 'success');
                        setShareEmail('');
                      }
                    }}
                  >
                    Invite
                  </button>
                </div>
              </div>

              <div className="flat-form-group flex flex-col gap-1 border-t border-[#E2E8F0] dark:border-[#1E293B] pt-2">
                <label className="text-[10px] font-bold text-[#94A3B8] dark:text-[#475569] uppercase tracking-wide">Shareable Link</label>
                <div className="flat-copy-box flex gap-2">
                  <input 
                    type="text" 
                    className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg px-2 py-1 bg-[#F8FAFF] dark:bg-[#0F172A] text-[10px] flex-1 text-[#6B7280] dark:text-[#94A3B8]" 
                    readOnly 
                    value={window.location.href}
                  />
                  <button 
                    className="bg-[#EEF2FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] hover:bg-[#2563EB] hover:text-white dark:hover:bg-[#2563EB] dark:hover:text-white text-xs px-3 py-1 rounded-lg cursor-pointer transition-colors" 
                    onClick={handleCopyLink}
                  >
                    {linkCopied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
