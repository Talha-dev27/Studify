'use client';

import { SUBJECTS } from '@/lib/subjects';

const featured = [
  ...SUBJECTS.filter(s => s.level === 'O').slice(0, 6),
  ...SUBJECTS.filter(s => s.level === 'A').slice(0, 6),
];

export function SubjectMarquee() {
  return (
    <div className="relative overflow-hidden py-12 border-y border-accent-primary/10">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee whitespace-nowrap">
        {[...featured, ...featured, ...featured].map((s, i) => (
          <div
            key={`${s.code}-${i}`}
            className="mx-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm whitespace-nowrap"
          >
            <span className="font-mono text-accent-cyan text-xs">{s.code}</span>
            <span className="font-medium">{s.name}</span>
            <span className="text-xs text-text-muted">· {s.level} Level</span>
          </div>
        ))}
      </div>
    </div>
  );
}