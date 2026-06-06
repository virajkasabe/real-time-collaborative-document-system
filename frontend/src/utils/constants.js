// Unified Constants configuration for CollabDocs system

export const BRAND_NAME = 'CollabDocs';

export const TEMPLATES = [
  { id: 'blank', name: 'Blank Page', icon: 'File', desc: 'Start with a clean canvas' },
  { id: 'proposal', name: 'Project Proposal', icon: 'Briefcase', desc: 'Structure pitches & estimates' },
  { id: 'minutes', name: 'Meeting Minutes', icon: 'Clock', desc: 'Summarize discussions & action items' },
  { id: 'spec', name: 'Product Spec Sheet', icon: 'FileText', desc: 'Define features & engineering specs' }
];

export const ACCESS_ROLES = {
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
  ADMIN: 'Admin'
};

export const STORAGE_LIMIT = 5 * 1024 * 1024 * 1024; // 5 GB in bytes
export const INITIAL_STORAGE_USED = 1.84 * 1024 * 1024 * 1024; // 1.84 GB used

export const QUICK_ACTIONS = [
  { id: 'create', label: 'New Document', icon: 'Plus', bg: 'bg-[#0D6EFD]/10 text-[#0D6EFD]' },
  { id: 'template', label: 'Use Template', icon: 'FileText', bg: 'bg-emerald-500/10 text-emerald-500' },
  { id: 'share', label: 'Share Workspace', icon: 'Share2', bg: 'bg-amber-500/10 text-amber-500' },
  { id: 'settings', label: 'System Settings', icon: 'Settings', bg: 'bg-indigo-500/10 text-indigo-500' }
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n-1', text: 'Sarah Connor invited you to product roadmap', time: '10m ago', type: 'invite', read: false },
  { id: 'n-2', text: 'System backup synchronized successfully', time: '1h ago', type: 'success', read: false },
  { id: 'n-3', text: 'Version history limit reached (100 revisions)', time: '1d ago', type: 'alert', read: true }
];
