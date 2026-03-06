import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Global App Data
  activeCycleId: string | null;
  setActiveCycleId: (id: string | null) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // UI State
      sidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Global App Data
      activeCycleId: null,
      setActiveCycleId: (id) => set({ activeCycleId: id }),

      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "pawa-app-storage",
      partialize: (state) => ({ sidebarOpen: state.sidebarOpen }), // Only persist sidebar state
    },
  ),
);
