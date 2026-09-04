'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Type, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export function SolverClient({ subjects, initialSubject, initialQuestion }: any) {
  const [tab, setTab] = useState<'type' | 'image'>('type');
  const [subject, setSubject] = useState(initialSubject ?? '4024');
  const [level, setLevel] = useState<'O' | 'A'>('O');
  const [question, setQuestion] = useState(initialQuestion ?? '');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMediaType, setImageMediaType] = useState<string>('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMarkScheme, setShowMarkScheme] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    onDrop: async (files) => {
      const f = files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        setImageBase64(base64);
        setImageMediaType(f.type);
      };
      reader.readAsDataURL(f);
    },
  });

  async function solve() {
    if (!question.trim() && !imageBase64) return;
    setLoading(true);
    setError(null);
    setSolution(null);
    try {
      const res = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          imageBase64,
          mediaType: imageMediaType,
          subjectCode: subject,
          level,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to solve');
      setSolution(data.solution);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function trySimilar() {
    setQuestion((q) => `${q}\n\nGenerate a similar question on the same topic and solve it.`);
    await solve();
  }

  const subjectOptions = subjects.map((s: any) => ({
    value: s.code,
    label: `${s.code} — ${s.name}`,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
      <div className="space-y-4">
        <div className="glass-card p-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab('type')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'type' ? 'bg-accent-primary text-white' : 'bg-white/5 text-text-secondary'}`}
            >
              <Type className="w-4 h-4 inline mr-1" /> Type
            </button>
            <button
              onClick={() => setTab('image')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'image' ? 'bg-accent-primary text-white' : 'bg-white/5 text-text-secondary'}`}
            >
              <Upload className="w-4 h-4 inline mr-1" /> Image
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Select label="Subject" options={subjectOptions} value={subject} onChange={(e) => setSubject(e.target.value)} />
            <Select
              label="Level"
              options={[{ value: 'O', label: 'O Level' }, { value: 'A', label: 'A Level' }]}
              value={level}
              onChange={(e) => setLevel(e.target.value as 'O' | 'A')}
            />
          </div>

          {tab === 'type' ? (
            <Textarea
              label="Your question"
              placeholder="e.g. Solve x² − 5x + 6 = 0 and explain the steps…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[200px]"
            />
          ) : (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Upload question image</label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-accent-primary bg-accent-primary/10' : 'border-accent-primary/30 hover:border-accent-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-10 h-10 mx-auto mb-3 text-accent-cyan" />
                {imageBase64 ? (
                  <p className="text-sm text-text-secondary">Image attached ✓</p>
                ) : (
                  <>
                    <p className="text-sm">Drop your image here, or click to select</p>
                    <p className="text-xs text-text-muted mt-1">JPG, PNG, or WebP</p>
                  </>
                )}
              </div>
            </div>
          )}

          {error && <p className="mt-3 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}

          <Button onClick={solve} loading={loading} disabled={!question && !imageBase64} className="w-full mt-4">
            <Sparkles className="w-4 h-4" /> Solve with AI
          </Button>
        </div>

        {loading && (
          <div className="glass-card p-6 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-accent-cyan" />
            <p className="mt-3 text-text-secondary">Analysing question…</p>
          </div>
        )}
      </div>

      <div>
        {solution ? (
          <SolutionDisplay solution={solution} showMarkScheme={showMarkScheme} setShowMarkScheme={setShowMarkScheme} onTrySimilar={trySimilar} />
        ) : (
          <div className="glass-card p-12 text-center text-text-muted h-full flex items-center justify-center">
            <div>
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-accent-primary opacity-40" />
              <p>Your step-by-step solution will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SolutionDisplay({ solution, showMarkScheme, setShowMarkScheme, onTrySimilar }: any) {
  return (
    <div className="glass-card p-6 space-y-6">
      <div>
        <Badge variant="cyan">Worked Solution</Badge>
        <h2 className="heading-3 mt-2">Step-by-step</h2>
      </div>

      <div className="space-y-4">
        {solution.steps?.map((s: any, i: number) => (
          <div key={i} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-primary/20 border border-accent-primary/40 flex items-center justify-center text-sm font-bold">
              {s.number ?? i + 1}
            </div>
            <div className="flex-1">
              <p className="text-text-primary">{s.explanation}</p>
              {s.formula && (
                <div className="mt-2 p-3 bg-bg-tertiary rounded-lg overflow-x-auto">
                  <BlockMath math={stripDals(s.formula)} />
                </div>
              )}
              {s.result && (
                <p className="mt-2 text-accent-cyan font-mono text-sm">{s.result}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {solution.finalAnswer && (
        <div className="p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/30">
          <p className="text-sm text-text-muted mb-1">Final answer</p>
          <p className="font-display font-bold text-lg text-gradient">{solution.finalAnswer}</p>
        </div>
      )}

      {solution.examinerTips?.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" /> Examiner tips
          </h3>
          <ul className="space-y-2">
            {solution.examinerTips.map((tip: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-yellow-400">▸</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {solution.markSchemePoints?.length > 0 && (
        <div>
          <button
            onClick={() => setShowMarkScheme(!showMarkScheme)}
            className="text-sm text-accent-cyan hover:underline"
          >
            {showMarkScheme ? 'Hide' : 'Show'} mark scheme reference
          </button>
          {showMarkScheme && (
            <ul className="mt-3 space-y-2">
              {solution.markSchemePoints.map((p: string, i: number) => (
                <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                  <span className="text-accent-cyan">✓</span> {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="pt-4 border-t border-accent-primary/20">
        <Button variant="cyan" onClick={onTrySimilar}>
          Try similar question
        </Button>
      </div>
    </div>
  );
}

function stripDals(s: string) {
  return (s ?? '').replace(/^\$+|\$+$/g, '').trim();
}