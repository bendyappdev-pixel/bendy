import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; href: string }[];
}

// Minimalist Pine Tree SVG Component
function PineTreeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L7 9h2l-3 5h2l-4 8h16l-4-8h2l-3-5h2L12 2zm0 3.5L14.5 9h-1.3l2.3 3.8h-1.5L17 18H7l3-5.2H8.5L10.8 9H9.5L12 5.5z"/>
    </svg>
  );
}

export default function MobileNav({ isOpen, onClose, links }: MobileNavProps) {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-72 bg-navy-800 shadow-xl border-l border-white/10">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PineTreeIcon className="w-7 h-7 text-pine-500" />
            <span className="text-lg font-bold text-white">Bendy</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={onClose}
              className={`block px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                location.pathname === link.href
                  ? 'bg-sunset-500 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-sunset-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <p className="text-sm text-gray-500 text-center">
            Your guide to Bend, Oregon
          </p>
        </div>
      </div>
    </div>
  );
}
