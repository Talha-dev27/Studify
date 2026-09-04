import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession } from '@/lib/stripe/client';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { plan, interval = 'monthly' } = await req.json();
    if (!['pro', 'premium'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const { data: profile } = await supabase.from('profiles').select('stripe_customer_id').eq('id', user.id).single();

    const { session, customerId } = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      plan,
      interval,
      customerId: profile?.stripe_customer_id ?? undefined,
    });

    if (!profile?.stripe_customer_id) {
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error('Checkout error', e);
    return NextResponse.json({ error: e.message ?? 'Failed' }, { status: 500 });
  }
}