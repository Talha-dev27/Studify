'use client';

import Link from 'next/link';
import { Sparkles, Twitter, Instagram, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-accent-primary/10 mt-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent" />
      <div className="container-app mx-auto py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-accent-primary to-accent-cyan p-1.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg">
                Studify<span className="text-gradient">.ai</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm max-w-xs">
              AI-powered past papers, mock exams, and grade insights for Cambridge O & A Level students worldwide.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-accent-primary/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-accent-primary/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-accent-primary/20 transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          <FooterCol title="Product" links={[
            { href: '/#features', label: 'Features' },
            { href: '/#pricing', label: 'Pricing' },
            { href: '/#subjects', label: 'Subjects' },
            { href: '/signup', label: 'Get Started' },
          ]} />

          <FooterCol title="Company" links={[
            { href: '/about', label: 'About' },
            { href: '/blog', label: 'Blog' },
            { href: '/careers', label: 'Careers' },
            { href: '/contact', label: 'Contact' },
          ]} />

          <FooterCol title="Legal" links={[
            { href: '/terms', label: 'Terms' },
            { href: '/privacy', label: 'Privacy' },
            { href: '/cookies', label: 'Cookies' },
          ]} />
        </div>

        <div className="pt-8 border-t border-accent-primary/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <p>© {new Date().getFullYear()} Studify.ai. All rights reserved.</p>
          <p>Not affiliated with Cambridge Assessment International Education.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-text-primary font-semibold mb-4 text-sm uppercase tracking-wider">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-text-secondary hover:text-text-primary text-sm transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}