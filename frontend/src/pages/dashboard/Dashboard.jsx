import  { useState, useEffect, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Download, 
  Upload, 
  Users, 
  Star, 
  Trash2, 
  MoreVertical, 
  ArrowUpDown, 
  Share2, 
  FolderOpen, 
  Copy, 
  Edit, 
  CheckSquare, 
  Square, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  FileSpreadsheet,
  FileDown,
  FileBadge,
  ChevronDown,
  Inbox
} from 'lucide-react';
import ShareDocumentModal from '../../components/modals/ShareDocumentModal';
import RenameDocumentModal from '../../components/modals/RenameDocumentModal';
import { documentService } from '../../services/documentService';
import { useAuth } from '../../context/AuthContext';
import { createDoc, deleteDoc, fetchDocumentFolder } from '../../apis/api';

export default function Dashboard() {
  const { user, triggerToast } = useAuth();
  const navigate = useNavigate();
  const { sidebarOpen, searchQuery } = useOutletContext();
  
  // State
  const [rawDocs, setRawDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbVer, setDbVer] = useState(0);
  const [statusFilter, setStatusFilter] = useState('All');
  const [docTypeFilter, setDocTypeFilter] = useState('All');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [sortColumn, setSortColumn] = useState('lastModified');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedDocIds, setSelectedDocIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [rowMenuOpen, setRowMenuOpen] = useState(null);

  // Click outside handler
  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdown(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Fetch documents
  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user, dbVer]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const payload = await fetchDocumentFolder();
      const documents = payload?.data?.data?.documentFolder || [];
      setRawDocs(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setRawDocs([]);
      triggerToast('Failed to load documents', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerReload = () => {
    setDbVer(prev => prev + 1);
    setSelectedDocIds(new Set());
  };

  const toggleDropdown = (e, menu) => {
    e.stopPropagation();
    setOpenDropdown(prev => prev === menu ? null : menu);
  };

  // Enriched documents with file types & status
  const enrichedDocs = useMemo(() => {
    if (!rawDocs.length) return [];
    
    return rawDocs.map((doc, idx) => {
      let fileType = 'DOCX';
      if (doc.category === 'spec') fileType = 'PDF';
      else if (doc.category === 'minutes') fileType = 'XLSX';
      else if (doc.category === 'proposal') fileType = 'DOCX';
      else {
        const types = ['DOCX', 'XLSX', 'PDF', 'PPTX'];
        fileType = types[idx % types.length];
      }

      let status = 'Active';
      if (doc.trash) status = 'Archived';
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
        status
      };
    });
  }, [rawDocs]);

  // Filtering
  const filteredDocs = useMemo(() => {
    let list = enrichedDocs;

    if (searchQuery.trim()) {
      list = list.filter(d => 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      list = list.filter(d => d.status === statusFilter);
    }

    if (docTypeFilter !== 'All') {
      list = list.filter(d => d.fileType === docTypeFilter);
    }

    return list;
  }, [enrichedDocs, searchQuery, statusFilter, docTypeFilter]);

  // Sorting
  const sortedDocs = useMemo(() => {
    const sorted = [...filteredDocs];
    if (!sortColumn || !sorted.length) return sorted;

    sorted.sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (sortColumn === 'owner') {
        valA = a.owner?.name || '';
        valB = b.owner?.name || '';
      }

      if (sortColumn === 'lastModified') {
        return sortDirection === 'asc' 
          ? new Date(a.lastModified) - new Date(b.lastModified)
          : new Date(b.lastModified) - new Date(a.lastModified);
      }

      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return 0;
    });

    return sorted;
  }, [filteredDocs, sortColumn, sortDirection]);

  // Pagination
  const totalItems = sortedDocs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedDocs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedDocs.slice(start, start + itemsPerPage);
  }, [sortedDocs, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalItems, totalPages, currentPage]);

  // Handlers
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectRow = (e, id) => {
    e.stopPropagation();
    setSelectedDocIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isPageAllSelected = paginatedDocs.length > 0 && paginatedDocs.every(d => selectedDocIds.has(d._id));

  const handleSelectAll = () => {
    setSelectedDocIds(prev => {
      const next = new Set(prev);
      if (isPageAllSelected) {
        paginatedDocs.forEach(d => next.delete(d._id));
      } else {
        paginatedDocs.forEach(d => next.add(d._id));
      }
      return next;
    });
  };

  const handleToggleStar = (e, docId, starred) => {
    e.stopPropagation();
    documentService.star(docId, !starred);
    triggerToast(starred ? 'Removed star' : 'Starred document', 'info');
    triggerReload();
  };

  const handleDuplicate = async (e, doc) => {
    e.stopPropagation();
    const newDoc = await createDoc(`Copy of ${doc.title}`, doc.category, user?.email, user?.name);
    if (newDoc) {
      triggerToast(`Duplicated: ${doc.title}`, 'success');
      setRowMenuOpen(null);
      triggerReload();
    }
  };

  const handleDelete = async (e, docId) => {
    e.stopPropagation();
    await deleteDoc(docId);
    triggerToast('Moved file to trash', 'info');
    setRowMenuOpen(null);
    triggerReload();
  };

  const openShare = (e, doc) => {
    e.stopPropagation();
    setSelectedDoc(doc);
    setShareOpen(true);
    setRowMenuOpen(null);
  };

  const openRename = (e, doc) => {
    e.stopPropagation();
    setSelectedDoc(doc);
    setRenameOpen(true);
    setRowMenuOpen(null);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedDocIds) {
      await deleteDoc(id);
    }
    triggerToast(`Moved ${selectedDocIds.size} files to Trash`, 'success');
    triggerReload();
  };

  const handleBulkShare = () => {
    triggerToast(`Sharing panel active for ${selectedDocIds.size} files`, 'info');
  };

  const handleBulkMove = () => {
    triggerToast(`Move wizard opened for ${selectedDocIds.size} items`, 'info');
  };

  const createDocumentWithType = async (name, type, cat) => {
    const doc = await createDoc(name, cat, user?.email, user?.name);
    if (doc) {
      triggerToast(`Created new ${type} Document`, 'success');
      navigate(`/editor/${doc._id}`);
    }
  };

  // Quick Action Cards
  const quickActionCards = [
    {
      title: 'New Document',
      desc: 'Create custom workspace',
      icon: Plus,
      color: 'text-[#0D6EFD] bg-[#0D6EFD]/10',
      action: () => createDocumentWithType('New Workspace Document', 'DOCX', 'proposal')
    },
    {
      title: 'Blank Document',
      desc: 'Start clean draft canvas',
      icon: FileText,
      color: 'text-purple-500 bg-purple-500/10',
      action: () => createDocumentWithType('Untitled Document', 'DOCX', 'blank')
    },
    {
      title: 'Import Document',
      desc: 'Import markdown/HTML specs',
      icon: Download,
      color: 'text-amber-500 bg-amber-500/10',
      action: () => triggerToast('Select Markdown or HTML file to import', 'info')
    },
    {
      title: 'Upload File',
      desc: 'Store cloud backups',
      icon: Upload,
      color: 'text-emerald-500 bg-emerald-500/10',
      action: () => triggerToast('Upload document files (PDF/DOCX)', 'info')
    },
    {
      title: 'Shared Documents',
      desc: 'Access team shared files',
      icon: Users,
      color: 'text-pink-500 bg-pink-500/10',
      action: () => navigate('/shared')
    }
  ];

  // Helper Functions
  const renderTypeIcon = (type) => {
    switch (type) {
      case 'XLSX':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 shadow-sm border border-emerald-500/10">
            <FileSpreadsheet size={15} />
          </div>
        );
      case 'PDF':
        return (
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 shadow-sm border border-rose-500/10">
            <FileDown size={15} />
          </div>
        );
      case 'PPTX':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 shadow-sm border border-amber-500/10">
            <FileBadge size={15} />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 shadow-sm border border-blue-500/10">
            <FileText size={15} />
          </div>
        );
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-sm">
            Active
          </span>
        );
      case 'Review':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 shadow-sm">
            Review
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25 shadow-sm">
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/25 shadow-sm">
            Archived
          </span>
        );
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="px-5 pt-3.5 pb-6 md:px-6 md:pt-4 md:pb-8 max-w-7xl w-full mx-auto">
        <div className="space-y-0.5 text-left mb-5 pb-2 border-b border-[#E5E7EB] dark:border-white/5">
          <div className="h-8 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="h-4 w-56 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-1"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="h-[52px] bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
        
        <div className="bg-white dark:bg-[#0B0F19]/45 border border-[#E5E7EB] dark:border-white/5 rounded-2xl p-4 mt-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty State - No Documents
  if (!isLoading && rawDocs.length === 0) {
    return (
      <div className="px-5 pt-3.5 pb-6 md:px-6 md:pt-4 md:pb-8 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="space-y-0.5 text-left mb-5 select-none pb-2 border-b border-[#E5E7EB] dark:border-white/5">
          <h1 className="font-sans font-bold text-[22px] text-[#081B3A] dark:text-white leading-tight tracking-tight">
            Documents
          </h1>
          <p className="text-[13px] font-normal text-[#6B7280] dark:text-[#94A3B8]/80 mt-0.5">
            Manage and organize your workspace.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 text-left">
          <h4 className="font-sans font-semibold text-[15px] tracking-tight text-[#081B3A] dark:text-white px-0.5">
            Quick Actions
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {quickActionCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  onClick={card.action}
                  className="glass-card p-2 px-3 border border-[#E5E7EB] dark:border-white/5 bg-white dark:bg-[#0F172A]/40 transition-all duration-300 ease-in-out cursor-pointer flex items-center gap-3 group relative rounded-xl min-h-[52px] py-2 min-w-[120px] hover:border-[#0D6EFD]/35 dark:hover:border-blue-500/25 hover:shadow-[0_0_15px_rgba(13,110,253,0.12)] hover:scale-[1.01] hover:-translate-y-0.5"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-sm ${card.color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1 text-left py-0.5">
                    <h5 className="font-semibold text-[13.5px] text-[#081B3A] dark:text-slate-200 leading-tight group-hover:text-blue-500 dark:group-hover:text-white transition-colors break-words">
                      {card.title}
                    </h5>
                    <p className="text-[11.5px] text-[#6B7280] dark:text-[#94A3B8]/70 font-normal leading-normal break-words mt-0.5">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State Card */}
        <div className="bg-white dark:bg-[#0B0F19]/45 border border-[#E5E7EB] dark:border-white/5 rounded-2xl p-8 mt-4">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 rounded-full bg-[#0D6EFD]/10 flex items-center justify-center mb-6">
              <Inbox size={40} className="text-[#0D6EFD]" />
            </div>
            <h3 className="text-2xl font-bold text-[#081B3A] dark:text-white mb-3">
              No Documents Yet
            </h3>
            <p className="text-[#6B7280] dark:text-[#94A3B8]/80 text-center max-w-md mb-8">
              Get started by creating your first document. You can create a new document from scratch, import existing files, or upload documents from your device.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => createDocumentWithType('New Workspace Document', 'DOCX', 'proposal')}
                className="px-6 py-2.5 bg-[#0D6EFD] text-white rounded-lg font-semibold hover:bg-[#0D6EFD]/90 transition-colors flex items-center gap-2 shadow-lg shadow-[#0D6EFD]/20"
              >
                <Plus size={18} />
                Create Document
              </button>
              <button
                onClick={() => triggerToast('Import document feature coming soon', 'info')}
                className="px-6 py-2.5 border border-[#E5E7EB] dark:border-white/10 text-[#6B7280] dark:text-[#94A3B8] rounded-lg font-semibold hover:bg-[#F7FAFF] dark:hover:bg-[#0F172A] transition-colors flex items-center gap-2"
              >
                <Upload size={18} />
                Import File
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Render with Documents
  return (
    <div className="px-5 pt-3.5 pb-6 md:px-6 md:pt-4 md:pb-8 space-y-4 max-w-7xl w-full mx-auto">
      {/* Dashboard Page Header */}
      <div className="space-y-0.5 text-left mb-5 select-none pb-2 border-b border-[#E5E7EB] dark:border-white/5 transition-colors duration-300">
        <h1 className="font-sans font-bold text-[22px] text-[#081B3A] dark:text-white leading-tight tracking-tight">
          Documents
        </h1>
        <p className="text-[13px] font-normal text-[#6B7280] dark:text-[#94A3B8]/80 mt-0.5">
          Manage and organize your workspace.
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="space-y-2 text-left">
        <h4 className="font-sans font-semibold text-[15px] tracking-tight text-[#081B3A] dark:text-white px-0.5">
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {quickActionCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={card.action}
                className="glass-card p-2 px-3 border border-[#E5E7EB] dark:border-white/5 bg-white dark:bg-[#0F172A]/40 transition-all duration-300 ease-in-out cursor-pointer flex items-center gap-3 group relative rounded-xl min-h-[52px] py-2 min-w-[120px] hover:border-[#0D6EFD]/35 dark:hover:border-blue-500/25 hover:shadow-[0_0_15px_rgba(13,110,253,0.12)] hover:scale-[1.01] hover:-translate-y-0.5"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-sm ${card.color}`}>
                  <Icon size={14} />
                </div>
                <div className="min-w-0 flex-1 text-left py-0.5">
                  <h5 className="font-semibold text-[13.5px] text-[#081B3A] dark:text-slate-200 leading-tight group-hover:text-blue-500 dark:group-hover:text-white transition-colors break-words">
                    {card.title}
                  </h5>
                  <p className="text-[11.5px] text-[#6B7280] dark:text-[#94A3B8]/70 font-normal leading-normal break-words mt-0.5">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Documents Table */}
      <div className="space-y-2 select-none text-left bg-white dark:bg-[#0B0F19]/45 border border-[#E5E7EB] dark:border-white/5 rounded-2xl p-4 shadow-sm">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#E5E7EB] dark:border-white/5 pb-3">
          <div className="flex flex-wrap items-center gap-4">
            <h4 className="font-sans font-semibold text-[15px] tracking-tight text-[#081B3A] dark:text-white">
              Recent Documents
            </h4>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={(e) => toggleDropdown(e, 'status')}
                  className="h-8 px-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[12px] font-semibold text-[#6B7280] dark:text-[#94A3B8] flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <span>{statusFilter === 'All' ? 'Status' : statusFilter}</span>
                  <ChevronDown size={11} className="text-[#6B7280] shrink-0" />
                </button>
                {openDropdown === 'status' && (
                  <div className="absolute top-[34px] left-0 w-32 bg-[#111827] border border-[#1f2937] rounded-lg shadow-xl py-1 z-50">
                    {['All Statuses', 'Active', 'Draft', 'Review', 'Archived'].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setStatusFilter(s === 'All Statuses' ? 'All' : s); setCurrentPage(1); }}
                        className="w-full text-left px-2.5 py-1 text-[12px] text-[#f8fafc] hover:bg-[#1e293b] transition-colors cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Type Filter */}
              <div className="relative">
                <button
                  onClick={(e) => toggleDropdown(e, 'type')}
                  className="h-8 px-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[12px] font-semibold text-[#6B7280] dark:text-[#94A3B8] flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <span>{docTypeFilter === 'All' ? 'Type' : docTypeFilter}</span>
                  <ChevronDown size={11} className="text-[#6B7280] shrink-0" />
                </button>
                {openDropdown === 'type' && (
                  <div className="absolute top-[34px] left-0 w-32 bg-[#111827] border border-[#1f2937] rounded-lg shadow-xl py-1 z-50">
                    {['All Types', 'DOCX', 'PDF', 'XLSX', 'PPTX'].map((t) => (
                      <button
                        key={t}
                        onClick={() => { setDocTypeFilter(t === 'All Types' ? 'All' : t); setCurrentPage(1); }}
                        className="w-full text-left px-2.5 py-1 text-[12px] text-[#f8fafc] hover:bg-[#1e293b] transition-colors cursor-pointer"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => toggleDropdown(e, 'sort')}
                  className="h-8 px-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[12px] font-semibold text-[#6B7280] dark:text-[#94A3B8] flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <span>Sort</span>
                  <ChevronDown size={11} className="text-[#6B7280] shrink-0" />
                </button>
                {openDropdown === 'sort' && (
                  <div className="absolute top-[34px] left-0 w-36 bg-[#111827] border border-[#1f2937] rounded-lg shadow-xl py-1 z-50">
                    {[
                      { label: 'Newest First', col: 'lastModified', dir: 'desc' },
                      { label: 'Oldest First', col: 'lastModified', dir: 'asc' },
                      { label: 'Name A-Z', col: 'name', dir: 'asc' },
                      { label: 'Name Z-A', col: 'name', dir: 'desc' }
                    ].map((s) => (
                      <button
                        key={s.label}
                        onClick={() => { setSortColumn(s.col); setSortDirection(s.dir); }}
                        className="w-full text-left px-2.5 py-1 text-[12px] text-[#f8fafc] hover:bg-[#1e293b] transition-colors cursor-pointer"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Bulk Actions */}
            {selectedDocIds.size > 0 && (
              <div className="flex items-center gap-1.5 ml-3 pl-3 border-l border-[#E5E7EB] dark:border-white/10 animate-fade-in-up">
                <span className="text-[11px] font-bold bg-[#0D6EFD]/10 text-[#0D6EFD] px-2 py-0.5 rounded">
                  {selectedDocIds.size} Selected
                </span>
                <button
                  onClick={handleBulkShare}
                  className="p-1 rounded text-[#6B7280] hover:text-[#0D6EFD] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors"
                  title="Bulk Share"
                >
                  <Share2 size={13} />
                </button>
                <button
                  onClick={handleBulkMove}
                  className="p-1 rounded text-[#6B7280] hover:text-[#0D6EFD] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors"
                  title="Bulk Move"
                >
                  <FolderOpen size={13} />
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                  title="Bulk Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Document Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-white/5 text-[11px] font-bold text-[#6B7280] dark:text-slate-500 select-none uppercase tracking-wider">
                <th className="py-2.5 px-3 w-[40px]">
                  <button 
                    onClick={handleSelectAll}
                    className="text-[#6B7280] hover:text-[#0D6EFD] transition-colors"
                  >
                    {isPageAllSelected ? <CheckSquare size={13} className="text-[#0D6EFD]" /> : <Square size={13} />}
                  </button>
                </th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-[#081B3A] dark:hover:text-white transition-colors" onClick={() => handleSort('name')}>
                  <div className="inline-flex items-center gap-1">
                    <span>Name</span>
                    <ArrowUpDown size={10} className="text-[#6B7280]/60 shrink-0" />
                  </div>
                </th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-[#081B3A] dark:hover:text-white transition-colors w-[150px]" onClick={() => handleSort('lastModified')}>
                  <div className="inline-flex items-center gap-1">
                    <span>Last Modified</span>
                    <ArrowUpDown size={10} className="text-[#6B7280]/60 shrink-0" />
                  </div>
                </th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-[#081B3A] dark:hover:text-white transition-colors w-[140px]" onClick={() => handleSort('owner')}>
                  <div className="inline-flex items-center gap-1">
                    <span>Owner</span>
                    <ArrowUpDown size={10} className="text-[#6B7280]/60 shrink-0" />
                  </div>
                </th>
                <th className="py-2.5 px-3 w-[120px]">Collaborators</th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-[#081B3A] dark:hover:text-white transition-colors w-[100px]" onClick={() => handleSort('status')}>
                  <div className="inline-flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown size={10} className="text-[#6B7280]/60 shrink-0" />
                  </div>
                </th>
                <th className="py-2.5 px-3 w-[80px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-white/5">
              {paginatedDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText size={32} className="text-[#6B7280] dark:text-[#94A3B8]/40 mb-3" />
                      <p className="text-sm font-semibold text-[#081B3A] dark:text-white">
                        No documents match your filters
                      </p>
                      <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]/60 mt-1">
                        Try adjusting your search or filter criteria
                      </p>
                      <button
                        onClick={() => {
                          setStatusFilter('All');
                          setDocTypeFilter('All');
                          setSearchQuery('');
                        }}
                        className="mt-4 px-4 py-2 text-[#0D6EFD] text-sm font-semibold hover:bg-[#0D6EFD]/10 rounded-lg transition-colors"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedDocs.map((doc) => {
                  const isSelected = selectedDocIds.has(doc._id);
                  
                  return (
                    <tr
                      key={doc._id}
                      onClick={() => navigate(`/editor/${doc._id}`)}
                      className={`hover:bg-[#F7FAFF]/80 dark:hover:bg-[#0F172A]/40 cursor-pointer transition-all duration-200 h-[52px] group relative border-b border-[#E5E7EB]/50 dark:border-white/5
                        ${isSelected ? 'bg-[#0D6EFD]/5 dark:bg-[#0D6EFD]/5' : ''}
                      `}
                    >
                      <td className="px-3" onClick={(e) => handleSelectRow(e, doc._id)}>
                        <button className="text-[#6B7280] hover:text-[#0D6EFD] transition-colors">
                          {isSelected ? <CheckSquare size={13} className="text-[#0D6EFD]" /> : <Square size={13} />}
                        </button>
                      </td>

                      <td className="px-3 min-w-0">
                        <div className="flex items-center gap-3">
                          {renderTypeIcon(doc.fileType)}
                          <div className="min-w-0">
                            <span className="font-semibold text-[14px] text-[#081B3A] dark:text-slate-200 group-hover:text-[#0D6EFD] transition-colors truncate block">
                              {doc.title}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">
                              {doc.fileType}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 text-[13px] text-[#6B7280] dark:text-[#94A3B8]/75 font-normal">
                        {new Date(doc.lastModified).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      <td className="px-3 text-[12.5px] text-[#6B7280] dark:text-[#94A3B8]/75 font-medium truncate max-w-[140px]">
                        {user?.fullName || doc.owner?.name || user?.fullName}
                      </td>

                      <td className="px-3">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {doc.users?.slice(0, 3).map((collab, idx) => (
                            <img
                              key={idx}
                              className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-[#070B14] object-cover"
                              src={collab.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256'}
                              alt={collab.name}
                              title={collab.name}
                            />
                          ))}
                          {doc.users?.length > 3 && (
                            <span className="flex items-center justify-center h-5 w-5 rounded-full ring-2 ring-white dark:ring-[#070B14] bg-[#E5E7EB] dark:bg-slate-800 text-[9px] font-bold text-[#6B7280] dark:text-[#94A3B8]">
                              +{doc.users.length - 3}
                            </span>
                          )}
                          {!doc.users?.length && (
                            <span className="text-[13px] text-[#6B7280] dark:text-slate-500 font-normal italic">Private</span>
                          )}
                        </div>
                      </td>

                      <td className="px-3">
                        {renderStatusBadge(doc.status)}
                      </td>

                      <td className="px-3 text-right shrink-0">
                        <div className="inline-flex items-center gap-1 relative">
                          <button
                            onClick={(e) => handleToggleStar(e, doc.id, doc.starred)}
                            className="p-1 rounded-md text-[#6B7280] hover:text-amber-500 transition-colors"
                          >
                            <Star size={13} fill={doc.starred ? 'currentColor' : 'none'} className={doc.starred ? 'text-amber-500' : ''} />
                          </button>

                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRowMenuOpen(rowMenuOpen === doc.id ? null : doc.id);
                              }}
                              className="p-1 rounded hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] text-[#6B7280] transition-colors"
                            >
                              <MoreVertical size={14} />
                            </button>

                            {rowMenuOpen === doc.id && (
                              <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 shadow-lg p-1 z-50 rounded-lg text-xs font-semibold select-none text-left">
                                <button
                                  onClick={(e) => openRename(e, doc)}
                                  className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[#E5E7EB]/40 dark:hover:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB]"
                                >
                                  <Edit size={11} />
                                  <span>Rename</span>
                                </button>
                                <button
                                  onClick={(e) => openShare(e, doc)}
                                  className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[#E5E7EB]/40 dark:hover:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB]"
                                >
                                  <Share2 size={11} />
                                  <span>Share</span>
                                </button>
                                <button
                                  onClick={(e) => handleDuplicate(e, doc)}
                                  className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[#E5E7EB]/40 dark:hover:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB]"
                                >
                                  <Copy size={11} />
                                  <span>Duplicate</span>
                                </button>
                                <button
                                  onClick={(e) => handleDelete(e, doc.id)}
                                  className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 border-t border-[#E5E7EB] dark:border-white/10 mt-0.5"
                                >
                                  <Trash2 size={11} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]/80 dark:border-white/5 mt-3 select-none text-[13px] text-[#6B7280] dark:text-[#94A3B8]/80 font-normal">
            <div>
              Showing {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} documents
            </div>
            
            <div className="flex items-center gap-1 bg-[#F7FAFF] dark:bg-[#0F172A]/30 p-0.5 rounded-lg border border-[#E5E7EB] dark:border-white/5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-40 transition-all cursor-pointer font-semibold text-[13px] w-6 h-6 flex items-center justify-center"
              >
                &lt;
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (currentPage <= 3) {
                  pageNum = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                } else {
                  pageNum = currentPage - 2 + idx;
                }
                
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-6 w-6 text-[12px] font-semibold rounded-md transition-all ${currentPage === pageNum ? 'bg-[#0D6EFD] text-white shadow-sm' : 'text-[#6B7280] hover:bg-[#E5E7EB]/30 dark:hover:bg-[#0F172A]'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-40 transition-all cursor-pointer font-semibold text-[13px] w-6 h-6 flex items-center justify-center"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
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