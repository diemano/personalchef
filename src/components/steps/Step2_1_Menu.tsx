'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';
import { Utensils, ChefHat, Wine, CheckCircle2, ClipboardList } from 'lucide-react';

export default function Step2_1_Menu() {
  const { setIsNextEnabled } = useAppStore();

  useEffect(() => {
    setIsNextEnabled(true); // Informational step, always enabled
  }, [setIsNextEnabled]);

  const courses = [
    { title: '1º Tempo', label: 'Entrada Fria', description: 'Pratos leves para abrir a experiência.', icon: <Utensils size={20} /> },
    { title: '2º Tempo', label: 'Entrada Quente', description: 'Preparações acolhedoras antes do principal.', icon: <ChefHat size={20} /> },
    { title: '3º Tempo', label: 'Prato Principal', description: 'A receita central do menu do evento.', icon: <Wine size={20} /> },
    { title: '4º Tempo', label: 'Sobremesa', description: 'Um fechamento doce para a celebração.', icon: <CheckCircle2 size={20} /> },
  ];

  return (
    <div className="w-full">
      <ChefMessage message="Agora vou te explicar como funciona a experiência gastronômica. Esta etapa é só para você entender o serviço; mais adiante você informa os dados do evento, escolhe os pratos do menu e define as personalizações." />
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        {courses.map((course, i) => (
          <div key={i} className="bg-white border-2 border-brand-dark p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] flex flex-col items-center text-center gap-2">
            <span className="text-[10px] font-bold uppercase text-brand-primary">{course.title}</span>
            <div className="text-brand-dark my-1">{course.icon}</div>
            <span className="font-serif font-bold text-sm text-brand-dark">{course.label}</span>
            <span className="text-xs font-bold leading-snug text-brand-primary/65">{course.description}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border-2 border-brand-dark bg-white p-4 text-brand-dark shadow-[4px_4px_0px_0px_rgba(5,20,18,1)]">
        <ClipboardList size={20} className="mt-0.5 shrink-0 text-brand-primary" />
        <p className="text-sm font-bold leading-relaxed">
          Aqui você está vendo o formato base. Na etapa de menu, cada tempo terá opções de pratos para selecionar com calma.
        </p>
      </div>

      <div className="mt-8 bg-brand-primary text-brand-light border-2 border-brand-dark p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] text-center">
        <span className="text-xl font-serif font-bold">A partir de R$ 220 por pessoa</span>
        <span className="mt-1 block text-xs font-bold uppercase tracking-wider text-brand-light/70">Valor base antes das escolhas e extras</span>
      </div>
    </div>
  );
}
