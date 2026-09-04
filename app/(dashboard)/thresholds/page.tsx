import { SUBJECTS } from '@/lib/subjects';
import { ThresholdsClient } from './ThresholdsClient';

export default function ThresholdsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-1">Grade Threshold Guesser</h1>
        <p className="text-text-secondary mt-2">Predict grade boundaries before results day.</p>
      </div>
      <ThresholdsClient subjects={SUBJECTS} />
    </div>
  );
}