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

export type MenuCategory = 'coldStarter' | 'hotStarter' | 'mainCourse' | 'dessert';

export interface MenuSelection {
  coldStarter?: string;
  hotStarter?: string;
  mainCourse?: string;
  dessert?: string;
}

export interface UpsellOptions {
  proteinUpgrade: boolean;
  duplicateDish: boolean;
  additionalTime: boolean;
  duplicateCategory?: MenuCategory;
}

export interface AppState {
  currentStep: number; // This is the screen index (1, 2, 3...)
  totalScreens: number;
  guests: number;
  totalCost: number;
  lead: LeadData;
  event: EventData;
  menu: MenuSelection;
  upsell: UpsellOptions;
  isNextEnabled: boolean;
  
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setGuests: (count: number) => void;
  setTotalCost: (cost: number) => void;
  setLead: (lead: Partial<LeadData>) => void;
  setEvent: (event: Partial<EventData>) => void;
  setMenuSelection: (category: MenuCategory, dishId: string) => void;
  setUpsell: (upsell: Partial<UpsellOptions>) => void;
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
      menu: {},
      upsell: {
        proteinUpgrade: false,
        duplicateDish: false,
        additionalTime: false,
      },
      isNextEnabled: false,

      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({
        currentStep: state.currentStep === 18 && !state.upsell.duplicateDish ? 20 : state.currentStep + 1,
        isNextEnabled: true,
      })),
      prevStep: () => set((state) => ({
        currentStep: state.currentStep === 20 && !state.upsell.duplicateDish ? 18 : Math.max(1, state.currentStep - 1),
        isNextEnabled: true,
      })),
      setGuests: (count) => set((state) => {
        const guests = Math.max(10, count);
        const decorationCost = state.event.hasDecoration ? 250 : 0;
        const waiterCost = state.event.waiterCost || 0;
        const proteinCost = state.upsell.proteinUpgrade ? guests * 20 : 0;
        const duplicateCost = state.upsell.duplicateDish ? guests * 30 : 0;
        const additionalTimeCost = state.upsell.additionalTime ? guests * 50 : 0;

        return {
          guests,
          totalCost: guests * 220 + decorationCost + waiterCost + proteinCost + duplicateCost + additionalTimeCost,
        };
      }),
      setTotalCost: (cost) => set({ totalCost: cost }),
      setLead: (lead) => set({ lead: { ...get().lead, ...lead } }),
      setEvent: (event) => set({ event: { ...get().event, ...event } }),
      setMenuSelection: (category, dishId) => set({ menu: { ...get().menu, [category]: dishId } }),
      setUpsell: (upsell) => {
        const nextUpsell = { ...get().upsell, ...upsell };

        if (upsell.duplicateDish === false) {
          nextUpsell.duplicateCategory = undefined;
        }

        set({ upsell: nextUpsell });
        get().recalculateTotal();
      },
      recalculateTotal: () => {
        const { event, guests, upsell } = get();
        const baseCost = guests * 220;
        const decorationCost = event.hasDecoration ? 250 : 0;
        const waiterCost = event.waiterCost || 0;
        const proteinCost = upsell.proteinUpgrade ? guests * 20 : 0;
        const duplicateCost = upsell.duplicateDish ? guests * 30 : 0;
        const additionalTimeCost = upsell.additionalTime ? guests * 50 : 0;

        set({ totalCost: baseCost + decorationCost + waiterCost + proteinCost + duplicateCost + additionalTimeCost });
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
      skipHydration: true,
    }
  )
);
