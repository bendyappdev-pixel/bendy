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
      className="block rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group relative"
    >
      {/* Background Image */}
      <div className="relative h-32 md:h-40">
        <img
          src={contextualBanner.image}
          alt={contextualBanner.title}
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest/90 to-forest/70" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-between px-6 md:px-10">
          <div className="text-white">
            <span className="text-xs text-white/70 mb-1 block">Sponsored</span>
            <h3 className="text-xl md:text-2xl font-bold mb-1">{contextualBanner.title}</h3>
            <p className="text-white/80 text-sm md:text-base">{contextualBanner.description}</p>
          </div>
          <div className="hidden sm:block">
            <span className="inline-flex items-center px-6 py-3 bg-white text-forest rounded-xl font-semibold group-hover:bg-sand transition-colors">
              {contextualBanner.ctaText}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="sm:hidden bg-forest p-4 text-center">
        <span className="text-white font-semibold">{contextualBanner.ctaText} →</span>
      </div>
    </a>
  );
}
