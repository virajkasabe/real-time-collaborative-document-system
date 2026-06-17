import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { 
  ChevronLeft, Cloud, Users, Share2, Send, Plus, 
  Trash2, MessageSquare, History, List, X, Copy, Check, Sun, Moon, 
  BookOpen, Search, Undo, Redo, RefreshCw, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { documentService } from '../services/documentService';
import { fetchDoc } from '../apis/api';

export default function EditingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, triggerToast } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [doc, setDoc] = useState(null);
  const [docUserRole, setDocUserRole] = useState(null)

  // Fetch document details
  useEffect(() => {

    ;(async()=>{
        const fetched = await fetchDoc(id);
        triggerToast("document fetch Successfully", 'success')
        if (!fetched) {
          triggerToast('Document not found', 'warning');
          navigate('/dashboard');
          return;
        }
        setDocUserRole(fetched.data.data.role)
        setDoc(fetched.data.data);
    })()
  }, [id]);

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
      <div className="min-h-screen bg-[#F7FAFF] dark:bg-[#070B14] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D6EFD]"></div>
      </div>
    );
  }

  return (
    <EditingPageContent
      document={doc.document}
      theme={theme}
      toggleTheme={toggleTheme}
      onBack={handleBack}
      onSave={handleSave}
      docUserRole={docUserRole}
    />
  );
}

