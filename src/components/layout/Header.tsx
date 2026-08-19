import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import MobileNav from './MobileNav';
import ViewfinderMark from '../ui/ViewfinderMark';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Conditions', href: '/conditions' },
  { name: 'Trails', href: '/trails' },
  { name: 'Guides', href: '/guides' },
  { name: 'Camping', href: '/camping' },
  { name: 'Events', href: '/events' },
  { name: 'Map', href: '/map' },
];

export const EDITION = 'Summer/Fall 2026';

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // The Search affordance advertises ⌘K — make that true.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        navigate('/map');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  return (
    <>
      {/* Not fixed — the masthead scrolls away with the page. The old
          `scrolled` state, backdrop blur, and the h-16 spacer that
          compensated for fixed positioning are all gone. */}
      <header className="relative z-40 border-b border-hair">
        <div className="container-app flex items-center justify-between gap-6 py-5">
          <Link to="/" className="flex shrink-0 items-center gap-3 text-film-white">
            <ViewfinderMark className="h-6 w-6" />
            <span className="film-display text-[36px] tracking-[-0.02em]">BENDY</span>
          </Link>

          {/* Per the updated design: nav returns at md with tighter gaps —
              it fits there because the right-hand meta now waits until lg
              (and the issue slug until xl), which is what overflowed the
              768–1100px range before. The drawer covers everything below md. */}
          <nav className="hidden items-center gap-5 whitespace-nowrap md:flex lg:gap-8">
            {navLinks.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`small-caps px-1 py-3 transition-colors duration-200 ${
                    active ? 'text-ember' : 'text-mist hover:text-film-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-4 lg:flex">
            <span className="small-caps hidden text-mist xl:inline">{EDITION}</span>
            <Link
              to="/map"
              className="small-caps inline-flex items-center gap-2 border border-hair px-3 py-1.5 text-mist transition-colors hover:border-white/40 hover:text-film-white"
            >
              <span>Search</span>
              <span className="text-[10px] opacity-60">⌘K</span>
            </Link>
          </div>

          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-2.5 transition-colors hover:bg-white/10 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-film-white" />
          </button>
        </div>
      </header>

      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        links={navLinks}
      />
    </>
  );
}
