import { cn } from '@/lib/utils';

export function LoadingSpinner({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <div
      className={cn('inline-block animate-spin rounded-full border-2 border-accent-primary border-t-transparent', className)}
      style={{ width: size, height: size }}
    />
  );
}

export function LoadingScreen({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-bg-primary">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-accent-primary/30 blur-2xl animate-pulse" />
        <LoadingSpinner size={48} className="relative" />
      </div>
      <p className="text-text-secondary">{message}</p>
    </div>
  );
}