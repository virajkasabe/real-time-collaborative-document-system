import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
<<<<<<< HEAD
import { documentService } from '../../utils/documentService';
=======
import { documentService } from '../../services/documentService';
>>>>>>> wind-breathing
import { useAuth } from '../../context/AuthContext';

export default function Comments({ docId, comments, onUpdate, onClose }) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const updated = documentService.addComment(docId, user?.name || 'Anonymous', newComment.trim());
    if (updated) {
      setNewComment('');
      onUpdate();
    }
  };

  return (
    <div className="w-64 border-l border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0B1220] flex flex-col h-full select-none text-left transition-colors duration-300">
      {/* Drawer Header */}
      <div className="p-3 border-b border-[#E5E7EB] dark:border-white/10 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-1.5 font-bold text-xs text-[#081B3A] dark:text-[#E5E7EB]">
          <MessageSquare size={13} className="text-[#0D6EFD]" />
          <span>Comments Feed</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] text-[#6B7280]">
          <X size={13} />
        </button>
      </div>

      {/* Drawer Comments List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {comments.length === 0 ? (
          <div className="text-center text-[10px] text-[#6B7280] dark:text-[#94A3B8]/60 py-12 font-medium">
            No comments yet. Be the first to start the discussion!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-2.5 bg-[#F7FAFF] dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/10 rounded-lg space-y-1 transition-all duration-300">
              <div className="flex justify-between items-center text-[9px] font-bold">
                <span className="text-[#0D6EFD]">{comment.user}</span>
                <span className="text-[#6B7280] dark:text-[#94A3B8]/60">{comment.time}</span>
              </div>
              <p className="text-[10.5px] leading-relaxed text-[#081B3A] dark:text-[#E5E7EB] font-medium transition-colors">
                {comment.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Drawer Footer input form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[#E5E7EB] dark:border-white/10 flex gap-1.5 items-center transition-colors">
        <input
          type="text"
          placeholder="Write comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 px-2.5 py-1.5 text-[10.5px] rounded-lg border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] placeholder-[#6B7280]/40 focus:outline-none focus:ring-1 focus:ring-[#0D6EFD] transition-colors"
        />
        <button
          type="submit"
          className="p-1.5 rounded-lg bg-[#0D6EFD] text-white hover:bg-[#0D6EFD]/90 active:scale-95 transition-all shrink-0"
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}
