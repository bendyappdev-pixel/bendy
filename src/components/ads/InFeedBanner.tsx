/**
 * In-Feed Banner Ad Slot
 * Promotional banner that appears within content feeds
 */

import { useAds } from '../../hooks/useAds';

export default function InFeedBanner() {
  const { inFeedBanner } = useAds();

  if (!inFeedBanner.enabled) return null;

  return (
    <a
      href={inFeedBanner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block card overflow-hidden hover:shadow-lg transition-shadow group"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-1/3">
          <img
            src={inFeedBanner.image}
            alt={inFeedBanner.title}
            className="w-full h-40 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-center">
          <span className="text-xs text-gray-400 mb-2">Sponsored</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-forest transition-colors">
            {inFeedBanner.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">{inFeedBanner.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">By {inFeedBanner.sponsor}</span>
            <span className="inline-flex items-center px-4 py-2 bg-forest text-white rounded-lg text-sm font-medium group-hover:bg-forest/90 transition-colors">
              {inFeedBanner.ctaText}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
