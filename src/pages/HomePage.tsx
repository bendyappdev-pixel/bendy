import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import CategoryCard from '../components/home/CategoryCard';
import { categories } from '../data/categories';
import { MapPin, Compass, Sun, Users, Cloud, Calendar, ArrowRight, Clock, Mountain } from 'lucide-react';
import { PartnerBanner } from '../components/ads';
import { CrowdReportsList } from '../components/crowd';
import { WeatherWidget } from '../components/weather';
import { events } from '../data/events';
import { guides } from '../data/guides';

export default function HomePage() {
  return (
    <div>
      <Hero />

      {/* Plan Today Section */}
      <section className="container-app py-16">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-10 h-10 bg-sunset-500/20 rounded-xl flex items-center justify-center">
            <Sun className="w-5 h-5 text-sunset-400" />
          </span>
          Plan Today
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather Card */}
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4">
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
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-pine-700 to-pine-600 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5" />
                  <h3 className="font-semibold">Crowd Reports</h3>
                </div>
                <Link
                  to="/map"
                  className="text-white/80 hover:text-white text-sm flex items-center gap-1 transition-colors"
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
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-sunset-500 to-sunset-400 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5" />
                  <h3 className="font-semibold">Upcoming Events</h3>
                </div>
                <Link
                  to="/events"
                  className="text-white/80 hover:text-white text-sm flex items-center gap-1 transition-colors"
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

      {/* Local Guides Section */}
      <section className="container-app py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-pine-700/30 rounded-xl flex items-center justify-center">
              <Compass className="w-5 h-5 text-pine-400" />
            </span>
            Local Guides
          </h2>
          <Link
            to="/guides"
            className="text-sunset-400 hover:text-sunset-300 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-gray-400 mb-8 max-w-2xl">
          Curated day-long adventures from locals who know Bend best. Skip the research and get straight to the adventure.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.slice(0, 2).map((guide) => (
            <Link
              key={guide.id}
              to={`/guides/${guide.slug}`}
              className="group card overflow-hidden hover:border-sunset-500/50 transition-all duration-300"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={guide.heroImage}
                  alt={guide.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-sunset-400 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sunset-400 text-sm font-medium mb-2">{guide.tagline}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {guide.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mountain className="w-4 h-4" />
                    {guide.stops.length} stops
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-navy-800/30">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore Bend
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From world-class skiing to craft breweries, discover what makes Bend one of the best outdoor towns in America.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-gradient-to-r from-pine-700 to-pine-600 py-16 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="container-app relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                <Sun className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-extrabold text-white mb-2">300+</div>
              <div className="text-white/80 text-lg">Days of Sunshine</div>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                <Compass className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-extrabold text-white mb-2">500+</div>
              <div className="text-white/80 text-lg">Miles of Trails</div>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-extrabold text-white mb-2">30+</div>
              <div className="text-white/80 text-lg">Craft Breweries</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Bend */}
      <section className="container-app py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Why Bend?
            </h2>
            <p className="text-gray-300 text-lg mb-4 leading-relaxed">
              Nestled in the high desert of Central Oregon, Bend offers an unparalleled combination of outdoor recreation,
              natural beauty, and vibrant culture. With Mt. Bachelor just 22 miles away and the Deschutes River running
              through downtown, adventure is always within reach.
            </p>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Whether you're here to ski, bike, paddle, or simply enjoy the craft beer scene, Bend welcomes you with
              300+ days of sunshine and endless opportunities for exploration.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/category/outdoor?filter=skiing"
                className="px-4 py-2 bg-pine-700/30 text-pine-400 border border-pine-700/50 rounded-full text-sm font-medium hover:bg-pine-700/50 hover:text-pine-300 transition-colors"
              >
                Skiing & Snowboarding
              </Link>
              <Link
                to="/category/outdoor?filter=biking"
                className="px-4 py-2 bg-pine-700/30 text-pine-400 border border-pine-700/50 rounded-full text-sm font-medium hover:bg-pine-700/50 hover:text-pine-300 transition-colors"
              >
                Mountain Biking
              </Link>
              <Link
                to="/category/food"
                className="px-4 py-2 bg-sunset-500/20 text-sunset-400 border border-sunset-500/30 rounded-full text-sm font-medium hover:bg-sunset-500/30 hover:text-sunset-300 transition-colors"
              >
                Craft Beer
              </Link>
              <Link
                to="/category/outdoor?filter=hiking"
                className="px-4 py-2 bg-pine-700/30 text-pine-400 border border-pine-700/50 rounded-full text-sm font-medium hover:bg-pine-700/50 hover:text-pine-300 transition-colors"
              >
                Hiking
              </Link>
              <Link
                to="/category/outdoor?filter=climbing"
                className="px-4 py-2 bg-pine-700/30 text-pine-400 border border-pine-700/50 rounded-full text-sm font-medium hover:bg-pine-700/50 hover:text-pine-300 transition-colors"
              >
                Rock Climbing
              </Link>
            </div>
          </div>
          <div className="card p-8 lg:p-12" style={{ boxShadow: '0 0 40px rgba(249, 115, 22, 0.1)' }}>
            <div className="text-center">
              {/* Map Pin Icon */}
              <div className="w-24 h-24 bg-sunset-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-sunset-400" />
              </div>

              {/* Coordinates */}
              <p className="text-2xl font-bold gradient-text mb-2">
                44.0582° N, 121.3153° W
              </p>

              <div className="space-y-2 text-gray-400">
                <p>Elevation: <span className="text-white font-medium">3,623 ft</span></p>
                <p>Population: <span className="text-white font-medium">~100,000</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Banner (hidden when no ads) */}
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
        <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No events this week</p>
        <Link to="/events" className="text-sm text-sunset-400 hover:underline">
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
          className="block p-3 bg-navy-700/50 hover:bg-navy-700 rounded-xl transition-colors group"
        >
          <p className="font-medium text-white text-sm group-hover:text-sunset-400 transition-colors truncate">
            {event.title}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            <span>
              {event.date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className="text-gray-600">•</span>
            <span className="truncate">{event.location}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
