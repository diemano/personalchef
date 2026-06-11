'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
  ImageOff,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { getDishes, getCategories, deactivateDish } from '@/lib/admin-api';
import type { DishItem, Category } from '@/lib/admin-api';

const ITEMS_PER_PAGE = 10;

const CATEGORY_LABELS: Record<string, string> = {
  coldStarter: 'Entrada Fria',
  hotStarter: 'Entrada Quente',
  mainCourse: 'Prato Principal',
  dessert: 'Sobremesa',
};

export default function CardapioListPage() {
  const { success, error: toastError } = useToast();

  // Data
  const [dishes, setDishes] = useState<DishItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // UI states
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<DishItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  const fetchDishes = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const result = await getDishes({
        search: search || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        page,
        limit: ITEMS_PER_PAGE,
      });

      setDishes(result.data);
      setTotal(result.total);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Erro ao carregar itens do cardápio.');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter, page]);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch {
      // Non-critical — silently fail
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, statusFilter]);

  async function handleDeactivate() {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deactivateDish(deleteTarget.id);
      success(`"${deleteTarget.name}" foi inativado com sucesso.`);
      setDeleteTarget(null);
      fetchDishes();
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Erro ao inativar o prato.');
    } finally {
      setDeleting(false);
    }
  }

  const showingFrom = total === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(page * ITEMS_PER_PAGE, total);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-primary">Gestão de Cardápio</h1>
        </div>
        <Link
          href="/admin/cardapio/novo"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-brand-light transition-colors hover:bg-brand-primary/90"
        >
          <Plus className="h-4 w-4" />
          Cadastrar Novo
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-primary/30" />
          <input
            type="text"
            placeholder="Buscar por nome do prato..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-brand-primary/15 bg-white py-2.5 pl-10 pr-4 text-sm text-brand-primary placeholder:text-brand-primary/30 transition-colors focus:border-brand-secondary/40 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-primary/40 hover:text-brand-primary/70"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-brand-primary/15 bg-white px-3 py-2.5 text-sm text-brand-primary transition-colors focus:border-brand-secondary/40 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
        >
          <option value="">Todas as Categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-brand-primary/15 bg-white px-3 py-2.5 text-sm text-brand-primary transition-colors focus:border-brand-secondary/40 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
        >
          <option value="">Todos os Status</option>
          <option value="active">Somente Ativos</option>
          <option value="inactive">Somente Inativos</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Carregando itens do cardápio..." />
      ) : loadError ? (
        <ErrorState
          title="Erro ao carregar cardápio"
          message={loadError}
          onRetry={fetchDishes}
        />
      ) : dishes.length === 0 && (search || categoryFilter || statusFilter) ? (
        <EmptyState
          variant="search"
          title="Nenhum resultado encontrado"
          message="Tente ajustar os filtros ou o termo de busca."
        />
      ) : dishes.length === 0 ? (
        <EmptyState
          title="Nenhum item cadastrado"
          message="Comece adicionando pratos ao cardápio."
          action={
            <Link
              href="/admin/cardapio/novo"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-light hover:bg-brand-primary/90"
            >
              <Plus className="h-4 w-4" />
              Cadastrar primeiro prato
            </Link>
          }
        />
      ) : (
        <>
          {/* Table (Desktop) */}
          <div className="hidden overflow-hidden rounded-2xl border border-brand-primary/10 bg-white shadow-sm sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-primary/10 bg-brand-primary/[0.02]">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-primary/50">
                    Foto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-primary/50">
                    Nome do Prato
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-primary/50">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-primary/50">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-brand-primary/50">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {dishes.map((dish) => (
                  <tr key={dish.id} className="transition-colors hover:bg-brand-primary/[0.02]">
                    {/* Image */}
                    <td className="px-4 py-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-brand-primary/5">
                        {dish.imageUrl ? (
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageOff className="h-5 w-5 text-brand-primary/20" />
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-primary">{dish.name}</span>
                        {dish.isHighlight && (
                          <span className="text-brand-secondary" title="Prato Destaque">★</span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-brand-primary/5 px-2.5 py-1 text-xs font-medium text-brand-primary/70">
                        {CATEGORY_LABELS[dish.category] || dish.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          dish.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${dish.status === 'active' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                        {dish.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/cardapio/${dish.id}`}
                          className="rounded-lg p-2 text-brand-primary/40 transition-colors hover:bg-brand-primary/5 hover:text-brand-primary"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/cardapio/${dish.id}/editar`}
                          className="rounded-lg p-2 text-brand-primary/40 transition-colors hover:bg-brand-primary/5 hover:text-brand-primary"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(dish)}
                          className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Inativar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards (Mobile) */}
          <div className="space-y-3 sm:hidden">
            {dishes.map((dish) => (
              <div
                key={dish.id}
                className="rounded-2xl border border-brand-primary/10 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-primary/5">
                    {dish.imageUrl ? (
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageOff className="h-6 w-6 text-brand-primary/20" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-medium text-brand-primary">{dish.name}</h3>
                      {dish.isHighlight && <span className="text-brand-secondary">★</span>}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-md bg-brand-primary/5 px-2 py-0.5 text-xs text-brand-primary/60">
                        {CATEGORY_LABELS[dish.category] || dish.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          dish.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${dish.status === 'active' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                        {dish.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-1 border-t border-brand-primary/5 pt-3">
                  <Link
                    href={`/admin/cardapio/${dish.id}`}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-brand-primary/60 hover:bg-brand-primary/5"
                  >
                    Detalhes
                  </Link>
                  <Link
                    href={`/admin/cardapio/${dish.id}/editar`}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-brand-primary/60 hover:bg-brand-primary/5"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(dish)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                  >
                    Inativar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-brand-primary/15 p-2 text-brand-primary/50 transition-colors hover:bg-brand-primary/5 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-brand-primary/60">
                Página {page} de {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-brand-primary/15 p-2 text-brand-primary/50 transition-colors hover:bg-brand-primary/5 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-brand-primary/40">
              Mostrando {showingFrom}-{showingTo} de {total} itens
            </p>
          </div>
        </>
      )}

      {/* Deactivation Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Confirmação de Inativação"
        message={`Tem certeza que deseja inativar "${deleteTarget?.name}"? Esta opção não será mais oferecida aos novos clientes, mas o histórico de orçamentos anteriores será mantido.`}
        confirmLabel="Inativar Item"
        variant="danger"
        loading={deleting}
        onConfirm={handleDeactivate}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
