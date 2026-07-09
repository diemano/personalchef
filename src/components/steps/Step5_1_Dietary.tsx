'use client';

import { useEffect } from 'react';
import { AlertTriangle, Utensils, Info } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

export default function Step5_1_Dietary() {
  const { lead, guests, event, setEvent, setIsNextEnabled } = useAppStore();
  const hasRestrictions = event.hasDietaryRestrictions;

  useEffect(() => {
    setIsNextEnabled(hasRestrictions !== undefined);
  }, [hasRestrictions, setIsNextEnabled]);

  const chooseRestrictions = (value: boolean) => {
    setEvent({
      hasDietaryRestrictions: value,
      dietaryNotes: value ? event.dietaryNotes : '',
    });
  };

  const firstName = lead.name?.split(' ')[0] || 'Para o evento';

  return (
    <div className="w-full">
      <ChefMessage message={`${firstName}, para que todos aproveitem bem a experiência, algum dos ${guests} convidados possui restrição alimentar?`} />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => chooseRestrictions(true)}
          className={cn(
            'flex items-center gap-4 p-5 rounded-xl border-2 border-brand-dark text-left transition-all cursor-pointer',
            hasRestrictions === true
              ? 'bg-brand-dark text-brand-light shadow-[4px_4px_0px_0px_rgba(201,168,106,1)]'
              : 'bg-white text-brand-dark hover:bg-brand-secondary/25 shadow-[2px_2px_0px_0px_rgba(5,20,18,1)]'
          )}
        >
          <AlertTriangle size={28} className={hasRestrictions === true ? 'text-brand-secondary' : 'text-brand-primary'} />
          <span className="font-serif text-2xl font-bold">Sim, há restrições</span>
        </button>

        <button
          type="button"
          onClick={() => chooseRestrictions(false)}
          className={cn(
            'flex items-center gap-4 p-5 rounded-xl border-2 border-brand-dark text-left transition-all cursor-pointer',
            hasRestrictions === false
              ? 'bg-brand-secondary text-brand-dark shadow-[4px_4px_0px_0px_rgba(5,20,18,1)]'
              : 'bg-white text-brand-dark hover:bg-brand-secondary/25 shadow-[2px_2px_0px_0px_rgba(5,20,18,1)]'
          )}
        >
          <Utensils size={28} />
          <span className="font-serif text-2xl font-bold">Não, nenhuma</span>
        </button>
      </div>

      {hasRestrictions && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-4">
          <ChefMessage message="Por favor, detalhe as restrições indicando o nome do convidado e o que ele não pode consumir." />

          <div className="flex items-start gap-2.5 bg-brand-light/[0.05] border border-brand-dark/20 p-4 rounded-xl text-brand-light text-xs font-bold">
            <Info size={18} className="shrink-0 mt-0.5" />
            <p className="leading-normal">
              Exemplo de preenchimento: <br />
              - Maria (Grávida: evitar carnes cruas e queijos não pasteurizados) <br />
              - João (APLV / Alergia severa à proteína do leite de vaca) <br />
              - Carla (Amamentando: sem pimenta/condimentos fortes)
            </p>
          </div>

          <textarea
            value={event.dietaryNotes}
            onChange={(e) => setEvent({ dietaryNotes: e.target.value })}
            placeholder="Digite aqui o Nome do Convidado + Restrição Alimentar (Ex: Maria - Grávida, João - APLV...)"
            rows={5}
            className="w-full resize-none rounded-xl border-2 border-brand-dark bg-white p-4 text-brand-dark font-medium shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] placeholder:text-brand-primary/40 focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 text-sm leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}
