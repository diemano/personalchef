'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';
import { Minus, Plus, Users } from 'lucide-react';

export default function Step3_3_Convidados() {
  const { guests, setGuests, setIsNextEnabled } = useAppStore();

  useEffect(() => {
    setIsNextEnabled(guests >= 10);
  }, [guests, setIsNextEnabled]);

  const increment = () => setGuests(guests + 1);
  const decrement = () => guests > 10 && setGuests(guests - 1);

  return (
    <div className="w-full">
      <ChefMessage message="Quantas pessoas estarão presentes? Trabalhamos com o mínimo de 10 convidados." />
      
      <div className="mt-12 flex flex-col items-center gap-8">
        <div className="flex items-center gap-8">
          <button
            onClick={decrement}
            disabled={guests <= 10}
            className="w-16 h-16 rounded-full border-4 border-brand-light flex items-center justify-center text-brand-light hover:bg-brand-secondary hover:text-brand-dark transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-light"
          >
            <Minus size={32} strokeWidth={3} />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-8xl font-serif font-black text-brand-light tabular-nums leading-none">
              {guests}
            </span>
            <span className="text-brand-light/80 font-bold uppercase tracking-[0.2em] text-sm mt-2">
              Convidados
            </span>
          </div>

          <button
            onClick={increment}
            className="w-16 h-16 rounded-full border-4 border-brand-light flex items-center justify-center text-brand-light hover:bg-brand-secondary hover:text-brand-dark transition-colors"
          >
            <Plus size={32} strokeWidth={3} />
          </button>
        </div>

        {guests === 10 && (
          <div className="bg-brand-secondary/20 border-2 border-brand-secondary/60 p-4 rounded-xl text-center max-w-xs animate-in fade-in slide-in-from-bottom-2">
            <p className="text-sm font-bold text-brand-light">
              Este é o nosso número mínimo para garantir a qualidade da experiência.
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 text-brand-light/75 font-bold text-xs uppercase tracking-widest mt-4">
          <Users size={16} />
          <span>Equipe inclusa: 1 Chef + 1 Auxiliar</span>
        </div>
      </div>
    </div>
  );
}
