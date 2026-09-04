/**
 * Seed historical grade thresholds.
 * Source: Cambridge Assessment published grade boundaries.
 * Run: npm run seed:thresholds
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const SAMPLE_THRESHOLDS = [
  // 4024 Maths O-Level — Paper 2 (out of 80)
  { subject_code: '4024', year: 2018, session: 'MJ', paper_number: '2', grade: 'A*', min_mark: 68 },
  { subject_code: '4024', year: 2018, session: 'MJ', paper_number: '2', grade: 'A', min_mark: 54 },
  { subject_code: '4024', year: 2018, session: 'MJ', paper_number: '2', grade: 'B', min_mark: 42 },
  { subject_code: '4024', year: 2018, session: 'MJ', paper_number: '2', grade: 'C', min_mark: 30 },
  { subject_code: '4024', year: 2018, session: 'MJ', paper_number: '2', grade: 'D', min_mark: 20 },
  { subject_code: '4024', year: 2018, session: 'MJ', paper_number: '2', grade: 'E', min_mark: 12 },
  { subject_code: '4024', year: 2019, session: 'MJ', paper_number: '2', grade: 'A*', min_mark: 70 },
  { subject_code: '4024', year: 2019, session: 'MJ', paper_number: '2', grade: 'A', min_mark: 56 },
  { subject_code: '4024', year: 2019, session: 'MJ', paper_number: '2', grade: 'B', min_mark: 44 },
  { subject_code: '4024', year: 2019, session: 'MJ', paper_number: '2', grade: 'C', min_mark: 32 },
  { subject_code: '4024', year: 2019, session: 'MJ', paper_number: '2', grade: 'D', min_mark: 21 },
  { subject_code: '4024', year: 2019, session: 'MJ', paper_number: '2', grade: 'E', min_mark: 12 },
  { subject_code: '4024', year: 2022, session: 'MJ', paper_number: '2', grade: 'A*', min_mark: 67 },
  { subject_code: '4024', year: 2022, session: 'MJ', paper_number: '2', grade: 'A', min_mark: 53 },
  { subject_code: '4024', year: 2022, session: 'MJ', paper_number: '2', grade: 'B', min_mark: 41 },
  { subject_code: '4024', year: 2022, session: 'MJ', paper_number: '2', grade: 'C', min_mark: 29 },
  { subject_code: '4024', year: 2022, session: 'MJ', paper_number: '2', grade: 'D', min_mark: 19 },
  { subject_code: '4024', year: 2022, session: 'MJ', paper_number: '2', grade: 'E', min_mark: 11 },
  { subject_code: '4024', year: 2023, session: 'MJ', paper_number: '2', grade: 'A*', min_mark: 69 },
  { subject_code: '4024', year: 2023, session: 'MJ', paper_number: '2', grade: 'A', min_mark: 55 },
  { subject_code: '4024', year: 2023, session: 'MJ', paper_number: '2', grade: 'B', min_mark: 43 },
  { subject_code: '4024', year: 2023, session: 'MJ', paper_number: '2', grade: 'C', min_mark: 31 },
  { subject_code: '4024', year: 2023, session: 'MJ', paper_number: '2', grade: 'D', min_mark: 20 },
  { subject_code: '4024', year: 2023, session: 'MJ', paper_number: '2', grade: 'E', min_mark: 12 },
  // Add more for all subjects as you gather data
];

async function main() {
  for (const t of SAMPLE_THRESHOLDS) {
    const { error } = await supabase.from('grade_thresholds').upsert({
      ...t,
      total_marks: 80,
    });
    if (error) console.error(`Error:`, error.message);
    else console.log(`✓ ${t.subject_code} ${t.year} ${t.grade}`);
  }
  console.log('\nDone. Add more historical data from cambridgeinternational.org');
}

main().catch(console.error);