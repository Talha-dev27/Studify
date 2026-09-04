import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [mocks, solves, checks, subjects] = await Promise.all([
      supabase.from('mocks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('solver_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('checker_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('user_subjects').select('*').eq('user_id', user.id),
    ]);

    return NextResponse.json({
      mocks: mocks.data ?? [],
      solves: solves.data ?? [],
      checks: checks.data ?? [],
      subjects: subjects.data ?? [],
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}