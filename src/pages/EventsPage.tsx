import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import SceneHeader from '../components/ui/SceneHeader';
import { categories } from '../components/events/EventList';
import EventCard from '../components/events/EventCard';
import EventCalendar from '../components/events/EventCalendar';
import DayEventsPanel from '../components/events/DayEventsPanel';
import ViewToggle, { ViewMode } from '../components/events/ViewToggle';
import { events, eventSources, upcomingEvents } from '../data/events';
import { SponsoredEvent, InFeedBanner } from '../components/ads';
import { getEventsForDay } from '../utils/dateUtils';
import { cn } from '../lib/utils';

export default function EventsPage() {
  const [view, setView] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filter, setFilter] = useState('all');

  // Filter events based on selected category and sort by date (upcoming first)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredEvents = (filter === 'all'
    ? events
    : events.filter((event) => event.category === filter))
    // Sort by date - upcoming events first, then by date ascending
    .sort((a, b) => {
      const dateA = a.date.getTime();
      const dateB = b.date.getTime();
      const todayTime = today.getTime();

      // Check if events are upcoming or past
      const aIsUpcoming = dateA >= todayTime || (a.endDate && a.endDate.getTime() >= todayTime);
      const bIsUpcoming = dateB >= todayTime || (b.endDate && b.endDate.getTime() >= todayTime);

      // Upcoming events come before past events
      if (aIsUpcoming && !bIsUpcoming) return -1;
      if (!aIsUpcoming && bIsUpcoming) return 1;

      // Within same group (both upcoming or both past), sort by date ascending
      return dateA - dateB;
    });

  // Get events for the selected date (respecting filters)
  const selectedDayEvents = selectedDate
    ? getEventsForDay(filteredEvents, selectedDate)
    : [];

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleClosePanel = () => {
    setSelectedDate(null);
  };

  return (
    <div className="container-app py-8 md:py-12">
      {/* Header */}
      <div className="mb-10 border-b border-hair pb-8">
        <SceneHeader
          as="h1"
          kicker="Now Showing"
          title="The Full Programme."
          meta={`${upcomingEvents().length} events still to come`}
        >
          <p className="max-w-md leading-relaxed text-mist md:ml-auto">
            Festivals, markets, live music, and local happenings around Bend.
          </p>
        </SceneHeader>
      </div>

      {/* Sponsored Event - Featured at top (hidden when no ads) */}
      <div className="mb-8">
        <SponsoredEvent />
      </div>

      {/* Controls: view toggle + category filters */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <ViewToggle view={view} onViewChange={setView} />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              aria-pressed={filter === cat.value}
              className={cn(
                'small-caps border px-3 py-2 min-h-[44px] transition-colors',
                filter === cat.value
                  ? 'border-ember text-ember'
                  : 'border-hair text-whisper hover:text-film-white'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on view mode */}
      {view === 'list' ? (
        <>
          {/* Events list */}
          {filteredEvents.length > 0 ? (
            <div className="border-t border-hair">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="border border-hair py-12 text-center">
              <p className="small-caps text-whisper">No events found in this category.</p>
            </div>
          )}
        </>
      ) : (
        /* Calendar View */
        <div className="flex flex-col gap-6 md:flex-row">
          <div className={selectedDate ? 'md:w-2/3' : 'w-full'}>
            <EventCalendar
              events={filteredEvents}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
            />
          </div>

          {/* Day Events Panel - Desktop sidebar */}
          {selectedDate && (
            <div className="hidden md:block md:w-1/3">
              <DayEventsPanel
                date={selectedDate}
                events={selectedDayEvents}
                onClose={handleClosePanel}
              />
            </div>
          )}
        </div>
      )}

      {/* Mobile Day Events Panel - Bottom sheet */}
      {view === 'calendar' && selectedDate && (
        <div className="md:hidden">
          <DayEventsPanel
            date={selectedDate}
            events={selectedDayEvents}
            onClose={handleClosePanel}
          />
        </div>
      )}

      {/* In-Feed Banner Ad (hidden when no ads) */}
      <div className="my-8">
        <InFeedBanner />
      </div>

      {/* Event Sources */}
      <div className="mt-8 border-t border-hair pt-8">
        <h3 className="film-display-thin mb-4 text-[22px] text-film-white">Find More Events</h3>
        <div className="border-t border-hair">
          {eventSources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="row-hover flex items-start gap-3 border-b border-hair py-4"
            >
              <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-ember" aria-hidden="true" />
              <div>
                <p className="film-display-thin text-[16px] text-film-white">{source.name}</p>
                <p className="font-mono text-[11px] text-mist">{source.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Submit Event */}
      <div className="mt-8 border border-hair p-6 md:p-8">
        <h3 className="film-display-thin mb-3 text-[24px] text-film-white">
          Submit an Event
        </h3>
        <p className="mb-4 max-w-2xl leading-relaxed text-mist">
          Know of an event happening in Bend that should be listed here? We'd love to hear about it.
          Community events, concerts, outdoor activities, and more are welcome.
        </p>
        <button className="btn-primary">
          Submit Event
        </button>
      </div>
    </div>
  );
}
