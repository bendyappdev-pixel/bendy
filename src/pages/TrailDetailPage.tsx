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
  Calendar,
  Users,
} from 'lucide-react';
import { getTrailBySlug, getNearbyTrails } from '../data/trails';
import { TrailActivity } from '../types/trail';
import { useCrowdReports, formatTimeAgo, popularSpots } from '../hooks/useCrowdReports';
import CrowdReportForm from '../components/crowd/CrowdReportForm';
import Reel from '../components/ui/Reel';
import SceneHeader from '../components/ui/SceneHeader';
import CrowdBadge from '../components/ui/CrowdBadge';

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

/** One hairline row: mono label left, film-display-thin value right. */
function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hair py-3 last:border-b-0">
      <span className="small-caps text-whisper">{label}</span>
      <span className="film-display-thin capitalize text-[19px] text-film-white">{value}</span>
    </div>
  );
}

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

  // Scene kickers stay contiguous even though a couple of sections are
  // conditional on the trail's data (crowd reporting, nearby trails).

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <Reel
        src={trail.heroImage}
        alt={trail.name}
        priority
        scrim="bottom"
        className="flex border-b border-hair"
        style={{ minHeight: 'min(72vh, 680px)' }}
      >
        <div className="absolute left-4 top-4 z-20 md:left-8 md:top-8">
          <Link
            to="/trails"
            className="small-caps flex items-center gap-2 border border-hair bg-film-black/60 px-4 py-2 text-film-white transition-colors hover:border-film-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            All Trails
          </Link>
        </div>

        <div className="relative z-10 flex w-full flex-col justify-end px-6 pb-32 pt-24 md:pb-36 lg:px-10">
          <div className="small-caps text-ember">
            {trail.difficulty} · {trail.trailType.replace('-', ' ')}
          </div>
          <h1 className="film-display mt-3 max-w-4xl text-[clamp(44px,8vw,120px)] text-film-white">
            {trail.name}
          </h1>
          <div className="small-caps mt-4 flex flex-wrap gap-x-6 gap-y-2 text-whisper">
            <span>
              {trail.distanceFromBend} mi {trail.direction} of Bend
            </span>
            <span>{trail.managedBy}</span>
          </div>
        </div>

        {/* Letterboxed lower-third: the stat block */}
        <div className="letterbox absolute bottom-0 left-0 right-0 z-20">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-t border-hair px-6 py-6 md:grid-cols-5 lg:px-10">
            <div>
              <div className="small-caps text-whisper">Distance</div>
              <div className="film-display-thin mt-1 text-[22px] text-film-white">
                {trail.distance} mi
              </div>
            </div>
            <div>
              <div className="small-caps text-whisper">Elevation Gain</div>
              <div className="film-display-thin mt-1 text-[22px] text-film-white">
                {trail.elevationGain.toLocaleString()} ft
              </div>
            </div>
            <div>
              <div className="small-caps text-whisper">Time</div>
              <div className="film-display-thin mt-1 text-[22px] text-film-white">
                {trail.estimatedTime}
              </div>
            </div>
            <div>
              <div className="small-caps text-whisper">Trail Type</div>
              <div className="film-display-thin mt-1 text-[22px] capitalize text-film-white">
                {trail.trailType.replace('-', ' ')}
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="small-caps text-whisper">Difficulty</div>
              <div className="film-display-thin mt-1 text-[22px] capitalize text-film-white">
                {trail.difficulty}
              </div>
            </div>
          </div>
        </div>
      </Reel>

      {/* Main Content */}
      <div className="container-app py-12 md:py-16">
        <div className="grid grid-cols-12 gap-6 lg:gap-10">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8">
            {/* Scene 01 · About */}
            <section>
              <SceneHeader kicker="About This Trail" title="Trail Notes." size="sub" />
              <p className="mt-6 max-w-3xl text-[16px] leading-relaxed text-mist">
                {trail.description}
              </p>

              {/* Activities */}
              <div className="mt-8">
                <h3 className="small-caps text-whisper">Activities</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {trail.activities.map((activity) => {
                    const Icon = activityIcons[activity];
                    return (
                      <span
                        key={activity}
                        className="small-caps flex items-center gap-2 border border-hair px-3 py-2 text-mist"
                      >
                        <Icon className="h-3.5 w-3.5 text-ember" aria-hidden="true" />
                        {activityLabels[activity]}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Features */}
              <div className="mt-6">
                <h3 className="small-caps text-whisper">Features</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {trail.isDogFriendly && (
                    <span className="small-caps flex items-center gap-2 border border-hair px-3 py-2 text-mist">
                      <Dog className="h-3.5 w-3.5 text-ember" aria-hidden="true" />
                      Dog-friendly
                    </span>
                  )}
                  {trail.isKidFriendly && (
                    <span className="small-caps flex items-center gap-2 border border-hair px-3 py-2 text-mist">
                      <Baby className="h-3.5 w-3.5 text-ember" aria-hidden="true" />
                      Kid-friendly
                    </span>
                  )}
                  {trail.features.map((feature) => (
                    <span
                      key={feature}
                      className="small-caps border border-hair px-3 py-2 capitalize text-mist"
                    >
                      {feature.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Scene 02 · Trailhead */}
            <section className="mt-14 border-t border-hair pt-10">
              <SceneHeader kicker="Trailhead & Access" title="Getting There." size="sub" />

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-ember" aria-hidden="true" />
                  <div>
                    <p className="film-display-thin text-[18px] text-film-white">
                      {trail.trailhead.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[12px] text-whisper">
                      {trail.trailhead.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="mt-0.5 h-5 w-5 shrink-0 text-ember" aria-hidden="true" />
                  <div>
                    <p className="film-display-thin text-[18px] text-film-white">Parking</p>
                    <p className="mt-0.5 font-mono text-[12px] text-whisper">
                      {trail.trailhead.parking}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${trail.trailhead.coordinates.lat},${trail.trailhead.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-2 inline-flex items-center gap-2"
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                  Get Directions
                </a>
              </div>
            </section>

            {/* Gallery — a row of small Reels, when the trail has extra photography. */}
            {trail.images.length > 0 && (
              <section className="mt-14 border-t border-hair pt-10">
                <h3 className="small-caps text-whisper">Gallery</h3>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {trail.images.map((image, i) => (
                    <Reel
                      key={image}
                      src={image}
                      alt={`${trail.name}, photo ${i + 1}`}
                      hoverable
                      style={{ aspectRatio: '4 / 3' }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Current Conditions */}
            {trailSpot && (
              <section className="mt-14 border-t border-hair pt-10">
                <SceneHeader
                  kicker="Current Conditions"
                  title="Right Now."
                  size="sub"
                >
                  <button
                    onClick={() => setShowReportForm(!showReportForm)}
                    className="btn-secondary"
                  >
                    <Users className="mr-1 h-4 w-4" aria-hidden="true" />
                    Report Conditions
                  </button>
                </SceneHeader>

                {latestReport ? (
                  <div className="mt-6 flex items-center justify-between gap-4 border border-hair p-5">
                    <div>
                      <p className="font-mono text-[11px] text-whisper">
                        Reported {formatTimeAgo(latestReport.timestamp)}
                      </p>
                      {latestReport.comment && (
                        <p className="mt-1 text-[15px] text-mist">“{latestReport.comment}”</p>
                      )}
                    </div>
                    <CrowdBadge level={latestReport.crowdLevel} verbose />
                  </div>
                ) : (
                  <div className="mt-6 border border-hair p-5 text-center">
                    <p className="font-mono text-[12px] text-whisper">
                      No recent reports. Be the first to share conditions!
                    </p>
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
              </section>
            )}

            {/* Nearby Trails */}
            {nearbyTrails.length > 0 && (
              <section className="mt-14 border-t border-hair pt-10">
                <SceneHeader kicker="Nearby Trails" title="Keep Rolling." size="sub" />
                <div className="mt-6 divide-y divide-hair border-t border-hair">
                  {nearbyTrails.map((nearbyTrail) => (
                    <Link
                      key={nearbyTrail.id}
                      to={`/trails/${nearbyTrail.slug}`}
                      className="row-hover group flex items-center gap-4 py-4"
                    >
                      <Reel
                        src={nearbyTrail.heroImage}
                        alt=""
                        className="h-16 w-16 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="film-display-thin text-[18px] text-film-white transition-colors group-hover:text-ember">
                          {nearbyTrail.name}
                        </h3>
                        <p className="mt-0.5 font-mono text-[11px] text-whisper">
                          {nearbyTrail.distance} mi ·{' '}
                          {nearbyTrail.elevationGain.toLocaleString()} ft gain
                        </p>
                      </div>
                      <ChevronRight
                        className="h-5 w-5 shrink-0 text-whisper transition-colors group-hover:text-ember"
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-24 lg:space-y-10">
              {/* Quick Info */}
              <div className="border-t border-hair pt-6 lg:border-t-0 lg:pt-0">
                <h3 className="small-caps text-whisper">Quick Info</h3>
                <div className="mt-3">
                  <StatRow label="Distance" value={`${trail.distance} miles`} />
                  <StatRow label="Elevation Gain" value={`${trail.elevationGain.toLocaleString()} ft`} />
                  {trail.highestPoint && (
                    <StatRow label="Highest Point" value={`${trail.highestPoint.toLocaleString()} ft`} />
                  )}
                  <StatRow label="Estimated Time" value={trail.estimatedTime} />
                  <StatRow label="Trail Type" value={trail.trailType.replace('-', ' ')} />
                </div>
              </div>

              {/* Season & Access */}
              <div className="mt-10 border-t border-hair pt-6">
                <h3 className="small-caps text-whisper">Season & Access</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-ember" aria-hidden="true" />
                    <div>
                      <p className="film-display-thin text-[16px] text-film-white">Best Season</p>
                      <p className="mt-0.5 font-mono text-[12px] text-whisper">{trail.bestSeason}</p>
                    </div>
                  </div>

                  {trail.permitRequired && (
                    <div className="flex items-start gap-3">
                      <Ticket className="mt-0.5 h-5 w-5 shrink-0 text-ember" aria-hidden="true" />
                      <div>
                        <p className="film-display-thin text-[16px] text-film-white">
                          Permits Required
                        </p>
                        <p className="mt-0.5 font-mono text-[12px] text-whisper">
                          {trail.permitInfo}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Ticket className="mt-0.5 h-5 w-5 shrink-0 text-ember" aria-hidden="true" />
                    <div>
                      <p className="film-display-thin text-[16px] text-film-white">Fees</p>
                      <p className="mt-0.5 font-mono text-[12px] text-whisper">{trail.fees}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="mt-10 border-t border-hair pt-6">
                <div className="flex items-center gap-2 text-ember">
                  <AlertCircle className="h-5 w-5" aria-hidden="true" />
                  <h3 className="small-caps text-ember">Safety Tips</h3>
                </div>
                <ul className="mt-4 space-y-2.5 font-mono text-[12px] leading-relaxed text-whisper">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember" aria-hidden="true" />
                    Bring plenty of water (1 liter per 2 hours of hiking)
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember" aria-hidden="true" />
                    Check weather and trail conditions before you go
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember" aria-hidden="true" />
                    Tell someone your plans and expected return time
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember" aria-hidden="true" />
                    Pack the 10 essentials for any hike
                  </li>
                </ul>
              </div>

              {/* External Links */}
              <div className="mt-10 border-t border-hair pt-6">
                <h3 className="small-caps text-whisper">Resources</h3>
                <div className="mt-4 space-y-3">
                  <a
                    href="https://www.fs.usda.gov/recarea/deschutes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-mono text-[12px] text-mist transition-colors hover:text-ember"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Deschutes National Forest
                  </a>
                  <a
                    href="https://www.recreation.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-mono text-[12px] text-mist transition-colors hover:text-ember"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Recreation.gov (Permits)
                  </a>
                  <a
                    href="https://centraloregonfire.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-mono text-[12px] text-mist transition-colors hover:text-ember"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
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
