export type Plan = 'free' | 'pro' | 'premium';

export interface Profile {
  id: string;
  name: string | null;
  school: string | null;
  country: string | null;
  avatar_url: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  created_at: string;
}

export interface UserSubject {
  id: string;
  user_id: string;
  subject_code: string;
  level: 'O' | 'A';
  target_grade: string | null;
  exam_session: string | null;
  created_at: string;
}

export interface Paper {
  id: string;
  subject_code: string;
  year: number;
  session: 'MJ' | 'ON' | 'FM';
  paper_number: string;
  component: string | null;
  total_marks: number | null;
  duration_minutes: number | null;
  pdf_url: string | null;
  marking_scheme_url: string | null;
  download_count: number;
  created_at: string;
}

export interface GradeThreshold {
  id: string;
  subject_code: string;
  year: number;
  session: 'MJ' | 'ON' | 'FM';
  paper_number: string | null;
  grade: 'A*' | 'A' | 'B' | 'C' | 'D' | 'E';
  min_mark: number;
  max_mark: number | null;
  total_marks: number | null;
  created_at: string;
}

export interface SolverHistory {
  id: string;
  user_id: string;
  subject_code: string | null;
  question_text: string;
  question_image_url: string | null;
  solution: string;
  tokens_used: number | null;
  created_at: string;
}

export interface Mock {
  id: string;
  user_id: string;
  subject_code: string;
  config: Record<string, any>;
  questions: any[];
  answers: Record<string, any> | null;
  score: number | null;
  total_marks: number | null;
  estimated_grade: string | null;
  time_taken_seconds: number | null;
  completed_at: string | null;
  created_at: string;
}

export interface CheckerHistory {
  id: string;
  user_id: string;
  subject_code: string | null;
  question: string;
  student_answer: string;
  ai_feedback: Record<string, any>;
  marks_awarded: number | null;
  total_marks: number | null;
  created_at: string;
}

export interface DifficultyReport {
  id: string;
  user_id: string;
  subject_code: string;
  session: string;
  paper_number: string;
  difficulty_rating: number;
  created_at: string;
}