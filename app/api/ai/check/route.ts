import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAnswer } from '@/lib/claude/solver';
import { checkRateLimit, recordUsage } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const limit = await checkRateLimit(user.id, 'aiChecks');
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json();
    const { question, studentAnswer, imageBase64, subjectCode, totalMarks, useMarkScheme } = body;

    if (!question || !studentAnswer) {
      return NextResponse.json({ error: 'Question and answer required' }, { status: 400 });
    }

    const feedback = await checkAnswer({ question, studentAnswer, imageBase64, subjectCode, totalMarks, useMarkScheme });

    await Promise.all([
      supabase.from('checker_history').insert({
        user_id: user.id,
        subject_code: subjectCode,
        question: question.slice(0, 500),
        student_answer: studentAnswer.slice(0, 500),
        ai_feedback: feedback,
        marks_awarded: feedback.marksAwarded,
        total_marks: feedback.totalMarks,
      }),
      recordUsage(user.id, 'aiChecks'),
    ]);

    return NextResponse.json({ feedback, remaining: limit.remaining - 1 });
  } catch (e: any) {
    console.error('Check error', e);
    return NextResponse.json({ error: e.message ?? 'Failed' }, { status: 500 });
  }
}