import 'quill/dist/quill.snow.css';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
  
import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

class PageBreakBlot extends BlockEmbed {
  static create() {
    const node = super.create();
    node.setAttribute('class', 'page-break');
    node.setAttribute('contenteditable', 'false');
    return node;
  }
  static value() {
    return true;
  }
}
PageBreakBlot.blotName = 'pagebreak';
PageBreakBlot.tagName = 'div';
Quill.register(PageBreakBlot);

class DividerBlot extends BlockEmbed {
  static create() {
    const node = super.create();
    node.setAttribute('class', 'quill-divider');
    node.setAttribute('contenteditable', 'false');
    return node;
  }
  static value() {
    return true;
  }
}
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';
Quill.register(DividerBlot);

import { useNavigate, useParams } from 'react-router-dom';
import { FaCrown } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { fetchDoc, inviteCollab } from '../apis/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import { documentService } from '../services/documentService';
import { CURSOR_EVENT, DOCUMENT_EVENT, DOCUMENT_ROLES } from '../utils/constants';
import InsertRibbon from '../components/editor/InsertRibbon';

import {
  FaBookOpen, FaCheck, FaChevronLeft, FaCloud, FaHistory,
  FaList, FaMoon, FaPlus, FaRedo, FaSearch, FaSun, FaUndo, FaUsers, FaUserSecret,
} from 'react-icons/fa';
import {
  LuCheck, LuMessageSquare, LuRefreshCw, LuSend, LuShare2, LuX,
} from 'react-icons/lu';
import { randomUser } from '../../public';
import { ATHENURA_CIRCLE_IMAGE } from '../assets';

// ============================================================
// CONSTANTS
// ============================================================

const RIBBON_TABS = ['home', 'insert', 'design', 'layout', 'review', 'view'];

const STATIC_MENU_ALERTS = {
  file: 'File Options:\n- Back to Dashboard\n- Document is auto-saved locally.',
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

const ACCENT_SWATCHES = ['#0D6EFD', '#7C3AED', '#DC2626', '#059669', '#EA580C', '#0891B2'];
const PAGE_LAYOUTS = {
  narrow: { label: 'Narrow', maxWidth: '680px' },
  normal: { label: 'Normal', maxWidth: '816px' },
  wide: { label: 'Wide', maxWidth: '1000px' },
};

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
const CURSOR_SEND_DEBOUNCE_MS = 70;
// How long a remote cursor flag stays on screen after the last update we heard
// for that user. This was previously 50ms, which meant a cursor flag would
// vanish almost immediately after being drawn — it needs to comfortably
// outlast the interval at which we expect cursor updates to arrive.
const REMOTE_CURSOR_TTL_MS = 500;
// Separate, tighter debounce used to broadcast the local cursor position while
// the user is actively typing (not just when they click/select), so remote
// viewers see the caret advance as characters are typed.
const TYPING_CURSOR_BROADCAST_DEBOUNCE_MS = 15;
const OPERATION_DEDUPE_WINDOW_MS = 80;
const TITLE_SAVE_DEBOUNCE_MS = 100;
const TOAST_DURATION_MS = 1500;
const MOBILE_BREAKPOINT = 768;
const MAX_UNDO_STACK = 100;

// A fixed palette so a given collaborator always renders with the same
// color. Previously the color was re-rolled at random on every single
// cursor broadcast, which made remote cursor flags appear to "flicker"
// or change identity on every keystroke.
const CURSOR_COLOR_PALETTE = ['#FF6B6B', '#4ECDC4', '#45AAF2', '#FED330', '#A55EEA', '#26DE81', '#FD9644', '#EB3B5A'];

function colorForUserId(id) {
  const str = String(id || 'anonymous');
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return CURSOR_COLOR_PALETTE[hash % CURSOR_COLOR_PALETTE.length];
}


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

/** True if a text-change delta actually inserts or deletes content, as
 * opposed to only applying formatting (bold, color, alignment, etc). Used to
 * keep undo/redo scoped to real content changes only. */
function deltaChangesContent(delta) {
  if (!delta?.ops) return false;
  return delta.ops.some((op) => op.insert !== undefined || op.delete !== undefined);
}

// ============================================================
// HOOK: useIsMobile
// ============================================================
function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= breakpoint,
  );
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

// ============================================================
// HOOK: useToasts
// A small, self-contained toast system so this page no longer depends on
// AuthContext's triggerToast / its popup styling.
// ============================================================
function useToasts() {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const toastId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => dismissToast(toastId), TOAST_DURATION_MS);
  }, [dismissToast]);

  return { toasts, showToast, dismissToast };
}

