'use client';

import { useAppStore } from '@/store/useAppStore';
import { useChefdeskSiteOptions } from '@/hooks/useChefdeskData';
import { cn } from '@/lib/utils';

export default function Header() {
  const getEtapa = useAppStore((state) => state.getEtapa);
  const currentStep = useAppStore((state) => state.currentStep);
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);
  const lead = useAppStore((state) => state.lead);
  const { options } = useChefdeskSiteOptions();
  const etapa = getEtapa();
  const totalEtapas = 8;
  const progress = (etapa / totalEtapas) * 100;

  const chefTitle = options?.chefTitle || 'Chef Lucas Medeiros';
  const chefLogoUrl = options?.chefLogoUrl || '/logo-azul1.png';

  const stageStartSteps: Record<number, number> = {
    1: 1,  // Captura
    2: 3,  // Apresentação
    3: 6,  // Dados do Evento
    4: 14, // Cardápio
    5: 13, // Restrições
    6: 18, // Personalização
    7: 10, // Cozinha
    8: 20, // Checkout
  };

  const handleBulletClick = (stageNum: number) => {
    const targetStep = stageStartSteps[stageNum];
    if (targetStep) {
      setCurrentStep(targetStep);
    }
  };

  const isClickable = !!(lead.name && lead.phone && lead.name.trim().length >= 3 && lead.phone.trim().length >= 10);

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-light border-b border-brand-primary/10 shadow-sm">
      <div className="max-w-4xl w-full mx-auto px-4 py-2.5 md:py-0 md:h-16 flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <img
            src={chefLogoUrl}
            alt={`${chefTitle} Logo`}
            className="h-8 md:h-9 w-auto object-contain"
          />
          <span className="font-serif font-semibold text-brand-primary text-xs md:text-sm lg:text-base">
            {chefTitle}
          </span>
        </div>

        {/* Stage + Bullets */}
        <div className="flex items-center gap-2 md:gap-3 select-none">
          <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-brand-primary/80">
            Etapa
          </span>
          <div className="flex items-center gap-1.5 md:gap-2.5">
            {Array.from({ length: totalEtapas }, (_, i) => {
              const num = i + 1;
              const isActive = num === etapa;
              const isCompleted = num < etapa;
              const canClick = isClickable || num === 1;

              return (
                <button
                  key={num}
                  type="button"
                  disabled={!canClick}
                  onClick={() => handleBulletClick(num)}
                  className={cn(
                    "w-6 h-6 md:w-7 md:h-7 rounded-full border border-brand-dark flex items-center justify-center font-bold text-[10px] md:text-xs transition-all focus:outline-none focus:ring-1 focus:ring-brand-secondary/50",
                    isActive 
                      ? "bg-brand-secondary text-brand-dark border-brand-dark shadow-[1.5px_1.5px_0px_0px_rgba(5,20,18,1)] scale-110 font-black" 
                      : isCompleted
                        ? "bg-brand-dark text-brand-light border-brand-dark cursor-pointer hover:bg-brand-secondary hover:text-brand-dark"
                        : canClick
                          ? "bg-white text-brand-primary/70 border-brand-dark cursor-pointer hover:bg-brand-secondary/25"
                          : "bg-white text-brand-primary/20 border-brand-primary/10 cursor-not-allowed"
                  )}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Golden Progress Bar */}
      <div className="w-full h-1 bg-brand-primary/10">
        <div 
          className="h-full bg-brand-secondary transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}

