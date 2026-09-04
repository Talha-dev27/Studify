'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select, Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';

const GRADES = ['A*', 'A', 'B', 'C', 'D', 'E'];

export function ThresholdsClient({ subjects }: any) {
  const [subject, setSubject] = useState('4024');
  const [paper, setPaper] = useState('1');
  const [session, setSession] = useState('MJ2025');
  const [rawMark, setRawMark] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [historical, setHistorical] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function predict() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ai/thresholds/predict?subject=${subject}&paper=${paper}&session=${session}&rawMark=${rawMark ?? ''}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setPrediction(data.prediction);
      setHistorical(data.historical ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const chartData = historical.map((h: any) => {
    const row: any = { year: `${h.year} ${h.session}` };
    GRADES.forEach((g) => {
      if (h.thresholds?.[g] != null) row[g] = h.thresholds[g];
    });
    return row;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
      <div className="glass-card p-6 space-y-4 h-fit">
        <h3 className="heading-3">Inputs</h3>
        <Select label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} options={subjects.map((s: any) => ({ value: s.code, label: `${s.code} — ${s.name}` }))} />
        <Select label="Paper" value={paper} onChange={(e) => setPaper(e.target.value)} options={['1', '2', '3', '4', '5'].map((p) => ({ value: p, label: `Paper ${p}` }))} />
        <Select label="Session" value={session} onChange={(e) => setSession(e.target.value)} options={[{ value: 'MJ2025', label: 'May/June 2025' }, { value: 'ON2025', label: 'Oct/Nov 2025' }, { value: 'MJ2026', label: 'May/June 2026' }]} />
        <Input label="Your raw mark (optional)" type="number" value={rawMark} onChange={(e) => setRawMark(e.target.value === '' ? '' : parseInt(e.target.value))} placeholder="e.g. 65" />
        <Button onClick={predict} loading={loading} className="w-full">
          <Sparkles className="w-4 h-4" /> Predict Thresholds
        </Button>
        <p className="text-xs text-text-muted">Premium feature · uses historical AI analysis.</p>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="glass-card p-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-accent-cyan" />
            <p className="mt-3 text-text-secondary">Analysing 10+ years of data…</p>
          </div>
        ) : prediction ? (
          <>
            <div className="glass-card p-6">
              <h3 className="heading-3 mb-4">Predicted boundaries for {session}</h3>
              <div className="space-y-2">
                {GRADES.map((g) => {
                  const p = prediction.prediction?.[g];
                  if (!p) return null;
                  return (
                    <div key={g} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.04]">
                      <span className="w-10 text-2xl font-display font-bold">{g}</span>
                      <div className="flex-1">
                        <div className="text-sm">Predicted range: <span className="font-mono text-accent-cyan">{p.min}–{p.max}</span></div>
                        <div className="h-1.5 bg-bg-tertiary rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-accent-primary to-accent-cyan" style={{ width: `${(p.max / 100) * 100}%` }} />
                        </div>
                      </div>
                      <Badge variant={p.confidence === 'High' ? 'success' : p.confidence === 'Medium' ? 'warning' : 'pink'}>
                        {p.confidence}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            {prediction.reasoning && (
              <div className="glass-card p-6">
                <h3 className="heading-3 mb-3">AI Reasoning</h3>
                <p className="text-text-secondary whitespace-pre-wrap">{prediction.reasoning}</p>
                {prediction.keyFactors?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-text-secondary mb-2">Key factors</h4>
                    <ul className="space-y-1">
                      {prediction.keyFactors.map((k: string, i: number) => (
                        <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                          <span className="text-accent-cyan">▸</span> {k}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}

        {chartData.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="heading-3 mb-4">Historical thresholds</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(108,99,255,0.1)" />
                <XAxis dataKey="year" stroke="#8B8BAA" tick={{ fontSize: 12 }} />
                <YAxis stroke="#8B8BAA" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0A0A1F', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 8 }} />
                <Legend />
                {GRADES.map((g, i) => (
                  <Line key={g} type="monotone" dataKey={g} stroke={LINE_COLORS[i]} strokeWidth={2} dot={{ r: 3 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {!prediction && !loading && (
          <div className="glass-card p-12 text-center text-text-muted">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>Set your inputs and predict thresholds.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const LINE_COLORS = ['#00D4FF', '#6C63FF', '#8B84FF', '#FF6BD6', '#FBBF24', '#34D399'];