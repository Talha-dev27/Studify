import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="container-app py-32 max-w-2xl">
        <h1 className="heading-1 mb-4">Contact</h1>
        <p className="text-text-secondary mb-8">Questions, bug reports, partnership enquiries?</p>
        <a href="mailto:hello@example.com" className="btn-primary inline-flex">
          <Mail className="w-4 h-4" /> hello@example.com
        </a>
      </main>
      <Footer />
    </>
  );
}