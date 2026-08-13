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
      className="group block overflow-hidden border border-hair"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-1/3">
          <img
            src={inFeedBanner.image}
            alt={inFeedBanner.title}
            className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105 md:h-full"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center p-5">
          <span className="small-caps mb-2 text-whisper">Sponsored</span>
          <h3 className="film-display-thin text-[20px] text-film-white">
            {inFeedBanner.title}
          </h3>
          <p className="mt-2 font-mono text-[12px] text-mist">{inFeedBanner.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-[11px] text-whisper">By {inFeedBanner.sponsor}</span>
            <span className="btn-secondary">{inFeedBanner.ctaText}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
