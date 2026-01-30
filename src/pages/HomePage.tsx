import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import CategoryCard from '../components/home/CategoryCard';
import { categories } from '../data/categories';
import { MapPin, Compass, Sun, Users, Cloud, Calendar, ArrowRight } from 'lucide-react';
import { PartnerBanner } from '../components/ads';
import { CrowdReportsList } from '../components/crowd';
import { WeatherWidget } from '../components/weather';
import { events } from '../data/events';

export default function HomePage() {
  return (
    <div>
      <Hero />

      {/* Categories Section */}
      <section className="container-app py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Bend
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From world-class skiing to craft breweries, discover what makes Bend one of the best outdoor towns in America.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Plan Your Visit Section */}
      <section className="container-app pb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Plan Your Visit
          </h2>
          <p className="text-gray-600">Current conditions and what's happening in Bend</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-mountain to-mountain/80 px-5 py-4">
              <div className="flex items-center gap-2 text-white">
                <Cloud className="w-5 h-5" />
                <h3 className="font-semibold">Weather</h3>
              </div>
            </div>
            <div className="p-4">
              <WeatherWidget />
            </div>
          </div>

          {/* Crowd Reports Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-forest to-forest/80 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5" />
                  <h3 className="font-semibold">Crowd Reports</h3>
                </div>
                <Link
                  to="/map"
                  className="text-white/80 hover:text-white text-sm flex items-center gap-1"
                >
                  Report
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            <div className="p-4">
              <CrowdReportsList limit={3} showTitle={false} compact />
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5" />
                  <h3 className="font-semibold">Upcoming Events</h3>
                </div>
                <Link
                  to="/events"
                  className="text-white/80 hover:text-white text-sm flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            <div className="p-4">
              <UpcomingEventsList />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-forest text-white py-16">
        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sun className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold mb-2">300+</div>
              <div className="text-sage">Days of Sunshine</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-sage">Miles of Trails</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold mb-2">30+</div>
              <div className="text-sage">Craft Breweries</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Bend */}
      <section className="container-app py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Bend?
            </h2>
            <p className="text-gray-600 mb-4">
              Nestled in the high desert of Central Oregon, Bend offers an unparalleled combination of outdoor recreation,
              natural beauty, and vibrant culture. With Mt. Bachelor just 22 miles away and the Deschutes River running
              through downtown, adventure is always within reach.
            </p>
            <p className="text-gray-600 mb-6">
              Whether you're here to ski, bike, paddle, or simply enjoy the craft beer scene, Bend welcomes you with
              300+ days of sunshine and endless opportunities for exploration.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-sage/20 text-forest rounded-full text-sm font-medium">
                Skiing & Snowboarding
              </span>
              <span className="px-4 py-2 bg-sage/20 text-forest rounded-full text-sm font-medium">
                Mountain Biking
              </span>
              <span className="px-4 py-2 bg-sage/20 text-forest rounded-full text-sm font-medium">
                Craft Beer
              </span>
              <span className="px-4 py-2 bg-sage/20 text-forest rounded-full text-sm font-medium">
                Hiking
              </span>
              <span className="px-4 py-2 bg-sage/20 text-forest rounded-full text-sm font-medium">
                Rock Climbing
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-sage/30 to-mountain/20 rounded-2xl p-8 aspect-square flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-20 h-20 text-forest mx-auto mb-4" />
              <p className="text-forest font-semibold text-lg">
                44.0582° N, 121.3153° W
              </p>
              <p className="text-gray-600">
                Elevation: 3,623 ft
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Banner */}
      <PartnerBanner />
    </div>
  );
}

// Helper component to show upcoming events
function UpcomingEventsList() {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Get events in the next 7 days
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(
        event.date.getUTCFullYear(),
        event.date.getUTCMonth(),
        event.date.getUTCDate()
      );
      const endDate = event.endDate
        ? new Date(
            event.endDate.getUTCFullYear(),
            event.endDate.getUTCMonth(),
            event.endDate.getUTCDate()
          )
        : eventDate;

      // Check if event falls within next 7 days
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return endDate >= todayStart && eventDate <= nextWeek;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 4);

  if (upcomingEvents.length === 0) {
    return (
      <div className="text-center py-4">
        <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No events this week</p>
        <Link to="/events" className="text-sm text-forest hover:underline">
          Browse all events
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {upcomingEvents.map((event) => (
        <Link
          key={event.id}
          to="/events"
          className="block p-3 bg-gray-50 rounded-xl hover:bg-sage/20 transition-colors"
        >
          <p className="font-medium text-gray-900 text-sm truncate">{event.title}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>
              {event.date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span>•</span>
            <span className="truncate">{event.location}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
