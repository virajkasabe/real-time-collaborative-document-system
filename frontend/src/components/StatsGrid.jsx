import React from 'react';
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
    </div>
  );
}
