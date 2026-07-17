'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ChefMessage from '@/components/chat/ChefMessage';
import { 
  FileText, 
  Settings2, 
  UtensilsCrossed, 
  MessageCircle,
  Leaf,
  Soup,
  ChefHat,
  Dessert,
  ClipboardList,
  Users,
  AlertTriangle,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react';

export default function Step2_1_Menu() {
  const { setIsNextEnabled } = useAppStore();

  useEffect(() => {
    setIsNextEnabled(true); // Informational step, always enabled
  }, [setIsNextEnabled]);

  const steps = [
    {
      num: 1,
      title: 'ENTENDIMENTO',
      description: 'Você informa os dados do evento, quantidade de pessoas, tipo de evento e estrutura do local.',
      icon: <ClipboardList size={26} />,
      accent: 'border-l-brand-secondary',
      bgIcon: 'bg-brand-secondary/15',
    },
    {
      num: 2,
      title: 'ESCOLHA DO MENU',
      description: 'Você escolhe seu menu a partir de 4 tempos ou mais:',
      icon: <UtensilsCrossed size={26} />,
      accent: 'border-l-brand-secondary',
      bgIcon: 'bg-brand-secondary/15',
      subIcons: [
        { icon: <Leaf size={14} />, label: 'Entrada Fria' },
        { icon: <Soup size={14} />, label: 'Entrada Quente' },
        { icon: <ChefHat size={14} />, label: 'Prato Principal' },
        { icon: <Dessert size={14} />, label: 'Sobremesa' },
      ],
    },
    {
      num: 3,
      title: 'COMPLEMENTOS',
      description: 'Escolha decoração, garçons e nos informe se há restrições alimentares ou necessidades especiais.',
      icon: <Settings2 size={26} />,
      accent: 'border-l-brand-secondary',
      bgIcon: 'bg-brand-secondary/15',
      subIcons: [
        { icon: <Sparkles size={14} />, label: 'Decoração' },
        { icon: <UserRoundCheck size={14} />, label: 'Garçons' },
        { icon: <AlertTriangle size={14} />, label: 'Restrições' },
      ],
    },
    {
      num: 4,
      title: 'ORÇAMENTO',
      description: 'Você recebe seu orçamento detalhado e finalizamos no WhatsApp.',
      icon: <MessageCircle size={26} />,
      accent: 'border-l-brand-secondary',
      bgIcon: 'bg-brand-secondary/15',
    },
  ];

  return (
    <div className="w-full">
      <ChefMessage message="Agora vou te explicar como funciona a experiência gastronômica. Esta etapa é só para você entender o serviço; mais adiante você informa os dados do evento, escolhe os pratos do menu e define as personalizações." />

      {/* COMO FUNCIONA Infographic */}
      <div className="mt-6 rounded-2xl border-2 border-brand-dark bg-brand-dark p-5 md:p-7 shadow-[5px_5px_0px_0px_rgba(201,168,106,1)]">
        {/* Steps */}
        <div className="flex flex-col gap-5">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`flex gap-4 rounded-xl border-l-4 ${step.accent} bg-brand-light/5 p-4 md:p-5 transition-all`}
            >
              {/* Step number + icon column */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className={`flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full ${step.bgIcon} text-brand-secondary`}>
                  {step.icon}
                </div>
                <span className="text-[10px] md:text-xs font-black text-brand-secondary/80 uppercase tracking-widest">
                  Passo {step.num}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <h3 className="font-serif text-lg md:text-xl font-black text-brand-light tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base font-bold text-brand-light/70 leading-relaxed">
                  {step.description}
                </p>

                {/* Sub-icons row for steps 2 and 3 */}
                {step.subIcons && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {step.subIcons.map((sub, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-full border border-brand-secondary/30 bg-brand-secondary/10 px-3 py-1 text-xs font-bold text-brand-light"
                      >
                        <span className="text-brand-secondary">{sub.icon}</span>
                        {sub.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-brand-secondary/20 bg-brand-secondary/5 p-4 text-brand-light">
          <FileText size={20} className="mt-0.5 shrink-0 text-brand-secondary" />
          <p className="text-sm font-bold leading-relaxed text-brand-light/75">
            Aqui você está vendo o formato base. Na etapa de menu, cada tempo terá opções de pratos para selecionar com calma.
          </p>
        </div>
      </div>
    </div>
  );
}

