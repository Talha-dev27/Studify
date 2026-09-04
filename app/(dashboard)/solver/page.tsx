import { SUBJECTS } from '@/lib/subjects';
import { SolverClient } from './SolverClient';

export default function SolverPage({
  searchParams,
}: {
  searchParams: { subject?: string; q?: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-1">AI Solver</h1>
        <p className="text-text-secondary mt-2">Get instant worked solutions with examiner tips.</p>
      </div>
      <SolverClient subjects={SUBJECTS} initialSubject={searchParams.subject} initialQuestion={searchParams.q} />
    </div>
  );
}