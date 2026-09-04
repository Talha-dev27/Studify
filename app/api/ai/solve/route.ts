import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { solveQuestion } from '@/lib/claude/solver';
import { checkRateLimit, recordUsage } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const limit = await checkRateLimit(user.id, 'aiSolves');
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded', remaining: 0 }, { status: 429 });
    }

    const body = await req.json();
    const { question, imageBase64, mediaType, subjectCode, level } = body;
    if (!question && !imageBase64) {
      return NextResponse.json({ error: 'Question or image required' }, { status: 400 });
    }

    const solution = await solveQuestion({ question, imageBase64, mediaType, subjectCode, level });

    await Promise.all([
      supabase.from('solver_history').insert({
        user_id: user.id,
        subject_code: subjectCode,
        question_text: question?.slice(0, 500) ?? '',
        solution: JSON.stringify(solution),
      }),
      recordUsage(user.id, 'aiSolves'),
    ]);

    return NextResponse.json({ solution, remaining: limit.remaining - 1 });
  } catch (e: any) {
    console.error('Solve error', e);
    return NextResponse.json({ error: e.message ?? 'Failed' }, { status: 500 });
  }
}