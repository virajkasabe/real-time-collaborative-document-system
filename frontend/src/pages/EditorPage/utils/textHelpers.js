export function countWords(text) {
  const trimmed = text.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
}

/** True if a text-change delta actually inserts or deletes content, as
 * opposed to only applying formatting (bold, color, alignment, etc). Used to
 * keep undo/redo scoped to real content changes only. */
export function deltaChangesContent(delta) {
  if (!delta?.ops) return false;
  return delta.ops.some((op) => op.insert !== undefined || op.delete !== undefined);
}
