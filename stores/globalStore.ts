import { create } from "zustand";

interface GlobalState {
  /** Whether the initial loading screen has completed */
  loadingComplete: boolean;
  setLoadingComplete: (v: boolean) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  loadingComplete: false,
  setLoadingComplete: (v) => set({ loadingComplete: v }),
}));
