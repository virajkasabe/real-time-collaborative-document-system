import React, { useState } from 'react';
import { MessageSquare, Plus, Check, X } from 'lucide-react';

interface CommentItem {
  _id: string;
  id?: string;
  user: string;
  author?: string;
  text: string;
  time?: string;
  resolved?: boolean;
}

interface CommentsPanelProps {
  comments: CommentItem[];
  onAddComment: (text: string) => void;
  onResolveComment: (id: string) => void;
  onClose: () => void;
  user: any;
}

export default function CommentsPanel({
  comments,
  onAddComment,
  onResolveComment,
  onClose,
  user
}: CommentsPanelProps) {
  const [inputText, setInputText] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddComment(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-white/10 w-80 shrink-0 text-left">
      <div className="p-3 border-b border-white/10 flex justify-between items-center bg-slate-950">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-blue-500" />
          <span className="text-sm font-bold text-white">Comments</span>
          <span className="text-[10px] bg-white/5 text-white/50 px-2 py-0.5 rounded-full font-bold">
            {comments.filter(c => !c.resolved).length}
          </span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-900">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400/60 p-4">
            <MessageSquare size={24} className="mb-2 text-slate-700" />
            <p className="text-[11px] font-bold">No comments yet</p>
            <p className="text-[9px] text-slate-500 mt-1">
              Select text or click on the canvas and post a comment to share collaborative notes.
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const commentId = comment._id || comment.id || '';
            const author = comment.author || comment.user || 'Anonymous';
            return (
              <div 
                key={commentId}
                className={`p-3 border rounded-xl transition-all ${
                  comment.resolved
                    ? 'border-emerald-500/20 bg-emerald-950/5 opacity-55'
                    : 'border-white/5 bg-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="text-[11px] font-bold text-white">{author}</span>
                    <span className="text-[8px] text-slate-500 ml-1.5">{comment.time || 'Just now'}</span>
                  </div>
                  {!comment.resolved && (
                    <button
                      onClick={() => onResolveComment(commentId)}
                      className="p-1 hover:bg-emerald-500/20 rounded text-slate-400 hover:text-emerald-400 cursor-pointer"
                      title="Resolve comment"
                    >
                      <Check size={12} />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 break-words leading-normal">
                  {comment.text}
                </p>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-slate-950 flex gap-2">
        <input
          type="text"
          placeholder="Add comments..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10
            rounded-xl px-3 py-2 text-xs text-white
            placeholder-gray-500 focus:outline-none
            focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40
            text-white px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center"
        >
          <Plus size={14} />
        </button>
      </form>
    </div>
  );
}
