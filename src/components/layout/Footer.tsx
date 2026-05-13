import { useAppStore } from '@/store/useAppStore';

export default function Footer() {
  const { currentStep, nextStep, prevStep } = useAppStore();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-brand-light border-t border-brand-primary/10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 pb-safe">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-3 rounded-md font-medium text-brand-primary disabled:opacity-50 transition-colors hover:bg-brand-primary/5"
        >
          Voltar
        </button>
        <button
          onClick={nextStep}
          className="flex-1 px-6 py-3 bg-brand-primary text-brand-light rounded-md font-medium transition-colors hover:bg-brand-primary/90 flex justify-center items-center"
        >
          Continuar
        </button>
      </div>
    </footer>
  );
}
