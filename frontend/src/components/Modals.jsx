<<<<<<< HEAD
import AddMemberModal from "./modals/AddMemberModal";
import RemoveMemberModal from "./modals/RemoveMemberModal";
import RenameDocumentModal from "./modals/RenameDocumentModal";
import ShareDocumentModal from "./modals/ShareDocumentModal";

export default function Modals({ isOpen, type, selectedDoc, onSubmit, onClose, documents, teamMembers }) {
  if (!isOpen) return null;

  const commonProps = {
    selectedDoc,
    onSubmit,
    onClose,
    documents,
    teamMembers,
  };

  switch (type) {
    case "invite":
    case "add-member":
      return <AddMemberModal {...commonProps} />;
    case "remove-member":
      return <RemoveMemberModal {...commonProps} />;
    case "rename":
      return <RenameDocumentModal {...commonProps} />;
    case "share":
      return <ShareDocumentModal {...commonProps} />;
    default:
      // Fallback to close for unknown modal types
      return null;
  }
}

=======
import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  UserPlus, 
  Share2, 
  Download, 
  Clock, 
  Mail, 
  Check, 
  Copy, 
  Link,
  Loader
} from 'lucide-react';

export default function Modals({ 
  modalType, 
  selectedDoc, 
  onClose, 
  onSubmit, 
  documents
}) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 1. Create Document Form States
  const [docTitle, setDocTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [inviteEmails, setInviteEmails] = useState('');

  // 2. Invite Member States
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');

  // 3. Share States
  const [shareDocId, setShareDocId] = useState(selectedDoc?.id || '');
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState('Editor');

  // 4. Export States
  const [exportFormat, setExportFormat] = useState('pdf');

  // 5. Restore States
  const [selectedVersion, setSelectedVersion] = useState('v3');

  useEffect(() => {
    if (selectedDoc) {
      setShareDocId(selectedDoc.id);
      if (selectedDoc.category) {
        setSelectedTemplate(selectedDoc.category);
      }
    }
  }, [selectedDoc]);

  // Handle Copy Link
  const handleCopyLink = () => {
    setCopied(true);
    navigator.clipboard.writeText("https://docs.collabdocs.io/d/share-3bb5928f");
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit Handler
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (modalType === 'create') {
      if (!docTitle.trim()) return alert('Please enter a title.');
      onSubmit({
        title: docTitle,
        template: selectedTemplate,
        collaborators: inviteEmails.split(',').map(e => e.trim()).filter(Boolean)
      });
      setDocTitle('');
      setInviteEmails('');
    } 
    else if (modalType === 'invite') {
      if (!inviteEmail.trim()) return alert('Please enter a valid email.');
      onSubmit({
        email: inviteEmail,
        role: inviteRole
      });
      setInviteEmail('');
    } 
    else if (modalType === 'share') {
      if (!shareEmail.trim()) return alert('Please enter collaborator email.');
      onSubmit({
        docId: shareDocId,
        email: shareEmail,
        role: shareRole
      });
      setShareEmail('');
    }
    else if (modalType.startsWith('export')) {
      setLoading(true);
      setProgress(10);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setLoading(false);
              onSubmit({ format: exportFormat, docId: selectedDoc?.id });
            }, 300);
            return 100;
          }
          return prev + 25;
        });
      }, 250);
    }
    else if (modalType === 'restore') {
      onSubmit({
        version: selectedVersion,
        docId: selectedDoc?.id
      });
    }
  };

  if (!modalType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Flat dark backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#070B14]/40 dark:bg-[#070B14]/80 transition-colors duration-300"
      />

      {/* Modal Card solid container (12px rounded borders) */}
      <div className="glass-card w-full max-w-md border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-xl relative z-10 overflow-hidden rounded-xl transition-colors duration-300">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-white/10 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-2">
            {modalType === 'create' && (
              <>
                <div className="p-1.5 bg-[#0D6EFD]/10 text-[#0D6EFD] rounded transition-colors duration-300">
                  <FileText size={15} />
                </div>
                <h3 className="font-bold text-xs text-[#081B3A] dark:text-[#E5E7EB] uppercase tracking-wider transition-colors duration-300">Create Document</h3>
              </>
            )}
            {modalType === 'invite' && (
              <>
                <div className="p-1.5 bg-[#0D6EFD]/10 text-[#0D6EFD] rounded transition-colors duration-300">
                  <UserPlus size={15} />
                </div>
                <h3 className="font-bold text-xs text-[#081B3A] dark:text-[#E5E7EB] uppercase tracking-wider transition-colors duration-300">Invite Member</h3>
              </>
            )}
            {modalType === 'share' && (
              <>
                <div className="p-1.5 bg-[#0D6EFD]/10 text-[#0D6EFD] rounded transition-colors duration-300">
                  <Share2 size={15} />
                </div>
                <h3 className="font-bold text-xs text-[#081B3A] dark:text-[#E5E7EB] uppercase tracking-wider transition-colors duration-300">Share Settings</h3>
              </>
            )}
            {modalType.startsWith('export') && (
              <>
                <div className="p-1.5 bg-[#0D6EFD]/10 text-[#0D6EFD] rounded transition-colors duration-300">
                  <Download size={15} />
                </div>
                <h3 className="font-bold text-xs text-[#081B3A] dark:text-[#E5E7EB] uppercase tracking-wider transition-colors duration-300">Export Document</h3>
              </>
            )}
            {modalType === 'restore' && (
              <>
                <div className="p-1.5 bg-[#0D6EFD]/10 text-[#0D6EFD] rounded transition-colors duration-300">
                  <Clock size={15} />
                </div>
                <h3 className="font-bold text-xs text-[#081B3A] dark:text-[#E5E7EB] uppercase tracking-wider transition-colors duration-300">Revert Revision</h3>
              </>
            )}
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors duration-300"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal content body forms */}
        <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
          {/* ==================== CREATE MODAL ==================== */}
          {modalType === 'create' && (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider transition-colors duration-300">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. CollabDocs Roadmap"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="bg-white dark:bg-[#070B14] border border-[#E5E7EB] dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D6EFD] focus:border-[#0D6EFD] text-[#081B3A] dark:text-[#E5E7EB] shadow-sm font-medium transition-colors duration-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider transition-colors duration-300">Starting Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'blank', name: 'Blank Page' },
                    { id: 'proposal', name: 'Project Proposal' },
                    { id: 'minutes', name: 'Meeting Minutes' },
                    { id: 'spec', name: 'Product Spec Sheet' }
                  ].map((temp) => (
                    <button
                      key={temp.id}
                      type="button"
                      onClick={() => setSelectedTemplate(temp.id)}
                      className={`text-left px-3 py-2 rounded-lg border transition-all text-xs font-bold duration-300
                        {selectedTemplate === temp.id 
                          ? 'border-[#0D6EFD] bg-[#0D6EFD]/10 text-[#0D6EFD] dark:bg-[#0D6EFD]/20 dark:text-[#0D6EFD] shadow-none' 
                          : 'border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#94A3B8] hover:bg-[#F7FAFF] dark:hover:bg-[#0F172A]'
                        }
                      `}
                    >
                      {temp.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider transition-colors duration-300">Invite Collaborators (Comma Separated)</label>
                <textarea
                  rows="2"
                  placeholder="e.g. sarah@company.com, mark@company.com"
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  className="bg-white dark:bg-[#070B14] border border-[#E5E7EB] dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D6EFD] focus:border-[#0D6EFD] text-[#081B3A] dark:text-[#E5E7EB] placeholder-[#6B7280]/40 dark:placeholder-[#94A3B8]/40 shadow-sm font-medium transition-colors duration-300"
                />
              </div>
            </div>
          )}

          {/* ==================== INVITE MODAL ==================== */}
          {modalType === 'invite' && (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider transition-colors duration-300">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. jessica.alba@collabdocs.io"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-white dark:bg-[#070B14] border border-[#E5E7EB] dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D6EFD] focus:border-[#0D6EFD] text-[#081B3A] dark:text-[#E5E7EB] shadow-sm font-medium transition-colors duration-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider transition-colors duration-300">Workspace Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Editor', 'Viewer', 'Admin'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setInviteRole(role)}
                      className={`py-2 rounded-lg border text-center font-bold text-xs transition-all duration-300
                        ${inviteRole === role 
                          ? 'border-[#0D6EFD] bg-[#0D6EFD]/10 text-[#0D6EFD] dark:bg-[#0D6EFD]/20 dark:text-[#0D6EFD] shadow-none' 
                          : 'border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#070B14] text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F7FAFF] dark:hover:bg-[#0F172A]'
                        }
                      `}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== SHARE MODAL ==================== */}
          {modalType === 'share' && (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider transition-colors duration-300">Select Document to Share</label>
                <select
                  value={shareDocId}
                  onChange={(e) => setShareDocId(e.target.value)}
                  className="bg-white dark:bg-[#070B14] border border-[#E5E7EB] dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D6EFD] focus:border-[#0D6EFD] text-[#081B3A] dark:text-[#E5E7EB] shadow-sm font-bold transition-colors duration-300"
                >
                  <option value="">Choose a document...</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>{doc.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider transition-colors duration-300">Collaborator Email</label>
                <input
                  type="email"
                  placeholder="e.g. corey.taylor@collabdocs.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="bg-white dark:bg-[#070B14] border border-[#E5E7EB] dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D6EFD] focus:border-[#0D6EFD] text-[#081B3A] dark:text-[#E5E7EB] shadow-sm font-medium transition-colors duration-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider transition-colors duration-300">Permission Scope</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Editor', title: 'Editor Access' },
                    { id: 'Viewer', title: 'Viewer Access' }
                  ].map((roleObj) => (
                    <button
                      key={roleObj.id}
                      type="button"
                      onClick={() => setShareRole(roleObj.id)}
                      className={`text-center py-2 rounded-lg border transition-all text-xs font-bold duration-300
                        ${shareRole === roleObj.id 
                          ? 'border-[#0D6EFD] bg-[#0D6EFD]/10 text-[#0D6EFD] dark:bg-[#0D6EFD]/20 dark:text-[#0D6EFD] shadow-none' 
                          : 'border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#94A3B8] hover:bg-[#F7FAFF] dark:hover:bg-[#0F172A]'
                        }
                      `}
                    >
                      {roleObj.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#E5E7EB] dark:border-white/10 pt-3.5 flex items-center justify-between transition-colors duration-300">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#081B3A] dark:text-[#E5E7EB] transition-colors duration-300">
                  <Link size={12} className="text-[#0D6EFD]" />
                  <span className="truncate max-w-[150px] text-[#6B7280] dark:text-[#94A3B8] transition-colors duration-300">https://docs.collabdocs.io/d/share...</span>
                </div>
                
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all duration-300
                    ${copied 
                      ? 'bg-[#0D6EFD]/10 border-[#0D6EFD] text-[#0D6EFD] dark:bg-[#0D6EFD]/20' 
                      : 'bg-white dark:bg-[#070B14] border-[#E5E7EB] dark:border-white/10 text-[#081B3A] dark:text-[#E5E7EB] hover:bg-[#F7FAFF] dark:hover:bg-[#0F172A] shadow-sm'
                    }
                  `}
                >
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================== EXPORT MODAL ==================== */}
          {modalType.startsWith('export') && (
            <div className="space-y-3">
              <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-bold transition-colors duration-300">
                Export <strong>{selectedDoc?.name || 'this document'}</strong> formatting:
              </p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'pdf', title: 'PDF' },
                  { id: 'docx', title: 'Word (.docx)' },
                  { id: 'markdown', title: 'Markdown (.md)' },
                  { id: 'html', title: 'HTML' }
                ].map((form) => (
                  <button
                    key={form.id}
                    type="button"
                    onClick={() => setExportFormat(form.id)}
                    className={`text-center py-2 rounded-lg border transition-all text-xs font-bold duration-300
                      ${exportFormat === form.id 
                        ? 'border-[#0D6EFD] bg-[#0D6EFD]/10 text-[#0D6EFD] dark:bg-[#0D6EFD]/20 dark:text-[#0D6EFD] shadow-none' 
                        : 'border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#94A3B8] hover:bg-[#F7FAFF] dark:hover:bg-[#0F172A]'
                      }
                    `}
                  >
                    {form.title}
                  </button>
                ))}
              </div>

              {loading && (
                <div className="space-y-1.5 bg-[#E5E7EB]/40 dark:bg-[#070B14] p-3 rounded-lg border border-[#E5E7EB] dark:border-white/10 transition-colors duration-300">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-[#6B7280] dark:text-[#94A3B8] flex items-center gap-1.5 transition-colors duration-300">
                      <Loader size={12} className="animate-spin text-[#0D6EFD]" />
                      Compiling assets...
                    </span>
                    <span className="text-[#0D6EFD]">{progress}%</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] dark:bg-white/5 rounded-full h-1.5 overflow-hidden transition-colors duration-300">
                    <div className="bg-[#0D6EFD] h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== RESTORE VERSION MODAL ==================== */}
          {modalType === 'restore' && (
            <div className="space-y-3">
              <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-bold transition-colors duration-300">
                Audit version checkpoints:
              </p>

              {/* Vertical Timeline */}
              <div className="relative pl-5 space-y-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[#E5E7EB] dark:before:bg-white/10 transition-colors duration-300">
                {[
                  { id: 'v3', name: 'Version 2.4.1', date: '10:24 AM', author: 'Eleanor Vance' },
                  { id: 'v2', name: 'Version 2.3.0', date: 'Yesterday', author: 'Sarah Connor' },
                  { id: 'v1', name: 'Version 2.1.2', date: 'May 23', author: 'Dave Grohl' }
                ].map((ver) => {
                  const isChecked = selectedVersion === ver.id;
                  return (
                    <div 
                      key={ver.id}
                      onClick={() => setSelectedVersion(ver.id)}
                      className={`relative cursor-pointer p-2.5 rounded-lg border transition-all duration-300 flex items-center justify-between
                        ${isChecked 
                          ? 'border-[#0D6EFD] bg-[#0D6EFD]/10 text-[#0D6EFD] dark:bg-[#0D6EFD]/20 dark:text-[#0D6EFD] font-bold shadow-none' 
                          : 'border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#94A3B8] hover:bg-[#F7FAFF] dark:hover:bg-[#0F172A]'
                        }
                      `}
                    >
                      {/* Node circle */}
                      <span className={`absolute -left-[18px] top-4 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-[#0F172A] transition-all duration-300
                        ${isChecked ? 'bg-[#0D6EFD]' : 'bg-[#E5E7EB] dark:bg-white/10'}
                      `} />
                      
                      <div className="min-w-0 pr-2 text-[11px] font-bold">
                        <span className={`transition-colors duration-300 ${isChecked ? 'text-[#0D6EFD]' : 'text-[#081B3A] dark:text-slate-200'}`}>
                          {ver.name}
                        </span>
                        <span className="text-[9px] text-[#6B7280] dark:text-[#94A3B8] block mt-0.5 transition-colors duration-300">
                          By {ver.author}
                        </span>
                      </div>

                      <span className="text-[9px] text-[#6B7280] dark:text-[#94A3B8] font-bold shrink-0 transition-colors duration-300">
                        {ver.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="border-t border-[#E5E7EB] dark:border-white/10 pt-3.5 flex items-center justify-end gap-2 transition-colors duration-300">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#070B14] hover:bg-[#F7FAFF] dark:hover:bg-white/5 text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] rounded-lg shadow-sm transition-all duration-300"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-3.5 py-1.5 text-white text-xs font-bold rounded-lg shadow-sm bg-[#0D6EFD] hover:bg-[#0D6EFD]/90 active:scale-95 transition-all duration-300"
            >
              {modalType === 'create' && <span>Create Document</span>}
              {modalType === 'invite' && <span>Send Invite</span>}
              {modalType === 'share' && <span>Update Scope</span>}
              {modalType.startsWith('export') && <span>{loading ? 'Compiling...' : 'Download'}</span>}
              {modalType === 'restore' && <span>Restore version</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
>>>>>>> 02b645e (Improve dashboard UI and fix theme system)
