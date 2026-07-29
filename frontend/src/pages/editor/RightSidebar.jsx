import { FaUsers } from "react-icons/fa6";
import { LuMessageSquare, LuSend } from "react-icons/lu";

export default function RightSidebar({
  collapsed, rightTab, setRightTab, chatMessages, chatInputText, setChatInputText, onSendMessage, chatBottomRef,
  comments, newCommentText, setNewCommentText, onAddComment, isMobile,
}) {
  const mobileStyle = (!collapsed && isMobile)
    ? {
      position: 'fixed', top: 0, bottom: 0, right: 0, width: '85vw', maxWidth: '320px', zIndex: 1500, boxShadow: '0 0 24px rgba(0,0,0,0.35)',
    }
    : undefined;

  return (
    <aside className={`editor-sidebar right-sidebar ${collapsed ? 'collapsed' : ''}`} style={mobileStyle}>
      <div className="sidebar-header"><span>Collaborations</span></div>
      <div className="sidebar-tabs">
        <button className={`sidebar-tab ${rightTab === 'chat' ? 'active' : ''}`} onClick={() => setRightTab('chat')}>
          <LuMessageSquare size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Team Chat
        </button>
        <button className={`sidebar-tab ${rightTab === 'comments' ? 'active' : ''}`} onClick={() => setRightTab('comments')}>
          <FaUsers size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Comments
        </button>
      </div>
      <div className="sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 100px)' }}>
        {rightTab === 'chat' ? (
          <div className="chat-container">
            <div className="chat-messages">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`chat-bubble ${msg.type}`}>
                  <span className="chat-bubble-meta"><strong>{msg.sender}</strong> • {msg.time}</span>
                  {msg.text}
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>
            <form onSubmit={onSendMessage} className="chat-input-area">
              <input
                type="text"
                className="chat-input"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder="Type a team message..."
              />
              <button type="submit" className="chat-send-btn" title="Send message">
                <LuSend size={14} />
              </button>
            </form>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }}>
              {comments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-time">{comment.time}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={onAddComment} className="comment-new-container">
              <textarea
                className="comment-textarea"
                placeholder="Add feedback to canvas..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px', alignSelf: 'flex-end' }}>
                Post Comment
              </button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
}