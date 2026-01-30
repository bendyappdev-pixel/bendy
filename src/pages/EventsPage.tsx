import { useState } from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { categories } from '../components/events/EventList';
import EventCard from '../components/events/EventCard';
import EventCalendar from '../components/events/EventCalendar';
import DayEventsPanel from '../components/events/DayEventsPanel';
import ViewToggle, { ViewMode } from '../components/events/ViewToggle';
import { events, eventSources } from '../data/events';
import { SponsoredEvent, InFeedBanner } from '../components/ads';
import { getEventsForDay } from '../utils/dateUtils';

export default function EventsPage() {
  const [view, setView] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filter, setFilter] = useState('all');

  // Filter events based on selected category
  const filteredEvents = filter === 'all'
    ? events
    : events.filter((event) => event.category === filter);

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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-mountain rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600">Festivals, markets, and local happenings</p>
          </div>
        </div>
      </div>

      {/* Sponsored Event - Featured at top */}
      <div className="mb-8">
        <SponsoredEvent />
      </div>

      {/* View Toggle */}
      <div className="mb-4">
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {/* Category Filters */}
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

      {/* Content based on view mode */}
      {view === 'list' ? (
        <>
          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id}>
                  {/* Importing EventCard directly to avoid double filtering */}
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No events found in this category.</p>
            </div>
          )}
        </>
      ) : (
        /* Calendar View */
        <div className="flex flex-col md:flex-row gap-6">
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

      {/* In-Feed Banner Ad */}
      <div className="my-8">
        <InFeedBanner />
      </div>

      {/* Event Sources */}
      <div className="mt-8 bg-sand rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Find More Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eventSources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
            >
              <ExternalLink className="w-5 h-5 text-mountain flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{source.name}</p>
                <p className="text-sm text-gray-600">{source.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-8 bg-sage/20 rounded-2xl p-6 md:p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Submit an Event
        </h3>
        <p className="text-gray-600 mb-4">
          Know of an event happening in Bend that should be listed here? We'd love to hear about it!
          Community events, concerts, outdoor activities, and more are welcome.
        </p>
        <button className="btn-primary">
          Submit Event
        </button>
      </div>
    </div>
  );
}
