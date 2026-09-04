import { cn } from '@/lib/utils';

type Variant = 'default' | 'cyan' | 'pink' | 'success' | 'warning';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const variants: Record<Variant, string> = {
  default: 'bg-accent-primary/15 text-[#B8B3FF] border-accent-primary/30',
  cyan: 'bg-accent-cyan/15 text-[#67E8FF] border-accent-cyan/30',
  pink: 'bg-accent-pink/15 text-[#FF9FE3] border-accent-pink/30',
  success: 'bg-green-500/15 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}