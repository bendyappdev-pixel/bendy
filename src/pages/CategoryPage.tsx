import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Mountain,
  Snowflake,
  Bike,
  TreePine,
  Dog,
  Footprints,
  ExternalLink,
  Baby,
  Gamepad2,
  GraduationCap,
  Waves,
  Sun,
} from 'lucide-react';
import { locations } from '../data/locations';
import { categories } from '../data/categories';
import { Location } from '../types';
import Reel from '../components/ui/Reel';
import { cn } from '../lib/utils';

interface Subcategory {
  id: string;
  label: string;
  icon: typeof Mountain;
  filter: (loc: Location) => boolean;
}

const outdoorSubcategories: Subcategory[] = [
  {
    id: 'all',
    label: 'All',
    icon: Mountain,
    filter: () => true,
  },
  {
    id: 'skiing',
    label: 'Skiing',
    icon: Snowflake,
    filter: (loc) => loc.type === 'ski',
  },
  {
    id: 'biking',
    label: 'Mountain Biking',
    icon: Bike,
    filter: (loc) => loc.type === 'trailhead' && (loc.amenities?.some(a => a.toLowerCase().includes('bike')) || loc.name.toLowerCase().includes('phil')),
  },
  {
    id: 'climbing',
    label: 'Rock Climbing',
    icon: Mountain,
    filter: (loc) => loc.amenities?.some(a => a.toLowerCase().includes('climb')) || loc.name.toLowerCase().includes('smith rock'),
  },
  {
    id: 'parks',
    label: 'Parks',
    icon: TreePine,
    filter: (loc) => loc.type === 'park',
  },
  {
    id: 'dogs',
    label: 'Dog Friendly',
    icon: Dog,
    filter: (loc) => loc.type === 'dog-park' || (loc.amenities?.some(a => a.toLowerCase().includes('dog')) ?? false),
  },
  {
    id: 'hiking',
    label: 'Hiking',
    icon: Footprints,
    filter: (loc) => loc.type === 'trailhead' || (loc.type === 'park' && !!loc.difficulty),
  },
];

const kidsSubcategories: Subcategory[] = [
  {
    id: 'all',
    label: 'All',
    icon: Baby,
    filter: () => true,
  },
  {
    id: 'indoor',
    label: 'Indoor Play',
    icon: Gamepad2,
    filter: (loc) => loc.type === 'family' && (
      loc.amenities?.some(a => ['trampoline', 'arcade', 'bowling', 'laser tag', 'go-kart', 'climbing', 'ninja'].some(k => a.toLowerCase().includes(k))) ?? false
    ),
  },
  {
    id: 'museums',
    label: 'Museums & Learning',
    icon: GraduationCap,
    filter: (loc) => loc.type === 'museum',
  },
  {
    id: 'water',
    label: 'Water Fun',
    icon: Waves,
    filter: (loc) => loc.amenities?.some(a => ['pool', 'water', 'kayak', 'tube', 'lazy river', 'swim'].some(k => a.toLowerCase().includes(k))) ?? false,
  },
  {
    id: 'outdoor',
    label: 'Outdoor Adventures',
    icon: Sun,
    filter: (loc) => loc.amenities?.some(a => ['sledding', 'cave', 'train', 'ice skating'].some(k => a.toLowerCase().includes(k))) ?? false,
  },
];

const categoryInfo: Record<string, {
  title: string;
  description: string;
  types: Location['type'][];
  subcategories?: Subcategory[];
}> = {
  outdoor: {
    title: 'Outdoor Activities',
    description: 'Hiking, skiing, mountain biking, and all the adventures that make Bend an outdoor paradise.',
    types: ['park', 'trailhead', 'ski', 'recreation', 'dog-park'],
    subcategories: outdoorSubcategories,
  },
  food: {
    title: 'Food & Drink',
    description: 'From craft breweries to local restaurants, explore Bend\'s vibrant food scene.',
    types: ['brewery', 'restaurant'],
  },
  kids: {
    title: 'Bendy Kids',
    description: 'Family-friendly fun in Bend and Sunriver! Museums, play spaces, water parks, and outdoor adventures for all ages.',
    types: ['family', 'museum'],
    subcategories: kidsSubcategories,
  },
};

/* Chapter photography, matching the bands the homepage uses for the same
   chapters (Scene 04 · Locations) — one continuous set of stock across the
   product rather than a second unrelated shoot per category. */
