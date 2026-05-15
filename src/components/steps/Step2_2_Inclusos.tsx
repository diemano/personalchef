'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';
import { ChefHat, UtensilsCrossed, Star } from 'lucide-react';

export default function Step2_2_Inclusos() {
  const { setIsNextEnabled } = useAppStore();

  useEffect(() => {
    setIsNextEnabled(true);
  }, [setIsNextEnabled]);

  const items = [
    { label: 'Execução no local', icon: <ChefHat className="text-brand-secondary" /> },
    { label: 'Serviço de empratamento', icon: <UtensilsCrossed className="text-brand-secondary" /> },
    { label: 'Condução da experiência', icon: <Star className="text-brand-secondary" /> },
  ];

  return (
    <div className="w-full">
      <ChefMessage message="Além da gastronomia, estes são os pontos que fazem parte da prestação do serviço. Depois desta explicação, eu vou perguntar sobre o seu evento para calcular a operação corretamente." />
      
      <div className="flex flex-col gap-4 mt-6">
        {items.map((item, i) => (
          <div key={i} className="bg-white border-2 border-brand-dark p-5 rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
              {item.icon}
            </div>
            <span className="text-lg font-bold text-brand-dark">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
