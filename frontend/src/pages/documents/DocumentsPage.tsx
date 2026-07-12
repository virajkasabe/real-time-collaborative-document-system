import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { documentService } from '../../services/documentService';
import ImportDocButton from '../../components/common/ImportDocButton';
import { importDocFile } from '../../utils/importFile';
import { 
  FileText, Search, Star, Trash2, LogOut, Moon, Sun, 
  Plus, Share2, Folder, Clock, ShieldAlert, CheckCircle, RotateCcw, Upload
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function DocumentsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState<string>('all'); // all, starred, shared, trash
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['doc', 'docx'].includes(ext || '')) {
      toast.error('Only .doc and .docx files are supported');
      return;
    }

    const toastId = toast.loading('Importing document...');
    try {
      const newDoc = await importDocFile(file, {
        fullName: user?.fullName,
        email: user?.email
      });
      toast.success(`"${newDoc.name}" imported successfully!`, { id: toastId });
      loadDocuments();
      navigate(`/editor/${newDoc.id}`);
    } catch (err: any) {
      console.error('Drop import error:', err);
      toast.error(err.message || 'Failed to import document', { id: toastId });
    }
  };
  
  const categories = [
    { id: 'all', label: 'All Formats' },
    { id: 'blank', label: 'Blank Drafts' },
    { id: 'proposal', label: 'Proposals' },
    { id: 'spec', label: 'Specifications' },
    { id: 'minutes', label: 'Meeting Notes' }
  ];

  const loadDocuments = () => {
    let docs = [];
    if (filter === 'starred') {
      docs = documentService.getStarred();
    } else if (filter === 'shared') {
      docs = documentService.getShared(user?.email || 'eleanor@company.com');
    } else if (filter === 'trash') {
      docs = documentService.getTrash();
    } else {
      docs = documentService.getAll();
    }
    setDocuments(docs);
  };

  useEffect(() => {
    loadDocuments();
  }, [filter, user]);

  const handleCreateDocument = () => {
    const title = prompt('Enter document title:', 'Untitled Document');
    if (title === null) return; // cancel
    const newDoc = documentService.create(title.trim() || 'Untitled Document', 'blank', user?.email, user?.fullName);
    toast.success('Document created!');
    navigate(`/editor/${newDoc.id}`);
  };

  const handleToggleStar = (id: string, e: React.MouseEvent, currentStarred: boolean) => {
    e.stopPropagation();
    documentService.star(id, !currentStarred);
    loadDocuments();
    toast.success(!currentStarred ? 'Starred successfully!' : 'Unstarred successfully!');
  };

  const handleDeleteDocument = (id: string, e: React.MouseEvent, isTrashMode: boolean) => {
    e.stopPropagation();
    const success = documentService.delete(id);
    if (success) {
      loadDocuments();
      toast.success(isTrashMode ? 'Permanently deleted!' : 'Moved to Trash!');
    }
  };

  const handleRestoreDocument = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = documentService.restore(id);
    if (success) {
      loadDocuments();
      toast.success('Document restored!');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      toast.error('Failed to log out');
    }
  };

  // Search + Category filtering logic
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#070B14] text-[#E5E7EB] font-sans flex flex-col">
      
      {/* 1. Header Toolbar */}
      <header className="border-b border-white/5 bg-[#0B1220] py-3.5 px-4 sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileText className="text-white" size={18} />
            </div>
            <span className="font-black text-sm sm:text-base tracking-tight text-white uppercase bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">CollabDocs</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            
            <div className="h-5 w-[1px] bg-white/5 mx-1" />

            <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition" onClick={() => navigate('/profile')}>
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.fullName} 
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/20"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-extrabold uppercase">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
              )}
              <span className="hidden sm:inline text-xs font-bold text-slate-300">{user?.fullName || 'Member'}</span>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Content Layout */}
      <main 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 min-h-0 relative transition-all ${
          isDragging ? 'ring-2 ring-blue-500 ring-inset bg-blue-500/5' : ''
        }`}
      >
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 pointer-events-none bg-[#070B14]/85 backdrop-blur-sm rounded-2xl">
            <Upload size={48} className="text-blue-400 animate-bounce" />
            <p className="text-blue-300 text-lg font-semibold animate-pulse">Drop your .docx file here</p>
          </div>
        )}
        
        {/* Left Side: Navigation Links */}
        <aside className="w-full lg:w-60 flex-shrink-0 flex flex-col gap-6">
          <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-4 space-y-1 text-left">
            <button 
              onClick={() => setFilter('all')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Folder size={15} /> All Documents
            </button>

            <button 
              onClick={() => setFilter('shared')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === 'shared' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Share2 size={15} /> Shared with me
            </button>

            <button 
              onClick={() => setFilter('starred')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === 'starred' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Star size={15} /> Starred Documents
            </button>

            <button 
              onClick={() => setFilter('trash')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === 'trash' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trash2 size={15} /> Trash Bin
            </button>
          </div>
        </aside>

        {/* Right Side: Grid & Content */}
        <section className="flex-1 flex flex-col gap-6 min-h-0">
          
          {/* Top Filter and Actions Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
              <input
                type="text"
                placeholder="Search documents by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs transition"
              />
            </div>

            {/* Creation Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <ImportDocButton />

              <button
                onClick={handleCreateDocument}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                <Plus size={15} /> New Document
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 pb-0.5 overflow-x-auto scrollbar-none border-b border-white/5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 border-b-2 text-[10px] font-bold tracking-tight whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Document list render */}
          <div className="flex-1 min-h-0">
            {filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 bg-[#0F172A] border border-white/5 rounded-2xl p-8">
                <FileText size={36} className="mb-4 text-slate-700" />
                <p className="font-bold text-sm text-white">No documents match search criteria</p>
                <p className="text-xs text-gray-400 mt-2 max-w-sm">
                  {filter === 'starred'
                    ? 'No starred documents yet. Click the ★ on any document to star it.'
                    : filter === 'shared'
                    ? 'No documents have been shared with you yet.'
                    : filter === 'trash'
                    ? 'Trash bin is empty. Deleted documents will appear here.'
                    : 'No documents found. Create your first document!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 text-left">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      if (!doc.trash) {
                        navigate(`/editor/${doc.id}`);
                      }
                    }}
                    className={`bg-[#0F172A] border rounded-2xl p-5 flex flex-col justify-between h-44 transition group cursor-pointer ${
                      doc.trash ? 'border-white/5 opacity-70' : 'border-white/5 hover:border-white/10 hover:shadow-xl hover:shadow-black/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="text-blue-500 shrink-0" size={16} />
                          <h4 className="font-bold text-xs text-white truncate leading-tight group-hover:text-blue-400 transition">
                            {doc.name}
                          </h4>
                        </div>
                        {!doc.trash && (
                          <button
                            onClick={(e) => handleToggleStar(doc.id, e, doc.starred)}
                            className="text-slate-500 hover:text-yellow-400 transition cursor-pointer"
                          >
                            <Star size={13} className={doc.starred ? 'fill-yellow-400 text-yellow-400' : ''} />
                          </button>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-400">
                          {doc.category || 'blank'}
                        </span>
                        {doc.sharedUsers?.length > 0 && (
                          <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                            Co-authoring
                          </span>
                        )}
                        {doc.isImported && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <FileText size={10} />
                            Imported
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3.5 flex items-center justify-between text-[10px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} />
                        <span>{doc.updatedAt || 'Just now'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {doc.trash ? (
                          <>
                            <button
                              onClick={(e) => handleRestoreDocument(doc.id, e)}
                              className="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded transition cursor-pointer"
                              title="Restore Document"
                            >
                              <RotateCcw size={12} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteDocument(doc.id, e, true)}
                              className="p-1 hover:bg-red-500/20 text-red-400 rounded transition cursor-pointer"
                              title="Delete Permanently"
                            >
                              <Trash2 size={12} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={(e) => handleDeleteDocument(doc.id, e, false)}
                            className="p-1 hover:bg-red-500/20 text-red-400 rounded transition cursor-pointer opacity-0 group-hover:opacity-100"
                            title="Move to Trash"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>

      </main>

    </div>
  );
}
