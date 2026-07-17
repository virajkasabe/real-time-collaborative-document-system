import { useCallback, useEffect, useRef, useState } from 'react';
import Quill from 'quill';

// Whitelist custom fonts
const Font = Quill.import('formats/font');
Font.whitelist = ['sans-serif', 'serif', 'monospace', 'georgia'];
Quill.register(Font, true);

import { randomUser } from '../../../../public';
import { CURSOR_EVENT, DOCUMENT_EVENT } from '../../../utils/constants';
import {
  AUTOSAVE_DEBOUNCE_MS,
  CURSOR_SEND_DEBOUNCE_MS,
  MAX_UNDO_STACK,
  OPERATION_DEDUPE_WINDOW_MS,
  REMOTE_CURSOR_TTL_MS,
  TYPING_CURSOR_BROADCAST_DEBOUNCE_MS,
} from '../utils/constants';
import {
  colorForUserId,
  loadInitialContent,
  renderRemoteCursorFlag,
  resolveClickPosition,
} from '../utils/cursorHelpers';
import {
  convertDeltaToWireOperations,
  quillDeltaToCustomDelta,
  transformPositionByOperations,
} from '../utils/deltaConversion';
import { countWords, deltaChangesContent } from '../utils/textHelpers';

export default function useCollaborativeQuill({
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
        toolbar: '#quill-hidden-toolbar',
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
      if (!cursorData || !cursorData.userId) return; // ignore malformed/null cursor events
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
      const toolbarEl = document.getElementById('quill-hidden-toolbar');
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
