export interface Event {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  location: string;
  address?: string;
  category: 'music' | 'outdoor' | 'food' | 'arts' | 'sports' | 'community';
  description: string;
  imageUrl?: string;
  ticketUrl?: string;
  price?: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'park' | 'dog-park' | 'trailhead' | 'ski' | 'brewery' | 'restaurant' | 'venue' | 'recreation' | 'family' | 'museum';
  coordinates: [number, number]; // [lng, lat]
  description: string;
  amenities?: string[];
  website?: string;
  difficulty?: 'easy' | 'moderate' | 'hard';
  kidFriendly?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  href: string;
}

export type CrowdLevel = 'empty' | 'moderate' | 'busy' | 'packed';

export interface CrowdReport {
  id?: string;
  locationId: string;
  locationName: string;
  crowdLevel: CrowdLevel;
  comment?: string;
  timestamp: Date;
  expiresAt: Date;
}
