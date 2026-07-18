import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function WhitePill({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={`inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function OutlinePill({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={`inline-flex items-center justify-center bg-transparent text-white border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] gap-2 sm:gap-3 whitespace-nowrap hover:bg-white hover:text-black transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
