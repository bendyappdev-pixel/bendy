import { useState } from 'react';
import { Wind, Droplets, ChevronDown, ChevronUp, Thermometer } from 'lucide-react';
import {
  useWeather,
  getWeatherInfo,
  getWindDirection,
  formatDay,
} from '../../hooks/useWeather';

interface WeatherWidgetProps {
  compact?: boolean;
}

export default function WeatherWidget({ compact = false }: WeatherWidgetProps) {
  const { weather, loading, error } = useWeather();
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
            <div className="h-6 w-16 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-navy-700/50 rounded-2xl p-4 text-center border border-white/10">
        <p className="text-gray-500 text-sm">{error || 'Weather unavailable'}</p>
      </div>
    );
  }

  const { current, daily } = weather;
  const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 bg-navy-700/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
        <span className="text-xl">{weatherInfo.icon}</span>
        <span className="font-semibold text-white">{current.temperature}°F</span>
        <span className="text-gray-400 text-sm hidden sm:inline">
          {weatherInfo.description}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 rounded-2xl overflow-hidden text-white shadow-lg">
      {/* Current Weather */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-white/80">Bend, Oregon</div>
          <div className="text-xs text-white/60">
            Updated {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{weatherInfo.icon}</div>
            <div>
              <div className="text-5xl font-bold tracking-tight">
                {current.temperature}°
              </div>
              <div className="text-white/80 mt-1">{weatherInfo.description}</div>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-white/80 justify-end">
              <Thermometer className="w-4 h-4" />
              <span>Feels {current.feelsLike}°</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-white/80 justify-end">
              <Wind className="w-4 h-4" />
              <span>{current.windSpeed} mph {getWindDirection(current.windDirection)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-white/80 justify-end">
              <Droplets className="w-4 h-4" />
              <span>{current.humidity}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1 py-2 bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Hide Forecast
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            5-Day Forecast
          </>
        )}
      </button>

      {/* Forecast */}
      {expanded && (
        <div className="px-5 pb-5 pt-3">
          <div className="grid grid-cols-5 gap-2">
            {daily.map((day, i) => {
              const dayInfo = getWeatherInfo(day.weatherCode);
              return (
                <div
                  key={i}
                  className="text-center p-2 rounded-xl bg-white/10"
                >
                  <div className="text-xs font-medium text-white/70 mb-1">
                    {formatDay(day.date)}
                  </div>
                  <div className="text-2xl mb-1">{dayInfo.icon}</div>
                  <div className="text-sm font-semibold">{day.tempMax}°</div>
                  <div className="text-xs text-white/60">{day.tempMin}°</div>
                  {day.precipProbability > 0 && (
                    <div className="text-xs text-blue-200 mt-1 flex items-center justify-center gap-0.5">
                      <Droplets className="w-3 h-3" />
                      {day.precipProbability}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
