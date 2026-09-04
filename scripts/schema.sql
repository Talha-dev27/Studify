-- =====================================================
-- Cambridge AI Study Platform — Supabase Schema
-- =====================================================

-- USERS / PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  school TEXT,
  country TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free','pro','premium')),
  stripe_customer_id TEXT,
  daily_minutes INT DEFAULT 60,
  weekly_mocks INT DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- SUBJECTS MASTER
CREATE TABLE IF NOT EXISTS subjects (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('O','A','Both')),
  board TEXT DEFAULT 'Cambridge',
  syllabus_url TEXT,
  topics JSONB DEFAULT '[]'::jsonb
);

-- USER SUBJECTS
CREATE TABLE IF NOT EXISTS user_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_code TEXT REFERENCES subjects(code),
  level TEXT NOT NULL CHECK (level IN ('O','A')),
  target_grade TEXT,
  exam_session TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject_code)
);

-- PAST PAPERS
CREATE TABLE IF NOT EXISTS papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code TEXT REFERENCES subjects(code),
  year INT NOT NULL,
  session TEXT NOT NULL CHECK (session IN ('MJ','ON','FM')),
  paper_number TEXT NOT NULL,
  component TEXT,
  total_marks INT,
  duration_minutes INT,
  pdf_url TEXT,
  marking_scheme_url TEXT,
  download_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS papers_subject_year_idx ON papers(subject_code, year);

-- GRADE THRESHOLDS
CREATE TABLE IF NOT EXISTS grade_thresholds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code TEXT REFERENCES subjects(code),
  year INT NOT NULL,
  session TEXT NOT NULL CHECK (session IN ('MJ','ON','FM')),
  paper_number TEXT,
  grade TEXT NOT NULL CHECK (grade IN ('A*','A','B','C','D','E')),
  min_mark INT NOT NULL,
  max_mark INT,
  total_marks INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subject_code, year, session, paper_number, grade)
);

-- AI SOLVER HISTORY
CREATE TABLE IF NOT EXISTS solver_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_code TEXT,
  question_text TEXT,
  question_image_url TEXT,
  solution TEXT,
  tokens_used INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MOCK EXAMS
CREATE TABLE IF NOT EXISTS mocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_code TEXT REFERENCES subjects(code),
  config JSONB,
  questions JSONB,
  answers JSONB,
  score INT,
  total_marks INT,
  estimated_grade TEXT,
  time_taken_seconds INT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI CHECKER HISTORY
CREATE TABLE IF NOT EXISTS checker_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_code TEXT,
  question TEXT,
  student_answer TEXT,
  ai_feedback JSONB,
  marks_awarded INT,
  total_marks INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMMUNITY DIFFICULTY REPORTS
CREATE TABLE IF NOT EXISTS difficulty_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_code TEXT REFERENCES subjects(code),
  session TEXT,
  paper_number TEXT,
  difficulty_rating INT CHECK (difficulty_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject_code, session, paper_number)
);

-- SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USAGE TRACKING (for rate limiting)
CREATE TABLE IF NOT EXISTS usage_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS usage_aiSolves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS usage_aiChecks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE solver_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE mocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE checker_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE difficulty_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_aiSolves ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_aiChecks ENABLE ROW LEVEL SECURITY;

-- Public read for catalog data
DROP POLICY IF EXISTS "Public read subjects" ON subjects;
CREATE POLICY "Public read subjects" ON subjects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth read papers" ON papers;
CREATE POLICY "Auth read papers" ON papers FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Auth read thresholds" ON grade_thresholds;
CREATE POLICY "Auth read thresholds" ON grade_thresholds FOR SELECT TO authenticated USING (true);

-- User-owned tables
DROP POLICY IF EXISTS "Self profile" ON profiles;
CREATE POLICY "Self profile" ON profiles FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Self user_subjects" ON user_subjects;
CREATE POLICY "Self user_subjects" ON user_subjects FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Self solver_history" ON solver_history;
CREATE POLICY "Self solver_history" ON solver_history FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Self mocks" ON mocks;
CREATE POLICY "Self mocks" ON mocks FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Self checker_history" ON checker_history;
CREATE POLICY "Self checker_history" ON checker_history FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Self difficulty_reports" ON difficulty_reports;
CREATE POLICY "Self difficulty_reports" ON difficulty_reports FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Self subscriptions" ON subscriptions;
CREATE POLICY "Self subscriptions" ON subscriptions FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Self usage_papers" ON usage_papers;
CREATE POLICY "Self usage_papers" ON usage_papers FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Self usage_aiSolves" ON usage_aiSolves;
CREATE POLICY "Self usage_aiSolves" ON usage_aiSolves FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Self usage_aiChecks" ON usage_aiChecks;
CREATE POLICY "Self usage_aiChecks" ON usage_aiChecks FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================
-- Create these in Supabase Dashboard > Storage:
--  - "papers" (public read, admin write)
--  - "marking-schemes" (public read, admin write)
--  - "uploads" (authenticated write, owner read)