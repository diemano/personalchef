import { useAppStore } from '@/store/useAppStore';

export default function Footer() {
  const { currentStep, nextStep, prevStep, isNextEnabled } = useAppStore();

  if (currentStep >= 20) {
    return (
      <footer className="fixed bottom-0 left-0 w-full bg-brand-light/80 backdrop-blur-md border-t border-brand-primary/10 z-40 pb-safe">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button
            onClick={prevStep}
            className="w-full px-6 py-4 rounded-xl font-bold text-brand-primary uppercase tracking-wider transition-all hover:bg-brand-secondary/25 active:scale-95"
          >
            Voltar
          </button>
        </div>
      </footer>
    );
  }

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-brand-light/80 backdrop-blur-md border-t border-brand-primary/10 z-40 pb-safe">
      <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-between gap-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-4 rounded-xl font-bold text-brand-primary uppercase tracking-wider disabled:opacity-0 transition-all hover:bg-brand-secondary/25 active:scale-95"
        >
          Voltar
        </button>
        <button
          onClick={nextStep}
          disabled={!isNextEnabled}
          className="flex-1 px-6 py-4 bg-brand-dark text-brand-light rounded-xl font-bold uppercase tracking-widest transition-all hover:bg-brand-secondary hover:text-brand-dark shadow-[4px_4px_0px_0px_rgba(201,168,106,1)] disabled:opacity-50 disabled:shadow-none disabled:bg-gray-400 disabled:hover:text-brand-light active:scale-95 flex justify-center items-center"
        >
          Continuar
        </button>
      </div>
    </footer>
  );
}
