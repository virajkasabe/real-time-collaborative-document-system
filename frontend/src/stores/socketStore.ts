import { create } from 'zustand';

type SocketState = {
  isConnected: boolean;
  socketReady: boolean;
  setConnection: (next: { isConnected: boolean; socketReady: boolean }) => void;
  reset: () => void;
};

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  socketReady: false,
  setConnection: (next) => set(next),
  reset: () => set({ isConnected: false, socketReady: false }),
}));

