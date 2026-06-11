'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  Star,
  ImageOff,
  Calendar,
  Clock,
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { getDishById } from '@/lib/admin-api';
import type { DishItem } from '@/lib/admin-api';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export default function DishDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [dish, setDish] = useState<DishItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDish() {
      try {
        setLoading(true);
        setError(null);
        const data = await getDishById(id);
        setDish(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes do prato.');
      } finally {
        setLoading(false);
      }
    }

    fetchDish();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Carregando detalhes do prato..." />;
  }

  if (error || !dish) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.push('/admin/cardapio')}
          className="inline-flex items-center gap-2 text-sm text-brand-primary/60 hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Listagem
        </button>
        <ErrorState
          title="Prato não encontrado"
          message={error ?? 'O item solicitado não existe ou foi removido.'}
          onRetry={() => router.refresh()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/cardapio"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary/60 transition-colors hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Listagem
        </Link>
        <div className="flex items-center gap-2">
          <h2 className="hidden text-lg font-serif font-bold text-brand-primary sm:block">
            Detalhes do Prato
          </h2>
        </div>
        <Link
          href={`/admin/cardapio/${id}/editar`}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-light transition-colors hover:bg-brand-primary/90"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </Link>
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Image */}
          <div className="flex shrink-0 items-start justify-center lg:w-72">
            <div className="w-full overflow-hidden rounded-2xl border border-brand-primary/10 bg-brand-primary/[0.02]">
              {dish.imageUrl ? (
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-brand-primary/20">
                    <ImageOff className="h-12 w-12" />
                    <span className="text-xs">Sem imagem</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-5">
            {/* Name */}
            <div>
              <h1 className="font-serif text-2xl font-bold text-brand-primary">
                {dish.name}
              </h1>
            </div>

            {/* Tags */}
            {dish.tags.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-primary/40">
                  Tags de Classificação
                </p>
                <div className="flex flex-wrap gap-2">
                  {dish.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-brand-secondary/10 px-3 py-1 text-xs font-medium text-brand-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-primary/40">
                Descrição
              </p>
              <p className="text-sm leading-relaxed text-brand-primary/70">
                {dish.description}
              </p>
            </div>

            {/* Dietary Restrictions */}
            {dish.dietaryRestrictions.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-primary/40">
                  Restrições / Perfil Alimentar
                </p>
                <div className="flex flex-wrap gap-2">
                  {dish.dietaryRestrictions.map((r) => (
                    <span
                      key={r}
                      className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cuisine Style */}
            {dish.cuisineStyle && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-primary/40">
                  Estilo da Cozinha
                </p>
                <p className="text-sm text-brand-primary/70">{dish.cuisineStyle}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-primary/40">
          Informações de Sistema
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Status */}
          <div>
            <p className="mb-1 text-xs text-brand-primary/40">Status</p>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                dish.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${dish.status === 'active' ? 'bg-emerald-500' : 'bg-red-400'}`} />
              {dish.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          {/* Additional Cost */}
          <div>
            <p className="mb-1 text-xs text-brand-primary/40">Custo Adicional</p>
            <p className="text-sm font-semibold text-brand-primary">
              {formatCurrency(dish.additionalCost)}
            </p>
          </div>

          {/* Highlight */}
          <div>
            <p className="mb-1 text-xs text-brand-primary/40">Prato Destaque</p>
            <p className="flex items-center gap-1 text-sm text-brand-primary/70">
              {dish.isHighlight ? (
                <>
                  <Star className="h-4 w-4 fill-brand-secondary text-brand-secondary" />
                  Sim
                </>
              ) : (
                'Não'
              )}
            </p>
          </div>

          {/* Dates */}
          <div className="col-span-2 sm:col-span-1">
            <div className="space-y-1">
              <p className="flex items-center gap-1 text-xs text-brand-primary/40">
                <Calendar className="h-3 w-3" />
                Criado em: <span className="text-brand-primary/60">{formatDate(dish.createdAt)}</span>
              </p>
              <p className="flex items-center gap-1 text-xs text-brand-primary/40">
                <Clock className="h-3 w-3" />
                Atualizado: <span className="text-brand-primary/60">{formatDate(dish.updatedAt)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
