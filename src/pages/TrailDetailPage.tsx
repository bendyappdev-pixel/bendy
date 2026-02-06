import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Footprints,
  Bike,
  Snowflake,
  Dog,
  Baby,
  Car,
  Ticket,
  AlertCircle,
  Navigation,
  ExternalLink,
  ChevronRight,
  TreePine,
  Calendar,
  Users,
} from 'lucide-react';
import { getTrailBySlug, getNearbyTrails } from '../data/trails';
import { TrailDifficulty, TrailActivity } from '../types/trail';
import { useCrowdReports, crowdLevelConfig, formatTimeAgo, popularSpots } from '../hooks/useCrowdReports';
import CrowdReportForm from '../components/crowd/CrowdReportForm';

const activityIcons: Record<TrailActivity, React.ElementType> = {
  hiking: Footprints,
  'mountain-biking': Bike,
  'trail-running': Footprints,
  'cross-country-skiing': Snowflake,
  snowshoeing: Snowflake,
};

const activityLabels: Record<TrailActivity, string> = {
  hiking: 'Hiking',
  'mountain-biking': 'Mountain Biking',
  'trail-running': 'Trail Running',
  'cross-country-skiing': 'Cross-Country Skiing',
  snowshoeing: 'Snowshoeing',
};

const difficultyColors: Record<TrailDifficulty, string> = {
  easy: 'text-pine-400',
  moderate: 'text-sunset-400',
  difficult: 'text-orange-400',
  expert: 'text-red-400',
};

