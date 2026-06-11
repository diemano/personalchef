'use client';

import { useEffect } from 'react';
import { CircleDollarSign, Sparkles } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { useChefdeskSiteOptions } from '@/hooks/useChefdeskData';
import { getPersonalizationDisplay } from '@/lib/personalizations';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

export default function Step4_2_Decoration() {
  const { event, pricing, personalizationOptions, setEvent, recalculateTotal, setIsNextEnabled } = useAppStore();
  const { options } = useChefdeskSiteOptions();
  const decoration = getPersonalizationDisplay('decoration', personalizationOptions);
  const isDecorationActive = !options?.upsellOptions || options.upsellOptions.includes('decoration');

  useEffect(() => {
    setIsNextEnabled(true);
  }, [setIsNextEnabled]);

  useEffect(() => {
    if (options && !isDecorationActive && event.hasDecoration) {
      setEvent({ hasDecoration: false });
    }
  }, [options, isDecorationActive, event.hasDecoration, setEvent]);

  useEffect(() => {
    recalculateTotal();
  }, [event.hasDecoration, recalculateTotal]);

  return (
    <div className="w-full">
      <ChefMessage
        message={
          isDecorationActive
            ? `Voce gostaria de incluir ${decoration.name.toLowerCase()}?`
            : `No momento, ${decoration.name.toLowerCase()} nao esta disponivel para selecao. O evento seguira com foco total na gastronomia premium.`
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {isDecorationActive && (
          <button
            type="button"
            onClick={() => setEvent({ hasDecoration: true })}
            className={cn(
              'flex flex-col gap-4 rounded-xl border-2 border-brand-dark p-6 text-left transition-all',
              event.hasDecoration
                ? 'bg-brand-dark text-brand-light shadow-[4px_4px_0px_0px_rgba(201,168,106,1)]'
                : 'bg-white text-brand-dark shadow-[2px_2px_0px_0px_rgba(5,20,18,1)] hover:bg-brand-secondary/25'
            )}
          >
            <Sparkles size={28} className={event.hasDecoration ? 'text-brand-secondary' : 'text-brand-primary'} />
            <div>
              <span className="block font-serif text-2xl font-bold">Incluir {decoration.name.toLowerCase()}</span>
              <span className={cn('mt-2 block text-sm font-bold', event.hasDecoration ? 'text-brand-light/75' : 'text-brand-primary/70')}>
                {decoration.description}
              </span>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider">
              <CircleDollarSign size={18} />
              + R$ {pricing.decorationCost}
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setEvent({ hasDecoration: false })}
          className={cn(
            'flex flex-col justify-center gap-3 rounded-xl border-2 border-brand-dark p-6 text-left transition-all',
            !event.hasDecoration
              ? 'bg-brand-secondary text-brand-dark shadow-[4px_4px_0px_0px_rgba(5,20,18,1)]'
              : 'bg-white text-brand-dark shadow-[2px_2px_0px_0px_rgba(5,20,18,1)] hover:bg-brand-secondary/25',
            !isDecorationActive && 'col-span-full items-center py-8 text-center'
          )}
        >
          <span className="font-serif text-2xl font-bold">Sem {decoration.name.toLowerCase()}</span>
          <span className="text-center text-sm font-bold text-brand-primary/70">
            {isDecorationActive ? 'Mantemos o foco apenas na experiencia gastronomica.' : 'Foco exclusivo na experiencia gastronomica dos pratos.'}
          </span>
        </button>
      </div>
    </div>
  );
}
