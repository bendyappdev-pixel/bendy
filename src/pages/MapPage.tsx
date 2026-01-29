import { useState } from 'react';
import { Map, Users, X } from 'lucide-react';
import InteractiveMap from '../components/map/InteractiveMap';
import { ContextualBanner } from '../components/ads';
import { CrowdReportForm, CrowdReportsList } from '../components/crowd';

export default function MapPage() {
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div className="container-app py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Explore Bend</h1>
              <p className="text-gray-600">Parks, trails, breweries, family fun, and more</p>
            </div>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
          >
            <Users className="w-5 h-5" />
            Report Conditions
          </button>
        </div>
      </div>

      {/* Current Conditions */}
      <div className="mb-8">
        <CrowdReportsList limit={5} compact />
      </div>

      {/* Map */}
      <InteractiveMap />

      {/* Contextual Banner Ad */}
      <div className="mt-8">
        <ContextualBanner />
      </div>

      {/* Legend */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4">
        <LegendItem emoji="🌲" label="Parks" color="bg-forest" />
        <LegendItem emoji="🐕" label="Dog Parks" color="bg-amber-500" />
        <LegendItem emoji="🥾" label="Trailheads" color="bg-earth" />
        <LegendItem emoji="⛷️" label="Ski Areas" color="bg-mountain" />
        <LegendItem emoji="🍺" label="Breweries" color="bg-amber-600" />
        <LegendItem emoji="🍽️" label="Restaurants" color="bg-red-600" />
        <LegendItem emoji="🎵" label="Venues" color="bg-purple-600" />
        <LegendItem emoji="🏊" label="Recreation" color="bg-cyan-600" />
        <LegendItem emoji="👨‍👩‍👧‍👦" label="Family Fun" color="bg-purple-500" />
        <LegendItem emoji="🏛️" label="Museums" color="bg-indigo-500" />
      </div>

      {/* BPRD Attribution */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Park and recreation data from{' '}
          <a
            href="https://www.bendparksandrec.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mountain hover:underline"
          >
            Bend Park and Recreation District
          </a>
          {' '}— 84 parks, 80+ miles of trails
        </p>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-sand rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Map Tips</h3>
        <ul className="text-gray-600 space-y-2 text-sm">
          <li>• Click the filter buttons above the map to show/hide location types</li>
          <li>• Click on any marker to see details about that location</li>
          <li>• Use the navigation controls or pinch-to-zoom on mobile</li>
          <li>• Click the location button to center the map on your current location</li>
        </ul>
      </div>

      {/* Report Conditions Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowReportModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Report Conditions</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Help others plan their visit by sharing current crowd conditions at popular spots.
              </p>
              <CrowdReportForm onSuccess={() => setShowReportModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LegendItem({ emoji, label, color }: { emoji: string; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-sm`}>
        {emoji}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}
