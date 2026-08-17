import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import MobileNav from './MobileNav';
import BulletinTicker from './BulletinTicker';
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

export const REEL_ISSUE = 'Reel №07 · Spring 2026';

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <BulletinTicker />

      {/* Not fixed — the masthead scrolls away with the page. The old
          `scrolled` state, backdrop blur, and the h-16 spacer that
          compensated for fixed positioning are all gone. */}
      <header className="relative z-40 border-b border-hair">
        <div className="container-app flex items-center justify-between gap-6 py-5">
          <Link to="/" className="flex shrink-0 items-center gap-3 text-film-white">
            <ViewfinderMark className="h-6 w-6" />
            <span className="film-display text-[36px] tracking-[-0.02em]">BENDY</span>
          </Link>

          {/* Seven nav links plus the wordmark do not fit at md (768px) — the
              row overflowed the viewport between roughly 768 and 1100px. The
              full nav appears at lg, the issue slug and search only at xl,
              and the drawer covers everything below. */}
          <nav className="hidden items-center gap-6 whitespace-nowrap lg:flex xl:gap-8">
            {navLinks.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`small-caps transition-colors duration-200 ${
                    active ? 'text-ember' : 'text-mist hover:text-film-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-4 xl:flex">
            <span className="small-caps text-mist">{REEL_ISSUE}</span>
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
            className="p-2 transition-colors hover:bg-white/10 lg:hidden"
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
