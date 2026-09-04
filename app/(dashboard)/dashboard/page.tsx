import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { FileText, Bot, CheckCircle, Flame, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { timeAgo, gradeBg } from '@/lib/utils';
import { SUBJECTS, getSubject } from '@/lib/subjects';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [profile, userSubjects, recentMocks, recentSolves] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_subjects').select('*').eq('user_id', user.id),
    supabase.from('mocks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('solver_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
  ]);

  const p = profile.data;
  const firstName = (p?.name as string)?.split(' ')[0] ?? 'Student';
  const greeting = getGreeting();
  const enrolled = (userSubjects.data ?? []).map((us: any) => {
    const subj = getSubject(us.subject_code);
    return subj ? { ...us, subject: subj } : null;
  }).filter(Boolean);

  const papersAttempted = (recentMocks.data ?? []).length;
  const completedMocks = (recentMocks.data ?? []).filter((m: any) => m.completed_at);
  const averageScore = completedMocks.length
    ? Math.round(completedMocks.reduce((a: number, m: any) => a + ((m.score ?? 0) / (m.total_marks ?? 1)) * 100, 0) / completedMocks.length)
    : 0;

  const recentActivity = [
    ...((recentMocks.data ?? []).map((m: any) => ({
      type: 'mock' as const,
      title: `Mock: ${m.subject_code}`,
      subtitle: `Score: ${m.score ?? '—'}/${m.total_marks ?? '—'}`,
      time: m.created_at,
    }))),
    ...((recentSolves.data ?? []).map((s: any) => ({
      type: 'solve' as const,
      title: `AI Solve: ${s.subject_code ?? 'Question'}`,
      subtitle: s.question_text?.slice(0, 60) + '…',
      time: s.created_at,
    }))),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-1">
          {greeting}, <span className="text-gradient">{firstName}</span>.
        </h1>
        <p className="text-text-secondary mt-2">Ready to study? Here&apos;s your snapshot.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Papers Attempted" value={papersAttempted} color="from-accent-primary to-accent-glow" />
        <StatCard icon={Sparkles} label="Average Score" value={`${averageScore}%`} color="from-accent-cyan to-accent-primary" />
        <StatCard icon={CheckCircle} label="Mocks Completed" value={completedMocks.length} color="from-accent-pink to-accent-primary" />
        <StatCard icon={Flame} label="Study Streak" value="0 days" color="from-orange-400 to-red-500" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickAction href="/mock" title="Start Mock" desc="Build a custom exam" icon={FileText} />
        <QuickAction href="/solver" title="Solve Question" desc="Get AI worked solution" icon={Bot} />
        <QuickAction href="/checker" title="Check Answer" desc="Mark like an examiner" icon={CheckCircle} />
      </div>

      {/* Subject progress */}
      <div>
        <h2 className="heading-3 mb-4">Subject Progress</h2>
        {enrolled.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-text-secondary mb-4">No subjects yet.</p>
            <Link href="/settings?tab=subjects">
              <Button variant="primary">Add subjects</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolled.map((us: any) => (
              <SubjectProgress key={us.id} us={us} />
            ))}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="heading-3 mb-4">Recent Activity</h2>
        <div className="glass-card divide-y divide-accent-primary/10">
          {recentActivity.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              No activity yet. Try the AI Solver or Mock Maker!
            </div>
          ) : (
            recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-accent-primary/15 flex items-center justify-center">
                  {a.type === 'mock' ? <FileText className="w-4 h-4 text-accent-cyan" /> : <Bot className="w-4 h-4 text-accent-glow" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{a.title}</p>
                  <p className="text-xs text-text-muted truncate">{a.subtitle}</p>
                </div>
                <span className="text-xs text-text-muted flex-shrink-0">{timeAgo(a.time)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <TiltCard tiltMax={6} className="p-5">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-3xl font-display font-bold">{value}</div>
      <div className="text-xs text-text-muted mt-1">{label}</div>
    </TiltCard>
  );
}

function QuickAction({ href, title, desc, icon: Icon }: any) {
  return (
    <Link href={href}>
      <TiltCard tiltMax={8} className="p-5 group cursor-pointer h-full">
        <div className="flex items-start justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-accent-primary/15 flex items-center justify-center mb-3 group-hover:bg-accent-primary/25 transition-colors">
              <Icon className="w-5 h-5 text-accent-cyan" />
            </div>
            <h3 className="font-display font-semibold mb-1">{title}</h3>
            <p className="text-sm text-text-muted">{desc}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent-cyan group-hover:translate-x-1 transition-all" />
        </div>
      </TiltCard>
    </Link>
  );
}

function SubjectProgress({ us }: { us: any }) {
  const progress = Math.floor(Math.random() * 60) + 20;
  const grade = progress >= 90 ? 'A*' : progress >= 80 ? 'A' : progress >= 70 ? 'B' : progress >= 60 ? 'C' : progress >= 50 ? 'D' : progress >= 40 ? 'E' : 'U';

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-accent-cyan">{us.subject_code}</span>
          <span className="font-semibold text-sm">{us.subject.name}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${gradeBg(grade)}`}>
          {grade}
        </span>
      </div>
      <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-primary to-accent-cyan transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
        <span>{us.level} Level</span>
        <span>{progress}% mastery</span>
      </div>
    </div>
  );
}