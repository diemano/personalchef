import { useAppStore } from '@/store/useAppStore';

export default function Header() {
  const currentStep = useAppStore((state) => state.currentStep);
  const totalSteps = 8; // Based on ROADMAP phases
  const progress = (currentStep / totalSteps) * 100;

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-light border-b border-brand-primary/10 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-brand-secondary font-serif font-bold text-lg">
            LM
          </div>
          <span className="font-serif font-semibold text-brand-primary text-lg">Chef Lucas Medeiros</span>
        </div>
        <div className="text-sm font-medium text-brand-primary/80">
          Passo {currentStep} de {totalSteps}
        </div>
      </div>
      {/* Progress Bar */}
      <div className="w-full h-1 bg-brand-primary/10">
        <div 
          className="h-full bg-brand-secondary transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
