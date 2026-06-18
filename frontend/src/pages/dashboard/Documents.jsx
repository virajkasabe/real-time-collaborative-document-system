import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronDown
} from 'lucide-react';
import Button from '../../components/common/Button';
import ShareDocumentModal from '../../components/modals/ShareDocumentModal';
import RenameDocumentModal from '../../components/modals/RenameDocumentModal';
import { documentService } from '../../services/documentService';
import { useAuth } from '../../context/AuthContext';
import { createDoc } from '../../apis/api';

export default function Documents() {
  const { user, triggerToast } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all'; // all | starred | recent | trash
  
  const { sidebarOpen, searchQuery } = useOutletContext();
  const [viewMode, setViewMode] = useState('list'); // list | grid
  const [dbVer, setDbVer] = useState(0);

  // Advanced Filtering States
  const [docTypeFilter, setDocTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [sortBy, setSortBy] = useState('Newest');

  // Custom Dropdowns Open State
  const [openDropdown, setOpenDropdown] = useState(null); // 'type' | 'status' | 'owner' | 'date' | 'sort' | null

  // Modal interaction states
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  useEffect(() => {
    if (filter === 'starred') {
      setOnlyStarred(true);
    } else {
      setOnlyStarred(false);
    }
  }, [filter]);

  // Click outside to auto-close custom dropdowns
  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdown(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const triggerReload = () => setDbVer(prev => prev + 1);

  const rawDocs = useMemo(() => {
    let list = [];
    if (filter === 'starred') {
      list = documentService.getStarred();
    } else if (filter === 'recent') {
      list = documentService.getRecent();
    } else if (filter === 'trash') {
      list = documentService.getTrash();
    } else {
      list = documentService.getAll();
    } 
    return list;
  }, [filter, dbVer]);

  // Enriched documents with consistent file types & statuses
  const enrichedDocs = useMemo(() => {
    return rawDocs.map((doc, idx) => {
      let fileType = 'DOCX';
      if (doc.category === 'spec') fileType = 'PDF';
      else if (doc.category === 'minutes') fileType = 'XLSX';
      else if (doc.category === 'proposal') fileType = 'DOCX';
      else {
        const types = ['DOCX', 'XLSX', 'PDF', 'PPTX', 'TXT'];
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

  // Stateful Advanced Filters Pipeline
  const filteredDocs = useMemo(() => {
    let list = enrichedDocs;

    // 1. Text Search query
    if (searchQuery.trim()) {
      list = list.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Document Type
    if (docTypeFilter !== 'All') {
      list = list.filter(d => d.fileType === docTypeFilter);
    }

    // 3. Status
    if (statusFilter !== 'All') {
      list = list.filter(d => d.status === statusFilter);
    }

    // 4. Owner
    if (ownerFilter !== 'All') {
      if (ownerFilter === 'Mine') {
        list = list.filter(d => d.owner.email === user?.email);
      } else if (ownerFilter === 'Shared') {
        list = list.filter(d => d.sharedUsers.some(u => u.email === user?.email));
      } else if (ownerFilter === 'Team') {
        list = list.filter(d => d.sharedUsers.length > 0);
      }
    }

    // 5. Date Modified range
    if (dateFilter !== 'All') {
      const now = new Date();
      list = list.filter(d => {
        const modDate = new Date(d.lastModified);
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

    // 6. Starred Toggle
    if (onlyStarred) {
      list = list.filter(d => d.starred);
    }

    // 7. Stateful Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.lastModified) - new Date(a.lastModified);
      } else if (sortBy === 'Oldest') {
        return new Date(a.lastModified) - new Date(b.lastModified);
      } else if (sortBy === 'NameAZ') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'NameZA') {
        return b.name.localeCompare(a.name);
      } else if (sortBy === 'Recent') {
        return new Date(b.lastModified) - new Date(a.lastModified);
      }
      return 0;
    });

    return list;
  }, [enrichedDocs, searchQuery, docTypeFilter, statusFilter, ownerFilter, dateFilter, onlyStarred, sortBy, user]);

  const hasActiveFilters = useMemo(() => {
    return docTypeFilter !== 'All' || statusFilter !== 'All' || ownerFilter !== 'All' || dateFilter !== 'All' || (onlyStarred && filter !== 'starred');
  }, [docTypeFilter, statusFilter, ownerFilter, dateFilter, onlyStarred, filter]);

  const handleClearFilters = () => {
    setDocTypeFilter('All');
    setStatusFilter('All');
    setOwnerFilter('All');
    setDateFilter('All');
    if (filter !== 'starred') setOnlyStarred(false);
    setSortBy('Newest');
    triggerToast('All filters reset', 'info');
  };

  const handleToggleStar = (e, docId, currentState) => {
    e.stopPropagation();
    documentService.star(docId, !currentState);
    triggerReload();
  };

  const handleMoveToTrash = (e, docId) => {
    e.stopPropagation();
    documentService.delete(docId);
    setActionMenuOpen(null);
    triggerToast('Moved to Trash', 'info');
    triggerReload();
  };

  const handleRestore = (e, docId) => {
    e.stopPropagation();
    documentService.restore(docId);
    triggerToast('Document restored', 'success');
    triggerReload();
  };

  const handleCreateDocument = async() => {
    const newDoc = await createDoc('New Document', 'blank', user?.email, user?.name);
    if (newDoc.data.doc) {
      triggerToast('Document created successfully!', 'success');
      navigate(`/editor/${newDoc.data.doc._id}`);
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

  // Toggle dynamic custom dropdown menus
  const toggleDropdown = (e, menu) => {
    e.stopPropagation();
    setOpenDropdown(prev => prev === menu ? null : menu);
  };

  return (
    <div className="px-5 pt-3.5 pb-6 md:px-6 md:pt-4 md:pb-8 space-y-3.5 max-w-7xl w-full mx-auto">
          {/* Header explorer control bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 select-none text-left border-b border-[#E5E7EB] dark:border-white/5 pb-2 transition-colors duration-300">
            <div className="space-y-0.5">
              <h2 className="font-sans font-bold text-[22px] text-[#081B3A] dark:text-white leading-tight normal-case tracking-tight transition-colors duration-300">
                {filter === 'trash' ? 'Trash Bin' : filter === 'starred' ? 'Starred documents' : filter === 'recent' ? 'Recent blueprints' : 'All Documents'}
              </h2>
              <p className="text-[13px] font-normal text-[#6B7280] dark:text-[#94A3B8]/80 mt-0.5">
                {filteredDocs.length} document{filteredDocs.length === 1 ? '' : 's'} found
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {/* Layout mode switcher */}
              <div className="flex bg-[#E5E7EB] dark:bg-[#0F172A] p-0.75 rounded-lg border border-[#E5E7EB] dark:border-white/10 shadow-sm transition-all">
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
                <Button size="sm" onClick={handleCreateDocument} icon={Plus}>
                  New Document
                </Button>
              )}
            </div>
          </div>

          {/* ADVANCED FILTERS PANEL (Linear/Vercel Redesign) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white dark:bg-[#0B0F19]/45 border border-[#E5E7EB] dark:border-white/5 rounded-xl p-2.5 shadow-sm select-none text-left">
            <div className="flex flex-wrap items-center gap-2">
              {/* Inline Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 h-10 bg-slate-50 dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1f2937] rounded-[10px] px-3 text-[13px] font-normal text-[#081B3A] dark:text-[#f8fafc] placeholder-[#6B7280]/60 dark:placeholder-[#94A3B8]/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>

              {/* 1. Document Type Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => toggleDropdown(e, 'type')}
                  className="h-10 px-3 rounded-[10px] border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[13px] font-semibold text-[#081B3A] dark:text-[#f8fafc] flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>{docTypeFilter === 'All' ? 'All Types' : docTypeFilter}</span>
                  <ChevronDown size={12} className="text-[#6B7280] dark:text-slate-500 shrink-0" />
                </button>
                {openDropdown === 'type' && (
                  <div className="absolute top-[44px] left-0 w-36 bg-[#111827] border border-[#1f2937] rounded-[10px] shadow-xl py-1 z-50 animate-fade-in-up">
                    {['All Types', 'DOCX', 'PDF', 'XLSX', 'PPTX', 'TXT'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setDocTypeFilter(t === 'All Types' ? 'All' : t)}
                        className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-[#f8fafc] hover:bg-[#1e293b] transition-colors cursor-pointer"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Status Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => toggleDropdown(e, 'status')}
                  className="h-10 px-3 rounded-[10px] border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[13px] font-semibold text-[#081B3A] dark:text-[#f8fafc] flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>{statusFilter === 'All' ? 'All Statuses' : statusFilter}</span>
                  <ChevronDown size={12} className="text-[#6B7280] dark:text-slate-500 shrink-0" />
                </button>
                {openDropdown === 'status' && (
                  <div className="absolute top-[44px] left-0 w-36 bg-[#111827] border border-[#1f2937] rounded-[10px] shadow-xl py-1 z-50 animate-fade-in-up">
                    {['All Statuses', 'Active', 'Draft', 'Review', 'Archived'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s === 'All Statuses' ? 'All' : s)}
                        className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-[#f8fafc] hover:bg-[#1e293b] transition-colors cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Owner Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => toggleDropdown(e, 'owner')}
                  className="h-10 px-3 rounded-[10px] border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[13px] font-semibold text-[#081B3A] dark:text-[#f8fafc] flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>{ownerFilter === 'All' ? 'All Owners' : ownerFilter === 'Shared' ? 'Shared With Me' : ownerFilter === 'Mine' ? 'Mine' : 'Team Documents'}</span>
                  <ChevronDown size={12} className="text-[#6B7280] dark:text-slate-500 shrink-0" />
                </button>
                {openDropdown === 'owner' && (
                  <div className="absolute top-[44px] left-0 w-40 bg-[#111827] border border-[#1f2937] rounded-[10px] shadow-xl py-1 z-50 animate-fade-in-up">
                    {[
                      { label: 'All Owners', value: 'All' },
                      { label: 'Mine', value: 'Mine' },
                      { label: 'Shared With Me', value: 'Shared' },
                      { label: 'Team Documents', value: 'Team' }
                    ].map((o) => (
                      <button
                        key={o.value}
                        onClick={() => setOwnerFilter(o.value)}
                        className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-[#f8fafc] hover:bg-[#1e293b] transition-colors cursor-pointer"
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Last Modified Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => toggleDropdown(e, 'date')}
                  className="h-10 px-3 rounded-[10px] border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[13px] font-semibold text-[#081B3A] dark:text-[#f8fafc] flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>{dateFilter === 'All' ? 'Modified' : dateFilter === 'Last7' ? 'Last 7 Days' : dateFilter === 'Last30' ? 'Last 30 Days' : dateFilter === 'ThisMonth' ? 'This Month' : dateFilter}</span>
                  <ChevronDown size={12} className="text-[#6B7280] dark:text-slate-500 shrink-0" />
                </button>
                {openDropdown === 'date' && (
                  <div className="absolute top-[44px] left-0 w-36 bg-[#111827] border border-[#1f2937] rounded-[10px] shadow-xl py-1 z-50 animate-fade-in-up">
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
                        className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-[#f8fafc] hover:bg-[#1e293b] transition-colors cursor-pointer"
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Starred Toggle */}
              {filter !== 'starred' && (
                <button
                  onClick={() => setOnlyStarred(!onlyStarred)}
                  className={`flex items-center gap-1 px-3 h-10 rounded-[10px] border text-[13px] font-semibold transition-all cursor-pointer shadow-sm
                    ${onlyStarred 
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                      : 'bg-white dark:bg-[#111827] border-[#E5E7EB] dark:border-[#1f2937] text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-slate-50 dark:hover:bg-[#1e293b]'
                    }
                  `}
                >
                  <Star size={11} fill={onlyStarred ? 'currentColor' : 'none'} />
                  <span>Starred Only</span>
                </button>
              )}
            </div>

            {/* 6. Sort By Dropdown & Clear Filters */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <div className="relative">
                <button
                  onClick={(e) => toggleDropdown(e, 'sort')}
                  className="h-10 px-3 rounded-[10px] border border-[#E5E7EB] dark:border-[#1f2937] bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1e293b] text-[13px] font-semibold text-[#081B3A] dark:text-[#f8fafc] flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>{sortBy === 'Newest' ? 'Newest First' : sortBy === 'Oldest' ? 'Oldest First' : sortBy === 'NameAZ' ? 'Name A-Z' : sortBy === 'NameZA' ? 'Name Z-A' : 'Recently Opened'}</span>
                  <ChevronDown size={12} className="text-[#6B7280] dark:text-slate-500 shrink-0" />
                </button>
                {openDropdown === 'sort' && (
                  <div className="absolute top-[44px] right-0 w-36 bg-[#111827] border border-[#1f2937] rounded-[10px] shadow-xl py-1 z-50 animate-fade-in-up">
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
                        className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-[#f8fafc] hover:bg-[#1e293b] transition-colors cursor-pointer"
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

          {/* ACTIVE FILTER CHIPS */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-left animate-fade-in-up">
              <span className="text-[13px] font-medium text-[#6B7280] dark:text-slate-500 pl-0.5">Active filters:</span>
              
              {docTypeFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-[13px] font-semibold border border-blue-500/10 shadow-sm">
                  <span>{docTypeFilter}</span>
                  <button onClick={() => setDocTypeFilter('All')} className="hover:text-blue-700 font-bold ml-1 cursor-pointer">×</button>
                </span>
              )}

              {statusFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-[13px] font-semibold border border-emerald-500/10 shadow-sm">
                  <span>{statusFilter}</span>
                  <button onClick={() => setStatusFilter('All')} className="hover:text-emerald-700 font-bold ml-1 cursor-pointer">×</button>
                </span>
              )}

              {ownerFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500 dark:text-purple-400 text-[13px] font-semibold border border-purple-500/10 shadow-sm">
                  <span>{ownerFilter === 'Shared' ? 'Shared With Me' : ownerFilter === 'Mine' ? 'Mine' : 'Team'}</span>
                  <button onClick={() => setOwnerFilter('All')} className="hover:text-purple-700 font-bold ml-1 cursor-pointer">×</button>
                </span>
              )}

              {dateFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-500 dark:text-pink-400 text-[13px] font-semibold border border-pink-500/10 shadow-sm">
                  <span>{dateFilter === 'Last7' ? 'Last 7 Days' : dateFilter === 'Last30' ? 'Last 30 Days' : dateFilter === 'ThisMonth' ? 'This Month' : dateFilter}</span>
                  <button onClick={() => setDateFilter('All')} className="hover:text-pink-700 font-bold ml-1 cursor-pointer">×</button>
                </span>
              )}

              {onlyStarred && filter !== 'starred' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 text-[13px] font-semibold border border-amber-500/10 shadow-sm">
                  <span>Starred</span>
                  <button onClick={() => setOnlyStarred(false)} className="hover:text-amber-700 font-bold ml-1 cursor-pointer">×</button>
                </span>
              )}
            </div>
          )}

          {/* Document list display */}
          {filteredDocs.length === 0 ? (
            <div className="py-24 border border-dashed border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0B0F19]/20 rounded-2xl text-center text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8]/60 transition-all select-none">
              No documents matching filters found.
            </div>
          ) : viewMode === 'list' ? (
            // LIST LAYOUT
            <div className="space-y-2 select-none text-left bg-white dark:bg-[#0B0F19]/45 border border-[#E5E7EB] dark:border-white/5 rounded-2xl p-3.5 shadow-sm">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => navigate(`/editor/${doc.id}`)}
                  className="flex items-center justify-between h-14 px-3 bg-white dark:bg-[#0F172A]/20 border border-[#E5E7EB] dark:border-white/5 hover:bg-[#F7FAFF] dark:hover:bg-[#0F172A]/50 hover:border-blue-500/30 dark:hover:border-blue-500/20 hover:scale-[1.003] hover:shadow-[0_6px_25px_rgba(13,110,253,0.02)] rounded-xl transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {renderTypeIcon(doc.fileType)}
                    <div className="min-w-0">
                      <span className="font-semibold text-[14px] text-[#081B3A] dark:text-slate-200 group-hover:text-[#0D6EFD] dark:group-hover:text-white transition-colors truncate block">
                        {doc.name}
                      </span>
                      <span className="text-[11px] font-medium text-[#6B7280] dark:text-[#94A3B8]/80 block mt-0.5 leading-none transition-colors">
                        Owner: <span className="text-[12.5px] font-medium text-[#081B3A] dark:text-slate-200">{doc.owner.name}</span> • Updated {doc.updatedAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 relative">
                    {filter === 'trash' ? (
                      <button
                        onClick={(e) => handleRestore(e, doc.id)}
                        className="p-1 rounded text-[#6B7280] dark:text-[#94A3B8] hover:text-[#0D6EFD] transition-colors cursor-pointer"
                        title="Restore"
                      >
                        <Undo size={13} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={(e) => handleToggleStar(e, doc.id, doc.starred)}
                          className="p-1 rounded text-[#6B7280] dark:text-[#94A3B8] hover:text-amber-500 transition-colors cursor-pointer"
                        >
                          <Star size={13} fill={doc.starred ? 'currentColor' : 'none'} className={doc.starred ? 'text-amber-500' : ''} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuOpen(actionMenuOpen === doc.id ? null : doc.id);
                            }}
                            className="p-1 rounded text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors cursor-pointer"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {actionMenuOpen === doc.id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 shadow-lg p-1 z-50 rounded-lg text-xs font-semibold select-none text-left">
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
                                onClick={(e) => handleMoveToTrash(e, doc.id)}
                                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 border-t border-[#E5E7EB] dark:border-white/10 mt-0.5"
                              >
                                <Trash2 size={11} />
                                <span>Trash</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 select-none text-left">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => navigate(`/editor/${doc.id}`)}
                  className="glass-card p-4 border border-[#E5E7EB] dark:border-white/5 bg-white dark:bg-[#0F172A]/40 hover:bg-[#F7FAFF] dark:hover:bg-[#0F172A] hover:border-[#E5E7EB] dark:hover:border-white/20 rounded-xl transition-all duration-300 cursor-pointer space-y-4 flex flex-col justify-between group shadow-sm hover:scale-[1.01]"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      {renderTypeIcon(doc.fileType)}
                      {filter !== 'trash' && (
                        <button
                          onClick={(e) => handleToggleStar(e, doc.id, doc.starred)}
                          className="p-1 rounded text-[#6B7280] dark:text-[#94A3B8] hover:text-amber-500 transition-colors cursor-pointer"
                        >
                          <Star size={12} fill={doc.starred ? 'currentColor' : 'none'} className={doc.starred ? 'text-amber-500' : ''} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="font-semibold text-[14px] text-[#081B3A] dark:text-slate-200 group-hover:text-[#0D6EFD] dark:group-hover:text-white transition-colors truncate">
                        {doc.name}
                      </h5>
                      <p className="text-[11px] font-medium text-[#6B7280] dark:text-[#94A3B8]/80 leading-none mt-0.5">
                        {doc.fileType} • Owner: <span className="text-[12.5px] font-medium text-[#081B3A] dark:text-slate-200">{doc.owner.name}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[13px] font-normal text-[#6B7280] dark:text-[#94A3B8]/80 pt-2 border-t border-[#E5E7EB] dark:border-white/10 transition-colors duration-300">
                    <span>Updated {doc.updatedAt}</span>
                    {filter === 'trash' ? (
                      <button
                        onClick={(e) => handleRestore(e, doc.id)}
                        className="text-[#0D6EFD] hover:underline flex items-center gap-0.5 cursor-pointer font-semibold"
                      >
                        <Undo size={11} />
                        <span>Restore</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleMoveToTrash(e, doc.id)}
                        className="text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer font-semibold"
                      >
                        <Trash2 size={11} />
                        <span>Trash</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

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
