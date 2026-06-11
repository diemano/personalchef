'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';
import { getAllPersonalizationDisplays } from '@/lib/personalizations';
import { Info } from 'lucide-react';

export default function Step2_3_Costs() {
  const { pricing, personalizationOptions, setIsNextEnabled } = useAppStore();

  useEffect(() => {
    setIsNextEnabled(true);
  }, [setIsNextEnabled]);

  const rules = getAllPersonalizationDisplays(personalizationOptions)
    .filter((option) => option.active)
    .map((option) => ({
      label: option.name,
      value: `+R$ ${pricing[option.priceKey]}${option.perGuest ? ' por convidado' : ''}`,
    }));

  return (
    <div className="w-full">
      <ChefMessage message="Para manter tudo transparente, estes são exemplos de personalizações que podem alterar o valor. Você não precisa escolher nada agora; em uma etapa posterior eu mostro as opções para selecionar ou manter o menu base." />

      <div className="grid grid-cols-1 gap-4 mt-6">
        {rules.map((rule) => (
          <div key={rule.label} className="bg-white border-2 border-brand-dark p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] flex items-center justify-between gap-4">
            <span className="font-bold text-brand-dark">{rule.label}</span>
            <span className="bg-brand-secondary text-brand-dark px-3 py-1 rounded-full font-black text-sm border-2 border-brand-dark text-right">
              {rule.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-start gap-3 text-brand-light/75 font-medium italic text-xs px-2">
        <Info size={14} className="shrink-0 mt-0.5 text-brand-secondary" />
        <p>Estes valores são estimativas baseadas na complexidade de cada personalização e entram apenas se você selecionar essas opções depois.</p>
      </div>
    </div>
  );
}
