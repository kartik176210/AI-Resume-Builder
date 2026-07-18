import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackgroundVideo from '../components/BackgroundVideo';
import Navbar from '../components/Navbar';
import { useTypewriter } from '../hooks/useTypewriter';
import { login } from '../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Sign in and let\u2019s keep building your resume.',
    38,
    600,
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButtons(true), 400);
    return () => clearTimeout(t);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error || 'Something went wrong.');
      return;
    }
    navigate('/home');
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundVideo />
      <div className="fixed inset-0 bg-black/35" style={{ zIndex: 0 }} />
      <Navbar ctaLabel="Sign up" ctaHref="/signup" />

      <main
        className="h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden relative"
        style={{ zIndex: 1 }}
      >
        <div className="max-w-xl relative z-10">
          <div
            className="pointer-events-none select-none mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              color: '#fff',
              filter: 'blur(4px)',
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe&apos;s Adaptive Response Interface Agent
          </div>

          <p
            className="text-white mb-6"
            style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: 1.35, fontWeight: 400, minHeight: 54 }}
          >
            {displayed}
            {!done && <span className="typewriter-cursor inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px]" />}
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 flex flex-col gap-4 max-w-sm transition-opacity duration-400"
            style={{ opacity: showButtons ? 1 : 0, transform: showButtons ? 'translateY(0)' : 'translateY(8px)' }}
          >
            <h1 className="text-[22px] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Sign in
            </h1>

            {error && <p className="text-[13px] text-red-600">{error}</p>}

            <label className="flex flex-col gap-1 text-[13px]">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-black/10 rounded-full px-4 py-2 text-[14px] outline-none focus:border-black/40"
                placeholder="you@example.com"
              />
            </label>

            <label className="flex flex-col gap-1 text-[13px]">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-black/10 rounded-full px-4 py-2 text-[14px] outline-none focus:border-black/40"
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              />
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center bg-black text-white rounded-full text-[15px] px-5 py-[0.5em] hover:opacity-80 transition-opacity duration-200"
            >
              Sign in
            </button>

            <p className="text-[13px] text-black/60">
              No account yet?{' '}
              <Link to="/signup" className="underline underline-offset-2">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
