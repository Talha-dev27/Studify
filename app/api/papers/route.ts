import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const sp = req.nextUrl.searchParams;
    let q1 = supabase.from('papers').select('*', { count: 'exact' });

    if (sp.get('subject')) q1 = q1.eq('subject_code', sp.get('subject')!);
    if (sp.get('year')) q1 = q1.eq('year', parseInt(sp.get('year')!));
    if (sp.get('session')) q1 = q1.eq('session', sp.get('session')!);
    if (sp.get('paper')) q1 = q1.eq('paper_number', sp.get('paper')!);

    const page = parseInt(sp.get('page') ?? '1');
    const limit = parseInt(sp.get('limit') ?? '20');
    q1 = q1.order('year', { ascending: false }).range((page - 1) * limit, page * limit - 1);

    const { data, count } = await q1;
    return NextResponse.json({ papers: data ?? [], total: count ?? 0, page, limit });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}