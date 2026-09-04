'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Download, Eye, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { sessionLabel } from '@/lib/utils';

export function PaperLibrary({ papers, total, subjects }: any) {
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [session, setSession] = useState('');
  const [paper, setPaper] = useState('');

  const years = Array.from({ length: 15 }, (_, i) => 2024 - i);

  return (
    <>
      {/* Filters */}
      <div className="glass-card p-4 sticky top-4 z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input-field text-sm">
            <option value="">All subjects</option>
            {subjects.map((s: any) => (
              <option key={s.code} value={s.code}>{s.code} — {s.name}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="input-field text-sm">
            <option value="">All years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={session} onChange={(e) => setSession(e.target.value)} className="input-field text-sm">
            <option value="">All sessions</option>
            <option value="MJ">May/June</option>
            <option value="ON">Oct/Nov</option>
            <option value="FM">Feb/Mar</option>
          </select>
          <select value={paper} onChange={(e) => setPaper(e.target.value)} className="input-field text-sm">
            <option value="">All papers</option>
            <option value="1">Paper 1</option>
            <option value="2">Paper 2</option>
            <option value="3">Paper 3</option>
            <option value="4">Paper 4</option>
          </select>
          <Link
            href={`/papers?${new URLSearchParams({ ...(subject && { subject }), ...(year && { year }), ...(session && { session }), ...(paper && { paper }) }).toString()}`}
            className="btn-primary text-sm justify-center"
          >
            <Search className="w-4 h-4" /> Search
          </Link>
        </div>
        <p className="text-xs text-text-muted mt-3">{total} papers found</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {papers.map((p: any) => (
          <PaperCard key={p.id} paper={p} />
        ))}
        {papers.length === 0 && (
          <div className="col-span-full glass-card p-12 text-center text-text-secondary">
            No papers found. <Link href="/papers" className="text-accent-cyan">Clear filters</Link>
          </div>
        )}
      </div>
    </>
  );
}

function PaperCard({ paper }: any) {
  return (
    <div className="glass-card p-5 group hover:border-accent-primary/40 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono text-xs text-accent-cyan">{paper.subject_code}</div>
          <h3 className="font-display font-semibold mt-1">{paper.subjectName}</h3>
        </div>
        <Badge>{paper.component ?? 'Theory'}</Badge>
      </div>

      <div className="space-y-1 text-sm text-text-secondary mb-4">
        <div className="flex justify-between">
          <span>Year:</span>
          <span className="text-text-primary">{paper.year}</span>
        </div>
        <div className="flex justify-between">
          <span>Session:</span>
          <span className="text-text-primary">{sessionLabel(paper.session)}</span>
        </div>
        <div className="flex justify-between">
          <span>Paper:</span>
          <span className="text-text-primary">{paper.paper_number}</span>
        </div>
        {paper.total_marks && (
          <div className="flex justify-between">
            <span>Marks:</span>
            <span className="text-text-primary">{paper.total_marks}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {paper.marking_scheme_url && <Badge variant="cyan">MS Available</Badge>}
        <Badge variant="pink">{paper.download_count ?? 0} downloads</Badge>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Link href={`/papers/${paper.id}`}>
          <Button variant="ghost" size="sm" className="w-full">
            <Eye className="w-3 h-3" /> View
          </Button>
        </Link>
        <a href={paper.pdf_url ?? '#'} target="_blank" rel="noreferrer">
          <Button variant="outline" size="sm" className="w-full">
            <Download className="w-3 h-3" /> PDF
          </Button>
        </a>
        <Link href={`/solver?subject=${paper.subject_code}`}>
          <Button variant="primary" size="sm" className="w-full">
            <Bot className="w-3 h-3" /> AI
          </Button>
        </Link>
      </div>
    </div>
  );
}