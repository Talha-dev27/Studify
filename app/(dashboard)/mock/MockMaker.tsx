'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, ChevronLeft, ChevronRight, Flag, Send, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Input';
import { gradeBg, gradeColor } from '@/lib/utils';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
} from 'recharts';

type Step = 'config' | 'exam' | 'results';

export function MockMaker({ subjects, initialSubject, initialLevel }: any) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('config');
  const [subject, setSubject] = useState(initialSubject ?? '4024');
  const [level, setLevel] = useState<'O' | 'A'>(initialLevel ?? 'O');
  const [paperType, setPaperType] = useState<'MCQ' | 'Theory' | 'Mixed'>('Mixed');
  const [difficulty, setDifficulty] = useState('Exam-Standard');
  const [duration, setDuration] = useState(60);
  const [numQuestions, setNumQuestions] = useState(10);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [mockId, setMockId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const subj = subjects.find((s: any) => s.code === subject);

  useEffect(() => {
    setTopics(subj?.topics ?? []);
  }, [subject, subj]);

  useEffect(() => {
    if (step !== 'exam' || paused || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [step, paused, timeLeft]);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/mock/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectCode: subject,
          level,
          paperType,
          difficulty,
          topics,
          numQuestions,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      setQuestions(data.questions);
      setMockId(data.mockId);
      setTimeLeft(duration * 60);
      setStep('exam');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function saveProgress() {
    if (typeof window === 'undefined' || !mockId) return;
    localStorage.setItem(`mock-${mockId}`, JSON.stringify({ answers, flagged: [...flagged], currentQ, timeLeft }));
  }

  function loadProgress() {
    if (!mockId) return;
    const saved = localStorage.getItem(`mock-${mockId}`);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setAnswers(p.answers ?? {});
        setFlagged(new Set(p.flagged ?? []));
        setCurrentQ(p.currentQ ?? 0);
        setTimeLeft(p.timeLeft ?? duration * 60);
      } catch {}
    }
  }

  useEffect(() => {
    if (step === 'exam') loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (step === 'exam') {
      const id = setInterval(saveProgress, 30000);
      return () => clearInterval(id);
    }
  }, [step, answers, flagged, currentQ, timeLeft]);

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/mock/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockId,
          subjectCode: subject,
          level,
          questions,
          answers,
          timeTakenSeconds: duration * 60 - timeLeft,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');
      setResults(data);
      if (mockId) localStorage.removeItem(`mock-${mockId}`);
      setStep('results');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep('config');
    setQuestions([]);
    setAnswers({});
    setResults(null);
    setMockId(null);
    setCurrentQ(0);
  }

  if (step === 'config') {
    return (
      <div className="glass-card p-8 max-w-3xl">
        <h2 className="heading-2 mb-6">Configure your mock</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            options={subjects.map((s: any) => ({ value: s.code, label: `${s.code} — ${s.name}` }))}
          />
          <Select
            label="Level"
            value={level}
            onChange={(e) => setLevel(e.target.value as 'O' | 'A')}
            options={[{ value: 'O', label: 'O Level' }, { value: 'A', label: 'A Level' }]}
          />
          <Select label="Paper type" value={paperType} onChange={(e) => setPaperType(e.target.value as any)} options={[{ value: 'MCQ', label: 'MCQ only' }, { value: 'Theory', label: 'Theory only' }, { value: 'Mixed', label: 'Mixed' }]} />
          <Select label="Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} options={['Easy', 'Medium', 'Hard', 'Mixed', 'Exam-Standard'].map((d) => ({ value: d, label: d }))} />
          <Select label="Duration" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} options={[30, 45, 60, 90, 120].map((d) => ({ value: d.toString(), label: `${d} minutes` }))} />
          <Select label="Number of questions" value={numQuestions} onChange={(e) => setNumQuestions(parseInt(e.target.value))} options={[10, 15, 20, 30].map((d) => ({ value: d.toString(), label: `${d} questions` }))} />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-text-secondary mb-2">Topics (auto-selected)</label>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <Badge key={t} variant="default">{t}</Badge>
            ))}
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-text-muted">Generating a mock uses 1 AI credit (Pro/Premium).</p>
          <Button onClick={generate} loading={loading} size="lg">
            <Sparkles className="w-4 h-4" /> Generate Mock
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'exam' && questions.length > 0) {
    const q = questions[currentQ];
    const totalSecs = duration * 60;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    return (
      <div className="space-y-4">
        <div className="glass-card p-4 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="cyan">{subjects.find((s: any) => s.code === subject)?.name}</Badge>
            <span className="text-sm text-text-secondary">Question {currentQ + 1} of {questions.length}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setPaused(!paused)} className="p-2 rounded-lg hover:bg-accent-primary/10">
              {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <div className="data-mono text-lg font-bold text-accent-cyan">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
          </div>
        </div>

        {paused ? (
          <div className="glass-card p-12 text-center">
            <Pause className="w-12 h-12 mx-auto mb-4 text-accent-cyan" />
            <p className="text-text-secondary">Paused. Click play to continue.</p>
          </div>
        ) : showAll ? (
          <div className="space-y-4">
            {questions.map((q, i) => (
              <QuestionCard key={i} q={q} index={i} answer={answers[i] ?? ''} onChange={(v) => setAnswers((a) => ({ ...a, [i]: v }))} flagged={flagged.has(i)} onFlag={() => setFlagged((f) => { const s = new Set(f); s.has(i) ? s.delete(i) : s.add(i); return s; })} />
            ))}
          </div>
        ) : (
          <QuestionCard q={q} index={currentQ} answer={answers[currentQ] ?? ''} onChange={(v) => setAnswers((a) => ({ ...a, [currentQ]: v }))} flagged={flagged.has(currentQ)} onFlag={() => setFlagged((f) => { const s = new Set(f); s.has(currentQ) ? s.delete(currentQ) : s.add(currentQ); return s; })} />
        )}

        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled={currentQ === 0} onClick={() => setCurrentQ((c) => c - 1)}>
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            <Button variant="ghost" size="sm" disabled={currentQ === questions.length - 1} onClick={() => setCurrentQ((c) => c + 1)}>
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show one at a time' : 'Show all'}
            </Button>
            <Button variant="primary" onClick={submit} loading={loading}>
              <Send className="w-4 h-4" /> Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results' && results) {
    const radarData = Object.entries(results.topicBreakdown ?? {}).map(([topic, score]: any) => ({
      topic,
      score: Math.round(score * 100),
    }));

    return (
      <div className="space-y-6">
        <div className="glass-card p-8 text-center">
          <Badge variant="cyan">Mock Results</Badge>
          <div className="mt-4 flex items-center justify-center gap-8">
            <div>
              <p className="text-sm text-text-muted">Score</p>
              <p className="text-5xl font-display font-bold">{results.score}/{results.totalMarks}</p>
              <p className="text-sm text-text-secondary mt-1">{results.percentage}%</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Estimated Grade</p>
              <p className={`text-6xl font-display font-bold ${gradeColor(results.grade)}`}>{results.grade}</p>
              <p className="text-sm text-text-secondary mt-1">{Math.floor((duration * 60 - timeLeft) / 60)} min taken</p>
            </div>
          </div>
        </div>

        {radarData.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="heading-3 mb-4">Topic performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(108,99,255,0.2)" />
                <PolarAngleAxis dataKey="topic" tick={{ fill: '#8B8BAA', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#5C5C7A', fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="glass-card p-6">
          <h3 className="heading-3 mb-4">Question breakdown</h3>
          <div className="space-y-3">
            {results.breakdown?.map((b: any, i: number) => (
              <div key={i} className={`p-4 rounded-xl border ${b.correct ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs">Q{b.number}</span>
                  <Badge variant={b.correct ? 'success' : 'warning'}>
                    {b.awardedMarks}/{b.marks}
                  </Badge>
                </div>
                <p className="text-sm text-text-secondary mb-1"><strong>Your answer:</strong> {b.yourAnswer || '—'}</p>
                <p className="text-sm mb-1"><strong>Correct:</strong> {b.correctAnswer}</p>
                {b.feedback && <p className="text-xs text-text-muted mt-2">{b.feedback}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4" /> New Mock
          </Button>
          <Button variant="primary" onClick={() => router.push('/dashboard')}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

function QuestionCard({ q, index, answer, onChange, flagged, onFlag }: any) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-accent-cyan">Q{index + 1}</span>
          <Badge>{q.marks} marks</Badge>
          <Badge variant="cyan">{q.topic}</Badge>
        </div>
        <button onClick={onFlag} className={`p-2 rounded-lg transition-colors ${flagged ? 'bg-yellow-500/20 text-yellow-400' : 'text-text-muted hover:bg-white/5'}`}>
          <Flag className="w-4 h-4" />
        </button>
      </div>
      <p className="text-text-primary mb-4 whitespace-pre-wrap">{q.question}</p>

      {q.type === 'mcq' && q.options ? (
        <div className="space-y-2">
          {q.options.map((opt: string, i: number) => (
            <button
              key={i}
              onClick={() => onChange(opt)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${answer === opt ? 'border-accent-primary bg-accent-primary/15' : 'border-accent-primary/20 hover:border-accent-primary/40'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <Textarea
          placeholder="Your answer…"
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px]"
        />
      )}
    </div>
  );
}