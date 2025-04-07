import { create } from 'zustand';

// Define the shape of the state and its actions
interface DashboardLayoutState {
  activeSection: string; // Holds the ID of the active section (e.g., 'home', 'channels', 'settings')
  setActiveSection: (sectionId: string) => void; // Action to update the active section
}

// Create the Zustand store
export const useDashboardLayoutStore = create<DashboardLayoutState>((set) => ({
  // Initial state
  activeSection: 'home', // Let's default to 'home'

  // Action implementation
  setActiveSection: (sectionId) => set({ activeSection: sectionId }),
})); 