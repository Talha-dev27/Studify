'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export function PredictClient({ subjects }: any) {
  const [subject, setSubject] = useState('4024');
  const [level, setLevel] = useState<'O' | 'A'>('O');
  const [session, setSession] = useState('MJ2025');
  const [component, setComponent] = useState('1');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function predict() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ai/predict/paper?subject=${subject}&level=${level}&session=${session}&component=${component}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setPrediction(data.prediction);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const colorMap: any = {
    High: 'bg-accent-primary/30 border-accent-primary text-white',
    Medium: 'bg-accent-cyan/20 border-accent-cyan/50 text-accent-cyan',
    Low: 'bg-bg-tertiary border-accent-primary/20 text-text-secondary',
    Unlikely: 'bg-bg-tertiary border-text-muted/30 text-text-muted opacity-60',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
      <div className="glass-card p-6 space-y-4 h-fit">
        <h3 className="heading-3">Predict</h3>
        <Select label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} options={subjects.map((s: any) => ({ value: s.code, label: `${s.code} — ${s.name}` }))} />
        <Select label="Level" value={level} onChange={(e) => setLevel(e.target.value as 'O' | 'A')} options={[{ value: 'O', label: 'O Level' }, { value: 'A', label: 'A Level' }]} />
        <Select label="Session" value={session} onChange={(e) => setSession(e.target.value)} options={[{ value: 'MJ2025', label: 'May/June 2025' }, { value: 'ON2025', label: 'Oct/Nov 2025' }, { value: 'MJ2026', label: 'May/June 2026' }]} />
        <Select label="Component" value={component} onChange={(e) => setComponent(e.target.value)} options={['1', '2', '3', '4', '5'].map((p) => ({ value: p, label: `Paper ${p}` }))} />
        <Button onClick={predict} loading={loading} className="w-full">
          <Sparkles className="w-4 h-4" /> Predict Topics
        </Button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="space-y-4">
        <div className="glass-card p-4 bg-yellow-500/5 border-yellow-500/20 text-yellow-400 text-sm">
          This is an AI prediction based on historical patterns. Not a guarantee. Always revise the full syllabus.
        </div>

        {loading ? (
          <div className="glass-card p-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-accent-cyan" />
            <p className="mt-3 text-text-secondary">Analysing past papers…</p>
          </div>
        ) : prediction ? (
          <>
            <div className="glass-card p-6">
              <h3 className="heading-3 mb-4">Topic probability heatmap</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {prediction.topics?.map((t: any, i: number) => (
                  <div key={i} className={cn('p-3 rounded-lg border', colorMap[t.probability])}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{t.name}</span>
                      <Badge variant={t.probability === 'High' ? 'cyan' : t.probability === 'Medium' ? 'warning' : 'pink'}>
                        {t.probability}
                      </Badge>
                    </div>
                    <p className="text-xs opacity-90">{t.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>

            {prediction.patterns?.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="heading-3 mb-4">Predicted question patterns</h3>
                <ul className="space-y-2">
                  {prediction.patterns.map((p: string, i: number) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="text-accent-cyan">▸</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {prediction.checklist?.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="heading-3 mb-4">Revision checklist</h3>
                <div className="space-y-2">
                  {prediction.checklist.map((c: string, i: number) => (
                    <label key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/[0.04] cursor-pointer">
                      <input type="checkbox" className="mt-1 accent-accent-primary" />
                      <span className="text-sm">{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="glass-card p-12 text-center text-text-muted">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>Set inputs and predict upcoming topics.</p>
          </div>
        )}
      </div>
    </div>
  );
}