import React from 'react';
<<<<<<< HEAD
import { FileText, Users, UserPlus, Radio } from 'lucide-react';
import StatsCard from './dashboard/StatsCard';

export default function StatsGrid({ stats, activeUsers }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Documents"
        value={stats?.totalDocuments || 0}
        icon={FileText}
        bgAccent="bg-blue-500/10"
        textAccent="text-blue-500"
      />
      <StatsCard
        title="Active Team Members"
        value={stats?.activeTeamMembers || activeUsers?.length || 0}
        icon={Users}
        bgAccent="bg-emerald-500/10"
        textAccent="text-emerald-500"
      />
      <StatsCard
        title="Pending Invitations"
        value={stats?.pendingInvitations || 0}
        icon={UserPlus}
        bgAccent="bg-amber-500/10"
        textAccent="text-amber-500"
      />
      <StatsCard
        title="Live Collaborations"
        value={stats?.liveCollaborations || 0}
        icon={Radio}
        bgAccent="bg-rose-500/10"
        textAccent="text-rose-500"
      />
=======

export default function StatsGrid({ stats }) {
  return (
    <div className="select-none py-1 space-y-1">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-[#081B3A] dark:text-[#E5E7EB] tracking-tight flex items-center gap-1.5 transition-colors duration-300">
          <span>Good Morning, Madhu</span>
          <span className="text-xs">👋</span>
        </h2>
        
        {/* Blinking sync badge */}
        <div className="inline-flex items-center gap-1.5 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-bold rounded-full uppercase tracking-widest">
          <span className="relative flex h-1 w-1 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500" />
          </span>
          <span>Sync Active</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-medium transition-colors duration-300">
        <span>{stats.totalDocuments} Documents</span>
        <span className="text-[#E5E7EB] dark:text-white/10 transition-colors duration-300">•</span>
        <span>{stats.activeTeamMembers} Team Members</span>
        <span className="text-[#E5E7EB] dark:text-white/10 transition-colors duration-300">•</span>
        <span>{stats.liveCollaborations} Live Sessions</span>
      </div>
>>>>>>> 02b645e (Improve dashboard UI and fix theme system)
    </div>
  );
}
