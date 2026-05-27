import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

export default function RecentDocumentsTable({ documents, searchQuery }) {
  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredDocs.length === 0) {
    return (
      <div className="py-6 text-center text-[#6B7280] dark:text-[#94A3B8] text-xs font-semibold transition-colors duration-300">
        No documents found
      </div>
    );
  }

  return (
    <div className="space-y-2 select-none">
      {filteredDocs.map((doc) => {
        return (
          <div
            key={doc.id}
            onClick={() => alert(`Launching document workspace for "${doc.name}"...`)}
            className="flex items-center justify-between py-2.5 px-3.5 bg-white dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/10 hover:bg-[#F7FAFF] dark:hover:bg-[#0F172A] hover:border-[#E5E7EB] dark:hover:border-white/20 rounded-lg transition-all duration-300 cursor-pointer group"
          >
            {/* Left: Document Icon + Title & Metadata */}
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText size={13} className="text-[#0D6EFD] shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold text-[11.5px] text-[#081B3A] dark:text-slate-200 group-hover:text-[#0D6EFD] dark:group-hover:text-slate-100 transition-colors duration-300 truncate block">
                  {doc.name}
                </span>
                
                {/* Underneath: Updated time and collaborator count */}
                <span className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] block mt-0.5 font-medium transition-colors duration-300">
                  Updated {doc.updatedAt} • {doc.sharedUsers.length} collaborator{doc.sharedUsers.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            {/* Right: Open workspace link/button */}
            <div className="flex items-center gap-1 shrink-0 text-[10px] font-bold text-[#0D6EFD] group-hover:text-[#0D6EFD]/80 dark:group-hover:text-[#3FA3FF] transition-colors pr-1">
              <span>Open</span>
              <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
