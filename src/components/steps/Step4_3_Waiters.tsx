'use client';

import { useEffect } from 'react';
import { UserRoundCheck, Users, WalletCards } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { useAppStore } from '@/store/useAppStore';

export default function Step4_3_Waiters() {
  const { guests, event, setEvent, recalculateTotal, setIsNextEnabled } = useAppStore();
  const waiterCount = Math.max(1, Math.ceil(guests / 10));
  const waiterCost = waiterCount * 120;

  useEffect(() => {
    setEvent({ waiterCount, waiterCost });
    setIsNextEnabled(true);
  }, [waiterCount, waiterCost, setEvent, setIsNextEnabled]);

  useEffect(() => {
    recalculateTotal();
  }, [event.waiterCost, recalculateTotal]);

  return (
    <div className="w-full">
      <ChefMessage message="Com base no numero de convidados, eu calculo automaticamente a equipe de garcons recomendada para manter o servico fluido." />

      <div className="mt-8 bg-white border-2 border-brand-dark rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(5,20,18,1)]">
        <div className="flex items-center justify-between gap-4 border-b border-brand-primary/10 pb-5">
          <div className="flex items-center gap-3 text-brand-primary">
            <Users size={22} />
            <span className="font-bold uppercase tracking-wider text-sm">Convidados</span>
          </div>
          <span className="text-3xl font-serif font-black text-brand-dark">{guests}</span>
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-brand-primary/10 py-5">
          <div className="flex items-center gap-3 text-brand-primary">
            <UserRoundCheck size={22} />
            <span className="font-bold uppercase tracking-wider text-sm">Garcons</span>
          </div>
          <span className="text-3xl font-serif font-black text-brand-dark">{waiterCount}</span>
        </div>

        <div className="flex items-center justify-between gap-4 pt-5">
          <div className="flex items-center gap-3 text-brand-primary">
            <WalletCards size={22} />
            <span className="font-bold uppercase tracking-wider text-sm">Adicional</span>
          </div>
          <span className="text-3xl font-serif font-black text-brand-dark">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(waiterCost)}
          </span>
        </div>
      </div>

      <p className="mt-5 text-center text-sm font-bold text-brand-primary/65">
        Regra atual: 1 garcom recomendado a cada 10 convidados, ao custo de R$ 120 por garcom.
      </p>
    </div>
  );
}
