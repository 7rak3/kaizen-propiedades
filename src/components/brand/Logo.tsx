import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', size = 'md' }) => {
  const isDark = variant === 'dark';

  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group transition-transform hover:scale-[1.01]">
      <div
        className={`${iconSizes[size]} rounded-lg bg-gradient-to-br from-kaizen-gold-light via-kaizen-gold to-kaizen-gold-dark flex items-center justify-center font-bold text-white shadow-gold flex-shrink-0 tracking-tighter`}
      >
        <span className="font-serif italic text-white drop-shadow-sm">K</span>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-serif font-bold tracking-wider uppercase ${titleSizes[size]} ${
              isDark ? 'text-white' : 'text-kaizen-dark'
            }`}
          >
            KAIZEN
          </span>
          <span className="text-[10px] font-medium tracking-widest text-kaizen-gold uppercase font-mono px-1.5 py-0.5 rounded bg-kaizen-gold/10 border border-kaizen-gold/20">
            改善
          </span>
        </div>
        <span
          className={`text-[9px] font-semibold tracking-[0.25em] uppercase mt-0.5 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Propiedades • Santiago & Costa
        </span>
      </div>
    </Link>
  );
};
