import {
  BookOpen,
  Sunrise,
  Compass,
  Building,
  TreePine,
  Mountain,
  Sparkles,
  ExternalLink,
  LucideIcon,
} from 'lucide-react';
import { historyEras, historySources, HistoryEra } from '../data/history';

const iconMap: Record<string, LucideIcon> = {
  Sunrise,
  Compass,
  Building,
  TreePine,
  Mountain,
  Sparkles,
};

const eraColors: Record<string, { bg: string; border: string; text: string }> = {
  native: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  exploration: { bg: 'bg-earth/10', border: 'border-earth/30', text: 'text-earth' },
  founding: { bg: 'bg-sage/20', border: 'border-sage', text: 'text-forest' },
  lumber: { bg: 'bg-forest/10', border: 'border-forest/30', text: 'text-forest' },
  transition: { bg: 'bg-mountain/10', border: 'border-mountain/30', text: 'text-mountain' },
  modern: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
};

export default function HistoryPage() {
  return (
    <div className="container-app py-8 md:py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-earth rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">History of Bend</h1>
            <p className="text-gray-600">From Indigenous lands to outdoor paradise</p>
          </div>
        </div>
        <p className="text-gray-600 max-w-3xl mt-4">
          Bend's story spans thousands of years—from the Indigenous peoples who first called this
          land home, through the lumber boom that built the city, to today's thriving outdoor
          recreation community. Discover how a small "Farewell Bend" ranch became one of America's
          most beloved mountain towns.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-sage/40 -translate-x-1/2" />

        <div className="space-y-12">
          {historyEras.map((era, index) => (
            <EraCard key={era.id} era={era} index={index} />
          ))}
        </div>
      </div>

      {/* Notable Landmarks */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Historic Landmarks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LandmarkCard
            name="Tower Theatre"
            year="1940"
            description="Art Deco movie palace restored in 1997-2004, now hosting films, concerts, and events."
          />
          <LandmarkCard
            name="Pine Tavern"
            year="1936"
            description="Historic restaurant built around a 250-year-old ponderosa pine growing through the floor."
          />
          <LandmarkCard
            name="Old Mill District"
            year="1916 / 2000s"
            description="Former Brooks-Scanlon lumber mill transformed into Bend's premier shopping and dining destination."
          />
        </div>
      </section>

      {/* Quick Facts */}
      <section className="mt-16 bg-forest text-white rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Bend by the Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-sage">1905</div>
            <div className="text-sm text-sage/80 mt-1">Year Incorporated</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-sage">500</div>
            <div className="text-sm text-sage/80 mt-1">Original Population</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-sage">100K+</div>
            <div className="text-sm text-sage/80 mt-1">Population Today</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-sage">3,623</div>
            <div className="text-sm text-sage/80 mt-1">Elevation (ft)</div>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="mt-16 bg-sand rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sources & Further Reading</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {historySources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-mountain hover:underline text-sm"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              {source.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function EraCard({ era, index }: { era: HistoryEra; index: number }) {
  const Icon = iconMap[era.icon] || Mountain;
  const colors = eraColors[era.id] || eraColors.modern;
  const isEven = index % 2 === 0;

  return (
    <div
      className={`relative flex flex-col md:flex-row ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      } items-start gap-8`}
    >
      {/* Timeline dot */}
      <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-forest rounded-full -translate-x-1/2 border-4 border-sand z-10" />

      {/* Date badge - mobile */}
      <div className="md:hidden ml-12 mb-2">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
          {era.years}
        </span>
      </div>

      {/* Content */}
      <div
        className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
          isEven ? 'md:pr-8 md:text-right' : 'md:pl-8'
        }`}
      >
        {/* Date badge - desktop */}
        <div className={`hidden md:block mb-2 ${isEven ? 'text-right' : 'text-left'}`}>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
            {era.years}
          </span>
        </div>

        <div className={`card p-6 border-l-4 ${colors.border}`}>
          <div className={`flex items-center gap-3 mb-3 ${isEven ? 'md:flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${colors.text}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{era.title}</h3>
          </div>

          <p className={`text-gray-600 mb-4 ${isEven ? 'md:text-right' : ''}`}>
            {era.description}
          </p>

          <ul className={`space-y-2 ${isEven ? 'md:text-right' : ''}`}>
            {era.highlights.map((highlight, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className={`text-forest mt-1 ${isEven ? 'md:order-2' : ''}`}>•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Spacer for other side */}
      <div className="hidden md:block md:w-[calc(50%-2rem)]" />
    </div>
  );
}

function LandmarkCard({
  name,
  year,
  description,
}: {
  name: string;
  year: string;
  description: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <span className="text-sm text-earth font-medium">{year}</span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
