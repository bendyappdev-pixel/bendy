import { useState, useEffect } from 'react';
import {
  Snowflake,
  Waves,
  Wind,
  Car,
  Sun,
  ParkingCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Thermometer,
  Droplets,
  Fish,
  Compass,
  Sunrise,
  Sunset,
  Camera,
  RefreshCw,
  ExternalLink,
  Loader2,
  Radio,
} from 'lucide-react';
import {
  mockParkingConditions,
  calculateSunTimes,
} from '../data/conditions';
import { ConditionStatus } from '../types/conditions';
import {
  useRiverConditions,
  useAirQuality,
  useMountainConditions,
  useRoadConditions,
} from '../hooks/useConditions';

const statusColors: Record<ConditionStatus, string> = {
  good: 'bg-green-500',
  moderate: 'bg-yellow-500',
  poor: 'bg-orange-500',
  closed: 'bg-red-500',
};

const statusBgColors: Record<ConditionStatus, string> = {
  good: 'bg-green-500/10 border-green-500/30',
  moderate: 'bg-yellow-500/10 border-yellow-500/30',
  poor: 'bg-orange-500/10 border-orange-500/30',
  closed: 'bg-red-500/10 border-red-500/30',
};

function StatusDot({ status }: { status: ConditionStatus }) {
  return (
    <span className={`w-2.5 h-2.5 rounded-full ${statusColors[status]} animate-pulse`} />
  );
}

function LiveBadge() {
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 rounded-full text-xs text-green-400">
      <Radio className="w-3 h-3 animate-pulse" />
      Live
    </span>
  );
}

function TrendIcon({ trend }: { trend: 'rising' | 'falling' | 'stable' | 'filling' | 'emptying' }) {
  if (trend === 'rising' || trend === 'filling') {
    return <TrendingUp className="w-4 h-4 text-yellow-400" />;
  }
  if (trend === 'falling' || trend === 'emptying') {
    return <TrendingDown className="w-4 h-4 text-green-400" />;
  }
  return <Minus className="w-4 h-4 text-gray-400" />;
}

function LastUpdated({ date }: { date: Date }) {
  const timeAgo = getTimeAgo(date);
  return (
    <span className="flex items-center gap-1 text-xs text-gray-500">
      <Clock className="w-3 h-3" />
      Updated {timeAgo}
    </span>
  );
}

