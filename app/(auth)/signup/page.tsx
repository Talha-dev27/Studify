import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sparkles } from 'lucide-react';
import { SignupForm } from './SignupForm';

export default function SignupPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-32 pb-16 px-4">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 md:p-10">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-br from-accent-primary to-accent-cyan p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="heading-2 text-center mb-2">Create your account</h1>
            <p className="text-text-secondary text-center mb-8">Free forever. No credit card needed.</p>
            <SignupForm initialPlan={searchParams.plan} />
            <p className="mt-8 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link href="/login" className="text-accent-cyan hover:underline">Log in</Link>
            </p>
            <p className="mt-4 text-xs text-text-muted text-center">
              By signing up you agree to our{' '}
              <Link href="/terms" className="underline">Terms</Link> and{' '}
              <Link href="/privacy" className="underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}