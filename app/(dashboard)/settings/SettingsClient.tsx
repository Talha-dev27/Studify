'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, BookOpen, Target, Bell, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SUBJECTS } from '@/lib/subjects';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'subjects', label: 'My Subjects', icon: BookOpen },
  { id: 'goals', label: 'Study Goals', icon: Target },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'account', label: 'Account', icon: Lock },
];

export function SettingsClient({ profile, userSubjects, initialTab, user }: any) {
  const router = useRouter();
  const params = useSearchParams();
  const tab = params.get('tab') ?? initialTab ?? 'profile';
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  function setTab(t: string) {
    const sp = new URLSearchParams(params.toString());
    sp.set('tab', t);
    router.push(`/settings?${sp.toString()}`);
  }

  function flash() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-1">Settings</h1>
        <p className="text-text-secondary mt-2">Manage your account, subjects, and subscription.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
        <nav className="glass-card p-2 h-fit space-y-1 lg:sticky lg:top-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                tab === t.id ? 'bg-accent-primary/20 text-text-primary' : 'text-text-secondary hover:bg-white/[0.04]',
              )}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </nav>

        <div className="glass-card p-8">
          {saved && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Saved
            </div>
          )}

          {tab === 'profile' && <ProfileTab profile={profile} onSaved={flash} user={user} />}
          {tab === 'subjects' && <SubjectsTab userSubjects={userSubjects} onSaved={flash} userId={user.id} />}
          {tab === 'goals' && <GoalsTab profile={profile} onSaved={flash} userId={user.id} />}
          {tab === 'notifications' && <NotificationsTab onSaved={flash} />}
          {tab === 'subscription' && <SubscriptionTab profile={profile} />}
          {tab === 'account' && <AccountTab user={user} />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ profile, onSaved, user }: any) {
  const supabase = createClient();
  const [name, setName] = useState(profile?.name ?? '');
  const [school, setSchool] = useState(profile?.school ?? '');
  const [country, setCountry] = useState(profile?.country ?? '');
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await supabase.from('profiles').update({ name, school, country }).eq('id', user.id);
    setSaving(false);
    onSaved();
  }

  return (
    <div className="space-y-4">
      <h2 className="heading-3">Profile</h2>
      <Input label="Email" value={user.email} disabled />
      <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="School" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="e.g. Springfield High" />
      <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Pakistan" />
      <Button onClick={save} loading={saving}>Save</Button>
    </div>
  );
}

function SubjectsTab({ userSubjects, onSaved, userId }: any) {
  const supabase = createClient();
  const [subjects, setSubjects] = useState<string[]>(userSubjects.map((s: any) => s.subject_code));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await supabase.from('user_subjects').delete().eq('user_id', userId);
    if (subjects.length) {
      await supabase.from('user_subjects').insert(
        subjects.map((code) => ({ user_id: userId, subject_code: code, level: SUBJECTS.find((s) => s.code === code)?.level === 'A' ? 'A' : 'O' })),
      );
    }
    setSaving(false);
    onSaved();
  }

  return (
    <div className="space-y-6">
      <h2 className="heading-3">My Subjects</h2>
      <p className="text-sm text-text-secondary">Pick the subjects you&apos;re studying. We&apos;ll use these to personalise your dashboard.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
        {SUBJECTS.map((s) => (
          <label key={s.code} className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer">
            <input
              type="checkbox"
              checked={subjects.includes(s.code)}
              onChange={(e) => setSubjects(e.target.checked ? [...subjects, s.code] : subjects.filter((c) => c !== s.code))}
              className="accent-accent-primary"
            />
            <span className="font-mono text-xs text-accent-cyan w-12">{s.code}</span>
            <span className="text-sm flex-1">{s.name}</span>
            <Badge variant="cyan">{s.level}</Badge>
          </label>
        ))}
      </div>
      <Button onClick={save} loading={saving}>Save subjects</Button>
    </div>
  );
}

