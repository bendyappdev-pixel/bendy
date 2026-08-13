import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tent,
  Truck,
  TreePine,
  Mountain,
  Waves,
  Flame,
  Car,
  MapPin,
  ExternalLink,
  AlertTriangle,
  Droplets,
  Wifi,
  ShowerHead,
  Anchor,
  Signal,
  Clock,
  Navigation,
  ChevronRight,
  ParkingCircle,
  Compass,
  Sun,
  Footprints,
} from 'lucide-react';
import { campgrounds, campCategories } from '../data/campgrounds';
import { dispersedSites, dispersedCategories, dispersedRules } from '../data/dispersedSites';
import { Campground, DispersedSite, CampCategory, DispersedCategory } from '../types/camping';
import Reel from '../components/ui/Reel';
import SceneHeader from '../components/ui/SceneHeader';
import { crowdMetaForCamping } from '../components/ui/CrowdBadge';
import { cn } from '../lib/utils';

type ViewMode = 'base-camp' | 'off-grid';

const categoryIcons: Record<string, React.ElementType> = {
  'state-park': TreePine,
  'high-lakes': Mountain,
  'river': Waves,
  'volcanic': Flame,
  'rv-park': Truck,
  'sno-park': ParkingCircle,
  'dispersed-forest': TreePine,
  'dispersed-desert': Sun,
  'trailhead': Footprints,
};

/* Chapter accent per the handoff's category map. */
const categoryAccent: Record<CampCategory | DispersedCategory, string> = {
  'state-park': 'var(--lake)',
  'river': 'var(--lake)',
  'high-lakes': 'var(--pine)',
  'dispersed-forest': 'var(--pine)',
  'volcanic': 'var(--ember)',
  'dispersed-desert': 'var(--ember)',
  'rv-park': 'var(--gold)',
  'sno-park': 'var(--gold)',
  'trailhead': 'var(--ember)',
};

const categoryLabels: Record<string, string> = Object.fromEntries(
  [...campCategories, ...dispersedCategories].map((c) => [c.id, c.label])
);

const amenityIcons: Record<string, { icon: React.ElementType; label: string }> = {
  'water': { icon: Droplets, label: 'Water' },
  'toilets': { icon: TreePine, label: 'Toilets' },
  'vault-toilets': { icon: TreePine, label: 'Vault Toilets' },
  'showers': { icon: ShowerHead, label: 'Showers' },
  'hookups': { icon: Truck, label: 'Hookups' },
  'boat-launch': { icon: Anchor, label: 'Boat Launch' },
  'wifi': { icon: Wifi, label: 'WiFi' },
  'pool': { icon: Waves, label: 'Pool' },
};

/**
 * CampgroundCard — a Reel carrying the site's heroImage (the deliberate
 * campsite-slot-with-photo pattern; never drop this), a chapter-accent
 * category tag, and a mono distance/direction/elevation/cost row. Amenities,
 * highlights and actions live below in a hairline detail block.
 */
