'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings2,
  Pencil,
  Power,
  PowerOff,
  Lock,
  ArrowLeft,
  X,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import LoadingButton from '@/components/ui/LoadingButton';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import {
  getPersonalizations,
  updatePersonalization,
  togglePersonalizationStatus,
} from '@/lib/admin-api';
import type { Personalization } from '@/lib/admin-api';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

interface EditModalProps {
  item: Personalization | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, data: { description: string; value: number }) => Promise<void>;
}

function EditModal({ item, open, onClose, onSave }: EditModalProps) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setDescription(item.description);
      setValue(item.value);
    }
  }, [item]);

  async function handleSave() {
    if (!item) return;
    setSaving(true);
    try {
      await onSave(item.id, { description, value });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open && item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
            onClick={!saving ? onClose : undefined}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg rounded-2xl border border-brand-primary/10 bg-brand-light p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    disabled={saving}
                    className="rounded-lg p-1.5 text-brand-primary/40 hover:bg-brand-primary/5"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h2 className="text-lg font-semibold text-brand-primary">
                    Editar Personalização
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  disabled={saving}
                  className="rounded-lg p-1.5 text-brand-primary/40 hover:bg-brand-primary/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Name (readonly) */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-brand-primary">
                    Nome da Opção <span className="text-xs font-normal text-brand-primary/40">(Padrão do Sistema)</span>
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-brand-primary/10 bg-brand-primary/[0.02] px-4 py-2.5 text-sm text-brand-primary/60">
                    <span className="flex-1">{item.name}</span>
                    <Lock className="h-4 w-4 text-brand-primary/30" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="pers-desc" className="mb-1.5 block text-sm font-semibold text-brand-primary">
                    Descrição para o Cliente:
                  </label>
                  <textarea
                    id="pers-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-brand-primary/15 bg-white px-4 py-2.5 text-sm text-brand-primary placeholder:text-brand-primary/30 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
                    placeholder="Descreva a personalização para o cliente..."
                  />
                </div>

                {/* Value */}
                <div>
                  <label htmlFor="pers-value" className="mb-1.5 block text-sm font-semibold text-brand-primary">
                    Valor Total (Relativo ao nº de convidados):
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-brand-primary/40">
                      R$
                    </span>
                    <input
                      id="pers-value"
                      type="number"
                      step="0.01"
                      min="0"
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                      className="w-full rounded-xl border border-brand-primary/15 bg-white py-2.5 pl-10 pr-4 text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <LoadingButton variant="ghost" onClick={onClose} disabled={saving}>
                  Cancelar
                </LoadingButton>
                <LoadingButton onClick={handleSave} loading={saving}>
                  Salvar Edição
                </LoadingButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function PersonalizacoesPage() {
  const { success, error: toastError } = useToast();

  const [items, setItems] = useState<Personalization[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Edit modal
  const [editTarget, setEditTarget] = useState<Personalization | null>(null);

  // Deactivation dialog
  const [deactivateTarget, setDeactivateTarget] = useState<Personalization | null>(null);
  const [toggling, setToggling] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const data = await getPersonalizations();
      setItems(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Erro ao carregar personalizações.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function handleSaveEdit(id: string, data: { description: string; value: number }) {
    try {
      await updatePersonalization(id, data);
      success('Personalização atualizada com sucesso!');
      fetchItems();
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Erro ao salvar personalização.');
    }
  }

  async function handleToggleStatus() {
    if (!deactivateTarget) return;
    try {
      setToggling(true);
      const newStatus = deactivateTarget.status === 'active' ? 'inactive' : 'active';
      await togglePersonalizationStatus(deactivateTarget.id, newStatus);
      success(
        newStatus === 'active'
          ? `"${deactivateTarget.name}" foi reativada.`
          : `"${deactivateTarget.name}" foi inativada.`
      );
      setDeactivateTarget(null);
      fetchItems();
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Erro ao alterar status.');
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header — SEM botão de "Adicionar" (CA 08 Personalização) */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-brand-primary">
          Gestão de Personalizações
        </h1>
        <p className="mt-1 text-sm text-brand-primary/50">
          Gerencie os valores das opções disponíveis no seu cardápio.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Carregando personalizações..." />
      ) : loadError ? (
        <ErrorState
          title="Erro ao carregar personalizações"
          message={loadError}
          onRetry={fetchItems}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-brand-primary/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-brand-primary">{item.name}</h3>
                  <p className="mt-1 text-sm text-brand-primary/60">
                    Valor para o evento: <span className="font-medium text-brand-primary">{formatCurrency(item.value)}</span>
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    item.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                  {item.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              {item.description && (
                <p className="mt-3 text-xs text-brand-primary/40 line-clamp-2">
                  {item.description}
                </p>
              )}

              <div className="mt-4 flex items-center gap-2 border-t border-brand-primary/5 pt-3">
                <button
                  onClick={() => setEditTarget(item)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-brand-primary/60 transition-colors hover:bg-brand-primary/5 hover:text-brand-primary"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </button>
                <button
                  onClick={() => setDeactivateTarget(item)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    item.status === 'active'
                      ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
                      : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {item.status === 'active' ? (
                    <>
                      <PowerOff className="h-3.5 w-3.5" />
                      Inativar
                    </>
                  ) : (
                    <>
                      <Power className="h-3.5 w-3.5" />
                      Reativar
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <EditModal
        item={editTarget}
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleSaveEdit}
      />

      {/* Deactivation/Reactivation Dialog */}
      <ConfirmDialog
        open={!!deactivateTarget}
        title={deactivateTarget?.status === 'active' ? 'Confirmação de Inativação' : 'Confirmação de Reativação'}
        message={
          deactivateTarget?.status === 'active'
            ? `Tem certeza que deseja inativar a personalização "${deactivateTarget?.name}"? Esta opção não será mais oferecida aos novos clientes, mas o histórico de orçamentos anteriores será mantido.`
            : `Deseja reativar a personalização "${deactivateTarget?.name}"? Ela voltará a ser oferecida aos clientes.`
        }
        confirmLabel={deactivateTarget?.status === 'active' ? 'Inativar Opção' : 'Reativar Opção'}
        variant={deactivateTarget?.status === 'active' ? 'danger' : 'warning'}
        loading={toggling}
        onConfirm={handleToggleStatus}
        onCancel={() => setDeactivateTarget(null)}
      />
    </div>
  );
}
