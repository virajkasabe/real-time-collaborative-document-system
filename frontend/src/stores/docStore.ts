import { create } from 'zustand';

export type Collaborator = {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  avatar?: string;
};

type DocState = {
  activeDocId: string | null;
  activeCollaborators: Collaborator[];

  setActiveDoc: (docId: string) => void;
  clearDoc: () => void;
  upsertCollaborator: (user: Collaborator) => void;
  removeCollaborator: (userId: string) => void;
  setCollaborators: (users: Collaborator[]) => void;
};

const getId = (u: Collaborator) => u._id ?? u.id ?? '';

export const useDocStore = create<DocState>((set, get) => ({
  activeDocId: null,
  activeCollaborators: [],

  setActiveDoc: (docId) => set({ activeDocId: docId }),
  clearDoc: () => set({ activeDocId: null, activeCollaborators: [] }),

  upsertCollaborator: (user) => {
    const uid = getId(user);
    if (!uid) return;

    const existing = get().activeCollaborators;
    const found = existing.find((u) => getId(u) === uid);

    if (found) {
      set({
        activeCollaborators: existing.map((u) => (getId(u) === uid ? { ...u, ...user } : u)),
      });
      return;
    }

    set({ activeCollaborators: [...existing, user] });
  },

  removeCollaborator: (userId) => {
    set({
      activeCollaborators: get().activeCollaborators.filter((u) => getId(u) !== userId),
    });
  },

  setCollaborators: (users) => set({ activeCollaborators: users }),
}));

