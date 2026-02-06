import {
  MountainConditions,
  RiverConditions,
  AirQuality,
  RoadCondition,
  ParkingConditions,
} from '../types/conditions';

// Mock data - will be replaced with real API calls

export const mockMountainConditions: MountainConditions = {
  snowDepthBase: 67,
  snowDepthSummit: 112,
  newSnow24h: 4,
  newSnow48h: 11,
  liftsOpen: 11,
  liftsTotal: 15,
  terrainOpen: 92,
  conditions: 'Packed Powder',
  lastUpdated: new Date(),
};

export const mockRiverConditions: RiverConditions[] = [
  {
    name: 'Deschutes River',
    location: 'Below Wickiup Dam',
    flowRate: 1250,
    flowTrend: 'stable',
    temperature: 48,
    status: 'good',
    fishingRating: 'Excellent - optimal flows for fly fishing',
    paddlingRating: 'Great for all skill levels',
    lastUpdated: new Date(),
  },
  {
    name: 'Deschutes River',
    location: 'At Bend',
    flowRate: 1450,
    flowTrend: 'rising',
    temperature: 52,
    status: 'good',
    fishingRating: 'Good - slight rise in flows',
    paddlingRating: 'Ideal for SUP and kayaking',
    lastUpdated: new Date(),
  },
  {
    name: 'Metolius River',
    location: 'Near Camp Sherman',
    flowRate: 1580,
    flowTrend: 'stable',
    temperature: 46,
    status: 'good',
    fishingRating: 'Excellent - clear water, active fish',
    paddlingRating: 'Not recommended - cold, swift current',
    lastUpdated: new Date(),
  },
];

export const mockAirQuality: AirQuality = {
  aqi: 42,
  category: 'Good',
  primaryPollutant: 'PM2.5',
  healthMessage: 'Air quality is satisfactory. Enjoy outdoor activities!',
  status: 'good',
  forecast: 'Good air quality expected through the weekend',
  lastUpdated: new Date(),
};

export const mockRoadConditions: RoadCondition[] = [
  {
    name: 'Santiam Pass',
    route: 'US-20',
    status: 'open',
    conditions: 'Wet pavement, clear visibility',
    elevation: 4817,
    lastUpdated: new Date(),
  },
  {
    name: 'McKenzie Pass',
    route: 'OR-242',
    status: 'closed',
    conditions: 'Closed for winter season (Nov-June)',
    elevation: 5325,
    lastUpdated: new Date(),
  },
  {
    name: 'Cascade Lakes Highway',
    route: 'OR-46',
    status: 'open',
    conditions: 'Open to Mt. Bachelor, snow beyond',
    elevation: 6300,
    lastUpdated: new Date(),
  },
  {
    name: 'Newberry Crater',
    route: 'FR-21',
    status: 'chains-required',
    conditions: 'Packed snow, chains or AWD required',
    elevation: 6400,
    lastUpdated: new Date(),
  },
];

export const mockParkingConditions: ParkingConditions[] = [
  {
    zone: 'Downtown Core',
    available: 108,
    total: 120,
    status: 'good',
    trend: 'stable',
  },
  {
    zone: 'Old Mill District',
    available: 315,
    total: 350,
    status: 'good',
    trend: 'stable',
  },
  {
    zone: 'Box Factory',
    available: 72,
    total: 80,
    status: 'good',
    trend: 'stable',
  },
];

// Helper function to calculate sunrise/sunset for Bend, OR
export function calculateSunTimes(): {
  sunrise: string;
  sunset: string;
  dayLength: string;
  goldenHourMorning: string;
  goldenHourEvening: string;
  civilTwilightEnd: string;
} {
  // Bend, OR coordinates
  const lat = 44.0582;
  const lng = -121.3153;

  const today = new Date();
  const times = getSunTimes(today, lat, lng);

  return times;
}

