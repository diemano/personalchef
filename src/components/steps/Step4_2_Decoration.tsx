'use client';

import { useEffect } from 'react';
import { Sparkles, CircleDollarSign } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useChefdeskSiteOptions } from '@/hooks/useChefdeskData';

export default function Step4_2_Decoration() {
  const { event, pricing, setEvent, recalculateTotal, setIsNextEnabled } = useAppStore();
  const { options } = useChefdeskSiteOptions();
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
      <ChefMessage message={isDecorationActive ? "Você gostaria de incluir uma decoração gastronômica simples para valorizar a mesa e a apresentação?" : "No momento, o serviço de decoração gastronômica não está disponível para seleção. O evento seguirá com foco total na gastronomia premium."} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {isDecorationActive && (
          <button
            type="button"
            onClick={() => setEvent({ hasDecoration: true })}
            className={cn(
              'flex flex-col gap-4 p-6 rounded-xl border-2 border-brand-dark text-left transition-all',
              event.hasDecoration
                ? 'bg-brand-dark text-brand-light shadow-[4px_4px_0px_0px_rgba(201,168,106,1)]'
                : 'bg-white text-brand-dark hover:bg-brand-secondary/25 shadow-[2px_2px_0px_0px_rgba(5,20,18,1)]'
            )}
          >
            <Sparkles size={28} className={event.hasDecoration ? 'text-brand-secondary' : 'text-brand-primary'} />
            <div>
              <span className="block font-serif text-2xl font-bold">Incluir decoração</span>
              <span className={cn('mt-2 block text-sm font-bold', event.hasDecoration ? 'text-brand-light/75' : 'text-brand-primary/70')}>
                Toque final na mesa e apresentação dos pratos.
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
            'flex flex-col justify-center gap-3 p-6 rounded-xl border-2 border-brand-dark text-left transition-all',
            !event.hasDecoration
              ? 'bg-brand-secondary text-brand-dark shadow-[4px_4px_0px_0px_rgba(5,20,18,1)]'
              : 'bg-white text-brand-dark hover:bg-brand-secondary/25 shadow-[2px_2px_0px_0px_rgba(5,20,18,1)]',
            !isDecorationActive && 'col-span-full py-8 text-center items-center'
          )}
        >
          <span className="font-serif text-2xl font-bold">Sem decoração</span>
          <span className="text-sm font-bold text-brand-primary/70 text-center">
            {isDecorationActive ? "Mantemos o foco apenas na experiência gastronômica." : "Foco exclusivo na experiência gastronômica dos pratos."}
          </span>
        </button>
      </div>
    </div>
  );
}
