import React, { useState, useEffect } from 'react';
import { NavItem } from '../types';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS: NavItem[] = [
  { label: 'Projects', href: '/#projects' },
  { label: 'About', href: '/#about' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Contact', href: '/#contact' },
];

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();

  // Scroll handler for styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section highlight spy (only on home page)
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleSpy = () => {
      const sections = NAV_ITEMS.map(item => item.href.replace('/', '').substring(1));
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleSpy);
    return () => window.removeEventListener('scroll', handleSpy);
  }, [location.pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    
    // If on home page and clicking anchor, smooth scroll
    if (location.pathname === '/' && href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/', '');
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Update URL hash without reload
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 md:py-4 bg-background/90 backdrop-blur-md border-b border-white/5' : 'py-5 md:py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo - Clickable to Home */}
        <Link 
          to="/" 
          className="relative z-50 p-2 -ml-2 text-xl md:text-2xl font-bold tracking-tighter hover:text-emerald-400 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg" 
          aria-label="ホームに戻る"
        >
          KZ <span className="text-slate-600 group-hover:text-emerald-400 transition-colors">/</span> Kazushi
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8" aria-label="メインナビゲーション">
          {NAV_ITEMS.map((item) => {
            const sectionName = item.href.replace('/', '').substring(1);
            const isActive = location.pathname === '/' && activeSection === sectionName;
            
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative py-2 text-sm uppercase tracking-widest font-medium transition-colors duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm
                  ${isActive ? 'text-white' : 'text-slate-400 hover:text-emerald-400'}
                `}
              >
                {item.label}
                {/* Active Dot */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                )}
                {/* Hover Line */}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-emerald-400 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 -mr-2 text-slate-200 hover:text-emerald-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <nav 
          id="mobile-menu" 
          className="md:hidden absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 p-6 flex flex-col space-y-6 shadow-2xl animate-in fade-in slide-in-from-top-5 duration-200" 
          aria-label="モバイルナビゲーション"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-lg font-medium text-slate-300 hover:text-emerald-400 hover:pl-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm"
            >
              <span className="text-emerald-500/50 mr-2">#</span>
              {item.label}
            </a>
          ))}
          <Link 
             to="/"
             onClick={() => setMobileMenuOpen(false)}
             className="pt-4 mt-2 border-t border-slate-800 text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;