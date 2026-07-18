import { useState } from 'react';
import { Link } from 'react-router-dom';

const LINKS = [
  { label: 'Templates', href: '#templates' },
  { label: 'ATS Score', href: '#ats' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Navbar({ ctaLabel = 'Get in touch', ctaHref = '/login' }: { ctaLabel?: string; ctaHref?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full flex flex-row justify-between items-center px-5 sm:px-8 py-4 sm:py-5"
        style={{ zIndex: 10 }}
      >
        <Link to="/home" className="flex flex-row items-center gap-3">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-black"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mainframe&reg;
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-black select-none"
            style={{ letterSpacing: '-0.02em' }}
          >
            &#10035;&#65038;
          </span>
        </Link>

        <div className="hidden md:flex flex-row text-[23px] text-black">
          {LINKS.map((l, i) => (
            <span key={l.label}>
              <a href={l.href} className="hover:opacity-60 transition-opacity">
                {l.label}
              </a>
              {i < LINKS.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>

        <a
          href={ctaHref}
          className="hidden md:block text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          {ctaLabel}
        </a>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="md:hidden flex flex-col gap-[5px] items-end"
        >
          <span
            className="w-6 h-[2px] bg-black transition-all duration-300"
            style={open ? { transform: 'rotate(45deg) translate(4px, 6px)' } : {}}
          />
          <span
            className="w-6 h-[2px] bg-black transition-all duration-300"
            style={open ? { opacity: 0 } : { opacity: 1 }}
          />
          <span
            className="w-6 h-[2px] bg-black transition-all duration-300"
            style={open ? { transform: 'rotate(-45deg) translate(4px, -6px)' } : {}}
          />
        </button>
      </nav>

      <div
        className="fixed inset-0 bg-white/95 backdrop-blur-sm flex flex-col justify-center items-start px-8 gap-8 md:hidden transition-opacity duration-300"
        style={{
          zIndex: 9,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-[32px] font-medium text-black"
          >
            {l.label}
          </a>
        ))}
        <a
          href={ctaHref}
          onClick={() => setOpen(false)}
          className="text-[32px] font-medium text-black underline underline-offset-2"
        >
          {ctaLabel}
        </a>
      </div>
    </>
  );
}
