export type ConditionStatus = 'good' | 'moderate' | 'poor' | 'closed';

export interface MountainConditions {
  snowDepthBase: number; // inches
  snowDepthSummit: number;
  newSnow24h: number;
  newSnow48h: number;
  liftsOpen: number;
  liftsTotal: number;
  terrainOpen: number; // percentage
  conditions: string;
  lastUpdated: Date;
}

export interface RiverConditions {
  name: string;
  location: string;
  flowRate: number; // cfs
  flowTrend: 'rising' | 'falling' | 'stable';
  temperature: number; // fahrenheit
  status: ConditionStatus;
  fishingRating: string;
  paddlingRating: string;
  lastUpdated: Date;
}

export interface AirQuality {
  aqi: number;
  category: string;
  primaryPollutant: string;
  healthMessage: string;
  status: ConditionStatus;
  forecast: string;
  lastUpdated: Date;
}

export interface RoadCondition {
  name: string;
  route: string;
  status: 'open' | 'chains-required' | 'closed';
  conditions: string;
  elevation: number;
  lastUpdated: Date;
}

export interface SunTimes {
  sunrise: string;
  sunset: string;
  dayLength: string;
  goldenHourMorning: string;
  goldenHourEvening: string;
  civilTwilightEnd: string;
}

export interface ParkingConditions {
  zone: string;
  available: number;
  total: number;
  status: ConditionStatus;
  trend: 'filling' | 'emptying' | 'stable';
}
