'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/#features', label: 'Features' },
    { href: '/#subjects', label: 'Subjects' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#testimonials', label: 'Reviews' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="container-app mx-auto">
        <div className="glass-card flex items-center justify-between px-6 py-3 rounded-2xl">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-primary/40 blur-md rounded-lg" />
              <div className="relative bg-gradient-to-br from-accent-primary to-accent-cyan p-1.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Studify<span className="text-gradient">.ai</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm text-text-secondary hover:text-text-primary transition-colors relative',
                  pathname === link.href && 'text-text-primary',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary">
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-br from-accent-primary to-accent-glow hover:shadow-glow transition-all"
            >
              Sign up free
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-accent-primary/10"
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden glass-card mt-2 p-4 rounded-2xl flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-text-secondary hover:text-text-primary py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-accent-primary/20 pt-3 flex flex-col gap-2">
              <Link href="/login" className="text-text-secondary py-2">Log in</Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-br from-accent-primary to-accent-glow"
              >
                Sign up free
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}