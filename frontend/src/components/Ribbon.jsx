import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Share2, 
  History, 
  Download, 
  File, 
  ChevronDown, 
  ChevronUp, 
  UserPlus, 
  Clock, 
  Save, 
  Users,
  Grid,
  List,
  RefreshCw
} from 'lucide-react';

export default function Ribbon({ 
  onActionClick, 
  viewMode, 
  setViewMode, 
  autoSave, 
  setAutoSave, 
  triggerRefresh
}) {
  const [activeTab, setActiveTab] = useState('home');
  const [ribbonExpanded, setRibbonExpanded] = useState(true);

  const tabs = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'insert', name: 'Templates', icon: FileText },
    { id: 'share', name: 'Collaborate', icon: Share2 },
    { id: 'history', name: 'History', icon: History },
    { id: 'export', name: 'Export', icon: Download },
  ];

  const handleAction = (actionName) => {
    onActionClick(actionName);
  };

  return (
    <div className="overflow-hidden bg-white dark:bg-[#0B1224] border border-brand-border/25 dark:border-slate-800/25 rounded-lg select-none">
      {/* Ribbon Tab Bar (Flat, Compact top bar) */}
      <div className="flex items-center justify-between bg-white dark:bg-[#0B1224] px-3 border-b border-brand-border/20">
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (!ribbonExpanded) setRibbonExpanded(true);
                }}
                className={`flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider transition-all border-b-2
                  ${isActive 
                    ? 'border-brand-blue text-brand-blue dark:text-brand-accent bg-[#FFFFFF] dark:bg-slate-900 ribbon-tab-active' 
                    : 'border-transparent text-brand-gray hover:text-brand-dark hover:bg-brand-hover/40 dark:hover:bg-slate-800'
                  }
                `}
              >
                <Icon size={10} className={isActive ? 'text-brand-blue' : 'text-brand-gray'} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Expand / Collapse */}
        <button
          onClick={() => setRibbonExpanded(!ribbonExpanded)}
          className="p-0.5 rounded text-brand-gray hover:text-brand-dark hover:bg-brand-hover transition-colors"
        >
          {ribbonExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Action panel (Compact height) */}
      <div 
        className={`transition-all duration-150 origin-top overflow-hidden bg-brand-bg/5 dark:bg-[#060B1A]/20
          ${ribbonExpanded ? 'max-h-8 border-b border-brand-border/5 py-0.5 px-2 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
        `}
      >
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="flex flex-wrap items-center gap-4 divide-x divide-brand-border/60 text-xs">
            {/* View Grid/List toggles */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-brand-gray uppercase tracking-wider">Layout:</span>
              <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 p-0.5 rounded-md border border-brand-border shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded transition-all ${viewMode === 'grid' ? 'bg-brand-sky text-brand-blue font-bold shadow-sm' : 'text-brand-gray hover:text-brand-dark'}`}
                  title="Grid View"
                >
                  <Grid size={12} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded transition-all ${viewMode === 'list' ? 'bg-brand-sky text-brand-blue font-bold shadow-sm' : 'text-brand-gray hover:text-brand-dark'}`}
                  title="List View"
                >
                  <List size={12} />
                </button>
              </div>
            </div>

            {/* Auto Save Toggle */}
            <div className="flex items-center gap-2 pl-4">
              <span className="text-[9px] font-bold text-brand-gray uppercase tracking-wider">Sync:</span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={autoSave} 
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-8 h-4.5 bg-brand-border dark:bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-brand-blue"></div>
                <span className="ml-1.5 text-[11px] font-bold text-brand-dark dark:text-slate-350">
                  {autoSave ? 'Auto-Save' : 'Manual'}
                </span>
              </label>
              {autoSave && (
                <span className="flex items-center gap-0.5 text-[9px] text-brand-blue font-bold bg-brand-sky px-2 py-0.5 rounded-md border border-brand-border/40 ml-1">
                  <Save size={9} /> Saved
                </span>
              )}
            </div>

            {/* Sync trigger button */}
            <div className="flex items-center gap-2 pl-4">
              <button
                onClick={triggerRefresh}
                className="flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-brand-hover text-brand-dark text-[10px] font-bold rounded-lg border border-brand-border/60 shadow-sm active:scale-95 transition-all"
              >
                <RefreshCw size={10} className="text-brand-blue hover:rotate-180 transition-transform" />
                <span>Sync server</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: INSERT TEMPLATES (Compact List-cards) */}
        {activeTab === 'insert' && (
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'blank', label: 'Blank Page' },
              { id: 'proposal', label: 'Project Proposal' },
              { id: 'minutes', label: 'Meeting Minutes' },
              { id: 'spec', label: 'Product Spec Sheet' }
            ].map((temp) => (
              <button
                key={temp.id}
                onClick={() => handleAction(`template-${temp.id}`)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-brand-border/50 text-left bg-white hover:bg-brand-hover hover:border-brand-blue transition-all group select-none shadow-sm"
              >
                <File size={11} className="text-brand-blue shrink-0" />
                <span className="font-bold text-[10px] text-brand-dark group-hover:text-brand-blue">{temp.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* TAB 3: SHARE & COLLABORATE */}
        {activeTab === 'share' && (
          <div className="flex flex-wrap items-center gap-3 divide-x divide-brand-border/60 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleAction('invite')}
                className="flex items-center gap-1 px-2 py-0.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-[10px] font-bold rounded-lg transition-all"
              >
                <UserPlus size={11} />
                <span>Invite User</span>
              </button>
              <button
                onClick={() => handleAction('share')}
                className="flex items-center gap-1 px-2 py-0.5 bg-brand-sky text-brand-blue text-[10px] font-bold rounded-lg border border-brand-border/40 hover:bg-brand-border transition-all"
              >
                <Share2 size={11} />
                <span>Share Document</span>
              </button>
            </div>

            <div className="flex items-center gap-1 pl-3 text-[10px] font-bold text-brand-dark bg-white border border-brand-border/55 rounded-lg px-2 py-0.5 shadow-sm">
              <Users size={11} className="text-brand-blue shrink-0" />
              <span>3 Active Rooms</span>
            </div>
          </div>
        )}

        {/* TAB 4: HISTORY & VERSIONS */}
        {activeTab === 'history' && (
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <button
              onClick={() => handleAction('restore')}
              className="flex items-center gap-1 px-2 py-0.5 bg-brand-sky text-brand-blue text-[10px] font-bold rounded-lg border border-brand-border/60 hover:bg-brand-border transition-all"
            >
              <Clock size={11} />
              <span>Restore Revision</span>
            </button>

            <div className="flex items-center gap-1 text-[10px] text-brand-dark font-bold pl-1">
              <span className="w-1 h-1 bg-brand-blue rounded-full"></span>
              <span>V2.4.1 restored by Eleanor (10m ago)</span>
            </div>
          </div>
        )}

        {/* TAB 5: EXPORT & FORMATS */}
        {activeTab === 'export' && (
          <div className="flex flex-wrap items-center gap-1.5 select-none">
            {[
              { label: 'PDF', format: 'pdf' },
              { label: 'Word (.docx)', format: 'docx' },
              { label: 'Markdown (.md)', format: 'markdown' },
              { label: 'HTML', format: 'html' }
            ].map((exp) => (
              <button
                key={exp.format}
                onClick={() => handleAction(`export-${exp.format}`)}
                className="flex items-center gap-1 px-2 py-0.5 border border-brand-border/60 rounded-md bg-white hover:bg-brand-hover text-[10px] font-bold text-brand-dark transition-all shadow-sm"
              >
                <Download size={10} className="text-brand-blue shrink-0" />
                <span>{exp.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
