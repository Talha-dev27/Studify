import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/server';
import { getSubject } from '@/lib/subjects';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { ArrowLeft, Download, FileText } from 'lucide-react';

const PaperViewer = dynamic(() => import('./PaperViewer').then(m => m.PaperViewer), { ssr: false });

export default async function PaperViewPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: paper } = await supabase.from('papers').select('*').eq('id', params.id).single();
  if (!paper) notFound();

  const subject = getSubject(paper.subject_code);

  return (
    <div className="space-y-4">
      <Link href="/papers" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="w-4 h-4" /> Back to papers
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-2">{subject?.name ?? paper.subject_code}</h1>
          <p className="text-text-secondary mt-1">
            Paper {paper.paper_number} · {sessionLabel(paper.session)} {paper.year} · {paper.total_marks ?? '—'} marks
          </p>
        </div>
        <div className="flex gap-2">
          <a href={paper.pdf_url ?? '#'} target="_blank" rel="noreferrer">
            <Button variant="outline">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </a>
          <Link href={`/mock?subject=${paper.subject_code}&level=${subject?.level === 'A' ? 'A' : 'O'}`}>
            <Button variant="primary">
              <FileText className="w-4 h-4" /> Take as Mock
            </Button>
          </Link>
        </div>
      </div>

      <PaperViewer pdfUrl={paper.pdf_url} subjectCode={paper.subject_code} />
    </div>
  );
}

function sessionLabel(s: string) {
  return s === 'MJ' ? 'May/June' : s === 'ON' ? 'Oct/Nov' : 'Feb/Mar';
}