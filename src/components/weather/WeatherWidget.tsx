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
      <div className="border border-hair p-4">
        <p className="font-mono text-[12px] text-whisper">Reading the sky…</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="border border-hair p-4 text-center">
        <p className="font-mono text-[12px] text-whisper">{error || 'Weather unavailable'}</p>
      </div>
    );
  }

  const { current, daily } = weather;
  const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-3 border border-hair px-4 py-2">
        <span className="film-display-thin text-[18px] text-film-white">
          {current.temperature}°F
        </span>
        <span className="hidden font-mono text-[11px] text-whisper sm:inline">
          {weatherInfo.description}
        </span>
      </div>
    );
  }

  return (
    <div className="border border-hair">
      {/* Current Weather */}
      <div className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="small-caps text-whisper">Bend, Oregon</div>
          <div className="font-mono text-[10px] text-whisper">
            Updated{' '}
            {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-end gap-5">
            {/* .film-display already sets line-height 0.85 — do not stack
                extra negative leading here, glyphs will collide. */}
            <div className="film-display text-[140px] text-film-white">
              {current.temperature}°
            </div>
            <div className="pb-2">
              <div className="serif-i text-[26px] leading-tight text-film-white">
                {weatherInfo.description}
              </div>
            </div>
          </div>

          <div className="shrink-0 space-y-1.5 font-mono text-[11px] text-whisper">
            <div className="flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Feels {current.feelsLike}°</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {current.windSpeed} mph {getWindDirection(current.windDirection)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{current.humidity}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="small-caps flex w-full items-center justify-center gap-2 border-t border-hair py-3 text-whisper transition-colors hover:text-film-white"
      >
        {expanded ? (
          <>
            <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            Hide Forecast
          </>
        ) : (
          <>
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            5-Day Forecast
          </>
        )}
      </button>

      {/* Forecast */}
      {expanded && (
        <div className="border-t border-hair p-4">
          <div className="grid grid-cols-5 gap-2 font-mono text-[10px]">
            {daily.map((day, i) => (
              <div key={i} className="border border-hair py-3 text-center">
                <div className="text-whisper">{formatDay(day.date)}</div>
                <div className="film-display-thin mt-1.5 text-[20px] text-film-white">
                  {day.tempMax}°
                </div>
                <div className="mt-1 text-whisper">{day.tempMin}°</div>
                {day.precipProbability > 0 && (
                  <div className="mt-1.5 flex items-center justify-center gap-0.5 text-whisper">
                    <Droplets className="h-2.5 w-2.5" aria-hidden="true" />
                    {day.precipProbability}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
