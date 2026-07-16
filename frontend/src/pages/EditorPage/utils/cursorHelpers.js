import { CURSOR_COLOR_PALETTE } from './constants';
import { customDeltaToQuillDelta } from './deltaConversion';

export function colorForUserId(id) {
  const str = String(id || 'anonymous');
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return CURSOR_COLOR_PALETTE[hash % CURSOR_COLOR_PALETTE.length];
}

// Updates an existing cursor flag's position/color/label in place instead of
// removing and recreating the DOM node on every single update. The old
// remove-then-recreate approach caused a visible flash/flutter on every
// keystroke from a remote collaborator; reusing the node plus a short CSS
// transition makes the flag glide smoothly to its new position instead.
export function renderRemoteCursorFlag(quill, cursorData) {
  if (!cursorData) return;
  const {
    userId, userName, position, color, avatar,
  } = cursorData;
  if (!userId || position == null) return; // bail if essential fields missing

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
