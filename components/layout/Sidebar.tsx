'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, BookOpen, Bot, FileText, CheckCircle, TrendingUp, Eye,
  Settings, Sparkles, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/papers', label: 'Past Papers', icon: BookOpen },
  { href: '/solver', label: 'AI Solver', icon: Bot },
  { href: '/mock', label: 'Mock Maker', icon: FileText },
  { href: '/checker', label: 'AI Checker', icon: CheckCircle },
  { href: '/thresholds', label: 'Grade Tracker', icon: TrendingUp },
  { href: '/predict', label: 'Predictions', icon: Eye },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 z-40 bg-bg-secondary/50 backdrop-blur-xl border-r border-accent-primary/10 hidden lg:block">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-accent-primary to-accent-cyan p-1.5 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg">
            Studify<span className="text-gradient">.ai</span>
          </span>
        </Link>
      </div>

      <nav className="px-3 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                active
                  ? 'bg-accent-primary/15 text-text-primary border border-accent-primary/30'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]',
              )}
            >
              <item.icon className={cn('w-4 h-4', active && 'text-accent-cyan')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors w-full px-3 py-2 rounded-lg hover:bg-white/[0.04]"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}

export function MobileHeader() {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-bg-secondary/80 backdrop-blur-xl border-b border-accent-primary/10 px-4 py-3 flex items-center justify-between">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="bg-gradient-to-br from-accent-primary to-accent-cyan p-1.5 rounded-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-bold">Studify.ai</span>
      </Link>
      <Link href="/settings" className="p-2 rounded-lg hover:bg-accent-primary/10">
        <Settings className="w-5 h-5" />
      </Link>
    </div>
  );
}