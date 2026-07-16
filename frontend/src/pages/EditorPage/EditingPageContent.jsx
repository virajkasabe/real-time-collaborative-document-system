import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Quill from 'quill';
import { inviteCollab } from '../../apis/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { DOCUMENT_ROLES } from '../../utils/constants';
import EditorHeader from './components/EditorHeader';
import FindReplacePane from './components/FindReplacePane';
import LeftSidebar from './components/LeftSidebar';
import RibbonTabsBar from './components/RibbonTabsBar';
import RibbonToolbar from './components/RibbonToolbar';
import RightSidebar from './components/RightSidebar';
import ShareModal from './components/ShareModal';
import SidebarToggle from './components/SidebarToggle';
import StatusBar from './components/StatusBar';
import useActiveCollaborators from './hooks/useActiveCollaborators';
import useCollaborativeQuill from './hooks/useCollaborativeQuill';
import useIsMobile from './hooks/useIsMobile';
import {
  FONT_SIZE_GROW,
  FONT_SIZE_SHRINK,
  PAGE_LAYOUTS,
  SIMULATED_TEAM_MEMBERS,
  SIMULATED_TEAM_REPLIES,
  TITLE_SAVE_DEBOUNCE_MS,
} from './utils/constants';
import { quillDeltaToCustomDelta } from './utils/deltaConversion';
import { countWords } from './utils/textHelpers';

