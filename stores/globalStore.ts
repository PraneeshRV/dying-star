import { create } from "zustand";
import type { GPUTier } from "@/types";

interface GlobalState {
  /** Whether the initial loading screen has completed */
  loadingComplete: boolean;
  setLoadingComplete: (v: boolean) => void;

  /** GPU performance tier (1=high, 4=no-webgl) */
  gpuTier: GPUTier;
  setGpuTier: (tier: GPUTier) => void;

  /** Terminal open/closed state */
  terminalOpen: boolean;
  toggleTerminal: () => void;

  /** Minigame active state */
  gameActive: boolean;
  setGameActive: (v: boolean) => void;

  /** User prefers reduced motion */
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  loadingComplete: false,
  setLoadingComplete: (v) => set({ loadingComplete: v }),

  gpuTier: 1,
  setGpuTier: (tier) => set({ gpuTier: tier }),

  terminalOpen: false,
  toggleTerminal: () => set((s) => ({ terminalOpen: !s.terminalOpen })),

  gameActive: false,
  setGameActive: (v) => set({ gameActive: v }),

  reducedMotion: false,
  setReducedMotion: (v) => set({ reducedMotion: v }),
}));
