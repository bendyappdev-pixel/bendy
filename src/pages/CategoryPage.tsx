import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Mountain,
  UtensilsCrossed,
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
import { Location } from '../types';

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
  icon: typeof Mountain;
  gradient: string;
  types: Location['type'][];
  subcategories?: Subcategory[];
}> = {
  outdoor: {
    title: 'Outdoor Activities',
    description: 'Hiking, skiing, mountain biking, and all the adventures that make Bend an outdoor paradise.',
    icon: Mountain,
    gradient: 'from-pine-600 to-pine-700',
    types: ['park', 'trailhead', 'ski', 'recreation', 'dog-park'],
    subcategories: outdoorSubcategories,
  },
  food: {
    title: 'Food & Drink',
    description: 'From craft breweries to local restaurants, explore Bend\'s vibrant food scene.',
    icon: UtensilsCrossed,
    gradient: 'from-sunset-300 to-sunset-500',
    types: ['brewery', 'restaurant'],
  },
  kids: {
    title: 'Bendy Kids',
    description: 'Family-friendly fun in Bend and Sunriver! Museums, play spaces, water parks, and outdoor adventures for all ages.',
    icon: Baby,
    gradient: 'from-blue-500 to-blue-600',
    types: ['family', 'museum'],
    subcategories: kidsSubcategories,
  },
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
        <h1 className="text-2xl font-bold text-white mb-4">Category Not Found</h1>
        <Link to="/" className="text-sunset-400 hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  const Icon = info.icon;

  // Get base locations for this category
  let filteredLocations = locations.filter((loc) => info.types.includes(loc.type));

  // Apply subcategory filter if applicable
  if (info.subcategories && activeSubcategory !== 'all') {
    const subcat = info.subcategories.find(s => s.id === activeSubcategory);
    if (subcat) {
      filteredLocations = filteredLocations.filter(subcat.filter);
    }
  }

  return (
    <div className="container-app py-8 md:py-12">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-sunset-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-14 h-14 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{info.title}</h1>
          <p className="text-gray-400">{info.description}</p>
        </div>
      </div>

      {/* Subcategory Quick Links */}
      {info.subcategories && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {info.subcategories.map((subcat) => {
              const SubIcon = subcat.icon;
              return (
                <button
                  key={subcat.id}
                  onClick={() => setActiveSubcategory(subcat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                    activeSubcategory === subcat.id
                      ? 'bg-sunset-500 text-white'
                      : 'bg-navy-800 text-gray-300 hover:bg-navy-700 border border-white/10'
                  }`}
                >
                  <SubIcon className="w-4 h-4" />
                  {subcat.label}
                </button>
              );
            })}
            {/* Trails Link - only show for outdoor category */}
            {category === 'outdoor' && (
              <Link
                to="/trails"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors bg-pine-600 text-white hover:bg-pine-500"
              >
                <Mountain className="w-4 h-4" />
                Explore Trails
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Wilderness Permits Section - Only show for outdoor category */}
      {category === 'outdoor' && (
        <div className="mb-10 card p-6 border-blue-500/30">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Mountain className="w-5 h-5 text-blue-400" />
            Wilderness Permits
          </h2>
          <p className="text-gray-400 mb-4">
            Planning to explore the wilderness areas near Bend? Permits are required for many trails.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wildernessAreas.map((area) => (
              <a
                key={area.name}
                href={area.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-navy-700/50 rounded-xl p-4 hover:bg-navy-700 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-sunset-400 transition-colors">
                      {area.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{area.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-sunset-400 flex-shrink-0 mt-1" />
                </div>
                <div className="mt-3 text-sm text-sunset-400 font-medium">
                  Get Permit on Recreation.gov →
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Locations Grid */}
      {filteredLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 card">
          <p className="text-gray-500">No locations found in this category yet.</p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-pine-700 to-pine-600 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Explore on the Map</h3>
        <p className="text-white/80 mb-6 max-w-lg mx-auto">
          See all locations on our interactive map and discover even more places to explore.
        </p>
        <Link to="/map" className="inline-flex items-center gap-2 bg-white text-pine-700 hover:bg-white/90 font-semibold px-6 py-3 rounded-xl transition-colors">
          Open Map
        </Link>
      </div>
    </div>
  );
}

function LocationCard({ location }: { location: Location }) {
  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-400',
    moderate: 'bg-amber-500/20 text-amber-400',
    hard: 'bg-red-500/20 text-red-400',
  };

  return (
    <article className="card p-6">
      <h3 className="text-lg font-semibold text-white mb-2">{location.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{location.description}</p>

      {location.difficulty && (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
            difficultyColors[location.difficulty]
          }`}
        >
          {location.difficulty.charAt(0).toUpperCase() + location.difficulty.slice(1)}
        </span>
      )}

      {location.amenities && location.amenities.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-2">Amenities</p>
          <div className="flex flex-wrap gap-1">
            {location.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-1 bg-pine-700/30 text-pine-400 rounded text-xs"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {location.website && (
        <a
          href={location.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-sm text-sunset-400 hover:underline"
        >
          Visit Website →
        </a>
      )}
    </article>
  );
}
