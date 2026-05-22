'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';
import { Info } from 'lucide-react';

export default function Step2_3_Costs() {
  const { pricing, setIsNextEnabled } = useAppStore();

  useEffect(() => {
    setIsNextEnabled(true);
  }, [setIsNextEnabled]);

  const rules = [
    { label: 'Mudar proteina', value: `+R$ ${pricing.proteinUpgradePer}` },
    { label: 'Duplicar prato', value: `+R$ ${pricing.duplicateDishPer}` },
    { label: 'Tempo adicional', value: `+R$ ${pricing.additionalTimePer}` },
    { label: 'Decoracao', value: `+R$ ${pricing.decorationCost}` },
  ];

  return (
    <div className="w-full">
      <ChefMessage message="Para manter tudo transparente, estes sao exemplos de personalizacoes que podem alterar o valor. Voce nao precisa escolher nada agora; em uma etapa posterior eu mostro as opcoes para selecionar ou manter o menu base." />

      <div className="grid grid-cols-1 gap-4 mt-6">
        {rules.map((rule, i) => (
          <div key={i} className="bg-white border-2 border-brand-dark p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] flex items-center justify-between">
            <span className="font-bold text-brand-dark">{rule.label}</span>
            <span className="bg-brand-secondary text-brand-dark px-3 py-1 rounded-full font-black text-sm border-2 border-brand-dark">
              {rule.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-start gap-3 text-brand-light/75 font-medium italic text-xs px-2">
        <Info size={14} className="shrink-0 mt-0.5 text-brand-secondary" />
        <p>Estes valores sao estimativas baseadas na complexidade de cada personalizacao e entram apenas se voce selecionar essas opcoes depois.</p>
      </div>
    </div>
  );
}
