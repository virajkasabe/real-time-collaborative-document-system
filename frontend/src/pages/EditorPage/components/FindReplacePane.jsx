import React from 'react';
import { LuX } from 'react-icons/lu';

export default function FindReplacePane({
  findText, setFindText, replaceText, setReplaceText, onClose, onFindNext, onReplace, onReplaceAll,
}) {
  return (
    <div className="word-find-replace-pane">
      <div className="find-replace-header">
        <span>Find and Replace</span>
        <button className="find-replace-close" onClick={onClose} title="Close Pane">
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