function GoalsTab({ profile, onSaved, userId }: any) {
  const supabase = createClient();
  const [dailyMin, setDailyMin] = useState(profile?.daily_minutes ?? 60);
  const [weeklyMocks, setWeeklyMocks] = useState(profile?.weekly_mocks ?? 2);

  async function save() {
    await supabase.from('profiles').update({ daily_minutes: dailyMin, weekly_mocks: weeklyMocks }).eq('id', userId);
    onSaved();
  }

  return (
    <div className="space-y-4">
      <h2 className="heading-3">Study Goals</h2>
      <Input label="Daily study minutes" type="number" value={dailyMin} onChange={(e) => setDailyMin(parseInt(e.target.value) || 0)} />
      <Input label="Weekly mocks target" type="number" value={weeklyMocks} onChange={(e) => setWeeklyMocks(parseInt(e.target.value) || 0)} />
      <Button onClick={save}>Save goals</Button>
    </div>
  );
}

function NotificationsTab({ onSaved }: any) {
  return (
    <div className="space-y-4">
      <h2 className="heading-3">Notifications</h2>
      <label className="flex items-center justify-between p-3 rounded-lg bg-white/[0.04]">
        <div>
          <p className="font-medium text-sm">Threshold updates</p>
          <p className="text-xs text-text-muted">Get notified when Cambridge publishes grade boundaries</p>
        </div>
        <input type="checkbox" defaultChecked className="accent-accent-primary w-5 h-5" />
      </label>
      <label className="flex items-center justify-between p-3 rounded-lg bg-white/[0.04]">
        <div>
          <p className="font-medium text-sm">New past papers</p>
          <p className="text-xs text-text-muted">When new papers are added for your subjects</p>
        </div>
        <input type="checkbox" defaultChecked className="accent-accent-primary w-5 h-5" />
      </label>
      <label className="flex items-center justify-between p-3 rounded-lg bg-white/[0.04]">
        <div>
          <p className="font-medium text-sm">Weekly progress digest</p>
          <p className="text-xs text-text-muted">Summary of your study activity each week</p>
        </div>
        <input type="checkbox" className="accent-accent-primary w-5 h-5" />
      </label>
      <Button onClick={onSaved}>Save</Button>
    </div>
  );
}

function SubscriptionTab({ profile }: any) {
  const router = useRouter();
  const plan = profile?.plan ?? 'free';

  async function upgrade(target: 'pro' | 'premium', interval: 'monthly' | 'annual') {
    const res = await fetch('/api/payments/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: target, interval }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  async function portal() {
    const res = await fetch('/api/payments/portal', { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <div className="space-y-6">
      <h2 className="heading-3">Subscription</h2>
      <div className="p-6 rounded-xl bg-gradient-to-br from-accent-primary/15 to-accent-cyan/10 border border-accent-primary/30">
        <Badge variant="cyan">Current plan</Badge>
        <p className="text-3xl font-display font-bold mt-3 capitalize">{plan}</p>
        {plan !== 'free' && <Button onClick={portal} className="mt-4" variant="outline">Manage billing</Button>}
      </div>

      {plan === 'free' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => upgrade('pro', 'monthly')} className="glass-card p-6 text-left hover:border-accent-primary/60 transition-all">
            <h3 className="font-display font-bold text-lg">Pro Monthly</h3>
            <p className="text-3xl font-display font-bold mt-2">$7.99<span className="text-base text-text-muted">/mo</span></p>
            <p className="text-sm text-text-secondary mt-3">Unlimited papers, 50 AI solves/day, Mock Maker, AI Checker.</p>
          </button>
          <button onClick={() => upgrade('premium', 'monthly')} className="glass-card p-6 text-left hover:border-accent-primary/60 transition-all">
            <h3 className="font-display font-bold text-lg">Premium Monthly</h3>
            <p className="text-3xl font-display font-bold mt-2">$14.99<span className="text-base text-text-muted">/mo</span></p>
            <p className="text-sm text-text-secondary mt-3">Everything unlimited + Threshold Guesser + Paper Guesser.</p>
          </button>
        </div>
      )}
    </div>
  );
}

function AccountTab({ user }: any) {
  const supabase = createClient();
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <div className="space-y-4">
      <h2 className="heading-3">Account</h2>
      <p className="text-sm text-text-secondary">Signed in as {user.email}</p>
      <Button onClick={signOut} variant="outline">Log out</Button>
    </div>
  );
}