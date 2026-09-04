import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export const PLANS = {
  pro: {
    name: 'Pro',
    monthly: {
      priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
      amount: 799,
    },
    annual: {
      priceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID!,
      amount: 7999,
    },
  },
  premium: {
    name: 'Premium',
    monthly: {
      priceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
      amount: 1499,
    },
    annual: {
      priceId: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID!,
      amount: 14999,
    },
  },
};

export async function createCheckoutSession(params: {
  userId: string;
  email: string;
  plan: 'pro' | 'premium';
  interval: 'monthly' | 'annual';
  customerId?: string;
}) {
  const priceId = PLANS[params.plan][params.interval].priceId;

  let customerId = params.customerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: params.email,
      metadata: { userId: params.userId },
    });
    customerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=subscription&success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: { userId: params.userId, plan: params.plan },
  });

  return { session, customerId };
}

export async function createCustomerPortalSession(customerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=subscription`,
  });
}