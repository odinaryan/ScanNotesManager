import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Define the app state interface
interface AppState {
  // Selected scan ID for viewing notes
  selectedScanId: number | null;
  
  // UI state
  sidebarCollapsed: boolean;
  
  // Actions
  selectScan: (scanId: number | null) => void;
  toggleSidebar: () => void;
  clearSelection: () => void;
}

// Create the Zustand store with devtools support
export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial state
      selectedScanId: null,
      sidebarCollapsed: false,
      
      // Actions
      selectScan: (scanId: number | null) => 
        set({ selectedScanId: scanId }),
      
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      clearSelection: () =>
        set({ selectedScanId: null }),
    }),
    {
      name: 'app-store', // Name for devtools
    }
  )
);

// Selector hooks for specific parts of the state
export const useSelectedScanId = () => useAppStore((state) => state.selectedScanId);
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed); 