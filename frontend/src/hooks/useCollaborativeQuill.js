import { useCallback, useEffect, useRef, useState } from "react";
import { CURSOR_EVENT, DOCUMENT_EVENT } from "../utils/constants";
import Quill from "quill";
import { AUTOSAVE_DEBOUNCE_MS, colorForUserId, convertDeltaToWireOperations, countWords, CURSOR_SEND_DEBOUNCE_MS, customDeltaToQuillDelta, deltaChangesContent, MAX_UNDO_STACK, OPERATION_DEDUPE_WINDOW_MS, quillDeltaToCustomDelta, REMOTE_CURSOR_TTL_MS, TYPING_CURSOR_BROADCAST_DEBOUNCE_MS } from "../utils/editingpage.helper";
import { randomUser } from '../../public/index'

 
export function useCollaborativeQuill({
  quillRef, doc, docId, canEdit, socket, user, title, onSave, onOutlineChange, onWordCountChange, onSyncingChange, params
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
      if(cursorData.docId !== params.id) return {}      
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

export function loadInitialContent(quill, content) {
  try {
    if (content) {
      quill.setContents(customDeltaToQuillDelta(content));
    }
  } catch (error) {
    console.error('Error setting initial content:', error);
    if (typeof content === 'string') quill.clipboard.dangerouslyPasteHTML(content);
  }
}

export function resolveClickPosition(quill, _event) {
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

export function renderRemoteCursorFlag(quill, cursorData) {
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