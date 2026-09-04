import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('papers').select('*').eq('id', params.id).single();
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Increment download count
    await supabase.from('papers').update({ download_count: (data.download_count ?? 0) + 1 }).eq('id', params.id);

    return NextResponse.json({ paper: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}