const TOAST_ICON = { success: '✅', error: '⛔', warning: '⚠️', info: 'ℹ️' };
const TOAST_ACCENT = { success: '#26DE81', error: '#EB3B5A', warning: '#FED330', info: '#45AAF2' };

function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div
      className="own-toast-stack"
      style={{
        position: 'fixed', top: '16px', right: '16px', zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: '8px',
        maxWidth: 'min(90vw, 340px)',
      }}
    >
      <style>{'@keyframes ownToastIn { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }'}</style>
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          onClick={() => onDismiss(t.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--bg, #ffffff)', color: 'var(--text, #111827)',
            borderLeft: `4px solid ${TOAST_ACCENT[t.type] || TOAST_ACCENT.info}`,
            borderRadius: '8px', padding: '10px 12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            fontSize: '13px', cursor: 'pointer',
            animation: 'ownToastIn 0.18s ease-out',
          }}
        >
          <span aria-hidden="true">{TOAST_ICON[t.type] || TOAST_ICON.info}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <LuX size={12} />
        </div>
      ))}
    </div>
  );
}

// ============================================================
// HOOK: useDocumentLoader
// Fetches the document + role over REST, joins the socket room,
// and toasts when other users join.
// ============================================================
function useDocumentLoader(id, socket, navigate, showToast, currentUser) {
  const [doc, setDoc] = useState(null);
  const [docUserRole, setDocUserRole] = useState(null);

  useEffect(() => {
    if (!socket) return undefined;

    const loadDocument = async () => {
      try {
        const response = await fetchDoc(id);
        const responseData = response.data.data; // { document, role }
        console.log("res", responseData)
        if (!responseData?.document) {
          showToast('Document not found', 'warning');
          navigate('/dashboard');
          return;
        }
        setDocUserRole(responseData.role);
        setDoc(responseData.document);
        socket.emit(DOCUMENT_EVENT.USER_JOIN, { docId: responseData.document._id || id });
        showToast('Document loaded successfully', 'success');
      } catch (error) {
        console.error('Error fetching document:', error);
        showToast('Failed to load document', 'error');
        navigate('/dashboard');
      }
    };

    loadDocument();

    const handleNewUserJoin = (data) => {
      if (data?.user?._id === currentUser?._id) return; // don't toast yourself
      if (data?.user) {
        showToast(`${data.user.fullName || 'User'} joined the document`, 'info');
      } else if (data?.message) {
        showToast(data.message, 'info');
      }
    };

    socket.on(DOCUMENT_EVENT.NEW_USER_JOIN, handleNewUserJoin);
    return () => socket.off(DOCUMENT_EVENT.NEW_USER_JOIN, handleNewUserJoin);
  }, [id, socket, navigate, showToast, currentUser]);

  return { doc, docUserRole };
}

// ============================================================
// HOOK: useActiveCollaborators
// Tracks who is currently present in the document (join/leave) so the
// header avatar stack reflects real people instead of hardcoded names.
// ============================================================
function useActiveCollaborators(socket, currentUser, showToast) {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleJoin = (data) => {
      if (!data?.user?._id || data.user._id === currentUser?._id) return;
      setActiveUsers((prev) => {
        if (prev.some((u) => u._id === data.user._id)) return prev;
        return [...prev, data.user];
      });
    };

    const handleLeft = ({ userId }) => {
      if (!userId) return;
      setActiveUsers((prev) => {
        const leaving = prev.find((u) => u._id === userId);
        if (leaving) showToast(`${leaving.fullName || 'A collaborator'} left the document`, 'info');
        return prev.filter((u) => u._id !== userId);
      });
    };

    socket.on(DOCUMENT_EVENT.NEW_USER_JOIN, handleJoin);
    socket.on(DOCUMENT_EVENT.USER_LEFT, handleLeft);
    return () => {
      socket.off(DOCUMENT_EVENT.NEW_USER_JOIN, handleJoin);
      socket.off(DOCUMENT_EVENT.USER_LEFT, handleLeft);
    };
  }, [socket, currentUser, showToast]);

  return activeUsers;
}

