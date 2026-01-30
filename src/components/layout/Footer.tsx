import { MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-forest text-white mt-auto">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-heading">Bendy</span>
            </div>
            <p className="text-sage text-sm">
              Your guide to the best of Bend, Oregon. Discover events, outdoor adventures, and local favorites.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/events" className="text-sage hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-sage hover:text-white transition-colors">
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link to="/category/outdoor" className="text-sage hover:text-white transition-colors">
                  Outdoor Activities
                </Link>
              </li>
              <li>
                <Link to="/category/food" className="text-sage hover:text-white transition-colors">
                  Food & Drink
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold mb-4">About Bend</h3>
            <p className="text-sage text-sm mb-4">
              Bend is located in Central Oregon at the foot of the Cascade Range. Known for outdoor recreation, craft breweries, and stunning natural beauty.
            </p>
            <p className="text-sage text-sm">
              Population: ~100,000<br />
              Elevation: 3,623 ft
            </p>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sage text-sm">
            © {new Date().getFullYear()} Bendy. Not affiliated with the City of Bend.
          </p>
          <p className="text-sage text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> in Bend, Oregon
          </p>
        </div>

        <div className="mt-6 text-center space-y-1">
          <p className="text-sage/60 text-xs">
            Photography by{' '}
            <a
              href="https://www.benjaminedwardsphotography.com"
              target="_blank"
              rel="noopener"
              className="hover:text-sage transition-colors"
            >
              Benjamin Edwards Photography
            </a>
          </p>
          <p className="text-sage/60 text-xs">
            Powered by Autom8 Media, a division of Edwards Creative Co.
          </p>
        </div>
      </div>
    </footer>
  );
}
