'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Users, ExternalLink, Trash2, Calendar, MessageSquare, CheckCircle } from 'lucide-react';
import { getLeads, deleteLead, LeadItem, getOrcamentos, OrcamentoItem } from '@/lib/admin-api';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

interface ExtendedLeadItem extends LeadItem {
  hasNewBudget?: boolean;
  count?: number;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [orcamentos, setOrcamentos] = useState<OrcamentoItem[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<ExtendedLeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast, error: toastError } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const cleanPhone = (phone: string) => phone.replace(/\D/g, '');
    const groupedMap = new Map<string, ExtendedLeadItem>();

    leads.forEach((lead) => {
      const key = cleanPhone(lead.phone);
      if (!key) return;

      const existing = groupedMap.get(key);
      if (!existing) {
        groupedMap.set(key, { ...lead, count: 1 });
      } else {
        const count = (existing.count || 1) + 1;
        // Keep the latest lead info by comparing createdAt
        if (new Date(lead.createdAt) > new Date(existing.createdAt)) {
          groupedMap.set(key, { ...lead, count });
        } else {
          existing.count = count;
        }
      }
    });

    groupedMap.forEach((groupedLead, phoneKey) => {
      groupedLead.hasNewBudget = orcamentos.some((orc) => {
        const cleanOrcPhone = cleanPhone(orc.cliente.whatsapp);
        return cleanOrcPhone === phoneKey && orc.status === 'novo';
      });
    });

    const uniqueLeads = Array.from(groupedMap.values());

    if (search.trim() === '') {
      setFilteredLeads(uniqueLeads);
    } else {
      const q = search.toLowerCase();
      setFilteredLeads(
        uniqueLeads.filter(
          (lead) =>
            lead.name.toLowerCase().includes(q) ||
            lead.phone.toLowerCase().includes(q)
        )
      );
    }
  }, [search, leads, orcamentos]);

  async function fetchLeads() {
    try {
      setLoading(true);
      const [leadsData, orcamentosData] = await Promise.all([
        getLeads(),
        getOrcamentos(),
      ]);
      setLeads(leadsData);
      setOrcamentos(orcamentosData);
    } catch (error) {
      console.error(error);
      toastError('Não foi possível carregar os leads.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir este lead? Todos os dados associados serão perdidos.')) {
      return;
    }

    try {
      await deleteLead(id);
      toast('Lead excluído com sucesso.');
      fetchLeads();
    } catch (error) {
      console.error(error);
      toastError('Não foi possível excluir o lead.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-black text-brand-primary">Gestão de Leads</h1>
          <p className="text-sm font-bold text-brand-primary/50 uppercase tracking-wider">
            Clientes capturados pelo assistente de orçamento
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-brand-primary/30" />
          <input
            type="text"
            placeholder="Buscar por nome ou WhatsApp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-brand-primary/10 bg-white p-4 pl-12 font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-sm"
          />
        </div>
      </div>

      {/* Leads Table / Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Users className="h-8 w-8 text-brand-primary/30 animate-pulse" />
            <p className="text-sm font-bold text-brand-primary/50 uppercase tracking-wider">Carregando leads...</p>
          </div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-primary/15 bg-white py-12 text-center">
          <Users className="mx-auto h-12 w-12 text-brand-primary/30" />
          <h3 className="mt-4 font-serif text-xl font-bold text-brand-primary">Nenhum lead encontrado</h3>
          <p className="mt-2 text-sm text-brand-primary/50">
            {search ? 'Tente ajustar os termos de pesquisa.' : 'Nenhum contato capturado até o momento.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-primary/10 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm text-brand-dark">
            <thead className="bg-brand-primary/[0.03] text-xs font-black uppercase tracking-wider text-brand-primary/60 border-b border-brand-primary/10">
              <tr>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">WhatsApp</th>
                <th className="px-6 py-4">Captura</th>
                <th className="px-6 py-4">LGPD</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-primary/10">
              {filteredLeads.map((lead) => {
                const dateFormatted = lead.createdAt
                  ? new Intl.DateTimeFormat('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(lead.createdAt))
                  : 'N/D';

                return (
                  <tr key={lead.id} className="hover:bg-brand-primary/[0.01] transition-colors">
                    <td className="px-6 py-4 font-serif text-base font-bold text-brand-primary">
                      <div className="flex items-center gap-2">
                        <span>{lead.name}</span>
                        {lead.hasNewBudget && (
                          <>
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" title="Novo orçamento pendente" />
                            <span className="inline-flex items-center rounded bg-red-50 px-1.5 py-0.5 text-[9px] font-black uppercase text-red-600 border border-red-200">
                              Novo
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-primary/75">
                      {lead.phone}
                    </td>
                    <td className="px-6 py-4 text-brand-primary/60">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                        <Calendar size={14} />
                        {dateFormatted}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {lead.lgpdConsent ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 border border-green-200">
                          <CheckCircle size={12} />
                          Consentido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-bold text-gray-500 border border-gray-250">
                          Pendente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/15 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary hover:bg-brand-secondary/25 transition"
                        >
                          Detalhes
                          <ExternalLink size={12} />
                        </Link>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition cursor-pointer"
                          title="Excluir Lead"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
