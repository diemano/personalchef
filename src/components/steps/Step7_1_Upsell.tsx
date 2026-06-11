'use client';

import { useEffect, useMemo } from 'react';
import { Clock3, CopyPlus, Drumstick, WalletCards } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { getAllPersonalizationDisplays } from '@/lib/personalizations';
import { cn } from '@/lib/utils';
import type { PersonalizationKey, UpsellOptions } from '@/store/useAppStore';
import { useAppStore } from '@/store/useAppStore';
import { useChefdeskSiteOptions } from '@/hooks/useChefdeskData';

type UpsellKey = Exclude<PersonalizationKey, 'decoration'>;

const upsellIcons: Record<Exclude<PersonalizationKey, 'decoration'>, React.ReactNode> = {
  proteinUpgrade: <Drumstick size={26} />,
  duplicateDish: <CopyPlus size={26} />,
  additionalTime: <Clock3 size={26} />,
};

function isUpsellKey(key: PersonalizationKey): key is UpsellKey {
  return key !== 'decoration';
}

export default function Step7_1_Upsell() {
  const { guests, pricing, personalizationOptions, upsell, setUpsell, recalculateTotal, setIsNextEnabled } = useAppStore();
  const { options } = useChefdeskSiteOptions();

  useEffect(() => {
    setIsNextEnabled(true);
    recalculateTotal();
  }, [recalculateTotal, setIsNextEnabled]);

  const upsellOptions = useMemo(
    () =>
      getAllPersonalizationDisplays(personalizationOptions).filter(
        (option): option is ReturnType<typeof getAllPersonalizationDisplays>[number] & { key: UpsellKey } => isUpsellKey(option.key)
      ),
    [personalizationOptions]
  );
  const activeUpsellOptions = upsellOptions.filter((option) => !options?.upsellOptions || options.upsellOptions.includes(option.key));

  useEffect(() => {
    if (!options?.upsellOptions) return;

    const unavailableSelection = upsellOptions.reduce<Partial<UpsellOptions>>((selection, option) => {
      if (!options.upsellOptions.includes(option.key) && upsell[option.key]) {
        selection[option.key] = false;
      }

      return selection;
    }, {});

    if (Object.keys(unavailableSelection).length > 0) {
      setUpsell(unavailableSelection);
    }
  }, [options?.upsellOptions, setUpsell, upsell, upsellOptions]);

  const selectedCount = activeUpsellOptions.reduce((acc, option) => acc + (upsell[option.key] ? 1 : 0), 0);

  return (
    <div className="w-full">
      <ChefMessage message="Agora entram os toques de personalização. Você pode manter o menu como está ou adicionar extras ao evento." />

      {activeUpsellOptions.length === 0 ? (
        <div className="mt-8 text-center text-brand-light/70 py-8 bg-white/5 rounded-xl border border-brand-light/10">
          Nenhuma opção de personalização disponível no momento. Você pode prosseguir.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4">
          {activeUpsellOptions.map((option) => {
            const isSelected = upsell[option.key];

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setUpsell({ [option.key]: !isSelected })}
                className={cn(
                  'flex items-start gap-4 rounded-xl border-2 border-brand-dark p-5 text-left transition-all',
                  isSelected
                    ? 'bg-brand-dark text-brand-light shadow-[5px_5px_0px_0px_rgba(201,168,106,1)]'
                    : 'bg-white text-brand-dark shadow-[3px_3px_0px_0px_rgba(5,20,18,1)] hover:-translate-y-0.5'
                )}
              >
                <span
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brand-dark',
                    isSelected ? 'bg-brand-secondary text-brand-dark' : 'bg-brand-primary/10 text-brand-primary'
                  )}
                >
                  {upsellIcons[option.key]}
                </span>

                <span className="flex flex-1 flex-col gap-2">
                  <span className="font-serif text-2xl font-black leading-tight">{option.name}</span>
                  <span className={cn('text-sm font-bold leading-relaxed', isSelected ? 'text-brand-light/75' : 'text-brand-primary/70')}>
                    {option.description}
                  </span>
                  <span className="inline-flex items-center gap-2 pt-1 text-xs font-black uppercase tracking-wider">
                    <WalletCards size={16} />
                    + R$ {pricing[option.priceKey]} por convidado
                  </span>
                </span>

                <span
                  className={cn(
                    'mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                    isSelected ? 'border-brand-secondary bg-brand-secondary' : 'border-brand-dark bg-white'
                  )}
                  aria-hidden="true"
                >
                  {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-brand-dark" />}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {activeUpsellOptions.length > 0 && (
        <div className="mt-6 rounded-xl border border-brand-primary/15 bg-white/80 px-4 py-3 text-center text-sm font-bold text-brand-primary/70">
          {selectedCount > 0
            ? `${selectedCount} extra${selectedCount > 1 ? 's' : ''} aplicado${selectedCount > 1 ? 's' : ''} para ${guests} convidados.`
            : 'Sem extras selecionados. O valor segue apenas com menu base e adicionais anteriores.'}
        </div>
      )}
    </div>
  );
}

