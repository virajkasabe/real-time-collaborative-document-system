import { FaRedo, FaSearch, FaUndo } from "react-icons/fa";
import { FaChevronLeft, FaCloud, FaMoon, FaSun } from "react-icons/fa6";
import { LuRefreshCw, LuShare2 } from "react-icons/lu";
import { colorForUserId } from '../../utils/editingpage.helper'


export default function EditorHeader({
  onBack, autoSaveActive, onToggleAutoSave, canEdit, onUndo, onRedo, canUndo, canRedo,
  title, onTitleChange, docUserRole, theme, toggleTheme, canShare, isEditor, onShareClick,
  activeUsers, currentUser, isMobile,
}) {
  const you = currentUser?.fullName || currentUser?.name || 'You';
  return (
    <header className="editor-header" style={isMobile ? { flexWrap: 'wrap', gap: '8px' , zIndex:"100" } : undefined}>
      <div className="editor-header-left">
        <button className="sidebar-toggle-btn" onClick={onBack} title="Back to Dashboard">
          <FaChevronLeft size={20} />
        </button>
        <div className="quick-access-icons">
          <button
            className={`autosave-toggle ${autoSaveActive ? 'active' : ''}`}
            onClick={onToggleAutoSave}
            title={`AutoSave is ${autoSaveActive ? 'ON' : 'OFF'}`}
          >
            <LuRefreshCw size={14} className={autoSaveActive ? 'rotating-slow' : ''} />
            <span className="autosave-label">AutoSave</span>
          </button>
          {canEdit && (
            <>
              <button onClick={onUndo} disabled={!canUndo} style={{ opacity: canUndo ? 1 : 0.4 }} title="Undo (Ctrl+Z)"><FaUndo size={14} /></button>
              <button onClick={onRedo} disabled={!canRedo} style={{ opacity: canRedo ? 1 : 0.4 }} title="Redo (Ctrl+Y)"><FaRedo size={14} /></button>
            </>
          )}
        </div>
        <div className="doc-title-container">
          <input
            type="text"
            className="doc-title-input"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Untitled Document"
            disabled={!canEdit}
            title={canEdit ? 'Edit document title' : 'You do not have edit access'}
            style={isMobile ? { maxWidth: '120px' } : undefined}
          />
          {!isMobile && <span className="word-file-extension">- Word</span>}
          <span className="word-title-cloud-status" title="Saved to Cloud">
            <FaCloud size={14} style={{ color: 'var(--accent)' }} />
          </span>
          {!isMobile && <span className="text-center text-[14px] text-yellow-400">{docUserRole}</span>}
        </div>
      </div>

      {!isMobile && (
        <div className="editor-header-center">
          <div className="word-header-search">
            <FaSearch size={14} className="search-glass-icon" />
            <input type="text" placeholder="Search (Alt+Q)" disabled />
          </div>
        </div>
      )}

      <div className="editor-header-right">
        <div className="avatar-stack">
          <div className="avatar-item" style={{ backgroundColor: 'var(--accent)' }} data-tooltip={you}>
            {
              currentUser.avatar ? <img src={currentUser?.avatar} alt="" className='rounded-full h-8 w-full z-50' />  :  <p>{you.charAt(0).toUpperCase()} </p>
            }
          </div>
          {activeUsers.map((u) => (
            <div
              key={u._id}
              className="avatar-item"
              style={{ backgroundColor: colorForUserId(u._id) , zIndex : 10000 }}
              data-tooltip={u.fullName }
            >
              {
              u?.avatar ? <img src={u?.avatar} alt="" className='rounded-full h-8 w-full' />  :  <p>{u.fullName.charAt(0).toUpperCase()} </p>
            }
            </div>
          ))}
        </div>
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{ marginRight: '8px' }}
        >
          {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>
        {canShare ? (
          <button className="btn-primary" onClick={onShareClick}>
            <LuShare2 size={16} /> {!isMobile && 'Share'}
          </button>
        ) : (
          <button
            className="btn-primary"
            disabled
            style={{ opacity: 0.4, cursor: 'not-allowed' }}
            title={isEditor ? 'Only document Owners can share' : 'You have read-only access'}
          >
            <LuShare2 size={16} /> {!isMobile && 'Share'}
          </button>
        )}
      </div>
    </header>
  );
}