'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, FileText, ExternalLink, Calendar, Users, DollarSign, ArrowUpDown } from 'lucide-react';
import { getOrcamentos, OrcamentoItem } from '@/lib/admin-api';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState<OrcamentoItem[]>([]);
  const [filteredOrcamentos, setFilteredOrcamentos] = useState<OrcamentoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast, error: toastError } = useToast();

  useEffect(() => {
    fetchOrcamentos();
  }, []);

  useEffect(() => {
    let result = orcamentos;

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      result = result.filter(
        (orc) =>
          orc.cliente.nome.toLowerCase().includes(q) ||
          orc.cliente.whatsapp.includes(q) ||
          orc.id.toLowerCase().includes(q)
      );
    }

    setFilteredOrcamentos(result);
  }, [search, orcamentos]);

  async function fetchOrcamentos() {
    try {
      setLoading(true);
      const data = await getOrcamentos();
      setOrcamentos(data);
      setFilteredOrcamentos(data);
    } catch (error) {
      console.error(error);
      toastError('Não foi possível carregar os orçamentos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-black text-brand-primary">Orçamentos Recebidos</h1>
          <p className="text-sm font-bold text-brand-primary/50 uppercase tracking-wider">
            Simulações finalizadas e salvas pelos clientes
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-brand-primary/30" />
          <input
            type="text"
            placeholder="Buscar por cliente, WhatsApp ou ID do orçamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-brand-primary/10 bg-white p-4 pl-12 font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-sm"
          />
        </div>
      </div>

      {/* Table / Grid list */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <FileText className="h-8 w-8 text-brand-primary/30 animate-pulse" />
            <p className="text-sm font-bold text-brand-primary/50 uppercase tracking-wider">Carregando orçamentos...</p>
          </div>
        </div>
      ) : filteredOrcamentos.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-primary/15 bg-white py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-brand-primary/30" />
          <h3 className="mt-4 font-serif text-xl font-bold text-brand-primary">Nenhum orçamento encontrado</h3>
          <p className="mt-2 text-sm text-brand-primary/50">
            {search ? 'Tente ajustar os termos de busca.' : 'Nenhum orçamento finalizado no sistema.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-primary/10 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm text-brand-dark">
            <thead className="bg-brand-primary/[0.03] text-xs font-black uppercase tracking-wider text-brand-primary/60 border-b border-brand-primary/10">
              <tr>
                <th className="px-6 py-4">ID / Cliente</th>
                <th className="px-6 py-4">Evento</th>
                <th className="px-6 py-4">Convidados</th>
                <th className="px-6 py-4">Total Estimado</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-primary/10">
              {filteredOrcamentos.map((orc) => {
                const dateFormatted = orc.dataEvento
                  ? new Intl.DateTimeFormat('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }).format(new Date(orc.dataEvento))
                  : 'N/D';

                return (
                  <tr key={orc.id} className="hover:bg-brand-primary/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs font-black text-brand-primary">
                        #{orc.id.slice(-6).toUpperCase()}
                      </div>
                      <div className="font-serif text-base font-bold text-brand-dark mt-0.5">
                        {orc.cliente.nome}
                      </div>
                      <div className="text-xs text-brand-primary/50 font-bold mt-0.5">
                        {orc.cliente.whatsapp}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-primary/75">
                        {dateFormatted}
                      </div>
                      <div className="text-xs text-brand-primary/55 font-bold uppercase tracking-wider mt-0.5">
                        {orc.turno === 'lunch' ? 'Almoço' : orc.turno === 'dinner' ? 'Jantar' : 'A definir'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-primary">
                      <div className="flex items-center gap-1.5">
                        <Users size={15} />
                        {orc.qtdPessoas} pessoas
                      </div>
                    </td>
                    <td className="px-6 py-4 font-serif text-base font-black text-brand-dark">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orc.valorEstimadoTotal)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-black uppercase tracking-wider border",
                        orc.status === 'finalizado' 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : orc.status === 'cancelado'
                            ? "bg-red-50 text-red-700 border-red-200"
                            : orc.status === 'em_negociacao'
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : orc.status === 'novo'
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                      )}>
                        {orc.status === 'em_negociacao' ? 'Em negociação' : orc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orcamentos/${orc.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/15 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary hover:bg-brand-secondary/25 transition"
                      >
                        Ver Detalhes
                        <ExternalLink size={12} />
                      </Link>
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
