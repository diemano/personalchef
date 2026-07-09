'use client';

import { useEffect } from 'react';
import { Clock3, CopyPlus, Drumstick, WalletCards } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useChefdeskSiteOptions } from '@/hooks/useChefdeskData';

export default function Step7_1_Upsell() {
  const { guests, pricing, upsell, setUpsell, recalculateTotal, setIsNextEnabled } = useAppStore();
  const { options } = useChefdeskSiteOptions();

  const isProteinActive = !options?.upsellOptions || options.upsellOptions.includes('proteinUpgrade');
  const isDuplicateActive = !options?.upsellOptions || options.upsellOptions.includes('duplicateDish');
  const isTimeActive = !options?.upsellOptions || options.upsellOptions.includes('additionalTime');

  useEffect(() => {
    const isProteinValid = !upsell.proteinUpgrade || (upsell.proteinUpgradeText?.trim().length ?? 0) >= 3;
    setIsNextEnabled(isProteinValid);
    recalculateTotal();
  }, [recalculateTotal, setIsNextEnabled, upsell.proteinUpgrade, upsell.proteinUpgradeText]);

  const handleProteinChange = (text: string) => {
    setUpsell({
      proteinUpgradeText: text,
      proteinUpgrade: text.trim().length > 0,
    });
  };

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
      <ChefMessage message="Agora entram os toques de personalização. Você pode manter o menu como está ou adicionar extras ao evento." />

      <div className="mt-8 flex flex-col gap-6">
        
        {/* 1. Mudar Proteína */}
        {isProteinActive && (
          <div
            onClick={() => {
              const active = !upsell.proteinUpgrade;
              setUpsell({
                proteinUpgrade: active,
                proteinUpgradeText: active ? upsell.proteinUpgradeText : '',
              });
            }}
            className={cn(
              "flex flex-col gap-4 rounded-xl border-2 border-brand-dark p-5 transition-all text-brand-dark cursor-pointer select-none",
              upsell.proteinUpgrade
                ? "bg-brand-dark text-brand-light shadow-[5px_5px_0px_0px_rgba(201,168,106,1)]"
                : "bg-white text-brand-dark shadow-[3px_3px_0px_0px_rgba(5,20,18,1)] hover:-translate-y-0.5"
            )}
          >
            <div className="flex items-start gap-4">
              <span className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brand-dark",
                upsell.proteinUpgrade ? "bg-brand-secondary text-brand-dark" : "bg-brand-primary/10 text-brand-primary"
              )}>
                <Drumstick size={24} />
              </span>
              <div className="flex-1">
                <span className="block font-serif text-2xl font-black leading-tight">Mudar Proteína</span>
                <span className={cn("text-xs font-black uppercase tracking-wider mt-1 inline-flex items-center gap-1.5", upsell.proteinUpgrade ? "text-brand-secondary" : "text-brand-primary")}>
                  <WalletCards size={14} />
                  + R$ {pricing.proteinUpgradePer} por convidado
                </span>
              </div>
              <span className={cn(
                'mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                upsell.proteinUpgrade ? 'border-brand-secondary bg-brand-secondary' : 'border-brand-dark bg-white'
              )}>
                {upsell.proteinUpgrade && <span className="h-2.5 w-2.5 rounded-full bg-brand-dark" />}
              </span>
            </div>
            
            <div className="flex flex-col gap-1.5 mt-2">
              <p className={cn("text-sm font-bold leading-relaxed", upsell.proteinUpgrade ? "text-brand-light/75" : "text-brand-primary/70")}>
                Mantém as mesmas guarnições do prato escolhido no menu principal, alterando apenas a proteína principal para a carne ou ingrediente de sua preferência.
              </p>
              
              {upsell.proteinUpgrade && (
                <>
                  <input 
                    type="text"
                    value={upsell.proteinUpgradeText || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setUpsell({ proteinUpgradeText: e.target.value })}
                    placeholder="Ex: Mudar o Filé Mignon por Cordeiro no prato principal..."
                    className={cn(
                      "w-full bg-white border-2 p-3 text-brand-dark rounded-xl focus:outline-none focus:ring-2 placeholder:text-brand-primary/45 font-semibold text-sm mt-2",
                      (upsell.proteinUpgradeText?.trim().length ?? 0) < 3
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : "border-brand-dark focus:ring-brand-secondary/50"
                    )}
                  />
                  {(upsell.proteinUpgradeText?.trim().length ?? 0) < 3 && (
                    <p className="text-[10px] font-bold text-red-400 mt-1 uppercase tracking-wider">
                      Por favor, especifique qual prato e qual proteína deseja alterar (mínimo 3 caracteres).
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
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
              <span className="font-serif text-2xl font-black leading-tight">Prato Duplicado</span>
              <span className={cn('text-sm font-bold leading-relaxed', upsell.duplicateDish ? 'text-brand-light/75' : 'text-brand-primary/70')}>
                {upsell.duplicateDish && upsell.duplicateCategory 
                  ? `Selecionou duplicar: ${categoryLabels[upsell.duplicateCategory]}`
                  : 'Ofereça duas opções de escolha para os seus convidados em algum dos tempos do menu.'}
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
              <span className="font-serif text-2xl font-black leading-tight">Tempo Adicional</span>
              <span className={cn('text-sm font-bold leading-relaxed', upsell.additionalTime ? 'text-brand-light/75' : 'text-brand-primary/70')}>
                Adiciona um novo tempo ao menu (passa a ser de 5 tempos), permitindo que todos os convidados aproveitem mais uma etapa deliciosa.
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

