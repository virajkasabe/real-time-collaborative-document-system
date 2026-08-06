import React, { useState } from 'react';
import { ATHENURA_CIRCLE_IMAGE } from '../../assets/index';
import { DOCUMENT_ROLES } from '../../utils/constants';
import { colorForUserId } from '../../utils/editingpage.helper';

export default function CollaboratorsModal({
  isOpen,
  onClose,
  currentUser,
  activeUsers = [],
  doc,
  theme = 'light',
  showToast,
  onInvite,
}) {
  const isDark = theme === 'dark';
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState(DOCUMENT_ROLES.EDITOR);
  const [localCollaborators, setLocalCollaborators] = useState([
    {
      id: 'mock-1',
      fullName: 'Sarah Connor',
      email: 'sarah.connor@example.com',
      role: 'Editor',
      isOnline: true,
      avatar: null,
    },
    {
      id: 'mock-2',
      fullName: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      role: 'Viewer',
      isOnline: false,
      avatar: null,
    },
  ]);

  if (!isOpen) return null;

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      if (showToast) showToast('Please enter a valid email address', 'warning');
      return;
    }

    if (typeof onInvite === 'function') {
      await onInvite(inviteEmail.trim(), inviteRole);
    }

    // Add to local state list for display
    const newCollab = {
      id: `collab-${Date.now()}`,
      fullName: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      isOnline: false,
      avatar: null,
    };
    setLocalCollaborators((prev) => [newCollab, ...prev]);
    if (showToast) showToast(`Invitation sent to ${inviteEmail.trim()}`, 'success');
    setInviteEmail('');
  };

  const currentUserName = currentUser?.fullName || currentUser?.name || 'You';
  const currentUserEmail = currentUser?.email || 'you@company.com';

  // Merge current user, active live socket users, document members, and mock list without duplicates
  const allMembers = [
    {
      id: currentUser?._id || 'user-current',
      fullName: `${currentUserName} (You)`,
      email: currentUserEmail,
      role: doc?.ownerId === currentUser?._id ? 'Owner' : 'Editor',
      isOnline: true,
      isCurrent: true,
      avatar: currentUser?.avatar,
    },
    ...activeUsers.map((u) => ({
      id: u._id || `active-${u.fullName}`,
      fullName: u.fullName || 'Collaborator',
      email: u.email || `${(u.fullName || 'user').toLowerCase().replace(/\s+/g, '.')}@collab.io`,
      role: u.role || 'Editor',
      isOnline: true,
      avatar: u.avatar,
    })),
    ...localCollaborators,
  ].filter((v, i, a) => a.findIndex((t) => t.email === v.email || t.id === v.id) === i);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(15, 23, 42, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
        padding: '20px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .collab-modal-card::-webkit-scrollbar {
          width: 5px;
        }
        .collab-modal-card::-webkit-scrollbar-track {
          background: transparent;
        }
        .collab-modal-card::-webkit-scrollbar-thumb {
          background: ${isDark ? '#334155' : '#cbd5e1'};
          border-radius: 10px;
        }
      `}</style>

      <div
        className="collab-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: isDark ? '#1e293b' : '#ffffff',
          color: isDark ? '#f8fafc' : '#0f172a',
          borderRadius: '16px',
          boxShadow: isDark
            ? '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)'
            : '0 25px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '88vh',
          overflowY: 'auto',
          animation: 'modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
            background: isDark
              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={ATHENURA_CIRCLE_IMAGE} alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                Document Collaborators
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                Active users & team permissions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {/* Invite Form */}
          <form onSubmit={handleInviteSubmit} style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: isDark ? '#cbd5e1' : '#334155',
                marginBottom: '8px',
              }}
            >
              Invite Member by Email
            </label>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                background: isDark ? '#0f172a' : '#f8fafc',
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '4px 6px',
              }}
            >
              <input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '13px',
                  background: 'transparent',
                  color: isDark ? '#ffffff' : '#0f172a',
                  minWidth: 0,
                }}
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                  background: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <option value={DOCUMENT_ROLES.EDITOR}>Editor</option>
                <option value={DOCUMENT_ROLES.VIEWER}>Viewer</option>
              </select>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--accent, #3b82f6)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Invite
              </button>
            </div>
          </form>

          {/* Members List */}
          <div>
            <h4
              style={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: isDark ? '#94a3b8' : '#64748b',
                marginBottom: '12px',
                paddingBottom: '6px',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
              }}
            >
              People with Access ({allMembers.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {allMembers.map((m) => {
                const bg = colorForUserId(m.id || m.email);
                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                      border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        {m.avatar ? (
                          <img
                            src={m.avatar}
                            alt=""
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: bg,
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '14px',
                            }}
                          >
                            {(m.fullName || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        {m.isOnline && (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '0',
                              right: '0',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: '#22c55e',
                              border: '2px solid #ffffff',
                            }}
                            title="Active Now"
                          />
                        )}
                      </div>

                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: isDark ? '#f8fafc' : '#0f172a' }}>
                          {m.fullName}
                        </div>
                        <div style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b' }}>
                          {m.email}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background:
                          m.role === 'Owner'
                            ? 'rgba(59, 130, 246, 0.15)'
                            : m.role === 'Editor'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'rgba(148, 163, 184, 0.15)',
                        color:
                          m.role === 'Owner'
                            ? '#3b82f6'
                            : m.role === 'Editor'
                            ? '#10b981'
                            : '#64748b',
                      }}
                    >
                      {m.role}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
