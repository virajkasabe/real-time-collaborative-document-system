import 'quill/dist/quill.snow.css';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Quill from 'quill';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchDoc, inviteCollab } from '../apis/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import { documentService } from '../services/documentService';
import { CURSOR_EVENT, DOCUMENT_EVENT, DOCUMENT_ROLES } from '../utils/constants';
import { getRandomColor } from '../utils/helpers';

import {
  FaBookOpen, FaCheck, FaChevronLeft, FaCloud, FaCopy, FaHistory,
  FaList, FaMoon, FaPlus, FaRedo, FaSearch, FaSun, FaUndo, FaUsers, FaUserSecret,
} from 'react-icons/fa';
import {
  LuCheck, LuMessageSquare, LuRefreshCw, LuSend, LuShare2, LuX,
} from 'react-icons/lu';

// ============================================================
// CONSTANTS
// ============================================================

const RIBBON_TABS = ['home', 'insert', 'review', 'view'];

const STATIC_MENU_ALERTS = {
  file: 'File Options:\n- Back to Dashboard\n- Document is auto-saved locally.',
  layout: 'Layout Ribbon: Margins and A4 sheet structure is active by default.',
  references: 'References Ribbon: Heading indexes are automatically built.',
  mailings: 'Mailings Ribbon: Collaborative share triggers are active.',
  help: 'Help Ribbon: Contact Antigravity AI for developer notes.',
};

const STYLE_CARDS = [
  { type: 'normal', label: 'Normal', preview: 'AaBbCc', style: {} },
  { type: 'title', label: 'Title', preview: 'Title', style: { fontWeight: 'bold' } },
  { type: 'heading1', label: 'Heading 1', preview: 'Heading 1', style: { color: 'var(--accent)', fontWeight: '600' } },
  { type: 'heading2', label: 'Heading 2', preview: 'Heading 2', style: { color: 'var(--accent)', fontWeight: '500' } },
  { type: 'subtitle', label: 'Subtitle', preview: 'Sub', style: { fontStyle: 'italic' } },
];

const SIMULATED_TEAM_REPLIES = [
  'That looks perfect! The structure flows really well.',
  'Oh nice, I see you updated the main objectives block.',
  'Makes sense! I will check the proposal outlines again.',
  'Let me know when you need my review on the setup notes.',
  'Awesome! The live outline widget is matching perfectly.',
  'Should we add another section describing our REST endpoint specs?',
];
const SIMULATED_TEAM_MEMBERS = ['Lisa Chen', 'Alex Johnson', 'Team Member'];

const FONT_SIZE_GROW = { small: 'medium', medium: 'large', large: 'huge', huge: 'huge' };
const FONT_SIZE_SHRINK = { huge: 'large', large: 'medium', medium: 'small', small: 'small' };

const AUTOSAVE_DEBOUNCE_MS = 80;
const CURSOR_SEND_DEBOUNCE_MS = 500;
// How long a remote cursor flag stays on screen after the last update we heard
// for that user. This was previously 50ms, which meant a cursor flag would
// vanish almost immediately after being drawn — it needs to comfortably
// outlast the interval at which we expect cursor updates to arrive.
const REMOTE_CURSOR_TTL_MS = 2000;
// Separate, tighter debounce used to broadcast the local cursor position while
// the user is actively typing (not just when they click/select), so remote
// viewers see the caret advance as characters are typed.
const TYPING_CURSOR_BROADCAST_DEBOUNCE_MS = 150;
const OPERATION_DEDUPE_WINDOW_MS = 50;
const TITLE_SAVE_DEBOUNCE_MS = 750;

// ============================================================
// CONTENT CONVERSION HELPERS (pure functions, framework-agnostic)
// ============================================================

/**
 * Converts a custom Delta { ops: [{ text, position, attributes }] }
 * into a native Quill Delta { ops: [{ insert, attributes }] }.
 */
function customDeltaToQuillDelta(customDelta) {
  if (!customDelta) return { ops: [{ insert: '' }] };
  if (typeof customDelta === 'string') return { ops: [{ insert: customDelta }] };
  if (!customDelta.ops || !Array.isArray(customDelta.ops)) return { ops: [{ insert: '' }] };

  const pureQuillOps = [];
  const positionedOps = [];

  for (const op of customDelta.ops) {
    if (op.text !== undefined && op.position !== undefined) {
      // Native custom format
      positionedOps.push({ text: op.text, position: op.position, attributes: op.attributes || {} });
    } else if (op.insert !== undefined && op.position !== undefined) {
      // Mixed format: insert + position — treat as custom
      positionedOps.push({ text: op.insert, position: op.position, attributes: op.attributes || {} });
    } else if (op.insert !== undefined) {
      // Pure Quill op — no position anchor
      pureQuillOps.push(op);
    }
  }

  if (positionedOps.length === 0 && pureQuillOps.length > 0) return { ops: pureQuillOps };
  if (positionedOps.length > 0) return buildQuillDeltaFromPositionedOps(positionedOps);
  return { ops: [{ insert: '' }] };
}

