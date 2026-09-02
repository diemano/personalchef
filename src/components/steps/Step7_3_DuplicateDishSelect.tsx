'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Leaf, Soup, Sparkles, Utensils, WheatOff } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { useChefdeskMenuOptions } from '@/hooks/useChefdeskData';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { menuOptions } from './Step6_MenuSelection';

function resolveCategoryIcon(icon: React.ReactNode) {
  if (icon === 'Leaf') return <Leaf size={24} />;
  if (icon === 'Soup') return <Soup size={24} />;
  if (icon === 'Utensils') return <Utensils size={24} />;
  if (icon === 'Sparkles') return <Sparkles size={24} />;
  return icon;
}

export default function Step7_3_DuplicateDishSelect() {
  const { upsell, setUpsell, setIsNextEnabled } = useAppStore();
  const category = upsell.duplicateCategory || 'mainCourse';
  const { menuOptions: backendMenuOptions } = useChefdeskMenuOptions(menuOptions);
  const config = backendMenuOptions[category] ?? menuOptions[category];
  const dishes = Array.isArray(config.dishes) ? config.dishes : [];
  const categoryIcon = resolveCategoryIcon(config.icon);

  useEffect(() => {
    setIsNextEnabled(!!upsell.duplicateDishId);
  }, [upsell.duplicateDishId, setIsNextEnabled]);

  const categoryLabels = {
    coldStarter: 'Entrada Fria',
    hotStarter: 'Entrada Quente',
    mainCourse: 'Prato Principal',
    dessert: 'Sobremesa',
  };

  return (
    <div className="w-full">
      <ChefMessage message={`Excelente! Agora escolha o segundo prato da categoria ${categoryLabels[category]} para duplicar no menu.`} />

      <div className="mb-5 mt-2 flex items-center justify-center gap-3 text-brand-light">
        {categoryIcon}
        <h2 className="font-serif text-2xl font-black">
          Segundo Prato: {categoryLabels[category]}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dishes.map((dish) => {
          const isSelected = upsell.duplicateDishId === dish.id;
          const tags = Array.isArray(dish.tags) ? dish.tags : [];

          return (
            <button
              key={dish.id}
              type="button"
              onClick={() => setUpsell({ duplicateDishId: dish.id })}
              className={cn(
                'group flex min-h-[360px] flex-col overflow-hidden rounded-xl border-2 border-brand-dark bg-white text-left transition-all',
                isSelected
                  ? 'shadow-[6px_6px_0px_0px_rgba(201,168,106,1)] ring-2 ring-brand-secondary'
                  : 'shadow-[3px_3px_0px_0px_rgba(5,20,18,1)] hover:-translate-y-1'
              )}
            >
              <div
                className={cn(
                  'relative flex h-48 w-full items-center justify-center overflow-hidden border-b-2 border-brand-dark bg-brand-primary/10 transition-colors',
                  isSelected && 'bg-brand-secondary'
                )}
              >
                {dish.imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={dish.imageUrl}
                      alt="Foto do prato"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-brand-primary shadow-sm">
                    {categoryIcon}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="font-serif text-xl font-black leading-tight text-brand-dark">{dish.name}</h3>
                <p className="text-sm font-medium leading-relaxed text-brand-primary/75">{dish.description}</p>

                <div className="mt-auto flex flex-wrap gap-2">
                  {tags.map((tag) => (
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
