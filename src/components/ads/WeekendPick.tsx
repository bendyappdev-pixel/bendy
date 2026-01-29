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
      className="block card overflow-hidden group hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img
          src={weekendPick.image}
          alt={weekendPick.title}
          className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold">
            <Star className="w-3 h-3 fill-current" />
            Weekend Pick
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-forest transition-colors">
          {weekendPick.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">{weekendPick.description}</p>
        <p className="text-xs text-gray-400">Sponsored by {weekendPick.sponsor}</p>
      </div>
    </a>
  );
}
