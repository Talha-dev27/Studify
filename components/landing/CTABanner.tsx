'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CTABanner() {
  return (
    <section className="section-pad relative">
      <div className="container-app mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl glass-card p-12 md:p-20 text-center"
        >
          <div className="absolute inset-0 bg-glow-radial opacity-50" />
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-accent-primary/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-accent-cyan/30 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="heading-1 max-w-3xl mx-auto">
              Start your Cambridge <span className="text-gradient">journey</span> today
            </h2>
            <p className="mt-6 text-text-secondary text-lg max-w-xl mx-auto">
              Join 12,000+ students already studying smarter. Free to get started.
            </p>
            <Link
              href="/signup"
              className="mt-10 inline-flex items-center justify-center gap-2 px-10 py-5 rounded-xl font-medium text-white bg-gradient-to-br from-accent-primary to-accent-glow shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5 transition-all text-lg"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}