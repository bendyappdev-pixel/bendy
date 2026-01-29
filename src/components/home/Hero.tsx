import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroCarousel from './HeroCarousel';

export default function Hero() {
  return (
    <HeroCarousel>
      {/* Wave Decoration - Bottom of hero */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          className="w-full h-24 md:h-32 text-sand"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,69.3C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 py-16">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <MapPin className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">Bend, Oregon</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-heading drop-shadow-lg">
          Bendy
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto text-balance drop-shadow">
          Your guide to outdoor adventures, local events, and everything the Bend area has to offer.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/events"
            className="btn-primary inline-flex items-center gap-2 bg-white text-forest hover:bg-white/90"
          >
            Explore Events
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/map"
            className="btn-secondary inline-flex items-center gap-2 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
          >
            View Map
          </Link>
        </div>
      </div>
    </HeroCarousel>
  );
}