/** Reassembles position-anchored custom ops into a contiguous Quill Delta. */
function buildQuillDeltaFromPositionedOps(positionedOps) {
  const sorted = [...positionedOps].sort((a, b) => a.position - b.position);
  const quillOps = [];

  let currentText = '';
  let currentAttributes = {};
  let expectedPosition = 0;

  const flushCurrent = () => {
    if (!currentText) return;
    const quillOp = { insert: currentText };
    if (Object.keys(currentAttributes).length > 0) quillOp.attributes = currentAttributes;
    quillOps.push(quillOp);
    currentText = '';
    currentAttributes = {};
  };

  for (const { text, position, attributes } of sorted) {
    if (position > expectedPosition) {
      flushCurrent();
      quillOps.push({ insert: ' '.repeat(position - expectedPosition) });
      expectedPosition = position;
    }
    if (currentText && JSON.stringify(currentAttributes) !== JSON.stringify(attributes)) {
      flushCurrent();
    }
    currentText += text;
    currentAttributes = attributes;
    expectedPosition = position + text.length;
  }
  flushCurrent();

  return { ops: quillOps.length > 0 ? quillOps : [{ insert: '' }] };
}

/** Converts a Quill Delta into the custom per-character positioned format. */
function quillDeltaToCustomDelta(quillDelta) {
  if (!quillDelta?.ops) return { ops: [] };

  const customOps = [];
  let position = 0;

  for (const op of quillDelta.ops) {
    if (op.insert !== undefined) {
      if (typeof op.insert === 'string') {
        for (let i = 0; i < op.insert.length; i++) {
          customOps.push({ position: position + i, text: op.insert[i], attributes: op.attributes || {} });
        }
        position += op.insert.length;
      } else if (typeof op.insert === 'object') {
        customOps.push({ position, text: JSON.stringify(op.insert), attributes: op.attributes || {} });
        position += 1;
      }
    } else if (op.delete !== undefined) {
      position += op.delete;
    } else if (op.retain !== undefined) {
      position += op.retain || 0;
    }
  }
  return { ops: customOps };
}

/** Converts a Quill text-change Delta into flat insert/delete/format actions for the socket wire format. */
function convertDeltaToWireOperations(delta) {
  if (!delta?.ops) return [];
  const ops = [];
  let position = 0;

  for (const op of delta.ops) {
    if (op.insert !== undefined) {
      if (typeof op.insert === 'string') {
        ops.push({ type: 'insert', position, text: op.insert, attributes: op.attributes || {} });
        position += op.insert.length;
      } else if (typeof op.insert === 'object') {
        ops.push({ type: 'insert', position, text: JSON.stringify(op.insert), attributes: op.attributes || {}, isEmbed: true });
        position += 1;
      }
    } else if (op.delete !== undefined) {
      ops.push({ type: 'delete', position, length: op.delete, attributes: {} });
    } else if (op.retain !== undefined) {
      if (op.attributes && Object.keys(op.attributes).length > 0) {
        ops.push({ type: 'format', position, length: op.retain || 1, attributes: op.attributes });
      }
      position += op.retain || 0;
    }
  }
  return ops;
}

/**
 * Shifts a stored cursor index by a set of insert/delete wire operations that
 * were just applied to the document. Without this, a remote user's cached
 * cursor position (and therefore the pixel position of their on-screen flag)
 * goes stale the moment *anyone* edits text before that position — the flag
 * stays frozen where it was drawn instead of tracking the text it points at.
 */
function transformPositionByOperations(position, operations) {
  let pos = position;
  for (const op of operations) {
    if (op.type === 'insert') {
      const insertedLength = op.isEmbed ? 1 : (op.text ? op.text.length : 0);
      if (op.position <= pos) pos += insertedLength;
    } else if (op.type === 'delete') {
      if (op.position < pos) {
        pos -= Math.min(op.length, pos - op.position);
      }
    }
    // 'format' operations don't move text, so they don't affect position.
  }
  return Math.max(0, pos);
}

function countWords(text) {
  const trimmed = text.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
}

// ============================================================
// HOOK: useDocumentLoader
// Fetches the document + role over REST, joins the socket room,
// and toasts when other users join.
// ============================================================
function useDocumentLoader(id, socket, navigate, triggerToast, currentUser) {
  const [doc, setDoc] = useState(null);
  const [docUserRole, setDocUserRole] = useState(null);

  useEffect(() => {
    if (!socket) return undefined;

    const loadDocument = async () => {
      try {
        const response = await fetchDoc(id);
        const responseData = response.data.data; // { document, role }
        if (!responseData?.document) {
          triggerToast('Document not found', 'warning');
          navigate('/dashboard');
          return;
        }
        setDocUserRole(responseData.role);
        setDoc(responseData.document);
        socket.emit(DOCUMENT_EVENT.USER_JOIN, { docId: responseData.document._id || id });
        triggerToast('Document loaded successfully', 'success');
      } catch (error) {
        console.error('Error fetching document:', error);
        triggerToast('Failed to load document', 'error');
        navigate('/dashboard');
      }
    };

    loadDocument();

    const handleNewUserJoin = (data) => {
      if (data?.user?._id === currentUser?._id) return; // don't toast yourself
      if (data?.user) {
        triggerToast(`${data.user.fullName || 'User'} joined the document`, 'info');
      } else if (data?.message) {
        triggerToast(data.message, 'info');
      }
    };

    socket.on(DOCUMENT_EVENT.NEW_USER_JOIN, handleNewUserJoin);
    return () => socket.off(DOCUMENT_EVENT.NEW_USER_JOIN, handleNewUserJoin);
  }, [id, socket, navigate, triggerToast, currentUser]);

  return { doc, docUserRole };
}

