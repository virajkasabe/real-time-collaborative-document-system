import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Star, Trash2, Edit2, Share2, MoreVertical } from 'lucide-react';
<<<<<<< HEAD
import { documentService } from '../../utils/documentService';
=======
import { documentService } from '../../services/documentService';
>>>>>>> wind-breathing
import ShareDocumentModal from '../modals/ShareDocumentModal';
import RenameDocumentModal from '../modals/RenameDocumentModal';

export default function RecentDocuments({ documents, onUpdate }) {
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const handleToggleStar = (e, docId, currentState) => {
    e.stopPropagation();
    documentService.star(docId, !currentState);
    onUpdate();
  };

  const handleMoveToTrash = (e, docId) => {
    e.stopPropagation();
    documentService.delete(docId);
    setActionMenuOpen(null);
    onUpdate();
  };

  const openShareModal = (e, doc) => {
    e.stopPropagation();
    setSelectedDoc(doc);
    setShareOpen(true);
    setActionMenuOpen(null);
  };

  const openRenameModal = (e, doc) => {
    e.stopPropagation();
    setSelectedDoc(doc);
    setRenameOpen(true);
    setActionMenuOpen(null);
  };

  if (documents.length === 0) {
    return (
      <div className="py-12 border border-dashed border-[#E5E7EB] dark:border-white/10 rounded-xl text-center text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8]/60 transition-all select-none">
        No recent documents. Create one to get started!
      </div>
    );
  }

  return (
    <div className="space-y-2 select-none text-left">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => navigate(`/editor/${doc.id}`)}
          className="flex items-center justify-between h-14 px-3 bg-white dark:bg-[#0F172A]/20 border border-[#E5E7EB] dark:border-white/5 hover:bg-[#F7FAFF] dark:hover:bg-[#0F172A]/50 hover:border-blue-500/30 dark:hover:border-blue-500/20 hover:scale-[1.003] hover:shadow-[0_6px_25px_rgba(13,110,253,0.02)] rounded-xl transition-all duration-200 ease-in-out cursor-pointer group relative"
        >
          {/* Left: icon, title, tags */}
          <div className="flex items-center gap-3 min-w-0">
            <FileText size={15} className="text-[#0D6EFD] shrink-0" />
            <div className="min-w-0">
              <span className="font-medium text-[15px] text-[#081B3A] dark:text-slate-200 group-hover:text-[#0D6EFD] dark:group-hover:text-white transition-colors truncate block">
                {doc.name}
              </span>
              <span className="text-[12px] text-[#6B7280] dark:text-[#94A3B8] block mt-0.5 leading-none transition-colors">
                Updated {doc.updatedAt} • {doc.sharedUsers.length} collaborator{doc.sharedUsers.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 shrink-0 relative">
            <button
              onClick={(e) => handleToggleStar(e, doc.id, doc.starred)}
              className="p-1 rounded-md text-[#6B7280] dark:text-[#94A3B8] hover:text-amber-500 transition-colors"
            >
              <Star size={15} fill={doc.starred ? 'currentColor' : 'none'} className={doc.starred ? 'text-amber-500' : ''} />
            </button>

            {/* Three dot actions trigger */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActionMenuOpen(actionMenuOpen === doc.id ? null : doc.id);
                }}
                className="p-1 rounded-md text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors"
              >
                <MoreVertical size={15} />
              </button>

              {/* Action Menu Popover */}
              {actionMenuOpen === doc.id && (
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 shadow-md p-1 z-50 rounded-lg text-xs font-semibold">
                  <button
                    onClick={(e) => openRenameModal(e, doc)}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[#E5E7EB]/40 dark:hover:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB]"
                  >
                    <Edit2 size={11} />
                    <span>Rename</span>
                  </button>
                  <button
                    onClick={(e) => openShareModal(e, doc)}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[#E5E7EB]/40 dark:hover:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB]"
                  >
                    <Share2 size={11} />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={(e) => handleMoveToTrash(e, doc.id)}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 border-t border-[#E5E7EB] dark:border-white/10 mt-0.5"
                  >
                    <Trash2 size={11} />
                    <span>Move to Trash</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Share settings Modal */}
      {selectedDoc && (
        <ShareDocumentModal
          isOpen={shareOpen}
          onClose={() => { setShareOpen(false); setSelectedDoc(null); }}
          document={selectedDoc}
          onUpdate={onUpdate}
        />
      )}

      {/* Rename Modal */}
      {selectedDoc && (
        <RenameDocumentModal
          isOpen={renameOpen}
          onClose={() => { setRenameOpen(false); setSelectedDoc(null); }}
          document={selectedDoc}
          onRename={onUpdate}
        />
      )}
    </div>
  );
}
