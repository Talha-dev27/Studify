'use client';

import { motion } from 'framer-motion';
import { BookOpen, Bot, FileText, CheckCircle, TrendingUp, Eye } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

const features = [
  {
    icon: BookOpen,
    title: 'Past Paper Library',
    description: 'Every Cambridge paper, every year, every session — organized and searchable.',
    color: 'from-accent-primary to-accent-glow',
  },
  {
    icon: Bot,
    title: 'AI Solver',
    description: 'Full worked solutions for any question, in seconds. With examiner tips.',
    color: 'from-accent-cyan to-accent-primary',
  },
  {
    icon: FileText,
    title: 'Mock Maker',
    description: 'Custom mocks built from real past paper questions, tailored to your level.',
    color: 'from-accent-pink to-accent-primary',
  },
  {
    icon: CheckCircle,
    title: 'AI Checker',
    description: 'Get marked like a Cambridge examiner — fair, strict, detailed feedback.',
    color: 'from-green-400 to-accent-cyan',
  },
  {
    icon: TrendingUp,
    title: 'Grade Threshold Guesser',
    description: 'Predict A/B/C boundaries before results day with historical AI analysis.',
    color: 'from-yellow-400 to-accent-primary',
  },
  {
    icon: Eye,
    title: 'Paper Guesser',
    description: 'AI predicts upcoming exam topics and question patterns from past papers.',
    color: 'from-accent-pink to-accent-cyan',
  },
];

export function Features() {
  return (
    <section id="features" className="section-pad relative">
      <div className="container-app mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="badge mb-4">Features</span>
          <h2 className="heading-1 max-w-3xl mx-auto">
            Everything you need to <span className="text-gradient">crush</span> your Cambridge exams
          </h2>
          <p className="mt-6 text-text-secondary text-lg max-w-2xl mx-auto">
            Six AI-powered tools built specifically for O Level and A Level students.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <TiltCard className="h-full group cursor-pointer">
                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-6 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                  <div className="absolute inset-0 rounded-xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity -z-10" style={{ background: 'inherit' }} />
                </div>
                <h3 className="heading-3 mb-3">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}