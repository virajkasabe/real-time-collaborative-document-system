import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

export default function ClipboardMenu() {
  const [menuPos, setMenuPos] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleContextMenu = (e) => {
      const selected = window.getSelection().toString().trim();
      if (!selected) return;
      e.preventDefault();
      setMenuPos({ x: e.clientX, y: e.clientY });
    };

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuPos(null);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!menuPos) return null;

  const hasSelection = window.getSelection().toString().trim().length > 0;

  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: menuPos.y,
        left: menuPos.x,
        background: '#1e2a3a',
        border: '1px solid #2e3d50',
        borderRadius: '6px',
        padding: '4px 0',
        zIndex: 9999,
        minWidth: '160px',
      }}
    >
      {['Cut', 'Copy'].map((action) => (
        <button
          key={action}
          disabled={!hasSelection}
          style={{
            display: 'block', width: '100%',
            padding: '7px 16px', background: 'none',
            border: 'none', textAlign: 'left',
            fontSize: '13px',
            color: hasSelection ? '#fff' : '#666',
            opacity: hasSelection ? 1 : 0.4,
            cursor: hasSelection ? 'pointer' : 'not-allowed',
          }}
          onClick={() => {
            document.execCommand(action.toLowerCase());
            setMenuPos(null);
          }}
        >
          {action}
        </button>
      ))}
      <button
        style={{
          display: 'block', width: '100%',
          padding: '7px 16px', background: 'none',
          border: 'none', color: '#fff',
          textAlign: 'left', fontSize: '13px',
          cursor: 'pointer',
        }}
        onClick={() => setMenuPos(null)}
      >
        Format Painter
      </button>
    </div>,
    document.body
  );
}