export default function EditingPageContent({
  document: doc, theme, toggleTheme, onBack, onSave, docUserRole, docId, showToast,
}) {
  const { socket } = useSocket();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const [title, setTitle] = useState(() => {
    const rawTitle = doc.title || 'Untitled Document';
    return rawTitle === 'Untitle Document' ? 'Untitled Document' : rawTitle;
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const isOwner = docUserRole === DOCUMENT_ROLES.OWNER;
  const isEditor = docUserRole === DOCUMENT_ROLES.EDITOR;
  const canEdit = isOwner || isEditor;
  const canShare = isOwner;
  console.log("EditingPageContent render - docUserRole:", docUserRole, "isOwner:", isOwner, "isEditor:", isEditor, "canEdit:", canEdit);

  // Who else is currently present in the document (drives the header avatar
  // stack — added on join, removed on leave).
  const activeUsers = useActiveCollaborators(socket, user, showToast);

  // Sidebar / ribbon UI state
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(true);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);
  const [leftTab, setLeftTab] = useState('outline');
  const [rightTab, setRightTab] = useState('chat');
  const [activeRibbonTab, setActiveRibbonTab] = useState('home');
  const [zoomPercent, setZoomPercent] = useState(100);
  const [autoSaveActive, setAutoSaveActive] = useState(true);
  const [copiedFormat, setCopiedFormat] = useState(null);
  const [formatPainterActive, setFormatPainterActive] = useState(false);
  const [accentColor, setAccentColor] = useState(null);
  const [pageLayout, setPageLayout] = useState('normal');

  // On a small screen only one sidebar should be open at a time, or the
  // panels cover the entire viewport and hide each other.
  const toggleLeftSidebar = useCallback(() => {
    setLeftSidebarCollapsed((prev) => {
      const next = !prev;
      if (!next && isMobile) setRightSidebarCollapsed(true);
      return next;
    });
  }, [isMobile]);

  const toggleRightSidebar = useCallback(() => {
    setRightSidebarCollapsed((prev) => {
      const next = !prev;
      if (!next && isMobile) setLeftSidebarCollapsed(true);
      return next;
    });
  }, [isMobile]);

  // Find & Replace
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);

  // Document-derived state
  const [outline, setOutline] = useState([]);
  const [wordCount, setWordCount] = useState(doc.wordCount || 0);

  const history = useMemo(() => {
    if (doc.versions?.length > 0) {
      return doc.versions.map((v, i) => ({
        id: v.id || i,
        time: v.date || 'Just now',
        author: v.author || 'Unknown',
        desc: v.name || 'Version',
        active: i === 0,
        content: v.content || '',
      }));
    }
    return [
      { id: 1, time: 'Just now', author: 'You', desc: 'Saved changes to cloud', active: true },
      { id: 2, time: '10 minutes ago', author: 'Lisa Chen', desc: 'Added meeting sync proposal section', active: false },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [comments, setComments] = useState(() => {
    if (doc.comments?.length > 0) {
      return doc.comments.map((c) => ({
        id: c.id || Date.now() + Math.random(),
        author: c.user || 'Anonymous',
        text: c.text || '',
        time: c.time || 'Just now',
      }));
    }
    return [];
  });
  const [newCommentText, setNewCommentText] = useState('');
  const [commentAnchorRange, setCommentAnchorRange] = useState(null);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'System', text: 'Welcome to the collaborative editor!', time: new Date().toLocaleTimeString(), type: 'received' },
  ]);
  const [chatInputText, setChatInputText] = useState('');

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState(DOCUMENT_ROLES.VIEWER);
  const [copied, setCopied] = useState(false);

  const quillRef = useRef(null);
  const chatBottomRef = useRef(null);

  const {
    quillInstanceRef, performUndo, performRedo, canUndo, canRedo,
  } = useCollaborativeQuill({
    quillRef,
    doc,
    docId,
    canEdit,
    socket,
    user,
    title,
    onSave,
    onOutlineChange: (q) => updateOutline(q),
    onWordCountChange: setWordCount,
    onSyncingChange: setIsSyncing,
  });
  // eslint-disable-next-line react-hooks/refs
  const quillInstance = quillInstanceRef.current;

  function updateOutline(quill) {
    const target = quill || quillInstance;
    if (!target) return;
    const headings = Array.from(target.root.querySelectorAll('h1, h2, h3'));
    setOutline(headings.map((h, i) => {
      if (!h.id) h.id = `heading-ref-${i}`;
      return { id: h.id, text: h.innerText || h.textContent || '', level: h.tagName.toLowerCase() };
    }));
  }

  // Editor body class toggle
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) root.classList.add('editor-mode');
    return () => { if (root) root.classList.remove('editor-mode'); };
  }, []);

  // Delegate formatting events and sync toolbar button icons / color pickers
  useEffect(() => {
    if (!quillInstance) return;

    const visibleToolbar = document.getElementById('word-ribbon-toolbar');
    if (!visibleToolbar) return;

    const replaceSelects = () => {
      // Replace ql-color select with custom button
      const colorSelect = visibleToolbar.querySelector('select.ql-color');
      if (colorSelect) {
        const colorBtn = document.createElement('button');
        colorBtn.type = 'button';
        colorBtn.title = 'Text Color';
        colorBtn.innerHTML = '🎨';
        colorBtn.className = 'ribbon-color-btn';
        colorBtn.onclick = (e) => {
          e.stopPropagation();
          const picker = document.getElementById('native-color-picker');
          if (picker) {
            picker.onchange = (evt) => {
              quillInstance.format('color', evt.target.value);
            };
            picker.click();
          }
        };
        colorSelect.parentNode.replaceChild(colorBtn, colorSelect);
      }

      // Replace ql-background select with custom button
      const bgSelect = visibleToolbar.querySelector('select.ql-background');
      if (bgSelect) {
        const bgBtn = document.createElement('button');
        bgBtn.type = 'button';
        bgBtn.title = 'Highlight Color';
        bgBtn.innerHTML = '🖌️';
        bgBtn.className = 'ribbon-bg-btn';
        bgBtn.onclick = (e) => {
          e.stopPropagation();
          const picker = document.getElementById('native-bg-picker');
          if (picker) {
            picker.onchange = (evt) => {
              quillInstance.format('background', evt.target.value);
            };
            picker.click();
          }
        };
        bgSelect.parentNode.replaceChild(bgBtn, bgSelect);
      }

      // Copy SVG icons from hidden toolbar to visible toolbar buttons
      const hiddenButtons = document.querySelectorAll('#quill-hidden-toolbar button');
      hiddenButtons.forEach((hiddenBtn) => {
        const qlClass = Array.from(hiddenBtn.classList).find(cls => cls.startsWith('ql-'));
        if (!qlClass) return;
        const value = hiddenBtn.getAttribute('value');
        let visibleBtn;
        if (value) {
          visibleBtn = visibleToolbar.querySelector(`button.${qlClass}[value="${value}"]`);
        } else {
          visibleBtn = visibleToolbar.querySelector(`button.${qlClass}`);
        }
        if (visibleBtn && visibleBtn.innerHTML.trim() === '') {
          visibleBtn.innerHTML = hiddenBtn.innerHTML;
        }
      });
    };

    // Run initially
    replaceSelects();

    // Observe changes to the visible toolbar to re-apply replacements and icons
    const observer = new MutationObserver(replaceSelects);
    observer.observe(visibleToolbar, { childList: true, subtree: true });

    const handleToolbarClick = (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const qlClass = Array.from(btn.classList).find(cls => cls.startsWith('ql-'));
      if (qlClass) {
        if (qlClass === 'ribbon-color-btn' || qlClass === 'ribbon-bg-btn') return;

        const value = btn.getAttribute('value');
        let hiddenBtn;
        if (value) {
          hiddenBtn = document.querySelector(`#quill-hidden-toolbar button.${qlClass}[value="${value}"]`);
        } else {
          hiddenBtn = document.querySelector(`#quill-hidden-toolbar button.${qlClass}`);
        }
        if (hiddenBtn) {
          hiddenBtn.click();
        }
      }
    };

    const handleToolbarChange = (e) => {
      const select = e.target;
      if (select.tagName !== 'SELECT') return;

      const qlClass = Array.from(select.classList).find(cls => cls.startsWith('ql-'));
      if (qlClass) {
        const value = select.value;
        const hiddenSelect = document.querySelector(`#quill-hidden-toolbar select.${qlClass}`);
        if (hiddenSelect) {
          hiddenSelect.value = value;
          hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    };

    const syncToolbarActiveStates = () => {
      const hiddenButtons = document.querySelectorAll('#quill-hidden-toolbar button');
      hiddenButtons.forEach((hiddenBtn) => {
        const qlClass = Array.from(hiddenBtn.classList).find(cls => cls.startsWith('ql-'));
        if (!qlClass) return;
        const value = hiddenBtn.getAttribute('value');
        let visibleBtn;
        if (value) {
          visibleBtn = visibleToolbar.querySelector(`button.${qlClass}[value="${value}"]`);
        } else {
          visibleBtn = visibleToolbar.querySelector(`button.${qlClass}`);
        }
        if (visibleBtn) {
          if (hiddenBtn.classList.contains('ql-active')) {
            visibleBtn.classList.add('ql-active');
          } else {
            visibleBtn.classList.remove('ql-active');
          }
        }
      });

      const hiddenSelects = document.querySelectorAll('#quill-hidden-toolbar select');
      hiddenSelects.forEach((hiddenSelect) => {
        const qlClass = Array.from(hiddenSelect.classList).find(cls => cls.startsWith('ql-'));
        if (!qlClass) return;
        const visibleSelect = visibleToolbar.querySelector(`select.${qlClass}`);
        if (visibleSelect) {
          visibleSelect.value = hiddenSelect.value;
        }
      });
    };

    quillInstance.on('selection-change', syncToolbarActiveStates);
    quillInstance.on('text-change', syncToolbarActiveStates);

    visibleToolbar.addEventListener('click', handleToolbarClick);
    visibleToolbar.addEventListener('change', handleToolbarChange);

    return () => {
      observer.disconnect();
      quillInstance.off('selection-change', syncToolbarActiveStates);
      quillInstance.off('text-change', syncToolbarActiveStates);
      visibleToolbar.removeEventListener('click', handleToolbarClick);
      visibleToolbar.removeEventListener('change', handleToolbarChange);
    };
  }, [quillInstance]);

  // Format painter: apply copied format to the next selection made
  useEffect(() => {
    if (!quillInstance) return undefined;
    const handleSelectionChange = (range) => {
      if (range?.index !== null && formatPainterActive && copiedFormat && range?.length > 0) {
        Object.keys(copiedFormat).forEach((fmt) => {
          quillInstance.formatText(range.index, range.length, fmt, copiedFormat[fmt]);
        });
        setFormatPainterActive(false);
      }
    };
    quillInstance.on('selection-change', handleSelectionChange);
    return () => quillInstance.off('selection-change', handleSelectionChange);
  }, [quillInstance, formatPainterActive, copiedFormat]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ---- Title editing ----
  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    setIsSyncing(true);
    setTimeout(() => {
      const quillDelta = quillInstance?.getContents();
      const customDelta = quillDelta ? quillDeltaToCustomDelta(quillDelta) : { ops: [] };
      const words = quillInstance ? countWords(quillInstance.getText()) : 0;
      onSave(newTitle, customDelta, words);
      setIsSyncing(false);
    }, TITLE_SAVE_DEBOUNCE_MS);
  };

  // ---- Outline navigation ----
  const handleOutlineClick = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.style.transition = 'background-color 0.4s';
    el.style.backgroundColor = 'var(--accent-bg)';
    setTimeout(() => { el.style.backgroundColor = 'transparent'; }, 750);
    if (isMobile) setLeftSidebarCollapsed(true);
  };

  // ---- Format painter trigger ----
  const handleFormatPainterClick = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection();
    if (range?.length > 0) {
      setCopiedFormat(quillInstance.getFormat(range.index, range.length));
      setFormatPainterActive(true);
    } else {
      showToast('Select some formatted text first to copy its style!', 'info');
    }
  };

  // ---- Font size buttons ----
  const adjustFontSize = (direction) => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection();
    if (!range) return;
    const current = quillInstance.getFormat(range.index, range.length).size || 'medium';
    const map = direction === 'grow' ? FONT_SIZE_GROW : FONT_SIZE_SHRINK;
    quillInstance.format('size', map[current]);
  };

  // ---- Find & Replace ----
  const handleFindNext = () => {
    if (!quillInstance || !findText) return;
    const text = quillInstance.getText();
    const needle = findText.toLowerCase();
    let index = text.toLowerCase().indexOf(needle, searchIndex);
    if (index === -1) index = text.toLowerCase().indexOf(needle, 0);

    if (index !== -1) {
      quillInstance.setSelection(index, findText.length);
      setSearchIndex(index + findText.length);
    } else {
      showToast(`No matches found for "${findText}"`, 'info');
      setSearchIndex(0);
    }
  };

  const handleReplace = () => {
    if (!quillInstance || !findText) return;
    const range = quillInstance.getSelection();
    if (!range?.length) {
      handleFindNext();
      return;
    }
    const selected = quillInstance.getText(range.index, range.length);
    if (selected.toLowerCase() === findText.toLowerCase()) {
      quillInstance.deleteText(range.index, range.length);
      quillInstance.insertText(range.index, replaceText);
      quillInstance.setSelection(range.index, replaceText.length);
      setSearchIndex(range.index + replaceText.length);
    }
  };

  const handleReplaceAll = () => {
    if (!quillInstance || !findText) return;
    const needle = findText.toLowerCase();
    let text = quillInstance.getText();
    let index = text.toLowerCase().indexOf(needle, 0);
    let count = 0;

    while (index !== -1) {
      quillInstance.deleteText(index, findText.length);
      quillInstance.insertText(index, replaceText);
      count++;
      text = quillInstance.getText();
      index = text.toLowerCase().indexOf(needle, index + replaceText.length);
    }

    showToast(`Replaced ${count} occurrences of "${findText}"`, 'success');
    setSearchIndex(0);
    updateOutline();
  };

  const openFindReplace = (focusFieldId) => {
    setShowFindReplace(true);
    setTimeout(() => document.getElementById(focusFieldId)?.focus(), 100);
  };

  // ---- Paragraph styles ----
  const applyWordStyle = (styleType) => {
    if (!quillInstance || !canEdit) return;
    const range = quillInstance.getSelection() || { index: 0, length: 0 };
    const len = range.length || 1;

    quillInstance.formatLine(range.index, len, 'header', false);
    quillInstance.formatLine(range.index, len, 'blockquote', false);

    if (styleType === 'heading1') {
      quillInstance.formatLine(range.index, len, 'header', 1);
    } else if (styleType === 'heading2') {
      quillInstance.formatLine(range.index, len, 'header', 2);
    } else if (styleType === 'title') {
      quillInstance.formatLine(range.index, len, 'header', 1);
      quillInstance.formatText(range.index, len, 'bold', true);
    } else if (styleType === 'subtitle') {
      quillInstance.formatLine(range.index, len, 'header', 3);
      quillInstance.formatText(range.index, len, 'italic', true);
    }
    updateOutline();
  };

  const applyParagraphShading = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection();
    if (range) quillInstance.format('background', 'rgba(59, 130, 246, 0.15)');
  };

  // ---- Design tab: accent color ----
  const applyAccentColor = (hex) => {
    setAccentColor(hex);
    document.documentElement.style.setProperty('--accent', hex);
    showToast('Accent color updated', 'success');
  };

  // ---- Team chat (simulated replies) ----
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    setChatMessages((prev) => [...prev, {
      id: Date.now(),
      sender: 'You',
      text: chatInputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'sent',
    }]);
    setChatInputText('');
    setIsSyncing(true);

    setTimeout(() => {
      const sender = SIMULATED_TEAM_MEMBERS[Math.floor(Math.random() * SIMULATED_TEAM_MEMBERS.length)];
      const reply = SIMULATED_TEAM_REPLIES[Math.floor(Math.random() * SIMULATED_TEAM_REPLIES.length)];
      setChatMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender,
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'received',
      }]);
      setIsSyncing(false);
    }, 100);
  };

  // ---- Comments ----
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setComments((prev) => [{
      id: Date.now(),
      author: 'You',
      text: newCommentText,
      time: 'Just now',
      anchorRange: commentAnchorRange,
    }, ...prev]);
    setNewCommentText('');
    setCommentAnchorRange(null);
  };

  const handleInsertCoverPage = () => {
    if (!quillInstance) return;
    const currentDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const delta = {
      ops: [
        { insert: 'DOCUMENT TITLE' },
        { insert: '\n', attributes: { header: 1, align: 'center' } },
        { insert: 'Document Subtitle / Abstract' },
        { insert: '\n', attributes: { header: 3, align: 'center' } },
        { insert: '\n' },
        { insert: currentDate },
        { insert: '\n', attributes: { align: 'center' } },
        { insert: '\n\n' },
        { insert: { pagebreak: true } },
        { insert: '\n' }
      ]
    };
    quillInstance.updateContents({ ops: [{ retain: 0 }, ...delta.ops] }, Quill.sources.USER);
    quillInstance.setSelection(0);
    showToast('Cover page template inserted at start of document', 'success');
  };

  const handleInsertBlankPage = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection(true);
    quillInstance.insertEmbed(range.index, 'pagebreak', true);
    quillInstance.insertText(range.index + 1, '\n');
    quillInstance.setSelection(range.index + 2);
    showToast('Blank page inserted', 'success');
  };

  const handleInsertPageBreak = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection(true);
    quillInstance.insertEmbed(range.index, 'pagebreak', true);
    quillInstance.insertText(range.index + 1, '\n');
    quillInstance.setSelection(range.index + 2);
    showToast('Page break inserted', 'success');
  };

  const handleInsertComment = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection();
    if (range && range.length > 0) {
      const selectedText = quillInstance.getText(range.index, range.length);
      setCommentAnchorRange({ index: range.index, length: range.length, selectedText });
      setRightTab('comments');
      setRightSidebarCollapsed(false);
      setTimeout(() => {
        const inputEl = document.querySelector('.comment-textarea');
        if (inputEl) inputEl.focus();
      }, 100);
    } else {
      showToast('Please select some text in the editor to attach a comment.', 'info');
    }
  };

  // ---- Sharing ----
  const handleSendCollabLink = async (e) => {
    e.preventDefault();
    try {
      const res = await inviteCollab({ docId, email: shareEmail, role: shareRole });
      showToast(res.data.message || 'Invitation sent', 'success');
      setShareEmail('');
    } catch (error) {
      showToast(error.response?.data?.message || error.message || 'Failed to send invitation', 'warning');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://quillsuite.collab/docs/${docId}`).then(() => {
      setCopied(true);
      showToast('Link copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShowStats = () => {
    showToast(
      `Words: ${wordCount} · Reading time: ~${Math.ceil(wordCount / 200)} min · Chars: ${quillInstance?.getText().length || 0}`,
      'info',
    );
  };

  const handleOpenShare = () => {
    if (canShare) {
      setShowShareModal(true);
    } else {
      showToast('Only document owners can share this document', 'warning');
    }
  };

  return (
    <div className="word-editor-layout">
      {/* Hidden Quill toolbar container */}
      <div id="quill-hidden-toolbar" style={{ display: 'none' }}>
        <select className="ql-font" />
        <select className="ql-size" />
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <button className="ql-list" value="bullet" />
        <button className="ql-list" value="ordered" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
        <button className="ql-align" value="" />
        <button className="ql-align" value="center" />
        <button className="ql-align" value="right" />
        <button className="ql-align" value="justify" />
        <button className="ql-blockquote" />
        <button className="ql-code-block" />
        <select className="ql-color" />
        <select className="ql-background" />
        <button className="ql-clean" />
        <button className="ql-script" value="sub" />
        <button className="ql-script" value="super" />
        <input type="color" id="native-color-picker" style={{ display: 'none' }} />
        <input type="color" id="native-bg-picker" style={{ display: 'none' }} />
      </div>

      <EditorHeader
        onBack={onBack}
        autoSaveActive={autoSaveActive}
        onToggleAutoSave={() => setAutoSaveActive((p) => !p)}
        canEdit={canEdit}
        onUndo={performUndo}
        onRedo={performRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        title={title}
        onTitleChange={handleTitleChange}
        docUserRole={docUserRole}
        theme={theme}
        toggleTheme={toggleTheme}
        canShare={canShare}
        isEditor={isEditor}
        onShareClick={handleOpenShare}
        activeUsers={activeUsers}
        currentUser={user}
        isMobile={isMobile}
      />

      <RibbonTabsBar
        activeRibbonTab={activeRibbonTab}
        setActiveRibbonTab={setActiveRibbonTab}
        theme={theme}
        isMobile={isMobile}
      />

      <RibbonToolbar
        activeRibbonTab={activeRibbonTab}
        canEdit={canEdit}
        formatPainterActive={formatPainterActive}
        onFormatPainterClick={handleFormatPainterClick}
        onGrowFont={() => adjustFontSize('grow')}
        onShrinkFont={() => adjustFontSize('shrink')}
        onParagraphShading={applyParagraphShading}
        onApplyStyle={applyWordStyle}
        onOpenFind={() => openFindReplace('find-input-focus')}
        onOpenReplace={() => openFindReplace('replace-input-focus')}
        onShowStats={handleShowStats}
        leftSidebarCollapsed={leftSidebarCollapsed}
        setLeftSidebarCollapsed={toggleLeftSidebar}
        rightSidebarCollapsed={rightSidebarCollapsed}
        setRightSidebarCollapsed={toggleRightSidebar}
        accentColor={accentColor}
        onApplyAccentColor={applyAccentColor}
        theme={theme}
        toggleTheme={toggleTheme}
        pageLayout={pageLayout}
        setPageLayout={setPageLayout}
        quillInstance={quillInstance}
        handleInsertCoverPage={handleInsertCoverPage}
        handleInsertBlankPage={handleInsertBlankPage}
        handleInsertPageBreak={handleInsertPageBreak}
        handleInsertComment={handleInsertComment}
        showToast={showToast}
      />

      {showFindReplace && (
        <FindReplacePane
          findText={findText}
          setFindText={(v) => { setFindText(v); setSearchIndex(0); }}
          replaceText={replaceText}
          setReplaceText={setReplaceText}
          onClose={() => { setShowFindReplace(false); setSearchIndex(0); }}
          onFindNext={handleFindNext}
          onReplace={handleReplace}
          onReplaceAll={handleReplaceAll}
        />
      )}

      <main className="editor-workspace" style={isMobile ? { position: 'relative' } : undefined}>
        <SidebarToggle
          side="left"
          collapsed={leftSidebarCollapsed}
          onClick={toggleLeftSidebar}
          isMobile={isMobile}
        />

        <LeftSidebar
          collapsed={leftSidebarCollapsed}
          leftTab={leftTab}
          setLeftTab={setLeftTab}
          outline={outline}
          onOutlineClick={handleOutlineClick}
          canEdit={canEdit}
          history={history}
          isMobile={isMobile}
        />

        <section className="editor-canvas-pane">
          <div
            className="editor-paper-container"
            style={{
              transform: `scale(${zoomPercent / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.2s ease',
              maxWidth: isMobile ? '100%' : PAGE_LAYOUTS[pageLayout].maxWidth,
              margin: '0 auto',
            }}
          >
            <div ref={quillRef} style={{ minHeight: '100%' }} />
          </div>
        </section>

        <SidebarToggle
          side="right"
          collapsed={rightSidebarCollapsed}
          onClick={toggleRightSidebar}
          isMobile={isMobile}
        />

        <RightSidebar
          collapsed={rightSidebarCollapsed}
          rightTab={rightTab}
          setRightTab={setRightTab}
          chatMessages={chatMessages}
          chatInputText={chatInputText}
          setChatInputText={setChatInputText}
          onSendMessage={handleSendMessage}
          chatBottomRef={chatBottomRef}
          comments={comments}
          newCommentText={newCommentText}
          setNewCommentText={setNewCommentText}
          onAddComment={handleAddComment}
          isMobile={isMobile}
          commentAnchorRange={commentAnchorRange}
          setCommentAnchorRange={setCommentAnchorRange}
          onCommentClick={(comment) => {
            if (comment.anchorRange && quillInstance) {
              quillInstance.setSelection(comment.anchorRange.index, comment.anchorRange.length);
            }
          }}
        />
      </main>

      <StatusBar
        wordCount={wordCount}
        isSyncing={isSyncing}
        zoomPercent={zoomPercent}
        setZoomPercent={setZoomPercent}
        isMobile={isMobile}
      />

      {showShareModal && canShare && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          shareEmail={shareEmail}
          setShareEmail={setShareEmail}
          shareRole={shareRole}
          setShareRole={setShareRole}
          onInvite={handleSendCollabLink}
          docId={doc._id}
          copied={copied}
          onCopyLink={handleCopyLink}
        />
      )}
    </div>
  );
}
