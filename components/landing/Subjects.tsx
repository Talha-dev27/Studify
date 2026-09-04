'use client';

import { motion } from 'framer-motion';
import { SUBJECTS } from '@/lib/subjects';
import { TiltCard } from '@/components/ui/TiltCard';
import { Badge } from '@/components/ui/Badge';

export function Subjects() {
  const oLevel = SUBJECTS.filter(s => s.level === 'O');
  const aLevel = SUBJECTS.filter(s => s.level === 'A');

  return (
    <section id="subjects" className="section-pad relative">
      <div className="container-app mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">Subjects</span>
          <h2 className="heading-1">
            Every Cambridge <span className="text-gradient">subject</span>
          </h2>
          <p className="mt-4 text-text-secondary">From Maths to Law, we&apos;ve got your back.</p>
        </motion.div>

        <div className="mb-12">
          <h3 className="heading-3 mb-6 text-text-secondary">O Level</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {oLevel.map((s, i) => (
              <SubjectCard key={s.code} subject={s} delay={i * 0.03} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="heading-3 mb-6 text-text-secondary">A Level</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {aLevel.map((s, i) => (
              <SubjectCard key={s.code} subject={s} delay={i * 0.03} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SubjectCard({ subject, delay }: { subject: any; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <TiltCard className="p-4 cursor-pointer group" tiltMax={8}>
        <div className="flex items-start justify-between mb-2">
          <span className="font-mono text-xs text-accent-cyan">{subject.code}</span>
          <Badge variant="cyan">{subject.level} Level</Badge>
        </div>
        <h4 className="font-display font-semibold text-base mb-2">{subject.name}</h4>
        <p className="text-xs text-text-muted">{subject.topics.length} topics</p>
        <div className="mt-3 pt-3 border-t border-accent-primary/10 text-xs text-text-secondary">
          {Math.floor(Math.random() * 80) + 30} papers
        </div>
      </TiltCard>
    </motion.div>
  );
}