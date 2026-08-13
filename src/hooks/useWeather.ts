import { useState, useEffect } from 'react';

// Bend, Oregon coordinates
const BEND_LAT = 44.0582;
const BEND_LNG = -121.3153;

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: Date;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipProbability: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  sunrise: Date;
  sunset: Date;
}

// Weather codes from Open-Meteo WMO.
//
// These carried an emoji glyph per code until the cinematic facelift, which
// bans emoji in UI. Nothing rendered them by the end — every surface reads
// `description` and sets it in the display or serif face — so the field is
// gone rather than left as a trap for the next person.
export const weatherDescriptions: Record<number, { description: string }> = {
  0: { description: 'Clear sky' },
  1: { description: 'Mainly clear' },
  2: { description: 'Partly cloudy' },
  3: { description: 'Overcast' },
  45: { description: 'Foggy' },
  48: { description: 'Rime fog' },
  51: { description: 'Light drizzle' },
  53: { description: 'Drizzle' },
  55: { description: 'Dense drizzle' },
  56: { description: 'Freezing drizzle' },
  57: { description: 'Dense freezing drizzle' },
  61: { description: 'Slight rain' },
  63: { description: 'Rain' },
  65: { description: 'Heavy rain' },
  66: { description: 'Freezing rain' },
  67: { description: 'Heavy freezing rain' },
  71: { description: 'Slight snow' },
  73: { description: 'Snow' },
  75: { description: 'Heavy snow' },
  77: { description: 'Snow grains' },
  80: { description: 'Slight showers' },
  81: { description: 'Showers' },
  82: { description: 'Violent showers' },
  85: { description: 'Slight snow showers' },
  86: { description: 'Heavy snow showers' },
  95: { description: 'Thunderstorm' },
  96: { description: 'Thunderstorm with hail' },
  99: { description: 'Thunderstorm with heavy hail' },
};

export function getWeatherInfo(code: number, isDay: boolean = true) {
  const info = weatherDescriptions[code] || { description: 'Unknown' };
  // `isDay` used to swap in a moon glyph; it now adjusts the wording instead,
  // so a clear night doesn't read as "Clear sky" after dark.
  if (code <= 1 && !isDay) {
    return { description: code === 0 ? 'Clear night' : 'Mainly clear night' };
  }
  return info;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const params = new URLSearchParams({
          latitude: BEND_LAT.toString(),
          longitude: BEND_LNG.toString(),
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day',
          daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
          temperature_unit: 'fahrenheit',
          wind_speed_unit: 'mph',
          timezone: 'America/Los_Angeles',
          forecast_days: '5',
        });

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();

        const weatherData: WeatherData = {
          current: {
            temperature: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature),
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m),
            windDirection: data.current.wind_direction_10m,
            weatherCode: data.current.weather_code,
            isDay: data.current.is_day === 1,
          },
          daily: data.daily.time.map((date: string, i: number) => ({
            date: new Date(date),
            tempMax: Math.round(data.daily.temperature_2m_max[i]),
            tempMin: Math.round(data.daily.temperature_2m_min[i]),
            weatherCode: data.daily.weather_code[i],
            precipProbability: data.daily.precipitation_probability_max[i],
          })),
          sunrise: new Date(data.daily.sunrise[0]),
          sunset: new Date(data.daily.sunset[0]),
        };

        setWeather(weatherData);
        setError(null);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Unable to load weather');
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();

    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { weather, loading, error };
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function formatDay(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { weekday: 'short' });
}
