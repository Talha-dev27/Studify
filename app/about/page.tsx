import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="container-app py-32 max-w-3xl">
        <h1 className="heading-1 mb-6">About Cambridge AI</h1>
        <p className="text-text-secondary text-lg mb-6">
          We&apos;re building the most advanced AI-powered study platform for Cambridge O Level and A Level students worldwide.
        </p>
        <p className="text-text-secondary mb-6">
          Our tools combine official past papers, expert AI tutoring, and pattern analysis to give every student an unfair advantage — at a price that&apos;s actually fair.
        </p>
        <p className="text-text-muted text-sm">
          Cambridge AI is not affiliated with Cambridge Assessment International Education. All past paper materials are sourced from publicly available educational resources.
        </p>
      </main>
      <Footer />
    </>
  );
}