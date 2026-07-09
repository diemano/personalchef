'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, ChefHat, CookingPot, MapPin, MessageCircle, Pencil, ReceiptText, Users, WalletCards, Info, X } from 'lucide-react';
import ChefMessage from '@/components/chat/ChefMessage';
import { menuOptions } from '@/components/steps/Step6_MenuSelection';
import { useChefdeskMenuOptions } from '@/hooks/useChefdeskData';
import { createOrcamento, finalizeOrcamentoDraft, readResourceId, saveOrcamentoDraft } from '@/lib/chefdesk';
import { getPersonalizationDisplay } from '@/lib/personalizations';
import { cn } from '@/lib/utils';
import { MenuCategory, useAppStore } from '@/store/useAppStore';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const categoryLabels: Record<MenuCategory, string> = {
  coldStarter: 'Entrada Fria',
  hotStarter: 'Entrada Quente',
  mainCourse: 'Prato Principal',
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

function getFallbackDishName(category: MenuCategory, dishId?: string) {
  return menuOptions[category].dishes.find((dish) => dish.id === dishId)?.name || 'Não selecionado';
}

export default function Step8_1_Checkout() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { menuOptions: backendMenuOptions } = useChefdeskMenuOptions(menuOptions);
  
  const {
    currentStep,
    totalScreens,
    isNextEnabled,
    draftId,
    lead,
    event,
    guests,
    pricing,
    personalizationOptions,
    menu,
    upsell,
    totalCost,
    setCurrentStep,
    setDraftId,
    setIsNextEnabled,
    recalculateTotal,
    resetStore,
    prevStep,
  } = useAppStore();

  useEffect(() => {
    setIsNextEnabled(false);
    recalculateTotal();
  }, [recalculateTotal, setIsNextEnabled]);

  const decoration = getPersonalizationDisplay('decoration', personalizationOptions);
  const proteinUpgrade = getPersonalizationDisplay('proteinUpgrade', personalizationOptions);
  const duplicateDish = getPersonalizationDisplay('duplicateDish', personalizationOptions);
  const additionalTime = getPersonalizationDisplay('additionalTime', personalizationOptions);

  const baseCost = guests * pricing.perPerson;
  const decorationCost = event.hasDecoration ? pricing.decorationCost : 0;
  const waiterCost = event.waiterCost || 0;
  const proteinCost = upsell.proteinUpgrade ? guests * pricing.proteinUpgradePer : 0;
  const duplicateCost = upsell.duplicateDish ? guests * pricing.duplicateDishPer : 0;
  const additionalTimeCost = upsell.additionalTime ? guests * pricing.additionalTimePer : 0;

  const costRows = [
    { label: `Menu base (${guests} x R$ ${pricing.perPerson})`, value: baseCost, show: true },
    { label: decoration.name, value: decorationCost, show: event.hasDecoration },
    { label: `Garçons (${event.waiterCount || 1} x R$ ${pricing.waiterCostPer})`, value: waiterCost, show: true },
    { label: proteinUpgrade.name, value: proteinCost, show: upsell.proteinUpgrade },
    { label: duplicateDish.name, value: duplicateCost, show: upsell.duplicateDish },
    { label: additionalTime.name, value: additionalTimeCost, show: upsell.additionalTime },
  ].filter((row) => row.show);

  const menuRows: Array<{ category: MenuCategory; step: number }> = [
    { category: 'coldStarter', step: 14 },
    { category: 'hotStarter', step: 15 },
    { category: 'mainCourse', step: 16 },
    { category: 'dessert', step: 17 },
  ];
  const getSelectedDishName = (category: MenuCategory, dishId?: string) => {
    const targetId = dishId || menu[category];
    return backendMenuOptions[category]?.dishes.find((dish) => dish.id === targetId)?.name ||
      getFallbackDishName(category, targetId);
  };

  const duplicateDishName = upsell.duplicateDish && upsell.duplicateCategory && upsell.duplicateDishId
    ? getSelectedDishName(upsell.duplicateCategory, upsell.duplicateDishId)
    : undefined;

  const additionalDishName = upsell.additionalTime && upsell.additionalTimeCategory && upsell.additionalTimeDishId
    ? getSelectedDishName(upsell.additionalTimeCategory, upsell.additionalTimeDishId)
    : undefined;

  const extras = [
    event.hasDecoration ? decoration.name : null,
    upsell.proteinUpgrade ? `${proteinUpgrade.name} (${upsell.proteinUpgradeText || 'proteína a definir'})` : null,
    upsell.duplicateDish ? `${duplicateDish.name}: ${upsell.duplicateCategory ? `${categoryLabels[upsell.duplicateCategory]} (Prato: ${duplicateDishName || 'a definir'})` : 'categoria a definir'}` : null,
    upsell.additionalTime ? `${additionalTime.name}: ${upsell.additionalTimeCategory ? `5º tempo - ${categoryLabels[upsell.additionalTimeCategory]} (Prato: ${additionalDishName || 'a definir'})` : 'a definir'}` : null,
  ].filter(Boolean);

  const eventLocation = event.isLocationNotDefined 
    ? 'Local não definido'
    : ([event.city, event.neighborhood].filter(Boolean).join(' - ') || 'Local a confirmar');
    
  const eventDate = formatDate(event.date);
  const shift = event.shift === 'lunch' ? 'Almoço' : event.shift === 'dinner' ? 'Jantar' : 'Turno a confirmar';
  const locationType = event.isLocationNotDefined 
    ? 'A definir' 
    : (event.locationType ? locationLabels[event.locationType] : 'Tipo de local a confirmar');
    
  const kitchenSummary = event.kitchenItems && event.kitchenItems.length
    ? 'Estrutura básica confirmada (Fogão, geladeira, bancada, tomadas, pia)'
    : 'Não confirmado';
    
  const dietarySummary = event.hasDietaryRestrictions
    ? event.dietaryNotes || 'Sim (detalhes não informados)'
    : 'Não informado';

  const message = [
    'Olá, Chef Lucas! Quero fechar meu orçamento.',
    '',
    `Nome: ${lead.name || 'Não informado'}`,
    `WhatsApp: ${lead.phone || 'Não informado'}`,
    `Evento: ${eventDate} - ${shift}`,
    `Local: ${eventLocation} (${locationType})`,
    `Convidados: ${guests}`,
    `Estrutura da cozinha: ${kitchenSummary}`,
    `Observações do local: ${event.observations || 'Nenhuma'}`,
    '',
    'Menu escolhido:',
    ...menuRows.map(({ category }) => `- ${categoryLabels[category]}: ${getSelectedDishName(category)}`),
    duplicateDishName && upsell.duplicateCategory ? `- Prato Duplicado (${categoryLabels[upsell.duplicateCategory]}): ${duplicateDishName}` : null,
    additionalDishName && upsell.additionalTimeCategory ? `- 5º Tempo Adicional (${categoryLabels[upsell.additionalTimeCategory]}): ${additionalDishName}` : null,
    '',
    `Extras: ${extras.length ? extras.join(', ') : 'Nenhum'}`,
    `Restrições: ${dietarySummary}`,
    '',
    `Total estimado: ${currency.format(totalCost)}`,
  ].filter((line) => line !== null).join('\n');

  const whatsappHref = `https://wa.me/5583981694160?text=${encodeURIComponent(message)}`;
  const appSnapshot = {
    currentStep,
    totalScreens,
    isNextEnabled,
    draftId,
    guests,
    totalCost,
    pricing,
    personalizationOptions,
    lead,
    event,
    menu,
    upsell,
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const draftResponse = await saveOrcamentoDraft(appSnapshot);
      const syncedDraftId = draftId ?? readResourceId(draftResponse);
      let isSubmitted = false;

      if (syncedDraftId) {
        if (!draftId) {
          setDraftId(syncedDraftId);
        }

        try {
          await finalizeOrcamentoDraft(syncedDraftId);
          isSubmitted = true;
        } catch (error) {
          console.error('Falha ao finalizar rascunho ChefDesk, usando envio direto:', error);
        }
      }

      if (!isSubmitted) {
        await createOrcamento(appSnapshot);
      }

      window.open(whatsappHref, '_blank', 'noopener,noreferrer');
      resetStore();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Não foi possível enviar o orçamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full pb-24">
      <ChefMessage message="Tudo pronto. Revise o resumo do seu evento e, se estiver tudo certo, confirme para iniciarmos nosso contato via WhatsApp." />

      <div className="mt-8 space-y-5">
        {/* Total Cost */}
        <section className="rounded-xl border-2 border-brand-dark bg-brand-dark p-5 text-brand-light shadow-[5px_5px_0px_0px_rgba(201,168,106,1)] animate-in fade-in slide-in-from-bottom-2">
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

        {/* Detalhes de Custo */}
        <section className="rounded-xl border-2 border-brand-dark bg-white p-5 shadow-[3px_3px_0px_0px_rgba(5,20,18,1)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-brand-primary">
              <ReceiptText size={22} />
              <h2 className="font-serif text-2xl font-black text-brand-dark">Detalhamento</h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(18)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-primary/10 px-3 py-2 text-xs font-black uppercase tracking-wider text-brand-primary transition hover:bg-brand-secondary/30 cursor-pointer"
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

        {/* 50% reservation signal disclaimer */}
        <section className="bg-yellow-50 border border-yellow-250 p-4 rounded-xl text-yellow-800 text-xs font-bold flex items-start gap-2.5 shadow-sm">
          <Info className="shrink-0 mt-0.5" size={18} />
          <div>
            <p className="uppercase tracking-wider">Sinal de Reserva</p>
            <p className="font-semibold text-yellow-900 mt-1 leading-relaxed text-[11px]">
              A reserva da data e o agendamento do evento só serão formalmente confirmados mediante o pagamento de um sinal de 50% do valor total estimado.
            </p>
          </div>
        </section>

        {/* Informações Gerais do Evento */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SummaryTile icon={<CalendarDays size={20} />} label="Data" value={`${eventDate} - ${shift}`} onEdit={() => setCurrentStep(6)} />
          <SummaryTile icon={<MapPin size={20} />} label="Local" value={eventLocation} onEdit={() => setCurrentStep(7)} />
          <SummaryTile icon={<Users size={20} />} label="Convidados" value={`${guests} pessoas`} onEdit={() => setCurrentStep(8)} />
          <SummaryTile icon={<CookingPot size={20} />} label="Cozinha" value={kitchenSummary} onEdit={() => setCurrentStep(10)} />
        </section>

        {/* Menu Escolhido */}
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
                className="flex w-full items-center justify-between gap-4 rounded-lg border border-brand-primary/10 bg-brand-primary/[0.03] px-4 py-3 text-left transition hover:bg-brand-secondary/25 cursor-pointer"
              >
                <span>
                  <span className="block text-xs font-black uppercase tracking-wider text-brand-primary/55">{categoryLabels[category]}</span>
                  <span className="mt-1 block font-serif text-lg font-black leading-tight text-brand-dark">{getSelectedDishName(category)}</span>
                </span>
                <Pencil size={16} className="shrink-0 text-brand-primary" />
              </button>
            ))}
            {duplicateDishName && upsell.duplicateCategory && (
              <button
                type="button"
                onClick={() => setCurrentStep(21)}
                className="flex w-full items-center justify-between gap-4 rounded-lg border border-brand-secondary/35 bg-brand-primary/[0.03] px-4 py-3 text-left transition hover:bg-brand-secondary/25 cursor-pointer"
              >
                <span>
                  <span className="block text-xs font-black uppercase tracking-wider text-brand-secondary">
                    {categoryLabels[upsell.duplicateCategory]} (Duplicado)
                  </span>
                  <span className="mt-1 block font-serif text-lg font-black leading-tight text-brand-dark">
                    {duplicateDishName}
                  </span>
                </span>
                <Pencil size={16} className="shrink-0 text-brand-primary" />
              </button>
            )}
            {additionalDishName && upsell.additionalTimeCategory && (
              <button
                type="button"
                onClick={() => setCurrentStep(23)}
                className="flex w-full items-center justify-between gap-4 rounded-lg border border-brand-secondary/35 bg-brand-primary/[0.03] px-4 py-3 text-left transition hover:bg-brand-secondary/25 cursor-pointer"
              >
                <span>
                  <span className="block text-xs font-black uppercase tracking-wider text-brand-secondary">
                    5º Tempo: {categoryLabels[upsell.additionalTimeCategory]} (Adicional)
                  </span>
                  <span className="mt-1 block font-serif text-lg font-black leading-tight text-brand-dark">
                    {additionalDishName}
                  </span>
                </span>
                <Pencil size={16} className="shrink-0 text-brand-primary" />
              </button>
            )}
          </div>
        </section>

        {/* Adicionais & Restrições */}
        <section className="rounded-xl border border-brand-primary/15 bg-white/80 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-brand-primary" />
            <div className="text-sm font-bold leading-relaxed text-brand-primary/75">
              <p>{extras.length ? `Extras selecionados: ${extras.join(', ')}.` : 'Nenhum extra selecionado.'}</p>
              <p className="mt-2">
                {event.hasDietaryRestrictions ? `Restrições alimentares: ${dietarySummary}` : 'Sem restrições alimentares informadas.'}
              </p>
            </div>
          </div>
        </section>

        {submitError && (
          <p className="rounded-lg border border-red-500/30 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {submitError}
          </p>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <footer className="fixed bottom-0 left-0 w-full bg-brand-light/95 backdrop-blur-md border-t border-brand-primary/10 z-40 pb-safe shadow-[0_-4px_20px_rgba(5,20,18,0.1)]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-4 rounded-xl font-bold text-brand-primary uppercase tracking-wider transition-all hover:bg-brand-secondary/25 active:scale-95 shrink-0 cursor-pointer"
          >
            Voltar
          </button>
          
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            disabled={isSubmitting}
            className="flex-1 px-6 py-4 bg-brand-secondary text-brand-dark rounded-xl font-bold uppercase tracking-widest transition-all hover:bg-brand-dark hover:text-brand-light shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] disabled:opacity-50 disabled:shadow-none disabled:bg-gray-400 active:scale-95 flex justify-center items-center gap-2 cursor-pointer"
          >
            <MessageCircle size={20} />
            {isSubmitting ? 'Enviando...' : 'Falar com o Chef'}
          </button>
        </div>
      </footer>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-2 border-brand-dark rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-brand-dark flex flex-col gap-5 relative">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-brand-primary/50 hover:bg-brand-primary/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="font-serif font-bold text-2xl text-brand-primary flex items-center gap-2">
                <CheckCircle2 className="text-brand-secondary shrink-0" size={26} />
                Confirmar Orçamento
              </h3>
              
              <p className="text-sm font-semibold text-brand-primary/75 mt-3 leading-relaxed">
                Seu orçamento foi elaborado com sucesso! Ao continuar, você será redirecionado para o WhatsApp do Chef Lucas para fechar o agendamento.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mt-4 flex items-start gap-2 text-amber-800 text-xs font-bold leading-relaxed">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p>
                  Nota: Após a confirmação, o formulário será limpo para novos atendimentos.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  handleSubmit();
                }}
                disabled={isSubmitting}
                className="w-full py-4 bg-brand-dark text-brand-light font-bold rounded-xl uppercase tracking-widest hover:bg-brand-secondary hover:text-brand-dark shadow-[4px_4px_0px_0px_rgba(201,168,106,1)] transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer"
              >
                <MessageCircle size={18} />
                Confirmar e ir para o WhatsApp
              </button>
              
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 text-brand-primary font-bold hover:bg-brand-primary/10 rounded-xl transition-all cursor-pointer"
              >
                Voltar e Revisar
              </button>
            </div>
          </div>
        </div>
      )}
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
        'flex min-h-[130px] flex-col justify-between rounded-xl border-2 border-brand-dark bg-white p-4 text-left cursor-pointer',
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
