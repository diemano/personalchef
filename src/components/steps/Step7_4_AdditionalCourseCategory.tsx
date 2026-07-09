'use client';

import { useEffect } from 'react';
import { CheckCircle2, Leaf, Soup, Sparkles, Utensils } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { cn } from '@/lib/utils';
import { MenuCategory, useAppStore } from '@/store/useAppStore';

const categories: Array<{
  key: MenuCategory;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    key: 'coldStarter',
    title: 'Entrada fria adicional',
    description: 'Adiciona um tempo extra leve e refrescante no início.',
    icon: <Leaf size={24} />,
  },
  {
    key: 'hotStarter',
    title: 'Entrada quente adicional',
    description: 'Adiciona uma segunda opção reconfortante e quente ao menu.',
    icon: <Soup size={24} />,
  },
  {
    key: 'mainCourse',
    title: 'Prato principal adicional',
    description: 'Adiciona uma opção extra robusta para o prato de destaque.',
    icon: <Utensils size={24} />,
  },
  {
    key: 'dessert',
    title: 'Sobremesa adicional',
    description: 'Garante mais uma sobremesa para os amantes de doces.',
    icon: <Sparkles size={24} />,
  },
];

export default function Step7_4_AdditionalCourseCategory() {
  const { upsell, setUpsell, setIsNextEnabled } = useAppStore();

  useEffect(() => {
    setIsNextEnabled(!!upsell.additionalTimeCategory);
  }, [setIsNextEnabled, upsell.additionalTimeCategory]);

  return (
    <div className="w-full">
      <ChefMessage message="Sobre a personalização do Tempo Adicional (5º tempo): qual tipo de prato você deseja adicionar como prato extra ao seu menu?" />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const isSelected = upsell.additionalTimeCategory === category.key;

          return (
            <button
              key={category.key}
              type="button"
              onClick={() => setUpsell({ additionalTimeCategory: category.key })}
              className={cn(
                'flex min-h-[170px] flex-col gap-4 rounded-xl border-2 border-brand-dark p-5 text-left transition-all',
                isSelected
                  ? 'bg-brand-dark text-brand-light shadow-[5px_5px_0px_0px_rgba(201,168,106,1)]'
                  : 'bg-white text-brand-dark shadow-[3px_3px_0px_0px_rgba(5,20,18,1)] hover:-translate-y-0.5'
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full',
                    isSelected ? 'bg-brand-secondary text-brand-dark' : 'bg-brand-primary/10 text-brand-primary'
                  )}
                >
                  {category.icon}
                </span>
                {isSelected && <CheckCircle2 size={24} className="text-brand-secondary" />}
              </span>

              <span className="flex flex-col gap-2">
                <span className="font-serif text-2xl font-black">{category.title}</span>
                <span className={cn('text-sm font-bold leading-relaxed', isSelected ? 'text-brand-light/75' : 'text-brand-primary/70')}>
                  {category.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
