import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackgroundVideo from '../components/BackgroundVideo';
import Navbar from '../components/Navbar';
import { signup } from '../lib/auth';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = signup(name, email, password);
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
      <Navbar ctaLabel="Sign in" ctaHref="/login" />

      <main
        className="h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden relative"
        style={{ zIndex: 1 }}
      >
        <div className="max-w-xl relative z-10">
          <p className="text-white mb-6" style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: 1.35 }}>
            Create your account and let A.R.I.A draft your first resume.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 flex flex-col gap-4 max-w-sm transition-opacity duration-400"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}
          >
            <h1 className="text-[22px] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Create account
            </h1>

            {error && <p className="text-[13px] text-red-600">{error}</p>}

            <label className="flex flex-col gap-1 text-[13px]">
              Name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-black/10 rounded-full px-4 py-2 text-[14px] outline-none focus:border-black/40"
                placeholder="Ada Lovelace"
              />
            </label>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-black/10 rounded-full px-4 py-2 text-[14px] outline-none focus:border-black/40"
                placeholder="At least 6 characters"
              />
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center bg-black text-white rounded-full text-[15px] px-5 py-[0.5em] hover:opacity-80 transition-opacity duration-200"
            >
              Create account
            </button>

            <p className="text-[13px] text-black/60">
              Already have an account?{' '}
              <Link to="/login" className="underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
