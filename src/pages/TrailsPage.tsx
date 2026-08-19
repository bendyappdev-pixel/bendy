import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Mountain,
  Search,
  Footprints,
  TreePine,
  Dog,
  Baby,
  ChevronDown,
  TrendingUp,
  X,
} from 'lucide-react';
import { trails, trailCategories } from '../data/trails';
import { Trail, TrailDifficulty, TrailActivity, TrailSeason } from '../types/trail';
import Reel from '../components/ui/Reel';
import { cn } from '../lib/utils';

interface Filters {
  search: string;
  activity: TrailActivity | null;
  difficulty: TrailDifficulty | null;
  distance: string | null;
  elevation: string | null;
  features: string[];
  season: TrailSeason | null;
}

/**
 * TrailCard — one trail as a poster-format Reel: a stencil index numeral,
 * a mono difficulty chip, and a bottom scrim carrying the name and stats.
 * Everything the old card put in a text block below the photo (description,
 * activity icons, dog/kid badges) now lives on the trail's own detail page.
 */
function TrailCard({ trail, index }: { trail: Trail; index: number }) {
  const numeral = String(index).padStart(2, '0');

  return (
    <Link to={`/trails/${trail.slug}`} className="group block">
      <Reel src={trail.heroImage} alt="" hoverable scrim="bottom" style={{ aspectRatio: '4 / 5' }}>
        <div
          className="stencil absolute left-3 top-3 z-10 text-[32px] text-film-white"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
          aria-hidden="true"
        >
          {numeral}
        </div>

        <div className="small-caps absolute right-3 top-3 z-10 border border-hair bg-film-black/70 px-2.5 py-1 text-whisper">
          {trail.difficulty}
        </div>

        <div className="relative z-10 flex h-full min-w-0 flex-col justify-end p-4">
          <h3 className="film-display text-[24px] leading-[0.95] text-film-white transition-colors group-hover:text-ember">
            {trail.name}
          </h3>
          <div className="mt-2 truncate font-mono text-[10px] uppercase tracking-wide text-whisper">
            {trail.distance} mi · ↑{trail.elevationGain.toLocaleString()} ft ·{' '}
            {trail.estimatedTime}
          </div>
        </div>
      </Reel>
    </Link>
  );
}

/** A single square, hairline-bordered filter chip that opens a dropdown list. */
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
  const active = Boolean(value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'small-caps flex items-center gap-2 border px-4 py-2.5 transition-colors',
          active
            ? 'border-ember text-ember'
            : 'border-hair text-whisper hover:border-film-white hover:text-film-white'
        )}
      >
        {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
        {value ? options.find((o) => o.id === value)?.label : label}
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-2 min-w-[190px] border border-hair bg-film-deep py-2">
            <button
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className={cn(
                'small-caps block w-full px-4 py-2.5 text-left transition-colors',
                !value ? 'text-ember' : 'text-whisper hover:text-film-white'
              )}
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
                className={cn(
                  'small-caps block w-full px-4 py-2.5 text-left transition-colors',
                  value === option.id ? 'text-ember' : 'text-whisper hover:text-film-white'
                )}
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

/** A square, hairline-bordered toggle chip. Ember when active. */
function FeatureToggle({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'small-caps flex items-center gap-2 border px-4 py-2.5 transition-colors',
        active
          ? 'border-ember text-ember'
          : 'border-hair text-whisper hover:border-film-white hover:text-film-white'
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {children}
    </button>
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
    <div>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <Reel
        src="/images/trails/trails-hero.jpg"
        alt="A trail cutting through Central Oregon forest"
        priority
        scrim="bottom"
        className="flex border-b border-hair"
        style={{ minHeight: 'min(56vh, 520px)' }}
      >
        <div className="relative z-10 flex w-full flex-col justify-end px-6 pb-10 pt-24 lg:px-10">
          <div className="small-caps text-ember">Trails</div>
          <h1 className="film-display mt-3 text-[clamp(48px,10vw,150px)] text-film-white">
            Every Route,
            <br />
            Cut To Reel.
          </h1>
          <p className="small-caps mt-4 text-whisper">
            {trails.length} trails near Bend, Oregon
          </p>
        </div>
      </Reel>

      {/* Main Content */}
      <div className="container-app py-10">
        {/* Search & Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-whisper"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search trails…"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full border border-hair bg-film-deep py-3 pl-11 pr-4 font-mono text-[16px] md:text-[13px] text-film-white placeholder:text-whisper focus:border-ember focus:outline-none"
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

            {/* Feature Toggle Chips */}
            <FeatureToggle
              active={filters.features.includes('dog-friendly')}
              icon={Dog}
              onClick={() => {
                const newFeatures = filters.features.includes('dog-friendly')
                  ? filters.features.filter((f) => f !== 'dog-friendly')
                  : [...filters.features, 'dog-friendly'];
                setFilters({ ...filters, features: newFeatures });
              }}
            >
              Dog-friendly
            </FeatureToggle>
            <FeatureToggle
              active={filters.features.includes('kid-friendly')}
              icon={Baby}
              onClick={() => {
                const newFeatures = filters.features.includes('kid-friendly')
                  ? filters.features.filter((f) => f !== 'kid-friendly')
                  : [...filters.features, 'kid-friendly'];
                setFilters({ ...filters, features: newFeatures });
              }}
            >
              Kid-friendly
            </FeatureToggle>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="small-caps flex items-center gap-2 px-4 py-2.5 text-whisper transition-colors hover:text-film-white"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Clear ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-8 flex items-center justify-between border-t border-hair pt-6">
          <p className="font-mono text-[12px] text-whisper">
            Showing <span className="text-film-white">{filteredTrails.length}</span> trails
          </p>
        </div>

        {/* Trail Grid */}
        {filteredTrails.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrails.map((trail, i) => (
              <TrailCard key={trail.id} trail={trail} index={i + 1} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Mountain className="mx-auto mb-4 h-16 w-16 text-whisper" aria-hidden="true" />
            <h3 className="film-display text-[28px] text-film-white">No trails found</h3>
            <p className="mt-2 text-mist">Try adjusting your filters to find more trails.</p>
            <button onClick={clearFilters} className="btn-primary mt-6">
              Clear Filters
            </button>
          </div>
        )}

        {/* Trail Tips Section */}
        <div className="mt-16 border-t border-hair pt-10">
          <h3 className="small-caps text-whisper">Trail Tips</h3>
          <div className="mt-6 grid grid-cols-1 border-y border-hair md:grid-cols-3">
            <div className="p-6 md:border-r md:border-hair">
              <div className="film-display-thin text-[22px] text-film-white">Easy Trails</div>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-whisper">
                Gentle grades, well-maintained, suitable for all fitness levels.
              </p>
            </div>
            <div className="border-t border-hair p-6 md:border-t-0 md:border-r">
              <div className="film-display-thin text-[22px] text-film-white">Moderate Trails</div>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-whisper">
                Some elevation, uneven terrain, moderate fitness required.
              </p>
            </div>
            <div className="border-t border-hair p-6 md:border-t-0">
              <div className="film-display-thin text-[22px] text-film-white">Expert Trails</div>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-whisper">
                Steep climbs, technical terrain, experienced hikers only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
