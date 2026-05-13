import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppState {
  currentStep: number;
  guests: number;
  totalCost: number;
  
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setGuests: (count: number) => void;
  setTotalCost: (cost: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentStep: 1,
      guests: 10,
      totalCost: 0,

      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
      setGuests: (count) => set({ guests: Math.max(10, count) }),
      setTotalCost: (cost) => set({ totalCost: cost }),
    }),
    {
      name: 'chef-medeiros-storage',
    }
  )
);
