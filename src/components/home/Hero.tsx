import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroCarousel from './HeroCarousel';

export default function Hero() {
  return (
    <HeroCarousel>
      {/* Content — left-aligned, asymmetric */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 mb-6">
            <MapPin className="w-4 h-4 text-sunset-400" />
            <span className="text-white/90 text-sm font-medium">Bend, Oregon</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            Bendy
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-lg leading-relaxed">
            Your guide to outdoor adventures, local events, and everything the Bend area has to offer.
          </p>

          {/* CTA Buttons — 1 primary + 1 secondary max */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sunset-500 hover:bg-sunset-400 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-sunset-500/20 active:translate-y-px"
            >
              Explore Events
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/guides"
              className="w-full sm:w-auto btn-secondary inline-flex items-center justify-center gap-2"
            >
              Local Guides
            </Link>
          </div>
        </div>
      </div>
    </HeroCarousel>
  );
}
