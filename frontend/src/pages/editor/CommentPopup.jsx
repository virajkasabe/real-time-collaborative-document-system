import { useEffect, useRef, useState } from "react";
import { LuX } from "react-icons/lu";



export default function CommentPopup({ position, selectedText, onSubmit, onClose }) {
  const [comment, setComment] = useState('');
  const popupRef = useRef(null);

  useEffect(() => {
    // Position the popup relative to the viewport
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      let x = position.x;
      let y = position.y - rect.height - 10;

      // Ensure popup stays within viewport
      if (x + rect.width > window.innerWidth) {
        x = window.innerWidth - rect.width - 10;
      }
      if (x < 10) x = 10;
      if (y < 10) y = position.y + 20;

      popupRef.current.style.left = `${x}px`;
      popupRef.current.style.top = `${y}px`;
    }

    // Focus the textarea
    setTimeout(() => {
      const textarea = popupRef.current?.querySelector('textarea');
      if (textarea) textarea.focus();
    }, 1500);
  }, [position]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  return (
    <div
      ref={popupRef}
      className="comment-popup"
      style={{
        position: 'fixed',
        zIndex: 2000,
        background: 'var(--bg, #ffffff)',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.1)',
        padding: '16px',
        minWidth: '320px',
        maxWidth: '400px',
        border: '1px solid var(--border, #e2e8f0)',
        animation: 'commentPopIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <style>{`
        @keyframes commentPopIn {
          from { opacity: 0; transform: scale(0.9) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '10px',
      }}>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text, #1a202c)',
            marginBottom: '4px',
          }}>
            Add Comment
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--text-muted, #718096)',
            background: 'var(--bg-secondary, #f7fafc)',
            padding: '4px 10px',
            borderRadius: '6px',
            display: 'inline-block',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            "{selectedText.length > 50 ? selectedText.substring(0, 50) + '...' : selectedText}"
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted, #718096)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all 0.2s',
            fontSize: '16px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-hover, #f1f5f9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LuX size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your comment here..."
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '10px 12px',
            border: '2px solid var(--border, #e2e8f0)',
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: 'inherit',
            resize: 'vertical',
            background: 'var(--bg-input, #ffffff)',
            color: 'var(--text, #1a202c)',
            transition: 'border-color 0.2s',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent, #667eea)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border, #e2e8f0)';
          }}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          marginTop: '12px',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 16px',
              border: '1px solid var(--border, #e2e8f0)',
              borderRadius: '6px',
              background: 'transparent',
              color: 'var(--text, #1a202c)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-hover, #f1f5f9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: '6px 20px',
              border: 'none',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
            }}
          >
            Add Comment
          </button>
        </div>
      </form>
    </div>
  );
}