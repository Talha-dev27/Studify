import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { predictPaper } from '@/lib/claude/solver';
import { checkRateLimit } from '@/lib/rateLimit';
import { getSubject } from '@/lib/subjects';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const limit = await checkRateLimit(user.id, 'paperGuesser');
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Premium feature' }, { status: 403 });
    }

    const sp = req.nextUrl.searchParams;
    const subjectCode = sp.get('subject')!;
    const level = (sp.get('level') as 'O' | 'A') ?? 'O';
    const session = sp.get('session')!;
    const component = sp.get('component') ?? '1';

    const subject = getSubject(subjectCode);
    const syllabusTopics = subject?.topics ?? [];

    // Fetch past papers for topic co-occurrence
    const { data: pastPapers } = await supabase
      .from('papers')
      .select('*')
      .eq('subject_code', subjectCode)
      .eq('paper_number', component)
      .order('year', { ascending: false })
      .limit(15);

    const prediction = await predictPaper({
      subjectCode,
      level,
      session,
      component,
      syllabusTopics,
      pastAppearances: pastPapers?.map((p) => ({ year: p.year, session: p.session, topics: [] })) ?? [],
    });

    return NextResponse.json({ prediction });
  } catch (e: any) {
    console.error('Predict paper error', e);
    return NextResponse.json({ error: e.message ?? 'Failed' }, { status: 500 });
  }
}