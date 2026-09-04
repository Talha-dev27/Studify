import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { handleWebhook } from '@/lib/stripe/webhooks';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    await handleWebhook(event);
    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error('Webhook error', e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}