function CampgroundCard({ campground }: { campground: Campground }) {
  const accent = categoryAccent[campground.category];

  return (
    <div className="border border-hair">
      <Reel src={campground.heroImage} alt="" scrim="bottom" style={{ aspectRatio: '4 / 3' }}>
        <div
          className="small-caps absolute right-3 top-3 z-10 border border-hair bg-film-black/70 px-2.5 py-1"
          style={{ color: accent }}
          aria-hidden="true"
        >
          {categoryLabels[campground.category] ?? campground.category}
        </div>

        <div className="relative z-10 flex h-full min-w-0 flex-col justify-end p-4">
          <h3 className="film-display-thin text-[22px] leading-[0.95] text-film-white">
            {campground.name}
          </h3>
          <div className="mt-2 truncate font-mono text-[10px] uppercase tracking-wide text-whisper">
            {campground.distance} mi {campground.direction}
            {campground.elevation ? ` · ${campground.elevation.toLocaleString()} ft` : ''}
            {' · '}
            {campground.cost}
          </div>
        </div>
      </Reel>

      <div className="p-5">
        <p className="line-clamp-2 text-[13px] leading-relaxed text-mist">
          {campground.description}
        </p>

        {/* Amenities */}
        <div className="mt-4 flex flex-wrap gap-2">
          {campground.amenities.slice(0, 5).map((amenity) => {
            const amenityInfo = amenityIcons[amenity];
            if (!amenityInfo) return null;
            const Icon = amenityInfo.icon;
            return (
              <span
                key={amenity}
                className="flex items-center gap-1.5 border border-hair px-2 py-1 font-mono text-[10px] uppercase text-whisper"
                title={amenityInfo.label}
              >
                <Icon className="h-3 w-3" aria-hidden="true" />
                {amenityInfo.label}
              </span>
            );
          })}
        </div>

        {/* Season & site count */}
        <div className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase text-whisper">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {campground.season}
          <span aria-hidden="true">·</span>
          <span>{campground.sites} sites</span>
        </div>

        {/* Highlights */}
        <div className="mt-3 flex flex-wrap gap-2">
          {campground.highlights.slice(0, 3).map((highlight) => (
            <span
              key={highlight}
              className="border border-hair px-2 py-0.5 font-mono text-[10px] text-whisper"
            >
              {highlight}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          {campground.reservationUrl && (
            <a
              href={campground.reservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 justify-center"
            >
              Reserve
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${campground.coordinates.lat},${campground.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex-1 justify-center"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Directions
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * DispersedCard — same Reel-first pattern as CampgroundCard. Crowding is
 * never coloured by hand: it always goes through `crowdMetaForCamping`.
 */
function DispersedCard({ site }: { site: DispersedSite }) {
  const accent = categoryAccent[site.category];
  const crowd = crowdMetaForCamping(site.crowding);

  return (
    <div className="border border-hair">
      <Reel src={site.heroImage} alt="" scrim="bottom" style={{ aspectRatio: '4 / 3' }}>
        <div
          className="small-caps absolute right-3 top-3 z-10 border border-hair bg-film-black/70 px-2.5 py-1"
          style={{ color: accent }}
          aria-hidden="true"
        >
          {categoryLabels[site.category] ?? site.category}
        </div>

        <div className="relative z-10 flex h-full min-w-0 flex-col justify-end p-4">
          <h3 className="film-display-thin text-[22px] leading-[0.95] text-film-white">
            {site.name}
          </h3>
          <div className="mt-2 truncate font-mono text-[10px] uppercase tracking-wide text-whisper">
            {site.distance} mi {site.direction} · {site.cost}
          </div>
        </div>
      </Reel>

      <div className="p-5">
        <p className="line-clamp-2 text-[13px] leading-relaxed text-mist">{site.description}</p>

        {/* Access, cell service, crowding */}
        <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] uppercase">
          <span className="flex items-center gap-1.5 border border-hair px-2 py-1 text-whisper">
            <Car className="h-3 w-3" aria-hidden="true" />
            {site.access}
          </span>
          <span className="flex items-center gap-1.5 border border-hair px-2 py-1 text-whisper">
            <Signal className="h-3 w-3" aria-hidden="true" />
            {site.cellService} cell
          </span>
          <span
            className="flex items-center gap-1.5 border border-hair px-2 py-1"
            style={{ color: crowd.color }}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: crowd.color, boxShadow: `0 0 6px ${crowd.color}` }}
            />
            {crowd.label} crowds
          </span>
        </div>

        {/* Best for */}
        <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase text-whisper">
          <span>Best for</span>
          {site.bestFor.map((type) => (
            <span key={type} className="text-film-white">
              {type}
            </span>
          ))}
        </div>

        {/* Season */}
        <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase text-whisper">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {site.season}
        </div>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${site.coordinates.lat},${site.coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary mt-5 w-full justify-center"
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Directions
        </a>
      </div>
    </div>
  );
}

function DispersedWarning() {
  return (
    <div className="mb-6 border border-hair bg-film-deep p-6">
      <div className="flex items-start gap-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-ember" aria-hidden="true" />
        <div className="min-w-0">
          <h3 className="film-display-thin text-[20px] text-film-white">
            Dispersed Camping Rules
          </h3>
          <ul className="mt-3 space-y-1.5 font-mono text-[11px] leading-relaxed text-whisper">
            {dispersedRules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2">
                <ChevronRight
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember"
                  aria-hidden="true"
                />
                {rule}
              </li>
            ))}
          </ul>
          <a
            href="https://centraloregonfire.org"
            target="_blank"
            rel="noopener noreferrer"
            className="small-caps mt-4 inline-flex items-center gap-2 text-ember"
          >
            Check Fire Restrictions
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

/** A square, hairline-bordered toggle chip. Ember when active. Shared by the
    Base Camp / Off-Grid view switch and the category filter row. */
function FilterChip({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ElementType;
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
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      {children}
    </button>
  );
}

const resources: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  external: boolean;
}[] = [
  {
    href: 'https://www.recreation.gov',
    icon: ExternalLink,
    title: 'Recreation.gov',
    description: 'Federal campground reservations',
    external: true,
  },
  {
    href: 'https://www.reserveamerica.com',
    icon: ExternalLink,
    title: 'ReserveAmerica',
    description: 'Oregon State Parks reservations',
    external: true,
  },
  {
    href: 'https://centraloregonfire.org',
    icon: Flame,
    title: 'Fire Restrictions',
    description: 'Current fire danger & restrictions',
    external: true,
  },
  {
    href: 'https://www.fs.usda.gov/detail/r6/passes-permits/recreation',
    icon: ExternalLink,
    title: 'NW Forest Pass',
    description: '$5/day or $30/year',
    external: true,
  },
  {
    href: 'https://lnt.org/why/7-principles/',
    icon: TreePine,
    title: 'Leave No Trace',
    description: '7 principles for outdoor ethics',
    external: true,
  },
];

export default function CampingPage() {
  const [view, setView] = useState<ViewMode>('base-camp');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter campgrounds
  const filteredCampgrounds =
    selectedCategory === 'all'
      ? campgrounds
      : campgrounds.filter((c) => c.category === selectedCategory);

  // Filter dispersed sites
  const filteredDispersed =
    selectedCategory === 'all'
      ? dispersedSites
      : dispersedSites.filter((s) => s.category === selectedCategory);

  const currentCategories = view === 'base-camp' ? campCategories : dispersedCategories;

  return (
    <div>
      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="border-b border-hair bg-film-deep">
        <div className="container-app py-14">
          <SceneHeader
            as="h1"
            kicker="Camping"
            /* nowrap on the hyphenated word: browsers break after a hyphen,
               which stranded a dangling "OFF-" at the end of a line. */
            title={
              <>
                Basecamp Or <span className="whitespace-nowrap">Off-Grid.</span>
              </>
            }
            meta={
              <>
                {campgrounds.length + dispersedSites.length} sites within 50 mi
                <br />
                State parks to sno-park pull-outs
              </>
            }
          >
            <p className="max-w-md leading-relaxed text-mist md:ml-auto">
              Established campgrounds with hot showers, or a forest road nobody else knows
              about. Pick a chapter, then a category.
            </p>
          </SceneHeader>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-app py-10">
        {/* View Toggle */}
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={view === 'base-camp'}
            icon={Tent}
            onClick={() => {
              setView('base-camp');
              setSelectedCategory('all');
            }}
          >
            Base Camp
          </FilterChip>
          <FilterChip
            active={view === 'off-grid'}
            icon={Compass}
            onClick={() => {
              setView('off-grid');
              setSelectedCategory('all');
            }}
          >
            Off-Grid
          </FilterChip>
        </div>

        {/* Description */}
        <div className="mt-6 border-t border-hair pt-6">
          {view === 'base-camp' ? (
            <p className="text-mist">
              Established campgrounds including state parks, high lakes along the Cascade
              Lakes Scenic Byway, river camps on the Metolius, volcanic sites at Newberry, and
              RV parks.
            </p>
          ) : (
            <p className="text-mist">
              Dispersed camping, van life spots, and overlanding destinations. Free or
              low-cost camping on National Forest and BLM land.
            </p>
          )}
        </div>

        {/* Dispersed Warning */}
        {view === 'off-grid' && (
          <div className="mt-6">
            <DispersedWarning />
          </div>
        )}

        {/* Category Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          <FilterChip active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')}>
            All ({view === 'base-camp' ? campgrounds.length : dispersedSites.length})
          </FilterChip>
          {currentCategories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Tent;
            return (
              <FilterChip
                key={cat.id}
                active={selectedCategory === cat.id}
                icon={Icon}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label} ({cat.count})
              </FilterChip>
            );
          })}
        </div>

        {/* Results Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {view === 'base-camp'
            ? filteredCampgrounds.map((campground) => (
                <CampgroundCard key={campground.id} campground={campground} />
              ))
            : filteredDispersed.map((site) => <DispersedCard key={site.id} site={site} />)}
        </div>

        {/* Resources Section */}
        <div className="mt-16 border-t border-hair pt-10">
          <h3 className="small-caps text-whisper">Helpful Resources</h3>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <a
                key={resource.title}
                href={resource.href}
                target={resource.external ? '_blank' : undefined}
                rel={resource.external ? 'noopener noreferrer' : undefined}
                className="row-hover flex items-start gap-3 border border-hair p-4 transition-colors"
              >
                <resource.icon className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="film-display-thin text-[16px] text-film-white">
                    {resource.title}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-whisper">
                    {resource.description}
                  </p>
                </div>
              </a>
            ))}
            <Link
              to="/map"
              className="row-hover flex items-start gap-3 border border-hair p-4 transition-colors"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden="true" />
              <div className="min-w-0">
                <p className="film-display-thin text-[16px] text-film-white">Interactive Map</p>
                <p className="mt-0.5 font-mono text-[11px] text-whisper">
                  View all locations on map
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
