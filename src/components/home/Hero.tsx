import { ArrowRight, MapPin, Compass, Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroCarousel from './HeroCarousel';

export default function Hero() {
  return (
    <HeroCarousel>
      {/* Content */}
      <div className="relative z-10 text-center px-4 py-16 max-w-4xl mx-auto">
        {/* Location Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
          <MapPin className="w-4 h-4 text-sunset-400" />
          <span className="text-white/90 text-sm font-medium">Bend, Oregon</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
          Bendy
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed text-balance drop-shadow">
          Your guide to outdoor adventures, local events, and everything the Bend area has to offer.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sunset-500 hover:bg-sunset-400 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-sunset-500/25"
          >
            Explore Events
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/map"
            className="w-full sm:w-auto btn-secondary inline-flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            View Map
          </Link>
          <Link
            to="/guides"
            className="w-full sm:w-auto btn-secondary inline-flex items-center justify-center gap-2"
          >
            <Compass className="w-5 h-5" />
            Local Guides
          </Link>
          <Link
            to="/trails"
            className="w-full sm:w-auto btn-secondary inline-flex items-center justify-center gap-2"
          >
            <Mountain className="w-5 h-5" />
            Trails
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </HeroCarousel>
  );
}
