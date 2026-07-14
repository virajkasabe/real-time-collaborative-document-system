export const PAGE_LAYOUTS = {
  narrow: { label: 'Narrow', maxWidth: '680px' },
  normal: { label: 'Normal', maxWidth: '816px' },
  wide: { label: 'Wide', maxWidth: '1000px' },
};

export const STYLE_CARDS = [
  { type: 'normal', label: 'Normal', preview: 'AaBbCc', style: {} },
  { type: 'title', label: 'Title', preview: 'Title', style: { fontWeight: 'bold' } },
  { type: 'heading1', label: 'Heading 1', preview: 'Heading 1', style: { color: 'var(--accent)', fontWeight: '600' } },
  { type: 'heading2', label: 'Heading 2', preview: 'Heading 2', style: { color: 'var(--accent)', fontWeight: '500' } },
  { type: 'subtitle', label: 'Subtitle', preview: 'Sub', style: { fontStyle: 'italic' } },
];

export const ACCENT_SWATCHES = ['#0D6EFD', '#7C3AED', '#DC2626', '#059669', '#EA580C', '#0891B2'];

export const RIBBON_TABS = ['home', 'insert', 'design', 'layout', 'review', 'view'];


export const STATIC_MENU_ALERTS = {
  file: 'File Options:\n- Back to Dashboard\n- Document is auto-saved locally.',
  references: 'References Ribbon: Heading indexes are automatically built.',
  mailings: 'Mailings Ribbon: Collaborative share triggers are active.',
  help: 'Help Ribbon: Contact Antigravity AI for developer notes.',
};

export const SIMULATED_TEAM_REPLIES = [
  'That looks perfect! The structure flows really well.',
  'Oh nice, I see you updated the main objectives block.',
  'Makes sense! I will check the proposal outlines again.',
  'Let me know when you need my review on the setup notes.',
  'Awesome! The live outline widget is matching perfectly.',
  'Should we add another section describing our REST endpoint specs?',
];
export const SIMULATED_TEAM_MEMBERS = ['Lisa Chen', 'Alex Johnson', 'Team Member'];

export const FONT_SIZE_GROW = { small: 'medium', medium: 'large', large: 'huge', huge: 'huge' };
export const FONT_SIZE_SHRINK = { huge: 'large', large: 'medium', medium: 'small', small: 'small' };

// Auto Save
export const AUTOSAVE_DEBOUNCE_MS = 1000;

// Cursor
export const CURSOR_SEND_DEBOUNCE_MS = 30;
export const TYPING_CURSOR_BROADCAST_DEBOUNCE_MS = 30;
export const REMOTE_CURSOR_TTL_MS = 1500;

// Title
export const TITLE_SAVE_DEBOUNCE_MS = 500;

// UI
export const TOAST_DURATION_MS = 1500;
export const MOBILE_BREAKPOINT = 768;

// History
export const MAX_UNDO_STACK = 100;;

export const CURSOR_COLOR_PALETTE = ['#FF6B6B', '#4ECDC4', '#45AAF2', '#FED330', '#A55EEA', '#26DE81', '#FD9644', '#EB3B5A'];

export const colorForUserId = function (id) {
  const str = String(id || 'anonymous');
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return CURSOR_COLOR_PALETTE[hash % CURSOR_COLOR_PALETTE.length];
}

export const TOAST_ICON = { success: '✅', error: '⛔', warning: '⚠️', info: 'ℹ️' };
export const TOAST_ACCENT = { success: '#26DE81', error: '#EB3B5A', warning: '#FED330', info: '#45AAF2' };


// ============================================================
// CONTENT CONVERSION HELPERS
// ============================================================

export function customDeltaToQuillDelta(customDelta) {
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

export function buildQuillDeltaFromPositionedOps(positionedOps) {
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

export function quillDeltaToCustomDelta(quillDelta) {
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

export function convertDeltaToWireOperations(delta) {
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

export function transformPositionByOperations(position, operations) {
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

export function countWords(text) {
  const trimmed = text.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
}

export function deltaChangesContent(delta) {
  if (!delta?.ops) return false;
  return delta.ops.some((op) => op.insert !== undefined || op.delete !== undefined);
}
