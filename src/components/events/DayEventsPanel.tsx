import { X } from 'lucide-react';
import { Event } from '../../types';
import { formatFullDate } from '../../utils/dateUtils';
import EventCard from './EventCard';

interface DayEventsPanelProps {
  date: Date;
  events: Event[];
  onClose: () => void;
}

export default function DayEventsPanel({ date, events, onClose }: DayEventsPanelProps) {
  return (
    <>
      {/* Mobile: Bottom sheet overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Panel container */}
      <div
        className={`
          fixed md:relative
          bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto
          bg-snow rounded-t-2xl md:rounded-2xl shadow-lg
          z-50 md:z-auto
          max-h-[70vh] md:max-h-none
          overflow-hidden
          animate-slide-up md:animate-none
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {formatFullDate(date)}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-sage/20 transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Events list */}
        <div className="p-4 overflow-y-auto max-h-[calc(70vh-64px)] md:max-h-[500px]">
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} compact />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No events on this day.</p>
              <p className="text-sm text-gray-400 mt-1">
                Try selecting another date or adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
