'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DishForm from '@/components/admin/DishForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { useToast } from '@/components/ui/Toast';
import { getDishById, updateDish } from '@/lib/admin-api';
import type { DishItem } from '@/lib/admin-api';

export default function EditDishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [dish, setDish] = useState<DishItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDish() {
      try {
        setLoading(true);
        const data = await getDishById(id);
        setDish(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar prato.');
      } finally {
        setLoading(false);
      }
    }

    fetchDish();
  }, [id]);

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

  async function handleSubmit(data: Parameters<typeof updateDish>[1], imageFile: File | null) {
    try {
      let imageUrl = undefined;
      if (imageFile) {
        imageUrl = await fileToBase64(imageFile);
      }
      
      await updateDish(id, { ...data, imageUrl });
      success('Prato atualizado com sucesso!');
      router.push(`/admin/cardapio/${id}`);
    } catch (err) {
      let msg = 'Erro ao atualizar prato.';
      if (err instanceof Error) {
        if (err.message.includes('Internal server error') || err.message.includes('500')) {
          msg = 'Erro interno do servidor. Verifique se já existe um prato com este mesmo nome ou slug no cardápio.';
        } else {
          msg = err.message;
        }
      }
      toastError(msg);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Carregando dados do prato..." />;
  }

  if (error || !dish) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/cardapio"
          className="inline-flex items-center gap-2 text-sm text-brand-primary/60 hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Listagem
        </Link>
        <ErrorState
          title="Erro ao carregar prato"
          message={error ?? 'Prato não encontrado.'}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/cardapio/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary/60 transition-colors hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Detalhes
        </Link>
        <h1 className="font-serif text-xl font-bold text-brand-primary">
          Editar Item
        </h1>
      </div>

      <DishForm initialData={dish} onSubmit={handleSubmit} submitLabel="Salvar Alterações" />
    </div>
  );
}
