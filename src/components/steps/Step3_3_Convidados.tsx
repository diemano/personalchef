'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';
import { Minus, Plus, Users } from 'lucide-react';

export default function Step3_3_Convidados() {
  const { guests, event, setGuests, setEvent, setIsNextEnabled } = useAppStore();
  const [localVal, setLocalVal] = useState(String(guests));
  const [occasion, setOccasion] = useState(event.occasion || '');

  useEffect(() => {
    setLocalVal(String(guests));
  }, [guests]);

  useEffect(() => {
    const hasValidGuests = guests >= 10;
    const hasOccasion = occasion.trim().length > 0;
    setIsNextEnabled(hasValidGuests && hasOccasion);
  }, [guests, occasion, setIsNextEnabled]);

  // Sync occasion to store
  useEffect(() => {
    setEvent({ occasion });
  }, [occasion, setEvent]);

  const increment = () => setGuests(guests + 1);
  const decrement = () => guests > 10 && setGuests(guests - 1);

  const handleInputChange = (val: string) => {
    setLocalVal(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setGuests(parsed);
    }
  };

  const handleBlur = () => {
    const parsed = parseInt(localVal, 10);
    if (isNaN(parsed) || parsed < 10) {
      setGuests(10);
      setLocalVal('10');
    }
  };

  const getTeamLabel = (count: number) => {
    if (count >= 24) return 'Chef + 2 Auxiliares + 1 Copeiro';
    return 'Chef + 1 Auxiliar + 1 Copeiro';
  };

  return (
    <div className="w-full">
      <ChefMessage message="Quantas pessoas estarão presentes? Trabalhamos com o mínimo de 10 convidados." />
      
      <div className="mt-12 flex flex-col items-center gap-8">
        <div className="flex items-center gap-8 justify-center w-full">
          <button
            onClick={decrement}
            disabled={guests <= 10}
            className="w-16 h-16 rounded-full border-4 border-brand-light flex items-center justify-center text-brand-light hover:bg-brand-secondary hover:text-brand-dark transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-light shrink-0"
          >
            <Minus size={32} strokeWidth={3} />
          </button>

          <div className="flex flex-col items-center select-none max-w-[200px]">
            <input
              type="number"
              value={localVal}
              onChange={(e) => handleInputChange(e.target.value)}
              onBlur={handleBlur}
              min={1}
              className="text-7xl md:text-8xl font-serif font-black text-brand-light bg-transparent border-b-4 border-brand-light focus:border-brand-secondary focus:outline-none w-full text-center tabular-nums leading-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-brand-light/80 font-bold uppercase tracking-[0.2em] text-xs md:text-sm mt-3 text-center">
              Convidados
            </span>
          </div>

          <button
            onClick={increment}
            className="w-16 h-16 rounded-full border-4 border-brand-light flex items-center justify-center text-brand-light hover:bg-brand-secondary hover:text-brand-dark transition-colors shrink-0"
          >
            <Plus size={32} strokeWidth={3} />
          </button>
        </div>

        {guests < 10 && (
          <div className="bg-red-500/20 border-2 border-red-500/60 p-4 rounded-xl text-center max-w-xs animate-in fade-in slide-in-from-bottom-2">
            <p className="text-sm font-bold text-red-200">
              O número mínimo é de 10 convidados para realizar o evento.
            </p>
          </div>
        )}

        {guests === 10 && (
          <div className="bg-brand-secondary/20 border-2 border-brand-secondary/60 p-4 rounded-xl text-center max-w-xs animate-in fade-in slide-in-from-bottom-2">
            <p className="text-sm font-bold text-brand-light">
              Este é o nosso número mínimo para garantir a qualidade da experiência.
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 text-brand-light/75 font-bold text-xs uppercase tracking-widest mt-4">
          <Users size={16} />
          <span>Equipe inclusa: {getTeamLabel(guests)}</span>
        </div>
      </div>

      {/* Ocasião (movida da página de local) */}
      <div className="mt-10 flex flex-col gap-5 w-full max-w-md mx-auto">
        {/* Ocasião */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-brand-light uppercase tracking-wider">
            Qual o tipo de comemoração / ocasião?
          </label>
          <input
            type="text"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="Aniversário, casamento, noivado, batizado, confraternização, corporativo..."
            className="w-full bg-white border-2 border-brand-dark p-4 text-brand-dark rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 placeholder:text-brand-primary/40"
          />
        </div>
      </div>
    </div>
  );
}
