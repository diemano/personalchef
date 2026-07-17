'use client';

import { useEffect } from 'react';
import { UserRoundCheck, Users, WalletCards } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { useAppStore } from '@/store/useAppStore';

export default function Step4_3_Waiters() {
  const { guests, event, pricing, setEvent, recalculateTotal, setIsNextEnabled } = useAppStore();
  const waiterCount = Math.max(1, Math.ceil(guests / 10));
  const waiterCost = waiterCount * pricing.waiterCostPer;

  useEffect(() => {
    setEvent({ waiterCount, waiterCost });
    setIsNextEnabled(true);
  }, [waiterCount, waiterCost, setEvent, setIsNextEnabled]);

  useEffect(() => {
    recalculateTotal();
  }, [event.waiterCost, recalculateTotal]);

  return (
    <div className="w-full">
      <ChefMessage message="Para garantir o serviço fluido e a excelência no atendimento de todos os tempos do cardápio, a presença de garçons na equipe é fundamental." />

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
            <span className="font-bold uppercase tracking-wider text-sm">Equipe Recomendada</span>
          </div>
          <span className="text-3xl font-serif font-black text-brand-dark">{waiterCount} {waiterCount === 1 ? 'Garçom' : 'Garçons'}</span>
        </div>

        <div className="flex items-center justify-between gap-4 pt-5">
          <div className="flex items-center gap-3 text-brand-primary">
            <WalletCards size={22} />
            <span className="font-bold uppercase tracking-wider text-sm">Custo Adicional</span>
          </div>
          <span className="text-3xl font-serif font-black text-brand-dark">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(waiterCost)}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm font-bold text-brand-light/75 text-center leading-relaxed px-2">
        Nós levamos {waiterCount} {waiterCount === 1 ? 'Garçom treinado' : 'Garçons treinados'} por nós, o valor pago {waiterCount === 1 ? 'ao mesmo' : 'aos mesmos'} é feito diretamente {waiterCount === 1 ? 'a ele' : 'a eles'} via pix no dia do evento.
      </p>
    </div>
  );
}
