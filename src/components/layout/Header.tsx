import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import MobileNav from './MobileNav';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Conditions', href: '/conditions' },
  { name: 'Trails', href: '/trails' },
  { name: 'Guides', href: '/guides' },
  { name: 'Camping', href: '/camping' },
  { name: 'Events', href: '/events' },
  { name: 'Map', href: '/map' },
];

// Minimalist Pine Tree SVG Component
function PineTreeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L7 9h2l-3 5h2l-4 8h16l-4-8h2l-3-5h2L12 2zm0 3.5L14.5 9h-1.3l2.3 3.8h-1.5L17 18H7l3-5.2H8.5L10.8 9H9.5L12 5.5z"/>
    </svg>
  );
}

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-900/95 backdrop-blur-lg border-b border-white/5'
          : 'bg-navy-900/80 backdrop-blur-sm'
      }`}>
        <div className="container-app">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <PineTreeIcon className="w-8 h-8 text-pine-500 group-hover:scale-105 transition-transform" />
              <span className="text-xl font-bold text-white">Bendy</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? 'text-sunset-400'
                      : 'text-gray-300 hover:text-sunset-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        links={navLinks}
      />
    </>
  );
}
