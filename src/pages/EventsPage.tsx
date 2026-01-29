import { Calendar, ExternalLink } from 'lucide-react';
import EventList from '../components/events/EventList';
import { events, eventSources } from '../data/events';
import { SponsoredEvent, InFeedBanner } from '../components/ads';

export default function EventsPage() {
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

      {/* Events List */}
      <EventList events={events} />

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
