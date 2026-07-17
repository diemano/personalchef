'use client';

import { useEffect } from 'react';
import { CircleDollarSign, Sparkles, Info } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { useChefdeskSiteOptions } from '@/hooks/useChefdeskData';
import { getPersonalizationDisplay } from '@/lib/personalizations';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

export default function Step4_2_Decoration() {
  const { event, lead, pricing, personalizationOptions, setEvent, recalculateTotal, setIsNextEnabled } = useAppStore();
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
            ? `Você gostaria de incluir decoração completa na mesa do seu evento?`
            : `No momento, a decoração não está disponível para seleção. O evento seguirá com foco total na gastronomia premium.`
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {isDecorationActive && (
          <button
            type="button"
            onClick={() => setEvent({ hasDecoration: true })}
            className={cn(
              'flex flex-col gap-4 rounded-xl border-2 border-brand-dark p-6 text-left transition-all cursor-pointer',
              event.hasDecoration
                ? 'bg-brand-dark text-brand-light shadow-[4px_4px_0px_0px_rgba(201,168,106,1)]'
                : 'bg-white text-brand-dark shadow-[2px_2px_0px_0px_rgba(5,20,18,1)] hover:bg-brand-secondary/25'
            )}
          >
            <Sparkles size={28} className={event.hasDecoration ? 'text-brand-secondary' : 'text-brand-primary'} />
            <div>
              <span className="block font-serif text-2xl font-bold">Incluir Decoração</span>
              <span className={cn('mt-2 block text-sm font-bold', event.hasDecoration ? 'text-brand-light/75' : 'text-brand-primary/70')}>
                {decoration.description || 'Ambientação sofisticada para complementar o menu.'}
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
            'flex flex-col justify-center gap-3 rounded-xl border-2 border-brand-dark p-6 text-left transition-all cursor-pointer',
            !event.hasDecoration
              ? 'bg-brand-secondary text-brand-dark shadow-[4px_4px_0px_0px_rgba(5,20,18,1)]'
              : 'bg-white text-brand-dark shadow-[2px_2px_0px_0px_rgba(5,20,18,1)] hover:bg-brand-secondary/25',
            !isDecorationActive && 'col-span-full items-center py-8 text-center'
          )}
        >
          <span className="font-serif text-2xl font-bold">Sem Decoração</span>
          <span className="text-center text-sm font-bold text-brand-primary/70">
            {isDecorationActive 
              ? `Eu, ${lead.name || 'você'}, montarei a mesa posta com meus itens.`
              : 'Foco exclusivo na experiência gastronômica dos pratos.'}
          </span>
        </button>
      </div>

      {isDecorationActive && (
        <div className="mt-8 bg-white border-2 border-brand-dark rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(5,20,18,1)]">
          <div className="relative w-full h-48 bg-brand-primary/10">
            <img 
              src={options?.decorationImageUrl || '/decoracao_mesa.png'} 
              alt="Mesa decorada" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-brand-dark/85 px-3 py-1 rounded-full text-brand-secondary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-brand-secondary/25">
              <Sparkles size={12} className="animate-pulse" />
              <span>Ambientação Exclusiva</span>
            </div>
          </div>
          
          <div className="p-5 text-brand-dark flex flex-col gap-4">
            <div>
              <h4 className="font-serif font-bold text-lg text-brand-primary">O que está incluso na decoração da mesa:</h4>
              <p className="text-sm font-semibold leading-relaxed mt-2 text-brand-primary/80">
                Estão inclusos jogo americano em couro preto ou marrom, pratos sofisticados para todos os tempos do menu, talheres, arranjos florais finos, velas decorativas e papelaria personalizada para compor a experiência.
              </p>
            </div>
            
            <div className="flex items-start gap-2.5 bg-yellow-50 border border-yellow-250 p-3.5 rounded-lg text-yellow-800 text-xs font-bold">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p className="leading-normal">
                Observação importante: itens relacionados às bebidas, como taças e copos, são de responsabilidade do cliente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
