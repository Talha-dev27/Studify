'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Sparkles, Upload, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea, Select, Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export function CheckerClient({ subjects }: any) {
  const [subject, setSubject] = useState('4024');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [totalMarks, setTotalMarks] = useState(10);
  const [useMarkScheme, setUseMarkScheme] = useState(true);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showModel, setShowModel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    onDrop: async (files) => {
      const f = files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImageBase64(base64);
      };
      reader.readAsDataURL(f);
    },
  });

  async function check() {
    if (!question || !answer) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/ai/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          studentAnswer: answer,
          imageBase64,
          subjectCode: subject,
          totalMarks,
          useMarkScheme,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setResult(data.feedback);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="glass-card p-6 space-y-4">
          <Select
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            options={subjects.map((s: any) => ({ value: s.code, label: `${s.code} — ${s.name}` }))}
          />
          <Textarea
            label="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Paste or type the question…"
            className="min-h-[100px]"
          />
          <Textarea
            label="Your answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here…"
            className="min-h-[180px]"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total marks"
              type="number"
              min={1}
              max={50}
              value={totalMarks}
              onChange={(e) => setTotalMarks(parseInt(e.target.value) || 10)}
            />
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={useMarkScheme} onChange={(e) => setUseMarkScheme(e.target.checked)} className="accent-accent-primary" />
                Use official mark scheme
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Or upload handwritten answer (optional)</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-accent-primary bg-accent-primary/10' : 'border-accent-primary/30 hover:border-accent-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              {imageBase64 ? (
                <p className="text-sm text-accent-cyan">Image attached ✓</p>
              ) : (
                <p className="text-sm text-text-muted flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" /> Drop or click
                </p>
              )}
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button onClick={check} loading={loading} disabled={!question || !answer} className="w-full">
            <Sparkles className="w-4 h-4" /> Check My Answer
          </Button>
        </div>
      </div>

      <div>
        {result ? (
          <div className="glass-card p-6 space-y-6">
            <div className="text-center">
              <Badge variant="cyan">Marked</Badge>
              <div className="mt-3 text-5xl font-display font-bold">
                {result.marksAwarded}<span className="text-text-muted text-3xl">/{result.totalMarks}</span>
              </div>
              <p className="text-text-secondary mt-2">{result.overallCommentary}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Breakdown</h3>
              <div className="space-y-2">
                {result.breakdown?.map((b: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.04]">
                    {b.awarded ? <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm">{b.point}</p>
                      <p className="text-xs text-text-muted mt-1">{b.feedback}</p>
                    </div>
                    <span className="text-sm font-mono text-text-secondary">{b.marks}m</span>
                  </div>
                ))}
              </div>
            </div>

            {result.improvements?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">What to improve</h3>
                <ul className="space-y-2">
                  {result.improvements.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="text-accent-cyan">▸</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <button onClick={() => setShowModel(!showModel)} className="text-sm text-accent-cyan hover:underline">
                {showModel ? 'Hide' : 'Show'} model answer
              </button>
              {showModel && result.modelAnswer && (
                <div className="mt-3 p-4 rounded-lg bg-bg-tertiary text-sm whitespace-pre-wrap">
                  {result.modelAnswer}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 text-center text-text-muted h-full flex items-center justify-center">
            <div>
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>Your marking breakdown will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}