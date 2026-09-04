export interface Subject {
  code: string;
  name: string;
  level: 'O' | 'A' | 'Both';
  board: string;
  syllabus_url?: string;
  topics: string[];
}

export const SUBJECTS: Subject[] = [
  // O Level
  { code: '4024', name: 'Mathematics', level: 'O', board: 'Cambridge', topics: ['Algebra', 'Geometry', 'Trigonometry', 'Statistics', 'Probability', 'Number', 'Mensuration', 'Functions'] },
  { code: '4037', name: 'Additional Mathematics', level: 'O', board: 'Cambridge', topics: ['Functions', 'Polynomials', 'Logarithms', 'Trigonometry', 'Coordinate Geometry', 'Vectors', 'Matrices'] },
  { code: '5054', name: 'Physics', level: 'O', board: 'Cambridge', topics: ['Motion', 'Forces', 'Energy', 'Waves', 'Electricity', 'Magnetism', 'Thermal Physics', 'Atomic Physics'] },
  { code: '5070', name: 'Chemistry', level: 'O', board: 'Cambridge', topics: ['Atomic Structure', 'Bonding', 'Acids & Bases', 'Reactivity', 'Organic Chemistry', 'Electrochemistry', 'Rates'] },
  { code: '5090', name: 'Biology', level: 'O', board: 'Cambridge', topics: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Plant Biology', 'Evolution', 'Disease'] },
  { code: '5129', name: 'Combined Science', level: 'O', board: 'Cambridge', topics: ['Biology Core', 'Chemistry Core', 'Physics Core'] },
  { code: '1123', name: 'English Language', level: 'O', board: 'Cambridge', topics: ['Reading', 'Writing', 'Grammar', 'Comprehension', 'Summary', 'Composition'] },
  { code: '2010', name: 'English Literature', level: 'O', board: 'Cambridge', topics: ['Prose', 'Poetry', 'Drama', 'Set Texts', 'Unseen'] },
  { code: '2281', name: 'Economics', level: 'O', board: 'Cambridge', topics: ['Demand & Supply', 'Market Failure', 'Macroeconomics', 'International Trade', 'Money & Banking'] },
  { code: '7115', name: 'Business Studies', level: 'O', board: 'Cambridge', topics: ['Business Activity', 'Marketing', 'Finance', 'Operations', 'Human Resources'] },
  { code: '2210', name: 'Computer Science', level: 'O', board: 'Cambridge', topics: ['Algorithms', 'Programming', 'Data Representation', 'Networks', 'Security'] },
  { code: '2058', name: 'Islamiyat', level: 'O', board: 'Cambridge', topics: ['Quran', 'Hadith', 'Fiqh', 'History', 'Akhlaq'] },
  { code: '2059', name: 'Pakistan Studies', level: 'O', board: 'Cambridge', topics: ['History', 'Geography', 'Culture', 'Economy'] },
  { code: '3248', name: 'Urdu', level: 'O', board: 'Cambridge', topics: ['Reading', 'Writing', 'Grammar', 'Comprehension', 'Composition'] },
  { code: '2217', name: 'Geography', level: 'O', board: 'Cambridge', topics: ['Population', 'Settlement', 'Natural Environments', 'Economic Activity', 'Resources'] },
  { code: '2147', name: 'History', level: 'O', board: 'Cambridge', topics: ['Medieval', 'Modern', 'International Relations', '20th Century'] },
  { code: '7707', name: 'Accounting', level: 'O', board: 'Cambridge', topics: ['Double Entry', 'Financial Statements', 'Ratio Analysis', 'Verification', 'Company Accounts'] },

  // A Level
  { code: '9709', name: 'Mathematics', level: 'A', board: 'Cambridge', topics: ['Pure 1', 'Pure 2', 'Pure 3', 'Mechanics', 'Probability & Statistics 1', 'Probability & Statistics 2'] },
  { code: '9231', name: 'Further Mathematics', level: 'A', board: 'Cambridge', topics: ['Complex Numbers', 'Matrices', 'Hyperbolic Functions', 'Polar Coordinates', 'Differential Equations'] },
  { code: '9702', name: 'Physics', level: 'A', board: 'Cambridge', topics: ['Mechanics', 'Waves', 'Electricity', 'Modern Physics', 'Thermal', 'Fields'] },
  { code: '9701', name: 'Chemistry', level: 'A', board: 'Cambridge', topics: ['Atomic Structure', 'Bonding', 'Energetics', 'Equilibria', 'Organic Chemistry', 'Kinetics'] },
  { code: '9700', name: 'Biology', level: 'A', board: 'Cambridge', topics: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Physiology', 'Biochemistry'] },
  { code: '9708', name: 'Economics', level: 'A', board: 'Cambridge', topics: ['Microeconomics', 'Macroeconomics', 'International Trade', 'Development', 'Money'] },
  { code: '9609', name: 'Business', level: 'A', board: 'Cambridge', topics: ['Strategy', 'Marketing', 'Finance', 'Operations', 'HRM', 'Ethics'] },
  { code: '9618', name: 'Computer Science', level: 'A', board: 'Cambridge', topics: ['Algorithms', 'Data Structures', 'OOP', 'Networking', 'Databases', 'Theory of Computation'] },
  { code: '9093', name: 'English Language', level: 'A', board: 'Cambridge', topics: ['Reading', 'Writing', 'Language Analysis', 'Text Transformation'] },
  { code: '9695', name: 'English Literature', level: 'A', board: 'Cambridge', topics: ['Drama', 'Poetry', 'Prose', 'Set Texts'] },
  { code: '9990', name: 'Psychology', level: 'A', board: 'Cambridge', topics: ['Cognitive', 'Social', 'Biological', 'Learning', 'Abnormality'] },
  { code: '9699', name: 'Sociology', level: 'A', board: 'Cambridge', topics: ['Family', 'Education', 'Crime', 'Media', 'Religion', 'Theory'] },
  { code: '9696', name: 'Geography', level: 'A', board: 'Cambridge', topics: ['Hydrology', 'Atmosphere', 'Population', 'Settlement', 'Development'] },
  { code: '9489', name: 'History', level: 'A', board: 'Cambridge', topics: ['Modern Europe', 'Asia', 'Americas', 'Africa', 'International Relations'] },
  { code: '9706', name: 'Accounting', level: 'A', board: 'Cambridge', topics: ['Financial Statements', 'Business Finance', 'Ratio Analysis', 'Cash Flow', 'Investment Appraisal'] },
  { code: '9084', name: 'Law', level: 'A', board: 'Cambridge', topics: ['Contract', 'Tort', 'Criminal', 'Constitutional', 'Human Rights'] },
];

export function getSubjectsByLevel(level: 'O' | 'A') {
  return SUBJECTS.filter(s => s.level === level || s.level === 'Both');
}

export function getSubject(code: string) {
  return SUBJECTS.find(s => s.code === code);
}