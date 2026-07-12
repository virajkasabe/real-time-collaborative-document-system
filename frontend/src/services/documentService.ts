import { generateId } from '../utils/helpers';

const INITIAL_DOCS = [
  {
    id: 'doc-1',
    name: 'Product Roadmap Q3',
    content: '<h2>CollabDocs Q3 Product Roadmap</h2><p>This is the initial draft of our high-level roadmap for the third quarter. Key milestones include offline mode sync, responsive templates database, and socket rooms...</p>',
    starred: true,
    trash: false,
    sharedUsers: [
      { email: 'sarah@company.com', name: 'Sarah Connor', role: 'Editor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150' },
      { email: 'mark@company.com', name: 'Mark Hoppus', role: 'Viewer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150' }
    ],
    owner: { name: 'Eleanor Vance', email: 'eleanor@company.com' },
    category: 'proposal',
    updatedAt: '3m ago',
    lastModified: '2026-05-30T10:00:00Z',
    comments: [
      { id: 'c-1', user: 'Sarah Connor', text: 'Should we prioritize the rich text toolbar edits first?', time: '5m ago' }
    ],
    versions: [
      { id: 'v3', name: 'Version 2.4.1', date: '10:24 AM', author: 'Eleanor Vance', content: '<h2>CollabDocs Q3 Product Roadmap</h2><p>This is version 2.4.1...</p>' },
      { id: 'v2', name: 'Version 2.3.0', date: 'Yesterday', author: 'Sarah Connor', content: '<h2>CollabDocs Q3 Product Roadmap</h2><p>This is version 2.3.0...</p>' },
      { id: 'v1', name: 'Version 2.1.2', date: 'May 23', author: 'Dave Grohl', content: '<h2>CollabDocs Q3 Product Roadmap</h2><p>This is the first draft...</p>' }
    ]
  },
  {
    id: 'doc-2',
    name: 'Sockets Spec Sheet',
    content: '<h2>Sockets Protocol Specification</h2><p>Guidelines on establishing socket rooms, collaborative cursor coordinates transmissions, and typing indicators timeouts...</p>',
    starred: false,
    trash: false,
    sharedUsers: [
      { email: 'julian@company.com', name: 'Julian Casablancas', role: 'Editor', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150' }
    ],
    owner: { name: 'Sarah Connor', email: 'sarah@company.com' },
    category: 'spec',
    updatedAt: '8m ago',
    lastModified: '2026-05-30T09:30:00Z',
    comments: [],
    versions: [
      { id: 'v1', name: 'Initial Spec Draft', date: 'Yesterday', author: 'Julian Casablancas', content: '<h2>Sockets Protocol Specification</h2><p>Guidelines...</p>' }
    ]
  },
  {
    id: 'doc-3',
    name: 'Q2 Marketing Sync Notes',
    content: '<h2>Q2 Marketing Review Notes</h2><p>Marketing and advertising updates from the Q2 campaigns. Goals were surpassed by 18.4% globally...</p>',
    starred: true,
    trash: false,
    sharedUsers: [],
    owner: { name: 'Eleanor Vance', email: 'eleanor@company.com' },
    category: 'minutes',
    updatedAt: 'Yesterday',
    lastModified: '2026-05-29T15:20:00Z',
    comments: [],
    versions: []
  },
  {
    id: 'doc-4',
    name: 'System Bug Backlog (Trash Mock)',
    content: '<h2>Bug Backlog</h2><p>This document tracks resolved backlog and deprecated requirements...</p>',
    starred: false,
    trash: true,
    sharedUsers: [],
    owner: { name: 'Eleanor Vance', email: 'eleanor@company.com' },
    category: 'blank',
    updatedAt: '3 days ago',
    lastModified: '2026-05-27T12:00:00Z',
    comments: [],
    versions: []
  }
];

const getDB = (): any[] => {
  const db = localStorage.getItem('collabdocs_db');
  if (!db) {
    localStorage.setItem('collabdocs_db', JSON.stringify(INITIAL_DOCS));
    return INITIAL_DOCS;
  }
  return JSON.parse(db);
};

const saveDB = (data: any[]) => {
  localStorage.setItem('collabdocs_db', JSON.stringify(data));
};

export const documentService = {
  getAll: () => {
    return getDB().filter(d => !d.trash);
  },

  getStarred: () => {
    return getDB().filter(d => d.starred && !d.trash);
  },

  getRecent: () => {
    return getDB().filter(d => !d.trash).sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
  },

  getShared: (email: string) => {
    return getDB().filter(d => !d.trash && d.sharedUsers.some(u => u.email === email));
  },

  getTrash: () => {
    return getDB().filter(d => d.trash);
  },

  getById: (id: string) => {
    return getDB().find(d => d.id === id);
  },

  create: (nameOrObj: any, category: string = 'blank', ownerEmail: string = 'eleanor@company.com', ownerName: string = 'Eleanor Vance') => {
    const db = getDB();
    let name = '';
    let content = '';
    let owner = { name: ownerName, email: ownerEmail };
    let cat = category;
    let isImported = false;
    let originalFileName = '';
    let type = 'blank';

    if (nameOrObj && typeof nameOrObj === 'object') {
      name = nameOrObj.title || 'Untitled Document';
      content = nameOrObj.content !== undefined ? nameOrObj.content : `<h2>${name}</h2><p>Start writing collaborative records here...</p>`;
      cat = nameOrObj.category || 'blank';
      isImported = nameOrObj.isImported || false;
      originalFileName = nameOrObj.originalFileName || '';
      type = nameOrObj.type || 'blank';
      if (nameOrObj.owner) {
        owner = { name: nameOrObj.owner.name || ownerName, email: nameOrObj.owner.email || ownerEmail };
      }
    } else {
      name = nameOrObj || 'Untitled Document';
      content = `<h2>${name}</h2><p>Start writing collaborative records here...</p>`;
    }

    const newDoc = {
      id: generateId(),
      name,
      content,
      starred: false,
      trash: false,
      sharedUsers: [] as any[],
      owner,
      category: cat,
      updatedAt: 'Just now',
      lastModified: new Date().toISOString(),
      comments: [] as any[],
      versions: [] as any[],
      isImported,
      originalFileName,
      type
    };
    db.push(newDoc);
    saveDB(db);
    return newDoc;
  },

  update: (id: string, updates: any) => {
    const db = getDB();
    const index = db.findIndex(d => d.id === id);
    if (index !== -1) {
      db[index] = {
        ...db[index],
        ...updates,
        lastModified: new Date().toISOString(),
        updatedAt: 'Just now'
      };
      saveDB(db);
      return db[index];
    }
    return null;
  },

  delete: (id: string) => {
    const db = getDB();
    const index = db.findIndex(d => d.id === id);
    if (index !== -1) {
      if (db[index].trash) {
        // Permanent delete
        db.splice(index, 1);
      } else {
        // Move to trash
        db[index].trash = true;
      }
      saveDB(db);
      return true;
    }
    return false;
  },

  restore: (id: string) => {
    const db = getDB();
    const index = db.findIndex(d => d.id === id);
    if (index !== -1) {
      db[index].trash = false;
      saveDB(db);
      return true;
    }
    return false;
  },

  star: (id: string, state: boolean) => {
    return documentService.update(id, { starred: state });
  },

  addMember: (docId: string, email: string, role: string = 'Editor') => {
    const doc = documentService.getById(docId);
    if (!doc) return null;

    const existing = doc.sharedUsers.find(u => u.email === email);
    if (existing) return null; // already shared

    const name = email.split('@')[0].toUpperCase();
    const newUser = {
      email,
      name,
      role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    };

    const updatedShared = [...doc.sharedUsers, newUser];
    return documentService.update(docId, { sharedUsers: updatedShared });
  },

  removeMember: (docId: string, email: string) => {
    const doc = documentService.getById(docId);
    if (!doc) return null;

    const updatedShared = doc.sharedUsers.filter(u => u.email !== email);
    return documentService.update(docId, { sharedUsers: updatedShared });
  },

  changeRole: (docId: string, email: string, role: string) => {
    const doc = documentService.getById(docId);
    if (!doc) return null;

    const updatedShared = doc.sharedUsers.map(u => 
      u.email === email ? { ...u, role } : u
    );
    return documentService.update(docId, { sharedUsers: updatedShared });
  },

  addComment: (docId: string, userName: string, text: string) => {
    const doc = documentService.getById(docId);
    if (!doc) return null;

    const newComment = {
      id: 'comment-' + Math.random().toString(36).substr(2, 5),
      user: userName,
      text,
      time: 'Just now'
    };

    const updatedComments = [...doc.comments, newComment];
    return documentService.update(docId, { comments: updatedComments });
  },

  addVersionCheckpoint: (docId: string, author: string, name: string) => {
    const doc = documentService.getById(docId);
    if (!doc) return null;

    const newVersion = {
      id: 'v-' + Math.random().toString(36).substr(2, 5),
      name: name || `Revision Checkpoint`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author,
      content: doc.content
    };

    const updatedVersions = [newVersion, ...doc.versions];
    return documentService.update(docId, { versions: updatedVersions });
  }
};
