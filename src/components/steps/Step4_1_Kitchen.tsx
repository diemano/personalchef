'use client';

import { useEffect, useState } from 'react';
import ChefMessage from '@/components/chat/ChefMessage';
import { useAppStore } from '@/store/useAppStore';
import { ChefHat } from 'lucide-react';

export default function Step4_1_Kitchen() {
  const { event, setEvent, setIsNextEnabled } = useAppStore();
  const [isAware, setIsAware] = useState(
    event.kitchenItems && event.kitchenItems.length > 0
  );

  useEffect(() => {
    setIsNextEnabled(isAware);
  }, [isAware, setIsNextEnabled]);

  useEffect(() => {
    if (isAware) {
      setEvent({
        kitchenItems: [
          'fogão ou cooktop',
          'geladeira livre',
          'bancada de apoio',
          'tomadas',
          'pia com ponto de água',
        ],
      });
    } else {
      setEvent({ kitchenItems: [] });
    }
  }, [isAware, setEvent]);

  return (
    <div className="w-full">
      <ChefMessage message="Para garantir o bom funcionamento da experiência gastronômica, é necessário que o local disponha de uma estrutura básica, incluindo fogão, geladeira, bancada de apoio, tomadas e pia com ponto de água. Você confirma que o local do evento conta com essa estrutura básica?" />
      
      <div className="mt-8 flex flex-col gap-6">
        <div className="bg-white border-2 border-brand-dark p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] text-brand-dark flex flex-col gap-4">
          <div className="flex items-center gap-3 text-brand-primary">
            <ChefHat size={24} />
            <h3 className="font-serif font-bold text-lg">Requisitos de Infraestrutura</h3>
          </div>
          <p className="text-sm font-medium leading-relaxed">
            O Chef Lucas e seu auxiliar necessitam dessa infraestrutura básica para a preparação, empratamento e finalização do menu de 4 tempos com segurança e excelência.
          </p>
        </div>

        <div className="flex items-start gap-3 bg-brand-light/[0.05] border-2 border-brand-dark/20 p-5 rounded-xl cursor-pointer hover:bg-brand-light/[0.08] transition-colors">
          <input 
            type="checkbox" 
            id="kitchen-aware"
            checked={isAware}
            onChange={(e) => setIsAware(e.target.checked)}
            className="mt-1 w-6 h-6 accent-brand-primary shrink-0 cursor-pointer"
          />
          <label htmlFor="kitchen-aware" className="text-sm text-brand-light font-bold cursor-pointer select-none leading-snug">
            Estou ciente e confirmo que o local do evento conta com essa estrutura básica de cozinha.
          </label>
        </div>
      </div>
    </div>
  );
}
