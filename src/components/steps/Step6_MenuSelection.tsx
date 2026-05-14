'use client';

import { useEffect } from 'react';
import { CheckCircle2, Leaf, Soup, Sparkles, Utensils, WheatOff } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { cn } from '@/lib/utils';
import { MenuCategory, useAppStore } from '@/store/useAppStore';

type Dish = {
  id: string;
  name: string;
  description: string;
  tags: string[];
};

type CategoryConfig = {
  title: string;
  prompt: string;
  icon: React.ReactNode;
  dishes: Dish[];
};

export const menuOptions: Record<MenuCategory, CategoryConfig> = {
  coldStarter: {
    title: 'Entrada Fria',
    prompt: 'vamos começar a montar seu banquete. Escolha a sua entrada fria.',
    icon: <Leaf size={24} />,
    dishes: [
      {
        id: 'carpaccio-carne',
        name: 'Carpaccio de Carne',
        description: 'Lâminas de filé mignon cru, rúcula, alcaparras, parmesão ralado e torradinhas.',
        tags: ['Classico', 'Leve'],
      },
      {
        id: 'ceviche-caju',
        name: 'Ceviche de Caju e Frutas Tropicais',
        description: 'Cubos de caju, manga, cebola roxa, coentro, limão e chips de batata doce.',
        tags: ['Vegano', 'Sem glúten'],
      },
      {
        id: 'salada-trigo',
        name: 'Salada de Trigo e Legumes Grelhados',
        description: 'Trigo em grãos, abobrinha, berinjela, pimentões e vinagrete de hortelã.',
        tags: ['Vegetariano'],
      },
    ],
  },
  hotStarter: {
    title: 'Entrada Quente',
    prompt: 'agora escolha a entrada quente para abrir a experiência com conforto.',
    icon: <Soup size={24} />,
    dishes: [
      {
        id: 'creme-mandioquinha',
        name: 'Creme de Mandioquinha',
        description: 'Creme aveludado com azeite de ervas, crocante de alho-poró e finalização delicada.',
        tags: ['Vegetariano'],
      },
      {
        id: 'arancini-cogumelos',
        name: 'Arancini de Cogumelos',
        description: 'Bolinho de risoto com cogumelos, queijo curado e molho fresco de tomates.',
        tags: ['Crocante'],
      },
      {
        id: 'caldinho-camarao',
        name: 'Caldinho de Camarão',
        description: 'Caldo aromático com camarão, leite de coco, ervas frescas e toque de pimenta.',
        tags: ['Frutos do mar'],
      },
    ],
  },
  mainCourse: {
    title: 'Prato Principal',
    prompt: 'chegamos ao prato principal. Qual caminho combina mais com a sua celebracao?',
    icon: <Utensils size={24} />,
    dishes: [
      {
        id: 'file-mignon',
        name: 'File Mignon ao Molho de Vinho',
        description: 'File ao ponto, molho de vinho tinto, pure rustico e legumes tostados.',
        tags: ['Assinatura'],
      },
      {
        id: 'peixe-crosta',
        name: 'Peixe em Crosta de Castanhas',
        description: 'Peixe grelhado com crosta crocante, creme de limão siciliano e arroz de ervas.',
        tags: ['Leve'],
      },
      {
        id: 'risoto-abobora',
        name: 'Risoto de Abóbora e Queijo Curado',
        description: 'Risoto cremoso com abóbora assada, queijo curado, sementes e ervas frescas.',
        tags: ['Vegetariano'],
      },
    ],
  },
  dessert: {
    title: 'Sobremesa',
    prompt: 'para fechar, escolha a sobremesa que vai deixar a última memória da noite.',
    icon: <Sparkles size={24} />,
    dishes: [
      {
        id: 'panna-cotta',
        name: 'Panna Cotta de Baunilha',
        description: 'Creme leve de baunilha com calda de frutas vermelhas e farofa amanteigada.',
        tags: ['Delicada'],
      },
      {
        id: 'brownie-caramelo',
        name: 'Brownie com Caramelo Salgado',
        description: 'Brownie intenso, caramelo salgado, creme fresco e flor de sal.',
        tags: ['Chocolate'],
      },
      {
        id: 'tartelete-limao',
        name: 'Tartelete de Limão',
        description: 'Massa crocante, creme cítrico, merengue tostado e raspas frescas.',
        tags: ['Cítrica'],
      },
    ],
  },
};

interface Step6MenuSelectionProps {
  category: MenuCategory;
}

export default function Step6MenuSelection({ category }: Step6MenuSelectionProps) {
  const { lead, menu, setMenuSelection, setIsNextEnabled } = useAppStore();
  const config = menuOptions[category];
  const selectedDish = menu[category];

  useEffect(() => {
    setIsNextEnabled(!!selectedDish);
  }, [selectedDish, setIsNextEnabled]);

  const firstName = lead.name?.split(' ')[0] || 'Vamos';

  return (
    <div className="w-full">
      <ChefMessage message={`${firstName}, ${config.prompt}`} />

      <div className="mb-5 mt-2 flex items-center justify-center gap-3 text-brand-light">
        {config.icon}
        <h2 className="font-serif text-2xl font-black">{config.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {config.dishes.map((dish) => {
          const isSelected = selectedDish === dish.id;

          return (
            <button
              key={dish.id}
              type="button"
              onClick={() => setMenuSelection(category, dish.id)}
              className={cn(
                'flex min-h-[360px] flex-col overflow-hidden rounded-xl border-2 border-brand-dark bg-white text-left transition-all',
                isSelected
                  ? 'shadow-[6px_6px_0px_0px_rgba(201,168,106,1)] ring-2 ring-brand-secondary'
                  : 'shadow-[3px_3px_0px_0px_rgba(5,20,18,1)] hover:-translate-y-1'
              )}
            >
              <div className={cn('flex h-28 items-center justify-center border-b-2 border-brand-dark', isSelected ? 'bg-brand-secondary' : 'bg-brand-primary/10')}>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-brand-primary">
                  {dish.tags.some((tag) => tag.toLowerCase().includes('glúten')) ? <WheatOff size={28} /> : config.icon}
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="font-serif text-xl font-black leading-tight text-brand-dark">{dish.name}</h3>
                <p className="text-sm font-medium leading-relaxed text-brand-primary/75">{dish.description}</p>

                <div className="mt-auto flex flex-wrap gap-2">
                  {dish.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-brand-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-brand-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className={cn(
                  'flex items-center justify-center gap-2 border-t-2 border-brand-dark px-4 py-3 text-sm font-black uppercase tracking-widest',
                  isSelected ? 'bg-brand-dark text-brand-light' : 'bg-white text-brand-dark'
                )}
              >
                {isSelected && <CheckCircle2 size={18} className="text-brand-secondary" />}
                {isSelected ? 'Selecionado' : 'Selecionar'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
