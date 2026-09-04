import { SUBJECTS, getSubject } from '@/lib/subjects';
import { MockMaker } from './MockMaker';

export default function MockPage({
  searchParams,
}: {
  searchParams: { subject?: string; level?: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-1">Mock Maker</h1>
        <p className="text-text-secondary mt-2">Build a custom exam from real past paper questions.</p>
      </div>
      <MockMaker subjects={SUBJECTS} initialSubject={searchParams.subject} initialLevel={(searchParams.level as 'O' | 'A') ?? 'O'} />
    </div>
  );
}