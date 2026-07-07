import React, { useState } from 'react';
import { UserPlus, Trash2, Shield, User, Link2, Copy, Check } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { documentService } from '../../utils/documentService';
import { useAuth } from '../../context/AuthContext';

export default function ShareDocumentModal({
  isOpen,
  onClose,
  document,
  onUpdate // Triggers database reloads in parent page
}) {
  const { triggerToast } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Editor');
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://collabdocs.io/editor/${document.id}`);
    setCopied(true);
    triggerToast('Share Link copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    const updated = documentService.addMember(document.id, email.trim(), role);
    if (updated) {
      setEmail('');
      triggerToast('Member added successfully!', 'success');
      onUpdate();
    } else {
      triggerToast('Member is already added to this document', 'warning');
    }
  };

  const handleRemoveMember = (memberEmail) => {
    const updated = documentService.removeMember(document.id, memberEmail);
    if (updated) {
      triggerToast('Member removed from workspace', 'info');
      onUpdate();
    }
  };

  const handleChangeRole = (memberEmail, newRole) => {
    const updated = documentService.changeRole(document.id, memberEmail, newRole);
    if (updated) {
      triggerToast('Access role updated', 'success');
      onUpdate();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share settings" icon={UserPlus}>
      <div className="space-y-4 select-none">
        
        {/* Email invite form */}
        <form onSubmit={handleAddMember} className="flex gap-2 items-end">
          <Input
            label="Add member by email"
            type="email"
            placeholder="e.g. teammate@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <div className="flex flex-col gap-1 text-left">
            <label className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-2 py-2 text-xs rounded-lg border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#0D6EFD]"
            >
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <Button type="submit" variant="primary" className="h-[34px]">
            Add
          </Button>
        </form>

        {/* Existing collaborators list */}
        <div className="space-y-2 text-left">
          <h4 className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider border-b border-[#E5E7EB] dark:border-white/10 pb-1">
            People with Access
          </h4>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {/* Owner Row */}
            <div className="flex items-center justify-between text-xs py-0.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#0D6EFD]/10 text-[#0D6EFD] flex items-center justify-center font-bold text-[10px]">
                  {document.owner.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">{document.owner.name}</p>
                  <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]">{document.owner.email}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#0D6EFD] bg-[#0D6EFD]/10 px-2 py-0.5 rounded">Owner</span>
            </div>

            {/* Shared Members Rows */}
            {document.sharedUsers.length === 0 ? (
              <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]/60 py-2 font-medium">This document is not shared with anyone yet.</p>
            ) : (
              document.sharedUsers.map((user) => (
                <div key={user.email} className="flex items-center justify-between text-xs py-0.5">
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover border border-[#E5E7EB] dark:border-white/10" />
                    <div>
                      <p className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">{user.name}</p>
                      <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.email, e.target.value)}
                      className="px-1.5 py-0.5 text-[10px] rounded border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] focus:outline-none"
                    >
                      <option value="Editor">Editor</option>
                      <option value="Viewer">Viewer</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveMember(user.email)}
                      className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Link Share Footer */}
        <div className="pt-3 border-t border-[#E5E7EB] dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-[#6B7280] dark:text-[#94A3B8] font-bold">
            <Link2 size={12} className="text-[#0D6EFD]" />
            <span>Copy editor URL to share</span>
          </div>

          <Button variant="outline" size="sm" onClick={handleCopyLink} icon={copied ? Check : Copy}>
            {copied ? 'Copied' : 'Copy link'}
          </Button>
        </div>

      </div>
    </Modal>
  );
}
