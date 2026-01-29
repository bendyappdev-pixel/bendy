import { Link, useLocation } from 'react-router-dom';
import { X, MapPin } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; href: string }[];
}

export default function MobileNav({ isOpen, onClose, links }: MobileNavProps) {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-72 bg-snow shadow-xl">
        <div className="p-4 border-b border-sage/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-forest">Bendy</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-sage/20 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-forest" />
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
                  ? 'bg-forest text-white'
                  : 'text-gray-700 hover:bg-sage/20'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sage/20">
          <p className="text-sm text-gray-500 text-center">
            Your guide to Bend, Oregon
          </p>
        </div>
      </div>
    </div>
  );
}
