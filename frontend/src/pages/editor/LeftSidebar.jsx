import { FaHistory } from "react-icons/fa";
import { FaList } from "react-icons/fa6";



export default function LeftSidebar({
  collapsed, leftTab, setLeftTab, outline, onOutlineClick, canEdit, history, isMobile,
}) {
  const mobileStyle = (!collapsed && isMobile)
    ? {
      position: 'fixed', top: 0, bottom: 0, left: 0, width: '85vw', maxWidth: '320px', zIndex: 1500, boxShadow: '0 0 24px rgba(0,0,0,0.35)',
    }
    : undefined;

  return (
    <aside className={`editor-sidebar left-sidebar ${collapsed ? 'collapsed' : ''}`} style={mobileStyle}>
      <div className="sidebar-header"><span>Navigation Outline</span></div>
      <div className="sidebar-tabs">
        <button className={`sidebar-tab ${leftTab === 'outline' ? 'active' : ''}`} onClick={() => setLeftTab('outline')}>
          <FaList size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Outline
        </button>
        <button className={`sidebar-tab ${leftTab === 'history' ? 'active' : ''}`} onClick={() => setLeftTab('history')}>
          <FaHistory size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> History
        </button>
      </div>
      <div className="sidebar-content">
        {leftTab === 'outline' ? (
          <div className="outline-list">
            {outline.length === 0 ? (
              <div className="outline-empty">
                No headings found.<br />
                {canEdit ? 'Create headings from the Home Styles carousel to populate this outline.' : 'This document has no headings yet.'}
              </div>
            ) : (
              outline.map((item) => (
                <button
                  key={item.id}
                  className={`outline-item ${item.level}`}
                  onClick={() => onOutlineClick(item.id)}
                  title={`Scroll to ${item.text}`}
                >
                  {item.text}
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="timeline">
            {history.map((h) => (
              <div key={h.id} className={`timeline-item ${h.active ? 'active' : ''}`}>
                <div className="timeline-dot" />
                <div className="timeline-time">{h.time}</div>
                <div className="timeline-author">{h.author}</div>
                <div className="timeline-desc">{h.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

