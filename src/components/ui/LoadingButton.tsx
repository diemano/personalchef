'use client';

import { Loader2 } from 'lucide-react';
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-primary text-brand-light hover:bg-brand-primary/90 focus-visible:ring-brand-secondary disabled:bg-brand-primary/40',
  secondary:
    'bg-brand-secondary text-brand-primary hover:bg-brand-secondary/90 focus-visible:ring-brand-primary disabled:bg-brand-secondary/40',
  ghost:
    'bg-transparent text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/5 focus-visible:ring-brand-primary disabled:opacity-40',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400 disabled:bg-red-600/40',
};

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, loading = false, variant = 'primary', fullWidth = false, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed',
          variantClasses[variant],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        <span className={loading ? 'opacity-80' : ''}>{children}</span>
      </button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

export default LoadingButton;
