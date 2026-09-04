import { NextResponse } from 'next/server';
import { SUBJECTS } from '@/lib/subjects';

export async function GET() {
  return NextResponse.json({ subjects: SUBJECTS });
}