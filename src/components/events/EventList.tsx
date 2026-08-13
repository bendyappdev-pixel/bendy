import { useState } from 'react';
import { Event } from '../../types';
import EventCard from './EventCard';
import { cn } from '../../lib/utils';

interface EventListProps {
  events: Event[];
}

export const categories = [
  { value: 'all', label: 'All Events' },
  { value: 'music', label: 'Live Music' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'food', label: 'Food & Drink' },
  { value: 'arts', label: 'Arts & Culture' },
  { value: 'sports', label: 'Sports' },
  { value: 'community', label: 'Community' },
];

export default function EventList({ events }: EventListProps) {
  const [filter, setFilter] = useState('all');

  const filteredEvents = filter === 'all'
    ? events
    : events.filter((event) => event.category === filter);

  return (
    <div>
      {/* Filter chips — square, hairline, ember when active. */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            aria-pressed={filter === cat.value}
            className={cn(
              'small-caps border px-3 py-2 transition-colors',
              filter === cat.value
                ? 'border-ember text-ember'
                : 'border-hair text-whisper hover:text-film-white'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events — hairline rows */}
      {filteredEvents.length > 0 ? (
        <div className="border-t border-hair">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="small-caps text-whisper">No events found in this category.</p>
        </div>
      )}
    </div>
  );
}
