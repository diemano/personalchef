'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';
import { Utensils, ChefHat, Wine, CheckCircle2 } from 'lucide-react';

export default function Step2_1_Menu() {
  const { setIsNextEnabled } = useAppStore();

  useEffect(() => {
    setIsNextEnabled(true); // Informational step, always enabled
  }, [setIsNextEnabled]);

  const courses = [
    { title: '1º Tempo', label: 'Entrada Fria', icon: <Utensils size={20} /> },
    { title: '2º Tempo', label: 'Entrada Quente', icon: <ChefHat size={20} /> },
    { title: '3º Tempo', label: 'Prato Principal', icon: <Wine size={20} /> },
    { title: '4º Tempo', label: 'Sobremesa', icon: <CheckCircle2 size={20} /> },
  ];

  return (
    <div className="w-full">
      <ChefMessage message="Vou te explicar como funciona nossa experiência gastronômica! Ela é baseada em um 4 Tempos, personalizado para você." />
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        {courses.map((course, i) => (
          <div key={i} className="bg-white border-2 border-brand-dark p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] flex flex-col items-center text-center gap-2">
            <span className="text-[10px] font-bold uppercase text-brand-primary">{course.title}</span>
            <div className="text-brand-dark my-1">{course.icon}</div>
            <span className="font-serif font-bold text-sm text-brand-dark">{course.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-brand-primary text-brand-light border-2 border-brand-dark p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] text-center">
        <span className="text-xl font-serif font-bold">A partir de R$ 220 por pessoa</span>
      </div>
    </div>
  );
}
