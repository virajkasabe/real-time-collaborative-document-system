import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Share2, 
  MessageSquare, 
  Clock, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  ChevronLeft,
  Sparkles,
  Link,
  MessageCircle,
  Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
<<<<<<< HEAD
import { documentService } from '../../utils/documentService';
import { socketService } from '../../utils/socketService';
=======
import { documentService } from '../../services/documentService';
import { socketService } from '../../services/socketService';
>>>>>>> wind-breathing
import Navbar from '../../components/layout/Navbar';
import ShareDocumentModal from '../../components/modals/ShareDocumentModal';
import Comments from './Comments';
import VersionHistory from './VersionHistory';
import Button from '../../components/common/Button';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, triggerToast } = useAuth();
  
  const [doc, setDoc] = useState(null);
  const [dbVer, setDbVer] = useState(0);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  
  // Side Drawers
  const [showComments, setShowComments] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Collaboration mock states
  const [collaborators, setCollaborators] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const editorRef = useRef(null);

  const triggerReload = () => setDbVer(prev => prev + 1);

  // Fetch document details
  useEffect(() => {
    const fetched = documentService.getById(id);
    if (!fetched) {
      triggerToast('Document not found', 'warning');
      navigate('/dashboard');
      return;
    }
    setDoc(fetched);
    setContent(fetched.content);
    setTitle(fetched.name);
    setCollaborators(socketService.getLiveCursors());
    socketService.joinRoom(id, user?.name);
  }, [id, dbVer]);

  // Simulate co-author typing triggers
  useEffect(() => {
    const unsub = socketService.onContentChange((event) => {
      setTypingUser(`${event.user} is typing...`);
      setTimeout(() => setTypingUser(''), 2500);
    });
    return () => unsub();
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    documentService.update(id, { name: e.target.value });
  };

  const handleContentChange = (e) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
    documentService.update(id, { content: newContent });
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      documentService.update(id, { content: newContent });
    }
  };

  const handleRestoreVersion = (restoredContent) => {
    setContent(restoredContent);
    if (editorRef.current) {
      editorRef.current.innerHTML = restoredContent;
    }
    documentService.update(id, { content: restoredContent });
    triggerToast('Revision checkpoint restored!', 'success');
    triggerReload();
  };

  const handleInsertComment = () => {
    const sel = window.getSelection().toString();
    if (!sel) {
      triggerToast('Highlight some text first to add inline comment', 'info');
      return;
    }
    setShowComments(true);
    triggerToast('Add comment for highlighted content', 'info');
  };

  if (!doc) return null;

  return (
    <div className="min-h-screen bg-[#F7FAFF] dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] transition-colors duration-300 flex flex-col h-screen select-none">
      
      {/* 1. Header Toolbar */}
      <div className="bg-white dark:bg-[#0B1220] border-b border-[#E5E7EB] dark:border-white/10 px-4 py-2 flex items-center justify-between transition-colors shrink-0">
        
        {/* Left: Back Link & Document Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-1 rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-white hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors shrink-0"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={16} className="text-[#0D6EFD] shrink-0" />
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="font-sans font-extrabold text-xs text-[#081B3A] dark:text-white bg-transparent border-b border-transparent hover:border-[#E5E7EB] dark:hover:border-white/10 focus:border-[#0D6EFD] focus:outline-none py-0.5 px-1 truncate transition-colors duration-300"
            />
          </div>
        </div>

        {/* Center: Live Typing Indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold transition-all">
          {typingUser && (
            <>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>{typingUser}</span>
            </>
          )}
        </div>

        {/* Right: Active Avatars + Share + Comments + Revisions */}
        <div className="flex items-center gap-2">
          {/* Active Collaborators Avatars */}
          <div className="hidden sm:flex items-center -space-x-1.5 pr-2 border-r border-[#E5E7EB] dark:border-white/10">
            {collaborators.map((collab) => (
              <div 
                key={collab.name} 
                className="w-5.5 h-5.5 rounded-full ring-2 ring-white dark:ring-[#0B1220] bg-[#0D6EFD] text-white flex items-center justify-center font-extrabold text-[8px] uppercase cursor-help transition-all"
                title={`${collab.name} is co-authoring`}
              >
                {collab.text.charAt(0)}
              </div>
            ))}
          </div>

          <Button size="sm" onClick={() => setShareOpen(true)} icon={Share2}>
            Share
          </Button>

          <button
            onClick={() => { setShowComments(!showComments); setShowVersions(false); }}
            className={`p-1.5 rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-white hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors relative
              ${showComments ? 'bg-[#E5E7EB]/50 dark:bg-[#0F172A] text-[#081B3A] dark:text-white' : ''}
            `}
            title="Comments Feed"
          >
            <MessageSquare size={14} />
            {doc.comments.length > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => { setShowVersions(!showVersions); setShowComments(false); }}
            className={`p-1.5 rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-white hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors
              ${showVersions ? 'bg-[#E5E7EB]/50 dark:bg-[#0F172A] text-[#081B3A] dark:text-white' : ''}
            `}
            title="Revision History"
          >
            <Clock size={14} />
          </button>
        </div>
      </div>

      {/* 2. MS Word style formatting sub-toolbar */}
      <div className="bg-[#F7FAFF] dark:bg-[#070B14] border-b border-[#E5E7EB] dark:border-white/10 px-4 py-1.5 flex flex-wrap items-center gap-1 transition-all shrink-0 select-none">
        
        {/* Undo / Redo */}
        <button onClick={() => applyFormat('undo')} className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#0F172A] text-[#6B7280]" title="Undo"><Play size={11} className="rotate-180" /></button>
        <button onClick={() => applyFormat('redo')} className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#0F172A] text-[#6B7280]" title="Redo"><Play size={11} /></button>
        
        <span className="w-[1px] h-3.5 bg-[#E5E7EB] dark:bg-white/10 mx-1.5" />

        {/* Formats selectors */}
        <button onClick={() => applyFormat('bold')} className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#0F172A] text-[#6B7280]" title="Bold"><Bold size={11} /></button>
        <button onClick={() => applyFormat('italic')} className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#0F172A] text-[#6B7280]" title="Italic"><Italic size={11} /></button>
        <button onClick={() => applyFormat('underline')} className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#0F172A] text-[#6B7280]" title="Underline"><Underline size={11} /></button>
        <button onClick={() => applyFormat('strikeThrough')} className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#0F172A] text-[#6B7280]" title="Strikethrough"><Strikethrough size={11} /></button>

        <span className="w-[1px] h-3.5 bg-[#E5E7EB] dark:bg-white/10 mx-1.5" />

        {/* Headings */}
        <button onClick={() => applyFormat('formatBlock', 'h1')} className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#0F172A] text-[#6B7280] flex items-center" title="Heading 1"><Heading1 size={11} /></button>
        <button onClick={() => applyFormat('formatBlock', 'h2')} className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#0F172A] text-[#6B7280] flex items-center" title="Heading 2"><Heading2 size={11} /></button>

        <span className="w-[1px] h-3.5 bg-[#E5E7EB] dark:bg-white/10 mx-1.5" />

        {/* Alignments */}
        <button onClick={() => applyFormat('justifyLeft')} className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#0F172A] text-[#6B7280]" title="Align Left"><AlignLeft size={11} /></button>
        <button onClick={() => applyFormat('justifyCenter')} className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#0F172A] text-[#6B7280]" title="Align Center"><AlignCenter size={11} /></button>
        <button onClick={() => applyFormat('justifyRight')} className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#0F172A] text-[#6B7280]" title="Align Right"><AlignRight size={11} /></button>

        <span className="w-[1px] h-3.5 bg-[#E5E7EB] dark:bg-white/10 mx-1.5" />

        {/* Inline Insert Utilities */}
        <button onClick={handleInsertComment} className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#0F172A] text-[#6B7280] flex items-center gap-0.5" title="Add Inline Comment"><MessageCircle size={11} /><span className="text-[9px] font-bold">Comment</span></button>
        <button onClick={() => applyFormat('createLink', 'https://collabdocs.io')} className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#0F172A] text-[#6B7280] flex items-center gap-0.5" title="Insert Link"><Link size={11} /><span className="text-[9px] font-bold">Link</span></button>

      </div>

      {/* 3. Main Workspace Core Layout split */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-[#F7FAFF] dark:bg-[#070B14] transition-colors">
        
        {/* Left: Document writing paper sheet */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
          <div className="w-full max-w-3xl flex flex-col">
            
            {/* Paper Sheet container */}
            <div 
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleContentChange}
              dangerouslySetInnerHTML={{ __html: doc.content }}
              className="flex-1 w-full bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 shadow-lg dark:shadow-none p-8 md:p-12 text-xs md:text-sm font-medium leading-relaxed rounded-xl text-left focus:outline-none dark:text-slate-100 max-h-[85vh] overflow-y-auto min-h-[500px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />

            {/* Simulated Live Cursor coordinate displays inside Editor */}
            <div className="mt-2 text-right">
              <span className="text-[9px] font-bold text-[#6B7280] dark:text-[#94A3B8]/60 uppercase tracking-widest">
                Characters: {content.replace(/<[^>]*>/g, '').length}
              </span>
            </div>

          </div>
        </div>

        {/* Right Panel drawers overlay */}
        {showComments && (
          <Comments
            docId={id}
            comments={doc.comments}
            onUpdate={triggerReload}
            onClose={() => setShowComments(false)}
          />
        )}

        {showVersions && (
          <VersionHistory
            docId={id}
            versions={doc.versions}
            onRestore={handleRestoreVersion}
            onUpdate={triggerReload}
            onClose={() => setShowVersions(false)}
          />
        )}

      </div>

      {/* Modal configurations */}
      <ShareDocumentModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        document={doc}
        onUpdate={triggerReload}
      />

    </div>
  );
}
