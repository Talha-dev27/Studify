'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setSent(true);
    setLoading(false);
  }

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
            <h1 className="heading-2 text-center mb-2">Reset your password</h1>
            {sent ? (
              <p className="text-text-secondary text-center mt-4">
                Check your email for a reset link.
              </p>
            ) : (
              <>
                <p className="text-text-secondary text-center mb-8">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
                <form onSubmit={onSubmit} className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    required
                    placeholder="you@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button type="submit" loading={loading} className="w-full">
                    Send reset link
                  </Button>
                </form>
              </>
            )}
            <p className="mt-6 text-center text-sm">
              <Link href="/login" className="text-accent-cyan hover:underline">Back to log in</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}