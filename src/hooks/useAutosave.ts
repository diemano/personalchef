import { useEffect } from 'react';
import { readResourceId, saveOrcamentoDraft } from '@/lib/chefdesk';
import { useAppStore } from '@/store/useAppStore';

export function useAutosave() {
  const {
    currentStep,
    totalScreens,
    isNextEnabled,
    draftId,
    guests,
    totalCost,
    pricing,
    lead,
    event,
    menu,
    upsell,
    setDraftId,
  } = useAppStore();

  useEffect(() => {
    // Only run autosave if we have basic lead data or are past step 1
    if (!lead.name && currentStep === 1) return;

    const handler = setTimeout(() => {
      saveOrcamentoDraft({
        currentStep,
        totalScreens,
        isNextEnabled,
        draftId,
        guests,
        totalCost,
        pricing,
        lead,
        event,
        menu,
        upsell,
      })
        .then((response) => {
          const nextDraftId = readResourceId(response);

          if (!draftId && nextDraftId) {
            setDraftId(nextDraftId);
          }
        })
        .catch((error) => {
          console.error('Falha ao salvar rascunho ChefDesk:', error);
        });
    }, 1200);

    return () => clearTimeout(handler);
  }, [
    currentStep,
    totalScreens,
    isNextEnabled,
    draftId,
    guests,
    totalCost,
    pricing,
    lead,
    event,
    menu,
    upsell,
    setDraftId,
  ]);
}
