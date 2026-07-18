export interface GenerateInput {
  fullName: string;
  title: string;
  yearsExperience: string;
  targetRole: string;
  background: string;
}

export interface GenerateOutput {
  summary: string;
  bullets: string[];
  skills: string[];
}

const API_BASE_URL = 'https://backend-pi-blue-57.vercel.app';

export async function generateResumeContent(input: GenerateInput): Promise<GenerateOutput> {
  const res = await fetch(`${API_BASE_URL}/api/resume/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Generation failed (${res.status})`);
  }

  return res.json();
}
