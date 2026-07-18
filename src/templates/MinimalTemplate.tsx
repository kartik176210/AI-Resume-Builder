import type { ResumeData } from '../types';

export default function MinimalTemplate({ resume }: { resume: ResumeData }) {
  return (
    <div className="bg-white text-black p-12 w-full" style={{ fontFamily: 'var(--font-body)' }}>
      <header className="mb-10">
        <h1 className="text-[30px] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          {resume.fullName || 'Your Name'}
        </h1>
        <p className="text-[14px] text-black/60 mt-1">{resume.title || 'Professional Title'}</p>
        <p className="text-[12px] text-black/40 mt-3">
          {[resume.email, resume.phone, resume.location].filter(Boolean).join('   ')}
        </p>
      </header>

      {resume.summary && (
        <section className="mb-8">
          <p className="text-[14px] leading-loose">{resume.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-black/40 mb-4">Experience</h2>
          {resume.experience.map((e) => (
            <div key={e.id} className="mb-6 border-l border-black/10 pl-4">
              <p className="text-[14px] font-medium">{e.role}</p>
              <p className="text-[12px] text-black/50 mb-2">{e.company} — {e.start} to {e.end}</p>
              <ul className="text-[13px] space-y-1">
                {e.bullets.filter(Boolean).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {resume.education.length > 0 && (
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-black/40 mb-3">Education</h2>
            {resume.education.map((ed) => (
              <div key={ed.id} className="text-[13px] mb-2">
                <p>{ed.degree}</p>
                <p className="text-black/50">{ed.school}, {ed.year}</p>
              </div>
            ))}
          </section>
        )}

        {resume.skills.length > 0 && (
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-black/40 mb-3">Skills</h2>
            <p className="text-[13px] leading-relaxed">{resume.skills.join(', ')}</p>
          </section>
        )}
      </div>
    </div>
  );
}
