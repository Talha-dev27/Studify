import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="container-app py-32 max-w-3xl prose prose-invert">
        <h1 className="heading-1 mb-8">Privacy Policy</h1>
        <p className="text-text-secondary mb-4">Last updated: {new Date().toDateString()}</p>
        <p>We collect only the data necessary to provide our service: account info (email, name), study history, and payment metadata via Stripe. We do not sell your data.</p>
        <h2 className="heading-2 mt-8 mb-4">Data Storage</h2>
        <p>Your data is stored securely in Supabase (PostgreSQL). Row-level security ensures you can only access your own data.</p>
        <h2 className="heading-2 mt-8 mb-4">Contact</h2>
        <p>For data deletion requests, email hello@example.com.</p>
      </main>
      <Footer />
    </>
  );
}