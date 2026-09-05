import { redirect } from 'next/navigation';
import { Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import ResetPasswordForm from './ResetPasswordForm';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const supabase = createClient();

  if (searchParams.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(searchParams.code);
    if (error) {
      redirect('/forgot-password');
    }
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/forgot-password');
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-32 pb-16 px-4">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 md:p-10">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-br from-accent-primary to-accent-cyan p-2 rounded-xl">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="heading-2 text-center mb-2">Set new password</h1>
            <p className="text-text-secondary text-center mb-8">
              Enter a new password for your account.
            </p>
            <ResetPasswordForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
