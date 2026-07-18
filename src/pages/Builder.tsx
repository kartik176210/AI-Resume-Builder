import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUser, logout } from '../lib/auth';
import { emptyResume, type ResumeData, type ExperienceEntry, type EducationEntry } from '../types';
import { generateResumeContent } from '../lib/api';
import { scoreResume } from '../lib/ats';
import TemplateRenderer from '../templates/TemplateRenderer';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function storageKey(email: string) {
  return `resumeai_resume_${email}`;
}

export default function Builder() {
  const navigate = useNavigate();
  const user = currentUser();
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const [resume, setResume] = useState<ResumeData>(() => {
    if (!user) return emptyResume;
    try {
      const saved = localStorage.getItem(storageKey(user.email));
      return saved ? JSON.parse(saved) : { ...emptyResume, fullName: user.name, email: user.email };
    } catch {
      return emptyResume;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(storageKey(user.email), JSON.stringify(resume));
  }, [resume, user]);

  // --- AI generation state ---
  const [aiInputs, setAiInputs] = useState({ yearsExperience: '3', targetRole: '', background: '' });
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  async function handleGenerate() {
    setGenerating(true);
    setGenError('');
    try {
      const result = await generateResumeContent({
        fullName: resume.fullName,
        title: resume.title,
        yearsExperience: aiInputs.yearsExperience,
        targetRole: aiInputs.targetRole,
        background: aiInputs.background,
      });
      setResume((r) => ({
        ...r,
        summary: result.summary || r.summary,
        skills: result.skills.length ? result.skills : r.skills,
        experience:
          r.experience.length > 0
            ? [{ ...r.experience[0], bullets: result.bullets.length ? result.bullets : r.experience[0].bullets }, ...r.experience.slice(1)]
            : [{ id: uid(), role: aiInputs.targetRole || r.title, company: '', start: '', end: '', bullets: result.bullets }],
      }));
    } catch (e) {
      setGenError(e instanceof Error ? e.message : 'Generation failed.');
    } finally {
      setGenerating(false);
    }
  }

  // --- ATS state ---
  const [jobDescription, setJobDescription] = useState('');
  const [showAts, setShowAts] = useState(false);
  const ats = scoreResume(resume, jobDescription);

  // --- PDF export ---
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  async function handleExportPdf() {
    if (!previewRef.current) return;
    setExporting(true);
    setExportError('');
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        onclone: (documentClone) => {
          documentClone.querySelector('[data-resume-preview]')?.classList.add('pdf-capture');
        },
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = canvas.height / canvas.width;
      const imgWidth = pageWidth;
      const imgHeight = imgWidth * imgRatio;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // paginate tall resumes
        let renderedHeight = 0;
        const pxPerPt = canvas.width / pageWidth;
        const pageHeightPx = pageHeight * pxPerPt;
        while (renderedHeight < canvas.height) {
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = Math.min(pageHeightPx, canvas.height - renderedHeight);
          const ctx = sliceCanvas.getContext('2d');
          ctx?.drawImage(canvas, 0, -renderedHeight);
          const sliceData = sliceCanvas.toDataURL('image/png');
          if (renderedHeight > 0) pdf.addPage();
          pdf.addImage(sliceData, 'PNG', 0, 0, pageWidth, (sliceCanvas.height / canvas.width) * pageWidth);
          renderedHeight += pageHeightPx;
        }
      }

      const filename = `${(resume.fullName || 'resume').trim().replace(/[^a-z0-9-_]+/gi, '-') || 'resume'}.pdf`;
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const download = document.createElement('a');
      download.href = url;
      download.download = filename;
      document.body.appendChild(download);
      download.click();
      download.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('PDF export failed:', error);
      setExportError('Could not create the PDF. Please try again after the preview has loaded.');
    } finally {
      setExporting(false);
    }
  }

  function updateExperience(id: string, patch: Partial<ExperienceEntry>) {
    setResume((r) => ({ ...r, experience: r.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  }
  function addExperience() {
    setResume((r) => ({ ...r, experience: [...r.experience, { id: uid(), role: '', company: '', start: '', end: '', bullets: [''] }] }));
  }
  function removeExperience(id: string) {
    setResume((r) => ({ ...r, experience: r.experience.filter((e) => e.id !== id) }));
  }
  function updateEducation(id: string, patch: Partial<EducationEntry>) {
    setResume((r) => ({ ...r, education: r.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  }
  function addEducation() {
    setResume((r) => ({ ...r, education: [...r.education, { id: uid(), school: '', degree: '', year: '' }] }));
  }
  function removeEducation(id: string) {
    setResume((r) => ({ ...r, education: r.education.filter((e) => e.id !== id) }));
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="flex justify-between items-center px-5 sm:px-8 py-4 border-b border-black/10 bg-white">
        <span className="text-[21px] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Mainframe&reg;
        </span>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="text-[14px] underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Sign out
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 p-5 sm:p-8 max-w-7xl mx-auto">
        {/* LEFT: Editor */}
        <div className="flex flex-col gap-6">
          {/* AI generate panel */}
          <section className="bg-black text-white rounded-2xl p-5 sm:p-6">
            <h2 className="text-[17px] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Generate with AI</h2>
            <div className="flex flex-col gap-3">
              <input
                placeholder="Target role (e.g. Product Designer)"
                value={aiInputs.targetRole}
                onChange={(e) => setAiInputs((a) => ({ ...a, targetRole: e.target.value }))}
                className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-[14px] outline-none placeholder:text-white/50"
              />
              <input
                placeholder="Years of experience"
                value={aiInputs.yearsExperience}
                onChange={(e) => setAiInputs((a) => ({ ...a, yearsExperience: e.target.value }))}
                className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-[14px] outline-none placeholder:text-white/50"
              />
              <textarea
                placeholder="Briefly describe your background, key projects, and strengths..."
                value={aiInputs.background}
                onChange={(e) => setAiInputs((a) => ({ ...a, background: e.target.value }))}
                rows={3}
                className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-[14px] outline-none placeholder:text-white/50 resize-none"
              />
              {genError && <p className="text-[13px] text-red-300">{genError}</p>}
              <button
                onClick={handleGenerate}
                disabled={generating || !aiInputs.background}
                className="inline-flex items-center justify-center bg-white text-black rounded-full text-[14px] px-5 py-[0.5em] hover:opacity-80 transition-opacity duration-200 disabled:opacity-40"
              >
                {generating ? 'Generating…' : 'Generate summary, bullets & skills'}
              </button>
            </div>
          </section>

          {/* Personal info */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-black/10">
            <h2 className="text-[17px] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Personal info</h2>
            <div className="grid grid-cols-2 gap-3">
              <input className="input" placeholder="Full name" value={resume.fullName} onChange={(e) => setResume((r) => ({ ...r, fullName: e.target.value }))} />
              <input className="input" placeholder="Title" value={resume.title} onChange={(e) => setResume((r) => ({ ...r, title: e.target.value }))} />
              <input className="input" placeholder="Email" value={resume.email} onChange={(e) => setResume((r) => ({ ...r, email: e.target.value }))} />
              <input className="input" placeholder="Phone" value={resume.phone} onChange={(e) => setResume((r) => ({ ...r, phone: e.target.value }))} />
              <input className="input col-span-2" placeholder="Location" value={resume.location} onChange={(e) => setResume((r) => ({ ...r, location: e.target.value }))} />
            </div>
            <textarea
              className="input mt-3 resize-none"
              placeholder="Professional summary"
              rows={3}
              value={resume.summary}
              onChange={(e) => setResume((r) => ({ ...r, summary: e.target.value }))}
            />
          </section>

          {/* Experience */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-black/10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[17px]" style={{ fontFamily: 'var(--font-heading)' }}>Experience</h2>
              <button onClick={addExperience} className="text-[13px] underline underline-offset-2">+ Add</button>
            </div>
            {resume.experience.map((exp) => (
              <div key={exp.id} className="border border-black/10 rounded-xl p-4 mb-3">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input className="input" placeholder="Role" value={exp.role} onChange={(e) => updateExperience(exp.id, { role: e.target.value })} />
                  <input className="input" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
                  <input className="input" placeholder="Start (e.g. 2022)" value={exp.start} onChange={(e) => updateExperience(exp.id, { start: e.target.value })} />
                  <input className="input" placeholder="End (e.g. Present)" value={exp.end} onChange={(e) => updateExperience(exp.id, { end: e.target.value })} />
                </div>
                <textarea
                  className="input resize-none"
                  placeholder={'One bullet per line'}
                  rows={3}
                  value={exp.bullets.join('\n')}
                  onChange={(e) => updateExperience(exp.id, { bullets: e.target.value.split('\n') })}
                />
                <button onClick={() => removeExperience(exp.id)} className="text-[12px] text-red-500 mt-2">Remove</button>
              </div>
            ))}
          </section>

          {/* Education */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-black/10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[17px]" style={{ fontFamily: 'var(--font-heading)' }}>Education</h2>
              <button onClick={addEducation} className="text-[13px] underline underline-offset-2">+ Add</button>
            </div>
            {resume.education.map((ed) => (
              <div key={ed.id} className="grid grid-cols-3 gap-2 mb-2">
                <input className="input" placeholder="School" value={ed.school} onChange={(e) => updateEducation(ed.id, { school: e.target.value })} />
                <input className="input" placeholder="Degree" value={ed.degree} onChange={(e) => updateEducation(ed.id, { degree: e.target.value })} />
                <div className="flex gap-2">
                  <input className="input" placeholder="Year" value={ed.year} onChange={(e) => updateEducation(ed.id, { year: e.target.value })} />
                  <button onClick={() => removeEducation(ed.id)} className="text-[12px] text-red-500">✕</button>
                </div>
              </div>
            ))}
          </section>

          {/* Skills */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-black/10">
            <h2 className="text-[17px] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Skills</h2>
            <input
              className="input"
              placeholder="Comma-separated (e.g. Figma, React, SQL)"
              value={resume.skills.join(', ')}
              onChange={(e) => setResume((r) => ({ ...r, skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
            />
          </section>

          {/* Template picker */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-black/10">
            <h2 className="text-[17px] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Template</h2>
            <div className="flex gap-2">
              {(['classic', 'modern', 'minimal'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setResume((r) => ({ ...r, template: t }))}
                  className={`text-[13px] px-4 py-2 rounded-full border capitalize transition-colors duration-200 ${
                    resume.template === t ? 'bg-black text-white border-black' : 'bg-white text-black border-black/10 hover:bg-black/5'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* ATS checker */}
          <section id="ats" className="bg-white rounded-2xl p-5 sm:p-6 border border-black/10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[17px]" style={{ fontFamily: 'var(--font-heading)' }}>ATS score checker</h2>
              <button onClick={() => setShowAts((s) => !s)} className="text-[13px] underline underline-offset-2">
                {showAts ? 'Hide' : 'Check score'}
              </button>
            </div>
            {showAts && (
              <div className="flex flex-col gap-3">
                <textarea
                  className="input resize-none"
                  placeholder="Paste a job description to score keyword match (optional)"
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <div className="flex items-center gap-3">
                  <div className="text-[32px] font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                    {ats.score}<span className="text-[16px] text-black/40">/100</span>
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-black/10 overflow-hidden">
                    <div className="h-full bg-black" style={{ width: `${ats.score}%` }} />
                  </div>
                </div>
                <ul className="text-[13px] flex flex-col gap-1">
                  {ats.breakdown.map((b) => (
                    <li key={b.label} className="flex justify-between text-black/70">
                      <span>{b.label}</span>
                      <span>{b.points}/{b.max}</span>
                    </li>
                  ))}
                </ul>
                {ats.suggestions.length > 0 && (
                  <div>
                    <p className="text-[13px] font-medium mb-1">Suggestions</p>
                    <ul className="text-[13px] list-disc list-inside text-black/70 flex flex-col gap-1">
                      {ats.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT: Preview */}
        <div className="lg:sticky lg:top-8 h-fit flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-[15px] text-black/60">Live preview</h2>
            <button
              onClick={handleExportPdf}
              disabled={exporting}
              className="inline-flex items-center justify-center bg-black text-white rounded-full text-[14px] px-5 py-[0.5em] hover:opacity-80 transition-opacity duration-200 disabled:opacity-40"
            >
              {exporting ? 'Exporting…' : 'Export PDF'}
            </button>
          </div>
          {exportError && <p className="text-[13px] text-red-600">{exportError}</p>}
          <div className="border border-black/10 rounded-2xl overflow-hidden shadow-sm">
            <div ref={previewRef} data-resume-preview>
              <TemplateRenderer resume={resume} />
            </div>
          </div>
        </div>
      </div>

      <style>{`.input { border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 8px 14px; font-size: 14px; outline: none; width: 100%; }
      .input:focus { border-color: rgba(0,0,0,0.4); }`}</style>
    </div>
  );
}
