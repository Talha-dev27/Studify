import { callClaude, callClaudeJSON } from './client';

const SOLVER_SYSTEM = `You are an expert Cambridge examiner and tutor specializing in O Level and A Level subjects.
When given a question, provide a complete, step-by-step worked solution that a Cambridge student would understand.

Format your response as STRICT JSON with this exact structure (no markdown, no code fences, just JSON):
{
  "steps": [
    {"number": 1, "explanation": "...", "formula": "...", "result": "..."}
  ],
  "finalAnswer": "...",
  "examinerTips": ["...", "..."],
  "markSchemePoints": ["...", "..."]
}

Use LaTeX notation for math enclosed in $$ for display math and $ for inline.
Be thorough, educational, and match Cambridge marking standards exactly.`;

const CHECKER_SYSTEM = `You are a strict Cambridge examiner marking a student's answer to a question.
Given the question, the student's answer, and total marks available, award marks fairly and provide detailed feedback.

Format your response as STRICT JSON with this exact structure (no markdown, no code fences):
{
  "marksAwarded": <number>,
  "totalMarks": <number>,
  "breakdown": [
    {"point": "...", "awarded": <bool>, "marks": <number>, "feedback": "..."}
  ],
  "overallCommentary": "...",
  "improvements": ["...", "..."],
  "modelAnswer": "..."
}

Be strict but fair. Match real Cambridge marking standards. Award partial credit where appropriate.
Use LaTeX notation for math enclosed in $$ for display math and $ for inline.`;

const MOCK_GENERATOR_SYSTEM = `You are a question setter for Cambridge International Examinations.
Create authentic questions matching Cambridge {level} Level {subject} exam style.

Format your response as STRICT JSON array (no markdown, no code fences):
[
  {
    "number": <int>,
    "type": "mcq" | "short" | "long",
    "marks": <int>,
    "topic": "...",
    "question": "...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correctAnswer": "...",
    "markScheme": ["marking point 1", "marking point 2"]
  }
]

For MCQ include "options". For short/long questions omit "options".
Use LaTeX notation in $...$ for inline and $$...$$ for display math.
Match the Cambridge syllabus precisely. Make questions authentic to past paper style.`;

const THRESHOLD_SYSTEM = `You are an expert Cambridge grade boundary analyst with access to 20+ years of historical threshold data.

Given historical threshold data for {subject} {paper}, predict the grade boundaries for {session}.
Also consider community difficulty reports if provided.

Format your response as STRICT JSON (no markdown, no code fences):
{
  "prediction": {
    "A*": {"min": <num>, "max": <num>, "confidence": "High"|"Medium"|"Low"},
    "A":  {"min": <num>, "max": <num>, "confidence": "..."},
    "B":  {"min": <num>, "max": <num>, "confidence": "..."},
    "C":  {"min": <num>, "max": <num>, "confidence": "..."}
  },
  "reasoning": "...",
  "keyFactors": ["...", "..."]
}`;

const PAPER_GUESSER_SYSTEM = `You are a Cambridge paper pattern analyst with deep expertise in spotting recurring exam question patterns.

Given past paper data for {subject} {level} {component}, predict topic probabilities for {session}.

Format your response as STRICT JSON (no markdown, no code fences):
{
  "topics": [
    {"name": "...", "probability": "High"|"Medium"|"Low"|"Unlikely", "reasoning": "..."}
  ],
  "patterns": ["...", "..."],
  "checklist": ["Revise: ...", "Focus on: ...", "Practice: ..."]
}`;

// === SOLVER ===
export interface SolverStep {
  number: number;
  explanation: string;
  formula?: string;
  result?: string;
}

export interface SolverResponse {
  steps: SolverStep[];
  finalAnswer: string;
  examinerTips: string[];
  markSchemePoints: string[];
}

export async function solveQuestion(params: {
  question: string;
  imageBase64?: string;
  mediaType?: string;
  subjectCode: string;
  level: string;
}): Promise<SolverResponse> {
  const userMessage = `Subject: ${params.subjectCode} (${params.level === 'O' ? 'O Level' : 'A Level'})
Question: ${params.question}

Provide the complete worked solution in the JSON structure specified.`;

  return callClaudeJSON<SolverResponse>(
    SOLVER_SYSTEM,
    userMessage,
    params.imageBase64,
    params.mediaType,
  );
}

// === CHECKER ===
export interface CheckerBreakdown {
  point: string;
  awarded: boolean;
  marks: number;
  feedback: string;
}

export interface CheckerResponse {
  marksAwarded: number;
  totalMarks: number;
  breakdown: CheckerBreakdown[];
  overallCommentary: string;
  improvements: string[];
  modelAnswer: string;
}

