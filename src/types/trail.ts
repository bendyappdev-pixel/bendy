export type TrailDifficulty = 'easy' | 'moderate' | 'difficult' | 'expert';
export type TrailActivity = 'hiking' | 'mountain-biking' | 'trail-running' | 'cross-country-skiing' | 'snowshoeing';
export type TrailSeason = 'year-round' | 'spring-fall' | 'summer-only' | 'winter-only';
export type TrailType = 'loop' | 'out-and-back' | 'point-to-point';

export interface Trail {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;

  // Stats
  distance: number; // miles
  elevationGain: number; // feet
  highestPoint?: number; // feet
  difficulty: TrailDifficulty;
  estimatedTime: string;
  trailType: TrailType;

  // Activities & Features
  activities: TrailActivity[];
  features: string[];
  isDogFriendly: boolean;
  isKidFriendly: boolean;

  // Location
  trailhead: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
    parking: string;
  };

  // Season & Access
  bestSeason: string;
  seasonalAccess: TrailSeason;
  permitRequired: boolean;
  permitInfo?: string;
  fees: string;
  managedBy: string;

  // Media
  heroImage: string;
  images: string[];

  // Distance from Bend
  distanceFromBend: number;
  direction: string;
}
