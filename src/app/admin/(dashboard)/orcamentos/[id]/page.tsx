'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Calendar, Users, DollarSign, ChefHat, CookingPot, FileText, Sparkles, Copy, Check } from 'lucide-react';
import { getOrcamentoById, OrcamentoItem, getDishes, DishItem, requestAdmin } from '@/lib/admin-api';
import type { ChefdeskPricing } from '@/lib/chefdesk';
import { useToast } from '@/components/ui/Toast';

interface OrcamentoDetailsPageProps {
  params: Promise<{ id: string }>;
}

const locationLabels = {
  house: 'Casa',
  apartment: 'Apartamento',
  event_space: 'Espaço de eventos',
  other: 'Outro',
} as const;

export default function OrcamentoDetailsPage({ params }: OrcamentoDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { toast, error: toastError } = useToast();
  const [orcamento, setOrcamento] = useState<OrcamentoItem | null>(null);
  const [dishes, setDishes] = useState<Record<string, string>>({});
  const [pricing, setPricing] = useState<ChefdeskPricing | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getOrcamentoById(id);
        setOrcamento(data);

        // Fetch dishes and pricing in parallel
        const [dishesResponse, optionsData] = await Promise.all([
          getDishes({ limit: 100 }),
          requestAdmin<{ pricing: ChefdeskPricing }>('/options').catch(() => null),
        ]);

        const dishMap: Record<string, string> = {};
        dishesResponse.data.forEach((dish) => {
          dishMap[dish.id] = dish.name;
          if (dish.slug) dishMap[dish.slug] = dish.name;
        });
        setDishes(dishMap);

        if (optionsData) {
          const opt = Array.isArray(optionsData) ? optionsData[0] : optionsData;
          if (opt?.pricing) setPricing(opt.pricing);
        }
      } catch (error) {
        console.error(error);
        toastError('Não foi possível carregar os detalhes do orçamento.');
        router.push('/admin/orcamentos');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, router, toastError]);

  if (loading || !orcamento) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm font-bold text-brand-primary/50 uppercase tracking-wider animate-pulse">
          Carregando detalhes do orçamento...
        </p>
      </div>
    );
  }

  // Helper: calculate cost using pricing from options or fallback to stored fields
  const calc = (perPersonKey: keyof ChefdeskPricing, storedFallback: number) => {
    if (pricing) return orcamento.qtdPessoas * (pricing[perPersonKey] as number);
    return storedFallback;
  };
  const custoDecoracao = pricing ? pricing.decorationCost : orcamento.personalizacaoServico.custoDecoracao;
  const custoProteinUpgrade = calc('proteinUpgradePer', orcamento.personalizacaoServico.custoProteinUpgrade);
  const custoDuplicateDish = calc('duplicateDishPer', orcamento.personalizacaoServico.custoDuplicateDish);
  const custoAdditionalTime = calc('additionalTimePer', orcamento.personalizacaoServico.custoAdditionalTime);

  const STATUS_OPTIONS = [
    { value: 'novo', label: 'Novo', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'lido', label: 'Lido', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'em_negociacao', label: 'Em negociação', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { value: 'finalizado', label: 'Finalizado', color: 'bg-green-50 text-green-700 border-green-200' },
    { value: 'cancelado', label: 'Cancelado', color: 'bg-red-50 text-red-700 border-red-200' },
  ];

  const currentStatusOption = STATUS_OPTIONS.find((s) => s.value === orcamento.status) || STATUS_OPTIONS[0];

  const categoryLabels = {
    coldStarter: 'Entrada Fria',
    hotStarter: 'Entrada Quente',
    mainCourse: 'Prato Principal',
    dessert: 'Sobremesa',
  };

  const getDishName = (category: string) => {
    const dishId = orcamento.menu[category];
    return dishes[dishId] || dishId || 'Não selecionado';
  };

  const duplicateDishName = orcamento.personalizacaoServico.duplicateDishId
    ? (dishes[orcamento.personalizacaoServico.duplicateDishId] || orcamento.personalizacaoServico.duplicateDishId)
    : undefined;

  const additionalDishName = orcamento.personalizacaoServico.additionalTimeDishId
    ? (dishes[orcamento.personalizacaoServico.additionalTimeDishId] || orcamento.personalizacaoServico.additionalTimeDishId)
    : undefined;

  const dateFormatted = orcamento.dataEvento
    ? new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(orcamento.dataEvento))
    : 'A definir';

  const cleanPhone = orcamento.cliente.whatsapp.replace(/\D/g, '');
  const waPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  const waMsg = `Olá, ${orcamento.cliente.nome}! Vi seu orçamento de nº #${orcamento.id.slice(-6).toUpperCase()} realizado no site e gostaria de confirmar alguns detalhes do seu evento do dia ${dateFormatted}. Podemos conversar?`;
  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMsg)}`;

  // Formatted copy text
  const summaryText = [
    `ORÇAMENTO #${orcamento.id.slice(-6).toUpperCase()} - Chef Lucas Medeiros`,
    `Cliente: ${orcamento.cliente.nome} (${orcamento.cliente.whatsapp})`,
    `Data do Evento: ${dateFormatted} - Turno: ${orcamento.turno === 'lunch' ? 'Almoço' : 'Jantar'}`,
    `Local: ${orcamento.cidade}${orcamento.bairro ? ` - ${orcamento.bairro}` : ''} (${locationLabels[orcamento.tipoLocal as keyof typeof locationLabels] || 'A definir'})`,
    `Estrutura da Cozinha: ${orcamento.estruturaCozinha.join(', ') || 'Nenhuma'}`,
    `Qtd. Pessoas: ${orcamento.qtdPessoas}`,
    '',
    'CARDÁPIO ESCOLHIDO:',
    `- Entrada Fria: ${getDishName('coldStarter')}`,
    `- Entrada Quente: ${getDishName('hotStarter')}`,
    `- Prato Principal: ${getDishName('mainCourse')}`,
    `- Sobremesa: ${getDishName('dessert')}`,
    duplicateDishName && orcamento.personalizacaoServico.categoriaDuplicada ? `- Prato Duplicado (${categoryLabels[orcamento.personalizacaoServico.categoriaDuplicada as keyof typeof categoryLabels]}): ${duplicateDishName}` : null,
    additionalDishName && orcamento.personalizacaoServico.additionalTimeCategory ? `- 5º Tempo Adicional (${categoryLabels[orcamento.personalizacaoServico.additionalTimeCategory as keyof typeof categoryLabels]}): ${additionalDishName}` : null,
    '',
    'ADICIONAIS E PERSONALIZAÇÕES:',
    `- Decoração da mesa: ${orcamento.personalizacaoServico.temDecoracao ? 'Sim' : 'Não'}`,
    `- Garçons inclusos: ${orcamento.personalizacaoServico.qtdGarcons} (Custo: R$ ${orcamento.personalizacaoServico.custoGarcons})`,
    `- Mudar proteína: ${orcamento.personalizacaoServico.mudouProteina ? (orcamento.personalizacaoServico.proteinUpgradeText ? `Sim ("${orcamento.personalizacaoServico.proteinUpgradeText}")` : 'Sim') : 'Não'}`,
    `- Prato duplicado: ${orcamento.personalizacaoServico.duplicarPrato ? `Sim (Categoria: ${orcamento.personalizacaoServico.categoriaDuplicada ? categoryLabels[orcamento.personalizacaoServico.categoriaDuplicada as keyof typeof categoryLabels] : 'A definir'}, Prato: ${duplicateDishName || 'A definir'})` : 'Não'}`,
    `- Tempo adicional: ${orcamento.personalizacaoServico.tempoAdicional ? `Sim (Categoria: ${orcamento.personalizacaoServico.additionalTimeCategory ? categoryLabels[orcamento.personalizacaoServico.additionalTimeCategory as keyof typeof categoryLabels] : 'A definir'}, Prato: ${additionalDishName || 'A definir'})` : 'Não'}`,
    `- Restrições Alimentares: ${orcamento.restricoesAlimentares.possuiRestricoes ? orcamento.restricoesAlimentares.observacoes : 'Nenhuma'}`,
    '',
    `VALOR ESTIMADO TOTAL: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orcamento.valorEstimadoTotal)}`,
  ].filter(Boolean).join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    toast('Resumo copiado para a área de transferência.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Back link */}
      <div>
        <Link
          href="/admin/orcamentos"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-primary/65 hover:text-brand-primary transition"
        >
          <ArrowLeft size={16} />
          Voltar para Orçamentos
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-black text-brand-primary">
              #{orcamento.id.slice(-6).toUpperCase()}
            </span>
            <span className={`rounded-lg border px-2 py-1 text-[11px] font-black uppercase tracking-wider ${currentStatusOption.color}`}>
              {currentStatusOption.label}
            </span>
          </div>
          <h1 className="font-serif text-3xl font-black text-brand-primary mt-1">
            Orçamento de {orcamento.cliente.nome}
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-brand-primary/10 bg-white px-5 py-3 text-sm font-bold uppercase tracking-wider text-brand-primary hover:bg-brand-secondary/25 transition cursor-pointer"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            Copiar Resumo
          </button>
          
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-black uppercase tracking-wider text-white hover:bg-green-700 shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
          >
            <MessageCircle size={18} />
            Chamar no WhatsApp
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Event General details */}
        <div className="space-y-6 md:col-span-1">
          {/* General Details */}
          <section className="bg-white border border-brand-primary/10 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-brand-primary border-b border-brand-primary/10 pb-3">
              Dados do Evento
            </h3>

            <div className="space-y-3.5 text-sm">
              <div>
                <span className="block text-[10px] font-black uppercase tracking-wider text-brand-primary/45">Data</span>
                <span className="font-semibold text-brand-dark flex items-center gap-1.5 mt-0.5">
                  <Calendar size={14} />
                  {dateFormatted} - {orcamento.turno === 'lunch' ? 'Almoço' : 'Jantar'}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-black uppercase tracking-wider text-brand-primary/45">Local</span>
                <span className="font-semibold text-brand-dark mt-0.5 block">
                  {orcamento.cidade}{orcamento.bairro ? ` - ${orcamento.bairro}` : ''}
                </span>
                <span className="text-xs text-brand-primary/50 font-bold mt-0.5 block uppercase tracking-wider">
                  Tipo: {locationLabels[orcamento.tipoLocal as keyof typeof locationLabels] || 'A definir'}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-black uppercase tracking-wider text-brand-primary/45">Convidados</span>
                <span className="font-semibold text-brand-dark flex items-center gap-1.5 mt-0.5">
                  <Users size={14} />
                  {orcamento.qtdPessoas} pessoas
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-black uppercase tracking-wider text-brand-primary/45">Estrutura de Cozinha</span>
                <span className="font-semibold text-brand-dark flex items-center gap-1.5 mt-0.5">
                  <CookingPot size={14} />
                  {orcamento.estruturaCozinha.length > 0 ? 'Basic Kitchen confirmed' : 'A definir'}
                </span>
              </div>
            </div>
          </section>

          {/* Pricing breakdown */}
          <section className="bg-brand-dark border-2 border-brand-dark text-brand-light rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(201,168,106,1)]">
            <h3 className="font-serif text-lg font-bold text-brand-secondary border-b border-brand-light/10 pb-3">
              Cálculo de Custos
            </h3>

            <div className="space-y-3 mt-4">
              {orcamento.pricingBreakdown.map((row) => (
                <div key={row.label} className="flex justify-between items-center text-sm border-b border-brand-light/5 pb-2 last:border-0 last:pb-0">
                  <span className="font-bold text-brand-light/75">{row.label}</span>
                  <span className="font-serif font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.value)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-light/15 pt-4 mt-4 flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-brand-secondary">Valor Total</span>
              <span className="font-serif text-2xl font-black text-brand-light">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orcamento.valorEstimadoTotal)}
              </span>
            </div>
          </section>
        </div>

        {/* Right Column: Menu and Personalizations */}
        <div className="space-y-6 md:col-span-2">
          {/* Selected Menu */}
          <section className="bg-white border border-brand-primary/10 rounded-2xl p-5 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-brand-primary border-b border-brand-primary/10 pb-3 flex items-center gap-2">
              <ChefHat size={20} />
              Menu Selecionado
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((category) => (
                <div key={category} className="p-4 rounded-xl bg-brand-primary/[0.02] border border-brand-primary/10">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary/50">
                    {categoryLabels[category]}
                  </span>
                  <p className="font-serif text-lg font-black text-brand-dark mt-1">
                    {getDishName(category)}
                  </p>
                </div>
              ))}
              {duplicateDishName && orcamento.personalizacaoServico.categoriaDuplicada && (
                <div className="p-4 rounded-xl bg-brand-primary/[0.02] border border-brand-secondary/35">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-secondary font-bold">
                    {categoryLabels[orcamento.personalizacaoServico.categoriaDuplicada as keyof typeof categoryLabels]} (Duplicado)
                  </span>
                  <p className="font-serif text-lg font-black text-brand-dark mt-1">
                    {duplicateDishName}
                  </p>
                </div>
              )}
              {additionalDishName && orcamento.personalizacaoServico.additionalTimeCategory && (
                <div className="p-4 rounded-xl bg-brand-primary/[0.02] border border-brand-secondary/35">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-secondary font-bold">
                    5º Tempo: {categoryLabels[orcamento.personalizacaoServico.additionalTimeCategory as keyof typeof categoryLabels]} (Adicional)
                  </span>
                  <p className="font-serif text-lg font-black text-brand-dark mt-1">
                    {additionalDishName}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Adicionais & Restrições */}
          <section className="bg-white border border-brand-primary/10 rounded-2xl p-5 shadow-sm space-y-5">
            <h3 className="font-serif text-xl font-bold text-brand-primary border-b border-brand-primary/10 pb-3 flex items-center gap-2">
              <Sparkles size={20} />
              Adicionais & Restrições
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {/* Adicionais List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-primary/60">Serviços Personalizados</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 rounded-lg border border-brand-primary/10 text-sm">
                    <span className="font-semibold text-brand-primary/80">Decoração da mesa</span>
                    <span className="font-bold">
                      {orcamento.personalizacaoServico.temDecoracao
                        ? `Inclusa (+${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(custoDecoracao)})`
                        : 'Não inclusa'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg border border-brand-primary/10 text-sm">
                    <span className="font-semibold text-brand-primary/80">Garçons recomendados</span>
                    <span className="font-bold">{orcamento.personalizacaoServico.qtdGarcons} {orcamento.personalizacaoServico.qtdGarcons === 1 ? 'Garçom' : 'Garçons'} ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orcamento.personalizacaoServico.custoGarcons)})</span>
                  </div>

                  {orcamento.personalizacaoServico.mudouProteina && (
                    <div className="flex justify-between items-start p-3 rounded-lg border border-brand-primary/10 text-sm">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-brand-primary/80">Mudar Proteína</span>
                        {orcamento.personalizacaoServico.proteinUpgradeText && (
                          <span className="text-xs text-brand-primary/50 italic">
                            &ldquo;{orcamento.personalizacaoServico.proteinUpgradeText}&rdquo;
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 whitespace-nowrap">
                        Ativado (+{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(custoProteinUpgrade)})
                      </span>
                    </div>
                  )}

                  {orcamento.personalizacaoServico.duplicarPrato && (
                    <div className="flex justify-between items-start p-3 rounded-lg border border-brand-primary/10 text-sm">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-brand-primary/80">Prato duplicado</span>
                        <span className="text-xs text-brand-primary/50">
                          {orcamento.personalizacaoServico.categoriaDuplicada ? categoryLabels[orcamento.personalizacaoServico.categoriaDuplicada as keyof typeof categoryLabels] : ''} 
                          {duplicateDishName ? ` — ${duplicateDishName}` : ''}
                        </span>
                      </div>
                      <span className="font-bold text-brand-secondary bg-brand-dark px-2 py-0.5 rounded border border-brand-dark text-xs whitespace-nowrap">
                        +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(custoDuplicateDish)}
                      </span>
                    </div>
                  )}

                  {orcamento.personalizacaoServico.tempoAdicional && (
                    <div className="flex justify-between items-start p-3 rounded-lg border border-brand-primary/10 text-sm">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-brand-primary/80">Tempo adicional (5º tempo)</span>
                        <span className="text-xs text-brand-primary/50">
                          {orcamento.personalizacaoServico.additionalTimeCategory
                            ? categoryLabels[orcamento.personalizacaoServico.additionalTimeCategory as keyof typeof categoryLabels]
                            : ''}
                          {additionalDishName ? ` — ${additionalDishName}` : ''}
                        </span>
                      </div>
                      <span className="font-bold text-brand-secondary bg-brand-dark px-2 py-0.5 rounded border border-brand-dark text-xs whitespace-nowrap">
                        +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(custoAdditionalTime)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Restrições Alimentares */}
              <div className="space-y-2 border-t border-brand-primary/10 pt-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-primary/60">Restrições Alimentares</h4>
                {orcamento.restricoesAlimentares.possuiRestricoes ? (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-900 text-sm font-semibold">
                    <p className="font-bold">Observações de Restrição:</p>
                    <p className="mt-1 font-normal text-red-800 whitespace-pre-wrap leading-relaxed">
                      {orcamento.restricoesAlimentares.observacoes}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-brand-primary/50 italic p-1">Nenhuma restrição informada para este evento.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
