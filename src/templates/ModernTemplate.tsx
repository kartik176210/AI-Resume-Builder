import type { ResumeData } from '../types';

export default function ModernTemplate({ resume }: { resume: ResumeData }) {
  return (
    <div className="bg-white text-black w-full flex" style={{ fontFamily: 'var(--font-body)', minHeight: '100%' }}>
      <aside className="w-[34%] bg-black text-white p-6">
        <h1 className="text-[22px] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
          {resume.fullName || 'Your Name'}
        </h1>
        <p className="text-[13px] text-white/70 mb-6">{resume.title || 'Professional Title'}</p>

        <div className="text-[12px] leading-relaxed mb-6">
          {resume.email && <p>{resume.email}</p>}
          {resume.phone && <p>{resume.phone}</p>}
          {resume.location && <p>{resume.location}</p>}
        </div>

        {resume.skills.length > 0 && (
          <div>
            <h2 className="text-[11px] uppercase tracking-widest text-white/60 mb-2">Skills</h2>
            <ul className="text-[12px] space-y-1">
              {resume.skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {resume.education.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[11px] uppercase tracking-widest text-white/60 mb-2">Education</h2>
            {resume.education.map((ed) => (
              <div key={ed.id} className="text-[12px] mb-2">
                <p className="font-bold">{ed.degree}</p>
                <p className="text-white/70">{ed.school} · {ed.year}</p>
              </div>
            ))}
          </div>
        )}
      </aside>

      <main className="w-[66%] p-6">
        {resume.summary && (
          <section className="mb-5">
            <h2 className="text-[13px] uppercase tracking-widest mb-2 text-black/50">Summary</h2>
            <p className="text-[13px] leading-relaxed">{resume.summary}</p>
          </section>
        )}

        {resume.experience.length > 0 && (
          <section>
            <h2 className="text-[13px] uppercase tracking-widest mb-2 text-black/50">Experience</h2>
            {resume.experience.map((e) => (
              <div key={e.id} className="mb-4">
                <div className="flex justify-between text-[13px]">
                  <span className="font-bold">{e.role}</span>
                  <span className="text-black/50">{e.start} – {e.end}</span>
                </div>
                <p className="text-[12px] text-black/60 mb-1">{e.company}</p>
                <ul className="list-disc list-inside text-[13px]">
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
