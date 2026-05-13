'use client';

import { useEffect } from 'react';
import { AlertTriangle, Salad, Shell, WheatOff, MilkOff, Leaf, PlusCircle, Utensils } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

const restrictionOptions = [
  { id: 'vegetarian', label: 'Vegetariano', icon: <Leaf size={18} /> },
  { id: 'vegan', label: 'Vegano', icon: <Salad size={18} /> },
  { id: 'gluten_free', label: 'Sem gluten', icon: <WheatOff size={18} /> },
  { id: 'lactose_free', label: 'Sem lactose', icon: <MilkOff size={18} /> },
  { id: 'shrimp_allergy', label: 'Alergia a camarao', icon: <Shell size={18} /> },
  { id: 'other', label: 'Outro', icon: <PlusCircle size={18} /> },
];

export default function Step5_1_Dietary() {
  const { lead, guests, event, setEvent, setIsNextEnabled } = useAppStore();
  const hasRestrictions = event.hasDietaryRestrictions;
  const selected = event.dietaryRestrictions || [];

  useEffect(() => {
    setIsNextEnabled(hasRestrictions !== undefined);
  }, [hasRestrictions, setIsNextEnabled]);

  const chooseRestrictions = (value: boolean) => {
    setEvent({
      hasDietaryRestrictions: value,
      dietaryRestrictions: value ? selected : [],
      dietaryNotes: value ? event.dietaryNotes : '',
    });
  };

  const toggleRestriction = (id: string) => {
    const nextRestrictions = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];

    setEvent({ dietaryRestrictions: nextRestrictions });
  };

  const firstName = lead.name?.split(' ')[0] || 'Para o evento';

  return (
    <div className="w-full">
      <ChefMessage message={`${firstName}, para que todos aproveitem bem a experiencia, algum dos ${guests} convidados possui restricao alimentar?`} />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => chooseRestrictions(true)}
          className={cn(
            'flex items-center gap-4 p-5 rounded-xl border-2 border-brand-dark text-left transition-all',
            hasRestrictions === true
              ? 'bg-brand-dark text-brand-light shadow-[4px_4px_0px_0px_rgba(201,168,106,1)]'
              : 'bg-white text-brand-dark hover:bg-brand-primary/5 shadow-[2px_2px_0px_0px_rgba(5,20,18,1)]'
          )}
        >
          <AlertTriangle size={28} className={hasRestrictions === true ? 'text-brand-secondary' : 'text-brand-primary'} />
          <span className="font-serif text-2xl font-bold">Sim, ha restricoes</span>
        </button>

        <button
          type="button"
          onClick={() => chooseRestrictions(false)}
          className={cn(
            'flex items-center gap-4 p-5 rounded-xl border-2 border-brand-dark text-left transition-all',
            hasRestrictions === false
              ? 'bg-brand-secondary text-brand-dark shadow-[4px_4px_0px_0px_rgba(5,20,18,1)]'
              : 'bg-white text-brand-dark hover:bg-brand-primary/5 shadow-[2px_2px_0px_0px_rgba(5,20,18,1)]'
          )}
        >
          <Utensils size={28} />
          <span className="font-serif text-2xl font-bold">Nao, nenhuma</span>
        </button>
      </div>

      {hasRestrictions && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-2">
          <ChefMessage message="Perfeito. Quais sao as restricoes? Conte mais detalhes se necessario." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {restrictionOptions.map((option) => {
              const isSelected = selected.includes(option.id);

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleRestriction(option.id)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 border-brand-dark text-left transition-all',
                    isSelected
                      ? 'bg-brand-dark text-brand-light shadow-[4px_4px_0px_0px_rgba(201,168,106,1)]'
                      : 'bg-white text-brand-dark hover:bg-brand-primary/5 shadow-[2px_2px_0px_0px_rgba(5,20,18,1)]'
                  )}
                >
                  <span className={cn('text-brand-primary', isSelected && 'text-brand-secondary')}>{option.icon}</span>
                  <span className="font-bold">{option.label}</span>
                </button>
              );
            })}
          </div>

          <textarea
            value={event.dietaryNotes}
            onChange={(e) => setEvent({ dietaryNotes: e.target.value })}
            placeholder="Detalhe alergias, quantidade de pessoas, gravidade ou preferencias importantes..."
            className="mt-5 min-h-32 w-full resize-none rounded-xl border-2 border-brand-dark bg-white p-4 text-brand-dark shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] placeholder:text-brand-primary/40 focus:outline-none focus:ring-2 focus:ring-brand-secondary/50"
          />
        </div>
      )}
    </div>
  );
}
