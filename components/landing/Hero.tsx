'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroScene = dynamic(
  () => import('@/components/3d/HeroScene').then(m => m.HeroScene),
  { ssr: false },
);

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
      <HeroScene />

      <div className="relative z-10 container-app mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-sm"
        >
          <Sparkles className="w-4 h-4 text-accent-cyan" />
          <span className="text-text-secondary">
            Now predicting <span className="text-accent-cyan font-medium">MJ 2025</span> thresholds
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="heading-hero"
        >
          <span className="block">Study Smarter.</span>
          <span className="block text-gradient">Score Higher.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-text-secondary"
        >
          AI-powered past papers, mock exams, and grade insights for Cambridge O & A Level students.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium text-white bg-gradient-to-br from-accent-primary to-accent-glow shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5 transition-all"
          >
            Start for Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium text-text-primary bg-white/5 border border-accent-primary/30 hover:bg-accent-primary/10 transition-all"
          >
            See How It Works
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 flex items-center justify-center gap-6 text-xs text-text-muted"
        >
          <div className="flex -space-x-2">
            {['#6C63FF', '#00D4FF', '#FF6BD6', '#8B84FF'].map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-primary" style={{ background: c }} />
            ))}
          </div>
          <span>Trusted by 12,000+ Cambridge students</span>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-10 pointer-events-none" />
    </section>
  );
}