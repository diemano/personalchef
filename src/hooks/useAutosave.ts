import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useAutosave() {
  const { currentStep, guests, totalCost, lead } = useAppStore();

  useEffect(() => {
    // Only run autosave if we have basic lead data or are past step 1
    if (!lead.name && currentStep === 1) return;

    const handler = setTimeout(() => {
      // Fake API simulation
      console.log('Autosave executado:', {
        currentStep,
        guests,
        totalCost,
        lead,
        timestamp: new Date().toISOString()
      });
    }, 1000);

    return () => clearTimeout(handler);
  }, [currentStep, guests, totalCost, lead]);
}
