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

export interface PricingConfig {
  perPerson: number;
  waiterPer: number;
  waiterCostPer: number;
  decorationCost: number;
  proteinUpgradePer: number;
  duplicateDishPer: number;
  additionalTimePer: number;
}

export type PersonalizationKey = 'proteinUpgrade' | 'duplicateDish' | 'additionalTime' | 'decoration';

export interface PersonalizationOption {
  key: PersonalizationKey;
  name: string;
  description: string;
  value: number;
  active: boolean;
}

export type PersonalizationOptions = Partial<Record<PersonalizationKey, PersonalizationOption>>;

export interface AppState {
  currentStep: number; // This is the screen index (1, 2, 3...)
  totalScreens: number;
  draftId?: string;
  guests: number;
  totalCost: number;
  lead: LeadData;
  event: EventData;
  menu: MenuSelection;
  upsell: UpsellOptions;
  pricing: PricingConfig;
  personalizationOptions: PersonalizationOptions;
  isNextEnabled: boolean;
  
  // Actions
  setCurrentStep: (step: number) => void;
  setDraftId: (draftId: string) => void;
  clearDraftId: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setGuests: (count: number) => void;
  setTotalCost: (cost: number) => void;
  setLead: (lead: Partial<LeadData>) => void;
  setEvent: (event: Partial<EventData>) => void;
  setMenuSelection: (category: MenuCategory, dishId: string) => void;
  setUpsell: (upsell: Partial<UpsellOptions>) => void;
  setPricing: (pricing: Partial<PricingConfig>) => void;
  setPersonalizationOptions: (options: PersonalizationOptions) => void;
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
      draftId: undefined,
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
      pricing: {
        perPerson: 220,
        waiterPer: 120,
        waiterCostPer: 120,
        decorationCost: 250,
        proteinUpgradePer: 20,
        duplicateDishPer: 30,
        additionalTimePer: 50,
      },
      personalizationOptions: {},
      isNextEnabled: false,

      setCurrentStep: (step) => set({ currentStep: step }),
      setDraftId: (draftId) => set({ draftId }),
      clearDraftId: () => set({ draftId: undefined }),
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
        const decorationCost = state.event.hasDecoration ? state.pricing.decorationCost : 0;
        const waiterCost = state.event.waiterCost || 0;
        const proteinCost = state.upsell.proteinUpgrade ? guests * state.pricing.proteinUpgradePer : 0;
        const duplicateCost = state.upsell.duplicateDish ? guests * state.pricing.duplicateDishPer : 0;
        const additionalTimeCost = state.upsell.additionalTime ? guests * state.pricing.additionalTimePer : 0;

        return {
          guests,
          totalCost: guests * state.pricing.perPerson + decorationCost + waiterCost + proteinCost + duplicateCost + additionalTimeCost,
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
      setPricing: (pricing) => {
        set({ pricing: { ...get().pricing, ...pricing } });
        get().recalculateTotal();
      },
      setPersonalizationOptions: (personalizationOptions) => set({ personalizationOptions }),
      recalculateTotal: () => {
        const { event, guests, pricing, upsell } = get();
        const baseCost = guests * pricing.perPerson;
        const decorationCost = event.hasDecoration ? pricing.decorationCost : 0;
        const waiterCost = event.waiterCost || 0;
        const proteinCost = upsell.proteinUpgrade ? guests * pricing.proteinUpgradePer : 0;
        const duplicateCost = upsell.duplicateDish ? guests * pricing.duplicateDishPer : 0;
        const additionalTimeCost = upsell.additionalTime ? guests * pricing.additionalTimePer : 0;

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
