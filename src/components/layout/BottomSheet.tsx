'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ChefHat, Clock3, MapPin, ReceiptText, Users } from 'lucide-react';
import { menuOptions } from '@/components/steps/Step6_MenuSelection';
import { MenuCategory, useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const categoryLabels: Record<MenuCategory, string> = {
  coldStarter: 'Entrada fria',
  hotStarter: 'Entrada quente',
  mainCourse: 'Prato principal',
  dessert: 'Sobremesa',
};

function formatDate(value?: string) {
  if (!value) return 'A definir';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'A definir';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function getDishName(category: MenuCategory, dishId?: string) {
  return menuOptions[category].dishes.find((dish) => dish.id === dishId)?.name;
}

function SummaryContent() {
  const { currentStep, event, guests, menu, upsell } = useAppStore();
  const baseCost = guests * 220;
  const decorationCost = event.hasDecoration ? 250 : 0;
  const shouldShowWaiters = currentStep >= 12;
  const waiterCost = shouldShowWaiters ? event.waiterCost || 0 : 0;
  const proteinCost = upsell.proteinUpgrade ? guests * 20 : 0;
  const duplicateCost = upsell.duplicateDish ? guests * 30 : 0;
  const additionalTimeCost = upsell.additionalTime ? guests * 50 : 0;
  const displayedTotal = baseCost + decorationCost + waiterCost + proteinCost + duplicateCost + additionalTimeCost;

  const selectedMenu = (Object.keys(categoryLabels) as MenuCategory[])
    .map((category) => ({
      category,
      dish: getDishName(category, menu[category]),
    }))
    .filter((item) => item.dish);

  const costRows = [
    { label: 'Menu base', value: baseCost, show: true },
    { label: 'Decoração', value: decorationCost, show: event.hasDecoration },
    { label: 'Garçons', value: waiterCost, show: shouldShowWaiters && waiterCost > 0 },
    { label: 'Troca de proteína', value: proteinCost, show: upsell.proteinUpgrade },
    { label: 'Prato duplicado', value: duplicateCost, show: upsell.duplicateDish },
    { label: 'Tempo adicional', value: additionalTimeCost, show: upsell.additionalTime },
  ].filter((row) => row.show);

  const shiftLabel = event.shift === 'lunch' ? 'Almoço' : event.shift === 'dinner' ? 'Jantar' : 'Turno a definir';
  const location = [event.city, event.neighborhood].filter(Boolean).join(' - ') || 'Local a definir';

  return (
    <div className="space-y-5">
      <div>
        <span className="text-xs font-black uppercase tracking-wider text-brand-secondary">Total estimado</span>
        <p className="mt-1 font-serif text-4xl font-black text-brand-light">{currency.format(displayedTotal)}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm font-bold text-brand-light/80">
        <SummaryLine icon={<Users size={16} />} label="Convidados" value={`${guests} pessoas`} />
        <SummaryLine icon={<Clock3 size={16} />} label="Data" value={`${formatDate(event.date)} - ${shiftLabel}`} />
        <SummaryLine icon={<MapPin size={16} />} label="Local" value={location} />
      </div>

      <div className="border-t border-brand-light/15 pt-4">
        <div className="mb-3 flex items-center gap-2 text-brand-light">
          <ChefHat size={17} />
          <h3 className="font-serif text-lg font-black">Menu escolhido</h3>
        </div>
        <div className="space-y-2">
          {selectedMenu.length ? (
            selectedMenu.map((item) => (
              <div key={item.category} className="rounded-lg bg-brand-light/8 p-3">
                <span className="block text-[10px] font-black uppercase tracking-wider text-brand-secondary">{categoryLabels[item.category]}</span>
                <span className="mt-1 block text-sm font-bold leading-snug text-brand-light">{item.dish}</span>
              </div>
            ))
          ) : (
            <p className="text-sm font-bold text-brand-light/65">Os pratos aparecem aqui conforme forem escolhidos.</p>
          )}
        </div>
      </div>

      <div className="border-t border-brand-light/15 pt-4">
        <div className="mb-3 flex items-center gap-2 text-brand-light">
          <ReceiptText size={17} />
          <h3 className="font-serif text-lg font-black">Valores</h3>
        </div>
        <div className="space-y-2">
          {costRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
              <span className="font-bold text-brand-light/70">{row.label}</span>
              <span className="font-serif font-black text-brand-light">{currency.format(row.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-brand-light/8 p-3">
      <span className="mt-0.5 text-brand-secondary">{icon}</span>
      <span>
        <span className="block text-[10px] font-black uppercase tracking-wider text-brand-light/55">{label}</span>
        <span className="mt-0.5 block text-brand-light">{value}</span>
      </span>
    </div>
  );
}

export function DesktopSummary() {
  const currentStep = useAppStore((state) => state.currentStep);

  if (currentStep < 8 || currentStep >= 20) {
    return null;
  }

  return (
    <aside className="hidden w-[340px] shrink-0 lg:block">
      <div className="sticky top-24 rounded-xl border-2 border-brand-dark bg-brand-dark p-5 text-brand-light shadow-[5px_5px_0px_0px_rgba(201,168,106,1)]">
        <SummaryContent />
      </div>
    </aside>
  );
}

export default function BottomSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentStep, event, guests, upsell } = useAppStore();
  const displayedTotal =
    guests * 220 +
    (event.hasDecoration ? 250 : 0) +
    (currentStep >= 12 ? event.waiterCost || 0 : 0) +
    (upsell.proteinUpgrade ? guests * 20 : 0) +
    (upsell.duplicateDish ? guests * 30 : 0) +
    (upsell.additionalTime ? guests * 50 : 0);

  if (currentStep < 8 || currentStep >= 20) {
    return null;
  }

  return (
    <div className="fixed bottom-[88px] left-0 z-30 w-full px-3 lg:hidden">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border-2 border-brand-dark bg-brand-dark text-brand-light shadow-[0_12px_30px_rgba(5,20,18,0.28)]">
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
          aria-expanded={isOpen}
        >
          <span>
            <span className="block text-[10px] font-black uppercase tracking-wider text-brand-secondary">Resumo estimado</span>
            <span className="font-serif text-2xl font-black text-brand-light">{currency.format(displayedTotal)}</span>
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-secondary text-brand-dark">
            {isOpen ? <ChevronDown size={22} /> : <ChevronUp size={22} />}
          </span>
        </button>

        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-300 ease-in-out',
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="max-h-[62vh] overflow-y-auto border-t border-brand-light/15 px-4 py-4">
              <SummaryContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
