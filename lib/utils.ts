import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ];
  for (const [s, label] of intervals) {
    const interval = Math.floor(seconds / s);
    if (interval >= 1) return `${interval} ${label}${interval > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export function sessionLabel(session: string): string {
  const map: Record<string, string> = {
    MJ: 'May/June',
    ON: 'Oct/Nov',
    FM: 'Feb/Mar',
  };
  return `${map[session] ?? session}`;
}

export function gradeColor(grade: string): string {
  const map: Record<string, string> = {
    'A*': 'text-accent-cyan',
    A: 'text-accent-glow',
    B: 'text-accent-primary',
    C: 'text-yellow-400',
    D: 'text-orange-400',
    E: 'text-red-400',
    U: 'text-red-600',
  };
  return map[grade] ?? 'text-text-secondary';
}

export function gradeBg(grade: string): string {
  const map: Record<string, string> = {
    'A*': 'bg-accent-cyan/20 border-accent-cyan/40',
    A: 'bg-accent-glow/20 border-accent-glow/40',
    B: 'bg-accent-primary/20 border-accent-primary/40',
    C: 'bg-yellow-400/20 border-yellow-400/40',
    D: 'bg-orange-400/20 border-orange-400/40',
    E: 'bg-red-400/20 border-red-400/40',
    U: 'bg-red-600/20 border-red-600/40',
  };
  return map[grade] ?? 'bg-bg-tertiary border-border-glow';
}