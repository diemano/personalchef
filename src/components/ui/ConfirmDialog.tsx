'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import LoadingButton from './LoadingButton';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
            onClick={!loading ? onCancel : undefined}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md rounded-2xl border border-brand-primary/10 bg-brand-light p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}>
                    <AlertTriangle className={`h-5 w-5 ${variant === 'danger' ? 'text-red-600' : 'text-amber-600'}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-primary">{title}</h3>
                </div>
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="rounded-lg p-1.5 text-brand-primary/40 transition-colors hover:bg-brand-primary/5 hover:text-brand-primary/70 disabled:opacity-40"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <p className="mt-4 text-sm leading-relaxed text-brand-primary/70">{message}</p>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <LoadingButton variant="ghost" onClick={onCancel} disabled={loading}>
                  {cancelLabel}
                </LoadingButton>
                <LoadingButton
                  variant={variant === 'danger' ? 'danger' : 'primary'}
                  onClick={onConfirm}
                  loading={loading}
                >
                  {confirmLabel}
                </LoadingButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
