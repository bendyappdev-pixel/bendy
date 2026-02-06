import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Mountain,
  Search,
  Footprints,
  Bike,
  TreePine,
  Snowflake,
  Dog,
  Baby,
  ChevronDown,
  MapPin,
  Clock,
  TrendingUp,
  X,
} from 'lucide-react';
import { trails, trailCategories } from '../data/trails';
import { Trail, TrailDifficulty, TrailActivity, TrailSeason } from '../types/trail';

const activityIcons: Record<TrailActivity, React.ElementType> = {
  hiking: Footprints,
  'mountain-biking': Bike,
  'trail-running': Footprints,
  'cross-country-skiing': Snowflake,
  snowshoeing: Snowflake,
};

const difficultyColors: Record<TrailDifficulty, string> = {
  easy: 'bg-pine-500/20 text-pine-400 border-pine-500/30',
  moderate: 'bg-sunset-500/20 text-sunset-400 border-sunset-500/30',
  difficult: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  expert: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const difficultyDots: Record<TrailDifficulty, string> = {
  easy: 'bg-pine-500',
  moderate: 'bg-sunset-500',
  difficult: 'bg-orange-500',
  expert: 'bg-red-500',
};

interface Filters {
  search: string;
  activity: TrailActivity | null;
  difficulty: TrailDifficulty | null;
  distance: string | null;
  elevation: string | null;
  features: string[];
  season: TrailSeason | null;
}

function TrailCard({ trail }: { trail: Trail }) {
  return (
    <Link
      to={`/trails/${trail.slug}`}
      className="card p-0 overflow-hidden hover:border-sunset-500/50 transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={trail.heroImage}
          alt={trail.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />

        {/* Difficulty Badge */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium border ${difficultyColors[trail.difficulty]}`}>
          {trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1)}
        </span>

        {/* Distance from Bend */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-sm text-white/90">
          <MapPin className="w-3.5 h-3.5" />
          {trail.distanceFromBend} mi {trail.direction}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-sunset-400 transition-colors">
          {trail.name}
        </h3>

        {/* Stats Row */}
        <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <Footprints className="w-3.5 h-3.5" />
            {trail.distance} mi
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {trail.elevationGain.toLocaleString()} ft
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {trail.estimatedTime}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
          {trail.shortDescription}
        </p>

        {/* Activity Icons & Features */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {trail.activities.slice(0, 3).map((activity) => {
              const Icon = activityIcons[activity];
              return (
                <span
                  key={activity}
                  className="w-7 h-7 rounded-lg bg-navy-700/50 flex items-center justify-center"
                  title={activity.replace('-', ' ')}
                >
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {trail.isDogFriendly && (
              <span className="flex items-center gap-1 px-2 py-1 bg-pine-500/10 rounded text-xs text-pine-400">
                <Dog className="w-3 h-3" />
                Dogs OK
              </span>
            )}
            {trail.isKidFriendly && (
              <span className="flex items-center gap-1 px-2 py-1 bg-sunset-500/10 rounded text-xs text-sunset-400">
                <Baby className="w-3 h-3" />
                Kid-friendly
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: string | null;
  options: { id: string; label: string }[];
  onChange: (value: string | null) => void;
  icon?: React.ElementType;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          value
            ? 'bg-sunset-500 text-white'
            : 'bg-navy-800 text-gray-300 hover:bg-navy-700 border border-white/10'
        }`}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {value ? options.find((o) => o.id === value)?.label : label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 z-20 bg-navy-800 border border-white/10 rounded-xl shadow-xl py-2 min-w-[180px]">
            <button
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                !value ? 'text-sunset-400' : 'text-gray-300 hover:bg-navy-700'
              }`}
            >
              All
            </button>
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  value === option.id ? 'text-sunset-400' : 'text-gray-300 hover:bg-navy-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function TrailsPage() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    activity: null,
    difficulty: null,
    distance: null,
    elevation: null,
    features: [],
    season: null,
  });

  // Filter trails
  const filteredTrails = useMemo(() => {
    return trails.filter((trail) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !trail.name.toLowerCase().includes(searchLower) &&
          !trail.shortDescription.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Activity filter
      if (filters.activity && !trail.activities.includes(filters.activity)) {
        return false;
      }

      // Difficulty filter
      if (filters.difficulty && trail.difficulty !== filters.difficulty) {
        return false;
      }

      // Distance filter
      if (filters.distance) {
        const distRange = trailCategories.distances.find((d) => d.id === filters.distance);
        if (distRange && (trail.distance < distRange.min || trail.distance > distRange.max)) {
          return false;
        }
      }

      // Elevation filter
      if (filters.elevation) {
        const elevRange = trailCategories.elevations.find((e) => e.id === filters.elevation);
        if (elevRange && (trail.elevationGain < elevRange.min || trail.elevationGain > elevRange.max)) {
          return false;
        }
      }

      // Features filter
      if (filters.features.length > 0) {
        const hasFeature = filters.features.every((feature) => {
          if (feature === 'dog-friendly') return trail.isDogFriendly;
          if (feature === 'kid-friendly') return trail.isKidFriendly;
          if (feature === 'loop') return trail.trailType === 'loop';
          return trail.features.some((f) => f.includes(feature));
        });
        if (!hasFeature) return false;
      }

      // Season filter
      if (filters.season && trail.seasonalAccess !== filters.season) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const activeFilterCount = [
    filters.activity,
    filters.difficulty,
    filters.distance,
    filters.elevation,
    filters.season,
    filters.features.length > 0,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({
      search: '',
      activity: null,
      difficulty: null,
      distance: null,
      elevation: null,
      features: [],
      season: null,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[30vh] md:h-[40vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920"
          alt="Trail in Central Oregon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/30" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-app">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sunset-500 to-sunset-600 rounded-xl flex items-center justify-center">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Trails</h1>
                <p className="text-gray-300">{trails.length} trails near Bend, Oregon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-app py-8">
        {/* Search & Filters */}
        <div className="space-y-4 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search trails..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-navy-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sunset-500/50"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-2">
            <FilterDropdown
              label="Activity"
              value={filters.activity}
              options={trailCategories.activities}
              onChange={(v) => setFilters({ ...filters, activity: v as TrailActivity | null })}
              icon={Footprints}
            />
            <FilterDropdown
              label="Difficulty"
              value={filters.difficulty}
              options={trailCategories.difficulties}
              onChange={(v) => setFilters({ ...filters, difficulty: v as TrailDifficulty | null })}
              icon={TrendingUp}
            />
            <FilterDropdown
              label="Distance"
              value={filters.distance}
              options={trailCategories.distances}
              onChange={(v) => setFilters({ ...filters, distance: v })}
            />
            <FilterDropdown
              label="Elevation"
              value={filters.elevation}
              options={trailCategories.elevations}
              onChange={(v) => setFilters({ ...filters, elevation: v })}
            />
            <FilterDropdown
              label="Season"
              value={filters.season}
              options={trailCategories.seasons}
              onChange={(v) => setFilters({ ...filters, season: v as TrailSeason | null })}
              icon={TreePine}
            />

            {/* Feature Toggle Buttons */}
            <button
              onClick={() => {
                const newFeatures = filters.features.includes('dog-friendly')
                  ? filters.features.filter((f) => f !== 'dog-friendly')
                  : [...filters.features, 'dog-friendly'];
                setFilters({ ...filters, features: newFeatures });
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                filters.features.includes('dog-friendly')
                  ? 'bg-pine-600 text-white'
                  : 'bg-navy-800 text-gray-300 hover:bg-navy-700 border border-white/10'
              }`}
            >
              <Dog className="w-4 h-4" />
              Dog-friendly
            </button>
            <button
              onClick={() => {
                const newFeatures = filters.features.includes('kid-friendly')
                  ? filters.features.filter((f) => f !== 'kid-friendly')
                  : [...filters.features, 'kid-friendly'];
                setFilters({ ...filters, features: newFeatures });
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                filters.features.includes('kid-friendly')
                  ? 'bg-pine-600 text-white'
                  : 'bg-navy-800 text-gray-300 hover:bg-navy-700 border border-white/10'
              }`}
            >
              <Baby className="w-4 h-4" />
              Kid-friendly
            </button>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                Clear ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            Showing <span className="text-white font-medium">{filteredTrails.length}</span> trails
          </p>
        </div>

        {/* Trail Grid */}
        {filteredTrails.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrails.map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Mountain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No trails found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters to find more trails.</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        )}

        {/* Trail Tips Section */}
        <div className="mt-12 card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Trail Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-navy-700/50 rounded-xl">
              <div className="w-10 h-10 bg-sunset-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className={`w-3 h-3 rounded-full ${difficultyDots.easy}`} />
              </div>
              <div>
                <p className="font-medium text-white">Easy Trails</p>
                <p className="text-sm text-gray-400">Gentle grades, well-maintained, suitable for all fitness levels</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-navy-700/50 rounded-xl">
              <div className="w-10 h-10 bg-sunset-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className={`w-3 h-3 rounded-full ${difficultyDots.moderate}`} />
              </div>
              <div>
                <p className="font-medium text-white">Moderate Trails</p>
                <p className="text-sm text-gray-400">Some elevation, uneven terrain, moderate fitness required</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-navy-700/50 rounded-xl">
              <div className="w-10 h-10 bg-sunset-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className={`w-3 h-3 rounded-full ${difficultyDots.expert}`} />
              </div>
              <div>
                <p className="font-medium text-white">Expert Trails</p>
                <p className="text-sm text-gray-400">Steep climbs, technical terrain, experienced hikers only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
