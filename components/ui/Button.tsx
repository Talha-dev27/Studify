'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'cyan' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-accent-primary to-accent-glow text-white shadow-[0_4px_20px_rgba(108,99,255,0.4)] hover:shadow-[0_8px_30px_rgba(108,99,255,0.6)] hover:-translate-y-0.5',
  ghost:
    'bg-accent-primary/10 border border-accent-primary/30 text-text-primary hover:bg-accent-primary/20 hover:border-accent-primary/50',
  cyan:
    'bg-gradient-to-br from-accent-cyan to-accent-primary text-bg-primary shadow-[0_4px_20px_rgba(0,212,255,0.3)] hover:shadow-[0_8px_30px_rgba(0,212,255,0.5)] hover:-translate-y-0.5',
  outline:
    'border border-accent-primary/40 text-text-primary hover:bg-accent-primary/10',
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';