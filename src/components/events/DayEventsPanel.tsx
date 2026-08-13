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
        className="fixed inset-0 z-40 bg-black/70 md:hidden"
        onClick={onClose}
      />

      {/* Panel container */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] overflow-hidden border border-hair bg-film-deep md:relative md:bottom-auto md:left-auto md:right-auto md:z-auto md:max-h-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hair p-4">
          <h3 className="film-display-thin text-[20px] text-film-white">
            {formatFullDate(date)}
          </h3>
          <button
            onClick={onClose}
            className="row-hover flex h-8 w-8 items-center justify-center border border-hair text-whisper transition-colors hover:text-film-white"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Events list */}
        <div className="max-h-[calc(70vh-64px)] overflow-y-auto md:max-h-[500px]">
          {events.length > 0 ? (
            <div className="px-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} compact />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="small-caps text-whisper">No events on this day.</p>
              <p className="mt-1 font-mono text-[11px] text-whisper">
                Try selecting another date or adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
