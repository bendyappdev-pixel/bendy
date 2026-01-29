/**
 * Partner Banner Ad Slot
 * Displays a row of partner/sponsor logos
 */

import { useAds } from '../../hooks/useAds';

export default function PartnerBanner() {
  const { partnerBanner } = useAds();

  if (!partnerBanner.enabled) return null;

  return (
    <div className="bg-white border-y border-gray-100 py-8">
      <div className="container-app">
        <p className="text-center text-sm text-gray-500 mb-6">{partnerBanner.title}</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partnerBanner.partners.map((partner, index) => (
            <a
              key={index}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-10 md:h-12 w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
