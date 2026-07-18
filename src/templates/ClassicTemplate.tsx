import type { ResumeData } from '../types';

export default function ClassicTemplate({ resume }: { resume: ResumeData }) {
  return (
    <div className="bg-white text-black p-10 w-full" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <header className="text-center border-b border-black/20 pb-4 mb-5">
        <h1 className="text-[26px] tracking-tight">{resume.fullName || 'Your Name'}</h1>
        <p className="text-[14px] text-black/70">{resume.title || 'Professional Title'}</p>
        <p className="text-[12px] text-black/60 mt-1">
          {[resume.email, resume.phone, resume.location].filter(Boolean).join('  \u2022  ')}
        </p>
      </header>

      {resume.summary && (
        <section className="mb-5">
          <h2 className="text-[13px] uppercase tracking-widest mb-2">Summary</h2>
          <p className="text-[13px] leading-relaxed">{resume.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[13px] uppercase tracking-widest mb-2">Experience</h2>
          {resume.experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between text-[13px]">
                <span className="font-bold">{e.role} — {e.company}</span>
                <span className="text-black/60">{e.start} – {e.end}</span>
              </div>
              <ul className="list-disc list-inside text-[13px] mt-1">
                {e.bullets.filter(Boolean).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[13px] uppercase tracking-widest mb-2">Education</h2>
          {resume.education.map((ed) => (
            <div key={ed.id} className="flex justify-between text-[13px] mb-1">
              <span>{ed.degree}, {ed.school}</span>
              <span className="text-black/60">{ed.year}</span>
            </div>
          ))}
        </section>
      )}

      {resume.skills.length > 0 && (
        <section>
          <h2 className="text-[13px] uppercase tracking-widest mb-2">Skills</h2>
          <p className="text-[13px]">{resume.skills.join('  \u2022  ')}</p>
        </section>
      )}
    </div>
  );
}
