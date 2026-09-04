import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const POSTS = [
  { title: 'How to use AI to study for O Levels', date: '2025-09-01', excerpt: 'A practical guide to using AI tools effectively.' },
  { title: 'Top 10 past paper mistakes', date: '2025-08-15', excerpt: 'Avoid these common pitfalls when practising past papers.' },
  { title: 'Understanding grade thresholds', date: '2025-08-01', excerpt: 'How Cambridge sets grade boundaries and what it means for you.' },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="container-app py-32 max-w-4xl">
        <h1 className="heading-1 mb-12">Blog</h1>
        <div className="space-y-6">
          {POSTS.map((p) => (
            <article key={p.title} className="glass-card p-6">
              <p className="text-xs text-text-muted mb-2">{p.date}</p>
              <h2 className="heading-3 mb-2">{p.title}</h2>
              <p className="text-text-secondary">{p.excerpt}</p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}