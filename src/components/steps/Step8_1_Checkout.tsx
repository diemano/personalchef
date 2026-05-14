'use client';

import { useEffect } from 'react';
import { CalendarDays, CheckCircle2, ChefHat, MapPin, MessageCircle, Pencil, ReceiptText, Users, WalletCards } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { restrictionOptions } from '@/components/steps/Step5_1_Dietary';
import { menuOptions } from '@/components/steps/Step6_MenuSelection';
import { cn } from '@/lib/utils';
import { MenuCategory, useAppStore } from '@/store/useAppStore';

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

const locationLabels = {
  house: 'Casa',
  apartment: 'Apartamento',
  event_space: 'Espaço de eventos',
  other: 'Outro',
} as const;

function formatDate(value?: string) {
  if (!value) return 'Data a confirmar';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data a confirmar';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function getDishName(category: MenuCategory, dishId?: string) {
  return menuOptions[category].dishes.find((dish) => dish.id === dishId)?.name || 'Não selecionado';
}

function getRestrictionLabel(restrictionId: string) {
  return restrictionOptions.find((restriction) => restriction.id === restrictionId)?.label || restrictionId;
}

export default function Step8_1_Checkout() {
  const {
    lead,
    event,
    guests,
    menu,
    upsell,
    totalCost,
    setCurrentStep,
    setIsNextEnabled,
    recalculateTotal,
  } = useAppStore();

  useEffect(() => {
    setIsNextEnabled(false);
    recalculateTotal();
  }, [recalculateTotal, setIsNextEnabled]);

  const baseCost = guests * 220;
  const decorationCost = event.hasDecoration ? 250 : 0;
  const waiterCost = event.waiterCost || 0;
  const proteinCost = upsell.proteinUpgrade ? guests * 20 : 0;
  const duplicateCost = upsell.duplicateDish ? guests * 30 : 0;
  const additionalTimeCost = upsell.additionalTime ? guests * 50 : 0;

  const costRows = [
    { label: `Menu base (${guests} x R$ 220)`, value: baseCost, show: true },
    { label: 'Decoração gastronômica', value: decorationCost, show: event.hasDecoration },
    { label: `Garçons (${event.waiterCount || 1} x R$ 120)`, value: waiterCost, show: true },
    { label: 'Troca de proteína', value: proteinCost, show: upsell.proteinUpgrade },
    { label: 'Prato duplicado', value: duplicateCost, show: upsell.duplicateDish },
    { label: 'Tempo adicional', value: additionalTimeCost, show: upsell.additionalTime },
  ].filter((row) => row.show);

  const menuRows: Array<{ category: MenuCategory; step: number }> = [
    { category: 'coldStarter', step: 14 },
    { category: 'hotStarter', step: 15 },
    { category: 'mainCourse', step: 16 },
    { category: 'dessert', step: 17 },
  ];

  const extras = [
    upsell.proteinUpgrade ? 'Troca de proteína' : null,
    upsell.duplicateDish ? `Prato duplicado: ${upsell.duplicateCategory ? categoryLabels[upsell.duplicateCategory] : 'categoria a definir'}` : null,
    upsell.additionalTime ? 'Tempo adicional' : null,
  ].filter(Boolean);

  const eventLocation = [event.city, event.neighborhood].filter(Boolean).join(' - ') || 'Local a confirmar';
  const eventDate = formatDate(event.date);
  const shift = event.shift === 'lunch' ? 'Almoço' : event.shift === 'dinner' ? 'Jantar' : 'Turno a confirmar';
  const locationType = event.locationType ? locationLabels[event.locationType] : 'Tipo de local a confirmar';
  const dietarySummary = event.hasDietaryRestrictions
    ? [
        ...event.dietaryRestrictions.map(getRestrictionLabel),
        event.dietaryNotes,
      ].filter(Boolean).join(', ') || 'Sim'
    : 'Não informado';

  const message = [
    'Olá, Chef Lucas! Quero fechar meu orçamento.',
    '',
    `Nome: ${lead.name || 'Não informado'}`,
    `WhatsApp: ${lead.phone || 'Não informado'}`,
    `Evento: ${eventDate} - ${shift}`,
    `Local: ${eventLocation} (${locationType})`,
    `Convidados: ${guests}`,
    '',
    'Menu escolhido:',
    ...menuRows.map(({ category }) => `- ${categoryLabels[category]}: ${getDishName(category, menu[category])}`),
    '',
    `Extras: ${extras.length ? extras.join(', ') : 'Nenhum'}`,
    `Restrições: ${dietarySummary}`,
    '',
    `Total estimado: ${currency.format(totalCost)}`,
  ].join('\n');

  const whatsappHref = `https://wa.me/5583981694160?text=${encodeURIComponent(message)}`;

  return (
    <div className="w-full">
      <ChefMessage message="Tudo pronto. Revise o resumo do evento e, se estiver tudo certo, me chame no WhatsApp com os detalhes preenchidos." />

      <div className="mt-8 space-y-5">
        <section className="rounded-xl border-2 border-brand-dark bg-brand-dark p-5 text-brand-light shadow-[5px_5px_0px_0px_rgba(201,168,106,1)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-brand-secondary">Total estimado</p>
              <p className="mt-2 font-serif text-4xl font-black text-brand-light">{currency.format(totalCost)}</p>
            </div>
            <WalletCards size={34} className="text-brand-secondary" />
          </div>
          <p className="mt-3 text-sm font-bold text-brand-light/70">
            Valor calculado com menu base, equipe, adicionais e personalizações selecionadas.
          </p>
        </section>

        <section className="rounded-xl border-2 border-brand-dark bg-white p-5 shadow-[3px_3px_0px_0px_rgba(5,20,18,1)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-brand-primary">
              <ReceiptText size={22} />
              <h2 className="font-serif text-2xl font-black text-brand-dark">Detalhamento</h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(18)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-primary/10 px-3 py-2 text-xs font-black uppercase tracking-wider text-brand-primary transition hover:bg-brand-secondary/30"
            >
              <Pencil size={14} />
              Extras
            </button>
          </div>

          <div className="space-y-3">
            {costRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 border-b border-brand-primary/10 pb-3 last:border-0 last:pb-0">
                <span className="text-sm font-bold text-brand-primary/70">{row.label}</span>
                <span className="font-serif text-lg font-black text-brand-dark">{currency.format(row.value)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryTile icon={<CalendarDays size={20} />} label="Data" value={`${eventDate} - ${shift}`} onEdit={() => setCurrentStep(6)} />
          <SummaryTile icon={<MapPin size={20} />} label="Local" value={eventLocation} onEdit={() => setCurrentStep(7)} />
          <SummaryTile icon={<Users size={20} />} label="Convidados" value={`${guests} pessoas`} onEdit={() => setCurrentStep(8)} />
        </section>

        <section className="rounded-xl border-2 border-brand-dark bg-white p-5 shadow-[3px_3px_0px_0px_rgba(5,20,18,1)]">
          <div className="mb-4 flex items-center gap-2 text-brand-primary">
            <ChefHat size={22} />
            <h2 className="font-serif text-2xl font-black text-brand-dark">Menu</h2>
          </div>

          <div className="space-y-3">
            {menuRows.map(({ category, step }) => (
              <button
                key={category}
                type="button"
                onClick={() => setCurrentStep(step)}
                className="flex w-full items-center justify-between gap-4 rounded-lg border border-brand-primary/10 bg-brand-primary/[0.03] px-4 py-3 text-left transition hover:bg-brand-secondary/25"
              >
                <span>
                  <span className="block text-xs font-black uppercase tracking-wider text-brand-primary/55">{categoryLabels[category]}</span>
                  <span className="mt-1 block font-serif text-lg font-black leading-tight text-brand-dark">{getDishName(category, menu[category])}</span>
                </span>
                <Pencil size={16} className="shrink-0 text-brand-primary" />
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-brand-primary/15 bg-white/80 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-brand-primary" />
            <div className="text-sm font-bold leading-relaxed text-brand-primary/75">
              <p>{extras.length ? `Extras selecionados: ${extras.join(', ')}.` : 'Nenhum extra selecionado.'}</p>
              <p className="mt-2">
                {event.hasDietaryRestrictions ? 'Restrições alimentares registradas no resumo.' : 'Sem restrições alimentares informadas.'}
              </p>
            </div>
          </div>
        </section>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-brand-dark bg-brand-secondary px-6 py-5 text-center font-black uppercase tracking-widest text-brand-dark shadow-[5px_5px_0px_0px_rgba(5,20,18,1)] transition hover:-translate-y-0.5"
        >
          <MessageCircle size={22} />
          Falar com o Chef
        </a>
      </div>
    </div>
  );
}

function SummaryTile({
  icon,
  label,
  value,
  onEdit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className={cn(
        'flex min-h-[130px] flex-col justify-between rounded-xl border-2 border-brand-dark bg-white p-4 text-left',
        'shadow-[3px_3px_0px_0px_rgba(5,20,18,1)] transition hover:-translate-y-0.5'
      )}
    >
      <span className="flex items-center justify-between gap-3 text-brand-primary">
        {icon}
        <Pencil size={15} />
      </span>
      <span>
        <span className="block text-xs font-black uppercase tracking-wider text-brand-primary/55">{label}</span>
        <span className="mt-1 block font-serif text-xl font-black leading-tight text-brand-dark">{value}</span>
      </span>
    </button>
  );
}
