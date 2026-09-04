import { stripe } from './client';
import { createServiceClient } from '../supabase/server';
import type Stripe from 'stripe';

export async function handleWebhook(event: Stripe.Event) {
  const supabase = createServiceClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as 'pro' | 'premium' | undefined;

      if (userId && plan && session.subscription && session.customer) {
        const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
        const custId = typeof session.customer === 'string' ? session.customer : session.customer.id;
        await supabase.from('profiles').update({
          plan,
          stripe_customer_id: custId,
        }).eq('id', userId);

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_subscription_id: subId,
          plan,
          status: 'active',
        }, { onConflict: 'stripe_subscription_id' });
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const status = sub.status;
      await supabase.from('subscriptions').update({
        status,
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      }).eq('stripe_subscription_id', sub.id);

      if (status === 'active' || status === 'trialing') {
        const plan = (sub.metadata?.plan as string) ?? 'pro';
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
        await supabase.from('profiles').update({ plan }).eq('stripe_customer_id', customerId);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await supabase.from('subscriptions').update({ status: 'cancelled' })
        .eq('stripe_subscription_id', sub.id);

      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
      await supabase.from('profiles').update({ plan: 'free' })
        .eq('stripe_customer_id', customerId);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
      if (customerId) {
        await supabase.from('subscriptions').update({ status: 'past_due' })
          .eq('stripe_subscription_id', invoice.subscription as string);
      }
      break;
    }
  }
}