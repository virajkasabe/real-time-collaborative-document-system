import { create } from 'zustand';

type UiState = {
  toastEnabled: boolean;
  setToastEnabled: (v: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  toastEnabled: true,
  setToastEnabled: (v) => set({ toastEnabled: v }),
}));

