import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import CategoryCard from '../components/home/CategoryCard';
import { categories } from '../data/categories';
import { MapPin, Compass, Sun, Users } from 'lucide-react';
import { PartnerBanner, WeekendPick } from '../components/ads';
import { CrowdReportsList } from '../components/crowd';
import { WeatherWidget } from '../components/weather';

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

      {/* Weekend Pick Ad */}
      <section className="container-app pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">This Weekend</h2>
        <WeekendPick />
      </section>

      {/* Weather & Current Conditions */}
      <section className="container-app pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weather */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bend Weather</h2>
            <WeatherWidget />
          </div>

          {/* Crowd Conditions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-forest" />
                <h2 className="text-2xl font-bold text-gray-900">Crowd Reports</h2>
              </div>
              <Link
                to="/map"
                className="text-forest hover:underline font-medium text-sm"
              >
                Report conditions →
              </Link>
            </div>
            <CrowdReportsList limit={3} showTitle={false} />
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
