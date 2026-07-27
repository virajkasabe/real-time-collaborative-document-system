import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/common/Icon';
import { createDoc } from '../../../apis/api';
import { useTheme } from '../../../context/ThemeContext';
import athenuraLogo from '../../../assets/athenura-logo.png';

export default function FileBackstagePanel({
  isOpen,
  onClose,
  doc,
  onBack,
  onSave,
  onShareClick,
  wordCount,
  user,
  showToast,
}) {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Subscribes to live theme updates
  const [activeTab, setActiveTab] = useState('info');

  if (!isOpen) return null;

  const handleCreateNew = async () => {
    try {
      const response = await createDoc({ title: 'New Document' });
      const createdDoc = response?.data?.data || response?.data?.doc || response?.data;
      if (createdDoc && createdDoc._id) {
        if (showToast) showToast('New document created successfully!', 'success');
        onClose();
        navigate(`/editor/${createdDoc._id}`);
      } else {
        if (showToast) showToast('Failed to create new document', 'error');
      }
    } catch (err) {
      if (showToast) showToast('Error creating document: ' + (err.message || err), 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const menuItems = [
    { id: 'info', label: 'Info', icon: 'Info' },
    { id: 'new', label: 'New', icon: 'FilePlus' },
    { id: 'open', label: 'Open', icon: 'FolderOpen' },
    { id: 'save', label: 'Save', icon: 'Save' },
    { id: 'saveas', label: 'Save As', icon: 'Copy' },
    { id: 'print', label: 'Print', icon: 'Printer' },
    { id: 'share', label: 'Share', icon: 'Share2' },
    { id: 'export', label: 'Export', icon: 'Download' },
    { id: 'close', label: 'Close', icon: 'X' },
  ];

  const handleTabClick = (tabId) => {
    if (tabId === 'close') {
      onClose();
    } else if (tabId === 'save') {
      if (onSave) {
        onSave();
        if (showToast) showToast('Document saved successfully!', 'success');
      }
    } else if (tabId === 'share') {
      onClose();
      if (onShareClick) {
        onShareClick();
      }
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 4000,
        display: 'flex',
        background: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: '"Segoe UI", Roboto, sans-serif',
      }}
      className={`file-backstage-panel ${theme === 'dark' ? 'dark' : ''}`}
    >
      {/* Sidebar navigation */}
      <div
        style={{
          width: '240px',
          borderRight: '1px solid var(--border)',
          color: 'var(--text)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 0',
        }}
        className="file-backstage-sidebar"
      >
        {/* Logo and Back navigation button */}
        <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={athenuraLogo}
              alt="Athenura Logo"
              style={{ width: '36px', height: '36px', objectFit: 'contain' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                borderRadius: '50%',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.1)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              title="Return to document"
            >
              <Icon name="ArrowLeft" size={20} />
            </button>
            <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text)' }}>Backstage</span>
          </div>
        </div>

        {/* Tab menu options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 24px',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: isActive ? 'rgba(13, 110, 253, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '4px solid var(--accent)' : '4px solid transparent',
                }}
                onMouseOver={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.05)';
                }}
                onMouseOut={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          padding: '48px 64px',
          overflowY: 'auto',
          background: 'var(--bg)',
          color: 'var(--text)',
          borderLeft: 'none',
        }}
      >
        {/* Info Pane */}
        {activeTab === 'info' && (
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '8px', color: 'var(--text)' }}>
              Document Information
            </h1>
            <p style={{ color: 'var(--text)', opacity: 0.7, marginBottom: '32px', fontSize: '14px' }}>
              Inspect metadata, permissions, and status details of your current document.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px' }}>
              {/* Properties column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', background: 'var(--bg-secondary)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--text)' }}>Properties</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                      <span style={{ color: 'var(--text)', opacity: 0.7 }}>Title:</span>
                      <strong style={{ color: 'var(--text)' }}>{doc?.title || 'Untitled Document'}</strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                      <span style={{ color: 'var(--text)', opacity: 0.7 }}>Word Count:</span>
                      <strong style={{ color: 'var(--text)' }}>{wordCount} words</strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                      <span style={{ color: 'var(--text)', opacity: 0.7 }}>Last Modified:</span>
                      <strong style={{ color: 'var(--text)' }}>
                        {doc?.updatedAt ? new Date(doc.updatedAt).toLocaleString() : 'Just now'}
                      </strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                      <span style={{ color: 'var(--text)', opacity: 0.7 }}>Created At:</span>
                      <strong style={{ color: 'var(--text)' }}>
                        {doc?.createdAt ? new Date(doc.createdAt).toLocaleString() : 'Just now'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', background: 'var(--bg-secondary)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--text)' }}>Related People</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                      <span style={{ color: 'var(--text)', opacity: 0.7 }}>Owner:</span>
                      <strong style={{ color: 'var(--text)' }}>{doc?.ownerId?.fullName || user?.fullName || 'You'}</strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                      <span style={{ color: 'var(--text)', opacity: 0.7 }}>Email:</span>
                      <strong style={{ color: 'var(--text)' }}>{doc?.ownerId?.email || user?.email || 'N/A'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions column */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Actions</h3>
                <button
                  type="button"
                  onClick={onBack}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    background: 'var(--accent)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    boxShadow: '0 2px 4px rgba(13, 110, 253, 0.2)',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
                >
                  <Icon name="Home" size={16} />
                  <span>Back to Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Pane */}
        {activeTab === 'new' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '8px', color: 'var(--text)' }}>
              New Document
            </h1>
            <p style={{ color: 'var(--text)', opacity: 0.7, marginBottom: '32px', fontSize: '14px' }}>
              Create a fresh new collaborative document.
            </p>

            <button
              type="button"
              onClick={handleCreateNew}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                width: '180px',
                height: '180px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--bg)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border)'
                }}
              >
                <Icon name="Plus" size={28} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Blank Document</span>
            </button>
          </div>
        )}

        {/* Open Pane */}
        {activeTab === 'open' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '8px', color: 'var(--text)' }}>
              Open Document
            </h1>
            <p style={{ color: 'var(--text)', opacity: 0.7, marginBottom: '32px', fontSize: '14px' }}>
              Navigate to your workspace files database directory.
            </p>

            <button
              type="button"
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 24px',
                background: 'var(--accent)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
            >
              <Icon name="Folder" size={16} />
              <span>Go to My Documents</span>
            </button>
          </div>
        )}

        {/* Save As Pane */}
        {activeTab === 'saveas' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '8px', color: 'var(--text)' }}>
              Save As
            </h1>
            <p style={{ color: 'var(--text)', opacity: 0.7, marginBottom: '32px', fontSize: '14px' }}>
              Create a duplicate or save in another storage destination.
            </p>

            <button
              type="button"
              onClick={() => {
                if (showToast) showToast('Save As feature is coming soon!', 'info');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 24px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                background: 'transparent',
                color: 'var(--text)',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Icon name="Cloud" size={16} style={{ color: 'var(--accent)' }} />
              <span>Save copy to Cloud</span>
            </button>
          </div>
        )}

        {/* Print Pane */}
        {activeTab === 'print' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '8px', color: 'var(--text)' }}>
              Print Settings
            </h1>
            <p style={{ color: 'var(--text)', opacity: 0.7, marginBottom: '32px', fontSize: '14px' }}>
              Print your formatted collaborative document using browser settings.
            </p>

            <button
              type="button"
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 24px',
                background: 'var(--accent)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
            >
              <Icon name="Printer" size={16} />
              <span>Print Document</span>
            </button>
          </div>
        )}

        {/* Export Pane */}
        {activeTab === 'export' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '8px', color: 'var(--text)' }}>
              Export
            </h1>
            <p style={{ color: 'var(--text)', opacity: 0.7, marginBottom: '32px', fontSize: '14px' }}>
              Export your collaborative document to standard formats.
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  if (showToast) showToast('Export as PDF is coming soon!', 'info');
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  width: '140px',
                  height: '120px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  background: 'var(--bg-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <Icon name="FileText" size={24} style={{ color: '#ef4444' }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)' }}>PDF Document</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (showToast) showToast('Export as Word is coming soon!', 'info');
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  width: '140px',
                  height: '120px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  background: 'var(--bg-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <Icon name="File" size={24} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)' }}>Word Document</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
