import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { predictThresholds } from '@/lib/claude/solver';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const limit = await checkRateLimit(user.id, 'thresholdGuesser');
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Premium feature' }, { status: 403 });
    }

    const sp = req.nextUrl.searchParams;
    const subjectCode = sp.get('subject')!;
    const paperNumber = sp.get('paper') ?? '1';
    const session = sp.get('session')!;
    const rawMarkStr = sp.get('rawMark');
    const rawMark = rawMarkStr ? parseInt(rawMarkStr) : undefined;

    // Fetch historical thresholds for this subject/paper
    const { data: history } = await supabase
      .from('grade_thresholds')
      .select('*')
      .eq('subject_code', subjectCode)
      .eq('paper_number', paperNumber)
      .order('year', { ascending: false })
      .limit(20);

    const byYear: Record<string, any> = {};
    for (const row of history ?? []) {
      const key = `${row.year}-${row.session}`;
      if (!byYear[key]) byYear[key] = { year: row.year, session: row.session, thresholds: {} as any };
      byYear[key].thresholds[row.grade] = row.min_mark;
      byYear[key].thresholds.total = row.total_marks;
    }
    const historicalArr = Object.values(byYear).sort((a: any, b: any) => b.year - a.year).slice(0, 10);

    // Get community difficulty rating
    const [yStr, sCode] = [session.slice(0, 4), session.slice(4)];
    const { data: reports } = await supabase
      .from('difficulty_reports')
      .select('difficulty_rating')
      .eq('subject_code', subjectCode)
      .eq('session', sCode)
      .eq('paper_number', paperNumber);
    const avgRating = (reports ?? []).length
      ? (reports ?? []).reduce((a, r) => a + r.difficulty_rating, 0) / reports!.length
      : undefined;

    const prediction = await predictThresholds({
      subjectCode,
      paperNumber,
      session,
      historical: historicalArr as any,
      communityDifficulty: avgRating,
    });

    // Determine user's predicted grade
    let yourGrade: string | undefined;
    if (rawMark !== undefined) {
      const pred = (prediction.prediction as any) ?? {};
      const grades = ['A*', 'A', 'B', 'C', 'D', 'E'] as const;
      for (const g of grades) {
        const r = pred[g];
        if (r && rawMark >= r.min) {
          yourGrade = g;
          break;
        }
      }
      if (!yourGrade) yourGrade = 'U';
    }

    return NextResponse.json({ prediction, historical: historicalArr, yourGrade });
  } catch (e: any) {
    console.error('Predict thresholds error', e);
    return NextResponse.json({ error: e.message ?? 'Failed' }, { status: 500 });
  }
}