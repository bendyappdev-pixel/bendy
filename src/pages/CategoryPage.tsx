import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  color: string;
  types: Location['type'][];
  subcategories?: Subcategory[];
}> = {
  outdoor: {
    title: 'Outdoor Activities',
    description: 'Hiking, skiing, mountain biking, and all the adventures that make Bend an outdoor paradise.',
    icon: Mountain,
    color: 'bg-forest',
    types: ['park', 'trailhead', 'ski', 'recreation', 'dog-park'],
    subcategories: outdoorSubcategories,
  },
  food: {
    title: 'Food & Drink',
    description: 'From craft breweries to local restaurants, explore Bend\'s vibrant food scene.',
    icon: UtensilsCrossed,
    color: 'bg-earth',
    types: ['brewery', 'restaurant'],
  },
  kids: {
    title: 'Bendy Kids',
    description: 'Family-friendly fun in Bend and Sunriver! Museums, play spaces, water parks, and outdoor adventures for all ages.',
    icon: Baby,
    color: 'bg-purple-500',
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
  const info = category ? categoryInfo[category] : null;
  const [activeSubcategory, setActiveSubcategory] = useState('all');

  if (!info) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
        <Link to="/" className="text-forest hover:underline">
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
        className="inline-flex items-center gap-2 text-gray-600 hover:text-forest mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{info.title}</h1>
          <p className="text-gray-600">{info.description}</p>
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
                      ? 'bg-forest text-white'
                      : 'bg-white text-gray-700 hover:bg-sage/20 shadow-sm'
                  }`}
                >
                  <SubIcon className="w-4 h-4" />
                  {subcat.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Wilderness Permits Section - Only show for outdoor category */}
      {category === 'outdoor' && (
        <div className="mb-10 bg-mountain/10 rounded-2xl p-6 border border-mountain/20">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Mountain className="w-5 h-5 text-mountain" />
            Wilderness Permits
          </h2>
          <p className="text-gray-600 mb-4">
            Planning to explore the wilderness areas near Bend? Permits are required for many trails.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wildernessAreas.map((area) => (
              <a
                key={area.name}
                href={area.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-mountain transition-colors">
                      {area.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{area.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-mountain flex-shrink-0 mt-1" />
                </div>
                <div className="mt-3 text-sm text-mountain font-medium">
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
        <div className="text-center py-12 bg-sand rounded-2xl">
          <p className="text-gray-500">No locations found in this category yet.</p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 bg-forest text-white rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-3">Explore on the Map</h3>
        <p className="text-sage mb-6 max-w-lg mx-auto">
          See all locations on our interactive map and discover even more places to explore.
        </p>
        <Link to="/map" className="btn-primary bg-white text-forest hover:bg-white/90 inline-flex">
          Open Map
        </Link>
      </div>
    </div>
  );
}

function LocationCard({ location }: { location: Location }) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    moderate: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700',
  };

  return (
    <article className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{location.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{location.description}</p>

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
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Amenities</p>
          <div className="flex flex-wrap gap-1">
            {location.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-1 bg-sage/20 text-forest rounded text-xs"
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
          className="inline-block mt-4 text-sm text-mountain hover:underline"
        >
          Visit Website →
        </a>
      )}
    </article>
  );
}
