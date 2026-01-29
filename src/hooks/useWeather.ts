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

// Weather codes from Open-Meteo WMO
export const weatherDescriptions: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Foggy', icon: '🌫️' },
  48: { description: 'Rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌧️' },
  53: { description: 'Drizzle', icon: '🌧️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Freezing drizzle', icon: '🌧️' },
  57: { description: 'Dense freezing drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Freezing rain', icon: '🌧️' },
  67: { description: 'Heavy freezing rain', icon: '🌧️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Snow', icon: '🌨️' },
  75: { description: 'Heavy snow', icon: '🌨️' },
  77: { description: 'Snow grains', icon: '🌨️' },
  80: { description: 'Slight showers', icon: '🌦️' },
  81: { description: 'Showers', icon: '🌦️' },
  82: { description: 'Violent showers', icon: '🌦️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '🌨️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

export function getWeatherInfo(code: number, isDay: boolean = true) {
  const info = weatherDescriptions[code] || { description: 'Unknown', icon: '❓' };
  // Use moon for clear night
  if (code <= 1 && !isDay) {
    return { ...info, icon: '🌙' };
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
