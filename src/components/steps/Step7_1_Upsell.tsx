'use client';

import { useEffect } from 'react';
import { Clock3, CopyPlus, Drumstick, WalletCards } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useChefdeskSiteOptions } from '@/hooks/useChefdeskData';
import { getPersonalizationDisplay } from '@/lib/personalizations';

export default function Step7_1_Upsell() {
  const { guests, pricing, upsell, personalizationOptions, setUpsell, recalculateTotal, setIsNextEnabled } = useAppStore();
  const { options } = useChefdeskSiteOptions();

  const proteinDisplay = getPersonalizationDisplay('proteinUpgrade', personalizationOptions);
  const duplicateDisplay = getPersonalizationDisplay('duplicateDish', personalizationOptions);
  const timeDisplay = getPersonalizationDisplay('additionalTime', personalizationOptions);

  const isProteinActive = !options?.upsellOptions || options.upsellOptions.includes('proteinUpgrade');
  const isDuplicateActive = !options?.upsellOptions || options.upsellOptions.includes('duplicateDish');
  const isTimeActive = !options?.upsellOptions || options.upsellOptions.includes('additionalTime');

  useEffect(() => {
    const isProteinValid = !upsell.proteinUpgrade || (upsell.proteinUpgradeText?.trim().length ?? 0) >= 3;
    setIsNextEnabled(isProteinValid);
    recalculateTotal();
  }, [recalculateTotal, setIsNextEnabled, upsell.proteinUpgrade, upsell.proteinUpgradeText]);

  const selectedCount = 
    (upsell.proteinUpgrade ? 1 : 0) + 
    (upsell.duplicateDish ? 1 : 0) + 
    (upsell.additionalTime ? 1 : 0);

  const categoryLabels = {
    coldStarter: 'Entrada Fria',
    hotStarter: 'Entrada Quente',
    mainCourse: 'Prato Principal',
    dessert: 'Sobremesa',
  };

  return (
    <div className="w-full">
      <ChefMessage message="Caso deseje uma experiência ainda mais exclusiva, você poderá personalizá-la com as opções abaixo." />

      <div className="mt-8 flex flex-col gap-6">
        
        {/* 1. Mudar Proteína */}
        {isProteinActive && (
          <button
            type="button"
            onClick={() => {
              const active = !upsell.proteinUpgrade;
              setUpsell({
                proteinUpgrade: active,
                proteinUpgradeText: active ? upsell.proteinUpgradeText : '',
              });
            }}
            className={cn(
              "flex items-start gap-4 rounded-xl border-2 border-brand-dark p-5 text-left transition-all cursor-pointer",
              upsell.proteinUpgrade
                ? "bg-brand-dark text-brand-light shadow-[5px_5px_0px_0px_rgba(201,168,106,1)]"
                : "bg-white text-brand-dark shadow-[3px_3px_0px_0px_rgba(5,20,18,1)] hover:-translate-y-0.5"
            )}
          >
            <span className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brand-dark",
              upsell.proteinUpgrade ? "bg-brand-secondary text-brand-dark" : "bg-brand-primary/10 text-brand-primary"
            )}>
              <Drumstick size={24} />
            </span>

            <span className="flex flex-1 flex-col gap-2">
              <span className="font-serif text-2xl font-black leading-tight">{proteinDisplay.name}</span>
              <span className={cn("text-sm font-bold leading-relaxed", upsell.proteinUpgrade ? "text-brand-light/75" : "text-brand-primary/70")}>
                {proteinDisplay.description}
              </span>
              <span className="inline-flex items-center gap-2 pt-1 text-xs font-black uppercase tracking-wider">
                <WalletCards size={16} />
                + R$ {pricing.proteinUpgradePer} por convidado
              </span>
              
              {upsell.proteinUpgrade && (
                <div className="flex flex-col gap-1.5 mt-1">
                  <input 
                    type="text"
                    value={upsell.proteinUpgradeText || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setUpsell({ proteinUpgradeText: e.target.value })}
                    placeholder="Ex: Mudar o Filé Mignon por Cordeiro no prato principal..."
                    className={cn(
                      "w-full bg-white border-2 p-3 text-brand-dark rounded-xl focus:outline-none focus:ring-2 placeholder:text-brand-primary/45 font-semibold text-sm",
                      (upsell.proteinUpgradeText?.trim().length ?? 0) < 3
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : "border-brand-dark focus:ring-brand-secondary/50"
                    )}
                  />
                  {(upsell.proteinUpgradeText?.trim().length ?? 0) < 3 && (
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                      Por favor, especifique qual prato e qual proteína deseja alterar (mínimo 3 caracteres).
                    </p>
                  )}
                </div>
              )}
            </span>

            <span className={cn(
              'mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
              upsell.proteinUpgrade ? 'border-brand-secondary bg-brand-secondary' : 'border-brand-dark bg-white'
            )}>
              {upsell.proteinUpgrade && <span className="h-2.5 w-2.5 rounded-full bg-brand-dark" />}
            </span>
          </button>
        )}

        {/* 2. Prato Duplicado */}
        {isDuplicateActive && (
          <button
            type="button"
            onClick={() => setUpsell({ duplicateDish: !upsell.duplicateDish })}
            className={cn(
              'flex items-start gap-4 rounded-xl border-2 border-brand-dark p-5 text-left transition-all cursor-pointer',
              upsell.duplicateDish
                ? 'bg-brand-dark text-brand-light shadow-[5px_5px_0px_0px_rgba(201,168,106,1)]'
                : 'bg-white text-brand-dark shadow-[3px_3px_0px_0px_rgba(5,20,18,1)] hover:-translate-y-0.5'
            )}
          >
            <span className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brand-dark",
              upsell.duplicateDish ? "bg-brand-secondary text-brand-dark" : "bg-brand-primary/10 text-brand-primary"
            )}>
              <CopyPlus size={24} />
            </span>

            <span className="flex flex-1 flex-col gap-2">
              <span className="font-serif text-2xl font-black leading-tight">{duplicateDisplay.name}</span>
              <span className={cn('text-sm font-bold leading-relaxed', upsell.duplicateDish ? 'text-brand-light/75' : 'text-brand-primary/70')}>
                {upsell.duplicateDish && upsell.duplicateCategory 
                  ? `Selecionou duplicar: ${categoryLabels[upsell.duplicateCategory]}`
                  : duplicateDisplay.description}
              </span>
              <span className="inline-flex items-center gap-2 pt-1 text-xs font-black uppercase tracking-wider">
                <WalletCards size={16} />
                + R$ {pricing.duplicateDishPer} por convidado
              </span>
            </span>

            <span className={cn(
              'mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
              upsell.duplicateDish ? 'border-brand-secondary bg-brand-secondary' : 'border-brand-dark bg-white'
            )}>
              {upsell.duplicateDish && <span className="h-2.5 w-2.5 rounded-full bg-brand-dark" />}
            </span>
          </button>
        )}

        {/* 3. Tempo Adicional */}
        {isTimeActive && (
          <button
            type="button"
            onClick={() => setUpsell({ additionalTime: !upsell.additionalTime })}
            className={cn(
              'flex items-start gap-4 rounded-xl border-2 border-brand-dark p-5 text-left transition-all cursor-pointer',
              upsell.additionalTime
                ? 'bg-brand-dark text-brand-light shadow-[5px_5px_0px_0px_rgba(201,168,106,1)]'
                : 'bg-white text-brand-dark shadow-[3px_3px_0px_0px_rgba(5,20,18,1)] hover:-translate-y-0.5'
            )}
          >
            <span className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brand-dark",
              upsell.additionalTime ? "bg-brand-secondary text-brand-dark" : "bg-brand-primary/10 text-brand-primary"
            )}>
              <Clock3 size={24} />
            </span>

            <span className="flex flex-1 flex-col gap-2">
              <span className="font-serif text-2xl font-black leading-tight">{timeDisplay.name}</span>
              <span className={cn('text-sm font-bold leading-relaxed', upsell.additionalTime ? 'text-brand-light/75' : 'text-brand-primary/70')}>
                {timeDisplay.description}
              </span>
              <span className="inline-flex items-center gap-2 pt-1 text-xs font-black uppercase tracking-wider">
                <WalletCards size={16} />
                + R$ {pricing.additionalTimePer} por convidado
              </span>
            </span>

            <span className={cn(
              'mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
              upsell.additionalTime ? 'border-brand-secondary bg-brand-secondary' : 'border-brand-dark bg-white'
            )}>
              {upsell.additionalTime && <span className="h-2.5 w-2.5 rounded-full bg-brand-dark" />}
            </span>
          </button>
        )}

      </div>

      <div className="mt-6 rounded-xl border border-brand-primary/15 bg-white/80 px-4 py-3 text-center text-sm font-bold text-brand-primary/70">
        {selectedCount > 0
          ? `${selectedCount} extra${selectedCount > 1 ? 's' : ''} aplicado${selectedCount > 1 ? 's' : ''} para ${guests} convidados.`
          : 'Sem extras selecionados. O valor segue apenas com menu base e adicionais anteriores.'}
      </div>
    </div>
  );
}

