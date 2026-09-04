import { createClient } from '@/lib/supabase/server';
import { SUBJECTS, getSubject } from '@/lib/subjects';
import { PaperLibrary } from './PaperLibrary';

export default async function PapersPage({
  searchParams,
}: {
  searchParams: { subject?: string; year?: string; session?: string; paper?: string; level?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase.from('papers').select('*', { count: 'exact' });
  if (searchParams.subject) query = query.eq('subject_code', searchParams.subject);
  if (searchParams.year) query = query.eq('year', parseInt(searchParams.year));
  if (searchParams.session) query = query.eq('session', searchParams.session);
  if (searchParams.paper) query = query.eq('paper_number', searchParams.paper);

  const { data: papers, count } = await query.order('year', { ascending: false }).limit(60);

  const enriched = (papers ?? []).map((p: any) => ({
    ...p,
    subjectName: getSubject(p.subject_code)?.name ?? p.subject_code,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-1">Past Paper Library</h1>
        <p className="text-text-secondary mt-2">Browse and download every Cambridge past paper.</p>
      </div>
      <PaperLibrary papers={enriched} total={count ?? 0} subjects={SUBJECTS} />
    </div>
  );
}