// ============================================================
// HOOK: useCollaborativeQuill
// Owns the Quill instance lifecycle: initial content, outbound/inbound
// operation sync, remote cursor rendering, content-only undo/redo, and
// debounced autosave.
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

  // Custom undo/redo: we intentionally do NOT use Quill's built-in history
  // module, because it records every change including pure formatting
  // (bold/italic/align/etc). Undo/redo here should only ever step through
  // actual character insertions and deletions.
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const isApplyingHistoryRef = useRef(false);
  const performUndoRef = useRef(() => {});
  const performRedoRef = useRef(() => {});
  const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });

  // Store all changing props in refs to decouple the main Quill lifecycle effect
  const titleRef = useRef(title);
  const onSaveRef = useRef(onSave);
  const onOutlineChangeRef = useRef(onOutlineChange);
  const onWordCountChangeRef = useRef(onWordCountChange);
  const onSyncingChangeRef = useRef(onSyncingChange);
  const canEditRef = useRef(canEdit);
  const userRef = useRef(user);
  const docRef = useRef(doc);

  useEffect(() => { titleRef.current = title; }, [title]);
  useEffect(() => { onSaveRef.current = onSave; }, [onSave]);
  useEffect(() => { onOutlineChangeRef.current = onOutlineChange; }, [onOutlineChange]);
  useEffect(() => { onWordCountChangeRef.current = onWordCountChange; }, [onWordCountChange]);
  useEffect(() => { onSyncingChangeRef.current = onSyncingChange; }, [onSyncingChange]);
  useEffect(() => { canEditRef.current = canEdit; }, [canEdit]);
  useEffect(() => { userRef.current = user; }, [user]);
  useEffect(() => { docRef.current = doc; }, [doc]);

  // Dynamically enable/disable Quill editor when editing permission changes
  useEffect(() => {
    if (quillInstanceRef.current) {
      if (canEdit) {
        quillInstanceRef.current.enable();
      } else {
        quillInstanceRef.current.disable();
      }
    }
  }, [canEdit]);

  useEffect(() => {
    if (!quillRef.current || quillInstanceRef.current) return undefined;

    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      modules: {
        toolbar: '#word-ribbon-toolbar',
        table: true,
        history: { delay: 0, maxStack: 0, userOnly: true },
        keyboard: {
          bindings: {
            customUndo: {
              key: 'Z',
              shortKey: true,
              handler: () => { performUndoRef.current(); return false; },
            },
            customRedo: {
              key: 'Z',
              shortKey: true,
              shiftKey: true,
              handler: () => { performRedoRef.current(); return false; },
            },
            customRedoY: {
              key: 'Y',
              shortKey: true,
              handler: () => { performRedoRef.current(); return false; },
            },
          },
        },
      },
      placeholder: canEditRef.current ? 'Start writing your document here...' : 'This document is read-only.',
    });
    quillInstanceRef.current = quill;
    if (!canEditRef.current) quill.disable();

    loadInitialContent(quill, docRef.current?.content || doc.content);

    let saveTimeoutId = null;
    let selectionCursorTimeoutId = null;
    let typingCursorTimeoutId = null;
    let isSendingOperation = false;

    const updateHistoryState = () => setHistoryState({
      canUndo: undoStackRef.current.length > 0,
      canRedo: redoStackRef.current.length > 0,
    });

    performUndoRef.current = () => {
      if (!canEditRef.current || undoStackRef.current.length === 0) return;
      const entry = undoStackRef.current.pop();
      isApplyingHistoryRef.current = true;
      quill.updateContents(entry.undo, Quill.sources.USER);
      isApplyingHistoryRef.current = false;
      redoStackRef.current.push(entry);
      updateHistoryState();
    };

    performRedoRef.current = () => {
      if (!canEditRef.current || redoStackRef.current.length === 0) return;
      const entry = redoStackRef.current.pop();
      isApplyingHistoryRef.current = true;
      quill.updateContents(entry.redo, Quill.sources.USER);
      isApplyingHistoryRef.current = false;
      undoStackRef.current.push(entry);
      updateHistoryState();
    };

    // ---- Outbound: local edits -> socket ----
    const sendOperations = (operations) => {
      if (!canEditRef.current || isSendingOperation || operations.length === 0) return;
      isSendingOperation = true;
      socket.emit(DOCUMENT_EVENT.SEND_OPERATION, {
        docId: docId || docRef.current?._id || doc._id,
        actions: operations,
        version: docRef.current?.version || doc.version || 0,
        userId: userRef.current?._id || 'anonymous',
        timestamp: Date.now(),
      });
      setTimeout(() => { isSendingOperation = false; }, OPERATION_DEDUPE_WINDOW_MS);
    };

    const sendCursorData = (position, selection) => {
      if (!userRef.current) return;
      socket.emit(CURSOR_EVENT.CURSOR_CHANGE, {
        docId: docId || docRef.current?._id || doc._id,
        userId: userRef.current._id || userRef.current.id,
        userName: userRef.current.fullName || userRef.current.name || 'Anonymous',
        avatar: userRef.current.avatar || randomUser,
        position,
        selection: selection || { index: position, length: 0 },
        // Stable per-user color instead of a fresh random color on every
        // broadcast — a changing color on every keystroke is what made the
        // remote cursor flags look like they were "fluttering".
        color: colorForUserId(userRef.current._id || userRef.current.id),
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
      if (onWordCountChangeRef.current) {
        onWordCountChangeRef.current(countWords(quill.getText()));
      }
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
    const handleTextChange = (delta, oldContents, source) => {
      if (source === 'silent') return;

      // Record content-only undo/redo history. Formatting-only changes (the
      // `else` branch) are intentionally never pushed onto the stack, and
      // changes we're replaying ourselves via performUndo/performRedo are
      // skipped too so undo/redo can't grow their own stacks.
      if (!isApplyingHistoryRef.current && deltaChangesContent(delta)) {
        const invertDelta = delta.invert(oldContents);
        undoStackRef.current.push({ undo: invertDelta, redo: delta });
        if (undoStackRef.current.length > MAX_UNDO_STACK) undoStackRef.current.shift();
        redoStackRef.current = [];
        updateHistoryState();
      }

      if (onOutlineChangeRef.current) onOutlineChangeRef.current();
      const words = countWords(quill.getText());
      if (onWordCountChangeRef.current) onWordCountChangeRef.current(words);

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

      if (onSyncingChangeRef.current) onSyncingChangeRef.current(true);
      clearTimeout(saveTimeoutId);
      saveTimeoutId = setTimeout(() => {
        if (onSaveRef.current) {
          onSaveRef.current(titleRef.current, quillDeltaToCustomDelta(quill.getContents()), words);
        }
        if (onSyncingChangeRef.current) onSyncingChangeRef.current(false);
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
      if (clickPosition !== null && userRef.current) {
        socket.emit(CURSOR_EVENT.CURSOR_CHANGE, {
          docId: docId || docRef.current?._id || doc._id,
          userId: userRef.current._id || userRef.current.id,
          userName: userRef.current.fullName || userRef.current.name || 'Anonymous',
          avatar: userRef.current.avatar || '',
          position: clickPosition,
          color: colorForUserId(userRef.current._id || userRef.current.id),
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

    const outlineInitTimeout = setTimeout(() => {
      if (onOutlineChangeRef.current) onOutlineChangeRef.current();
    }, 50);

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
      undoStackRef.current = [];
      redoStackRef.current = [];

      // Clean up toolbar pickers so they are not duplicated if the effect re-runs
      const toolbarEl = document.getElementById('word-ribbon-toolbar');
      if (toolbarEl) {
        const pickers = toolbarEl.querySelectorAll('.ql-picker');
        pickers.forEach((picker) => picker.remove());
        const selects = toolbarEl.querySelectorAll('select');
        selects.forEach((select) => {
          select.style.display = '';
        });
      }

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
  }, [quillRef, docId, socket]);

  const performUndo = useCallback(() => performUndoRef.current(), []);
  const performRedo = useCallback(() => performRedoRef.current(), []);

  return {
    quillInstanceRef, remoteCursors, performUndo, performRedo, canUndo: historyState.canUndo, canRedo: historyState.canRedo,
  };
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

// Updates an existing cursor flag's position/color/label in place instead of
// removing and recreating the DOM node on every single update. The old
// remove-then-recreate approach caused a visible flash/flutter on every
// keystroke from a remote collaborator; reusing the node plus a short CSS
// transition makes the flag glide smoothly to its new position instead.
function renderRemoteCursorFlag(quill, cursorData) {
  const {
    userId, userName, position, color, avatar,
  } = cursorData;
  const bounds = quill.getBounds(position);
  if (!bounds) return;

  const cursorColor = color || colorForUserId(userId);
  let cursorEl = document.getElementById(`cursor-${userId}`);
  let flagEl;

  if (!cursorEl) {
    cursorEl = document.createElement('div');
    cursorEl.id = `cursor-${userId}`;
    cursorEl.className = 'remote-cursor';
    cursorEl.style.cssText = `
      position: absolute;
      width: 2px;
      pointer-events: none;
      z-index: 1000;
      transition: top 0.12s ease, left 0.12s ease, height 0.12s ease;
    `;

    flagEl = document.createElement('div');
    flagEl.className = 'remote-cursor-flag';
    flagEl.style.cssText = `
      position: absolute;
      top: -22px;
      left: -10px;
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
    cursorEl.appendChild(flagEl);
    quill.container.style.position = 'relative';
    quill.container.appendChild(cursorEl);
  } else {
    flagEl = cursorEl.querySelector('.remote-cursor-flag');
  }

  cursorEl.style.top = `${bounds.top}px`;
  cursorEl.style.left = `${bounds.left}px`;
  cursorEl.style.height = `${bounds.height}px`;
  cursorEl.style.backgroundColor = cursorColor;
  flagEl.style.backgroundColor = cursorColor;

  if (avatar) {
    flagEl.innerHTML = `
      <img src="${avatar}" alt="${userName}" style="
        width: 16px; height: 16px; border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.3); object-fit: cover;
      ">
      ${userName || 'User'}
    `;
  } else {
    flagEl.textContent = userName || 'User';
  }
}

// ============================================================
// MAIN WRAPPER COMPONENT
// ============================================================
export default function EditingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { socket } = useSocket();
  const { toasts, showToast, dismissToast } = useToasts();

  const { doc, docUserRole } = useDocumentLoader(id, socket, navigate, showToast, user);
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

  return (
    <>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      {!localDoc ? (
        <div className="min-h-screen bg-[#F7FAFF] dark:bg-[#070B14] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D6EFD]" />
        </div>
      ) : (
        <EditingPageContent
          document={localDoc}
          theme={theme}
          toggleTheme={toggleTheme}
          onBack={() => navigate('/dashboard')}
          onSave={handleSave}
          docUserRole={docUserRole}
          docId={id}
          showToast={showToast}
        />
      )}
    </>
  );
}

// ============================================================
// EDITING PAGE CONTENT
// ============================================================
function EditingPageContent({
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

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'System', text: 'Welcome to the collaborative editor!', time: new Date().toLocaleTimeString(), type: 'received' },
  ]);
  const [chatInputText, setChatInputText] = useState('');

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState(DOCUMENT_ROLES.VIEWER);
  const [copied, setCopied] = useState(false);

  // Insert Tab States
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [hoverTableSize, setHoverTableSize] = useState({ rows: 0, cols: 0 });
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

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
  });
  const quillInstance = quillInstanceRef.current;

  // ---- Insert Tab Handlers ----
  const handleInsertTable = (rows, cols) => {
    if (!quillInstance) return;
    const tableModule = quillInstance.getModule('table');
    if (tableModule) {
      tableModule.insertTable(rows, cols);
      showToast(`Inserted a ${rows}x${cols} table`, 'success');
    } else {
      showToast('Table module not loaded', 'warning');
    }
  };

  const handleInsertImage = () => {
    if (!quillInstance) return;
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const range = quillInstance.getSelection(true);
        quillInstance.insertEmbed(range.index, 'image', e.target.result);
        quillInstance.setSelection(range.index + 1);
        showToast('Image inserted successfully', 'success');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleInsertLink = (url) => {
    if (!quillInstance || !url.trim()) return;
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }
    const range = quillInstance.getSelection();
    if (range && range.length > 0) {
      quillInstance.format('link', formattedUrl);
      showToast('Link added to selected text', 'success');
    } else {
      const selection = quillInstance.getSelection(true);
      quillInstance.insertText(selection.index, formattedUrl, 'link', formattedUrl);
      quillInstance.setSelection(selection.index + formattedUrl.length);
      showToast('Link inserted', 'success');
    }
    setShowLinkPopover(false);
    setLinkUrl('');
  };

  const handleInsertPageBreak = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection(true);
    quillInstance.insertEmbed(range.index, 'pagebreak', true);
    quillInstance.insertText(range.index + 1, '\n');
    quillInstance.setSelection(range.index + 2);
    showToast('Page break inserted', 'success');
  };

  const handleInsertDivider = () => {
    if (!quillInstance) return;
    const range = quillInstance.getSelection(true);
    quillInstance.insertEmbed(range.index, 'divider', true);
    quillInstance.insertText(range.index + 1, '\n');
    quillInstance.setSelection(range.index + 2);
    showToast('Horizontal line inserted', 'success');
  };

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
    setComments((prev) => [{ id: Date.now(), author: 'You', text: newCommentText, time: 'Just now' }, ...prev]);
    setNewCommentText('');
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
        showTablePicker={showTablePicker}
        setShowTablePicker={setShowTablePicker}
        hoverTableSize={hoverTableSize}
        setHoverTableSize={setHoverTableSize}
        showLinkPopover={showLinkPopover}
        setShowLinkPopover={setShowLinkPopover}
        linkUrl={linkUrl}
        setLinkUrl={setLinkUrl}
        onInsertTable={handleInsertTable}
        onInsertImage={handleInsertImage}
        onInsertLink={handleInsertLink}
        onInsertPageBreak={handleInsertPageBreak}
        onInsertDivider={handleInsertDivider}
        quillInstance={quillInstance}
        setRightTab={setRightTab}
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
          // otherUser={users}
        />
      )}
    </div>
  );
}

// ============================================================
// PRESENTATIONAL SUBCOMPONENTS
// ============================================================

function EditorHeader({
  onBack, autoSaveActive, onToggleAutoSave, canEdit, onUndo, onRedo, canUndo, canRedo,
  title, onTitleChange, docUserRole, theme, toggleTheme, canShare, isEditor, onShareClick,
  activeUsers, currentUser, isMobile,
}) {
  const you = currentUser?.fullName || currentUser?.name || 'You';
  return (
    <header className="editor-header" style={isMobile ? { flexWrap: 'wrap', gap: '8px' } : undefined}>
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
              <button onClick={onUndo} disabled={!canUndo} style={{ opacity: canUndo ? 1 : 0.4 }} title="Undo (Ctrl+Z)"><FaUndo size={14} /></button>
              <button onClick={onRedo} disabled={!canRedo} style={{ opacity: canRedo ? 1 : 0.4 }} title="Redo (Ctrl+Y)"><FaRedo size={14} /></button>
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
            style={isMobile ? { maxWidth: '120px' } : undefined}
          />
          {!isMobile && <span className="word-file-extension">- Word</span>}
          <span className="word-title-cloud-status" title="Saved to Cloud">
            <FaCloud size={14} style={{ color: 'var(--accent)' }} />
          </span>
          {!isMobile && <span className="doc-role-badge">{docUserRole}</span>}
        </div>
      </div>

      {!isMobile && (
        <div className="editor-header-center">
          <div className="word-header-search">
            <FaSearch size={14} className="search-glass-icon" />
            <input type="text" placeholder="Search (Alt+Q)" disabled />
          </div>
        </div>
      )}

      <div className="editor-header-right">
        <div className="avatar-stack">
          <div className="avatar-item" style={{ backgroundColor: 'var(--accent)' }} data-tooltip={you}>
            {
              currentUser.avatar ? <img src={currentUser?.avatar} alt="" className='rounded-full h-8 w-full' />  :  <p>{you.charAt(0).toUpperCase()} </p>
            }
          </div>
          {activeUsers.map((u) => (
            <div
              key={u._id}
              className="avatar-item"
              style={{ backgroundColor: colorForUserId(u._id) }}
              data-tooltip={u.fullName }
            >
              {
              u?.avatar ? <img src={u?.avatar} alt="" className='rounded-full h-8 w-full' />  :  <p>{u.fullName.charAt(0).toUpperCase()} </p>
            }
            </div>
          ))}
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
            <LuShare2 size={16} /> {!isMobile && 'Share'}
          </button>
        ) : (
          <button
            className="btn-primary"
            disabled
            style={{ opacity: 0.4, cursor: 'not-allowed' }}
            title={isEditor ? 'Only document Owners can share' : 'You have read-only access'}
          >
            <LuShare2 size={16} /> {!isMobile && 'Share'}
          </button>
        )}
      </div>
    </header>
  );
}

function RibbonTabsBar({
  activeRibbonTab, setActiveRibbonTab, theme, isMobile,
}) {
  return (
    <div
      className="word-ribbon-tabs-bar"
      style={isMobile ? { overflowX: 'auto', WebkitOverflowScrolling: 'touch', flexWrap: 'nowrap' } : undefined}
    >
      <button className="ribbon-tab-header-btn" onClick={() => alert(STATIC_MENU_ALERTS.file)}>File</button>
      {RIBBON_TABS.map((tab) => (
        <button
          key={tab}
          className={`ribbon-tab-header-btn ${activeRibbonTab === tab ? 'active' : ''}`}
          onClick={() => setActiveRibbonTab(tab)}
          style={{ whiteSpace: 'nowrap' }}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
      <button className="ribbon-tab-header-btn" onClick={() => alert(STATIC_MENU_ALERTS.references)}>References</button>
      <button className="ribbon-tab-header-btn" onClick={() => alert(STATIC_MENU_ALERTS.mailings)}>Mailings</button>
      <button className="ribbon-tab-header-btn" onClick={() => alert(STATIC_MENU_ALERTS.help)}>Help</button>
      {theme && null}
    </div>
  );
}

function RibbonToolbar({
  activeRibbonTab, canEdit, formatPainterActive, onFormatPainterClick, onGrowFont, onShrinkFont,
  onParagraphShading, onApplyStyle, onOpenFind, onOpenReplace, onShowStats,
  leftSidebarCollapsed, setLeftSidebarCollapsed, rightSidebarCollapsed, setRightSidebarCollapsed,
  accentColor, onApplyAccentColor, theme, toggleTheme, pageLayout, setPageLayout, isMobile,
  showTablePicker, setShowTablePicker, hoverTableSize, setHoverTableSize,
  showLinkPopover, setShowLinkPopover, linkUrl, setLinkUrl,
  onInsertTable, onInsertImage, onInsertLink, onInsertPageBreak, onInsertDivider,
  quillInstance, setRightTab, showToast,
}) {
  return (
    <div
      id="word-ribbon-toolbar"
      className="word-ribbon-toolbar-panel"
      style={isMobile ? { overflowX: 'auto', WebkitOverflowScrolling: 'touch' } : undefined}
    >
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
        <InsertRibbon
          canEdit={canEdit}
          quillInstance={quillInstance}
          onInsertTable={onInsertTable}
          onInsertImage={onInsertImage}
          onInsertLink={onInsertLink}
          onInsertPageBreak={onInsertPageBreak}
          onInsertDivider={onInsertDivider}
          rightSidebarCollapsed={rightSidebarCollapsed}
          setRightSidebarCollapsed={setRightSidebarCollapsed}
          setRightTab={setRightTab}
          showToast={showToast}
          isMobile={isMobile}
        />
      </div>

      {/* DESIGN TAB */}
      <div className={`ribbon-tab-content ${activeRibbonTab === 'design' ? 'visible' : 'hidden'}`}>
        <div className="ribbon-group">
          <div className="ribbon-controls-container">
            <div className="ribbon-buttons-row" style={{ gap: '6px' }}>
              {ACCENT_SWATCHES.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => onApplyAccentColor(hex)}
                  title={`Use ${hex} as accent color`}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: hex,
                    border: accentColor === hex ? '2px solid var(--text, #111)' : '1px solid rgba(0,0,0,0.15)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
          <span className="ribbon-group-label">Accent Color</span>
        </div>
        <div className="ribbon-group-separator" />
        <div className="ribbon-group">
          <div className="ribbon-controls-container">
            <button type="button" className="ribbon-custom-btn" onClick={toggleTheme}>
              {theme === 'dark' ? <FaSun size={16} style={{ marginRight: '6px' }} /> : <FaMoon size={16} style={{ marginRight: '6px' }} />}
              <span>{theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>
          </div>
          <span className="ribbon-group-label">Theme</span>
        </div>
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

function SidebarToggle({
  side, collapsed, onClick, isMobile,
}) {
  const Icon = collapsed ? FaPlus : LuX;
  const style = side === 'left'
    ? { left: collapsed ? '8px' : (isMobile ? 'calc(85vw + 8px)' : '268px'), transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }
    : { right: collapsed ? '8px' : (isMobile ? 'calc(85vw + 8px)' : '268px'), transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)' };

  return (
    <div style={{
      position: 'absolute', top: '12px', zIndex: 1600, ...style,
    }}
    >
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

function LeftSidebar({
  collapsed, leftTab, setLeftTab, outline, onOutlineClick, canEdit, history, isMobile,
}) {
  const mobileStyle = (!collapsed && isMobile)
    ? {
      position: 'fixed', top: 0, bottom: 0, left: 0, width: '85vw', maxWidth: '320px', zIndex: 1500, boxShadow: '0 0 24px rgba(0,0,0,0.35)',
    }
    : undefined;

  return (
    <aside className={`editor-sidebar left-sidebar ${collapsed ? 'collapsed' : ''}`} style={mobileStyle}>
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
  comments, newCommentText, setNewCommentText, onAddComment, isMobile,
}) {
  const mobileStyle = (!collapsed && isMobile)
    ? {
      position: 'fixed', top: 0, bottom: 0, right: 0, width: '85vw', maxWidth: '320px', zIndex: 1500, boxShadow: '0 0 24px rgba(0,0,0,0.35)',
    }
    : undefined;

  return (
    <aside className={`editor-sidebar right-sidebar ${collapsed ? 'collapsed' : ''}`} style={mobileStyle}>
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

function StatusBar({
  wordCount, isSyncing, zoomPercent, setZoomPercent, isMobile,
}) {
  return (
    <footer className="word-status-bar" style={isMobile ? { flexWrap: 'wrap', gap: '6px', fontSize: '11px' } : undefined}>
      <div className="status-bar-left">
        <span>Page 1 of 1</span>
        <span className="status-bar-separator">|</span>
        <span>{wordCount} words</span>
        {!isMobile && (
          <>
            <span className="status-bar-separator">|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <LuCheck size={12} style={{ color: '#10b981' }} /> Spelling: Checked
            </span>
            <span className="status-bar-separator">|</span>
            <span>English (India)</span>
            <span className="status-bar-separator">|</span>
            <span>Accessibility: Good to go</span>
          </>
        )}
      </div>
      <div className="status-bar-center">
        <div className={`sync-badge ${isSyncing ? 'syncing' : ''}`} style={{ border: 'none', background: 'transparent', padding: 0 }}>
          <span className="sync-dot" />
          <span>{isSyncing ? 'AutoSave: Syncing...' : 'Saved to Cloud'}</span>
        </div>
      </div>
      <div className="status-bar-right">
        {!isMobile && (
          <>
            <button
              type="button"
              className="status-bar-btn"
              onClick={() => alert('Focus Mode activated! Enjoy distraction-free writing.')}
              style={{
                background: 'transparent', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer',
              }}
            >
              Focus
            </button>
            <span className="status-bar-separator">|</span>
          </>
        )}
        <button onClick={() => setZoomPercent((p) => Math.max(50, p - 10))} className="zoom-btn" title="Zoom Out">-</button>
        {!isMobile && (
          <input
            type="range"
            min="50"
            max="150"
            value={zoomPercent}
            onChange={(e) => setZoomPercent(Number(e.target.value))}
            className="zoom-slider"
            title="Zoom slider"
          />
        )}
        <button onClick={() => setZoomPercent((p) => Math.min(150, p + 10))} className="zoom-btn" title="Zoom In">+</button>
        <span style={{ fontWeight: 600, width: '36px', textAlign: 'right' }}>{zoomPercent}%</span>
      </div>
    </footer>
  );
}

function ShareModal({
  onClose, shareEmail, setShareEmail, shareRole, setShareRole, onInvite, docId, copied, onCopyLink,
}) {
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        zIndex: 3000, padding: '20px',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <style>{`
        @keyframes shareModalPopIn { 
          from { opacity: 0; transform: scale(0.94) translateY(12px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-card::-webkit-scrollbar {
          width: 6px;
        }
        .modal-card::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .modal-card::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        .modal-card::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%);
        }
      `}</style>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '16px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.35), 0 10px 30px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'shareModalPopIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          padding: '0',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        {/* Header with gradient */}
        <div className="modal-header" style={{
          padding: '24px 32px 16px 32px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px 16px 0 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-60%',
            left: '-10%',
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />
          <div className="flex gap-4" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <img src={ATHENURA_CIRCLE_IMAGE} alt="" className='h-8 w-8' />
              <h3 className="modal-title" style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
                letterSpacing: '-0.01em'
              }}>Share Workspace</h3>
            </div>
            <button 
              className="modal-close" 
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: 'white',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <p style={{
            margin: '6px 0 0 0',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.85)',
            position: 'relative',
            zIndex: 1,
            fontWeight: '400'
          }}>
            INVITE ON REAL TIME COLLABORATION DOCUMENT SYSTEM
          </p>
        </div>
        
        <div className="modal-body" style={{ padding: '28px 32px 32px 32px' }}>
          <div className="form-group" style={{ marginTop: '0' }}>
            <label className="form-label" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Invite User Email
              </span>
            </label>
            
            <div className="form-input-row" style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: '0',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s',
              background: 'white'
            }}>
              <input
                type="email"
                className="form-input"
                style={{
                  flex: '1',
                  padding: '12px 16px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#1e293b',
                  backgroundColor: 'transparent',
                  transition: 'all 0.2s',
                  minWidth: '0',
                }}
                placeholder="user@organization.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                onFocus={(e) => {
                  e.currentTarget.parentElement.style.borderColor = '#667eea';
                  e.currentTarget.parentElement.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.15), 0 1px 3px rgba(0,0,0,0.06)';
                }}
                onBlur={(e) => {
                  e.currentTarget.parentElement.style.borderColor = '#e2e8f0';
                  e.currentTarget.parentElement.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                }}
              />
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 4px',
                background: '#f8fafc',
                borderLeft: '1px solid #e2e8f0',
                borderRight: '1px solid #e2e8f0',
              }}>
                <select 
                  className="form-select"
                  style={{
                    padding: '11px 28px 11px 14px',
                    border: 'none',
                    background: 'transparent',
                    color: '#1e293b',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    outline: 'none',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    minWidth: '110px',
                  }}
                  value={shareRole} 
                  onChange={(e) => setShareRole(e.target.value)}
                >
                  <option value={DOCUMENT_ROLES.OWNER} style={{ fontWeight: '600', color: '#7c3aed' }}><FaCrown className='h-10' />Owner</option>
                  <option value={DOCUMENT_ROLES.EDITOR} style={{ fontWeight: '500', color: '#2563eb' }}><FaPencilAlt/> Editor</option>
                  <option value={DOCUMENT_ROLES.VIEWER} style={{ fontWeight: '400', color: '#64748b' }}><FaEye/> Viewer</option>
                </select>
              </div>
              
              <button 
                className="btn-primary"
                onClick={onInvite}
                style={{
                  padding: '24px 24px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.96)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                <span>Invite</span>
              </button>
            </div>
            
            {/* Helper text with icon */}
            <div style={{
              marginTop: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px 14px',
              background: 'linear-gradient(135deg, #f0f4ff 0%, #faf0ff 100%)',
              borderRadius: '8px',
              border: '1px solid #e8edff'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#475569',
                lineHeight: '1.5'
              }}>
                <strong style={{ color: '#667eea' }}>Tip:</strong> Enter the email address of the person you'd like to invite. They'll receive an email with access instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

