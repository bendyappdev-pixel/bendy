import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Mountain,
  MapPin,
  Sun,
  Snowflake,
  Leaf,
  Flower2,
  Lightbulb,
  Car,
  Ticket,
  Backpack,
  Accessibility,
  DollarSign,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { guides } from '../data/guides';
import { Season, Difficulty, GuideStop } from '../types/guide';

const seasonIcons: Record<Season, typeof Sun> = {
  spring: Flower2,
  summer: Sun,
  fall: Leaf,
  winter: Snowflake,
};

const seasonLabels: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
  winter: 'Winter',
};

const difficultyColors: Record<Difficulty, string> = {
  easy: 'text-pine-400',
  moderate: 'text-sunset-400',
  challenging: 'text-red-400',
};

function StopCard({ stop, index, isLast }: { stop: GuideStop; index: number; isLast: boolean }) {
  return (
    <div className="relative flex gap-4 md:gap-6">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          stop.isOptional ? 'bg-navy-700 border-2 border-dashed border-sunset-500/50' : 'bg-sunset-500'
        }`}>
          <span className="text-white font-bold text-sm">{index + 1}</span>
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-sunset-500/50 to-navy-700 mt-2" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-8 ${isLast ? '' : ''}`}>
        <div className="card p-5 md:p-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sunset-400 text-sm font-medium">{stop.time}</span>
                {stop.duration && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500 text-sm">{stop.duration}</span>
                  </>
                )}
                {stop.isOptional && (
                  <span className="px-2 py-0.5 bg-navy-700 rounded text-xs text-gray-400">
                    Optional
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">{stop.title}</h3>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <MapPin className="w-4 h-4 text-sunset-400" />
            {stop.location}
          </div>

          {/* Description */}
          <p className="text-gray-300 mb-4">{stop.description}</p>

          {/* Tips */}
          {stop.tips && stop.tips.length > 0 && (
            <div className="bg-navy-700/50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-sunset-400 text-sm font-medium mb-2">
                <Lightbulb className="w-4 h-4" />
                Local Tips
              </div>
              <ul className="space-y-2">
                {stop.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <ChevronRight className="w-4 h-4 text-sunset-500 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Alternatives */}
          {stop.alternatives && stop.alternatives.length > 0 && (
            <div className="border-t border-white/10 pt-4">
              <p className="text-sm text-gray-500 mb-2">Alternatives:</p>
              <div className="space-y-2">
                {stop.alternatives.map((alt, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-white font-medium">{alt.title}</span>
                    <span className="text-gray-400"> — {alt.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    return <Navigate to="/guides" replace />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src={guide.heroImage}
          alt={guide.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/30" />

        {/* Back Button */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <Link
            to="/guides"
            className="flex items-center gap-2 px-4 py-2 bg-navy-900/70 backdrop-blur-sm rounded-xl text-white hover:bg-navy-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Guides
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-app">
            {/* Season Icons */}
            <div className="flex gap-2 mb-4">
              {guide.seasons.map((season) => {
                const Icon = seasonIcons[season];
                return (
                  <span
                    key={season}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-900/70 backdrop-blur-sm rounded-full text-sm"
                  >
                    <Icon className="w-4 h-4 text-sunset-400" />
                    <span className="text-white">{seasonLabels[season]}</span>
                  </span>
                );
              })}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{guide.title}</h1>
            <p className="text-xl text-sunset-400 font-medium mb-4">{guide.tagline}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-300">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-sunset-400" />
                {guide.duration}
              </span>
              <span className="flex items-center gap-2">
                <Mountain className="w-5 h-5 text-sunset-400" />
                <span className={difficultyColors[guide.difficulty]}>
                  {guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1)}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sunset-400" />
                {guide.stops.length} stops
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-app py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline - Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-3">About This Guide</h2>
              <p className="text-gray-300">{guide.description}</p>

              {/* Best For */}
              <div className="flex flex-wrap gap-2 mt-4">
                {guide.bestFor.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-sunset-500/10 border border-sunset-500/30 rounded-lg text-sm text-sunset-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Seasonal Notes */}
            {guide.seasonalNotes.length > 0 && (
              <div className="card p-6 mb-8 border-sunset-500/30">
                <div className="flex items-center gap-2 text-sunset-400 mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="font-semibold">Seasonal Notes</h3>
                </div>
                <div className="space-y-3">
                  {guide.seasonalNotes.map((note, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex gap-1 flex-shrink-0">
                        {note.seasons.map((season) => {
                          const Icon = seasonIcons[season];
                          return (
                            <Icon key={season} className="w-4 h-4 text-gray-500" />
                          );
                        })}
                      </div>
                      <p className="text-gray-400 text-sm">{note.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stops Timeline */}
            <h2 className="text-2xl font-bold text-white mb-6">Your Itinerary</h2>
            <div className="space-y-0">
              {guide.stops.map((stop, index) => (
                <StopCard
                  key={stop.id}
                  stop={stop}
                  index={index}
                  isLast={index === guide.stops.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Sidebar - Practical Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Start Card */}
              <div className="card p-6 bg-gradient-to-br from-sunset-500/10 to-navy-800/50">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Start</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">First Stop</span>
                    <span className="text-white">{guide.stops[0]?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Duration</span>
                    <span className="text-white">{guide.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Difficulty</span>
                    <span className={difficultyColors[guide.difficulty]}>
                      {guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Practical Info */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Practical Info</h3>

                {guide.practicalInfo.permits && guide.practicalInfo.permits.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 text-sunset-400 text-sm font-medium mb-2">
                      <Ticket className="w-4 h-4" />
                      Permits & Passes
                    </div>
                    <ul className="space-y-1">
                      {guide.practicalInfo.permits.map((permit, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-sunset-500">•</span>
                          {permit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {guide.practicalInfo.parking && guide.practicalInfo.parking.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 text-sunset-400 text-sm font-medium mb-2">
                      <Car className="w-4 h-4" />
                      Parking
                    </div>
                    <ul className="space-y-1">
                      {guide.practicalInfo.parking.map((info, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-sunset-500">•</span>
                          {info}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {guide.practicalInfo.gear && guide.practicalInfo.gear.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 text-sunset-400 text-sm font-medium mb-2">
                      <Backpack className="w-4 h-4" />
                      Recommended Gear
                    </div>
                    <ul className="space-y-1">
                      {guide.practicalInfo.gear.map((item, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-sunset-500">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {guide.practicalInfo.accessibility && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 text-sunset-400 text-sm font-medium mb-2">
                      <Accessibility className="w-4 h-4" />
                      Accessibility
                    </div>
                    <p className="text-sm text-gray-400">{guide.practicalInfo.accessibility}</p>
                  </div>
                )}

                {guide.practicalInfo.budgetEstimate && (
                  <div>
                    <div className="flex items-center gap-2 text-sunset-400 text-sm font-medium mb-2">
                      <DollarSign className="w-4 h-4" />
                      Budget Estimate
                    </div>
                    <p className="text-sm text-gray-400">{guide.practicalInfo.budgetEstimate}</p>
                  </div>
                )}
              </div>

              {/* Share/Save Buttons */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Share This Guide</h3>
                <div className="flex gap-3">
                  <button className="flex-1 btn-primary text-sm py-2">
                    Copy Link
                  </button>
                  <button className="flex-1 btn-secondary text-sm py-2">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
