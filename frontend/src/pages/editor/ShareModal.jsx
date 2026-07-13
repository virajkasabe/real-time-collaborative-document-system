
import {ATHENURA_CIRCLE_IMAGE} from '../../assets/index'
import { DOCUMENT_ROLES } from '../../utils/constants';

export default function ShareModal({
  onClose, shareEmail, setShareEmail, shareRole, setShareRole, onInvite, docId, copied, onCopyLink,
}) {
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 3000, padding: '20px',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <style>{`
        @keyframes shareModalPopIn { 
          from { opacity: 0; transform: scale(0.94) translateY(12px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-card::-webkit-scrollbar {
          width: 6px;
        }
        .modal-card::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .modal-card::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        .modal-card::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%);
        }
      `}</style>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '16px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.35), 0 10px 30px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'shareModalPopIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          padding: '0',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        {/* Header with gradient */}
        <div className="modal-header" style={{
          padding: '24px 32px 16px 32px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px 16px 0 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-60%',
            left: '-10%',
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />
          <div className="flex gap-4" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <img src={ATHENURA_CIRCLE_IMAGE} alt="" className='h-8 w-8' />
              <h3 className="modal-title" style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
                letterSpacing: '-0.01em'
              }}>Share Workspace</h3>
            </div>
            <button 
              className="modal-close" 
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: 'white',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <p style={{
            margin: '6px 0 0 0',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.85)',
            position: 'relative',
            zIndex: 1,
            fontWeight: '400'
          }}>
            INVITE ON REAL TIME COLLABORATION DOCUMENT SYSTEM
          </p>
        </div>
        
        <div className="modal-body" style={{ padding: '28px 32px 32px 32px' }}>
          <div className="form-group" style={{ marginTop: '0' }}>
            <label className="form-label" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Invite User Email
              </span>
            </label>
            
            <div className="form-input-row" style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: '0',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s',
              background: 'white'
            }}>
              <input
                type="email"
                className="form-input"
                style={{
                  flex: '1',
                  padding: '12px 16px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#1e293b',
                  backgroundColor: 'transparent',
                  transition: 'all 0.2s',
                  minWidth: '0',
                }}
                placeholder="user@organization.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                onFocus={(e) => {
                  e.currentTarget.parentElement.style.borderColor = '#667eea';
                  e.currentTarget.parentElement.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.15), 0 1px 3px rgba(0,0,0,0.06)';
                }}
                onBlur={(e) => {
                  e.currentTarget.parentElement.style.borderColor = '#e2e8f0';
                  e.currentTarget.parentElement.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                }}
              />
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 4px',
                background: '#f8fafc',
                borderLeft: '1px solid #e2e8f0',
                borderRight: '1px solid #e2e8f0',
              }}>
                <select 
                  className="form-select"
                  style={{
                    padding: '11px 28px 11px 14px',
                    border: 'none',
                    background: 'transparent',
                    color: '#1e293b',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    outline: 'none',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    minWidth: '110px',
                  }}
                  value={shareRole} 
                  onChange={(e) => setShareRole(e.target.value)}
                >
                  <option value={DOCUMENT_ROLES.OWNER} style={{ fontWeight: '600', color: '#7c3aed' }}>Owner</option>
                  <option value={DOCUMENT_ROLES.EDITOR} style={{ fontWeight: '500', color: '#2563eb' }}>Editor</option>
                  <option value={DOCUMENT_ROLES.VIEWER} style={{ fontWeight: '400', color: '#64748b' }}>Viewer</option>
                </select>
              </div>
              
              <button 
                className="btn-primary"
                onClick={onInvite}
                style={{
                  padding: '24px 24px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.96)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                <span>Invite</span>
              </button>
            </div>
            
            <div style={{
              marginTop: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px 14px',
              background: 'linear-gradient(135deg, #f0f4ff 0%, #faf0ff 100%)',
              borderRadius: '8px',
              border: '1px solid #e8edff'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#475569',
                lineHeight: '1.5'
              }}>
                <strong style={{ color: '#667eea' }}>Tip:</strong> Enter the email address of the person you'd like to invite. They'll receive an email with access instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}