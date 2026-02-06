export type Season = 'spring' | 'summer' | 'fall' | 'winter';
export type Difficulty = 'easy' | 'moderate' | 'challenging';

export interface GuideStop {
  id: string;
  time: string; // e.g., "6:00 AM", "Morning", "Dawn"
  title: string;
  location: string;
  description: string;
  tips?: string[];
  duration?: string; // e.g., "1-2 hours"
  coordinates?: [number, number];
  image?: string;
  isOptional?: boolean;
  alternatives?: {
    title: string;
    description: string;
  }[];
}

export interface GuidePracticalInfo {
  permits?: string[];
  parking?: string[];
  gear?: string[];
  accessibility?: string;
  budgetEstimate?: string;
}

export interface GuideSeasonalNote {
  seasons: Season[];
  note: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  heroImage: string;
  duration: string; // e.g., "Full Day (8-10 hours)"
  difficulty: Difficulty;
  seasons: Season[];
  seasonalNotes: GuideSeasonalNote[];
  bestFor: string[]; // e.g., ["Photographers", "Early risers"]
  stops: GuideStop[];
  practicalInfo: GuidePracticalInfo;
  seoTitle: string;
  seoDescription: string;
}
