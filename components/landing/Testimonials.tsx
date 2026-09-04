'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

const testimonials = [
  {
    name: 'Aisha K.',
    location: 'Lahore, Pakistan',
    grade: 'A* in Maths',
    rating: 5,
    text: 'The AI solver literally saved me during O Level prep. Every past paper question I struggled with, I could just paste in and get a worked solution in seconds.',
    avatar: 'AK',
    color: 'from-accent-primary to-accent-glow',
  },
  {
    name: 'Marcus T.',
    location: 'London, UK',
    grade: 'A in A-Level Physics',
    rating: 5,
    text: 'Mock Maker is unreal. It builds authentic mocks from real past paper questions and the AI checker marks like a real Cambridge examiner. Went from C to A in 3 months.',
    avatar: 'MT',
    color: 'from-accent-cyan to-accent-primary',
  },
  {
    name: 'Priya S.',
    location: 'Mumbai, India',
    grade: 'A* in Chemistry',
    rating: 5,
    text: 'The threshold guesser predicted my actual grade boundaries within 2 marks. I knew exactly what I needed to score to get an A*. Game changer.',
    avatar: 'PS',
    color: 'from-accent-pink to-accent-primary',
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="section-pad relative">
      <div className="container-app mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">Testimonials</span>
          <h2 className="heading-1">
            Loved by <span className="text-gradient">thousands</span> of students
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <TiltCard className="h-full p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-text-secondary mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-accent-primary/20">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center font-semibold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-text-muted">{t.grade}</div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}