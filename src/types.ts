export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  template: 'classic' | 'modern' | 'minimal';
}

export const emptyResume: ResumeData = {
  fullName: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  experience: [],
  education: [],
  skills: [],
  template: 'modern',
};

export interface AtsResult {
  score: number;
  breakdown: { label: string; points: number; max: number; note: string }[];
  suggestions: string[];
}
