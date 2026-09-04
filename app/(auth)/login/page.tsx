import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles } from 'lucide-react';
import { LoginForm } from './LoginForm';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
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
            <h1 className="heading-2 text-center mb-2">Welcome back</h1>
            <p className="text-text-secondary text-center mb-8">Log in to your Cambridge AI account</p>

            <LoginForm redirect={searchParams.redirect} />

            <p className="mt-8 text-center text-sm text-text-secondary">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-accent-cyan hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}