// ============================================================
// HOOK: useCollaborativeQuill
// Owns the Quill instance lifecycle: initial content, outbound/inbound
// operation sync, remote cursor rendering, and debounced autosave.
// ============================================================
function useCollaborativeQuill({
  quillRef, doc, docId, canEdit, socket, user, title, onSave, onOutlineChange, onWordCountChange, onSyncingChange,
}) {
  const quillInstanceRef = useRef(null);
  const [remoteCursors, setRemoteCursors] = useState({});
  // Mirrors `remoteCursors` synchronously so the handlers below (captured once
  // per effect run) always see the latest cursor data instead of a stale
  // closure over the initial {} state.
  const remoteCursorsRef = useRef({});

  useEffect(() => {
    if (!quillRef.current || quillInstanceRef.current) return undefined;

    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      modules: { toolbar: '#word-ribbon-toolbar' },
      placeholder: canEdit ? 'Start writing your document here...' : 'This document is read-only.',
    });
    quillInstanceRef.current = quill;
    if (!canEdit) quill.disable();

    loadInitialContent(quill, doc.content);

    let saveTimeoutId = null;
    let selectionCursorTimeoutId = null;
    let typingCursorTimeoutId = null;
    let isSendingOperation = false;

    // ---- Outbound: local edits -> socket ----
    const sendOperations = (operations) => {
      if (!canEdit || isSendingOperation || operations.length === 0) return;
      isSendingOperation = true;
      socket.emit(DOCUMENT_EVENT.SEND_OPERATION, {
        docId: docId || doc._id,
        actions: operations,
        version: doc.version || 0,
        userId: user?._id || 'anonymous',
        timestamp: Date.now(),
      });
      setTimeout(() => { isSendingOperation = false; }, OPERATION_DEDUPE_WINDOW_MS);
    };

    const sendCursorData = (position, selection) => {
      if (!user) return;
      socket.emit(CURSOR_EVENT.CURSOR_CHANGE, {
        docId: docId || doc._id,
        userId: user._id || user.id,
        userName: user.fullName || user.name || 'Anonymous',
        avatar: user.avatar || '',
        position,
        selection: selection || { index: position, length: 0 },
        color: getRandomColor(),
        timestamp: Date.now(),
      });
    };

    // Re-renders every currently-tracked remote cursor flag at a position
    // shifted by `operations`. Called whenever *any* text is inserted or
    // deleted — by us or by someone else — so a cursor flag never lags
    // behind the text it's supposed to be pointing at.
    const repositionRemoteCursors = (operations) => {
      const current = remoteCursorsRef.current;
      const userIds = Object.keys(current);
      if (userIds.length === 0) return;

      const next = { ...current };
      userIds.forEach((uid) => {
        const cursor = current[uid];
        const shiftedPosition = transformPositionByOperations(cursor.position, operations);
        const updatedCursor = { ...cursor, position: shiftedPosition };
        next[uid] = updatedCursor;
        renderRemoteCursorFlag(quill, updatedCursor);
      });
      remoteCursorsRef.current = next;
      setRemoteCursors(next);
    };

    // ---- Inbound: socket -> Quill ----
    const applyReceivedOperation = ({ actions }) => {
      if (!Array.isArray(actions)) return;
      for (const action of actions) {
        try {
          if (action.type === 'insert' && action.text != null) {
            const insertText = action.isEmbed ? JSON.parse(action.text) : action.text;
            if (typeof insertText === 'string') quill.insertText(action.position, insertText, Quill.sources.SILENT);
          } else if (action.type === 'delete' && action.length) {
            quill.deleteText(action.position, action.length, Quill.sources.SILENT);
          } else if (action.type === 'format' && action.attributes) {
            quill.formatText(action.position, action.length || 1, action.attributes, Quill.sources.SILENT);
          }
        } catch (error) {
          console.error('Error applying operation:', error);
        }
      }
      // Quill auto-corrects OUR OWN caret position for silent edits, but the
      // cached positions of everyone else's cursor flags need to be shifted
      // by hand or they'll stay frozen at their old (now wrong) location.
      repositionRemoteCursors(actions);
      onWordCountChange(countWords(quill.getText()));
    };

    const handleCursorUpdate = (cursorData) => {
      renderRemoteCursorFlag(quill, cursorData);
      remoteCursorsRef.current = { ...remoteCursorsRef.current, [cursorData.userId]: cursorData };
      setRemoteCursors(remoteCursorsRef.current);

      window.cursorTimeouts = window.cursorTimeouts || {};
      clearTimeout(window.cursorTimeouts[cursorData.userId]);
      window.cursorTimeouts[cursorData.userId] = setTimeout(() => {
        document.getElementById(`cursor-${cursorData.userId}`)?.remove();
        const next = { ...remoteCursorsRef.current };
        delete next[cursorData.userId];
        remoteCursorsRef.current = next;
        setRemoteCursors(next);
      }, REMOTE_CURSOR_TTL_MS);
    };

    const handleUserLeft = ({ userId }) => {
      document.getElementById(`cursor-${userId}`)?.remove();
      const next = { ...remoteCursorsRef.current };
      delete next[userId];
      remoteCursorsRef.current = next;
      setRemoteCursors(next);
      clearTimeout(window.cursorTimeouts?.[userId]);
    };

    // ---- Quill-native event handlers ----
    const handleTextChange = (delta, _oldDelta, source) => {
      if (source === 'silent') return;

      onOutlineChange();
      const words = countWords(quill.getText());
      onWordCountChange(words);

      const operations = convertDeltaToWireOperations(delta);
      if (operations.length > 0) {
        sendOperations(operations);
        // Keep everyone else's cursor flags tracking the correct text after
        // our own edit shifts positions around them.
        repositionRemoteCursors(operations);
      }

      // Broadcast our own cursor position as we type (not just on click/
      // select) so collaborators see the caret advance in real time.
      clearTimeout(typingCursorTimeoutId);
      typingCursorTimeoutId = setTimeout(() => {
        const range = quill.getSelection();
        if (range) sendCursorData(range.index, range);
        typingCursorTimeoutId = null;
      }, TYPING_CURSOR_BROADCAST_DEBOUNCE_MS);

      onSyncingChange(true);
      clearTimeout(saveTimeoutId);
      saveTimeoutId = setTimeout(() => {
        onSave(title, quillDeltaToCustomDelta(quill.getContents()), words);
        onSyncingChange(false);
        saveTimeoutId = null;
      }, AUTOSAVE_DEBOUNCE_MS);
    };

    const handleSelectionChange = (range, _oldRange, source) => {
      if (source === 'silent' || !range) return;
      clearTimeout(selectionCursorTimeoutId);
      selectionCursorTimeoutId = setTimeout(() => {
        sendCursorData(range.index, range);
        selectionCursorTimeoutId = null;
      }, CURSOR_SEND_DEBOUNCE_MS);
    };

    const handleClick = (event) => {
      const clickPosition = resolveClickPosition(quill, event);
      if (clickPosition !== null && user) {
        socket.emit(CURSOR_EVENT.CURSOR_CHANGE, {
          docId: docId || doc._id,
          userId: user._id || user.id,
          userName: user.fullName || user.name || 'Anonymous',
          avatar: user.avatar || '',
          position: clickPosition,
          timestamp: Date.now(),
          eventType: 'click',
        });
      }
    };

    socket.on(DOCUMENT_EVENT.RECEIVE_OPERATION, applyReceivedOperation);
    socket.on(CURSOR_EVENT.CURSOR_UPDATE, handleCursorUpdate);
    socket.on(DOCUMENT_EVENT.USER_LEFT, handleUserLeft);
    quill.on('text-change', handleTextChange);
    quill.on('selection-change', handleSelectionChange);
    quill.root.addEventListener('click', handleClick);
    quill.container.addEventListener('click', handleClick);

    const outlineInitTimeout = setTimeout(onOutlineChange, 50);

    return () => {
      clearTimeout(saveTimeoutId);
      clearTimeout(selectionCursorTimeoutId);
      clearTimeout(typingCursorTimeoutId);
      clearTimeout(outlineInitTimeout);

      socket.off(DOCUMENT_EVENT.RECEIVE_OPERATION, applyReceivedOperation);
      socket.off(CURSOR_EVENT.CURSOR_UPDATE, handleCursorUpdate);
      socket.off(DOCUMENT_EVENT.USER_LEFT, handleUserLeft);

      quill.off('text-change', handleTextChange);
      quill.off('selection-change', handleSelectionChange);
      quill.root.removeEventListener('click', handleClick);
      quill.container.removeEventListener('click', handleClick);
      quill.emitter.off();

      if (quill.container) quill.container.innerHTML = '';
      quillInstanceRef.current = null;

      // Clean up any remote cursor flags and their expiry timers so a manual
      // page refresh (which tears this component down) doesn't leave orphaned
      // DOM nodes or dangling timeouts behind.
      Object.keys(remoteCursorsRef.current).forEach((uid) => document.getElementById(`cursor-${uid}`)?.remove());
      remoteCursorsRef.current = {};
      if (window.cursorTimeouts) {
        Object.values(window.cursorTimeouts).forEach(clearTimeout);
        window.cursorTimeouts = {};
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, docId, onSave, title, user, socket, canEdit]);

  return { quillInstanceRef, remoteCursors };
}

