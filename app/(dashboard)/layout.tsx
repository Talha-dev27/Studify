import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar, MobileHeader } from '@/components/layout/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <MobileHeader />
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="container-app py-8">{children}</div>
      </main>
    </div>
  );
}