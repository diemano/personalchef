'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';
import { cn } from '@/lib/utils';
import { Cake, Heart, Briefcase, Users, Star, Music } from 'lucide-react';

export default function Step3_4_Ocasion() {
  const { event, setEvent, setIsNextEnabled } = useAppStore();

  const occasions = [
    { label: 'Aniversário', icon: <Cake size={18} /> },
    { label: 'Casamento / Noivado', icon: <Heart size={18} /> },
    { label: 'Corporativo', icon: <Briefcase size={18} /> },
    { label: 'Jantar Romântico', icon: <Star size={18} /> },
    { label: 'Reunião entre Amigos', icon: <Users size={18} /> },
    { label: 'Celebração Especial', icon: <Music size={18} /> },
  ];

  useEffect(() => {
    setIsNextEnabled(!!event.occasion);
  }, [event.occasion, setIsNextEnabled]);

  return (
    <div className="w-full">
      <ChefMessage message="Por fim, qual é o motivo da celebração? Isso nos ajuda a personalizar o tom da experiência." />
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
        {occasions.map((occ) => (
          <button
            key={occ.label}
            onClick={() => setEvent({ occasion: occ.label })}
            className={cn(
              "flex items-center gap-4 p-5 rounded-xl border-2 border-brand-dark transition-all text-left group",
              event.occasion === occ.label 
                ? "bg-brand-dark text-brand-light shadow-[4px_4px_0px_0px_rgba(201,168,106,1)]" 
                : "bg-white text-brand-dark hover:bg-brand-primary/5 shadow-[2px_2px_0px_0px_rgba(5,20,18,1)]"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg transition-colors",
              event.occasion === occ.label ? "bg-brand-secondary text-brand-dark" : "bg-brand-primary/10 text-brand-primary"
            )}>
              {occ.icon}
            </div>
            <span className="font-bold text-lg">{occ.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <input 
          type="text" 
          placeholder="Outra ocasião? Digite aqui..."
          value={occasions.some(o => o.label === event.occasion) ? '' : (event.occasion || '')}
          onChange={(e) => setEvent({ occasion: e.target.value })}
          className="w-full bg-transparent border-b-2 border-brand-primary/20 p-4 text-brand-dark font-medium focus:outline-none focus:border-brand-secondary transition-colors"
        />
      </div>
    </div>
  );
}
