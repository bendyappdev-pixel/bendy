/**
 * Weekend Pick Ad Slot
 * Featured experience/business highlight with large image
 */

import { Star } from 'lucide-react';
import { useAds } from '../../hooks/useAds';

export default function WeekendPick() {
  const { weekendPick } = useAds();

  if (!weekendPick.enabled) return null;

  return (
    <a
      href={weekendPick.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden border border-hair"
    >
      <div className="relative">
        <img
          src={weekendPick.image}
          alt={weekendPick.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105 md:h-64"
        />
        <div className="scrim-b pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="absolute left-4 top-4">
          <span className="small-caps inline-flex items-center gap-1.5 border border-hair bg-film-black/70 px-3 py-1.5 text-gold">
            <Star className="h-3 w-3 fill-current" aria-hidden="true" />
            Weekend Pick
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="film-display-thin text-[22px] text-film-white">{weekendPick.title}</h3>
        <p className="mt-2 font-mono text-[12px] text-mist">{weekendPick.description}</p>
        <p className="small-caps mt-3 text-whisper">Sponsored by {weekendPick.sponsor}</p>
      </div>
    </a>
  );
}
