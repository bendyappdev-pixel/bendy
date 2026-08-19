import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import ViewfinderMark from '../ui/ViewfinderMark';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; href: string }[];
}

export default function MobileNav({ isOpen, onClose, links }: MobileNavProps) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Escape closes the drawer, focus moves into it on open, and the page
  // behind it stops scrolling. None of this was wired up before.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div
        className={`absolute inset-0 bg-black/70 transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`absolute bottom-0 right-0 top-0 w-72 border-l border-hair bg-film-deep transition-transform duration-300 ease-out ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-hair p-4">
          <div className="flex items-center gap-3">
            <ViewfinderMark className="h-6 w-6" />
            <span className="film-display text-[28px]">BENDY</span>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="p-2 transition-colors hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-mist" />
          </button>
        </div>

        <nav className="flex flex-col">
          {links.map((link, i) => {
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={`film-display-thin border-b border-hair px-5 py-4 text-[26px] transition-colors ${
                  active ? 'text-ember' : 'text-film-white hover:text-ember'
                }`}
                style={{
                  transitionDelay: visible ? `${i * 30}ms` : '0ms',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(12px)',
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* The header's Search affordance is desktop-only (hidden lg:flex),
            so this is the drawer's equivalent — same destination. */}
        <Link
          to="/map"
          onClick={onClose}
          className="small-caps flex items-center gap-3 px-5 py-4 text-mist transition-colors hover:text-film-white"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search the map
        </Link>

        <div className="absolute bottom-0 left-0 right-0 border-t border-hair p-4">
          <p className="small-caps text-center text-whisper">Summer/Fall 2026</p>
        </div>
      </div>
    </div>
  );
}
