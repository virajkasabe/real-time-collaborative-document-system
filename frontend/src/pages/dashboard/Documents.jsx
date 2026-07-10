import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  FileText, 
  Star, 
  Trash2, 
  Plus, 
  Grid, 
  List, 
  Undo,
  MoreVertical,
  Edit,
  Share2,
  FolderOpen,
  FileSpreadsheet,
  FileDown,
  FileBadge,
  ChevronDown,
  X,
  AlertTriangle,
  File
} from 'lucide-react';
import Button from '../../components/common/Button';
import ShareDocumentModal from '../../components/modals/ShareDocumentModal';
import RenameDocumentModal from '../../components/modals/RenameDocumentModal';
import { documentService } from '../../services/documentService';
import { useAuth } from '../../context/AuthContext';
import { 
  createDoc, 
  fetchDocumentFolder, 
  restoreDoc, 
  docMoveToTrash, 
  fetchTrashFolder,
  deleteDoc 
} from '../../apis/api';

// Confirmation Dialog Component
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText, type = 'danger' }) => {
  if (!isOpen) return null;

  const getColorClasses = () => {
    switch(type) {
      case 'danger':
        return {
          button: 'bg-rose-500 hover:bg-rose-600 text-white',
          icon: 'text-rose-500',
          border: 'border-rose-500/20'
        };
      case 'warning':
        return {
          button: 'bg-amber-500 hover:bg-amber-600 text-white',
          icon: 'text-amber-500',
          border: 'border-amber-500/20'
        };
      case 'success':
        return {
          button: 'bg-emerald-500 hover:bg-emerald-600 text-white',
          icon: 'text-emerald-500',
          border: 'border-emerald-500/20'
        };
      default:
        return {
          button: 'bg-blue-500 hover:bg-blue-600 text-white',
          icon: 'text-blue-500',
          border: 'border-blue-500/20'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white dark:bg-[#0F172A] rounded-2xl max-w-md w-full border ${colors.border} shadow-2xl p-6 animate-scale-in`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-rose-500/10' : type === 'warning' ? 'bg-amber-500/10' : 'bg-emerald-500/10'} shrink-0`}>
            {type === 'danger' ? (
              <AlertTriangle size={24} className={colors.icon} />
            ) : type === 'warning' ? (
              <AlertTriangle size={24} className={colors.icon} />
            ) : (
              <File size={24} className={colors.icon} />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#081B3A] dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]/80 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1f2937] text-sm font-semibold text-[#6B7280] dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${colors.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Documents() {
  const { user, triggerToast } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  
  const { sidebarOpen, searchQuery } = useOutletContext();
  const [viewMode, setViewMode] = useState('list');
  const [dbVer, setDbVer] = useState(0);

  // Advanced Filtering States
  const [docTypeFilter, setDocTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [sortBy, setSortBy] = useState('Newest');

  // Custom Dropdowns Open State
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Modal interaction states
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [rawDocs, setRawDocs] = useState([]);
  const [trashDocs, setTrashDocs] = useState([]);

  // Confirmation Dialog States
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    type: 'danger',
    title: '',
    message: '',
    confirmText: '',
    onConfirm: null
  });

  // Reference for dropdown close handler
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (filter === 'starred') {
      setOnlyStarred(true);
    } else {
      setOnlyStarred(false);
    }
  }, [filter]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const triggerReload = () => setDbVer(prev => prev + 1);

  const fetDocuments = async() => {
    try {
      if (filter === 'trash') {
        const res = await fetchTrashFolder();
        // Handle different possible response structures
        const trashData = res.data.data?.trashFolder || res.data.data?.documentFolder || res.data.data || [];
        setTrashDocs(Array.isArray(trashData) ? trashData : []);
        setRawDocs([]);
      } else {
        const res = await fetchDocumentFolder();
        const docData = res.data.data?.documentFolder || res.data.data || [];
        setRawDocs(Array.isArray(docData) ? docData : []);
        setTrashDocs([]);
      }
    } catch (error) {
      triggerToast(error.message, 'warning');
    }
  }

  useEffect(() => {
    if (user) {
      fetDocuments();
    }
  }, [user, filter]);

  // Helper function to get document title
  const getDocTitle = (doc) => {
    return doc?.title || doc?.name || 'Untitled Document';
  };

  // Helper function to get owner name
  const getOwnerName = (doc) => {
    if (doc?.owner?.fullName) return doc.owner.fullName;
    if (doc?.owner?.name) return doc.owner.name;
    if (doc?.allUsers && Array.isArray(doc.allUsers)) {
      const owner = doc.allUsers.find(u => u.role === "Owner");
      return owner?.fullName || owner?.name || 'Unknown Owner';
    }
    return 'Unknown Owner';
  };

  // Helper function to get owner email
  const getOwnerEmail = (doc) => {
    if (doc?.owner?.email) return doc.owner.email;
    if (doc?.allUsers && Array.isArray(doc.allUsers)) {
      const owner = doc.allUsers.find(u => u.role === "Owner");
      return owner?.email;
    }
    return null;
  };

  // Helper function to get document ID
  const getDocId = (doc) => {
    return doc?._id || doc?.id;
  };

  const enrichedDocs = useMemo(() => {
    const docs = filter === 'trash' ? trashDocs : rawDocs;
    
    return docs.map((doc, idx) => {
      let fileType = 'DOCX';
      if (doc.category === 'spec') fileType = 'PDF';
      else if (doc.category === 'minutes') fileType = 'XLSX';
      else if (doc.category === 'proposal') fileType = 'DOCX';
      else {
        const types = ['DOCX', 'XLSX', 'PDF', 'PPTX', 'TXT'];
        fileType = types[idx % types.length];
      }
      
      let status = 'Active';
      if (doc.isTrash) status = 'Archived';
      else if (doc.starred) status = 'Review';
      else if (idx === 0) status = 'Active';
      else if (idx === 2) status = 'Draft';
      else {
        const statuses = ['Active', 'Draft', 'Review', 'Archived'];
        status = statuses[idx % statuses.length];
      }

      return {
        ...doc,
        fileType,
        status,
        // Ensure these fields exist for consistent access
        _id: getDocId(doc),
        title: getDocTitle(doc),
        ownerName: getOwnerName(doc),
        ownerEmail: getOwnerEmail(doc),
        updatedAt: doc.updatedAt || doc.lastModified || new Date().toISOString()
      };
    });
  }, [rawDocs, trashDocs, filter]);

  const filteredDocs = useMemo(() => {
    let list = enrichedDocs;

    if (searchQuery.trim()) {
      list = list.filter(d => 
        d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.ownerName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (docTypeFilter !== 'All') {
      list = list.filter(d => d.fileType === docTypeFilter);
    }

    if (statusFilter !== 'All') {
      list = list.filter(d => d.status === statusFilter);
    }

    if (ownerFilter !== 'All' && filter !== 'trash') {
      if (ownerFilter === 'Mine') {
        list = list.filter(d => d.ownerEmail === user?.email);
      } else if (ownerFilter === 'Shared') {
        list = list.filter(d => d.allUsers?.some(u => u.email === user?.email));
      } else if (ownerFilter === 'Team') {
        list = list.filter(d => d.allUsers?.length > 0);
      }
    }

    if (dateFilter !== 'All') {
      const now = new Date();
      list = list.filter(d => {
        const modDate = new Date(d.updatedAt);
        const diffTime = Math.abs(now - modDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (dateFilter === 'Today') {
          return diffDays <= 1;
        } else if (dateFilter === 'Last7') {
          return diffDays <= 7;
        } else if (dateFilter === 'Last30') {
          return diffDays <= 30;
        } else if (dateFilter === 'ThisMonth') {
          return modDate.getMonth() === now.getMonth() && modDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    if (onlyStarred && filter !== 'trash') {
      list = list.filter(d => d.starred);
    }

    list = [...list].sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      } else if (sortBy === 'Oldest') {
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      } else if (sortBy === 'NameAZ') {
        return (a.title || '').localeCompare(b.title || '');
      } else if (sortBy === 'NameZA') {
        return (b.title || '').localeCompare(a.title || '');
      } else if (sortBy === 'Recent') {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
      return 0;
    });

    return list;
  }, [enrichedDocs, searchQuery, docTypeFilter, statusFilter, ownerFilter, dateFilter, onlyStarred, sortBy, user, filter]);

  const hasActiveFilters = useMemo(() => {
    return docTypeFilter !== 'All' || statusFilter !== 'All' || ownerFilter !== 'All' || dateFilter !== 'All' || (onlyStarred && filter !== 'starred' && filter !== 'trash');
  }, [docTypeFilter, statusFilter, ownerFilter, dateFilter, onlyStarred, filter]);

  const handleClearFilters = () => {
    setDocTypeFilter('All');
    setStatusFilter('All');
    setOwnerFilter('All');
    setDateFilter('All');
    if (filter !== 'starred' && filter !== 'trash') setOnlyStarred(false);
    setSortBy('Newest');
    triggerToast('All filters reset', 'info');
  };

  const handleToggleStar = async (e, docId, currentState) => {
    e.stopPropagation();
    try {
      await documentService.star(docId, !currentState);
      triggerToast(currentState ? 'Document unstarred' : 'Document starred', 'success');
      triggerReload();
      await fetDocuments();
    } catch (error) {
      triggerToast('Failed to update star status', 'error');
    }
  };

  const handleMoveToTrash = async (docId) => {
    try {
      const res = await docMoveToTrash(docId);
      triggerToast(res.data.message || 'Document moved to trash', 'success');
      setActionMenuOpen(null);
      await fetDocuments();
      triggerReload();
    } catch (error) {
      triggerToast(error.message || 'Failed to move document to trash', 'error');
    }
  };

  const handleRestore = async (docId) => {
    try {
      const res = await restoreDoc(docId);
      triggerToast(res.data.data?.message || 'Document restored successfully', 'success');
      setActionMenuOpen(null);
      await fetDocuments();
      triggerReload();
    } catch (error) {
      triggerToast(error.message || 'Failed to restore document', 'error');
    }
  };

  const handlePermanentDelete = async (docId) => {
    try {
      const res = await deleteDoc(docId);
      triggerToast(res.data.message || 'Document permanently deleted', 'success');
      setActionMenuOpen(null);
      await fetDocuments();
      triggerReload();
    } catch (error) {
      triggerToast(error.message || 'Failed to delete document', 'error');
    }
  };

  // Confirmation Dialog Handlers
  const showConfirmation = (type, title, message, confirmText, onConfirm) => {
    setConfirmationDialog({
      isOpen: true,
      type,
      title,
      message,
      confirmText,
      onConfirm: () => {
        onConfirm();
        setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const closeConfirmation = () => {
    setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleTrashAction = (e, docId, docName) => {
    e.stopPropagation();
    showConfirmation(
      'warning',
      'Move to Trash?',
      `Are you sure you want to move "${docName || 'this document'}" to the trash? You can restore it later from the trash bin.`,
      'Move to Trash',
      () => handleMoveToTrash(docId)
    );
  };

  const handleRestoreAction = (e, docId, docName) => {
    e.stopPropagation();
    showConfirmation(
      'success',
      'Restore Document?',
      `Are you sure you want to restore "${docName || 'this document'}" from trash? It will be moved back to your documents.`,
      'Restore',
      () => handleRestore(docId)
    );
  };

  const handlePermanentDeleteAction = (e, docId, docName) => {
    e.stopPropagation();
    showConfirmation(
      'danger',
      'Permanently Delete?',
      `Are you sure you want to permanently delete "${docName || 'this document'}"? This action cannot be undone and the document will be lost forever.`,
      'Delete Permanently',
      () => handlePermanentDelete(docId)
    );
  };

  const handleCreateDocument = async() => {
    try {
      const newDoc = await createDoc('New Document', 'blank', user?.email, user?.fullName);
      if (newDoc.data.doc) {
        triggerToast('Document created successfully!', 'success');
        navigate(`/editor/${newDoc.data.doc._id}`);
      }
    } catch (error) {
      triggerToast('Failed to create document', 'error');
    }
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

  const renderTypeIcon = (type) => {
    switch (type) {
      case 'XLSX':
        return <FileSpreadsheet size={14} className="text-emerald-500 shrink-0" />;
      case 'PDF':
        return <FileDown size={14} className="text-rose-500 shrink-0" />;
      case 'PPTX':
        return <FileBadge size={14} className="text-amber-500 shrink-0" />;
      case 'TXT':
        return <FileText size={14} className="text-purple-500 shrink-0" />;
      default:
        return <FileText size={14} className="text-[#0D6EFD] shrink-0" />;
    }
  };

  const toggleDropdown = (e, menu) => {
    e.stopPropagation();
    setOpenDropdown(prev => prev === menu ? null : menu);
  };

  // Filter dropdown component for mobile
  const FilterDropdown = ({ label, value, options, onSelect, menuKey }) => (
    <div className="relative w-full">
      <button
        onClick={(e) => toggleDropdown(e, menuKey)}
        className="w-full h-10 px-3 rounded-[10px] border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[13px] font-semibold text-[#081B3A] dark:text-[#f8fafc] flex items-center justify-between cursor-pointer shadow-sm"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={12} className="text-[#6B7280] dark:text-slate-500 shrink-0 ml-2" />
      </button>
      {openDropdown === menuKey && (
        <div className="absolute top-[44px] left-0 w-full bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1f2937] rounded-[10px] shadow-xl py-1 z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-[#081B3A] dark:text-[#f8fafc] hover:bg-slate-50 dark:hover:bg-[#1e293b] transition-colors cursor-pointer"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="px-3 sm:px-4 md:px-5 pt-3 pb-4 md:pt-3.5 md:pb-6 space-y-3 max-w-7xl w-full mx-auto">
      {/* Header explorer control bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 select-none text-left border-b border-[#E5E7EB] dark:border-white/5 pb-2 transition-colors duration-300">
        <div className="space-y-0.5 w-full sm:w-auto">
          <h2 className="font-sans font-bold text-[18px] sm:text-[20px] md:text-[22px] text-[#081B3A] dark:text-white leading-tight normal-case tracking-tight transition-colors duration-300">
            {filter === 'trash' ? 'Trash Bin' : filter === 'starred' ? 'Starred documents' : filter === 'recent' ? 'Recent blueprints' : 'All Documents'}
          </h2>
          <p className="text-[12px] sm:text-[13px] font-normal text-[#6B7280] dark:text-[#94A3B8]/80 mt-0.5">
            {filteredDocs.length} document{filteredDocs.length === 1 ? '' : 's'} found
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto">
          {/* Layout mode switcher */}
          <div className="flex bg-[#E5E7EB] dark:bg-[#0F172A] p-0.75 rounded-lg border border-[#E5E7EB] dark:border-white/10 shadow-sm transition-all shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-[#070B14] text-[#0D6EFD] font-bold shadow-sm' : 'text-[#6B7280]'}`}
              title="List layout"
            >
              <List size={12} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-[#070B14] text-[#0D6EFD] font-bold shadow-sm' : 'text-[#6B7280]'}`}
              title="Grid layout"
            >
              <Grid size={12} />
            </button>
          </div>

          {filter !== 'trash' && (
            <Button size="sm" onClick={handleCreateDocument} icon={Plus} className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden xs:inline">New Document</span>
              <span className="xs:hidden">New</span>
            </Button>
          )}
        </div>
      </div>

      {/* ADVANCED FILTERS PANEL */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 bg-white dark:bg-[#0B0F19]/45 border border-[#E5E7EB] dark:border-white/5 rounded-xl p-2.5 shadow-sm select-none text-left">
        {/* Mobile: Filter toggle button */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-slate-50 dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1f2937] rounded-[10px] px-3 text-[13px] font-normal text-[#081B3A] dark:text-[#f8fafc] placeholder-[#6B7280]/60 dark:placeholder-[#94A3B8]/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="h-10 px-3 rounded-[10px] border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[13px] font-semibold text-[#081B3A] dark:text-[#f8fafc] flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
          >
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            )}
            <ChevronDown size={12} className={`text-[#6B7280] dark:text-slate-500 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Desktop: Full filter bar */}
        <div className="hidden lg:flex lg:flex-wrap lg:items-center gap-2 flex-1">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[140px] max-w-[200px]">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-slate-50 dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1f2937] rounded-[10px] px-3 text-[13px] font-normal text-[#081B3A] dark:text-[#f8fafc] placeholder-[#6B7280]/60 dark:placeholder-[#94A3B8]/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>

          {/* Document Type Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => toggleDropdown(e, 'type')}
              className="h-10 px-3 rounded-[10px] border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[13px] font-semibold text-[#081B3A] dark:text-[#f8fafc] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="truncate max-w-[80px]">{docTypeFilter === 'All' ? 'All Types' : docTypeFilter}</span>
              <ChevronDown size={12} className="text-[#6B7280] dark:text-slate-500 shrink-0" />
            </button>
            {openDropdown === 'type' && (
              <div className="absolute top-[44px] left-0 w-36 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1f2937] rounded-[10px] shadow-xl py-1 z-50 animate-fade-in-up">
                {['All Types', 'DOCX', 'PDF', 'XLSX', 'PPTX', 'TXT'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setDocTypeFilter(t === 'All Types' ? 'All' : t)}
                    className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-[#081B3A] dark:text-[#f8fafc] hover:bg-slate-50 dark:hover:bg-[#1e293b] transition-colors cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => toggleDropdown(e, 'status')}
              className="h-10 px-3 rounded-[10px] border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[13px] font-semibold text-[#081B3A] dark:text-[#f8fafc] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="truncate max-w-[80px]">{statusFilter === 'All' ? 'All Statuses' : statusFilter}</span>
              <ChevronDown size={12} className="text-[#6B7280] dark:text-slate-500 shrink-0" />
            </button>
            {openDropdown === 'status' && (
              <div className="absolute top-[44px] left-0 w-36 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1f2937] rounded-[10px] shadow-xl py-1 z-50 animate-fade-in-up">
                {['All Statuses', 'Active', 'Draft', 'Review', 'Archived'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s === 'All Statuses' ? 'All' : s)}
                    className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-[#081B3A] dark:text-[#f8fafc] hover:bg-slate-50 dark:hover:bg-[#1e293b] transition-colors cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Owner Dropdown - Hidden in trash */}
          {filter !== 'trash' && (
            <div className="relative">
              <button
                onClick={(e) => toggleDropdown(e, 'owner')}
                className="h-10 px-3 rounded-[10px] border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[13px] font-semibold text-[#081B3A] dark:text-[#f8fafc] flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span className="truncate max-w-[80px]">{ownerFilter === 'All' ? 'All Owners' : ownerFilter === 'Shared' ? 'Shared' : ownerFilter === 'Mine' ? 'Mine' : 'Team'}</span>
                <ChevronDown size={12} className="text-[#6B7280] dark:text-slate-500 shrink-0" />
              </button>
              {openDropdown === 'owner' && (
                <div className="absolute top-[44px] left-0 w-40 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1f2937] rounded-[10px] shadow-xl py-1 z-50 animate-fade-in-up">
                  {[
                    { label: 'All Owners', value: 'All' },
                    { label: 'Mine', value: 'Mine' },
                    { label: 'Shared With Me', value: 'Shared' },
                    { label: 'Team Documents', value: 'Team' }
                  ].map((o) => (
                    <button
                      key={o.value}
                      onClick={() => setOwnerFilter(o.value)}
                      className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-[#081B3A] dark:text-[#f8fafc] hover:bg-slate-50 dark:hover:bg-[#1e293b] transition-colors cursor-pointer"
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Last Modified Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => toggleDropdown(e, 'date')}
              className="h-10 px-3 rounded-[10px] border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[13px] font-semibold text-[#081B3A] dark:text-[#f8fafc] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="truncate max-w-[80px]">{dateFilter === 'All' ? 'Modified' : dateFilter === 'Last7' ? '7 Days' : dateFilter === 'Last30' ? '30 Days' : dateFilter === 'ThisMonth' ? 'This Month' : dateFilter}</span>
              <ChevronDown size={12} className="text-[#6B7280] dark:text-slate-500 shrink-0" />
            </button>
            {openDropdown === 'date' && (
              <div className="absolute top-[44px] left-0 w-36 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1f2937] rounded-[10px] shadow-xl py-1 z-50 animate-fade-in-up">
                {[
                  { label: 'Any Time', value: 'All' },
                  { label: 'Today', value: 'Today' },
                  { label: 'Last 7 Days', value: 'Last7' },
                  { label: 'Last 30 Days', value: 'Last30' },
                  { label: 'This Month', value: 'ThisMonth' }
                ].map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDateFilter(d.value)}
                    className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-[#081B3A] dark:text-[#f8fafc] hover:bg-slate-50 dark:hover:bg-[#1e293b] transition-colors cursor-pointer"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Starred Toggle - Hidden in trash */}
          {filter !== 'starred' && filter !== 'trash' && (
            <button
              onClick={() => setOnlyStarred(!onlyStarred)}
              className={`flex items-center gap-1 px-3 h-10 rounded-[10px] border text-[13px] font-semibold transition-all cursor-pointer shadow-sm shrink-0
                ${onlyStarred 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                  : 'bg-white dark:bg-[#111827] border-[#E5E7EB] dark:border-[#1f2937] text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-slate-50 dark:hover:bg-[#1e293b]'
                }
              `}
            >
              <Star size={11} fill={onlyStarred ? 'currentColor' : 'none'} />
              <span className="hidden 2xl:inline">Starred Only</span>
              <span className="2xl:hidden">Starred</span>
            </button>
          )}
        </div>

        {/* Sort & Clear - Desktop */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <div className="relative">
            <button
              onClick={(e) => toggleDropdown(e, 'sort')}
              className="h-10 px-3 rounded-[10px] border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[13px] font-semibold text-[#081B3A] dark:text-[#f8fafc] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="hidden sm:inline">{sortBy === 'Newest' ? 'Newest First' : sortBy === 'Oldest' ? 'Oldest First' : sortBy === 'NameAZ' ? 'A-Z' : sortBy === 'NameZA' ? 'Z-A' : 'Recent'}</span>
              <span className="sm:hidden">Sort</span>
              <ChevronDown size={12} className="text-[#6B7280] dark:text-slate-500 shrink-0" />
            </button>
            {openDropdown === 'sort' && (
              <div className="absolute top-[44px] right-0 w-36 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1f2937] rounded-[10px] shadow-xl py-1 z-50 animate-fade-in-up">
                {[
                  { label: 'Newest First', value: 'Newest' },
                  { label: 'Oldest First', value: 'Oldest' },
                  { label: 'Name A-Z', value: 'NameAZ' },
                  { label: 'Name Z-A', value: 'NameZA' },
                  { label: 'Recently Opened', value: 'Recent' }
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSortBy(s.value)}
                    className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-[#081B3A] dark:text-[#f8fafc] hover:bg-slate-50 dark:hover:bg-[#1e293b] transition-colors cursor-pointer"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="h-10 px-3 rounded-[10px] border border-[#E5E7EB] dark:border-rose-500/20 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 text-[13px] font-semibold transition-all cursor-pointer shadow-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filters Panel */}
      {mobileFiltersOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0B0F19]/45 border border-[#E5E7EB] dark:border-white/5 rounded-xl p-3 space-y-3 animate-fade-in-up">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[14px] text-[#081B3A] dark:text-[#f8fafc]">Filters</h3>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#1f2937]"
            >
              <X size={16} className="text-[#6B7280] dark:text-[#94A3B8]" />
            </button>
          </div>

          <FilterDropdown
            label="Document Type"
            value={docTypeFilter === 'All' ? 'All Types' : docTypeFilter}
            options={['All Types', 'DOCX', 'PDF', 'XLSX', 'PPTX', 'TXT'].map(t => ({ label: t, value: t === 'All Types' ? 'All' : t }))}
            onSelect={setDocTypeFilter}
            menuKey="mobile-type"
          />

          <FilterDropdown
            label="Status"
            value={statusFilter === 'All' ? 'All Statuses' : statusFilter}
            options={['All Statuses', 'Active', 'Draft', 'Review', 'Archived'].map(s => ({ label: s, value: s === 'All Statuses' ? 'All' : s }))}
            onSelect={setStatusFilter}
            menuKey="mobile-status"
          />

          {filter !== 'trash' && (
            <FilterDropdown
              label="Owner"
              value={ownerFilter === 'All' ? 'All Owners' : ownerFilter === 'Shared' ? 'Shared With Me' : ownerFilter === 'Mine' ? 'Mine' : 'Team Documents'}
              options={[
                { label: 'All Owners', value: 'All' },
                { label: 'Mine', value: 'Mine' },
                { label: 'Shared With Me', value: 'Shared' },
                { label: 'Team Documents', value: 'Team' }
              ]}
              onSelect={setOwnerFilter}
              menuKey="mobile-owner"
            />
          )}

          <FilterDropdown
            label="Date Modified"
            value={dateFilter === 'All' ? 'Any Time' : dateFilter === 'Last7' ? 'Last 7 Days' : dateFilter === 'Last30' ? 'Last 30 Days' : dateFilter === 'ThisMonth' ? 'This Month' : dateFilter}
            options={[
              { label: 'Any Time', value: 'All' },
              { label: 'Today', value: 'Today' },
              { label: 'Last 7 Days', value: 'Last7' },
              { label: 'Last 30 Days', value: 'Last30' },
              { label: 'This Month', value: 'ThisMonth' }
            ]}
            onSelect={setDateFilter}
            menuKey="mobile-date"
          />

          <FilterDropdown
            label="Sort By"
            value={sortBy === 'Newest' ? 'Newest First' : sortBy === 'Oldest' ? 'Oldest First' : sortBy === 'NameAZ' ? 'Name A-Z' : sortBy === 'NameZA' ? 'Name Z-A' : 'Recently Opened'}
            options={[
              { label: 'Newest First', value: 'Newest' },
              { label: 'Oldest First', value: 'Oldest' },
              { label: 'Name A-Z', value: 'NameAZ' },
              { label: 'Name Z-A', value: 'NameZA' },
              { label: 'Recently Opened', value: 'Recent' }
            ]}
            onSelect={setSortBy}
            menuKey="mobile-sort"
          />

          {filter !== 'starred' && filter !== 'trash' && (
            <button
              onClick={() => setOnlyStarred(!onlyStarred)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-[10px] border text-[13px] font-semibold transition-all cursor-pointer
                ${onlyStarred 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                  : 'bg-white dark:bg-[#111827] border-[#E5E7EB] dark:border-[#1f2937] text-[#6B7280] dark:text-[#94A3B8]'
                }
              `}
            >
              <Star size={14} fill={onlyStarred ? 'currentColor' : 'none'} />
              <span>Starred Only</span>
            </button>
          )}

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="w-full h-10 rounded-[10px] border border-[#E5E7EB] dark:border-rose-500/20 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 text-[13px] font-semibold transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* ACTIVE FILTER CHIPS */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-left animate-fade-in-up">
          <span className="text-[13px] font-medium text-[#6B7280] dark:text-slate-500 pl-0.5 hidden sm:inline">Active filters:</span>
          
          {docTypeFilter !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-[12px] sm:text-[13px] font-semibold border border-blue-500/10 shadow-sm">
              <span>{docTypeFilter}</span>
              <button onClick={() => setDocTypeFilter('All')} className="hover:text-blue-700 font-bold ml-1 cursor-pointer">×</button>
            </span>
          )}

          {statusFilter !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-[12px] sm:text-[13px] font-semibold border border-emerald-500/10 shadow-sm">
              <span>{statusFilter}</span>
              <button onClick={() => setStatusFilter('All')} className="hover:text-emerald-700 font-bold ml-1 cursor-pointer">×</button>
            </span>
          )}

          {ownerFilter !== 'All' && filter !== 'trash' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500 dark:text-purple-400 text-[12px] sm:text-[13px] font-semibold border border-purple-500/10 shadow-sm">
              <span>{ownerFilter === 'Shared' ? 'Shared With Me' : ownerFilter === 'Mine' ? 'Mine' : 'Team'}</span>
              <button onClick={() => setOwnerFilter('All')} className="hover:text-purple-700 font-bold ml-1 cursor-pointer">×</button>
            </span>
          )}

          {dateFilter !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-500 dark:text-pink-400 text-[12px] sm:text-[13px] font-semibold border border-pink-500/10 shadow-sm">
              <span>{dateFilter === 'Last7' ? 'Last 7 Days' : dateFilter === 'Last30' ? 'Last 30 Days' : dateFilter === 'ThisMonth' ? 'This Month' : dateFilter}</span>
              <button onClick={() => setDateFilter('All')} className="hover:text-pink-700 font-bold ml-1 cursor-pointer">×</button>
            </span>
          )}

          {onlyStarred && filter !== 'starred' && filter !== 'trash' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 text-[12px] sm:text-[13px] font-semibold border border-amber-500/10 shadow-sm">
              <span>Starred</span>
              <button onClick={() => setOnlyStarred(false)} className="hover:text-amber-700 font-bold ml-1 cursor-pointer">×</button>
            </span>
          )}

          <button
            onClick={handleClearFilters}
            className="text-[12px] sm:text-[13px] font-medium text-rose-500 hover:text-rose-600 ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Document list display */}
      {filteredDocs.length === 0 ? (
        <div className="py-16 sm:py-20 md:py-24 border border-dashed border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0B0F19]/20 rounded-2xl text-center text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8]/60 transition-all select-none">
          {filter === 'trash' 
            ? 'Trash bin is empty. Deleted documents will appear here.' 
            : 'No documents matching filters found.'}
        </div>
      ) : viewMode === 'list' ? (
        // LIST LAYOUT
        <div className="space-y-2 select-none text-left bg-white dark:bg-[#0B0F19]/45 border border-[#E5E7EB] dark:border-white/5 rounded-2xl p-2 sm:p-3.5 shadow-sm">
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              onClick={() => filter !== 'trash' && navigate(`/editor/${doc._id}`)}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-white dark:bg-[#0F172A]/20 border border-[#E5E7EB] dark:border-white/5 hover:bg-[#F7FAFF] dark:hover:bg-[#0F172A]/50 hover:border-blue-500/30 dark:hover:border-blue-500/20 rounded-xl transition-all duration-200 gap-2 sm:gap-3 ${filter !== 'trash' ? 'cursor-pointer group' : 'cursor-default'}`}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="shrink-0">{renderTypeIcon(doc.fileType)}</div>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-[13px] sm:text-[14px] text-[#081B3A] dark:text-slate-200 group-hover:text-[#0D6EFD] dark:group-hover:text-white transition-colors truncate block">
                    {doc.title}
                  </span>
                  <div className="text-[10px] sm:text-[11px] font-medium text-[#6B7280] dark:text-[#94A3B8]/80 block mt-0.5 leading-none transition-colors">
                    Owner: <span className="text-[11px] sm:text-[12.5px] font-medium text-[#081B3A] dark:text-slate-200">
                      {doc.ownerName}
                    </span> • Updated {new Date(doc.updatedAt).toLocaleDateString()}
                    {doc.isTrash && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-semibold">
                        In Trash
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                {filter === 'trash' ? (
                  <>
                    <button
                      onClick={(e) => handleRestoreAction(e, doc._id, doc.title)}
                      className="p-1.5 rounded text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                      title="Restore"
                    >
                      <Undo size={14} />
                    </button>
                    <button
                      onClick={(e) => handlePermanentDeleteAction(e, doc._id, doc.title)}
                      className="p-1.5 rounded text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Permanently"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => handleToggleStar(e, doc._id, doc.starred)}
                      className="p-1 rounded text-[#6B7280] dark:text-[#94A3B8] hover:text-amber-500 transition-colors cursor-pointer"
                      title={doc.starred ? 'Unstar' : 'Star'}
                    >
                      <Star size={13} fill={doc.starred ? 'currentColor' : 'none'} className={doc.starred ? 'text-amber-500' : ''} />
                    </button>
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionMenuOpen(actionMenuOpen === doc._id ? null : doc._id);
                        }}
                        className="p-1 rounded text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors cursor-pointer"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {actionMenuOpen === doc._id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 shadow-lg p-1 z-50 rounded-lg text-xs font-semibold select-none text-left">
                          <button
                            onClick={(e) => openRenameModal(e, doc)}
                            className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[#E5E7EB]/40 dark:hover:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB]"
                          >
                            <Edit size={11} />
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
                            onClick={(e) => handleTrashAction(e, doc._id, doc.title)}
                            className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 border-t border-[#E5E7EB] dark:border-white/10 mt-0.5"
                          >
                            <Trash2 size={11} />
                            <span>Move to Trash</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // GRID LAYOUT
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 select-none text-left">
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              onClick={() => filter !== 'trash' && navigate(`/editor/${doc._id}`)}
              className={`glass-card p-3 sm:p-4 border border-[#E5E7EB] dark:border-white/5 bg-white dark:bg-[#0F172A]/40 hover:bg-[#F7FAFF] dark:hover:bg-[#0F172A] hover:border-[#E5E7EB] dark:hover:border-white/20 rounded-xl transition-all duration-300 space-y-3 flex flex-col justify-between shadow-sm hover:scale-[1.01] ${filter !== 'trash' ? 'cursor-pointer group' : 'cursor-default'}`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  {renderTypeIcon(doc.fileType)}
                  {filter !== 'trash' && (
                    <button
                      onClick={(e) => handleToggleStar(e, doc._id, doc.starred)}
                      className="p-1 rounded text-[#6B7280] dark:text-[#94A3B8] hover:text-amber-500 transition-colors cursor-pointer"
                      title={doc.starred ? 'Unstar' : 'Star'}
                    >
                      <Star size={12} fill={doc.starred ? 'currentColor' : 'none'} className={doc.starred ? 'text-amber-500' : ''} />
                    </button>
                  )}
                </div>
                <div className="space-y-0.5">
                  <h5 className="font-semibold text-[13px] sm:text-[14px] text-[#081B3A] dark:text-slate-200 group-hover:text-[#0D6EFD] dark:group-hover:text-white transition-colors truncate">
                    {doc.title}
                  </h5>
                  <p className="text-[10px] sm:text-[11px] font-medium text-[#6B7280] dark:text-[#94A3B8]/80 leading-none mt-0.5 truncate">
                    {doc.fileType} • Owner: <span className="text-[11px] sm:text-[12.5px] font-medium text-[#081B3A] dark:text-slate-200">
                      {doc.ownerName}
                    </span>
                  </p>
                  {doc.isTrash && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-semibold">
                      In Trash
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] sm:text-[13px] font-normal text-[#6B7280] dark:text-[#94A3B8]/80 pt-2 border-t border-[#E5E7EB] dark:border-white/10 transition-colors duration-300">
                <span className="truncate">Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
                {filter === 'trash' ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleRestoreAction(e, doc._id, doc.title)}
                      className="text-emerald-500 hover:bg-emerald-500/10 p-1 rounded transition-colors cursor-pointer"
                      title="Restore"
                    >
                      <Undo size={11} />
                    </button>
                    <button
                      onClick={(e) => handlePermanentDeleteAction(e, doc._id, doc.title)}
                      className="text-rose-500 hover:bg-rose-500/10 p-1 rounded transition-colors cursor-pointer"
                      title="Delete Permanently"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => handleTrashAction(e, doc._id, doc.title)}
                    className="text-rose-500 hover:bg-rose-500/10 p-1 rounded transition-colors cursor-pointer"
                    title="Move to Trash"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        confirmText={confirmationDialog.confirmText}
        type={confirmationDialog.type}
      />

      {/* POPUPS & DIALOGS */}
      {selectedDoc && (
        <ShareDocumentModal
          isOpen={shareOpen}
          onClose={() => { setShareOpen(false); setSelectedDoc(null); }}
          document={selectedDoc}
          onUpdate={triggerReload}
        />
      )}

      {selectedDoc && (
        <RenameDocumentModal
          isOpen={renameOpen}
          onClose={() => { setRenameOpen(false); setSelectedDoc(null); }}
          document={selectedDoc}
          onRename={triggerReload}
        />
      )}
    </div>
  );
}