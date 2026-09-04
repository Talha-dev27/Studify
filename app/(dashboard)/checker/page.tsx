import { SUBJECTS } from '@/lib/subjects';
import { CheckerClient } from './CheckerClient';

export default function CheckerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-1">AI Checker</h1>
        <p className="text-text-secondary mt-2">Get marked like a real Cambridge examiner.</p>
      </div>
      <CheckerClient subjects={SUBJECTS} />
    </div>
  );
}