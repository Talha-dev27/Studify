'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Choose your subject',
    description: 'Pick from all 33+ Cambridge O & A Level subjects across sciences, humanities, and languages.',
  },
  {
    number: '02',
    title: 'Practice with past papers',
    description: 'Solve questions yourself, or get instant AI solutions with step-by-step explanations.',
  },
  {
    number: '03',
    title: 'Track your grade',
    description: 'Take mocks, get checked, and predict your actual grade with our AI threshold analyser.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-pad relative">
      <div className="container-app mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="badge mb-4">How it works</span>
          <h2 className="heading-1">
            Three steps. <span className="text-gradient">One platform.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-accent-primary via-accent-cyan to-accent-pink opacity-30" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="relative"
            >
              <div className="glass-card p-8 text-center h-full">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-accent-primary/30 blur-2xl rounded-full" />
                  <div className="relative text-6xl font-display font-bold text-gradient data-mono">
                    {step.number}
                  </div>
                </div>
                <h3 className="heading-3 mb-3">{step.title}</h3>
                <p className="text-text-secondary">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}