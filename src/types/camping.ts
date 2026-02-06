export type CampCategory = 'state-park' | 'high-lakes' | 'river' | 'volcanic' | 'rv-park';
export type DispersedCategory = 'sno-park' | 'dispersed-forest' | 'dispersed-desert' | 'trailhead';
export type SiteType = 'tent' | 'rv' | 'tent-rv' | 'cabins' | 'yurts';
export type ReservationSystem = 'recreation.gov' | 'reserve-america' | 'private' | 'first-come';
export type AccessType = '2WD' | 'High Clearance' | '4WD Required';
export type CrowdingLevel = 'High' | 'Moderate' | 'Low';
export type CellService = 'Good' | 'Limited' | 'None';

export interface Campground {
  id: string;
  name: string;
  category: CampCategory;
  siteTypes: SiteType[];
  coordinates: { lat: number; lng: number };
  distance: number; // miles from Bend
  direction: string; // 'N', 'SW', 'NW', etc.
  elevation?: number; // feet
  description: string;
  amenities: string[];
  reservationUrl?: string;
  reservationSystem: ReservationSystem;
  season: string;
  sites: number | string;
  cost: string;
  highlights: string[];
  nearbyAttraction?: string;
}

export interface DispersedSite {
  id: string;
  name: string;
  category: DispersedCategory;
  coordinates: { lat: number; lng: number };
  distance: number;
  direction: string;
  description: string;
  access: AccessType;
  season: string;
  amenities: string[];
  rules: string[];
  cost: string;
  cellService: CellService;
  bestFor: string[];
  crowding: CrowdingLevel;
  nearbyTrails?: string[];
}

export type CampingFilter = {
  category: 'all' | 'base-camp' | 'off-grid';
  subCategory: string;
  vehicleType: string[];
  amenities: string[];
  cost: string;
  season: string;
};
