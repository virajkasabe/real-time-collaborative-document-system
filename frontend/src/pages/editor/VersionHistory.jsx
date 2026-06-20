import React, { useState } from 'react';
import { Clock, Plus, X, RotateCcw } from 'lucide-react';
import Button from '../../components/common/Button';
import { documentService } from '../../utils/documentService';
import { useAuth } from '../../context/AuthContext';

export default function VersionHistory({ docId, versions, onRestore, onUpdate, onClose }) {
  const { user, triggerToast } = useAuth();
  const [versionName, setVersionName] = useState('');

  const handleSaveCheckpoint = (e) => {
    e.preventDefault();
    if (!versionName.trim()) return;

    const updated = documentService.addVersionCheckpoint(docId, user?.name || 'Anonymous', versionName.trim());
    if (updated) {
      setVersionName('');
      triggerToast('Checkpoint saved!', 'success');
      onUpdate();
    }
  };

  return (
    <div className="w-64 border-l border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0B1220] flex flex-col h-full select-none text-left transition-colors duration-300">
      
      {/* Header */}
      <div className="p-3 border-b border-[#E5E7EB] dark:border-white/10 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-1.5 font-bold text-xs text-[#081B3A] dark:text-[#E5E7EB]">
          <Clock size={13} className="text-[#0D6EFD]" />
          <span>Version History</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] text-[#6B7280]">
          <X size={13} />
        </button>
      </div>

      {/* Save Checkpoint Form */}
      <form onSubmit={handleSaveCheckpoint} className="p-3 border-b border-[#E5E7EB] dark:border-white/10 space-y-1.5 transition-colors">
        <label className="text-[9px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider">Save current state</label>
        <div className="flex gap-1.5">
          <input
            type="text"
            placeholder="Checkpoint title..."
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            className="flex-1 px-2.5 py-1.5 text-[10px] rounded-lg border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] placeholder-[#6B7280]/40 focus:outline-none focus:ring-1 focus:ring-[#0D6EFD] transition-colors"
          />
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-[#0D6EFD] text-white hover:bg-[#0D6EFD]/90 active:scale-95 transition-all shrink-0"
            title="Save version"
          >
            <Plus size={12} />
          </button>
        </div>
      </form>

      {/* Checkpoints list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {versions.length === 0 ? (
          <div className="text-center text-[10px] text-[#6B7280] dark:text-[#94A3B8]/60 py-12 font-medium">
            No save points yet. Create a checkpoint to save current state.
          </div>
        ) : (
          versions.map((ver) => (
            <div
              key={ver.id}
              className="p-2.5 bg-[#F7FAFF] dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/10 rounded-lg flex items-center justify-between transition-all duration-300 relative group"
            >
              <div className="min-w-0 pr-4 space-y-0.5">
                <p className="font-bold text-[10.5px] text-[#081B3A] dark:text-[#E5E7EB] truncate transition-colors">
                  {ver.name}
                </p>
                <p className="text-[9px] text-[#6B7280] dark:text-[#94A3B8]/60 font-semibold transition-colors">
                  By {ver.author} • {ver.date}
                </p>
              </div>

              <button
                onClick={() => onRestore(ver.content)}
                className="p-1 rounded text-[#0D6EFD] hover:bg-[#0D6EFD]/10 active:scale-90 transition-all shadow-sm shrink-0"
                title="Restore this revision"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
