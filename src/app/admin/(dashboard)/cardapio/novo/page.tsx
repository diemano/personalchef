'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DishForm from '@/components/admin/DishForm';
import { useToast } from '@/components/ui/Toast';
import { createDish } from '@/lib/admin-api';

export default function NewDishPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  async function handleSubmit(data: Parameters<typeof createDish>[0], _imageFile: File | null) {
    try {
      // TODO: Upload image first if imageFile is provided, then include URL in payload
      await createDish(data);
      success('Prato cadastrado com sucesso!');
      router.push('/admin/cardapio');
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Erro ao cadastrar prato.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/cardapio"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary/60 transition-colors hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Listagem
        </Link>
        <h1 className="font-serif text-xl font-bold text-brand-primary">
          Cadastrar Item
        </h1>
      </div>

      <DishForm onSubmit={handleSubmit} submitLabel="Salvar Item" />
    </div>
  );
}
