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
import { FaCrown } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { fetchDoc, inviteCollab } from '../apis/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import { documentService } from '../services/documentService';
import { 
  CURSOR_EVENT, 
  DOCUMENT_EVENT, 
  DOCUMENT_ROLES 
} from '../utils/constants';

import {
  FaBookOpen, FaCheck, FaChevronLeft, FaCloud, FaHistory,
  FaList, FaMoon, FaPlus, FaRedo, FaSearch, FaSun, FaUndo, FaUsers, FaUserSecret,
} from 'react-icons/fa';

import {
  LuCheck, LuMessageSquare, LuRefreshCw, LuSend, LuShare2, LuX
  } from 'react-icons/lu';

import { randomUser } from '../../public';
import { ATHENURA_CIRCLE_IMAGE } from '../assets';
import CommentPopup from './editor/CommentPopup';
import EditorHeader from './editor/EditorHeader';
import ShareModal from './editor/ShareModal';
import StatusBar from './editor/StatusBar';
import RightSidebar from './editor/RightSidebar';
import RibbonToolbar from './editor/RibbonToolbar';
import { 
  AUTOSAVE_DEBOUNCE_MS, 
  colorForUserId, 
  CURSOR_COLOR_PALETTE, 
  CURSOR_SEND_DEBOUNCE_MS, 
  MAX_UNDO_STACK, 
  MOBILE_BREAKPOINT, 
  OPERATION_DEDUPE_WINDOW_MS, 
  PAGE_LAYOUTS, 
  TOAST_ACCENT,
  TOAST_ICON, 
  TYPING_CURSOR_BROADCAST_DEBOUNCE_MS
 } from '../utils/editingpage.helper';
import LeftSidebar from './editor/LeftSidebar';
import SidebarToggle from './editor/SidebarToggle';
import RibbonTabsBar from './editor/RibbonTabsBar';
import FindReplacePane from './editor/FindReplacePane';
import useToasts from '../hooks/useIsMobil';
import useIsMobile from '../hooks/useToasts';



// ============================================================
// CONTENT CONVERSION HELPERS
// ============================================================

function customDeltaToQuillDelta(customDelta) {
  if (!customDelta) return { ops: [{ insert: '' }] };
  if (typeof customDelta === 'string') return { ops: [{ insert: customDelta }] };
  if (!customDelta.ops || !Array.isArray(customDelta.ops)) return { ops: [{ insert: '' }] };

  const pureQuillOps = [];
  const positionedOps = [];

  for (const op of customDelta.ops) {
    if (op.text !== undefined && op.position !== undefined) {
      positionedOps.push({ text: op.text, position: op.position, attributes: op.attributes || {} });
    } else if (op.insert !== undefined && op.position !== undefined) {
      positionedOps.push({ text: op.insert, position: op.position, attributes: op.attributes || {} });
    } else if (op.insert !== undefined) {
      pureQuillOps.push(op);
    }
  }

  if (positionedOps.length === 0 && pureQuillOps.length > 0) return { ops: pureQuillOps };
  if (positionedOps.length > 0) return buildQuillDeltaFromPositionedOps(positionedOps);
  return { ops: [{ insert: '' }] };
}

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
  }
  return Math.max(0, pos);
}

function countWords(text) {
  const trimmed = text.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
}

function deltaChangesContent(delta) {
  if (!delta?.ops) return false;
  return delta.ops.some((op) => op.insert !== undefined || op.delete !== undefined);
}


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
// ============================================================
function useDocumentLoader(id, socket, navigate, showToast, currentUser) {
  const [doc, setDoc] = useState(null);
  const [docUserRole, setDocUserRole] = useState(null);

  useEffect(() => {
    if (!socket) return undefined;

    const loadDocument = async () => {
      try {
        const response = await fetchDoc(id);
        const responseData = response.data.data;
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
      if (data?.user?._id === currentUser?._id) return;
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
// ============================================================
function useCollaborativeQuill({
  quillRef, doc, docId, canEdit, socket, user, title, onSave, onOutlineChange, onWordCountChange, onSyncingChange,
}) {
  const quillInstanceRef = useRef(null);
  const [remoteCursors, setRemoteCursors] = useState({});
  const remoteCursorsRef = useRef({});

  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const isApplyingHistoryRef = useRef(false);
  const performUndoRef = useRef(() => {});
  const performRedoRef = useRef(() => {});
  const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });

  useEffect(() => {
    if (!quillRef.current || quillInstanceRef.current) return undefined;

    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      modules: {
        toolbar: '#word-ribbon-toolbar',
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
      placeholder: canEdit ? 'Start writing your document here...' : 'This document is read-only.',
    });
    quillInstanceRef.current = quill;
    if (!canEdit) quill.disable();

    loadInitialContent(quill, doc.content);

    let saveTimeoutId = null;
    let selectionCursorTimeoutId = null;
    let typingCursorTimeoutId = null;
    let isSendingOperation = false;

    const updateHistoryState = () => setHistoryState({
      canUndo: undoStackRef.current.length > 0,
      canRedo: redoStackRef.current.length > 0,
    });

    performUndoRef.current = () => {
      if (!canEdit || undoStackRef.current.length === 0) return;
      const entry = undoStackRef.current.pop();
      isApplyingHistoryRef.current = true;
      quill.updateContents(entry.undo, Quill.sources.USER);
      isApplyingHistoryRef.current = false;
      redoStackRef.current.push(entry);
      updateHistoryState();
    };

    performRedoRef.current = () => {
      if (!canEdit || redoStackRef.current.length === 0) return;
      const entry = redoStackRef.current.pop();
      isApplyingHistoryRef.current = true;
      quill.updateContents(entry.redo, Quill.sources.USER);
      isApplyingHistoryRef.current = false;
      undoStackRef.current.push(entry);
      updateHistoryState();
    };

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
        avatar: user.avatar || randomUser,
        position,
        selection: selection || { index: position, length: 0 },
        color: colorForUserId(user._id || user.id),
        timestamp: Date.now(),
      });
    };

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

    const handleTextChange = (delta, oldContents, source) => {
      if (source === 'silent') return;

      if (!isApplyingHistoryRef.current && deltaChangesContent(delta)) {
        const invertDelta = delta.invert(oldContents);
        undoStackRef.current.push({ undo: invertDelta, redo: delta });
        if (undoStackRef.current.length > MAX_UNDO_STACK) undoStackRef.current.shift();
        redoStackRef.current = [];
        updateHistoryState();
      }

      onOutlineChange();
      const words = countWords(quill.getText());
      onWordCountChange(words);

      const operations = convertDeltaToWireOperations(delta);
      if (operations.length > 0) {
        sendOperations(operations);
        repositionRemoteCursors(operations);
      }

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
          color: colorForUserId(user._id || user.id),
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
      undoStackRef.current = [];
      redoStackRef.current = [];

      Object.keys(remoteCursorsRef.current).forEach((uid) => document.getElementById(`cursor-${uid}`)?.remove());
      remoteCursorsRef.current = {};
      if (window.cursorTimeouts) {
        Object.values(window.cursorTimeouts).forEach(clearTimeout);
        window.cursorTimeouts = {};
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, docId, onSave, title, user, socket, canEdit]);

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
      {commentPopup.visible && (
        <CommentPopup
          position={commentPopup.position}
          selectedText={commentPopup.selectedText}
          onSubmit={handleCommentFromPopup}
          onClose={() => setCommentPopup(prev => ({ ...prev, visible: false }))}
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
        />
      )}
    </div>
  );
}