const heroImages: Record<string, string | undefined> = {
  outdoor: '/images/trails/broken-top.jpg',
  food: undefined,
  kids: '/images/family-fun-day.jpg',
};

/* Chapter accents, keyed off the same `category.color` field the homepage's
   CategoryCard reads — see FACELIFT_BRIEF.md. */
const categoryAccentMap: Record<string, string> = {
  'bg-mountain': 'var(--ember)', // Events
  'bg-forest': 'var(--pine)', // Outdoor
  'bg-earth': 'var(--gold)', // Food & Drink
  'bg-purple-500': 'var(--lake)', // Bendy Kids
};

/* Difficulty accent — same three-colour logic SequenceCard uses for guide
   difficulty, applied to Location['difficulty'] instead. */
const difficultyAccent: Record<NonNullable<Location['difficulty']>, string> = {
  easy: 'var(--pine)',
  moderate: 'var(--gold)',
  hard: 'var(--ember)',
};

const wildernessAreas = [
  {
    name: 'Three Sisters Wilderness',
    description: 'Over 280,000 acres featuring volcanic peaks, alpine lakes, and pristine forests. Permits required May 15 - October 15.',
    url: 'https://www.recreation.gov/permits/233261',
  },
  {
    name: 'Mt. Jefferson Wilderness',
    description: 'Oregon\'s second highest peak with glaciers, meadows, and over 150 miles of trails. Permits required for day and overnight use.',
    url: 'https://www.recreation.gov/permits/233273',
  },
];

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  const info = category ? categoryInfo[category] : null;
  const [activeSubcategory, setActiveSubcategory] = useState(filterParam || 'all');

  // Update active subcategory when URL param changes
  useEffect(() => {
    if (filterParam && info?.subcategories?.some(s => s.id === filterParam)) {
      setActiveSubcategory(filterParam);
    }
  }, [filterParam, info]);

  if (!info) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="film-display text-[clamp(32px,6vw,64px)] text-film-white">
          Category Not Found
        </h1>
        <Link to="/" className="small-caps mt-4 inline-block text-ember">
          Return Home
        </Link>
      </div>
    );
  }

  // Get base locations for this category
  let filteredLocations = locations.filter((loc) => info.types.includes(loc.type));

  // Apply subcategory filter if applicable
  if (info.subcategories && activeSubcategory !== 'all') {
    const subcat = info.subcategories.find(s => s.id === activeSubcategory);
    if (subcat) {
      filteredLocations = filteredLocations.filter(subcat.filter);
    }
  }

  const chapterIndex = categories.findIndex((c) => c.id === category) + 1;
  const numeral = String(chapterIndex || 1).padStart(2, '0');
  const categoryEntry = categories.find((c) => c.id === category);
  const accent = categoryAccentMap[categoryEntry?.color ?? ''] ?? 'var(--ember)';

  return (
    <div className="pb-16">
      <div className="container-app pt-6">
        <Link
          to="/"
          className="small-caps inline-flex items-center gap-2 text-whisper transition-colors hover:text-film-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="container-app mt-6">
        <Reel
          src={heroImages[category ?? '']}
          scrim="both"
          leak={chapterIndex % 2 === 1}
          priority
          label={`CH${numeral}_${info.title.replace(/\W+/g, '-').toUpperCase()}_BROLL.MOV`}
          // The stencil numeral below is where this page states its chapter
          // number; the timecode carries the title, matching CategoryCard.
          timecode={info.title.toUpperCase()}
          style={{ minHeight: 'min(56vh, 460px)' }}
        >
          <div className="relative z-10 flex h-full min-w-0 flex-col justify-end px-6 pb-10 pt-24 lg:px-16">
            <div
              className="stencil text-[clamp(64px,14vw,180px)] leading-none opacity-70"
              style={{ color: accent }}
              aria-hidden="true"
            >
              {numeral}
            </div>
            <h1 className="film-display mt-4 text-[clamp(40px,8vw,110px)] text-film-white">
              {info.title}
            </h1>
            <p className="serif-i mt-4 max-w-2xl text-[clamp(18px,2vw,24px)] leading-snug text-mist">
              {info.description}
            </p>
          </div>
        </Reel>
      </div>

      <div className="container-app mt-10">
        {/* Subcategory Quick Links */}
        {info.subcategories && (
          <div className="flex flex-wrap gap-2">
            {info.subcategories.map((subcat) => {
              const SubIcon = subcat.icon;
              const active = activeSubcategory === subcat.id;
              return (
                <button
                  key={subcat.id}
                  onClick={() => setActiveSubcategory(subcat.id)}
                  aria-pressed={active}
                  className={cn(
                    'small-caps flex items-center gap-2 border px-4 py-2.5 transition-colors',
                    active
                      ? 'border-ember text-ember'
                      : 'border-hair text-whisper hover:border-film-white hover:text-film-white'
                  )}
                >
                  <SubIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {subcat.label}
                </button>
              );
            })}
            {/* Trails Link - only show for outdoor category */}
            {category === 'outdoor' && (
              <Link
                to="/trails"
                className="small-caps flex items-center gap-2 border border-ember px-4 py-2.5 text-ember transition-colors hover:bg-ember hover:text-film-white"
              >
                <Mountain className="h-3.5 w-3.5" aria-hidden="true" />
                Explore Trails
              </Link>
            )}
          </div>
        )}

        {/* Wilderness Permits Section - Only show for outdoor category */}
        {category === 'outdoor' && (
          <div className="mt-8 border border-hair p-6 md:p-8">
            <h2 className="film-display-thin flex items-center gap-2 text-[22px] text-film-white">
              <Mountain className="h-5 w-5 text-lake" aria-hidden="true" />
              Wilderness Permits
            </h2>
            <p className="mt-2 max-w-2xl text-mist">
              Planning to explore the wilderness areas near Bend? Permits are required for many trails.
            </p>
            <div className="mt-6 border-t border-hair">
              {wildernessAreas.map((area) => (
                <a
                  key={area.name}
                  href={area.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="row-hover flex items-start justify-between gap-4 border-b border-hair py-5 transition-colors"
                >
                  <div className="min-w-0">
                    <h3 className="film-display-thin text-[18px] text-film-white">{area.name}</h3>
                    <p className="mt-1 max-w-lg font-mono text-[11px] leading-relaxed text-whisper">
                      {area.description}
                    </p>
                    <div className="small-caps mt-3 text-ember">Get Permit on Recreation.gov →</div>
                  </div>
                  <ExternalLink className="mt-1 h-4 w-4 flex-shrink-0 text-ember" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Listings ─────────────────────────────────────────────── */}
        <div className="mt-10">
          <div className="small-caps flex items-center justify-between border-b border-hair pb-3 text-whisper">
            <span>Listings</span>
            <span>{filteredLocations.length} places</span>
          </div>

          {filteredLocations.length > 0 ? (
            <div>
              {filteredLocations.map((location) => (
                <LocationRow key={location.id} location={location} />
              ))}
            </div>
          ) : (
            <div className="border-b border-hair py-12 text-center">
              <p className="small-caps text-whisper">No locations found in this category yet.</p>
            </div>
          )}
        </div>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <div className="mt-16 border-t border-hair pt-12 text-center">
          <h3 className="film-display text-[clamp(28px,5vw,56px)] text-film-white">
            Explore On The Map.
          </h3>
          <p className="mx-auto mt-3 max-w-lg leading-relaxed text-mist">
            See all locations on our interactive map and discover even more places to explore.
          </p>
          <Link to="/map" className="btn-primary mt-6">
            Open Map <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function LocationRow({ location }: { location: Location }) {
  return (
    <div className="flex flex-col gap-3 border-b border-hair py-6 md:flex-row md:items-start md:gap-8">
      <div className="min-w-0 md:w-64 md:shrink-0">
        <h3 className="film-display-thin text-[22px] leading-[0.95] text-film-white">
          {location.name}
        </h3>
        {location.difficulty && (
          <div
            className="small-caps mt-2"
            style={{ color: difficultyAccent[location.difficulty] }}
          >
            {location.difficulty}
          </div>
        )}
      </div>

      <p className="min-w-0 flex-1 text-[14px] leading-relaxed text-mist">
        {location.description}
      </p>

      <div className="min-w-0 md:w-64 md:shrink-0">
        {location.amenities && location.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 md:justify-end">
            {location.amenities.map((amenity) => (
              <span
                key={amenity}
                className="border border-hair px-2 py-0.5 font-mono text-[10px] uppercase text-whisper"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}
        {location.website && (
          <a
            href={location.website}
            target="_blank"
            rel="noopener noreferrer"
            className="small-caps mt-2 inline-block text-ember md:block md:text-right"
          >
            Visit site →
          </a>
        )}
      </div>
    </div>
  );
}
