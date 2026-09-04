import { SUBJECTS } from '@/lib/subjects';
import { PredictClient } from './PredictClient';

export default function PredictPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-1">Paper Guesser</h1>
        <p className="text-text-secondary mt-2">AI predicts upcoming exam topics from past patterns.</p>
      </div>
      <PredictClient subjects={SUBJECTS} />
    </div>
  );
}