import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FileText, Star, Eye, ShieldAlert, ArrowRight } from 'lucide-react';
import { documentService } from '../../services/documentService';
import { useAuth } from '../../context/AuthContext';
import { sharedWithMeDocs } from '../../apis/api';

export default function SharedDocuments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sidebarOpen, searchQuery } = useOutletContext();
  const [dbVer, setDbVer] = useState(0);
  const [sharedDocs, setSharedDocs] = useState([])
  const [role, setRole] = useState([])

  const triggerReload = () => setDbVer(prev => prev + 1);

  useEffect(()=>{
    if(user) {
      fetchShareDocs()
    }
  },[user])



  const fetchShareDocs = async() => {
    let res = await sharedWithMeDocs()
    console.log("shared DATA",res.data.data.documents)
    setRole(res.data.data.role)
    console.log("shared DATA",res.data.data.role)
    let list = res.data.data.documents
    setSharedDocs(list)

    if (searchQuery.trim()) {
      list = list.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  };



  return (
    <div className="p-5 md:p-6 space-y-5 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 select-none text-left border-b border-[#E5E7EB] dark:border-white/10 pb-4 transition-colors duration-300">
            <div className="space-y-1">
              <h2 className="font-sans font-bold text-[22px] text-[#081B3A] dark:text-white leading-tight normal-case tracking-tight transition-colors duration-300">
                Shared with me
              </h2>
              <p className="text-[13px] font-normal text-[#6B7280] dark:text-[#94A3B8]/80 mt-0.5">
                Documents co-authored with teammates
              </p>
            </div>
          </div>

          {/* List display */}
          {sharedDocs.length === 0 ? (
            <div className="py-24 border border-dashed border-[#E5E7EB] dark:border-white/10 rounded-2xl text-center text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8]/60 transition-all select-none">
              No shared documents found. Invite others to share files with you!
            </div>
          ) : (
            <div className="space-y-2 select-none text-left">
              {sharedDocs.map((doc) => {
                // Find logged in user's role on this document
                const particularRole = role.map(r => r.role)
                const userRole = particularRole ? particularRole.role : 'Viewer';

                 return (
                  <div
                    key={doc.id}
                    onClick={() => navigate(`/editor/${doc._id}`)}
                    className="flex items-center justify-between h-14 px-3 bg-white dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/10 hover:bg-[#F7FAFF] dark:hover:bg-[#0F172A] hover:border-[#E5E7EB] dark:hover:border-white/20 rounded-xl transition-all duration-300 cursor-pointer group"
                  >
                    {/* Left details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText size={14} className="text-[#0D6EFD] shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-[14px] text-[#081B3A] dark:text-slate-200 group-hover:text-[#0D6EFD] dark:group-hover:text-white transition-colors truncate block">
                          {doc.name}
                        </span>
                        <span className="text-[11px] font-medium text-[#6B7280] dark:text-[#94A3B8]/80 block mt-0.5 leading-none transition-colors">
                          Shared by: <span className="font-medium text-[12.5px] text-[#081B3A] dark:text-slate-200">{ `User` || doc.owner.name }</span> • Updated {doc.updatedAt}
                        </span>
                      </div>
                    </div>

                    {/* Right details: Access Badge */}
                    <div className="flex items-center gap-4 shrink-0 font-semibold">
                      <div className="flex items-center gap-1">
                        {userRole === 'Editor' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#0D6EFD]/10 text-[#0D6EFD] font-semibold">
                            <ShieldAlert size={10} />
                            <span>Editor</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#E5E7EB] text-[#6B7280] dark:bg-white/10 dark:text-[#94A3B8] font-semibold">
                            <Eye size={10} />
                            <span>Viewer</span>
                          </span>
                        )}
                      </div>

                      <div className="text-[13px] text-[#0D6EFD] hover:text-[#0D6EFD]/80 flex items-center gap-0.5 font-semibold">
                        <span>Open</span>
                        <ArrowRight size={10} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

    </div>
  );
}
