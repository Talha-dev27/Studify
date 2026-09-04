import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-32">
        <div className="text-center max-w-md">
          <p className="font-mono text-accent-cyan text-sm mb-4">404</p>
          <h1 className="heading-1 mb-4">Lost in space</h1>
          <p className="text-text-secondary mb-8">The page you&apos;re looking for has drifted away.</p>
          <Link href="/" className="btn-primary">Back to home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}