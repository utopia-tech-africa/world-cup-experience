'use client';

import Link from 'next/link';
import { Logo } from '@/assets/svg';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-[0.5px] border-[rgba(112,112,112,0.5)] bg-white/5 py-6 backdrop-blur-[10px]">
      <div className="mx-auto flex w-full max-w-[1512px] items-center justify-center px-4 sm:px-8 md:px-16 lg:px-[120px]">
        <Link
          href="/"
          className="inline-flex transition-opacity hover:opacity-90"
          aria-label="Altair Logistics - Home"
        >
          <Logo />
        </Link>
      </div>
    </header>
  );
}