function loadInitialContent(quill, content) {
  try {
    if (content) {
      quill.setContents(customDeltaToQuillDelta(content));
    }
  } catch (error) {
    console.error('Error setting initial content:', error);
    if (typeof content === 'string') quill.clipboard.dangerouslyPasteHTML(content);
  }
}

function resolveClickPosition(quill, _event) {
  try {
    const quillSelection = quill.getSelection();
    if (quillSelection) return quillSelection.index;

    const selection = window.getSelection();
    if (!selection.rangeCount) return null;

    const range = selection.getRangeAt(0);
    const walker = document.createTreeWalker(quill.root, NodeFilter.SHOW_TEXT, null, false);
    let currentNode = walker.nextNode();
    let currentOffset = 0;
    while (currentNode) {
      if (currentNode === range.startContainer) return currentOffset + range.startOffset;
      currentOffset += (currentNode.textContent || '').length;
      currentNode = walker.nextNode();
    }
    return quill.getText().length;
  } catch {
    return quill.getSelection()?.index || 0;
  }
}

function renderRemoteCursorFlag(quill, { userId, userName, position, color, avatar }) {
  document.getElementById(`cursor-${userId}`)?.remove();
  const bounds = quill.getBounds(position);
  if (!bounds) return;

  const cursorColor = color || '#FF6B6B';

  const cursorEl = document.createElement('div');
  cursorEl.id = `cursor-${userId}`;
  cursorEl.className = 'remote-cursor';
  cursorEl.style.cssText = `
    position: absolute;
    top: ${bounds.top}px;
    left: ${bounds.left}px;
    height: ${bounds.height}px;
    width: 2px;
    background-color: ${cursorColor};
    pointer-events: none;
    z-index: 1000;
    transition: all 0.05s ease;
  `;

  const flag = document.createElement('div');
  flag.className = 'remote-cursor-flag';
  flag.style.cssText = `
    position: absolute;
    top: -22px;
    left: -10px;
    background-color: ${cursorColor};
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex;
    align-items: center;
    gap: 4px;
  `;

  if (avatar) {
    flag.innerHTML = `
      <img src="${avatar}" alt="${userName}" style="
        width: 16px; height: 16px; border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.3); object-fit: cover;
      ">
      ${userName || 'User'}
    `;
  } else {
    flag.textContent = userName || 'User';
  }

  cursorEl.appendChild(flag);
  quill.container.style.position = 'relative';
  quill.container.appendChild(cursorEl);
}

