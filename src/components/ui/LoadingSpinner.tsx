'use client';

import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const sizeMap = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export default function LoadingSpinner({ size = 'md', message, className }: LoadingSpinnerProps) {
  return (
    <div className={clsx('flex flex-col items-center justify-center gap-3 py-12', className)}>
      <Loader2 className={clsx('animate-spin text-brand-secondary', sizeMap[size])} />
      {message && (
        <p className="text-sm text-brand-primary/60">{message}</p>
      )}
    </div>
  );
}
