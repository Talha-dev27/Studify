import { SettingsClient } from './SettingsClient';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: profile }, { data: subjects }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_subjects').select('*').eq('user_id', user.id),
  ]);

  return <SettingsClient profile={profile} userSubjects={subjects ?? []} initialTab={searchParams.tab} user={user} />;
}