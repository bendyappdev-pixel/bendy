import { Link } from 'react-router-dom';
import { Compass, Clock, Mountain, Sun, Snowflake, Leaf, Flower2 } from 'lucide-react';
import { guides } from '../data/guides';
import { Guide, Season, Difficulty } from '../types/guide';

const seasonIcons: Record<Season, typeof Sun> = {
  spring: Flower2,
  summer: Sun,
  fall: Leaf,
  winter: Snowflake,
};

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-pine-500/20 text-pine-400',
  moderate: 'bg-sunset-500/20 text-sunset-400',
  challenging: 'bg-red-500/20 text-red-400',
};

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      to={`/guides/${guide.slug}`}
      className="group card overflow-hidden hover:border-sunset-500/50 transition-all duration-300"
    >
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={guide.heroImage}
          alt={guide.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent" />

        {/* Difficulty Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${difficultyColors[guide.difficulty]}`}>
            {guide.difficulty}
          </span>
        </div>

        {/* Season Icons */}
        <div className="absolute top-4 left-4 flex gap-1">
          {guide.seasons.map((season) => {
            const Icon = seasonIcons[season];
            return (
              <span
                key={season}
                className="w-7 h-7 rounded-full bg-navy-900/70 backdrop-blur-sm flex items-center justify-center"
                title={season.charAt(0).toUpperCase() + season.slice(1)}
              >
                <Icon className="w-4 h-4 text-sunset-400" />
              </span>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sunset-400 transition-colors">
          {guide.title}
        </h3>
        <p className="text-sunset-400 text-sm font-medium mb-3">{guide.tagline}</p>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{guide.description}</p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {guide.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Mountain className="w-4 h-4" />
            {guide.stops.length} stops
          </span>
        </div>

        {/* Best For Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {guide.bestFor.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-navy-700/50 rounded-lg text-xs text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function GuidesPage() {
  return (
    <div className="container-app py-8 md:py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-sunset-500 to-sunset-400 rounded-xl flex items-center justify-center">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Local Guides</h1>
            <p className="text-gray-400">Curated day-long adventures from locals who know Bend best</p>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="card p-6 md:p-8 mb-10 border-sunset-500/30">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-3">
              Your Perfect Day in Bend, Planned
            </h2>
            <p className="text-gray-400">
              Skip the research and get straight to the adventure. Each guide is crafted by locals
              who've spent years exploring Central Oregon. From sunrise to sunset, we've mapped out
              the best stops, optimal timing, and insider tips to make your visit unforgettable.
            </p>
          </div>
          <div className="flex gap-4 text-center">
            <div className="px-4">
              <div className="text-3xl font-bold text-sunset-400">{guides.length}</div>
              <div className="text-sm text-gray-500">Guides</div>
            </div>
            <div className="px-4 border-l border-white/10">
              <div className="text-3xl font-bold text-sunset-400">
                {guides.reduce((acc, g) => acc + g.stops.length, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Stops</div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <p className="text-gray-400 mb-4">
          Have a favorite local itinerary? We'd love to feature it!
        </p>
        <button className="btn-secondary">
          Submit a Guide
        </button>
      </div>
    </div>
  );
}
