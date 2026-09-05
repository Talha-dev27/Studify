/**
 * Seed sample past papers and grade thresholds.
 * Replace URLs with real PDFs uploaded to Supabase Storage.
 * Run: npm run seed:papers
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const SAMPLE_PAPERS = [
  // 4024 Mathematics O-Level May/June 2023
  { subject_code: '4024', year: 2023, session: 'MJ', paper_number: '1', component: 'MCQ', total_marks: 40, duration_minutes: 60 },
  { subject_code: '4024', year: 2023, session: 'MJ', paper_number: '2', component: 'Theory', total_marks: 80, duration_minutes: 120 },
  // 5054 Physics
  { subject_code: '5054', year: 2023, session: 'MJ', paper_number: '1', component: 'MCQ', total_marks: 40, duration_minutes: 60 },
  { subject_code: '5054', year: 2023, session: 'MJ', paper_number: '2', component: 'Theory', total_marks: 75, duration_minutes: 105 },
  // 5070 Chemistry
  { subject_code: '5070', year: 2023, session: 'MJ', paper_number: '1', component: 'MCQ', total_marks: 40, duration_minutes: 60 },
  { subject_code: '5070', year: 2023, session: 'MJ', paper_number: '2', component: 'Theory', total_marks: 75, duration_minutes: 105 },
  // 5090 Biology
  { subject_code: '5090', year: 2023, session: 'MJ', paper_number: '1', component: 'MCQ', total_marks: 40, duration_minutes: 60 },
  { subject_code: '5090', year: 2023, session: 'MJ', paper_number: '2', component: 'Theory', total_marks: 75, duration_minutes: 105 },
  // A-Levels
  { subject_code: '9709', year: 2023, session: 'MJ', paper_number: '1', component: 'Pure 1', total_marks: 75, duration_minutes: 105 },
  { subject_code: '9709', year: 2023, session: 'MJ', paper_number: '5', component: 'Mech/Stats', total_marks: 50, duration_minutes: 75 },
  { subject_code: '9702', year: 2023, session: 'MJ', paper_number: '1', component: 'MCQ', total_marks: 40, duration_minutes: 60 },
  { subject_code: '9701', year: 2023, session: 'MJ', paper_number: '1', component: 'MCQ', total_marks: 40, duration_minutes: 60 },
];

async function main() {
  for (const p of SAMPLE_PAPERS) {
    const { error } = await supabase.from('papers').upsert({
      ...p,
      pdf_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/papers/${p.subject_code}_${p.year}_${p.session}_P${p.paper_number}.pdf`,
      marking_scheme_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/marking-schemes/${p.subject_code}_${p.year}_${p.session}_P${p.paper_number}_MS.pdf`,
    });
    if (error) console.error(`Error:`, error.message);
    else console.log(`✓ ${p.subject_code} ${p.year} ${p.session} P${p.paper_number}`);
  }
}

main().catch(console.error);