/**
 * Ad Management Hook for Bendy
 *
 * Currently loads ads from a local JSON file.
 * Can be easily swapped to fetch from an API by modifying the getAds() function.
 */

import adsData from '../data/ads.json';

// Type definitions for ad slots
export interface Partner {
  name: string;
  logo: string;
  url: string;
}

export interface PartnerBannerAd {
  enabled: boolean;
  title: string;
  partners: Partner[];
}

export interface WeekendPickAd {
  enabled: boolean;
  title: string;
  description: string;
  image: string;
  url: string;
  sponsor: string;
}

export interface SponsoredEventAd {
  enabled: boolean;
  title: string;
  description: string;
  date: string;
  location: string;
  price: string;
  url: string;
  sponsor: string;
}

export interface InFeedBannerAd {
  enabled: boolean;
  title: string;
  description: string;
  image: string;
  url: string;
  sponsor: string;
  ctaText: string;
}

export interface SponsoredMapPin {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  url: string;
  sponsor: string;
}

export interface SponsoredMapPinsAd {
  enabled: boolean;
  pins: SponsoredMapPin[];
}

export interface ContextualBannerAd {
  enabled: boolean;
  title: string;
  description: string;
  image: string;
  url: string;
  sponsor: string;
  ctaText: string;
}

export interface AdsConfig {
  partnerBanner: PartnerBannerAd;
  weekendPick: WeekendPickAd;
  sponsoredEvent: SponsoredEventAd;
  inFeedBanner: InFeedBannerAd;
  sponsoredMapPins: SponsoredMapPinsAd;
  contextualBanner: ContextualBannerAd;
}

type AdSlotName = keyof AdsConfig;

/**
 * Get all ads configuration
 * Future: Replace with API call
 */
export function getAds(): AdsConfig {
  // Filter out the _comments field
  const { _comments, ...ads } = adsData as AdsConfig & { _comments?: unknown };
  return ads as AdsConfig;
}

/**
 * Get a specific ad slot by name
 */
export function getAd<T extends AdSlotName>(slotName: T): AdsConfig[T] | null {
  const ads = getAds();
  return ads[slotName] || null;
}

/**
 * Check if an ad slot is enabled
 */
export function isAdEnabled(slotName: AdSlotName): boolean {
  const ad = getAd(slotName);
  return ad?.enabled ?? false;
}

/**
 * React hook for using ads in components
 */
export function useAds() {
  const ads = getAds();

  return {
    ads,
    getAd,
    isAdEnabled,
    partnerBanner: ads.partnerBanner,
    weekendPick: ads.weekendPick,
    sponsoredEvent: ads.sponsoredEvent,
    inFeedBanner: ads.inFeedBanner,
    sponsoredMapPins: ads.sponsoredMapPins,
    contextualBanner: ads.contextualBanner,
  };
}

export default useAds;
