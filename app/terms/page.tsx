import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="container-app py-32 max-w-3xl prose prose-invert">
        <h1 className="heading-1 mb-8">Terms of Service</h1>
        <p className="text-text-secondary mb-4">Last updated: {new Date().toDateString()}</p>
        <p>By using Cambridge AI you agree to these terms. We provide AI-powered study tools for Cambridge O/A Level students. Past papers are sourced from publicly available educational resources.</p>
        <h2 className="heading-2 mt-8 mb-4">Subscriptions</h2>
        <p>Paid plans are billed monthly or annually via Stripe. Cancel anytime in Settings.</p>
        <h2 className="heading-2 mt-8 mb-4">AI Output Disclaimer</h2>
        <p>AI-generated content is for educational purposes only. Always verify answers with official Cambridge mark schemes.</p>
      </main>
      <Footer />
    </>
  );
}