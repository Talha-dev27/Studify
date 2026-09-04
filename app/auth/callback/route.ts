import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AuthCodeCallback() {
  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession('');
  if (!error) {
    redirect('/dashboard');
  }
  redirect('/login?error=auth');
}