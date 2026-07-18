import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundVideo from '../components/BackgroundVideo';
import Navbar from '../components/Navbar';
import { WhitePill, OutlinePill } from '../components/PillButton';
import { useTypewriter } from '../hooks/useTypewriter';

const PILLS = ['Pitch us an idea', 'Come work here', 'Send a brief hello', 'See how we operate'];

const FEATURES = [
  { title: 'Generate resumes with AI', copy: 'Describe your background once. A.R.I.A drafts a tailored summary, bullets, and skills list in seconds.' },
  { title: 'Multiple templates', copy: 'Switch between Classic, Modern, and Minimal layouts without re-entering a single word.' },
  { title: 'PDF export', copy: 'Download a print-ready PDF straight from the browser — no watermarks, no waiting.' },
  { title: 'ATS score checker', copy: 'Paste a job description and see exactly which keywords and sections need work before you apply.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Good taste tends to find us. Now, what are we building?',
    38,
    600,
  );
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButtons(true), 400);
    return () => clearTimeout(t);
  }, []);

  function handleCopyEmail() {
    navigator.clipboard.writeText('hello@mainframe.co');
  }

  return (
    <div className="relative">
      <BackgroundVideo />
      <Navbar />

      <section
        className="h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden relative"
        style={{ zIndex: 1 }}
      >
        <div className="max-w-xl relative z-10">
          <div
            className="pointer-events-none select-none mb-5 sm:mb-6"
            style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: 1.3, fontWeight: 400, color: '#000', filter: 'blur(4px)' }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe&apos;s Adaptive Response Interface Agent
          </div>

          <p className="text-black mb-5 sm:mb-6" style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: 1.35, fontWeight: 400, minHeight: 54 }}>
            {displayed}
            {!done && <span className="typewriter-cursor inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px]" />}
          </p>

          <div
            className="flex flex-wrap gap-y-1 transition-all duration-400"
            style={{ opacity: showButtons ? 1 : 0, transform: showButtons ? 'translateY(0)' : 'translateY(8px)' }}
          >
            {PILLS.map((label) => (
              <WhitePill key={label} onClick={() => navigate('/builder')}>
                {label}
              </WhitePill>
            ))}
            <OutlinePill onClick={handleCopyEmail}>
              <span className="underline underline-offset-1">Reach us: hello@mainframe.co</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
                <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
              </svg>
            </OutlinePill>
          </div>
        </div>
      </section>

      <section id="templates" className="relative bg-white px-5 sm:px-8 md:px-10 py-20 sm:py-28" style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[28px] sm:text-[40px] tracking-tight mb-10 sm:mb-14" style={{ fontFamily: 'var(--font-heading)' }}>
            What Mainframe builds for you
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
            {FEATURES.map((f) => (
              <div key={f.title} className="border-t border-black/10 pt-5">
                <h3 className="text-[19px] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {f.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-black/70">{f.copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <WhitePill className="!bg-black !text-white" onClick={() => navigate('/builder')}>
              Start building your resume
            </WhitePill>
          </div>
        </div>
      </section>
    </div>
  );
}
