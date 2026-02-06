import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

// Minimalist Pine Tree SVG Component
function PineTreeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L7 9h2l-3 5h2l-4 8h16l-4-8h2l-3-5h2L12 2zm0 3.5L14.5 9h-1.3l2.3 3.8h-1.5L17 18H7l3-5.2H8.5L10.8 9H9.5L12 5.5z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-white/5 mt-auto">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <PineTreeIcon className="w-8 h-8 text-pine-500" />
              <span className="text-xl font-bold text-white">Bendy</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md">
              Your guide to outdoor adventures, local events, and everything the Bend area has to offer.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/events" className="text-gray-400 hover:text-sunset-400 transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-400 hover:text-sunset-400 transition-colors">
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link to="/category/outdoor" className="text-gray-400 hover:text-sunset-400 transition-colors">
                  Outdoor Activities
                </Link>
              </li>
              <li>
                <Link to="/category/food" className="text-gray-400 hover:text-sunset-400 transition-colors">
                  Food & Drink
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4">About Bend</h3>
            <p className="text-gray-400 text-sm mb-4">
              Bend is located in Central Oregon at the foot of the Cascade Range. Known for outdoor recreation, craft breweries, and stunning natural beauty.
            </p>
            <p className="text-gray-400 text-sm">
              Population: ~100,000<br />
              Elevation: 3,623 ft
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Bendy. Not affiliated with the City of Bend.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Bend, Oregon
          </p>
        </div>

        <div className="mt-6 text-center space-y-1">
          <p className="text-gray-600 text-xs">
            Photography by{' '}
            <a
              href="https://www.benjaminedwardsphotography.com"
              target="_blank"
              rel="noopener"
              className="hover:text-gray-400 transition-colors"
            >
              Benjamin Edwards Photography
            </a>
          </p>
          <p className="text-gray-600 text-xs">
            Powered by Autom8 Media, a division of Edwards Creative Co.
          </p>
        </div>
      </div>
    </footer>
  );
}
