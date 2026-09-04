'use client';

import { useEffect, useRef, ReactNode, HTMLAttributes } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { cn } from '@/lib/utils';

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  tiltMax?: number;
  className?: string;
}

export function TiltCard({ children, className, tiltMax = 12, ...props }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    VanillaTilt.init(el, {
      max: tiltMax,
      speed: 400,
      glare: true,
      'max-glare': 0.15,
      perspective: 1000,
      scale: 1.02,
    });
    return () => {
      // @ts-ignore
      if (el?.vanillaTilt) el.vanillaTilt.destroy();
    };
  }, [tiltMax]);

  return (
    <div
      ref={ref}
      className={cn(
        'glass-card p-6 will-change-transform',
        className,
      )}
      style={{ transformStyle: 'preserve-3d' }}
      {...props}
    >
      {children}
    </div>
  );
}