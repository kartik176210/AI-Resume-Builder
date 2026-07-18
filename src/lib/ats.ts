import type { AtsResult, ResumeData } from '../types';

const ACTION_VERBS = [
  'led', 'built', 'created', 'managed', 'designed', 'launched', 'improved',
  'increased', 'reduced', 'developed', 'implemented', 'drove', 'delivered',
  'shipped', 'optimized', 'automated', 'scaled', 'owned', 'coordinated',
  'analyzed', 'negotiated', 'mentored',
];

function resumeToText(r: ResumeData): string {
  return [
    r.fullName,
    r.title,
    r.summary,
    ...r.experience.flatMap((e) => [e.role, e.company, ...e.bullets]),
    ...r.education.map((e) => `${e.degree} ${e.school}`),
    r.skills.join(' '),
  ]
    .join(' ')
    .toLowerCase();
}

export function scoreResume(resume: ResumeData, jobDescription = ''): AtsResult {
  const breakdown: AtsResult['breakdown'] = [];
  const suggestions: string[] = [];
  const text = resumeToText(resume);

  // 1. Contact completeness (15 pts)
  let contactPts = 0;
  if (resume.email) contactPts += 5;
  if (resume.phone) contactPts += 5;
  if (resume.location) contactPts += 5;
  breakdown.push({ label: 'Contact info', points: contactPts, max: 15, note: 'Email, phone, and location present' });
  if (contactPts < 15) suggestions.push('Add a phone number and location so recruiters and ATS parsers can find your contact details.');

  // 2. Summary present & sized (10 pts)
  let summaryPts = 0;
  if (resume.summary.length > 40) summaryPts = 10;
  else if (resume.summary.length > 0) summaryPts = 5;
  breakdown.push({ label: 'Summary', points: summaryPts, max: 10, note: 'A 2-3 sentence professional summary' });
  if (summaryPts < 10) suggestions.push('Write a 2–3 sentence summary that states your role, years of experience, and top strength.');

  // 3. Quantified achievements (20 pts)
  const numberMatches = resume.experience.flatMap((e) => e.bullets).filter((b) => /\d/.test(b));
  const quantPts = Math.min(20, numberMatches.length * 5);
  breakdown.push({ label: 'Quantified impact', points: quantPts, max: 20, note: 'Bullets with numbers, %, or metrics' });
  if (quantPts < 20) suggestions.push('Add numbers to your bullet points (e.g. "reduced load time by 40%") — ATS and recruiters both weight quantified results heavily.');

  // 4. Action verbs (15 pts)
  const allBullets = resume.experience.flatMap((e) => e.bullets.map((b) => b.toLowerCase()));
  const verbHits = allBullets.filter((b) => ACTION_VERBS.some((v) => b.trim().startsWith(v))).length;
  const verbPts = allBullets.length ? Math.min(15, Math.round((verbHits / allBullets.length) * 15)) : 0;
  breakdown.push({ label: 'Action verbs', points: verbPts, max: 15, note: 'Bullets starting with a strong action verb' });
  if (verbPts < 15) suggestions.push('Start each bullet with a strong action verb (Led, Built, Increased) instead of "Responsible for".');

  // 5. Skills section (10 pts)
  const skillsPts = Math.min(10, resume.skills.length * 2);
  breakdown.push({ label: 'Skills list', points: skillsPts, max: 10, note: 'Relevant hard skills / tools listed' });
  if (skillsPts < 10) suggestions.push('List at least 5 relevant hard skills or tools — ATS keyword matching relies on this section.');

  // 6. Length / completeness (10 pts)
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  let lengthPts = 0;
  if (wordCount > 150 && wordCount < 700) lengthPts = 10;
  else if (wordCount >= 700) lengthPts = 6;
  else if (wordCount > 60) lengthPts = 5;
  breakdown.push({ label: 'Resume length', points: lengthPts, max: 10, note: 'Neither too thin nor too long' });
  if (lengthPts < 10 && wordCount <= 150) suggestions.push('Your resume looks thin — add more detail to your experience bullets.');
  if (lengthPts < 10 && wordCount >= 700) suggestions.push('Your resume is long for ATS parsing — trim to the most relevant 1-2 pages.');

  // 7. Job description keyword match (20 pts) — only if a JD was pasted
  let jdPts = 0;
  const jdWords = jobDescription
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((w) => w.length > 3);
  const uniqueJdWords = Array.from(new Set(jdWords));
  if (uniqueJdWords.length > 0) {
    const matched = uniqueJdWords.filter((w) => text.includes(w));
    const ratio = matched.length / uniqueJdWords.length;
    jdPts = Math.round(ratio * 20);
    breakdown.push({ label: 'Job description match', points: jdPts, max: 20, note: `${matched.length}/${uniqueJdWords.length} key terms found` });
    if (ratio < 0.5) suggestions.push('Mirror more keywords from the job description in your summary and skills section.');
  } else {
    breakdown.push({ label: 'Job description match', points: 0, max: 20, note: 'Paste a job description to score keyword match' });
  }

  const score = breakdown.reduce((sum, b) => sum + b.points, 0);
  return { score, breakdown, suggestions };
}
