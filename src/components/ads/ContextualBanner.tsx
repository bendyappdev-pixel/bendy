/**
 * Contextual Banner Ad Slot
 * Wide banner that appears contextually (e.g., below map, after content sections)
 */

import { useAds } from '../../hooks/useAds';

export default function ContextualBanner() {
  const { contextualBanner } = useAds();

  if (!contextualBanner.enabled) return null;

  return (
    <a
      href={contextualBanner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden border border-hair"
    >
      {/* Background Image */}
      <div className="relative h-32 md:h-40">
        <img
          src={contextualBanner.image}
          alt={contextualBanner.title}
          className="h-full w-full object-cover"
        />
        {/* Scrim — legibility for the type over the photo. */}
        <div className="scrim-l pointer-events-none absolute inset-0" aria-hidden="true" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-between px-6 md:px-10">
          <div>
            <span className="small-caps mb-1 block text-whisper">Sponsored</span>
            <h3 className="film-display-thin text-[22px] text-film-white md:text-[28px]">
              {contextualBanner.title}
            </h3>
            <p className="mt-1 font-mono text-[12px] text-mist md:text-[13px]">
              {contextualBanner.description}
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="btn-secondary">{contextualBanner.ctaText}</span>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="border-t border-hair bg-film-deep p-4 text-center sm:hidden">
        <span className="small-caps text-film-white">{contextualBanner.ctaText} →</span>
      </div>
    </a>
  );
}
