import { Calendar, MapPin, Tag, ExternalLink } from 'lucide-react';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
}

const categoryColors: Record<Event['category'], string> = {
  music: 'bg-purple-100 text-purple-700',
  outdoor: 'bg-green-100 text-green-700',
  food: 'bg-amber-100 text-amber-700',
  arts: 'bg-pink-100 text-pink-700',
  sports: 'bg-blue-100 text-blue-700',
  community: 'bg-teal-100 text-teal-700',
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

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="card overflow-hidden hover:shadow-lg transition-shadow">
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
        <h3 className="text-lg font-semibold text-gray-900 mt-3 mb-2 font-heading">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-forest" />
            <span>{formatDate(event.date, event.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-forest" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {event.price && (
            <span className="text-forest font-semibold">{event.price}</span>
          )}
          {event.ticketUrl && (
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-mountain hover:underline"
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
