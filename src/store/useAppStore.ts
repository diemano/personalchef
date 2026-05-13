import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LeadData {
  name: string;
  phone: string;
}

export interface EventData {
  date?: string;
  shift?: 'lunch' | 'dinner';
  city?: string;
  neighborhood?: string;
  locationType?: 'house' | 'apartment' | 'event_space' | 'other';
  occasion?: string;
  kitchenItems: string[];
  hasDecoration: boolean;
  waiterCount: number;
  waiterCost: number;
  hasDietaryRestrictions?: boolean;
  dietaryRestrictions: string[];
  dietaryNotes: string;
}

export interface AppState {
  currentStep: number; // This is the screen index (1, 2, 3...)
  totalScreens: number;
  guests: number;
  totalCost: number;
  lead: LeadData;
  event: EventData;
  isNextEnabled: boolean;
  
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setGuests: (count: number) => void;
  setTotalCost: (cost: number) => void;
  setLead: (lead: Partial<LeadData>) => void;
  setEvent: (event: Partial<EventData>) => void;
  recalculateTotal: () => void;
  setIsNextEnabled: (isEnabled: boolean) => void;
  
  // Helper to get Etapa (1 to 8)
  getEtapa: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      totalScreens: 24, // Estimate based on the list
      guests: 10,
      totalCost: 0,
      lead: { name: '', phone: '' },
      event: {
        kitchenItems: [],
        hasDecoration: false,
        waiterCount: 1,
        waiterCost: 120,
        dietaryRestrictions: [],
        dietaryNotes: '',
      },
      isNextEnabled: false,

      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1, isNextEnabled: true })),
      prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1), isNextEnabled: true })),
      setGuests: (count) => set({ guests: Math.max(10, count) }),
      setTotalCost: (cost) => set({ totalCost: cost }),
      setLead: (lead) => set({ lead: { ...get().lead, ...lead } }),
      setEvent: (event) => set({ event: { ...get().event, ...event } }),
      recalculateTotal: () => {
        const { event } = get();
        const decorationCost = event.hasDecoration ? 250 : 0;
        const waiterCost = event.waiterCost || 0;
        set({ totalCost: decorationCost + waiterCost });
      },
      setIsNextEnabled: (isEnabled) => set({ isNextEnabled: isEnabled }),

      getEtapa: () => {
        const step = get().currentStep;
        if (step <= 2) return 1;
        if (step <= 5) return 2;
        if (step <= 9) return 3;
        if (step <= 12) return 4;
        if (step <= 13) return 5;
        if (step <= 17) return 6;
        if (step <= 19) return 7;
        return 8;
      }
    }),
    {
      name: 'chef-medeiros-storage',
    }
  )
);
