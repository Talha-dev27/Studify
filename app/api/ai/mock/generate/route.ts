import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateMock } from '@/lib/claude/solver';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const limit = await checkRateLimit(user.id, 'mockMaker');
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Mock Maker requires Pro or Premium plan' }, { status: 403 });
    }

    const body = await req.json();
    const { subjectCode, level, paperType, difficulty, topics, numQuestions } = body;

    const questions = await generateMock({
      subjectCode,
      level,
      difficulty,
      topics,
      numberOfQuestions: numQuestions ?? 10,
      paperType,
    });

    const totalMarks = questions.reduce((s, q) => s + (q.marks || 0), 0);

    const { data: mock } = await supabase
      .from('mocks')
      .insert({
        user_id: user.id,
        subject_code: subjectCode,
        config: { level, paperType, difficulty, topics, numQuestions, duration: body.duration },
        questions,
        total_marks: totalMarks,
      })
      .select('id')
      .single();

    return NextResponse.json({ mockId: mock?.id, questions, totalMarks });
  } catch (e: any) {
    console.error('Generate mock error', e);
    return NextResponse.json({ error: e.message ?? 'Failed' }, { status: 500 });
  }
}