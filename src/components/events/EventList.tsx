import { useState } from 'react';
import { Event } from '../../types';
import EventCard from './EventCard';

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
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === cat.value
                ? 'bg-forest text-white'
                : 'bg-white text-gray-700 hover:bg-sage/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found in this category.</p>
        </div>
      )}
    </div>
  );
}