function getSunTimes(date: Date, lat: number, lng: number) {
  // Simplified sunrise/sunset calculation
  const dayOfYear = getDayOfYear(date);

  // Calculate sunrise/sunset using a simplified algorithm
  const zenith = 90.833;
  const D2R = Math.PI / 180;
  const R2D = 180 / Math.PI;

  // Calculate the day of the year
  const N = dayOfYear;

  // Convert longitude to hour value and calculate approximate time
  const lngHour = lng / 15;

  // Sunrise
  const tRise = N + ((6 - lngHour) / 24);
  const MRise = (0.9856 * tRise) - 3.289;
  let LRise = MRise + (1.916 * Math.sin(MRise * D2R)) + (0.020 * Math.sin(2 * MRise * D2R)) + 282.634;
  LRise = LRise % 360;

  let RArise = R2D * Math.atan(0.91764 * Math.tan(LRise * D2R));
  RArise = RArise % 360;

  const LquadrantRise = Math.floor(LRise / 90) * 90;
  const RAquadrantRise = Math.floor(RArise / 90) * 90;
  RArise = RArise + (LquadrantRise - RAquadrantRise);
  RArise = RArise / 15;

  const sinDecRise = 0.39782 * Math.sin(LRise * D2R);
  const cosDecRise = Math.cos(Math.asin(sinDecRise));

  const cosHRise = (Math.cos(zenith * D2R) - (sinDecRise * Math.sin(lat * D2R))) / (cosDecRise * Math.cos(lat * D2R));
  const HRise = 360 - R2D * Math.acos(cosHRise);
  const HRiseHours = HRise / 15;

  let TRise = HRiseHours + RArise - (0.06571 * tRise) - 6.622;
  let UTRise = TRise - lngHour;
  UTRise = UTRise % 24;

  // Sunset
  const tSet = N + ((18 - lngHour) / 24);
  const MSet = (0.9856 * tSet) - 3.289;
  let LSet = MSet + (1.916 * Math.sin(MSet * D2R)) + (0.020 * Math.sin(2 * MSet * D2R)) + 282.634;
  LSet = LSet % 360;

  let RAset = R2D * Math.atan(0.91764 * Math.tan(LSet * D2R));
  RAset = RAset % 360;

  const LquadrantSet = Math.floor(LSet / 90) * 90;
  const RAquadrantSet = Math.floor(RAset / 90) * 90;
  RAset = RAset + (LquadrantSet - RAquadrantSet);
  RAset = RAset / 15;

  const sinDecSet = 0.39782 * Math.sin(LSet * D2R);
  const cosDecSet = Math.cos(Math.asin(sinDecSet));

  const cosHSet = (Math.cos(zenith * D2R) - (sinDecSet * Math.sin(lat * D2R))) / (cosDecSet * Math.cos(lat * D2R));
  const HSet = R2D * Math.acos(cosHSet);
  const HSetHours = HSet / 15;

  let TSet = HSetHours + RAset - (0.06571 * tSet) - 6.622;
  let UTSet = TSet - lngHour;
  UTSet = UTSet % 24;

  // Convert to local time (PST = UTC-8, PDT = UTC-7)
  const isDST = isDaylightSavingTime(date);
  const offset = isDST ? -7 : -8;

  let sunriseHour = UTRise + offset;
  let sunsetHour = UTSet + offset;

  if (sunriseHour < 0) sunriseHour += 24;
  if (sunsetHour < 0) sunsetHour += 24;

  const sunrise = formatTime(sunriseHour);
  const sunset = formatTime(sunsetHour);

  // Calculate day length
  const dayLengthHours = sunsetHour - sunriseHour;
  const dayLengthH = Math.floor(dayLengthHours);
  const dayLengthM = Math.round((dayLengthHours - dayLengthH) * 60);
  const dayLength = `${dayLengthH}h ${dayLengthM}m`;

  // Golden hours (roughly 1 hour after sunrise and 1 hour before sunset)
  const goldenHourMorning = formatTime(sunriseHour + 1);
  const goldenHourEvening = formatTime(sunsetHour - 1);

  // Civil twilight (roughly 30 min after sunset)
  const civilTwilightEnd = formatTime(sunsetHour + 0.5);

  return {
    sunrise,
    sunset,
    dayLength,
    goldenHourMorning,
    goldenHourEvening,
    civilTwilightEnd,
  };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function isDaylightSavingTime(date: Date): boolean {
  const jan = new Date(date.getFullYear(), 0, 1);
  const jul = new Date(date.getFullYear(), 6, 1);
  const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  return date.getTimezoneOffset() < stdOffset;
}

function formatTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}
