'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Get started at zero cost.',
    features: [
      '5 paper views per day',
      '3 AI solves per day',
      '2 AI checks per day',
      'Browse all subjects',
      'Basic dashboard',
    ],
    cta: 'Start for free',
    highlight: false,
    href: '/signup',
  },
  {
    name: 'Pro',
    price: 7.99,
    description: 'For serious students.',
    features: [
      'Unlimited paper views',
      '50 AI solves per day',
      '30 AI checks per day',
      'Mock Maker (unlimited)',
      'AI Checker with mark schemes',
      'Priority email support',
    ],
    cta: 'Get Pro',
    highlight: true,
    href: '/signup?plan=pro',
  },
  {
    name: 'Premium',
    price: 14.99,
    description: 'Everything you need to ace it.',
    features: [
      'Everything in Pro',
      'Unlimited AI solves',
      'Unlimited AI checks',
      'Grade Threshold Guesser',
      'Paper Guesser',
      'Priority AI processing',
      'Early access to new features',
    ],
    cta: 'Get Premium',
    highlight: false,
    href: '/signup?plan=premium',
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="section-pad relative">
      <div className="container-app mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">Pricing</span>
          <h2 className="heading-1">
            Simple, <span className="text-gradient">honest</span> pricing
          </h2>
          <p className="mt-4 text-text-secondary">No hidden fees. Cancel anytime.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={cn(
                'glass-card p-8 relative flex flex-col',
                plan.highlight && 'border-accent-primary/60 shadow-glow md:-translate-y-4',
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-accent-primary to-accent-cyan text-xs font-semibold">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}
              <h3 className="font-display font-bold text-2xl">{plan.name}</h3>
              <p className="text-text-secondary text-sm mt-1">{plan.description}</p>
              <div className="mt-6 mb-6">
                <span className="text-5xl font-display font-bold">${plan.price}</span>
                <span className="text-text-secondary ml-1">/month</span>
              </div>
              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                    <span className="text-text-secondary">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={cn(
                  'mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
                  plan.highlight
                    ? 'bg-gradient-to-br from-accent-primary to-accent-glow text-white hover:shadow-glow'
                    : 'bg-white/5 border border-accent-primary/30 text-text-primary hover:bg-accent-primary/10',
                )}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center mt-8 text-sm text-text-muted">
          Save 17% with annual billing. All prices in USD.
        </p>
      </div>
    </section>
  );
}