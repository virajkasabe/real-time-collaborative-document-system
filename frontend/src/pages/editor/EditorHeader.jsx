import { FaRedo, FaSearch, FaUndo, FaUsers } from "react-icons/fa";
import { FaChevronLeft, FaCloud, FaMoon, FaSun } from "react-icons/fa6";
import { LuRefreshCw, LuShare2 } from "react-icons/lu";
import { colorForUserId } from '../../utils/editingpage.helper';
import { ATHENURA_CIRCLE_IMAGE } from '../../assets';

export default function EditorHeader({
  onBack, autoSaveActive, onToggleAutoSave, canEdit, onUndo, onRedo, canUndo, canRedo,
  title, onTitleChange, docUserRole, theme, toggleTheme, canShare, isEditor, onShareClick,
  onToggleCollaborators, activeUsers, currentUser, isMobile,
}) {
  const you = currentUser?.fullName || currentUser?.name || 'You';
  const isDark = theme === 'dark';

  return (
    <header
      className="editor-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        height: '52px',
        background: isDark ? '#161b27' : '#ffffff',
        color: isDark ? '#ffffff' : '#0f172a',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0',
        flexShrink: 0,
        transition: 'background 0.2s ease, border-color 0.2s ease',
        ...(isMobile ? { flexWrap: 'wrap', gap: '8px', zIndex: '100', height: 'auto' } : {})
      }}
    >
      {/* Left: logo + back + autosave + undo + redo + title */}
      <div className="editor-header-left" style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: '0 0 auto' }}>
        <img
          src={ATHENURA_CIRCLE_IMAGE}
          alt="Athenura"
          onClick={onBack}
          title="Back to Dashboard"
          style={{
            height: '28px',
            width: '28px',
            objectFit: 'contain',
            cursor: 'pointer',
            mixBlendMode: isDark ? 'screen' : 'normal',
          }}
        />
        <button className="sidebar-toggle-btn" onClick={onBack} title="Back to Dashboard" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
          <FaChevronLeft size={18} />
        </button>
        <div className="quick-access-icons" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            className={`autosave-toggle ${autoSaveActive ? 'active' : ''}`}
            onClick={onToggleAutoSave}
            title={`AutoSave is ${autoSaveActive ? 'ON' : 'OFF'}`}
            style={{ color: isDark ? '#ffffff' : '#0f172a' }}
          >
            <LuRefreshCw size={14} className={autoSaveActive ? 'rotating-slow' : ''} />
            <span className="autosave-label">AutoSave</span>
          </button>
          {canEdit && (
            <>
              <button onClick={onUndo} disabled={!canUndo} style={{ opacity: canUndo ? 1 : 0.4, color: isDark ? '#ffffff' : '#0f172a' }} title="Undo (Ctrl+Z)"><FaUndo size={14} /></button>
              <button onClick={onRedo} disabled={!canRedo} style={{ opacity: canRedo ? 1 : 0.4, color: isDark ? '#ffffff' : '#0f172a' }} title="Redo (Ctrl+Y)"><FaRedo size={14} /></button>
            </>
          )}
        </div>
        <div className="doc-title-container" style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <input
            type="text"
            className="doc-title-input"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Untitled Document"
            disabled={!canEdit}
            title={canEdit ? 'Edit document title' : 'You do not have edit access'}
            style={{
              maxWidth: isMobile ? '120px' : '160px',
              color: isDark ? '#ffffff' : '#0f172a',
              background: 'transparent',
              border: 'none',
              fontWeight: 600,
              fontSize: '14px',
            }}
          />
          {!isMobile && <span className="word-file-extension" style={{ whiteSpace: 'nowrap', fontSize: '13px', color: isDark ? '#9ca3af' : '#64748b' }}>- Word</span>}
          <span className="word-title-cloud-status" title="Saved to Cloud">
            <FaCloud size={14} style={{ color: 'var(--accent, #3b82f6)' }} />
          </span>
          {!isMobile && <span className="text-center text-[12px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-medium" style={{ whiteSpace: 'nowrap' }}>{docUserRole}</span>}
        </div>
      </div>

      {/* Center: search */}
      {!isMobile && (
        <div className="editor-header-center" style={{ flex: '1', maxWidth: 480, margin: '0 16px', display: 'flex', justifyContent: 'center' }}>
          <div className="word-header-search" style={{ width: '100%', maxWidth: 360, background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', borderRadius: '6px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaSearch size={14} className="search-glass-icon" style={{ color: isDark ? '#9ca3af' : '#64748b' }} />
            <input type="text" placeholder="Search (Alt+Q)" disabled style={{ background: 'transparent', border: 'none', color: isDark ? '#9ca3af' : '#64748b', fontSize: '13px', width: '100%' }} />
          </div>
        </div>
      )}

      {/* Right: avatar + theme toggle button + collaborators + share */}
      <div className="editor-header-right" style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
        <div className="avatar-stack">
          <div className="avatar-item" style={{ backgroundColor: 'var(--accent, #3b82f6)' }} data-tooltip={you}>
            {currentUser?.avatar ? <img src={currentUser?.avatar} alt="" className="rounded-full h-8 w-full z-50" /> : <p>{you.charAt(0).toUpperCase()}</p>}
          </div>
          {activeUsers.map((u) => (
            <div
              key={u._id}
              className="avatar-item"
              style={{ backgroundColor: colorForUserId(u._id), zIndex: 10000 }}
              data-tooltip={u.fullName}
            >
              {u?.avatar ? <img src={u?.avatar} alt="" className="rounded-full h-8 w-full" /> : <p>{u.fullName?.charAt(0).toUpperCase()}</p>}
            </div>
          ))}
        </div>

        {/* THEME TOGGLE BUTTON — calls toggleTheme from ThemeContext */}
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
            background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
            color: isDark ? '#facc15' : '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '4px',
          }}
        >
          {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>

        {/* Collaborators Button */}
        <button
          type="button"
          onClick={onToggleCollaborators}
          title="Toggle Collaborations Pane"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '6px',
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
            background: isDark ? 'transparent' : '#f1f5f9',
            color: isDark ? '#ffffff' : '#0f172a',
            cursor: 'pointer',
            marginRight: '4px',
          }}
        >
          <FaUsers size={16} /> {!isMobile && 'Collaborators'}
        </button>

        {canShare ? (
          <button className="btn-primary" onClick={onShareClick} style={{ padding: '6px 14px', borderRadius: '6px', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LuShare2 size={16} /> {!isMobile && 'Share'}
          </button>
        ) : (
          <button
            className="btn-primary"
            disabled
            style={{ opacity: 0.4, cursor: 'not-allowed', padding: '6px 14px', borderRadius: '6px', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            title={isEditor ? 'Only document Owners can share' : 'You have read-only access'}
          >
            <LuShare2 size={16} /> {!isMobile && 'Share'}
          </button>
        )}
      </div>
    </header>
  );
}