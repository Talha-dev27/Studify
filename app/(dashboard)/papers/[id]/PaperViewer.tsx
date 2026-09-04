'use client';

import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, Bot } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export function PaperViewer({ pdfUrl, subjectCode }: { pdfUrl: string | null; subjectCode: string }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const router = useRouter();

  if (!pdfUrl) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-text-secondary mb-2">PDF not available for this paper.</p>
        <p className="text-xs text-text-muted">Sample content shown — connect Supabase Storage to view real PDFs.</p>
        <Button className="mt-4" onClick={() => router.push(`/solver?subject=${subjectCode}`)}>
          <Bot className="w-4 h-4" /> Try AI Solver
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
      <div className="glass-card p-4 overflow-auto max-h-[80vh]">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => p - 1)}
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </Button>
          <span className="text-sm text-text-secondary">Page {pageNumber} of {numPages || '—'}</span>
          <Button
            variant="ghost"
            size="sm"
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((p) => p + 1)}
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className="p-12 text-center text-text-secondary">Loading PDF…</div>}
        >
          <Page pageNumber={pageNumber} width={700} renderTextLayer renderAnnotationLayer={false} />
        </Document>
      </div>
      <div className="glass-card p-4 h-fit sticky top-4">
        <h3 className="heading-3 mb-3">AI Helper</h3>
        <p className="text-sm text-text-secondary mb-4">
          Stuck on a question? Use our AI solver to get a step-by-step worked solution.
        </p>
        <Button onClick={() => router.push(`/solver?subject=${subjectCode}`)} className="w-full">
          <Bot className="w-4 h-4" /> Open AI Solver
        </Button>
      </div>
    </div>
  );
}