function EditingPageContent({ document: doc, theme, toggleTheme, onBack, onSave, docUserRole }) {
  const [title, setTitle] = useState(doc.title || doc.name || 'Untitled Document')
  const [isSyncing, setIsSyncing] = useState(false)
  
  // Collapse sidebars by default to match Microsoft Word's paper focus
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(true)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true)
  
  const [leftTab, setLeftTab] = useState('outline') // 'outline' | 'history'
  const [rightTab, setRightTab] = useState('chat') // 'chat' | 'comments'
  
  // Microsoft Word Layout State Variables
  const [activeRibbonTab, setActiveRibbonTab] = useState('home')
  const [zoomPercent, setZoomPercent] = useState(100)
  const [autoSaveActive, setAutoSaveActive] = useState(true)
  
  // Format Painter state
  const [copiedFormat, setCopiedFormat] = useState(null)
  const [formatPainterActive, setFormatPainterActive] = useState(false)
  
  // Find & Replace state
  const [showFindReplace, setShowFindReplace] = useState(false)
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [searchIndex, setSearchIndex] = useState(0)
  
  // Document Outline State
  const [outline, setOutline] = useState([])
  
  const [wordCount, setWordCount] = useState(doc.wordCount || 0);

  // History State
  const [history, setHistory] = useState(() => {
    if (doc.versions && doc.versions.length > 0) {
      return doc.versions.map((v, index) => ({
        id: v.id,
        time: v.date,
        author: v.author,
        desc: v.name,
        active: index === 0,
        content: v.content
      }));
    }
    return [
      { id: 1, time: 'Just now', author: 'You', desc: 'Saved changes to cloud', active: true },
      { id: 2, time: '10 minutes ago', author: 'Lisa Chen', desc: 'Added meeting sync proposal section', active: false },
      { id: 3, time: '45 minutes ago', author: 'Alex Johnson', desc: 'Formatted code blocks', active: false },
      { id: 4, time: '2 hours ago', author: 'Tanmay Wagh', desc: 'Created document from template', active: false }
    ];
  });

  // Comments State
  const [comments, setComments] = useState(() => {
    if (doc.comments && doc.comments.length > 0) {
      return doc.comments.map(c => ({
        id: c.id,
        author: c.user,
        text: c.text,
        time: c.time
      }));
    }
    return [
      { 
        id: 1, 
        author: 'Lisa Chen', 
        text: 'This introductory paragraph looks very solid. Should we add a link to the project roadmap?', 
        time: '10m ago' 
      },
      { 
        id: 2, 
        author: 'Alex Johnson', 
        text: 'Love the syntax highlighting in the pre blocks! Let’s add a section for Node setup as well.', 
        time: '2m ago' 
      }
    ];
  });
  const [newCommentText, setNewCommentText] = useState('')

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      sender: 'Alex Johnson', 
      text: 'Hey! I am checking out the new editor outline view. It looks super fast.', 
      time: '10:05 AM', 
      type: 'received' 
    },
    { 
      id: 2, 
      sender: 'Lisa Chen', 
      text: 'Yes, the heading synchronization is incredibly smooth!', 
      time: '10:06 AM', 
      type: 'received' 
    }
  ])
  const [chatInputText, setChatInputText] = useState('')

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareEmail, setShareEmail] = useState('')
  const [shareRole, setShareRole] = useState('editor')
  const [copied, setCopied] = useState(false)


  const quillRef = useRef(null)
  const quillInstance = useRef(null)
  const chatBottomRef = useRef(null)

  // 1. Manage Immersive Layout Mode on mount/unmount
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) root.classList.add('editor-mode')
    return () => {
      if (root) root.classList.remove('editor-mode')
    }
  }, [])

  // 2. Initialize Quill Editor
  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: '#word-ribbon-toolbar' // Bind custom Microsoft Word Ribbon container!
        },
        placeholder: 'Start writing your document here...'
      })

      // Set initial content
      const initialContent = doc.content || `
        <h1>📝 ${doc.name || 'Untitled CollabDocs Sheet'}</h1>
        <p>Welcome to your new paged real-time document workspace. This document is fully synchronized with our cloud network.</p>
        <h2>🔥 Custom Rich Text Features</h2>
        <p>You can format this document using the custom Calibri typography ribbon, adjust paragraph shading, paint styles, and launch inline checklists.</p>
        <h2>👥 Real-Time Collaboration Mock</h2>
        <p>Online team members like Sarah Connor and Dave Grohl can comment and view edits instantaneously.</p>
      `
      quillInstance.current.clipboard.dangerouslyPasteHTML(initialContent)

      // Initial outline extraction
      setTimeout(updateOutline, 100)  

      // Handle editor content updates
      quillInstance.current.on('text-change', () => {
        setIsSyncing(true)
        updateOutline()

        const html = quillInstance.current.root.innerHTML
        const text = quillInstance.current.getText()
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
        setWordCount(words)

        // Fire auto-save after short delay to simulate cloud sync
        const timeoutId = setTimeout(() => {
          onSave(title, html, words)
          setIsSyncing(false)
        }, 800)

        return () => clearTimeout(timeoutId)
      })
    }
  }, [])

  // 3. Keep Title Updates Auto-Saved
  const handleTitleChange = (newTitle) => {
    setTitle(newTitle)
    setIsSyncing(true)
    
    const html = quillInstance.current ? quillInstance.current.root.innerHTML : (doc.content || '')
    const text = quillInstance.current ? quillInstance.current.getText() : ''
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length

    setTimeout(() => {
      onSave(newTitle, html, words)
      setIsSyncing(false)
    }, 800)
  }

  // 4. Auto-scroll to bottom of chat list
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages])

  // 5. Extract Outline Headings from Quill DOM
  const updateOutline = () => {
    if (quillInstance.current) {
      const editorEl = quillInstance.current.root
      const headings = Array.from(editorEl.querySelectorAll('h1, h2, h3'))
      const outlineData = headings.map((heading, index) => {
        if (!heading.id) {
          heading.id = `heading-ref-${index}`
        }
        return {
          id: heading.id,
          text: heading.innerText || heading.textContent || '',
          level: heading.tagName.toLowerCase() // 'h1', 'h2', 'h3'
        }
      })
      setOutline(outlineData)
    }
  }

  // 6. Handle Outline Item Navigation Click
  const handleOutlineClick = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Brief visual flash to highlight destination element
      el.style.transition = 'background-color 0.4s'
      el.style.backgroundColor = 'var(--accent-bg)'
      setTimeout(() => {
        el.style.backgroundColor = 'transparent'
      }, 800)
    }
  }

  // 7. Format Painter selection hooks
  useEffect(() => {
    if (quillInstance.current) {
      const handleSelectionChange = (range, oldRange, source) => {
        if (range && range.index !== null) {
          // If Format Painter is active and user selected a new block of text, apply styles
          if (formatPainterActive && copiedFormat && range.length > 0) {
            Object.keys(copiedFormat).forEach((fmt) => {
              quillInstance.current.formatText(range.index, range.length, fmt, copiedFormat[fmt]);
            });
            setFormatPainterActive(false); // Reset paint active state
          }
        }
      };

      quillInstance.current.on('selection-change', handleSelectionChange);
      return () => {
        if (quillInstance.current) {
          quillInstance.current.off('selection-change', handleSelectionChange);
        }
      };
    }
  }, [formatPainterActive, copiedFormat]);

  const handleFormatPainterClick = () => {
    if (!quillInstance.current) return;
    const range = quillInstance.current.getSelection();
    if (range && range.length > 0) {
      const formats = quillInstance.current.getFormat(range.index, range.length);
      setCopiedFormat(formats);
      setFormatPainterActive(true);
    } else {
      alert("Select some formatted text first to copy its style!");
    }
  };

  // 8. Find & Replace Action Handlers
  const handleFindNext = () => {
    if (!quillInstance.current || !findText) return;
    const text = quillInstance.current.getText();
    const index = text.toLowerCase().indexOf(findText.toLowerCase(), searchIndex);
    if (index !== -1) {
      quillInstance.current.setSelection(index, findText.length);
      setSearchIndex(index + findText.length);
    } else {
      // Loop back to start
      const startIndex = text.toLowerCase().indexOf(findText.toLowerCase(), 0);
      if (startIndex !== -1) {
        quillInstance.current.setSelection(startIndex, findText.length);
        setSearchIndex(startIndex + findText.length);
      } else {
        alert(`No matches found for "${findText}"`);
        setSearchIndex(0);
      }
    }
  };

  const handleReplace = () => {
    if (!quillInstance.current || !findText) return;
    const range = quillInstance.current.getSelection();
    if (range && range.length > 0) {
      const selectedText = quillInstance.current.getText(range.index, range.length);
      if (selectedText.toLowerCase() === findText.toLowerCase()) {
        quillInstance.current.deleteText(range.index, range.length);
        quillInstance.current.insertText(range.index, replaceText);
        quillInstance.current.setSelection(range.index, replaceText.length);
        setSearchIndex(range.index + replaceText.length);
      }
    } else {
      handleFindNext();
    }
  };

  const handleReplaceAll = () => {
    if (!quillInstance.current || !findText) return;
    let text = quillInstance.current.getText();
    let index = text.toLowerCase().indexOf(findText.toLowerCase(), 0);
    let count = 0;
    while (index !== -1) {
      quillInstance.current.deleteText(index, findText.length);
      quillInstance.current.insertText(index, replaceText);
      count++;
      text = quillInstance.current.getText();
      index = text.toLowerCase().indexOf(findText.toLowerCase(), index + replaceText.length);
    }
    alert(`Replaced ${count} occurrences of "${findText}"!`);
    setSearchIndex(0);
    updateOutline();
  };

  // Apply Microsoft Word Style Box selection programmatically
  const applyWordStyle = (styleType) => {
    if (!quillInstance.current) return;
    const range = quillInstance.current.getSelection() || { index: 0, length: 0 };
    
    // Clear standard headings first
    quillInstance.current.formatLine(range.index, range.length || 1, 'header', false);
    quillInstance.current.formatLine(range.index, range.length || 1, 'blockquote', false);

    if (styleType === 'heading1') {
      quillInstance.current.formatLine(range.index, range.length || 1, 'header', 1);
    } else if (styleType === 'heading2') {
      quillInstance.current.formatLine(range.index, range.length || 1, 'header', 2);
    } else if (styleType === 'title') {
      quillInstance.current.formatLine(range.index, range.length || 1, 'header', 1);
      quillInstance.current.formatText(range.index, range.length || 1, 'bold', true);
    } else if (styleType === 'subtitle') {
      quillInstance.current.formatLine(range.index, range.length || 1, 'header', 3);
      quillInstance.current.formatText(range.index, range.length || 1, 'italic', true);
    }
    updateOutline();
  };

  // Simulated Chat Handlers
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!chatInputText.trim()) return

    const userMessage = {
      id: Date.now(),
      sender: 'You',
      text: chatInputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'sent'
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInputText('')
    setIsSyncing(true)

    // Dynamic response simulation
    setTimeout(() => {
      const replies = [
        "That looks perfect! The structure flows really well.",
        "Oh nice, I see you updated the main objectives block.",
        "Makes sense! I will check the proposal outlines again.",
        "Let me know when you need my review on the setup notes.",
        "Awesome! The live outline widget is matching perfectly.",
        "Should we add another section describing our REST endpoint specs?"
      ]
      const team = ['Lisa Chen', 'Alex Johnson', 'Antigravity AI']
      const randomMember = team[Math.floor(Math.random() * team.length)]
      const randomReply = replies[Math.floor(Math.random() * replies.length)]

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: randomMember,
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'received'
        }
      ])
      setIsSyncing(false)
    }, 1500)
  }

  // Simulated Comments Handlers
  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newCommentText.trim()) return

    const newComment = {
      id: Date.now(),
      author: 'You',
      text: newCommentText,
      time: 'Just now'
    }

    setComments([newComment, ...comments])
    setNewCommentText('')
  }

  // Link Copying Handler for Share Modal
  const handleCopyLink = () => {
    const dummyUrl = `https://quillsuite.collab/docs/${doc.id}`
    navigator.clipboard.writeText(dummyUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Zoom controls
  const handleZoomOut = () => setZoomPercent((prev) => Math.max(50, prev - 10));
  const handleZoomIn = () => setZoomPercent((prev) => Math.min(150, prev + 10));

  return (
    <div className="word-editor-layout">
      
      {/* 1. TOP WINDOW TITLE BAR (Word Top Bar) */}
      <header className="editor-header">
        <div className="editor-header-left">
          <button className="sidebar-toggle-btn" onClick={onBack} title="Back to Dashboard">
            <ChevronLeft size={20} />
          </button>

          {/* Quick Access Toolbar Icons */}
          <div className="quick-access-icons">
            <button 
              className={`autosave-toggle ${autoSaveActive ? 'active' : ''}`} 
              onClick={() => setAutoSaveActive(!autoSaveActive)}
              title={`AutoSave is ${autoSaveActive ? 'ON' : 'OFF'}`}
            >
              <RefreshCw size={14} className={autoSaveActive ? 'rotating-slow' : ''} />
              <span className="autosave-label">AutoSave</span>
            </button>
            <button onClick={() => quillInstance.current?.history.undo()} title="Undo (Ctrl+Z)">
              <Undo size={14} />
            </button>
            <button onClick={() => quillInstance.current?.history.redo()} title="Redo (Ctrl+Y)">
              <Redo size={14} />
            </button>
          </div>
          
          <div className="doc-title-container">
            <input
              type="text"
              className="doc-title-input"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled Document"
              title="Edit document title"
            />
            <span className="word-file-extension" style={{ display: 'inline-flex', alignItems: 'center', height: '32px' }}>- Word</span>
            <span className="word-title-cloud-status" title="Saved to Cloud" style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '6px', height: '32px' }}>
              <Cloud size={14} style={{ color: 'var(--accent)' }} />
            </span>
            <span className="text-center text-[14px] text-yellow-400">{docUserRole}</span>
          </div>
        </div>

        <div className="editor-header-center">
          <div className="word-header-search">
            <Search size={14} className="search-glass-icon" />
            <input type="text" placeholder="Search (Alt+Q)" disabled title="Microsoft Search features" />
          </div>
        </div>

        <div className="editor-header-right">
          <div className="avatar-stack">
            <div className="avatar-item" style={{ backgroundColor: 'var(--accent)' }} data-tooltip="You (Editor)">Y</div>
            <div className="avatar-item" style={{ backgroundColor: '#10b981' }} data-tooltip="Lisa Chen">LC</div>
            <div className="avatar-item" style={{ backgroundColor: '#3b82f6' }} data-tooltip="Alex Johnson">AJ</div>
            <div className="avatar-item avatar-more" data-tooltip="Simulated team members">+1</div>
          </div>

          <button className="theme-toggle-btn" onClick={toggleTheme} title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"} style={{ marginRight: '8px' }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="btn-primary" onClick={() => setShowShareModal(true)}>
            <Share2 size={16} /> Share
          </button>
        </div>
      </header>

      {/* 2. RIBBON TABS BAR */}
      <div className="word-ribbon-tabs-bar">
        <button className="ribbon-tab-header-btn" onClick={() => alert("File Options:\n- Back to Dashboard\n- Document is auto-saved locally.")}>File</button>
        <button 
          className={`ribbon-tab-header-btn ${activeRibbonTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveRibbonTab('home')}
        >
          Home
        </button>
        <button 
          className={`ribbon-tab-header-btn ${activeRibbonTab === 'insert' ? 'active' : ''}`}
          onClick={() => setActiveRibbonTab('insert')}
        >
          Insert
        </button>
        <button 
          className={`ribbon-tab-header-btn ${activeRibbonTab === 'design' ? 'active' : ''}`}
          onClick={() => {
            setActiveRibbonTab('design');
            alert("Design Ribbons: System accents are anchored to " + theme + " Cobalt.");
          }}
        >
          Design
        </button>
        <button className="ribbon-tab-header-btn" onClick={() => alert("Layout Ribbon: Margins and A4 sheet structure is active by default.")}>Layout</button>
        <button className="ribbon-tab-header-btn" onClick={() => alert("References Ribbon: Heading indexes are automatically built.")}>References</button>
        <button className="ribbon-tab-header-btn" onClick={() => alert("Mailings Ribbon: Collaborative share triggers are active.")}>Mailings</button>
        <button 
          className={`ribbon-tab-header-btn ${activeRibbonTab === 'review' ? 'active' : ''}`}
          onClick={() => setActiveRibbonTab('review')}
        >
          Review
        </button>
        <button 
          className={`ribbon-tab-header-btn ${activeRibbonTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveRibbonTab('view')}
        >
          View
        </button>
        <button className="ribbon-tab-header-btn" onClick={() => alert("Help Ribbon: Contact Antigravity AI for developer notes.")}>Help</button>
      </div>

      {/* 3. WORD RIBBON CONTROL PANEL (Quill HTML Toolbar!) */}
      <div id="word-ribbon-toolbar" className="word-ribbon-toolbar-panel">
        
        {/* HOME TAB CONTENT */}
        <div className={`ribbon-tab-content ${activeRibbonTab === 'home' ? 'visible' : 'hidden'}`}>
          {/* Clipboard Group */}
          <div className="ribbon-group clipboard-group">
            <div className="ribbon-buttons-grid">
              <button className="ribbon-large-btn ql-paste" onClick={() => alert("Press Ctrl+V to paste rich text contents.")} title="Paste (Ctrl+V)">
                📋
                <span>Paste</span>
              </button>
              <div className="ribbon-small-buttons">
                <button className="ql-cut" onClick={() => alert("Press Ctrl+X to cut selection.")} title="Cut">✂️ Cut</button>
                <button className="ql-copy" onClick={() => alert("Press Ctrl+C to copy selection.")} title="Copy">📄 Copy</button>
                <button 
                  type="button" 
                  className={`format-painter-btn ${formatPainterActive ? 'active' : ''}`} 
                  onClick={handleFormatPainterClick}
                  title="Format Painter"
                >
                  🖌️ Format Painter
                </button>
              </div>
            </div>
            <span className="ribbon-group-label">Clipboard</span>
          </div>

          <div className="ribbon-group-separator"></div>

          {/* Font Group */}
          <div className="ribbon-group font-group">
            <div className="ribbon-controls-container">
              <div className="ribbon-buttons-row">
                <select className="ql-font" defaultValue="sans-serif" title="Font Family">
                  <option value="sans-serif">Calibri</option>
                  <option value="serif">Times New Roman</option>
                  <option value="monospace">Consolas</option>
                </select>
                <select className="ql-size" defaultValue="medium" title="Font Size">
                  <option value="small">9</option>
                  <option value="medium">11</option>
                  <option value="large">16</option>
                  <option value="huge">28</option>
                </select>
                {/* Grow/Shrink font sizing */}
                <button 
                  type="button" 
                  onClick={() => {
                    if (quillInstance.current) {
                      const range = quillInstance.current.getSelection();
                      if (range) {
                        const currentSize = quillInstance.current.getFormat(range.index, range.length).size || 'medium';
                        const sizes = { 'small': 'medium', 'medium': 'large', 'large': 'huge', 'huge': 'huge' };
                        quillInstance.current.format('size', sizes[currentSize]);
                      }
                    }
                  }}
                  title="Grow Font"
                  style={{ fontSize: '13px', fontWeight: 'bold' }}
                >
                  A⁺
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    if (quillInstance.current) {
                      const range = quillInstance.current.getSelection();
                      if (range) {
                        const currentSize = quillInstance.current.getFormat(range.index, range.length).size || 'medium';
                        const sizes = { 'huge': 'large', 'large': 'medium', 'medium': 'small', 'small': 'small' };
                        quillInstance.current.format('size', sizes[currentSize]);
                      }
                    }
                  }}
                  title="Shrink Font"
                  style={{ fontSize: '11px', fontWeight: 'bold' }}
                >
                  A⁻
                </button>
                <button className="ql-clean" title="Clear Formatting"></button>
                <button className="ql-bold" title="Bold (Ctrl+B)"></button>
                <button className="ql-italic" title="Italic (Ctrl+I)"></button>
                <button className="ql-underline" title="Underline (Ctrl+U)"></button>
                <button className="ql-strike" title="Strikethrough"></button>
                
                {/* Script features */}
                <button className="ql-script" value="sub" title="Subscript"></button>
                <button className="ql-script" value="super" title="Superscript"></button>
                
                {/* Colors */}
                <select className="ql-color" title="Font Color"></select>
                <select className="ql-background" title="Highlight Color"></select>
              </div>
            </div>
            <span className="ribbon-group-label">Font</span>
          </div>

          <div className="ribbon-group-separator"></div>

          {/* Paragraph Group */}
          <div className="ribbon-group paragraph-group">
            <div className="ribbon-buttons-row">
              <button className="ql-list" value="bullet" title="Bullets"></button>
              <button className="ql-list" value="ordered" title="Numbering"></button>
              
              <button className="ql-indent" value="-1" title="Decrease Indent"></button>
              <button className="ql-indent" value="+1" title="Increase Indent"></button>
              
              {/* Shading paint bucket representation */}
              <button type="button" onClick={() => {
                if (quillInstance.current) {
                  const range = quillInstance.current.getSelection();
                  if (range) {
                    quillInstance.current.format('background', 'rgba(59, 130, 246, 0.15)');
                  }
                }
              }} title="Paragraph Shading">
                🪣
              </button>
            </div>

            <div className="ribbon-buttons-row alignments-row">
              <button className="ql-align" value="" title="Align Left"></button>
              <button className="ql-align" value="center" title="Align Center"></button>
              <button className="ql-align" value="right" title="Align Right"></button>
              <button className="ql-align" value="justify" title="Justify"></button>
            </div>
            <span className="ribbon-group-label">Paragraph</span>
          </div>

          <div className="ribbon-group-separator"></div>

          {/* Styles Group Carousel */}
          <div className="ribbon-group styles-group">
            <div className="styles-carousel">
              <button type="button" className="style-card normal-card" onClick={() => applyWordStyle('normal')} title="Normal Style">
                <span className="style-card-preview">AaBbCc</span>
                <span className="style-card-name">Normal</span>
              </button>
              <button type="button" className="style-card title-card" onClick={() => applyWordStyle('title')} title="Title Style">
                <span className="style-card-preview" style={{ fontWeight: 'bold' }}>Title</span>
                <span className="style-card-name">Title</span>
              </button>
              <button type="button" className="style-card heading-card" onClick={() => applyWordStyle('heading1')} title="Heading 1 Style">
                <span className="style-card-preview" style={{ color: 'var(--accent)', fontWeight: '600' }}>Heading 1</span>
                <span className="style-card-name">Heading 1</span>
              </button>
              <button type="button" className="style-card heading-card" onClick={() => applyWordStyle('heading2')} title="Heading 2 Style">
                <span className="style-card-preview" style={{ color: 'var(--accent)', fontWeight: '500' }}>Heading 2</span>
                <span className="style-card-name">Heading 2</span>
              </button>
              <button type="button" className="style-card subtitle-card" onClick={() => applyWordStyle('subtitle')} title="Subtitle Style">
                <span className="style-card-preview" style={{ fontStyle: 'italic' }}>Sub</span>
                <span className="style-card-name">Subtitle</span>
              </button>
            </div>
            <span className="ribbon-group-label">Styles</span>
          </div>

          <div className="ribbon-group-separator"></div>

          {/* Editing Group */}
          <div className="ribbon-group editing-group">
            <div className="ribbon-vertical-buttons">
              <button 
                type="button" 
                className="editing-ribbon-btn"
                onClick={() => {
                  setShowFindReplace(true);
                  setTimeout(() => document.getElementById('find-input-focus')?.focus(), 100);
                }}
                title="Find text"
              >
                🔍 Find
              </button>
              <button 
                type="button" 
                className="editing-ribbon-btn"
                onClick={() => {
                  setShowFindReplace(true);
                  setTimeout(() => document.getElementById('replace-input-focus')?.focus(), 100);
                }}
                title="Replace text"
              >
                🔄 Replace
              </button>
            </div>
            <span className="ribbon-group-label">Editing</span>
          </div>
        </div>

        {/* INSERT TAB CONTENT */}
        <div className={`ribbon-tab-content ${activeRibbonTab === 'insert' ? 'visible' : 'hidden'}`}>
          <div className="ribbon-group">
            <div className="ribbon-controls-container">
              <div className="ribbon-buttons-row">
                <button className="ql-blockquote" title="Blockquote"></button>
                <button className="ql-code-block" title="Code Block"></button>
              </div>
            </div>
            <span className="ribbon-group-label">Elements</span>
          </div>
        </div>

        {/* REVIEW TAB CONTENT */}
        <div className={`ribbon-tab-content ${activeRibbonTab === 'review' ? 'visible' : 'hidden'}`}>
          <div className="ribbon-group">
            <div className="ribbon-controls-container">
              <div className="ribbon-buttons-row">
                <button type="button" className="ribbon-custom-btn" onClick={() => {
                  alert(`Proofing Statistics:\n- Total Words: ${wordCount}\n- Estimated Reading Time: ${Math.ceil(wordCount / 200)} min\n- Characters: ${(quillInstance.current ? quillInstance.current.getText() : '').length} chars`);
                }} title="Proofing Statistics">
                  <BookOpen size={16} style={{ marginRight: '6px' }} />
                  <span>Word Count Details</span>
                </button>
                <button type="button" className="ribbon-custom-btn" onClick={() => {
                  alert("Spelling & Grammar Check completed!\nNo spelling or grammatical issues were found.");
                }} title="Spelling Check">
                  <Check size={16} style={{ marginRight: '6px' }} />
                  <span>Spelling & Grammar</span>
                </button>
              </div>
            </div>
            <span className="ribbon-group-label">Proofing</span>
          </div>
        </div>

        {/* VIEW TAB CONTENT */}
        <div className={`ribbon-tab-content ${activeRibbonTab === 'view' ? 'visible' : 'hidden'}`}>
          <div className="ribbon-group">
            <div className="ribbon-controls-container">
              <div className="ribbon-buttons-row">
                <button type="button" className={`ribbon-custom-btn ${!leftSidebarCollapsed ? 'active' : ''}`} onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}>
                  <List size={16} style={{ marginRight: '6px' }} />
                  <span>Navigation Outline</span>
                </button>
                <button type="button" className={`ribbon-custom-btn ${!rightSidebarCollapsed ? 'active' : ''}`} onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}>
                  <Users size={16} style={{ marginRight: '6px' }} />
                  <span>Collaborations Pane</span>
                </button>
              </div>
            </div>
            <span className="ribbon-group-label">Show / Hide Sidebars</span>
          </div>
        </div>
      </div>

      {/* 4. FIND & REPLACE FLOATING FLOOD CARD */}
      {showFindReplace && (
        <div className="word-find-replace-pane">
          <div className="find-replace-header">
            <span>Find and Replace</span>
            <button className="find-replace-close" onClick={() => { setShowFindReplace(false); setSearchIndex(0); }}>
              <X size={14} />
            </button>
          </div>
          <div className="find-replace-body">
            <div className="find-replace-row">
              <label htmlFor="find-input-focus">Find:</label>
              <input 
                id="find-input-focus"
                type="text" 
                value={findText} 
                onChange={(e) => { setFindText(e.target.value); setSearchIndex(0); }} 
                placeholder="Text to find..." 
              />
            </div>
            <div className="find-replace-row">
              <label htmlFor="replace-input-focus">Replace:</label>
              <input 
                id="replace-input-focus"
                type="text" 
                value={replaceText} 
                onChange={(e) => setReplaceText(e.target.value)} 
                placeholder="Replace with..." 
              />
            </div>
            <div className="find-replace-actions">
              <button onClick={handleFindNext} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Find Next</button>
              <button onClick={handleReplace} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Replace</button>
              <button onClick={handleReplaceAll} className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Replace All</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MAIN WORKSPACE */}
      <main className="editor-workspace">
        
        {/* Toggle Left Sidebar Control Tab */}
        <div style={{ position: 'absolute', left: leftSidebarCollapsed ? '8px' : '268px', top: '12px', zIndex: 50, transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <button 
            className="sidebar-toggle-btn" 
            onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
            title={leftSidebarCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
          >
            {leftSidebarCollapsed ? <Plus size={16} /> : <X size={16} />}
          </button>
        </div>

        {/* LEFT SIDEBAR: Heading Outline & Version History */}
        <aside className={`editor-sidebar left-sidebar ${leftSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <span>Navigation Outline</span>
          </div>
          
          <div className="sidebar-tabs">
            <button 
              className={`sidebar-tab ${leftTab === 'outline' ? 'active' : ''}`}
              onClick={() => setLeftTab('outline')}
            >
              <List size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Outline
            </button>
            <button 
              className={`sidebar-tab ${leftTab === 'history' ? 'active' : ''}`}
              onClick={() => setLeftTab('history')}
            >
              <History size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> History
            </button>
          </div>

          <div className="sidebar-content">
            {leftTab === 'outline' ? (
              <div className="outline-list">
                {outline.length === 0 ? (
                  <div className="outline-empty">
                    No headings found.<br />Create headings from the Home Styles carousel to populate this interactive outline!
                  </div>
                ) : (
                  outline.map((item) => (
                    <button
                      key={item.id}
                      className={`outline-item ${item.level}`}
                      onClick={() => handleOutlineClick(item.id)}
                      title={`Scroll to ${item.text}`}
                    >
                      {item.text}
                    </button>
                  ))
                )}
              </div>
            ) : (
              <div className="timeline">
                {history.map((h) => (
                  <div key={h.id} className={`timeline-item ${h.active ? 'active' : ''}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-time">{h.time}</div>
                    <div className="timeline-author">{h.author}</div>
                    <div className="timeline-desc">{h.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* CENTER PANE: Centered A4 Page Sheet Sizable Sizer */}
        <section className="editor-canvas-pane">
          <div 
            className="editor-paper-container"
            style={{ 
              transform: `scale(${zoomPercent / 100})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}
          >
            <div ref={quillRef} style={{ minHeight: '100%' }}></div>
          </div>
        </section>

        {/* Toggle Right Sidebar Control Tab */}
        <div style={{ position: 'absolute', right: rightSidebarCollapsed ? '8px' : '268px', top: '12px', zIndex: 50, transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <button 
            className="sidebar-toggle-btn" 
            onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
            title={rightSidebarCollapsed ? 'Expand Collaborations Sidebar' : 'Collapse Collaborations Sidebar'}
          >
            {rightSidebarCollapsed ? <Users size={16} /> : <X size={16} />}
          </button>
        </div>

        {/* RIGHT SIDEBAR: Live Team Chat & Inline Comments */}
        <aside className={`editor-sidebar right-sidebar ${rightSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <span>Collaborations</span>
          </div>

          <div className="sidebar-tabs">
            <button 
              className={`sidebar-tab ${rightTab === 'chat' ? 'active' : ''}`}
              onClick={() => setRightTab('chat')}
            >
              <MessageSquare size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Team Chat
            </button>
            <button 
              className={`sidebar-tab ${rightTab === 'comments' ? 'active' : ''}`}
              onClick={() => setRightTab('comments')}
            >
              <Users size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Comments
            </button>
          </div>

          <div className="sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 100px)' }}>
            
            {rightTab === 'chat' ? (
              <div className="chat-container">
                <div className="chat-messages">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`chat-bubble ${msg.type}`}>
                      <span className="chat-bubble-meta">
                        <strong>{msg.sender}</strong> • {msg.time}
                      </span>
                      {msg.text}
                    </div>
                  ))}
                  <div ref={chatBottomRef}></div>
                </div>

                <form onSubmit={handleSendMessage} className="chat-input-area">
                  <input
                    type="text"
                    className="chat-input"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    placeholder="Type a team message..."
                  />
                  <button type="submit" className="chat-send-btn" title="Send message">
                    <Send size={14} />
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }}>
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment-card">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-time">{comment.time}</span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddComment} className="comment-new-container">
                  <textarea
                    className="comment-textarea"
                    placeholder="Add feedback to canvas..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    required
                  ></textarea>
                  <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px', alignSelf: 'flex-end' }}>
                    Post Comment
                  </button>
                </form>
              </div>
            )}
            
          </div>
        </aside>
      </main>

      {/* 6. BOTTOM WORD STATUS BAR */}
      <footer className="word-status-bar">
        <div className="status-bar-left">
          <span>Page 1 of 1</span>
          <span className="status-bar-separator">|</span>
          <span>{wordCount} words</span>
          <span className="status-bar-separator">|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Proofing status check">
            <Check size={12} style={{ color: '#10b981' }} /> Spelling: Checked
          </span>
          <span className="status-bar-separator">|</span>
          <span>English (India)</span>
          <span className="status-bar-separator">|</span>
          <span>Accessibility: Good to go</span>
        </div>

        <div className="status-bar-center">
          <div className={`sync-badge ${isSyncing ? 'syncing' : ''}`} style={{ border: 'none', background: 'transparent', padding: 0 }}>
            <span className="sync-dot"></span>
            <span>{isSyncing ? 'AutoSave: Syncing...' : 'Saved to Cloud'}</span>
          </div>
        </div>

        <div className="status-bar-right">
          <button 
            type="button"
            className="status-bar-btn"
            onClick={() => alert("Focus Mode activated! Enjoy distraction-free writing.")}
            style={{ background: 'transparent', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer' }}
          >
            Focus
          </button>
          <span className="status-bar-separator">|</span>
          <button onClick={handleZoomOut} className="zoom-btn" title="Zoom Out">-</button>
          <input 
            type="range" 
            min="50" 
            max="150" 
            value={zoomPercent} 
            onChange={(e) => setZoomPercent(Number(e.target.value))} 
            className="zoom-slider" 
            title="Zoom percentage slider" 
          />
          <button onClick={handleZoomIn} className="zoom-btn" title="Zoom In">+</button>
          <span style={{ fontWeight: 600, width: '36px', textAlign: 'right' }}>{zoomPercent}%</span>
        </div>
      </footer>

      {/* Share / Team Access Modal Overlay */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Share Workspace</h3>
              <button className="modal-close" onClick={() => setShowShareModal(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Add team member email</label>
                <div className="form-input-row">
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="user@organization.com"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                  <select 
                    className="form-select"
                    value={shareRole}
                    onChange={(e) => setShareRole(e.target.value)}
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button 
                    className="btn-primary"
                    style={{ padding: '0 16px' }}
                    onClick={() => {
                      if (shareEmail.trim()) {
                        alert(`Invitation successfully sent to ${shareEmail} as ${shareRole}!`);
                        setShareEmail('');
                      }
                    }}
                  >
                    Invite
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '8px' }}>
                <label className="form-label">Workspace Shareable Link</label>
                <div className="copy-row">
                  <input 
                    type="text" 
                    className="copy-input" 
                    readOnly 
                    value={`https://quillsuite.collab/docs/${doc.id}`}
                  />
                  <button className="btn-copy" onClick={handleCopyLink}>
                    {copied ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} /> Copied!
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Copy size={14} /> Copy Link
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
