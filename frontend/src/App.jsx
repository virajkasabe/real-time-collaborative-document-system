<<<<<<< HEAD
<<<<<<< HEAD
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './context/AuthContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  const { toast } = useAuth();

  return (
      <NotificationProvider>
        <AppRoutes />
        {toast && (
          <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2.5 px-3.5 py-2.5 bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-xl shadow-md select-none animate-fade-in transition-all duration-300">
            <div className={`p-1 rounded-md ${
              toast.type === 'success' 
                ? 'bg-[#0D6EFD] text-white' 
                : toast.type === 'warning' 
                ? 'bg-rose-500 text-white' 
                : 'bg-indigo-500 text-white'
            }`}>
              {toast.type === 'success' && <CheckCircle size={12} />}
              {toast.type === 'warning' && <AlertCircle size={12} />}
              {toast.type === 'info' && <Info size={12} />}
            </div>
            <span className="text-[10.5px] font-bold text-[#081B3A] dark:text-[#E5E7EB]">
              {toast.message}
            </span>
          </div>
        )}
      </NotificationProvider>
  );
}
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
=======
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StatsGrid from './components/StatsGrid';
import TeamActivityTable from './components/TeamActivityTable';
import RecentDocumentsTable from './components/RecentDocumentsTable';
import Modals from './components/Modals';
import CollabActivityFeed from './components/CollabActivityFeed';
import EditingPage from './pages/EditingPage';
import { 
  ArrowRight,
  ClipboardList,
  CheckCircle,
  Activity,
  User,
  Radio,
  FileText,
  Bell,
  RefreshCw,
  Dot,
  Clock,
  Settings
} from 'lucide-react';
>>>>>>> 02b645e (Improve dashboard UI and fix theme system)

