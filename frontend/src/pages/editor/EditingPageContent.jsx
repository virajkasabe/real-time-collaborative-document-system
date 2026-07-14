import 'quill/dist/quill.snow.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DOCUMENT_ROLES } from '../../utils/constants';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useIsMobil'
import { countWords, PAGE_LAYOUTS, quillDeltaToCustomDelta, SIMULATED_TEAM_MEMBERS, SIMULATED_TEAM_REPLIES, TITLE_SAVE_DEBOUNCE_MS } from '../../utils/editingpage.helper';
import { useActiveCollaborators } from '../../hooks/useActiveCollaborators'
import { useCollaborativeQuill } from '../../hooks/useCollaborativeQuill'
import EditorHeader from '../editor/EditorHeader'
import RibbonTabsBar from '../editor/RibbonTabsBar'
import RibbonToolbar from '../editor/RibbonToolbar'
import SidebarToggle from '../editor/SidebarToggle'
import LeftSidebar from '../editor/LeftSidebar'
import RightSidebar from '../editor/RightSidebar'
import StatusBar from '../editor/StatusBar'
// import CommentPopup from '../editor/CommentPopup'
import ShareModal from '../editor/ShareModal'
import { inviteCollab } from '../../apis/api';
import { useParams } from 'react-router-dom'
import FindReplacePane from './FindReplacePane';



export default function EditingPageContent({
  document: doc, theme, toggleTheme, onBack, onSave, docUserRole, docId, showToast,
}) {
  const { socket } = useSocket();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const [title, setTitle] = useState(doc.title || 'Untitled Document');
  const [isSyncing, setIsSyncing] = useState(false);

  const isOwner = docUserRole === DOCUMENT_ROLES.OWNER;
  const isEditor = docUserRole === DOCUMENT_ROLES.EDITOR;
  const canEdit = isOwner || isEditor;
  const canShare = isOwner;

  const activeUsers = useActiveCollaborators(socket, user, showToast);

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

  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);

  const [outline, setOutline] = useState([]);
  const [wordCount, setWordCount] = useState(doc.wordCount || 0);

  // Comment popup state
  const [commentPopup, setCommentPopup] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    selectedText: '',
    range: null,
  });

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

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'System', text: 'Welcome to the collaborative editor!', time: new Date().toLocaleTimeString(), type: 'received' },
  ]);
  const [chatInputText, setChatInputText] = useState('');

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState(DOCUMENT_ROLES.VIEWER);
  const [copied, setCopied] = useState(false);
  const params = useParams()

  const quillRef = useRef(null);
  const chatBottomRef = useRef(null);

  const updateOutline = useCallback((quill) => {
    const target = quill || quillInstance;
    if (!target) return;
    const headings = Array.from(target.root.querySelectorAll('h1, h2, h3'));
    setOutline(headings.map((h, i) => {
      if (!h.id) h.id = `heading-ref-${i}`;
      return { id: h.id, text: h.innerText || h.textContent || '', level: h.tagName.toLowerCase() };
    }));
  }, []);

  const {
    quillInstanceRef, remoteCursors, performUndo, performRedo, canUndo, canRedo,
  } = useCollaborativeQuill({
    quillRef,
    doc,
    docId,
    canEdit,
    socket,
    user,
    title,
    onSave,
    onOutlineChange: () => updateOutline(quillInstanceRef.current),
    onWordCountChange: setWordCount,
    onSyncingChange: setIsSyncing,
    params : params
  });
  const quillInstance = quillInstanceRef.current;

  // Handle text selection for comment popup
  useEffect(() => {
    if (!quillInstance) return undefined;

    const handleSelectionChange = (range, oldRange, source) => {
      if (source === 'silent') return;
      
      if (range && range.length > 0) {
        const selectedText = quillInstance.getText(range.index, range.length);
        if (selectedText.trim()) {
          // Get the bounds of the selection
          const bounds = quillInstance.getBounds(range.index, range.length);
          if (bounds) {
            const editorContainer = quillInstance.container;
            const containerRect = editorContainer.getBoundingClientRect();
            
            setCommentPopup({
              visible: true,
              position: {
                x: bounds.left + containerRect.left,
                y: bounds.top + containerRect.top - 10,
              },
              selectedText: selectedText.trim(),
              range: range,
            });
          }
        } else {
          setCommentPopup(prev => ({ ...prev, visible: false }));
        }
      } else {
        setTimeout(() => {
          const currentRange = quillInstance.getSelection();
          if (!currentRange || currentRange.length === 0) {
            setCommentPopup(prev => ({ ...prev, visible: false }));
          }
        }, 200);
      }
    };

    quillInstance.on('selection-change', handleSelectionChange);
    return () => {
      quillInstance.off('selection-change', handleSelectionChange);
    };
  }, [quillInstance]);

  // Handle comment from popup
  const handleCommentFromPopup = (text) => {
    if (!text.trim()) {
      setCommentPopup(prev => ({ ...prev, visible: false }));
      return;
    }

    // Add comment to the document
    const newComment = {
      id: Date.now() + Math.random(),
      author: user?.fullName || 'You',
      text: text,
      time: 'Just now',
      selectedText: commentPopup.selectedText,
      range: commentPopup.range,
    };

    setComments(prev => [newComment, ...prev]);
    showToast('Comment added successfully', 'success');
    setCommentPopup(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) root.classList.add('editor-mode');
    return () => { if (root) root.classList.remove('editor-mode'); };
  }, []);

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

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    setIsSyncing(true);
    setTimeout(() => {
      const quillDelta = quillInstance?.getContents();
      const customDelta = quillDelta ? quillDeltaToCustomDelta(quillDelta) : { ops: [] };
      const words = quillInstance ? countWords(quillInstance.getText()) : 0;
      console.log("newTitle", newTitle)
      onSave(newTitle, customDelta, words);
      setIsSyncing(false);
    }, TITLE_SAVE_DEBOUNCE_MS);
  };

  const handleOutlineClick = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.style.transition = 'background-color 0.4s';
    el.style.backgroundColor = 'var(--accent-bg)';
    setTimeout(() => { el.style.backgroundColor = 'transparent'; }, 750);
    if (isMobile) setLeftSidebarCollapsed(true);
  };

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

  const adjustFontSize = (direction) => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection();
    if (!range) return;
    const current = quillInstance.getFormat(range.index, range.length).size || 'medium';
    const map = direction === 'grow' ? FONT_SIZE_GROW : FONT_SIZE_SHRINK;
    quillInstance.format('size', map[current]);
  };

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

  const applyAccentColor = (hex) => {
    setAccentColor(hex);
    document.documentElement.style.setProperty('--accent', hex);
    showToast('Accent color updated', 'success');
  };

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

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setComments((prev) => [{ id: Date.now(), author: 'You', text: newCommentText, time: 'Just now' }, ...prev]);
    setNewCommentText('');
  };

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

  // ?? Render

  return (
    <div className="word-editor-layout" style={{ position: 'relative' }}>
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
        isMobile={isMobile}
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

      {/* Comment Popup */}
      {/* {commentPopup.visible && (
        <CommentPopup
          position={commentPopup.position}
          selectedText={commentPopup.selectedText}
          onSubmit={handleCommentFromPopup}
          onClose={() => setCommentPopup(prev => ({ ...prev, visible: false }))}
        />
      )} */}

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

        {/* TODO : CHECK THE LAYOUT OF PAGE */}
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