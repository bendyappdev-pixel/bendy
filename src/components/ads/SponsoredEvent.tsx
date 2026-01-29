/**
 * Sponsored Event Ad Slot
 * Featured event card that appears at the top of event listings
 */

import { Calendar, MapPin, Sparkles } from 'lucide-react';
import { useAds } from '../../hooks/useAds';

export default function SponsoredEvent() {
  const { sponsoredEvent } = useAds();

  if (!sponsoredEvent.enabled) return null;

  return (
    <a
      href={sponsoredEvent.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block card overflow-hidden border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white hover:shadow-lg transition-shadow"
    >
      <div className="p-5">
        {/* Sponsored Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3 h-3" />
            Featured Event
          </span>
          <span className="text-xs text-gray-400">Sponsored</span>
        </div>

        {/* Event Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {sponsoredEvent.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">{sponsoredEvent.description}</p>

        {/* Event Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>{sponsoredEvent.date}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>{sponsoredEvent.location}</span>
          </div>
        </div>

        {/* Price / CTA */}
        <div className="mt-4 pt-4 border-t border-amber-100 flex items-center justify-between">
          <span className="text-amber-700 font-semibold">{sponsoredEvent.price}</span>
          <span className="text-sm text-amber-600 font-medium">Learn More →</span>
        </div>
      </div>
    </a>
  );
}
