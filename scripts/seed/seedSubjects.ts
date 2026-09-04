/**
 * Seed subjects master list into Supabase.
 * Run: npm run seed:subjects
 */
import { createClient } from '@supabase/supabase-js';
import { SUBJECTS } from '../../lib/subjects';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  for (const s of SUBJECTS) {
    const { error } = await supabase.from('subjects').upsert({
      code: s.code,
      name: s.name,
      level: s.level,
      board: s.board,
      topics: s.topics,
    });
    if (error) console.error(`Error upserting ${s.code}:`, error.message);
    else console.log(`✓ ${s.code} — ${s.name}`);
  }
}

main().catch(console.error);
