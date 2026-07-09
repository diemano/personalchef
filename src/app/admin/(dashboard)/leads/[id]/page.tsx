'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, MessageCircle, Calendar, ShieldCheck, FileText, CheckCircle2, ChevronRight, DollarSign } from 'lucide-react';
import { getLeadById, getOrcamentos, LeadItem, OrcamentoItem } from '@/lib/admin-api';
import { useToast } from '@/components/ui/Toast';

interface LeadDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailsPage({ params }: LeadDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { toast, error: toastError } = useToast();
  const [lead, setLead] = useState<LeadItem | null>(null);
  const [orcamentos, setOrcamentos] = useState<OrcamentoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const leadData = await getLeadById(id);
        setLead(leadData);

        // Fetch and filter budgets that match this client's phone
        const allOrcamentos = await getOrcamentos();
        
        // Clean up phones for comparison (retrieve only digits)
        const cleanLeadPhone = leadData.phone.replace(/\D/g, '');
        const filtered = allOrcamentos.filter((o) => {
          const cleanClientPhone = o.cliente.whatsapp.replace(/\D/g, '');
          return cleanClientPhone === cleanLeadPhone || cleanClientPhone.endsWith(cleanLeadPhone) || cleanLeadPhone.endsWith(cleanClientPhone);
        });

        setOrcamentos(filtered);
      } catch (error) {
        console.error(error);
        toastError('Não foi possível carregar os detalhes do lead.');
        router.push('/admin/leads');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, router, toastError]);

  if (loading || !lead) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm font-bold text-brand-primary/50 uppercase tracking-wider animate-pulse">
          Carregando dados do cliente...
        </p>
      </div>
    );
  }

  // Generate whatsapp message link
  const cleanPhone = lead.phone.replace(/\D/g, '');
  const waPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  const waMsg = `Olá, ${lead.name}! Sou o Chef Lucas Medeiros. Vi que você iniciou uma simulação de orçamento em nosso site. Gostaria de dar andamento ao seu evento?`;
  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMsg)}`;

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Back button */}
      <div>
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-primary/65 hover:text-brand-primary transition"
        >
          <ArrowLeft size={16} />
          Voltar para Leads
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-black text-brand-primary">{lead.name}</h1>
          <p className="text-xs font-bold text-brand-primary/50 uppercase tracking-wider mt-1">
            Visualização de Cadastro de Lead
          </p>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-black uppercase tracking-wider text-white hover:bg-green-700 shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
        >
          <MessageCircle size={18} />
          Iniciar Contato WhatsApp
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Contact Info */}
        <section className="md:col-span-1 bg-white border border-brand-primary/10 rounded-2xl p-5 shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-bold text-brand-primary border-b border-brand-primary/10 pb-3">
            Informações do Lead
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User size={18} className="text-brand-primary/50 mt-0.5 shrink-0" />
              <div>
                <span className="block text-[10px] font-black uppercase tracking-wider text-brand-primary/45">Nome Completo</span>
                <span className="font-semibold text-brand-dark">{lead.name}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle size={18} className="text-brand-primary/50 mt-0.5 shrink-0" />
              <div>
                <span className="block text-[10px] font-black uppercase tracking-wider text-brand-primary/45">WhatsApp</span>
                <span className="font-semibold text-brand-dark">{lead.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-brand-primary/50 mt-0.5 shrink-0" />
              <div>
                <span className="block text-[10px] font-black uppercase tracking-wider text-brand-primary/45">Data da Captura</span>
                <span className="font-semibold text-brand-dark">
                  {new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(lead.createdAt))}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="text-brand-primary/50 mt-0.5 shrink-0" />
              <div>
                <span className="block text-[10px] font-black uppercase tracking-wider text-brand-primary/45">Consentimento LGPD</span>
                {lead.lgpdConsent ? (
                  <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700 border border-green-200 mt-1">
                    Autorizado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700 border border-red-200 mt-1">
                    Não Informado
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Right Card: Budget Requests History */}
        <section className="md:col-span-2 bg-white border border-brand-primary/10 rounded-2xl p-5 shadow-sm flex flex-col">
          <h3 className="font-serif text-xl font-bold text-brand-primary border-b border-brand-primary/10 pb-3">
            Histórico de Orçamentos ({orcamentos.length})
          </h3>

          <div className="flex-1 mt-4 space-y-4">
            {orcamentos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                <FileText size={32} className="text-brand-primary/20" />
                <p className="text-sm font-semibold text-brand-primary/50 mt-2">
                  Este cliente ainda não finalizou simulações de orçamento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {orcamentos.map((orc) => {
                  const dateFormatted = new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }).format(new Date(orc.dataEvento));

                  return (
                    <Link
                      key={orc.id}
                      href={`/admin/orcamentos/${orc.id}`}
                      className="group flex items-center justify-between p-4 rounded-xl border border-brand-primary/10 hover:border-brand-secondary bg-brand-primary/[0.01] hover:bg-brand-secondary/5 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-secondary/20 transition">
                          <FileText size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-base text-brand-primary">
                              #{orc.id.slice(-6).toUpperCase()}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-black uppercase text-amber-700 border border-amber-250">
                              {orc.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold text-brand-primary/50 mt-1 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {dateFormatted} - {orc.turno === 'lunch' ? 'Almoço' : 'Jantar'}
                            </span>
                            <span>•</span>
                            <span>{orc.qtdPessoas} convidados</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="block text-[10px] font-black uppercase tracking-wider text-brand-primary/45">Total</span>
                          <span className="font-serif font-black text-brand-dark">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orc.valorEstimadoTotal)}
                          </span>
                        </div>
                        <ChevronRight className="text-brand-primary/30 group-hover:text-brand-primary transition" size={20} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