export async function checkAnswer(params: {
  question: string;
  studentAnswer: string;
  imageBase64?: string;
  mediaType?: string;
  subjectCode: string;
  totalMarks: number;
  useMarkScheme?: boolean;
}): Promise<CheckerResponse> {
  const userMessage = `Subject: ${params.subjectCode}
Total marks available: ${params.totalMarks}
${params.useMarkScheme ? 'Use the official Cambridge mark scheme if available for this question.' : 'Generate appropriate marking criteria.'}

Question: ${params.question}

Student's Answer: ${params.studentAnswer}

Mark the student's answer according to Cambridge standards and return JSON in the format specified.`;

  return callClaudeJSON<CheckerResponse>(
    CHECKER_SYSTEM,
    userMessage,
    params.imageBase64,
    params.mediaType,
  );
}

// === MOCK GENERATOR ===
export interface MockQuestion {
  number: number;
  type: 'mcq' | 'short' | 'long';
  marks: number;
  topic: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  markScheme: string[];
}

export async function generateMock(params: {
  subjectCode: string;
  level: 'O' | 'A';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed' | 'Exam-Standard';
  topics: string[];
  numberOfQuestions: number;
  paperType: 'MCQ' | 'Theory' | 'Mixed';
}): Promise<MockQuestion[]> {
  const system = MOCK_GENERATOR_SYSTEM
    .replace('{level}', params.level === 'O' ? 'O' : 'A')
    .replace('{subject}', params.subjectCode);

  const userMessage = `Generate ${params.numberOfQuestions} ${params.paperType} questions for ${params.subjectCode} (${params.level} Level).
Difficulty: ${params.difficulty}
Topics to cover: ${params.topics.join(', ')}

Match authentic Cambridge past paper style. Return ONLY the JSON array as specified.`;

  return callClaudeJSON<MockQuestion[]>(system, userMessage);
}

// === THRESHOLD GUESSER ===
export interface ThresholdPrediction {
  A_star?: { min: number; max: number; confidence: string };
  'A*'?: { min: number; max: number; confidence: string };
  A?: { min: number; max: number; confidence: string };
  B?: { min: number; max: number; confidence: string };
  C?: { min: number; max: number; confidence: string };
  D?: { min: number; max: number; confidence: string };
  E?: { min: number; max: number; confidence: string };
}

export interface ThresholdResponse {
  prediction: ThresholdPrediction;
  reasoning: string;
  keyFactors: string[];
}

export async function predictThresholds(params: {
  subjectCode: string;
  paperNumber: string;
  session: string;
  historical: Array<{ year: number; thresholds: Record<string, number> }>;
  communityDifficulty?: number;
}): Promise<ThresholdResponse> {
  const system = THRESHOLD_SYSTEM
    .replace('{subject}', params.subjectCode)
    .replace('{paper}', params.paperNumber)
    .replace('{session}', params.session);

  const userMessage = `Subject: ${params.subjectCode} ${params.paperNumber}
Session: ${params.session}
${params.communityDifficulty ? `Community difficulty rating (1=easy, 5=hard): ${params.communityDifficulty}/5` : ''}

Historical threshold data (year: A*, A, B, C, D, E minimum marks):
${JSON.stringify(params.historical, null, 2)}

Predict the grade boundaries for this session. Return STRICT JSON only.`;

  return callClaudeJSON<ThresholdResponse>(system, userMessage);
}

// === PAPER GUESSER ===
export interface TopicPrediction {
  name: string;
  probability: 'High' | 'Medium' | 'Low' | 'Unlikely';
  reasoning: string;
}

export interface PaperPrediction {
  topics: TopicPrediction[];
  patterns: string[];
  checklist: string[];
}

export async function predictPaper(params: {
  subjectCode: string;
  level: 'O' | 'A';
  session: string;
  component: string;
  syllabusTopics: string[];
  pastAppearances?: Array<{ year: number; session: string; topics: string[] }>;
}): Promise<PaperPrediction> {
  const system = PAPER_GUESSER_SYSTEM
    .replace('{subject}', params.subjectCode)
    .replace('{level}', params.level)
    .replace('{component}', params.component);

  const userMessage = `Subject: ${params.subjectCode} (${params.level} Level)
Session: ${params.session}
Component: ${params.component}

Syllabus topics to analyze: ${JSON.stringify(params.syllabusTopics)}

${params.pastAppearances ? `Past paper topic appearances:\n${JSON.stringify(params.pastAppearances, null, 2)}` : ''}

Predict topic probabilities and patterns. Return STRICT JSON only.`;

  return callClaudeJSON<PaperPrediction>(system, userMessage);
}

export { callClaude };