// ============================================================
// MAIN WRAPPER COMPONENT
// ============================================================
export default function EditingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, triggerToast } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { socket } = useSocket();

  const { doc, docUserRole } = useDocumentLoader(id, socket, navigate, triggerToast, user);
  const [localDoc, setLocalDoc] = useState(null);

  // Keep a local, updatable copy once the document has loaded.
  useEffect(() => {
    if (doc) setLocalDoc(doc);
  }, [doc]);

  const handleSave = useCallback((newTitle, newContent, words) => {
    let customContent = { ops: [] };
    if (newContent) {
      try {
        if (newContent.ops && Array.isArray(newContent.ops)) {
          customContent = newContent;
        } else {
          const tempQuill = new Quill(document.createElement('div'), { theme: 'snow' });
          tempQuill.clipboard.dangerouslyPasteHTML(newContent);
          customContent = quillDeltaToCustomDelta(tempQuill.getContents());
        }
      } catch (error) {
        console.error('Error converting content:', error);
        customContent = { ops: [{ position: 0, text: newContent, attributes: {} }] };
      }
    }
    const updated = documentService.update(id, { name: newTitle, content: customContent, wordCount: words });
    if (updated) setLocalDoc(updated);
  }, [id]);

  if (!localDoc) {
    return (
      <div className="min-h-screen bg-[#F7FAFF] dark:bg-[#070B14] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D6EFD]" />
      </div>
    );
  }

  return (
    <EditingPageContent
      document={localDoc}
      theme={theme}
      toggleTheme={toggleTheme}
      onBack={() => navigate('/dashboard')}
      onSave={handleSave}
      docUserRole={docUserRole}
      docId={id}
    />
  );
}

