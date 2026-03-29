'use client';

import { useState, useEffect } from 'react';

const links = [
  { label: 'De ce Vibe?', href: '/#features' },
  { label: 'Meniu', href: '/#meniu' },
  { label: 'Vizitează-ne', href: '/#contact' },
  { label: 'Rezervări', href: '/rezervari' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleClickOutside = (e: MouseEvent) => {
      const nav = document.getElementById('main-nav');
      if (nav && !nav.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav id="main-nav" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#1C0F07]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <a href="/" onClick={() => setMenuOpen(false)} className="font-dm-serif text-2xl text-[#F5E6C8] tracking-wide">
          Vibe Coffee
        </a>

        {/* LINKS - desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#F5E6C8]/80 hover:text-[#F5E6C8] font-medium transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(245,230,200,0.6)]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+40721000000"
            className="flex items-center gap-2 px-6 py-2 border-2 border-[#F5E6C8] text-[#F5E6C8] font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(245,230,200,0.3)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.59 3.44 2 2 0 0 1 3.56 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
            </svg>
            +40 721 000 000
          </a>
        </div>

        {/* BURGER - mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`block w-6 h-0.5 bg-[#F5E6C8] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#F5E6C8] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#F5E6C8] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="bg-[#1C0F07]/95 backdrop-blur-md px-6 pb-6 flex flex-col gap-4">
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[#F5E6C8]/80 hover:text-[#F5E6C8] font-medium transition-all duration-300 py-2 border-b border-[#F5E6C8]/10 hover:drop-shadow-[0_0_8px_rgba(245,230,200,0.6)]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+40721000000"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#F5E6C8] text-[#F5E6C8] font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,230,200,0.3)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.59 3.44 2 2 0 0 1 3.56 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
            </svg>
            +40 721 000 000
          </a>
        </div>
      </div>

    </nav>
  );
}
