'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import LoadingButton from '@/components/ui/LoadingButton';
import ImageUpload from '@/components/admin/ImageUpload';
import { getCategories } from '@/lib/admin-api';
import type { Category, DishItem } from '@/lib/admin-api';

const dietaryOptions = [
  { label: 'Vegetariano', value: 'vegetariano' },
  { label: 'Vegano', value: 'vegano' },
  { label: 'Sem Glúten', value: 'sem_gluten' },
  { label: 'Zero Lactose', value: 'zero_lactose' },
];

const dishSchema = z.object({
  name: z.string().min(1, 'Nome do prato é obrigatório'),
  category: z.string().min(1, 'Selecione uma categoria'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  status: z.enum(['active', 'inactive']),
  dietaryRestrictions: z.array(z.string()),
  cuisineStyle: z.string().optional(),
  isHighlight: z.boolean(),
  additionalCost: z.number().min(0).optional(),
});

type DishFormData = z.infer<typeof dishSchema>;

interface DishFormProps {
  initialData?: DishItem;
  onSubmit: (data: DishFormData, imageFile: File | null) => Promise<void>;
  submitLabel?: string;
}

export default function DishForm({ initialData, onSubmit, submitLabel = 'Salvar Item' }: DishFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    watch,
  } = useForm<DishFormData>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      category: initialData?.category ?? '',
      description: initialData?.description ?? '',
      status: initialData?.status ?? 'active',
      dietaryRestrictions: initialData?.dietaryRestrictions ?? [],
      cuisineStyle: initialData?.cuisineStyle ?? '',
      isHighlight: initialData?.isHighlight ?? false,
      additionalCost: initialData?.additionalCost ?? 0,
    },
  });

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty || imageFile !== null);
  }, [isDirty, imageFile]);

  // Warn on navigation with unsaved changes (CA 51)
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Fetch categories
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  async function handleFormSubmit(data: DishFormData) {
    await onSubmit(data, imageFile);
  }

  function handleCancel() {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('Existem alterações não salvas. Deseja sair sem salvar?');
      if (!confirmed) return;
    }
    router.push('/admin/cardapio');
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm">
        {/* Name + Category */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Name */}
          <div>
            <label htmlFor="dish-name" className="mb-1.5 block text-sm font-semibold text-brand-primary">
              Nome do Prato <span className="text-red-500">*</span>
            </label>
            <input
              id="dish-name"
              type="text"
              {...register('name')}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-primary placeholder:text-brand-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 ${
                errors.name ? 'border-red-400 bg-red-50/30' : 'border-brand-primary/15 bg-white'
              }`}
              placeholder="Ex: Burrata de Búfala"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="dish-category" className="mb-1.5 block text-sm font-semibold text-brand-primary">
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              id="dish-category"
              {...register('category')}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 ${
                errors.category ? 'border-red-400 bg-red-50/30' : 'border-brand-primary/15 bg-white'
              }`}
            >
              <option value="">Selecione...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="mt-5">
          <label htmlFor="dish-description" className="mb-1.5 block text-sm font-semibold text-brand-primary">
            Descrição Curta do Prato <span className="text-red-500">*</span>
          </label>
          <textarea
            id="dish-description"
            {...register('description')}
            rows={3}
            className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm text-brand-primary placeholder:text-brand-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 ${
              errors.description ? 'border-red-400 bg-red-50/30' : 'border-brand-primary/15 bg-white'
            }`}
            placeholder="Descreva brevemente o prato..."
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
        </div>

        {/* Dietary Restrictions */}
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-brand-primary">
            Perfil / Restrições Alimentares
            <span className="ml-1 text-xs font-normal text-brand-primary/40">(Múltipla Escolha)</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {dietaryOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-primary/15 px-3 py-2 text-sm text-brand-primary/70 transition-all has-[:checked]:border-brand-secondary/40 has-[:checked]:bg-brand-secondary/5 has-[:checked]:text-brand-primary hover:bg-brand-primary/[0.02]"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  {...register('dietaryRestrictions')}
                  className="h-4 w-4 rounded border-brand-primary/20 text-brand-secondary focus:ring-brand-secondary/20"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* Cuisine Style + Highlight */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="dish-cuisine" className="mb-1.5 block text-sm font-semibold text-brand-primary">
              Estilo da Cozinha
            </label>
            <select
              id="dish-cuisine"
              {...register('cuisineStyle')}
              className="w-full rounded-xl border border-brand-primary/15 bg-white px-4 py-2.5 text-sm text-brand-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
            >
              <option value="">Selecione...</option>
              <option value="italiana">Italiana</option>
              <option value="francesa">Francesa</option>
              <option value="japonesa">Japonesa</option>
              <option value="brasileira">Brasileira</option>
              <option value="contemporanea">Contemporânea</option>
              <option value="fusao">Fusão</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-primary/15 px-4 py-2.5 text-sm text-brand-primary/70 transition-all has-[:checked]:border-brand-secondary/40 has-[:checked]:bg-brand-secondary/5 hover:bg-brand-primary/[0.02]">
              <input
                type="checkbox"
                {...register('isHighlight')}
                className="h-4 w-4 rounded border-brand-primary/20 text-brand-secondary focus:ring-brand-secondary/20"
              />
              <span>Assinatura do Chef ★</span>
            </label>
          </div>
        </div>

        {/* Image + Cost */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-sm font-semibold text-brand-primary">
              Imagem do Prato
            </p>
            <ImageUpload
              value={initialData?.imageUrl}
              onChange={(file) => setImageFile(file)}
            />
          </div>
          <div className="space-y-5">
            {/* Additional Cost */}
            <div>
              <label htmlFor="dish-cost" className="mb-1.5 block text-sm font-semibold text-brand-primary">
                Custo Adicional (R$)
              </label>
              <input
                id="dish-cost"
                type="number"
                step="0.01"
                min="0"
                {...register('additionalCost', { valueAsNumber: true })}
                className="w-full rounded-xl border border-brand-primary/15 bg-white px-4 py-2.5 text-sm text-brand-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
                placeholder="0,00"
              />
            </div>

            {/* Status */}
            <div>
              <p className="mb-2 text-sm font-semibold text-brand-primary">
                Status do Item <span className="text-red-500">*</span>
              </p>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-primary/70">
                  <input
                    type="radio"
                    value="active"
                    {...register('status')}
                    className="h-4 w-4 border-brand-primary/20 text-brand-secondary focus:ring-brand-secondary/20"
                  />
                  Ativo
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-primary/70">
                  <input
                    type="radio"
                    value="inactive"
                    {...register('status')}
                    className="h-4 w-4 border-brand-primary/20 text-brand-secondary focus:ring-brand-secondary/20"
                  />
                  Inativo
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <LoadingButton type="button" variant="ghost" onClick={handleCancel}>
          Cancelar
        </LoadingButton>
        <LoadingButton type="submit" loading={isSubmitting}>
          {submitLabel}
        </LoadingButton>
      </div>
    </form>
  );
}
