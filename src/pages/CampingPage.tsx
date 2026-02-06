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
import { Campground, DispersedSite } from '../types/camping';

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

function CampgroundCard({ campground }: { campground: Campground }) {
  const CategoryIcon = categoryIcons[campground.category] || Tent;
  const isFree = campground.cost.toLowerCase().includes('free');

  return (
    <div className="card p-5 hover:border-sunset-500/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-pine-700/30 flex items-center justify-center">
            <CategoryIcon className="w-4 h-4 text-pine-400" />
          </span>
          <div>
            <h3 className="font-semibold text-white">{campground.name}</h3>
            <p className="text-xs text-gray-500">{campground.distance} mi {campground.direction} of Bend</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
          isFree ? 'bg-pine-500/20 text-pine-400' : 'bg-sunset-500/20 text-sunset-400'
        }`}>
          {campground.cost}
        </span>
      </div>

      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{campground.description}</p>

      {/* Amenities */}
      <div className="flex flex-wrap gap-2 mb-3">
        {campground.amenities.slice(0, 5).map((amenity) => {
          const amenityInfo = amenityIcons[amenity];
          if (!amenityInfo) return null;
          const Icon = amenityInfo.icon;
          return (
            <span
              key={amenity}
              className="flex items-center gap-1 px-2 py-1 bg-navy-700/50 rounded text-xs text-gray-400"
              title={amenityInfo.label}
            >
              <Icon className="w-3 h-3" />
              {amenityInfo.label}
            </span>
          );
        })}
      </div>

      {/* Site Types */}
      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {campground.season}
        </span>
        <span>•</span>
        <span>{campground.sites} sites</span>
      </div>

      {/* Highlights */}
      <div className="flex flex-wrap gap-1 mb-4">
        {campground.highlights.slice(0, 3).map((highlight) => (
          <span key={highlight} className="px-2 py-0.5 bg-navy-700/30 rounded text-xs text-gray-500">
            {highlight}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {campground.reservationUrl && (
          <a
            href={campground.reservationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1"
          >
            Reserve
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${campground.coordinates.lat},${campground.coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-1"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </a>
      </div>
    </div>
  );
}

function DispersedCard({ site }: { site: DispersedSite }) {
  const CategoryIcon = categoryIcons[site.category] || Compass;

  return (
    <div className="card p-5 hover:border-sunset-500/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-sunset-500/20 flex items-center justify-center">
            <CategoryIcon className="w-4 h-4 text-sunset-400" />
          </span>
          <div>
            <h3 className="font-semibold text-white">{site.name}</h3>
            <p className="text-xs text-gray-500">{site.distance} mi {site.direction} of Bend</p>
          </div>
        </div>
        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-pine-500/20 text-pine-400">
          {site.cost}
        </span>
      </div>

      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{site.description}</p>

      {/* Access & Cell Service */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
          site.access === '2WD' ? 'bg-pine-500/20 text-pine-400' :
          site.access === 'High Clearance' ? 'bg-sunset-500/20 text-sunset-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          <Car className="w-3 h-3" />
          {site.access}
        </span>
        <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
          site.cellService === 'Good' ? 'bg-pine-500/20 text-pine-400' :
          site.cellService === 'Limited' ? 'bg-sunset-500/20 text-sunset-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          <Signal className="w-3 h-3" />
          {site.cellService} cell
        </span>
        <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
          site.crowding === 'Low' ? 'bg-pine-500/20 text-pine-400' :
          site.crowding === 'Moderate' ? 'bg-sunset-500/20 text-sunset-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          Crowding: {site.crowding}
        </span>
      </div>

      {/* Best For */}
      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
        <span>Best for:</span>
        {site.bestFor.map((type) => (
          <span key={type} className="capitalize">{type}</span>
        ))}
      </div>

      {/* Season */}
      <div className="flex items-center gap-1 mb-4 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        {site.season}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${site.coordinates.lat},${site.coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-1"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </a>
      </div>
    </div>
  );
}

function DispersedWarning() {
  return (
    <div className="card p-5 border-sunset-500/30 bg-sunset-500/5 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-sunset-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-white mb-2">Dispersed Camping Rules</h3>
          <ul className="space-y-1 text-sm text-gray-400">
            {dispersedRules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-sunset-500 flex-shrink-0 mt-0.5" />
                {rule}
              </li>
            ))}
          </ul>
          <a
            href="https://centraloregonfire.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-sunset-400 hover:text-sunset-300 text-sm font-medium"
          >
            Check Fire Restrictions
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CampingPage() {
  const [view, setView] = useState<ViewMode>('base-camp');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter campgrounds
  const filteredCampgrounds = selectedCategory === 'all'
    ? campgrounds
    : campgrounds.filter((c) => c.category === selectedCategory);

  // Filter dispersed sites
  const filteredDispersed = selectedCategory === 'all'
    ? dispersedSites
    : dispersedSites.filter((s) => s.category === selectedCategory);

  const currentCategories = view === 'base-camp' ? campCategories : dispersedCategories;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[30vh] md:h-[40vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920"
          alt="Camping in Central Oregon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/30" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-app">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pine-600 to-pine-500 rounded-xl flex items-center justify-center">
                <Tent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Camping</h1>
                <p className="text-gray-300">50+ campgrounds within 50 miles of Bend</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-app py-8">
        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setView('base-camp'); setSelectedCategory('all'); }}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-medium transition-all ${
              view === 'base-camp'
                ? 'bg-pine-600 text-white'
                : 'bg-navy-800 text-gray-300 hover:bg-navy-700 border border-white/10'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Tent className="w-5 h-5" />
              Base Camp
            </span>
          </button>
          <button
            onClick={() => { setView('off-grid'); setSelectedCategory('all'); }}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-medium transition-all ${
              view === 'off-grid'
                ? 'bg-sunset-500 text-white'
                : 'bg-navy-800 text-gray-300 hover:bg-navy-700 border border-white/10'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Compass className="w-5 h-5" />
              Off-Grid
            </span>
          </button>
        </div>

        {/* Description */}
        <div className="mb-6">
          {view === 'base-camp' ? (
            <p className="text-gray-400">
              Established campgrounds including state parks, high lakes along the Cascade Lakes Scenic Byway,
              river camps on the Metolius, volcanic sites at Newberry, and RV parks.
            </p>
          ) : (
            <p className="text-gray-400">
              Dispersed camping, van life spots, and overlanding destinations. Free or low-cost camping
              on National Forest and BLM land.
            </p>
          )}
        </div>

        {/* Dispersed Warning */}
        {view === 'off-grid' && <DispersedWarning />}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? view === 'base-camp' ? 'bg-pine-600 text-white' : 'bg-sunset-500 text-white'
                : 'bg-navy-800 text-gray-300 hover:bg-navy-700 border border-white/10'
            }`}
          >
            All ({view === 'base-camp' ? campgrounds.length : dispersedSites.length})
          </button>
          {currentCategories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Tent;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? view === 'base-camp' ? 'bg-pine-600 text-white' : 'bg-sunset-500 text-white'
                    : 'bg-navy-800 text-gray-300 hover:bg-navy-700 border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label} ({cat.count})
              </button>
            );
          })}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {view === 'base-camp'
            ? filteredCampgrounds.map((campground) => (
                <CampgroundCard key={campground.id} campground={campground} />
              ))
            : filteredDispersed.map((site) => (
                <DispersedCard key={site.id} site={site} />
              ))
          }
        </div>

        {/* Resources Section */}
        <div className="mt-12 card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Helpful Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="https://www.recreation.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 bg-navy-700/50 rounded-xl hover:bg-navy-700 transition-colors group"
            >
              <ExternalLink className="w-5 h-5 text-pine-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white group-hover:text-pine-400 transition-colors">Recreation.gov</p>
                <p className="text-sm text-gray-400">Federal campground reservations</p>
              </div>
            </a>
            <a
              href="https://www.reserveamerica.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 bg-navy-700/50 rounded-xl hover:bg-navy-700 transition-colors group"
            >
              <ExternalLink className="w-5 h-5 text-pine-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white group-hover:text-pine-400 transition-colors">ReserveAmerica</p>
                <p className="text-sm text-gray-400">Oregon State Parks reservations</p>
              </div>
            </a>
            <a
              href="https://centraloregonfire.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 bg-navy-700/50 rounded-xl hover:bg-navy-700 transition-colors group"
            >
              <Flame className="w-5 h-5 text-sunset-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white group-hover:text-sunset-400 transition-colors">Fire Restrictions</p>
                <p className="text-sm text-gray-400">Current fire danger & restrictions</p>
              </div>
            </a>
            <a
              href="https://www.fs.usda.gov/detail/r6/passes-permits/recreation"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 bg-navy-700/50 rounded-xl hover:bg-navy-700 transition-colors group"
            >
              <ExternalLink className="w-5 h-5 text-pine-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white group-hover:text-pine-400 transition-colors">NW Forest Pass</p>
                <p className="text-sm text-gray-400">$5/day or $30/year</p>
              </div>
            </a>
            <a
              href="https://lnt.org/why/7-principles/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 bg-navy-700/50 rounded-xl hover:bg-navy-700 transition-colors group"
            >
              <TreePine className="w-5 h-5 text-pine-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white group-hover:text-pine-400 transition-colors">Leave No Trace</p>
                <p className="text-sm text-gray-400">7 principles for outdoor ethics</p>
              </div>
            </a>
            <Link
              to="/map"
              className="flex items-start gap-3 p-4 bg-navy-700/50 rounded-xl hover:bg-navy-700 transition-colors group"
            >
              <MapPin className="w-5 h-5 text-sunset-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white group-hover:text-sunset-400 transition-colors">Interactive Map</p>
                <p className="text-sm text-gray-400">View all locations on map</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