// ============================================================
// EDITING PAGE CONTENT
// ============================================================
function EditingPageContent({ document: doc, theme, toggleTheme, onBack, onSave, docUserRole, docId }) {
  const { socket } = useSocket();
  const { user, triggerToast } = useAuth();

  const [title, setTitle] = useState(doc.title || 'Untitled Document');
  const [isSyncing, setIsSyncing] = useState(false);

  const isOwner = docUserRole === DOCUMENT_ROLES.OWNER;
  const isEditor = docUserRole === DOCUMENT_ROLES.EDITOR;
  const canEdit = isOwner || isEditor;
  const canShare = isOwner;

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

  const updateOutline = useCallback((quill) => {
    const target = quill || quillInstance;
    if (!target) return;
    const headings = Array.from(target.root.querySelectorAll('h1, h2, h3'));
    setOutline(headings.map((h, i) => {
      if (!h.id) h.id = `heading-ref-${i}`;
      return { id: h.id, text: h.innerText || h.textContent || '', level: h.tagName.toLowerCase() };
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { quillInstanceRef, remoteCursors } = useCollaborativeQuill({
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
  });
  const quillInstance = quillInstanceRef.current;

  // Editor body class toggle
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) root.classList.add('editor-mode');
    return () => { if (root) root.classList.remove('editor-mode'); };
  }, []);

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
  };

  // ---- Format painter trigger ----
  const handleFormatPainterClick = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection();
    if (range?.length > 0) {
      setCopiedFormat(quillInstance.getFormat(range.index, range.length));
      setFormatPainterActive(true);
    } else {
      triggerToast('Select some formatted text first to copy its style!', 'info');
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
      triggerToast(`No matches found for "${findText}"`, 'info');
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

    triggerToast(`Replaced ${count} occurrences of "${findText}"`, 'success');
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
    setComments((prev) => [{ id: Date.now(), author: 'You', text: newCommentText, time: 'Just now' }, ...prev]);
    setNewCommentText('');
  };

  // ---- Sharing ----
  const handleSendCollabLink = async (e) => {
    e.preventDefault();
    try {
      const res = await inviteCollab({ docId, email: shareEmail, role: shareRole });
      triggerToast(res.data.message || 'Invitation sent', 'success');
      setShareEmail('');
    } catch (error) {
      triggerToast(error.response?.data?.message || error.message || 'Failed to send invitation', 'warning');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://quillsuite.collab/docs/${docId}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShowStats = () => {
    alert(`Proofing Statistics:\n- Words: ${wordCount}\n- Reading time: ~${Math.ceil(wordCount / 200)} min\n- Chars: ${quillInstance?.getText().length || 0}`);
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="word-editor-layout">
      <EditorHeader
        onBack={onBack}
        autoSaveActive={autoSaveActive}
        onToggleAutoSave={() => setAutoSaveActive((p) => !p)}
        canEdit={canEdit}
        onUndo={() => quillInstance?.history.undo()}
        onRedo={() => quillInstance?.history.redo()}
        title={title}
        onTitleChange={handleTitleChange}
        docUserRole={docUserRole}
        theme={theme}
        toggleTheme={toggleTheme}
        canShare={canShare}
        isEditor={isEditor}
        onShareClick={() => setShowShareModal(true)}
      />

      <RibbonTabsBar
        activeRibbonTab={activeRibbonTab}
        setActiveRibbonTab={setActiveRibbonTab}
        theme={theme}
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
        setLeftSidebarCollapsed={setLeftSidebarCollapsed}
        rightSidebarCollapsed={rightSidebarCollapsed}
        setRightSidebarCollapsed={setRightSidebarCollapsed}
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

      <main className="editor-workspace">
        <SidebarToggle
          side="left"
          collapsed={leftSidebarCollapsed}
          onClick={() => setLeftSidebarCollapsed((p) => !p)}
        />

        <LeftSidebar
          collapsed={leftSidebarCollapsed}
          leftTab={leftTab}
          setLeftTab={setLeftTab}
          outline={outline}
          onOutlineClick={handleOutlineClick}
          canEdit={canEdit}
          history={history}
        />

        <section className="editor-canvas-pane">
          <div
            className="editor-paper-container"
            style={{
              transform: `scale(${zoomPercent / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div ref={quillRef} style={{ minHeight: '100%' }} />
          </div>
        </section>

        <SidebarToggle
          side="right"
          collapsed={rightSidebarCollapsed}
          onClick={() => setRightSidebarCollapsed((p) => !p)}
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
        />
      </main>

      <StatusBar
        wordCount={wordCount}
        isSyncing={isSyncing}
        zoomPercent={zoomPercent}
        setZoomPercent={setZoomPercent}
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

// ============================================================
// PRESENTATIONAL SUBCOMPONENTS
// ============================================================

function EditorHeader({
  onBack, autoSaveActive, onToggleAutoSave, canEdit, onUndo, onRedo,
  title, onTitleChange, docUserRole, theme, toggleTheme, canShare, isEditor, onShareClick,
}) {
  return (
    <header className="editor-header">
      <div className="editor-header-left">
        <button className="sidebar-toggle-btn" onClick={onBack} title="Back to Dashboard">
          <FaChevronLeft size={20} />
        </button>
        <div className="quick-access-icons">
          <button
            className={`autosave-toggle ${autoSaveActive ? 'active' : ''}`}
            onClick={onToggleAutoSave}
            title={`AutoSave is ${autoSaveActive ? 'ON' : 'OFF'}`}
          >
            <LuRefreshCw size={14} className={autoSaveActive ? 'rotating-slow' : ''} />
            <span className="autosave-label">AutoSave</span>
          </button>
          {canEdit && (
            <>
              <button onClick={onUndo} title="Undo (Ctrl+Z)"><FaUndo size={14} /></button>
              <button onClick={onRedo} title="Redo (Ctrl+Y)"><FaRedo size={14} /></button>
            </>
          )}
        </div>
        <div className="doc-title-container">
          <input
            type="text"
            className="doc-title-input"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Untitled Document"
            disabled={!canEdit}
            title={canEdit ? 'Edit document title' : 'You do not have edit access'}
          />
          <span className="word-file-extension">- Word</span>
          <span className="word-title-cloud-status" title="Saved to Cloud">
            <FaCloud size={14} style={{ color: 'var(--accent)' }} />
          </span>
          <span className="text-center text-[14px] text-yellow-400">{docUserRole}</span>
        </div>
      </div>

      <div className="editor-header-center">
        <div className="word-header-search">
          <FaSearch size={14} className="search-glass-icon" />
          <input type="text" placeholder="Search (Alt+Q)" disabled />
        </div>
      </div>

      <div className="editor-header-right">
        <div className="avatar-stack">
          <div className="avatar-item" style={{ backgroundColor: 'var(--accent)' }} data-tooltip="You">Y</div>
          <div className="avatar-item" style={{ backgroundColor: '#10b981' }} data-tooltip="Lisa Chen">LC</div>
          <div className="avatar-item" style={{ backgroundColor: '#3b82f6' }} data-tooltip="Alex Johnson">AJ</div>
          <div className="avatar-item avatar-more" data-tooltip="Simulated team members">+1</div>
        </div>
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{ marginRight: '8px' }}
        >
          {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>
        {canShare ? (
          <button className="btn-primary" onClick={onShareClick}>
            <LuShare2 size={16} /> Share
          </button>
        ) : (
          <button
            className="btn-primary"
            disabled
            style={{ opacity: 0.4, cursor: 'not-allowed' }}
            title={isEditor ? 'Only document Owners can share' : 'You have read-only access'}
          >
            <LuShare2 size={16} /> Share
          </button>
        )}
      </div>
    </header>
  );
}

function RibbonTabsBar({ activeRibbonTab, setActiveRibbonTab, theme }) {
  return (
    <div className="word-ribbon-tabs-bar">
      <button className="ribbon-tab-header-btn" onClick={() => alert(STATIC_MENU_ALERTS.file)}>File</button>
      {RIBBON_TABS.map((tab) => (
        <button
          key={tab}
          className={`ribbon-tab-header-btn ${activeRibbonTab === tab ? 'active' : ''}`}
          onClick={() => setActiveRibbonTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
      <button
        className="ribbon-tab-header-btn"
        onClick={() => { setActiveRibbonTab('design'); alert(`Design Ribbons: System accents are anchored to ${theme} Cobalt.`); }}
      >
        Design
      </button>
      <button className="ribbon-tab-header-btn" onClick={() => alert(STATIC_MENU_ALERTS.layout)}>Layout</button>
      <button className="ribbon-tab-header-btn" onClick={() => alert(STATIC_MENU_ALERTS.references)}>References</button>
      <button className="ribbon-tab-header-btn" onClick={() => alert(STATIC_MENU_ALERTS.mailings)}>Mailings</button>
      <button className="ribbon-tab-header-btn" onClick={() => alert(STATIC_MENU_ALERTS.help)}>Help</button>
    </div>
  );
}

function RibbonToolbar({
  activeRibbonTab, canEdit, formatPainterActive, onFormatPainterClick, onGrowFont, onShrinkFont,
  onParagraphShading, onApplyStyle, onOpenFind, onOpenReplace, onShowStats,
  leftSidebarCollapsed, setLeftSidebarCollapsed, rightSidebarCollapsed, setRightSidebarCollapsed,
}) {
  return (
    <div id="word-ribbon-toolbar" className="word-ribbon-toolbar-panel">
      {/* HOME TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'home' ? 'visible' : 'hidden'}`}>
        {!canEdit ? (
          <div style={{ padding: '8px 16px', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
            👁️ You are viewing this document in read-only mode.
          </div>
        ) : (
          <>
            <div className="ribbon-group clipboard-group">
              <div className="ribbon-buttons-grid">
                <button className="ribbon-large-btn ql-paste" onClick={() => alert('Press Ctrl+V to paste.')} title="Paste (Ctrl+V)">
                  📋<span>Paste</span>
                </button>
                <div className="ribbon-small-buttons">
                  <button className="ql-cut" onClick={() => alert('Press Ctrl+X to cut.')} title="Cut">✂️ Cut</button>
                  <button className="ql-copy" onClick={() => alert('Press Ctrl+C to copy.')} title="Copy">📄 Copy</button>
                  <button
                    type="button"
                    className={`format-painter-btn ${formatPainterActive ? 'active' : ''}`}
                    onClick={onFormatPainterClick}
                    title="Format Painter"
                  >
                    🖌️ Format Painter
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
                  <button className="ql-clean" title="Clear Formatting" />
                  <button className="ql-bold" title="Bold (Ctrl+B)" />
                  <button className="ql-italic" title="Italic (Ctrl+I)" />
                  <button className="ql-underline" title="Underline (Ctrl+U)" />
                  <button className="ql-strike" title="Strikethrough" />
                  <button className="ql-script" value="sub" title="Subscript" />
                  <button className="ql-script" value="super" title="Superscript" />
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
                <button type="button" title="Paragraph Shading" onClick={onParagraphShading}>🪣</button>
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
                {STYLE_CARDS.map(({ type, label, preview, style }) => (
                  <button
                    key={type}
                    type="button"
                    className={`style-card ${type}-card`}
                    onClick={() => onApplyStyle(type)}
                    title={`${label} Style`}
                  >
                    <span className="style-card-preview" style={style}>{preview}</span>
                    <span className="style-card-name">{label}</span>
                  </button>
                ))}
              </div>
              <span className="ribbon-group-label">Styles</span>
            </div>
            <div className="ribbon-group-separator" />

            <div className="ribbon-group editing-group">
              <div className="ribbon-vertical-buttons">
                <button type="button" className="editing-ribbon-btn" onClick={onOpenFind} title="Find text">🔍 Find</button>
                <button type="button" className="editing-ribbon-btn" onClick={onOpenReplace} title="Replace text">🔄 Replace</button>
              </div>
              <span className="ribbon-group-label">Editing</span>
            </div>
          </>
        )}
      </div>

      {/* INSERT TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'insert' ? 'visible' : 'hidden'}`}>
        {canEdit && (
          <div className="ribbon-group">
            <div className="ribbon-controls-container">
              <div className="ribbon-buttons-row">
                <button className="ql-blockquote" title="Blockquote" />
                <button className="ql-code-block" title="Code Block" />
              </div>
            </div>
            <span className="ribbon-group-label">Elements</span>
          </div>
        )}
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
                onClick={() => setLeftSidebarCollapsed((p) => !p)}
              >
                <FaList size={16} style={{ marginRight: '6px' }} />
                <span>Navigation Outline</span>
              </button>
              <button
                type="button"
                className={`ribbon-custom-btn ${!rightSidebarCollapsed ? 'active' : ''}`}
                onClick={() => setRightSidebarCollapsed((p) => !p)}
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

function FindReplacePane({
  findText, setFindText, replaceText, setReplaceText, onClose, onFindNext, onReplace, onReplaceAll,
}) {
  return (
    <div className="word-find-replace-pane">
      <div className="find-replace-header">
        <span>Find and Replace</span>
        <button className="find-replace-close" onClick={onClose}>
          <LuX size={14} />
        </button>
      </div>
      <div className="find-replace-body">
        <div className="find-replace-row">
          <label htmlFor="find-input-focus">Find:</label>
          <input
            id="find-input-focus"
            type="text"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
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
          <button onClick={onFindNext} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Find Next</button>
          <button onClick={onReplace} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Replace</button>
          <button onClick={onReplaceAll} className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Replace All</button>
        </div>
      </div>
    </div>
  );
}

function SidebarToggle({ side, collapsed, onClick }) {
  const Icon = collapsed ? FaPlus : LuX;
  const style = side === 'left'
    ? { left: collapsed ? '8px' : '268px', transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }
    : { right: collapsed ? '8px' : '268px', transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)' };

  return (
    <div style={{ position: 'absolute', top: '12px', zIndex: 50, ...style }}>
      <button
        className="sidebar-toggle-btn"
        onClick={onClick}
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
        title={`${collapsed ? 'Expand' : 'Collapse'} ${side === 'left' ? 'Navigation' : 'Collaborations'} Sidebar`}
      >
        {side === 'left'
          ? <Icon size={16} />
          : (collapsed ? <FaUsers size={16} /> : <LuX size={16} />)}
      </button>
    </div>
  );
}

function LeftSidebar({ collapsed, leftTab, setLeftTab, outline, onOutlineClick, canEdit, history }) {
  return (
    <aside className={`editor-sidebar left-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header"><span>Navigation Outline</span></div>
      <div className="sidebar-tabs">
        <button className={`sidebar-tab ${leftTab === 'outline' ? 'active' : ''}`} onClick={() => setLeftTab('outline')}>
          <FaList size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Outline
        </button>
        <button className={`sidebar-tab ${leftTab === 'history' ? 'active' : ''}`} onClick={() => setLeftTab('history')}>
          <FaHistory size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> History
        </button>
      </div>
      <div className="sidebar-content">
        {leftTab === 'outline' ? (
          <div className="outline-list">
            {outline.length === 0 ? (
              <div className="outline-empty">
                No headings found.<br />
                {canEdit ? 'Create headings from the Home Styles carousel to populate this outline.' : 'This document has no headings yet.'}
              </div>
            ) : (
              outline.map((item) => (
                <button
                  key={item.id}
                  className={`outline-item ${item.level}`}
                  onClick={() => onOutlineClick(item.id)}
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
                <div className="timeline-dot" />
                <div className="timeline-time">{h.time}</div>
                <div className="timeline-author">{h.author}</div>
                <div className="timeline-desc">{h.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function RightSidebar({
  collapsed, rightTab, setRightTab, chatMessages, chatInputText, setChatInputText, onSendMessage, chatBottomRef,
  comments, newCommentText, setNewCommentText, onAddComment,
}) {
  return (
    <aside className={`editor-sidebar right-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header"><span>Collaborations</span></div>
      <div className="sidebar-tabs">
        <button className={`sidebar-tab ${rightTab === 'chat' ? 'active' : ''}`} onClick={() => setRightTab('chat')}>
          <LuMessageSquare size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Team Chat
        </button>
        <button className={`sidebar-tab ${rightTab === 'comments' ? 'active' : ''}`} onClick={() => setRightTab('comments')}>
          <FaUsers size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Comments
        </button>
      </div>
      <div className="sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 100px)' }}>
        {rightTab === 'chat' ? (
          <div className="chat-container">
            <div className="chat-messages">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`chat-bubble ${msg.type}`}>
                  <span className="chat-bubble-meta"><strong>{msg.sender}</strong> • {msg.time}</span>
                  {msg.text}
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>
            <form onSubmit={onSendMessage} className="chat-input-area">
              <input
                type="text"
                className="chat-input"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder="Type a team message..."
              />
              <button type="submit" className="chat-send-btn" title="Send message">
                <LuSend size={14} />
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
            <form onSubmit={onAddComment} className="comment-new-container">
              <textarea
                className="comment-textarea"
                placeholder="Add feedback to canvas..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px', alignSelf: 'flex-end' }}>
                Post Comment
              </button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
}

function StatusBar({ wordCount, isSyncing, zoomPercent, setZoomPercent }) {
  return (
    <footer className="word-status-bar">
      <div className="status-bar-left">
        <span>Page 1 of 1</span>
        <span className="status-bar-separator">|</span>
        <span>{wordCount} words</span>
        <span className="status-bar-separator">|</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <LuCheck size={12} style={{ color: '#10b981' }} /> Spelling: Checked
        </span>
        <span className="status-bar-separator">|</span>
        <span>English (India)</span>
        <span className="status-bar-separator">|</span>
        <span>Accessibility: Good to go</span>
      </div>
      <div className="status-bar-center">
        <div className={`sync-badge ${isSyncing ? 'syncing' : ''}`} style={{ border: 'none', background: 'transparent', padding: 0 }}>
          <span className="sync-dot" />
          <span>{isSyncing ? 'AutoSave: Syncing...' : 'Saved to Cloud'}</span>
        </div>
      </div>
      <div className="status-bar-right">
        <button
          type="button"
          className="status-bar-btn"
          onClick={() => alert('Focus Mode activated! Enjoy distraction-free writing.')}
          style={{ background: 'transparent', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer' }}
        >
          Focus
        </button>
        <span className="status-bar-separator">|</span>
        <button onClick={() => setZoomPercent((p) => Math.max(50, p - 10))} className="zoom-btn" title="Zoom Out">-</button>
        <input
          type="range" min="50" max="150" value={zoomPercent}
          onChange={(e) => setZoomPercent(Number(e.target.value))}
          className="zoom-slider"
          title="Zoom slider"
        />
        <button onClick={() => setZoomPercent((p) => Math.min(150, p + 10))} className="zoom-btn" title="Zoom In">+</button>
        <span style={{ fontWeight: 600, width: '36px', textAlign: 'right' }}>{zoomPercent}%</span>
      </div>
    </footer>
  );
}

function ShareModal({ onClose, shareEmail, setShareEmail, shareRole, setShareRole, onInvite, docId, copied, onCopyLink }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Share Workspace</h3>
          <button className="modal-close" onClick={onClose}>
            <LuX size={18} />
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
              <select className="form-select" value={shareRole} onChange={(e) => setShareRole(e.target.value)}>
                <option value={DOCUMENT_ROLES.OWNER}>{DOCUMENT_ROLES.OWNER}</option>
                <option value={DOCUMENT_ROLES.EDITOR}>{DOCUMENT_ROLES.EDITOR}</option>
                <option value={DOCUMENT_ROLES.VIEWER}>{DOCUMENT_ROLES.VIEWER}</option>
              </select>
              <button className="btn-primary" style={{ padding: '0 16px' }} onClick={onInvite}>
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
                value={`https://quillsuite.collab/docs/${docId}`}
              />
              <button className="btn-copy" onClick={onCopyLink}>
                {copied ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaCheck size={14} /> Copied!</span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaCopy size={14} /> Copy Link</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}