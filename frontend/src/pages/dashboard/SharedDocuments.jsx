import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
<<<<<<< HEAD

import { FileText, Star, Eye, ShieldAlert, ArrowRight, Users, Calendar, Clock, ChevronRight, Pencil, User, BookOpen } from 'lucide-react';
import { documentService } from '../../services/documentService';

import { FileText, Star, Eye, ShieldAlert, ArrowRight } from 'lucide-react';
import { documentService } from '../../utils/documentService';

=======
import { FileText, Star, Eye, ShieldAlert, ArrowRight, Users, Calendar, Clock, ChevronRight, Pencil, User, BookOpen } from 'lucide-react';
import { documentService } from '../../services/documentService';
>>>>>>> wind-breathing
import { useAuth } from '../../context/AuthContext';
import { sharedWithMeDocs } from '../../apis/api';

export default function SharedDocuments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sidebarOpen, searchQuery } = useOutletContext();
  const [dbVer, setDbVer] = useState(0);
  const [sharedDocs, setSharedDocs] = useState([])
  const [loading, setLoading] = useState(true);

  const triggerReload = () => setDbVer(prev => prev + 1);

  useEffect(()=>{
    if(user) {
      fetchShareDocs()
    }
  },[user])

  const fetchShareDocs = async() => {
    setLoading(true);
    try {
      let res = await sharedWithMeDocs()
      console.log("shared DATA",res.data.data)
      let list = res.data.data.documents
      setSharedDocs(list)
      if (searchQuery.trim()) {
        list = list.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return list;
    } catch (error) {
      console.error("Error fetching shared docs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get role configuration
  const getRoleConfig = (role) => {
    const roles = {
      'owner': {
        color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
        borderColor: 'border-amber-500/20',
        icon: <Star size={12} className="fill-current" />,
        label: 'Owner',
        badgeClass: 'shadow-amber-500/20'
      },
      'editor': {
        color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
        borderColor: 'border-blue-500/20',
        icon: <Pencil size={12} />,
        label: 'Editor',
        badgeClass: 'shadow-blue-500/20'
      },
      'viewer': {
        color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
        borderColor: 'border-emerald-500/20',
        icon: <Eye size={12} />,
        label: 'Viewer',
        badgeClass: 'shadow-emerald-500/20'
      }
    };
    return roles[role?.toLowerCase()] || roles['viewer'];
  };

  // Get role permission description
  const getRoleDescription = (role) => {
    switch(role?.toLowerCase()) {
      case 'owner':
        return 'Full access • Can manage';
      case 'editor':
        return 'Can edit • Can comment';
      case 'viewer':
        return 'Read-only access';
      default:
        return '';
    }
  };

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-7xl w-full mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none text-left border-b border-[#E5E7EB] dark:border-white/10 pb-6 transition-colors duration-300">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-xl">
              <Users size={22} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-[24px] text-[#081B3A] dark:text-white leading-tight normal-case tracking-tight transition-colors duration-300">
                Shared with me
              </h2>
              <p className="text-[13px] font-normal text-[#6B7280] dark:text-[#94A3B8]/80 mt-0.5 flex items-center gap-2">
                <span>Documents co-authored with teammates</span>
                {sharedDocs.length > 0 && (
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
                    {sharedDocs.length}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        
        {/* Quick stats */}
        {sharedDocs.length > 0 && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
              <Star size={14} className="text-amber-500 fill-current" />
              <span className="font-medium text-amber-700 dark:text-amber-400">
                {sharedDocs.filter(d => d.me?.role?.toLowerCase() === 'owner').length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <Pencil size={14} className="text-blue-500" />
              <span className="font-medium text-blue-700 dark:text-blue-400">
                {sharedDocs.filter(d => d.me?.role?.toLowerCase() === 'editor').length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <Eye size={14} className="text-emerald-500" />
              <span className="font-medium text-emerald-700 dark:text-emerald-400">
                {sharedDocs.filter(d => d.me?.role?.toLowerCase() === 'viewer').length}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
          </div>
          <p className="mt-4 text-sm text-[#6B7280] dark:text-[#94A3B8]/80 font-medium">
            Loading shared documents...
          </p>
        </div>
      ) : sharedDocs.length === 0 ? (
        <div className="py-24 border border-dashed border-[#E5E7EB] dark:border-white/10 rounded-2xl text-center transition-all select-none">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-full">
              <Users size={40} className="text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#081B3A] dark:text-white mb-1">
                No shared documents
              </h3>
              <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]/80 max-w-sm mx-auto">
                Invite others to share files with you, or accept pending invitations to get started.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 select-none text-left">
          {sharedDocs.map((doc) => {
            const roleConfig = getRoleConfig(doc.me?.role);
            const roleDescription = getRoleDescription(doc.me?.role);
            
            return (
              <div
                key={doc.id || doc._id}
                onClick={() => navigate(`/editor/${doc._id}`)}
                className="group relative flex items-center justify-between p-4 bg-white dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/10 hover:border-[#0D6EFD]/30 dark:hover:border-[#0D6EFD]/30 hover:shadow-md hover:shadow-[#0D6EFD]/5 dark:hover:shadow-[#0D6EFD]/10 rounded-xl transition-all duration-300 cursor-pointer"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0D6EFD]/0 via-[#0D6EFD]/0 to-[#0D6EFD]/0 group-hover:from-[#0D6EFD]/[0.02] group-hover:to-[#0D6EFD]/[0.02] dark:group-hover:from-white/[0.02] dark:group-hover:to-white/[0.02] rounded-xl transition-all duration-300"></div>
                
                {/* Left side - Document info */}
                <div className="flex items-center gap-4 min-w-0 flex-1 relative z-10">
                  {/* Document icon with role-based color */}
                  <div className={`p-2.5 rounded-xl transition-all duration-300 ${roleConfig.color} ${roleConfig.borderColor} border group-hover:scale-105`}>
                    <FileText size={18} className="shrink-0" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[15px] text-[#081B3A] dark:text-slate-200 group-hover:text-[#0D6EFD] dark:group-hover:text-white transition-colors truncate">
                        {doc.title || doc.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-[11px] font-medium text-[#6B7280] dark:text-[#94A3B8]/80 flex items-center gap-1.5">
                        <User size={12} />
                        Shared by: 
                        <span className="font-semibold text-[12px] text-[#081B3A] dark:text-slate-300">
                          {doc.owner?.map(i => i.fullName).join(', ') || 'Unknown'}
                        </span>
                      </span>
                      
                      <span className="w-1 h-1 rounded-full bg-[#E5E7EB] dark:bg-white/10"></span>
                      
                      <span className="text-[11px] font-medium text-[#6B7280] dark:text-[#94A3B8]/80 flex items-center gap-1.5">
                        <Calendar size={12} />
                        Updated {formatDate(doc.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side - Role badge & action */}
                <div className="flex items-center gap-4 shrink-0 relative z-10">
                  {/* Role Badge with icon and description */}
                  <div className="flex flex-col items-end gap-0.5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold ${roleConfig.color} border ${roleConfig.borderColor} shadow-sm ${roleConfig.badgeClass} transition-all duration-300 group-hover:scale-105`}>
                      {roleConfig.icon}
                      <span>{roleConfig.label}</span>
                    </div>
                    {roleDescription && (
                      <span className="text-[10px] font-medium text-[#6B7280] dark:text-[#94A3B8]/60">
                        {roleDescription}
                      </span>
                    )}
                  </div>

                  {/* Open button with arrow */}
                  <div className="flex items-center gap-1.5 text-[#0D6EFD] hover:text-[#0D6EFD]/80 font-semibold transition-all duration-300 group-hover:translate-x-0.5">
                    <span className="text-[13px]">Open</span>
                    <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add custom keyframe animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}