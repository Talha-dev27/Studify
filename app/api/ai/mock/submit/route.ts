import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { anthropic, MODEL } from '@/lib/claude/client';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { mockId, subjectCode, level, questions, answers, timeTakenSeconds } = await req.json();

    // Use Claude to grade answers and produce per-question breakdown
    const prompt = `You are a Cambridge examiner marking a mock exam.

Subject: ${subjectCode} (${level} Level)

Here are the questions and the student's answers:

${questions.map((q: any, i: number) => `Q${i + 1} [${q.marks}m, topic: ${q.topic}]
Question: ${q.question}
Correct answer: ${q.correctAnswer}
Mark scheme: ${(q.markScheme ?? []).join(' | ')}
Student's answer: ${answers[i] ?? '(blank)'}
`).join('\n')}

Grade each answer strictly but fairly. For each, award marks out of the marks available.

Return STRICT JSON (no markdown, no code fences):
{
  "breakdown": [
    {
      "number": 1,
      "correct": <bool>,
      "awardedMarks": <num>,
      "marks": <num>,
      "yourAnswer": "...",
      "correctAnswer": "...",
      "feedback": "..."
    }
  ],
  "totalScore": <num>,
  "totalMarks": <num>,
  "grade": "A*|A|B|C|D|E|U",
  "topicBreakdown": {"TopicName": 0.85, "OtherTopic": 0.4}
}

Grade based on these thresholds: A*>=90%, A>=80%, B>=70%, C>=60%, D>=50%, E>=40%, U<40%.`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (message.content.find((b) => b.type === 'text') as any)?.text ?? '';
    const match = raw.match(/\{[\s\S]*\}/);
    const result = JSON.parse(match ? match[0] : raw);

    const score = result.totalScore ?? 0;
    const totalMarks = result.totalMarks ?? questions.reduce((s: number, q: any) => s + (q.marks || 0), 0);
    const grade = result.grade ?? 'U';

    if (mockId) {
      await supabase.from('mocks').update({
        answers,
        score,
        total_marks: totalMarks,
        estimated_grade: grade,
        time_taken_seconds: timeTakenSeconds,
        completed_at: new Date().toISOString(),
      }).eq('id', mockId);
    }

    return NextResponse.json({
      score,
      totalMarks,
      percentage: Math.round((score / totalMarks) * 100),
      grade,
      breakdown: result.breakdown,
      topicBreakdown: result.topicBreakdown,
    });
  } catch (e: any) {
    console.error('Submit mock error', e);
    return NextResponse.json({ error: e.message ?? 'Failed' }, { status: 500 });
  }
}