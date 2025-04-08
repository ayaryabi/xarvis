import { create } from 'zustand';

// Define the state shape
// Remove activeSection and related action
interface DashboardLayoutState {
  // activeSection: string;
  // setActiveSection: (section: string) => void;
  // Add other layout-related states here if needed in the future
  tempState?: string; // Example placeholder if store becomes empty
}

// Create the store
export const useDashboardLayoutStore = create<DashboardLayoutState>((set) => ({
  // activeSection: 'channels', // Default value removed
  // setActiveSection: (section) => set({ activeSection: section }), // Action removed
  tempState: 'example', // Example placeholder
})); 