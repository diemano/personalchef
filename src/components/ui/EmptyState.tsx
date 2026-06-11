'use client';

import { Package, Search } from 'lucide-react';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  message?: string;
  action?: ReactNode;
  variant?: 'default' | 'search';
  className?: string;
}

export default function EmptyState({
  icon,
  title = 'Nenhum item encontrado',
  message = 'Não há itens cadastrados no momento.',
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const DefaultIcon = variant === 'search' ? Search : Package;

  return (
    <div className={clsx('flex flex-col items-center justify-center gap-4 rounded-2xl border border-brand-primary/10 bg-brand-primary/[0.02] px-6 py-12 text-center', className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary/5">
        {icon ?? <DefaultIcon className="h-7 w-7 text-brand-primary/30" />}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-brand-primary/70">{title}</h3>
        <p className="mt-1 text-sm text-brand-primary/50">{message}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
