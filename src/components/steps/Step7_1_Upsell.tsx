'use client';

import { useEffect } from 'react';
import { Clock3, CopyPlus, Drumstick, WalletCards } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

const upsellOptions = [
  {
    key: 'proteinUpgrade',
    title: 'Troca de proteína',
    description: 'Eleve o prato principal com uma proteína premium alinhada ao menu escolhido.',
    price: '+ R$ 20 por convidado',
    icon: <Drumstick size={26} />,
  },
  {
    key: 'duplicateDish',
    title: 'Prato duplicado',
    description: 'Inclua uma segunda opção em uma categoria do menu para ampliar a escolha dos convidados.',
    price: '+ R$ 30 por convidado',
    icon: <CopyPlus size={26} />,
  },
  {
    key: 'additionalTime',
    title: 'Tempo adicional',
    description: 'Estenda a presenca da equipe para eventos com ritmo mais longo ou recepcao prolongada.',
    price: '+ R$ 50 por convidado',
    icon: <Clock3 size={26} />,
  },
] as const;

export default function Step7_1_Upsell() {
  const { guests, upsell, setUpsell, recalculateTotal, setIsNextEnabled } = useAppStore();

  useEffect(() => {
    setIsNextEnabled(true);
    recalculateTotal();
  }, [recalculateTotal, setIsNextEnabled]);

  const selectedCount = Number(upsell.proteinUpgrade) + Number(upsell.duplicateDish) + Number(upsell.additionalTime);

  return (
    <div className="w-full">
      <ChefMessage message="Agora entram os toques de personalização. Você pode manter o menu como está ou adicionar extras ao evento." />

      <div className="mt-8 grid grid-cols-1 gap-4">
        {upsellOptions.map((option) => {
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
                {option.icon}
              </span>

              <span className="flex flex-1 flex-col gap-2">
                <span className="font-serif text-2xl font-black leading-tight">{option.title}</span>
                <span className={cn('text-sm font-bold leading-relaxed', isSelected ? 'text-brand-light/75' : 'text-brand-primary/70')}>
                  {option.description}
                </span>
                <span className="inline-flex items-center gap-2 pt-1 text-xs font-black uppercase tracking-wider">
                  <WalletCards size={16} />
                  {option.price}
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

      <div className="mt-6 rounded-xl border border-brand-primary/15 bg-white/80 px-4 py-3 text-center text-sm font-bold text-brand-primary/70">
        {selectedCount > 0
          ? `${selectedCount} extra${selectedCount > 1 ? 's' : ''} aplicado${selectedCount > 1 ? 's' : ''} para ${guests} convidados.`
          : 'Sem extras selecionados. O valor segue apenas com menu base e adicionais anteriores.'}
      </div>
    </div>
  );
}
