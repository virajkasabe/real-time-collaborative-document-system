import React, { useState } from 'react';
import { UserPlus, Trash2, Shield, User, Link2, Copy, Check } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { documentService } from '../../services/documentService';
import { useAuth } from '../../context/AuthContext';

export default function ShareDocumentModal({
  isOpen,
  onClose,
  document,
  onUpdate 
}) {
  const { user, triggerToast } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Editor');
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  console.log("doc", document)

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
      <div className="space-y-5 select-none">
        
        {/* Email invite form */}
        <form onSubmit={handleAddMember} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Add member by email
            </label>
            <input
              type="email"
              placeholder="e.g. teammate@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
            >
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <Button type="submit" variant="primary" className="h-[42px] px-5">
            Add
          </Button>
        </form>

        {/* Existing collaborators list */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
            People with Access
          </h4>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {/* Owner Row */}
            <div className="flex items-center justify-between text-sm py-1 px-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center gap-3">
                {document.allUsers
                  .filter(u => u.role === "Owner")
                  .map((u) => (
                    <div key={u.email} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                         {
                            user.avatar ? <img src={user.avatar} alt="" className='rounded-full' /> : <span>{u.fullName.charAt(0)}</span>
                         }
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {u.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full">
                Owner
              </span>
            </div>

            {/* Shared Members Rows */}
            {document.allUsers.filter(member => member.email !== user.email).length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  This document is not shared with anyone yet.
                </p>
              </div>
            ) : (
              document.allUsers
                .filter(member => member.email !== user.email)
                .map((user) => (
                  <div key={user.email} className="flex items-center justify-between text-sm py-2 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-200 dark:group-hover:ring-blue-800/50 transition-all duration-200" 
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{user.fullName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.email, e.target.value)}
                        className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                      >
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveMember(user.email)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        title="Remove Member"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Link Share Footer */}
        {/* <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
            <Link2 size={14} className="text-blue-500" />
            <span>Copy editor URL to share</span>
          </div>

          <Button variant="outline" size="sm" onClick={handleCopyLink} icon={copied ? Check : Copy}>
            {copied ? 'Copied' : 'Copy link'}
          </Button>
        </div> */}

      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748B;
        }
      `}</style>
    </Modal>
  );
}