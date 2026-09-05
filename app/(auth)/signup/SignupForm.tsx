'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';

export function SignupForm({ initialPlan }: { initialPlan?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState<'O' | 'A' | 'Both'>('Both');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const POPULAR_SUBJECTS = [
    '4024', '5054', '5070', '5090', '1123', '2281',
    '9709', '9702', '9701', '9700', '9708',
  ];

  function toggleSubject(code: string) {
    setSubjects(s => s.includes(code) ? s.filter(x => x !== code) : [...s, code]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        data: { name, level, subjects },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push(initialPlan ? `/checkout?plan=${initialPlan}` : '/dashboard');
      router.refresh();
    } else {
      router.push('/onboarding');
    }
  }

  return (
    <>
      {step === 1 && (
        <>
          <Button
            type="button"
            onClick={async () => {
              setLoading(true);
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` },
              });
              if (error) { setError(error.message); setLoading(false); }
            }}
            variant="outline"
            className="w-full"
          >
            Continue with Google
          </Button>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-accent-primary/20" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-bg-secondary px-4 text-text-muted">or</span>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <Input label="Full name" required placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" type="email" required placeholder="you@school.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" type="password" required minLength={6} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" className="w-full">Continue</Button>
          </form>
        </>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="heading-3 text-center">Pick your level</h2>
          <div className="grid grid-cols-3 gap-3">
            {(['O', 'A', 'Both'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`p-4 rounded-xl border transition-all ${
                  level === l
                    ? 'bg-accent-primary/20 border-accent-primary'
                    : 'bg-white/[0.04] border-accent-primary/20 hover:border-accent-primary/40'
                }`}
              >
                <div className="font-display font-bold">{l === 'Both' ? 'Both' : `${l} Level`}</div>
              </button>
            ))}
          </div>

          <h3 className="font-semibold text-sm text-text-secondary">Your subjects (optional)</h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SUBJECTS.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => toggleSubject(code)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  subjects.includes(code)
                    ? 'bg-accent-primary/30 border-accent-primary text-white'
                    : 'bg-white/[0.04] border-accent-primary/20 hover:border-accent-primary/40'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button type="button" onClick={onSubmit} loading={loading} className="flex-1">Create account</Button>
          </div>
        </div>
      )}
    </>
  );
}