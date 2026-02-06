import { Calendar, MapPin, Tag, ExternalLink } from 'lucide-react';
import { Event } from '../../types';
import AddToCalendar from './AddToCalendar';

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

const categoryColors: Record<Event['category'], string> = {
  music: 'bg-purple-500/20 text-purple-400',
  outdoor: 'bg-green-500/20 text-green-400',
  food: 'bg-amber-500/20 text-amber-400',
  arts: 'bg-pink-500/20 text-pink-400',
  sports: 'bg-blue-500/20 text-blue-400',
  community: 'bg-teal-500/20 text-teal-400',
};

const categoryLabels: Record<Event['category'], string> = {
  music: 'Live Music',
  outdoor: 'Outdoor',
  food: 'Food & Drink',
  arts: 'Arts & Culture',
  sports: 'Sports',
  community: 'Community',
};

function formatDate(date: Date, endDate?: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };
  const start = date.toLocaleDateString('en-US', options);
  if (endDate) {
    const end = endDate.toLocaleDateString('en-US', options);
    return `${start} - ${end}`;
  }
  return start;
}

export default function EventCard({ event, compact = false }: EventCardProps) {
  if (compact) {
    return (
      <article className="card overflow-hidden hover:border-white/20 transition-all">
        <div className="p-4">
          {/* Category Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              categoryColors[event.category]
            }`}
          >
            <Tag className="w-2.5 h-2.5" />
            {categoryLabels[event.category]}
          </span>

          {/* Title */}
          <h3 className="text-base font-semibold text-white mt-2 mb-1 font-heading">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-3 line-clamp-1">
            {event.description}
          </p>

          {/* Details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-sunset-400" />
              <span>{event.location}</span>
            </div>
            {event.price && (
              <span className="text-sunset-400 font-semibold">{event.price}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-white/10">
            <AddToCalendar event={event} compact />
            {event.ticketUrl && (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-sunset-400 hover:underline"
              >
                Get Tickets
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card overflow-hidden hover:border-white/20 hover:shadow-lg hover:shadow-black/20 transition-all">
      <div className="p-5">
        {/* Category Badge */}
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
            categoryColors[event.category]
          }`}
        >
          <Tag className="w-3 h-3" />
          {categoryLabels[event.category]}
        </span>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mt-3 mb-2 font-heading">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4 text-sunset-400" />
            <span>{formatDate(event.date, event.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="w-4 h-4 text-sunset-400" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            {event.price && (
              <span className="text-sunset-400 font-semibold">{event.price}</span>
            )}
            <AddToCalendar event={event} />
          </div>
          {event.ticketUrl && (
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-sunset-400 hover:underline"
            >
              Get Tickets
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
