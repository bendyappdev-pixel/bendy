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
      className="block border border-hair bg-film-deep transition-colors hover:border-white/30"
    >
      <div className="p-5">
        {/* Sponsored Badge */}
        <div className="mb-3 flex items-center justify-between">
          <span className="small-caps inline-flex items-center gap-1.5 text-gold">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Featured Event
          </span>
          <span className="small-caps text-whisper">Sponsored</span>
        </div>

        {/* Event Title */}
        <h3 className="film-display-thin text-[22px] text-film-white">
          {sponsoredEvent.title}
        </h3>

        {/* Description */}
        <p className="mt-2 font-mono text-[12px] text-mist">{sponsoredEvent.description}</p>

        {/* Event Details */}
        <div className="mt-4 space-y-2 font-mono text-[12px] text-mist">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            <span>{sponsoredEvent.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            <span>{sponsoredEvent.location}</span>
          </div>
        </div>

        {/* Price / CTA */}
        <div className="mt-4 flex items-center justify-between border-t border-hair pt-4">
          <span className="font-mono text-[13px] text-film-white">{sponsoredEvent.price}</span>
          <span className="small-caps text-whisper">Learn More →</span>
        </div>
      </div>
    </a>
  );
}
