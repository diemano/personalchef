'use client';

import { useEffect } from 'react';
import { Flame, Refrigerator, Utensils, Droplets, Plug, Check } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

const kitchenOptions = [
  { id: 'stove', label: 'Fogão ou cooktop', icon: <Flame size={20} /> },
  { id: 'fridge', label: 'Geladeira livre', icon: <Refrigerator size={20} /> },
  { id: 'counter', label: 'Bancada de apoio', icon: <Utensils size={20} /> },
  { id: 'water', label: 'Ponto de água', icon: <Droplets size={20} /> },
  { id: 'power', label: 'Tomada próxima', icon: <Plug size={20} /> },
];

export default function Step4_1_Kitchen() {
  const { event, setEvent, setIsNextEnabled } = useAppStore();
  const selected = event.kitchenItems || [];

  useEffect(() => {
    setIsNextEnabled(selected.length > 0);
  }, [selected.length, setIsNextEnabled]);

  const toggleItem = (id: string) => {
    const nextItems = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];

    setEvent({ kitchenItems: nextItems });
  };

  return (
    <div className="w-full">
      <ChefMessage message="Para eu planejar a operação com segurança, quais estruturas teremos disponíveis na cozinha?" />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {kitchenOptions.map((option) => {
          const isSelected = selected.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleItem(option.id)}
              className={cn(
                'flex items-center gap-4 p-5 rounded-xl border-2 border-brand-dark text-left transition-all',
                isSelected
                  ? 'bg-brand-dark text-brand-light shadow-[4px_4px_0px_0px_rgba(201,168,106,1)]'
                  : 'bg-white text-brand-dark hover:bg-brand-secondary/25 shadow-[2px_2px_0px_0px_rgba(5,20,18,1)]'
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  isSelected ? 'bg-brand-secondary text-brand-dark' : 'bg-brand-primary/10 text-brand-primary'
                )}
              >
                {isSelected ? <Check size={20} /> : option.icon}
              </span>
              <span className="font-bold text-base">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