function LoadingCard() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function ConditionsPage() {
  const [sunTimes, setSunTimes] = useState(calculateSunTimes());

  // Real data hooks
  const { rivers, loading: riversLoading, refresh: refreshRivers } = useRiverConditions();
  const { airQuality, loading: aqLoading, refresh: refreshAQ } = useAirQuality();
  const { conditions: mountain, loading: mtLoading } = useMountainConditions();
  const { roads, loading: roadsLoading } = useRoadConditions();

  useEffect(() => {
    // Recalculate sun times at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      setSunTimes(calculateSunTimes());
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const handleRefresh = () => {
    refreshRivers();
    refreshAQ();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-navy-800 to-navy-900 border-b border-white/5">
        <div className="container-app py-8 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Live Conditions</h1>
                <p className="text-gray-400">Real-time updates for Bend & Central Oregon</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-navy-700 hover:bg-navy-600 rounded-xl text-gray-300 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Quick Status Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-3 bg-navy-700/50 rounded-xl px-4 py-3">
              <StatusDot status="good" />
              <div>
                <p className="text-xs text-gray-500">Mt. Bachelor</p>
                <p className="text-sm text-white font-medium">{mountain.liftsOpen}/{mountain.liftsTotal} Lifts</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-navy-700/50 rounded-xl px-4 py-3">
              <StatusDot status={airQuality?.status || 'good'} />
              <div>
                <p className="text-xs text-gray-500">Air Quality</p>
                <p className="text-sm text-white font-medium">
                  {aqLoading ? '...' : `AQI ${airQuality?.aqi || '--'}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-navy-700/50 rounded-xl px-4 py-3">
              <StatusDot status={rivers[0]?.status || 'good'} />
              <div>
                <p className="text-xs text-gray-500">River Flow</p>
                <p className="text-sm text-white font-medium">
                  {riversLoading ? '...' : `${rivers[0]?.flowRate || '--'} cfs`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-navy-700/50 rounded-xl px-4 py-3">
              <Sun className="w-4 h-4 text-sunset-400" />
              <div>
                <p className="text-xs text-gray-500">Sunset</p>
                <p className="text-sm text-white font-medium">{sunTimes.sunset}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container-app py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mt. Bachelor Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Snowflake className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Mt. Bachelor</h2>
                  <LastUpdated date={mountain.lastUpdated} />
                </div>
              </div>
              <a
                href="https://www.mtbachelor.com/conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {mtLoading ? (
              <LoadingCard />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-navy-700/50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Base Depth</p>
                    <p className="text-2xl font-bold text-white">{mountain.snowDepthBase}"</p>
                  </div>
                  <div className="bg-navy-700/50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Summit Depth</p>
                    <p className="text-2xl font-bold text-white">{mountain.snowDepthSummit}"</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">New Snow (24h)</span>
                    <span className="text-white font-medium">{mountain.newSnow24h}"</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">New Snow (48h)</span>
                    <span className="text-white font-medium">{mountain.newSnow48h}"</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Lifts Open</span>
                    <span className="text-white font-medium">{mountain.liftsOpen} of {mountain.liftsTotal}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Terrain Open</span>
                    <span className="text-white font-medium">{mountain.terrainOpen}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Conditions</span>
                    <span className="text-blue-400 font-medium">{mountain.conditions}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Air Quality Card - LIVE DATA */}
          <div className={`card p-6 border ${statusBgColors[airQuality?.status || 'good']}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Wind className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">Air Quality</h2>
                    <LiveBadge />
                  </div>
                  {airQuality && <LastUpdated date={airQuality.lastUpdated} />}
                </div>
              </div>
              <StatusDot status={airQuality?.status || 'good'} />
            </div>

            {aqLoading ? (
              <LoadingCard />
            ) : airQuality ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-navy-700/50 rounded-xl p-4 flex-1 text-center">
                    <p className="text-4xl font-bold text-white">{airQuality.aqi}</p>
                    <p className={`text-sm font-medium ${
                      airQuality.status === 'good' ? 'text-green-400' :
                      airQuality.status === 'moderate' ? 'text-yellow-400' : 'text-orange-400'
                    }`}>{airQuality.category}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{airQuality.healthMessage}</p>
                  </div>
                </div>

                <div className="bg-navy-700/30 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Forecast</p>
                  <p className="text-sm text-gray-300">{airQuality.forecast}</p>
                </div>
              </>
            ) : (
              <p className="text-gray-400">Unable to load air quality data</p>
            )}
          </div>

          {/* River Conditions Card - LIVE DATA */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Waves className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">River Flows</h2>
                    <LiveBadge />
                  </div>
                  {rivers[0] && <LastUpdated date={rivers[0].lastUpdated} />}
                </div>
              </div>
              <a
                href="https://waterdata.usgs.gov/or/nwis/rt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {riversLoading ? (
              <LoadingCard />
            ) : rivers.length > 0 ? (
              <div className="space-y-4">
                {rivers.map((river, idx) => (
                  <div key={idx} className="bg-navy-700/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white font-medium">{river.name}</p>
                        <p className="text-xs text-gray-500">{river.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendIcon trend={river.flowTrend} />
                        <StatusDot status={river.status} />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <Droplets className="w-4 h-4 text-cyan-400" />
                        <span className="text-lg font-bold text-white">{river.flowRate.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">cfs</span>
                      </div>
                      {river.temperature && (
                        <div className="flex items-center gap-1">
                          <Thermometer className="w-4 h-4 text-sunset-400" />
                          <span className="text-white">{river.temperature}°F</span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Fish className="w-3 h-3" />
                        <span className="truncate">{river.fishingRating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Waves className="w-3 h-3" />
                        <span className="truncate">{river.paddlingRating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Unable to load river data</p>
            )}

            <p className="text-xs text-gray-600 mt-3">Data from USGS National Water Information System</p>
          </div>

          {/* Sunrise/Sunset Card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sunset-500/20 rounded-lg flex items-center justify-center">
                <Sun className="w-5 h-5 text-sunset-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Sun & Light</h2>
                <p className="text-xs text-gray-500">Bend, Oregon (44.06°N)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-br from-sunset-500/20 to-orange-500/10 rounded-xl p-4 text-center">
                <Sunrise className="w-6 h-6 text-sunset-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Sunrise</p>
                <p className="text-xl font-bold text-white">{sunTimes.sunrise}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/10 rounded-xl p-4 text-center">
                <Sunset className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Sunset</p>
                <p className="text-xl font-bold text-white">{sunTimes.sunset}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Day Length</span>
                <span className="text-white font-medium">{sunTimes.dayLength}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Camera className="w-4 h-4 text-sunset-400" />
                  Golden Hour (AM)
                </div>
                <span className="text-white font-medium">{sunTimes.goldenHourMorning}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Camera className="w-4 h-4 text-purple-400" />
                  Golden Hour (PM)
                </div>
                <span className="text-white font-medium">{sunTimes.goldenHourEvening}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Civil Twilight Ends</span>
                <span className="text-white font-medium">{sunTimes.civilTwilightEnd}</span>
              </div>
            </div>
          </div>

          {/* Road Conditions Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Road Conditions</h2>
                  {roads[0] && <LastUpdated date={roads[0].lastUpdated} />}
                </div>
              </div>
              <a
                href="https://tripcheck.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {roadsLoading ? (
              <LoadingCard />
            ) : (
              <div className="space-y-3">
                {roads.map((road, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-navy-700/50 rounded-xl p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{road.name}</p>
                        <span className="text-xs text-gray-500">({road.route})</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{road.conditions}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {road.status === 'open' && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-lg text-xs text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          Open
                        </span>
                      )}
                      {road.status === 'chains-required' && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-lg text-xs text-yellow-400">
                          <AlertTriangle className="w-3 h-3" />
                          Chains
                        </span>
                      )}
                      {road.status === 'closed' && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-lg text-xs text-red-400">
                          <XCircle className="w-3 h-3" />
                          Closed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Downtown Parking Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <ParkingCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Downtown Parking</h2>
                  <p className="text-xs text-gray-500">Estimated availability</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-navy-700 rounded-lg text-xs text-gray-400">Coming Soon</span>
            </div>

            <div className="space-y-3">
              {mockParkingConditions.map((zone, idx) => (
                <div key={idx} className="bg-navy-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{zone.zone}</p>
                    <div className="flex items-center gap-2">
                      <TrendIcon trend={zone.trend} />
                      <StatusDot status={zone.status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-navy-600 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${statusColors[zone.status]}`}
                        style={{ width: `${((zone.total - zone.available) / zone.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-white font-medium">
                      {zone.available}/{zone.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Data sources: USGS Water Services, Open-Meteo Air Quality API, Mt. Bachelor, TripCheck
          </p>
          <p className="text-gray-600 text-xs mt-2">
            River and air quality data updates automatically. Always verify conditions before heading out.
          </p>
        </div>
      </div>
    </div>
  );
}