const difficultyBadgeColors: Record<TrailDifficulty, string> = {
  easy: 'bg-pine-500/20 text-pine-400 border-pine-500/30',
  moderate: 'bg-sunset-500/20 text-sunset-400 border-sunset-500/30',
  difficult: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  expert: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function TrailDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const trail = getTrailBySlug(slug || '');
  const nearbyTrails = trail ? getNearbyTrails(trail.id) : [];
  const [showReportForm, setShowReportForm] = useState(false);

  // Get crowd reports for this trail
  const { getLatestReportForLocation } = useCrowdReports();

  // Check if this trail is in popular spots for crowd reporting
  const trailSpot = popularSpots.find((spot) =>
    spot.id === trail?.id ||
    spot.name.toLowerCase().includes(trail?.name.toLowerCase() || '') ||
    trail?.name.toLowerCase().includes(spot.name.toLowerCase())
  );

  const latestReport = trailSpot ? getLatestReportForLocation(trailSpot.id) : null;

  if (!trail) {
    return <Navigate to="/trails" replace />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src={trail.heroImage}
          alt={trail.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/30" />

        {/* Back Button */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <Link
            to="/trails"
            className="flex items-center gap-2 px-4 py-2 bg-navy-900/70 backdrop-blur-sm rounded-xl text-white hover:bg-navy-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Trails
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-app">
            {/* Difficulty Badge */}
            <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium border mb-4 ${difficultyBadgeColors[trail.difficulty]}`}>
              {trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1)}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{trail.name}</h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-300">
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sunset-400" />
                {trail.distanceFromBend} mi {trail.direction} of Bend
              </span>
              <span className="flex items-center gap-2">
                <TreePine className="w-5 h-5 text-sunset-400" />
                {trail.managedBy}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-navy-800/50 border-y border-white/5">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4">
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Distance</p>
              <p className="text-white font-semibold">{trail.distance} miles</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Elevation Gain</p>
              <p className="text-white font-semibold">{trail.elevationGain.toLocaleString()} ft</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Time</p>
              <p className="text-white font-semibold">{trail.estimatedTime}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Trail Type</p>
              <p className="text-white font-semibold capitalize">{trail.trailType.replace('-', ' ')}</p>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Difficulty</p>
              <p className={`font-semibold ${difficultyColors[trail.difficulty]}`}>
                {trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-app py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-3">About This Trail</h2>
              <p className="text-gray-300 leading-relaxed">{trail.description}</p>

              {/* Activities */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {trail.activities.map((activity) => {
                    const Icon = activityIcons[activity];
                    return (
                      <span
                        key={activity}
                        className="flex items-center gap-2 px-3 py-2 bg-navy-700/50 rounded-lg text-sm text-gray-300"
                      >
                        <Icon className="w-4 h-4 text-sunset-400" />
                        {activityLabels[activity]}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Features */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {trail.isDogFriendly && (
                    <span className="flex items-center gap-2 px-3 py-2 bg-pine-500/10 border border-pine-500/30 rounded-lg text-sm text-pine-400">
                      <Dog className="w-4 h-4" />
                      Dog-friendly
                    </span>
                  )}
                  {trail.isKidFriendly && (
                    <span className="flex items-center gap-2 px-3 py-2 bg-sunset-500/10 border border-sunset-500/30 rounded-lg text-sm text-sunset-400">
                      <Baby className="w-4 h-4" />
                      Kid-friendly
                    </span>
                  )}
                  {trail.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-2 bg-navy-700/50 rounded-lg text-sm text-gray-300 capitalize"
                    >
                      {feature.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trailhead Info */}
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Trailhead Information</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-sunset-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">{trail.trailhead.name}</p>
                    <p className="text-sm text-gray-400">{trail.trailhead.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-sunset-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Parking</p>
                    <p className="text-sm text-gray-400">{trail.trailhead.parking}</p>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${trail.trailhead.coordinates.lat},${trail.trailhead.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 btn-primary mt-2"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </div>

            {/* Crowd Conditions */}
            {trailSpot && (
              <div className="card p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Current Conditions</h2>
                  <button
                    onClick={() => setShowReportForm(!showReportForm)}
                    className="btn-secondary text-sm py-2"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Report Conditions
                  </button>
                </div>

                {latestReport ? (
                  <div className="flex items-center gap-4 p-4 bg-navy-700/50 rounded-xl">
                    <span className="text-3xl">{crowdLevelConfig[latestReport.crowdLevel].emoji}</span>
                    <div>
                      <p className="text-white font-medium">
                        {crowdLevelConfig[latestReport.crowdLevel].label}
                      </p>
                      <p className="text-sm text-gray-400">
                        Reported {formatTimeAgo(latestReport.timestamp)}
                      </p>
                      {latestReport.comment && (
                        <p className="text-sm text-gray-300 mt-1">{latestReport.comment}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-navy-700/50 rounded-xl text-center">
                    <p className="text-gray-400">No recent reports. Be the first to share conditions!</p>
                  </div>
                )}

                {showReportForm && (
                  <div className="mt-4">
                    <CrowdReportForm
                      preselectedLocation={trailSpot.id}
                      onSuccess={() => setShowReportForm(false)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Nearby Trails */}
            {nearbyTrails.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Nearby Trails</h2>
                <div className="space-y-3">
                  {nearbyTrails.map((nearbyTrail) => (
                    <Link
                      key={nearbyTrail.id}
                      to={`/trails/${nearbyTrail.slug}`}
                      className="flex items-center gap-4 p-4 bg-navy-700/50 rounded-xl hover:bg-navy-700 transition-colors group"
                    >
                      <img
                        src={nearbyTrail.heroImage}
                        alt={nearbyTrail.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-sunset-400 transition-colors">
                          {nearbyTrail.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {nearbyTrail.distance} mi • {nearbyTrail.elevationGain.toLocaleString()} ft gain
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-sunset-400 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Info Card */}
              <div className="card p-6 bg-gradient-to-br from-sunset-500/10 to-navy-800/50">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Distance</span>
                    <span className="text-white font-medium">{trail.distance} miles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Elevation Gain</span>
                    <span className="text-white font-medium">{trail.elevationGain.toLocaleString()} ft</span>
                  </div>
                  {trail.highestPoint && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Highest Point</span>
                      <span className="text-white font-medium">{trail.highestPoint.toLocaleString()} ft</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated Time</span>
                    <span className="text-white font-medium">{trail.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Trail Type</span>
                    <span className="text-white font-medium capitalize">{trail.trailType.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Season & Access */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Season & Access</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-sunset-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Best Season</p>
                      <p className="text-sm text-gray-400">{trail.bestSeason}</p>
                    </div>
                  </div>

                  {trail.permitRequired && (
                    <div className="flex items-start gap-3">
                      <Ticket className="w-5 h-5 text-sunset-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Permits Required</p>
                        <p className="text-sm text-gray-400">{trail.permitInfo}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-sunset-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Fees</p>
                      <p className="text-sm text-gray-400">{trail.fees}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="card p-6 border-sunset-500/30">
                <div className="flex items-center gap-2 text-sunset-400 mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="font-semibold">Safety Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-sunset-500 flex-shrink-0 mt-0.5" />
                    Bring plenty of water (1 liter per 2 hours of hiking)
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-sunset-500 flex-shrink-0 mt-0.5" />
                    Check weather and trail conditions before you go
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-sunset-500 flex-shrink-0 mt-0.5" />
                    Tell someone your plans and expected return time
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-sunset-500 flex-shrink-0 mt-0.5" />
                    Pack the 10 essentials for any hike
                  </li>
                </ul>
              </div>

              {/* External Links */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
                <div className="space-y-2">
                  <a
                    href="https://www.fs.usda.gov/recarea/deschutes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-sunset-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Deschutes National Forest
                  </a>
                  <a
                    href="https://www.recreation.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-sunset-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Recreation.gov (Permits)
                  </a>
                  <a
                    href="https://centraloregonfire.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-sunset-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Fire Restrictions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
