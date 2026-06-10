import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { User, FileText, Users, Star, Check, X, Lock } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { documentService } from '../../services/documentService';

export default function Profile() {
  const { user, triggerToast } = useAuth();
  const { sidebarOpen } = useOutletContext();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!name.trim()) return;

    // Update localStorage user so name persists across reloads
    if (user) {
      const updatedUser = { ...user, name: name.trim() };
      localStorage.setItem('collabdocs_user', JSON.stringify(updatedUser));
    }

    triggerToast('Profile updated successfully!', 'success');
    setIsEditing(false);

    // Short timeout to let the toast render before we refresh to update Navbar user name
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const allDocs = documentService.getAll();
  const ownedDocsCount = allDocs.filter(d => d.owner?.email === user?.email).length;
  const sharedDocsCount = documentService.getShared(user?.email).length;
  const starredDocsCount = documentService.getStarred().filter(d => 
    d.owner?.email === user?.email || d.sharedUsers?.some(u => u.email === user?.email)
  ).length;

  return (
    <div className="p-6 space-y-6 max-w-4xl w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/10 pb-5 transition-all duration-300 select-none">
            <div className="text-left">
              <h2 className="font-sans font-extrabold text-xl md:text-2xl text-[#081B3A] dark:text-white tracking-tight">
                Profile Settings
              </h2>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-medium mt-1">
                Manage your personal information and account preferences
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => { setIsEditing(false); setName(user?.name || ''); }} icon={X}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} type="submit" variant="primary" icon={Check}>
                    Save changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate('/reset-password')} icon={Lock}>
                    Reset Password
                  </Button>
                  <Button onClick={() => setIsEditing(true)} icon={User}>
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* Left: Profile Summary Card */}
            <div className="bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/5 rounded-[20px] p-6 shadow-sm flex flex-col items-center text-center space-y-4 transition-all duration-300">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2563EB] to-indigo-600 flex items-center justify-center mx-auto shadow-xl ring-4 ring-blue-500/30">
                <span className="text-white text-4xl font-extrabold uppercase">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white mt-3 capitalize">
                  {user?.name || user?.email?.split('@')[0]}
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]/80 font-medium truncate">
                  {user?.email}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] dark:border-white/10 w-full flex items-center justify-center gap-2 text-xs font-semibold text-[#081B3A] dark:text-[#E5E7EB]">
                <FileText size={14} className="text-[#0D6EFD]" />
                <span>{ownedDocsCount} {ownedDocsCount === 1 ? 'Document' : 'Documents'} Created</span>
              </div>
            </div>

            {/* Right: Stats & Information Column */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Statistics Section */}
              <div className="grid grid-cols-3 gap-4">
                {/* Documents Card */}
                <div className="bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/5 rounded-[20px] p-4 shadow-sm flex flex-col justify-between space-y-3 transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider">Documents</span>
                    <div className="bg-[#0D6EFD]/10 text-[#0D6EFD] p-1.5 rounded-lg">
                      <FileText size={14} />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-[#081B3A] dark:text-white mt-1">
                    {ownedDocsCount}
                  </div>
                </div>

                {/* Shared Card */}
                <div className="bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/5 rounded-[20px] p-4 shadow-sm flex flex-col justify-between space-y-3 transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider">Shared</span>
                    <div className="bg-purple-500/10 text-purple-500 p-1.5 rounded-lg">
                      <Users size={14} />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-[#081B3A] dark:text-white mt-1">
                    {sharedDocsCount}
                  </div>
                </div>

                {/* Starred Card */}
                <div className="bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/5 rounded-[20px] p-4 shadow-sm flex flex-col justify-between space-y-3 transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider">Starred</span>
                    <div className="bg-amber-500/10 text-amber-500 p-1.5 rounded-lg">
                      <Star size={14} />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-[#081B3A] dark:text-white mt-1">
                    {starredDocsCount}
                  </div>
                </div>
              </div>

              {/* Personal Information Card */}
              <div className="bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/5 rounded-[20px] p-6 shadow-sm transition-all duration-300">
                <h3 className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider border-b border-[#E5E7EB] dark:border-white/10 pb-3 mb-4 select-none">
                  Personal Information
                </h3>

                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <Input
                      label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      value={user?.email || ''}
                      disabled
                    />

                    <div className="pt-2 flex justify-end gap-2">
                      <Button variant="outline" onClick={() => { setIsEditing(false); setName(user?.name || ''); }} icon={X}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" icon={Check}>
                        Save changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#E5E7EB]/50 dark:border-white/5 gap-1">
                      <span className="text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8]">Full Name</span>
                      <span className="text-xs font-bold text-[#081B3A] dark:text-white">{name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#E5E7EB]/50 dark:border-white/5 gap-1">
                      <span className="text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8]">Email Address</span>
                      <span className="text-xs font-bold text-[#081B3A] dark:text-white truncate max-w-xs">{user?.email}</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
    </div>
  );
}