// MOCK DATA SEED FILES
const initialDocs = [
  {
    id: 'doc-1',
    name: 'CollabDocs Product Roadmap Q3',
    category: 'proposal',
    owner: { name: 'Eleanor Vance', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop' },
    sharedUsers: [
      { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop' },
      { name: 'Dave Grohl', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop' },
      { name: 'Julian Casablancas', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop' }
    ],
    updatedAt: '3m ago',
    liveCollaborators: ['Sarah Connor', 'Dave Grohl']
  },
  {
    id: 'doc-2',
    name: 'Meeting Minutes: Sprint Planning',
    category: 'minutes',
    owner: { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop' },
    sharedUsers: [
      { name: 'Eleanor Vance', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop' },
      { name: 'Julian Casablancas', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop' }
    ],
    updatedAt: '2h ago',
    liveCollaborators: []
  },
  {
    id: 'doc-3',
    name: 'Technical Design Spec: Sockets Protocol',
    category: 'spec',
    owner: { name: 'Dave Grohl', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop' },
    sharedUsers: [
      { name: 'Eleanor Vance', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop' },
      { name: 'Julian Casablancas', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop' }
    ],
    updatedAt: 'Yesterday',
    liveCollaborators: ['Julian Casablancas']
  },
  {
    id: 'doc-4',
    name: 'UI Wireframe Assets & Design Tokens',
    category: 'blank',
    owner: { name: 'Julian Casablancas', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop' },
    sharedUsers: [
      { name: 'Eleanor Vance', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop' },
      { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop' }
    ],
    updatedAt: 'May 24',
    liveCollaborators: []
  }
];

const initialTeam = [
  { id: 'usr-1', name: 'Eleanor Vance', email: 'eleanor@company.com', role: 'Admin', status: 'Active', lastActive: 'Just now', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop' },
  { id: 'usr-2', name: 'Sarah Connor', email: 'sarah@company.com', role: 'Editor', status: 'Active', lastActive: '3m ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop' },
  { id: 'usr-3', name: 'Dave Grohl', email: 'dave@company.com', role: 'Editor', status: 'Idle', lastActive: '12m ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop' },
  { id: 'usr-4', name: 'Julian Casablancas', email: 'julian@company.com', role: 'Viewer', status: 'Active', lastActive: 'Just now', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop' }
];

const initialNotifications = [
  { id: 'notif-1', text: 'Sarah commented on "Roadmap Q3"', time: '10m ago', read: false, type: 'comment' },
  { id: 'notif-2', text: 'Dave restored "Meeting Minutes" to V2.3', time: '1h ago', read: false, type: 'alert' },
  { id: 'notif-3', text: 'Julian joined "Sockets Spec" drive', time: '2h ago', read: true, type: 'success' }
];

const initialActivityLogs = [
  { id: 'act-1', text: 'Sarah Connor updated Roadmap Q3', time: '3m ago', type: 'edit' },
  { id: 'act-2', text: 'Julian opened Sockets Spec', time: '8m ago', type: 'open' },
  { id: 'act-3', text: 'Eleanor Vance updated Julian\'s role', time: '15m ago', type: 'role' },
  { id: 'act-4', text: 'Sockets session synched', time: '30m ago', type: 'live' }
];

export default function App() {
  // STATES
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'light' ? 'light' : 'dark';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDocument, setCurrentDocument] = useState(null);
  
  // Synchronize theme classes on mount & state change
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);
  
  const [documents, setDocuments] = useState(initialDocs);
  const [teamMembers, setTeamMembers] = useState(initialTeam);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activityLogs, setActivityLogs] = useState(initialActivityLogs);

  // Layout View Modes
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [autoSave, setAutoSave] = useState(true);

  // Modal controls
  const [modalType, setModalType] = useState(''); 
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Toast Alerts States
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info'); 

  // Stats KPIs
  const [stats, setStats] = useState({
    totalDocuments: initialDocs.length,
    activeTeamMembers: initialTeam.filter(u => u.status === 'Active').length,
    liveCollaborations: 3,
    pendingInvitations: 2
  });

  const [chartData, setChartData] = useState({
    weeklyDocuments: [
      { day: 'Mon', count: 12, date: 'May 21' },
      { day: 'Tue', count: 18, date: 'May 22' },
      { day: 'Wed', count: 26, date: 'May 23' },
      { day: 'Thu', count: 15, date: 'May 24' },
      { day: 'Fri', count: 32, date: 'May 25' },
      { day: 'Sat', count: 8, date: 'May 26' },
      { day: 'Sun', count: 6, date: 'May 27' }
    ],
    teamProductivity: [
      { name: 'Engineering', value: 35, color: '#0D6EFD', label: 'Code & Specs' },
      { name: 'Product', value: 25, color: '#3FA3FF', label: 'User Journeys' },
      { name: 'Marketing', value: 20, color: '#94a3b8', label: 'Client pitches' },
      { name: 'Design', value: 20, color: '#cbd5e1', label: 'UX/UI Wireframes' }
    ]
  });

  // TOAST TRIGGER
  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // THEME SWITCH
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode Enabled`, 'info');
  };

  // SYNC ACTION
  const handleSyncLogs = () => {
    showToast("Synching metrics with CollabDocs Server...", "info");
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        totalDocuments: documents.length,
        activeTeamMembers: teamMembers.filter(u => u.status === 'Active').length
      }));
      
      setChartData(prev => {
        const updated = [...prev.weeklyDocuments];
        updated[6].count = Math.min(updated[6].count + 1, 35);
        return {
          ...prev,
          weeklyDocuments: updated
        };
      });

      showToast("Synch successful!", "success");
    }, 850);
  };

  // ACTIONS MAP
  const handleRibbonAction = (actionName) => {
    if (actionName === 'invite') {
      setModalType('invite');
    } else if (actionName === 'share') {
      setModalType('share');
    } else if (actionName === 'restore') {
      setModalType('restore');
    } else if (actionName.startsWith('template-')) {
      const templateId = actionName.split('-')[1];
      setModalType('create');
      setSelectedDoc({ category: templateId });
    } else if (actionName.startsWith('export-')) {
      const format = actionName.split('-')[1];
      setModalType(`export-${format}`);
      setSelectedDoc(documents[0]); 
    }
  };

  // SUBMITS
  const handleModalSubmit = (payload) => {
    if (modalType === 'create') {
      const newDoc = {
        id: `doc-${documents.length + 1}`,
        name: payload.title,
        category: payload.template,
        owner: { name: 'Eleanor Vance', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop' },
        sharedUsers: payload.collaborators.map((email) => ({
          name: email.split('@')[0],
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop'
        })),
        updatedAt: 'Just now',
        liveCollaborators: []
      };

      setDocuments([newDoc, ...documents]);
      setStats(prev => ({ ...prev, totalDocuments: prev.totalDocuments + 1 }));
      showToast(`Created document "${payload.title}"`, 'success');
      setCurrentDocument(newDoc); // Auto-open inside editor!
      
      setActivityLogs([
        { id: `act-${activityLogs.length + 1}`, text: `Eleanor created document "${payload.title}"`, time: 'Just now', type: 'create' },
        ...activityLogs
      ]);
    } 
    else if (modalType === 'invite') {
      const newMember = {
        id: `usr-${teamMembers.length + 1}`,
        name: payload.email.split('@')[0],
        email: payload.email,
        role: payload.role,
        status: 'Idle',
        lastActive: 'Invited',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'
      };

      setTeamMembers([...teamMembers, newMember]);
      setStats(prev => ({ ...prev, pendingInvitations: prev.pendingInvitations + 1 }));
      showToast(`Invited ${payload.email}`, 'success');

      setActivityLogs([
        { id: `act-${activityLogs.length + 1}`, text: `Eleanor Vance invited ${payload.email}`, time: 'Just now', type: 'invite' },
        ...activityLogs
      ]);
    }
    else if (modalType === 'share') {
      const doc = documents.find(d => d.id === payload.docId);
      if (doc) {
        const alreadyShared = doc.sharedUsers.some(u => u.name === payload.email.split('@')[0]);
        if (!alreadyShared) {
          const updatedDocs = documents.map(d => {
            if (d.id === payload.docId) {
              return {
                ...d,
                sharedUsers: [
                  ...d.sharedUsers,
                  { name: payload.email.split('@')[0], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop' }
                ]
              };
            }
            return d;
          });
          setDocuments(updatedDocs);
        }
        showToast(`Shared "${doc.name}" with ${payload.email}`, 'success');
      }
    }
    else if (modalType.startsWith('export')) {
      showToast(`Exported "${selectedDoc?.name || 'File'}.${payload.format}"`, 'success');
    }
    else if (modalType === 'restore') {
      showToast(`Restored to version ${payload.version}`, 'success');
      
      const updatedDocs = documents.map(d => {
        if (d.id === payload.docId) {
          return {
            ...d,
            updatedAt: 'Just now'
          };
        }
        return d;
      });
      setDocuments(updatedDocs);
      
      setActivityLogs([
        { id: `act-${activityLogs.length + 1}`, text: `Eleanor Vance rolled back timeline`, time: 'Just now', type: 'restore' },
        ...activityLogs
      ]);
    }

    setModalType('');
    setSelectedDoc(null);
  };

  // ROLES
  const handleRoleChange = (memberId, newRole) => {
    const updatedTeam = teamMembers.map(member => {
      if (member.id === memberId) {
        showToast(`Changed ${member.name} to ${newRole}`, 'success');
        
        setActivityLogs([
          { id: `act-${activityLogs.length + 1}`, text: `Eleanor updated ${member.name}'s role`, time: 'Just now', type: 'role' },
          ...activityLogs
        ]);
        
        return {
          ...member,
          role: newRole
        };
      }
      return member;
    });
    setTeamMembers(updatedTeam);
  };

  // DELETE
  const handleDeleteDoc = (docId) => {
    const docToDelete = documents.find(d => d.id === docId);
    if (confirm(`Delete "${docToDelete?.name}" permanently?`)) {
      setDocuments(documents.filter(d => d.id !== docId));
      setStats(prev => ({ ...prev, totalDocuments: prev.totalDocuments - 1 }));
      showToast(`Deleted "${docToDelete?.name}"`, 'warning');
      
      setActivityLogs([
        { id: `act-${activityLogs.length + 1}`, text: `Eleanor Vance deleted document`, time: 'Just now', type: 'delete' },
        ...activityLogs
      ]);
    }
  };

  // BACKGROUND EVENT SIMULATORS
  useEffect(() => {
    const liveInterval = setInterval(() => {
      const targetUserIdx = Math.floor(Math.random() * (teamMembers.length - 1)) + 1; 
      setTeamMembers(prev => {
        return prev.map((usr, idx) => {
          if (idx === targetUserIdx) {
            const nextStatus = usr.status === 'Active' ? 'Idle' : 'Active';
            return {
              ...usr,
              status: nextStatus,
              lastActive: nextStatus === 'Active' ? 'Just now' : '8m ago'
            };
          }
          return usr;
        });
      });

      setDocuments(prev => {
        return prev.map((doc, idx) => {
          if (idx === 0) {
            const hasSarah = doc.liveCollaborators.includes('Sarah Connor');
            return {
              ...doc,
              liveCollaborators: hasSarah 
                ? doc.liveCollaborators.filter(c => c !== 'Sarah Connor') 
                : [...doc.liveCollaborators, 'Sarah Connor'],
              updatedAt: 'Just now'
            };
          }
          return doc;
        });
      });

      setStats(prev => ({
        ...prev,
        liveCollaborations: Math.max(1, Math.floor(Math.random() * 4) + 1)
      }));

    }, 15000); 

    return () => clearInterval(liveInterval);
  }, [teamMembers.length]);

  if (currentDocument) {
    return (
      <EditingPage
        document={currentDocument}
        theme={theme}
        toggleTheme={toggleTheme}
        onBack={() => setCurrentDocument(null)}
        onSave={(newTitle, newContent, wordCount) => {
          setDocuments(prev => prev.map(d => {
            if (d.id === currentDocument.id) {
              return {
                ...d,
                name: newTitle,
                content: newContent,
                wordCount: wordCount,
                updatedAt: 'Just now'
              };
            }
            return d;
          }));
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'dark' : ''} transition-colors duration-300 bg-[#F7FAFF] dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB]`}>
      
      
      {/* 1. Left Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        notificationsCount={notifications.filter(n => !n.read).length}
      />

      {/* Outer wrapper */}
      <div 
        className={`flex-1 flex flex-col premium-transition min-w-0
          ${sidebarOpen ? 'pl-40' : 'pl-10'}
        `}
      >
        
        {/* 2. Compact Top Navbar */}
        <Navbar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          theme={theme}
          toggleTheme={toggleTheme}
          onCreateClick={() => setModalType('create')}
          notifications={notifications}
          markNotificationsRead={() => {
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            showToast("Notifications cleared", "info");
          }}
          onInviteClick={() => setModalType('invite')}
          onShareClick={() => setModalType('share')}
        />

        {/* 3. Central Page Workspace */}
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          
          {/* Breadcrumbs (SaaS minimal style) */}
          <div className="flex items-center justify-between gap-4 select-none">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-widest transition-colors duration-300">
              <span>Drive</span>
              <ArrowRight size={8} className="text-[#6B7280] dark:text-[#94A3B8]" />
              <span className="text-[#0D6EFD] font-extrabold">{activeTab.replace('-', ' ')}</span>
            </div>

            <button
              onClick={handleSyncLogs}
              className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-[#0F172A] hover:bg-[#F7FAFF] dark:hover:bg-[#0B1220] border border-[#E5E7EB] dark:border-white/10 text-[#081B3A] dark:text-[#E5E7EB] text-[10px] font-bold rounded-lg shadow-sm active:scale-95 transition-all duration-300"
            >
              <RefreshCw size={10} className="text-[#0D6EFD]" />
              <span>Synch status</span>
            </button>
          </div>

          {/* ========================================================== */}
          {/* VIEW: DASHBOARD TAB (Minimal SaaS Grid) */}
          {/* ========================================================== */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in select-none grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Main Column: Welcome, Stats & Recent Documents (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Sleek inline Welcome & Stats Header */}
                <StatsGrid 
                  stats={stats} 
                  activeUsers={teamMembers.filter(u => u.status === 'Active')}
                />

                {/* Recent Documents Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/10 pb-1.5 transition-colors duration-300">
                    <h4 className="font-sans font-bold text-[9px] text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-widest transition-colors duration-300">
                      Recent Documents
                    </h4>
                    <button 
                      onClick={() => setActiveTab('shared-docs')}
                      className="text-[9px] font-bold text-[#0D6EFD] hover:text-[#0D6EFD]/80 transition-colors flex items-center gap-0.5"
                    >
                      <span>Browse all</span>
                      <ArrowRight size={10} />
                    </button>
                  </div>
                  
                  <RecentDocumentsTable 
                    documents={documents}
                    viewMode={viewMode}
                    onShare={(doc) => { setModalType('share'); setSelectedDoc(doc); }}
                    onExport={(doc) => { setModalType('export-pdf'); setSelectedDoc(doc); }}
                    onRestore={(doc) => { setModalType('restore'); setSelectedDoc(doc); }}
                    onDelete={handleDeleteDoc}
                    searchQuery={searchQuery}
                    onEdit={setCurrentDocument}
                  />
                </div>

              </div>

              {/* Right Column: Online Presence & Live Activity Feed (1/3 width) */}
              <div className="space-y-4 lg:pl-2">
                
                {/* Collaborator Presence */}
                <div className="space-y-2 p-3 bg-white dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/10 transition-colors duration-300 rounded-lg">
                  <span className="text-[9px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-widest block border-b border-[#E5E7EB] dark:border-white/10 pb-1.5 transition-colors duration-300">
                    Online Members
                  </span>
                  <TeamActivityTable 
                    teamMembers={teamMembers}
                    onMessageClick={(name) => showToast(`Opening chat with ${name}...`, 'info')}
                    onRoleChange={handleRoleChange}
                  />
                </div>

                {/* Activity Feed */}
                <div className="space-y-2 p-3 bg-white dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-white/10 transition-colors duration-300 rounded-lg">
                  <span className="text-[9px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-widest block border-b border-[#E5E7EB] dark:border-white/10 pb-1.5 transition-colors duration-300">
                    Live Session Activity
                  </span>
                  <CollabActivityFeed 
                    teamMembers={teamMembers}
                    activityLogs={activityLogs}
                  />
                </div>

              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* VIEW: OTHER TABS */}
          {/* ========================================================== */}
          {activeTab !== 'dashboard' && (
            <div className="glass-card p-8 border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] flex flex-col items-center justify-center min-h-[350px] text-center select-none rounded-xl transition-colors duration-300">
              <div className="p-4 bg-[#0D6EFD]/10 text-[#0D6EFD] rounded-full mb-3 shadow-inner">
                {activeTab === 'my-docs' && <FileText size={24} />}
                {activeTab === 'shared-docs' && <Activity size={24} />}
                {activeTab === 'team-members' && <User size={24} />}
                {activeTab === 'activity-logs' && <ClipboardList size={24} />}
                {activeTab === 'analytics' && <Radio size={24} />}
                {activeTab === 'version-history' && <Clock size={24} />}
                {activeTab === 'settings' && <Settings size={24} />}
              </div>

              <h3 className="font-heading font-extrabold text-sm text-[#081B3A] dark:text-[#E5E7EB] uppercase tracking-wider transition-colors duration-300">
                {activeTab.replace('-', ' ')} Feed
              </h3>
              
              <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] mt-1 max-w-sm font-semibold transition-colors duration-300">
                SaaS-grade collaborative drive records mapped from Lead Directory.
              </p>

              {/* Table / Details injection on Settings */}
              {activeTab === 'settings' && (
                <div className="mt-4 flex flex-col gap-2 w-full max-w-xs text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#0F172A] rounded-lg border border-[#E5E7EB] dark:border-white/10 shadow-sm transition-colors duration-300">
                    <span className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">Dark Mode System State</span>
                    <button onClick={toggleTheme} className="font-extrabold text-[#0D6EFD]">
                      {theme === 'dark' ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#0F172A] rounded-lg border border-[#E5E7EB] dark:border-white/10 shadow-sm transition-colors duration-300">
                    <span className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">Sync Speeds</span>
                    <span className="font-extrabold text-emerald-605 dark:text-emerald-400">Live Socket (15s)</span>
                  </div>
                </div>
              )}

              {/* Table injection on Activity Logs */}
              {activeTab === 'activity-logs' && (
                <div className="mt-4 w-full max-w-md text-left bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-lg p-3 divide-y divide-[#E5E7EB]/30 dark:divide-white/5 max-h-52 overflow-y-auto shadow-sm transition-colors duration-300">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="py-2 flex items-center justify-between gap-3 text-[10px] font-bold">
                      <span className="text-[#081B3A] dark:text-[#E5E7EB]">{log.text}</span>
                      <span className="text-[8px] text-[#6B7280] dark:text-[#94A3B8] shrink-0">{log.time}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setActiveTab('dashboard')}
                className="mt-5 flex items-center gap-1 px-3 py-1.5 bg-[#0D6EFD] hover:bg-[#0D6EFD]/90 text-white text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-all"
              >
                <span>Return to Central Dashboard</span>
              </button>
            </div>
          )}

        </main>
      </div>

      {/* 4. Modals Overlays */}
      <Modals 
        modalType={modalType}
        selectedDoc={selectedDoc}
        onClose={() => { setModalType(''); setSelectedDoc(null); }}
        onSubmit={handleModalSubmit}
        documents={documents}
      />

      {/* 5. Toast alerts */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-lg shadow-md select-none transition-colors duration-300">
          <div className={`p-1 rounded text-white transition-colors duration-300
            ${toastType === 'success' ? 'bg-[#0D6EFD]' : ''}
            ${toastType === 'info' ? 'bg-[#0D6EFD]' : ''}
            ${toastType === 'warning' ? 'bg-rose-500' : ''}
          `}>
            <CheckCircle size={12} />
          </div>
          <span className="text-[11px] font-bold text-[#081B3A] dark:text-[#E5E7EB] transition-colors duration-300">
            {toastMessage}
          </span>
        </div>
      )}

    </div>
  );
}
<<<<<<< HEAD

export default App
>>>>>>> 5b0a76b (Completed frontend and backend base setup)
=======
>>>>>>> 02b645e (Improve dashboard UI and fix theme system)
