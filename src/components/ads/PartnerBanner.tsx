/**
 * Partner Banner Ad Slot
 * Displays a row of partner/sponsor logos
 */

import { useAds } from '../../hooks/useAds';

export default function PartnerBanner() {
  const { partnerBanner } = useAds();

  if (!partnerBanner.enabled) return null;

  return (
    <div className="border-y border-hair bg-film-deep py-8">
      <div className="container-app">
        <p className="small-caps mb-6 text-center text-whisper">{partnerBanner.title}</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partnerBanner.partners.map((partner, index) => (
            <a
              key={index}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 grayscale transition-opacity hover:opacity-100"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-10 w-auto object-contain md:h-12"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
