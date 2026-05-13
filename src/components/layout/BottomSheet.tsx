import { useAppStore } from '@/store/useAppStore';

export default function BottomSheet() {
  const { currentStep, totalCost } = useAppStore();

  // Requirements state that the summary should only be visible from step 6 onwards.
  if (currentStep < 6) {
    return null;
  }

  // Formatting currency
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalCost);

  return (
    <div className="fixed bottom-[80px] left-0 w-full bg-brand-dark text-brand-light shadow-lg z-30 transition-transform animate-in slide-in-from-bottom-10">
      <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
        <span className="font-serif font-medium opacity-90">Resumo Estimado</span>
        <span className="font-semibold text-lg text-brand-secondary">{formattedTotal}</span>
      </div>
    </div>
  );
}
