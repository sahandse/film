'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-paw-accent tracking-widest">PAW</span>
          <span className="text-xs text-paw-muted hidden sm:block">فیلم و سریال</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-white hover:text-paw-accent transition-colors">خانه</Link>
          <Link href="/?type=movie" className="text-paw-muted hover:text-white transition-colors">فیلم‌ها</Link>
          <Link href="/?type=series" className="text-paw-muted hover:text-white transition-colors">سریال‌ها</Link>
        </nav>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="منو"
        >
          <div className="w-5 h-0.5 bg-white mb-1 transition-all" />
          <div className="w-5 h-0.5 bg-white mb-1 transition-all" />
          <div className="w-5 h-0.5 bg-white transition-all" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black/95 px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          <Link href="/" className="text-white py-2 border-b border-white/10" onClick={() => setMenuOpen(false)}>خانه</Link>
          <Link href="/?type=movie" className="text-paw-muted py-2 border-b border-white/10" onClick={() => setMenuOpen(false)}>فیلم‌ها</Link>
          <Link href="/?type=series" className="text-paw-muted py-2" onClick={() => setMenuOpen(false)}>سریال‌ها</Link>
        </div>
      )}
    </header>
  );
}
