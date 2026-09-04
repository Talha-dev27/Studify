'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl text-text-primary placeholder-text-muted outline-none transition-all',
            'bg-white/[0.04] border border-accent-primary/20 focus:border-accent-primary focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.15)]',
            error && 'border-red-500/50',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl text-text-primary placeholder-text-muted outline-none transition-all resize-y min-h-[120px]',
            'bg-white/[0.04] border border-accent-primary/20 focus:border-accent-primary focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.15)]',
            error && 'border-red-500/50',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>}
      <select
        className={cn(
          'w-full px-4 py-3 rounded-xl text-text-primary outline-none transition-all appearance-none cursor-pointer',
          'bg-white/[0.04] border border-accent-primary/20 focus:border-accent-primary',
          "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%238B8BAA%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22></polyline></svg>')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat pr-10",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-bg-secondary">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}