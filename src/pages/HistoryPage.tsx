import { ExternalLink } from 'lucide-react';
import { historyEras, historySources, HistoryEra } from '../data/history';
import SceneHeader from '../components/ui/SceneHeader';

/**
 * A short serif-italic pull quote per turning-point era, pulled verbatim from
 * that era's own description/highlights — the editorial flourish the brief
 * asks for, without inventing any fact not already in data/history.ts.
 */
const pullQuotes: Record<string, string> = {
  founding: 'Bend officially incorporates with approximately 500 residents.',
  lumber: 'At their peak, these were among the largest pine sawmills in the world.',
  modern: 'Population grows from 20,000 in 1990 to over 100,000 today.',
};

/** First 4-digit year mentioned in the era's date fields — the numeral this
    page leads each row with. The full range still prints beside it in mono,
    so nothing the numeral simplifies away is actually lost.

    Open-ended early eras are the exception: the first era's period is
    "Pre-1855", and pulling the first four digits out of that rendered a giant
    "1855" above an era that explicitly predates it — reading as the year
    itself, and putting the column out of chronological order against the
    "1820" below it. Those lead with "PRE" instead. */
function leadYear(era: HistoryEra): string {
  if (/^pre[\s-]/i.test(era.period)) return 'PRE';
  const match = era.years.match(/\d{4}/) ?? era.period.match(/\d{4}/);
  return match ? match[0] : '—';
}

const landmarks: { name: string; year: string; description: string }[] = [
  {
    name: 'Tower Theatre',
    year: '1940',
    description:
      'Art Deco movie palace restored in 1997-2004, now hosting films, concerts, and events.',
  },
  {
    name: 'Pine Tavern',
    year: '1936',
    description:
      'Historic restaurant built around a 250-year-old ponderosa pine growing through the floor.',
  },
  {
    name: 'Old Mill District',
    year: '1916 / 2000s',
    description:
      "Former Brooks-Scanlon lumber mill transformed into Bend's premier shopping and dining destination.",
  },
];

const quickFacts: { value: string; label: string }[] = [
  { value: '1905', label: 'Year incorporated' },
  { value: '500', label: 'Original population' },
  { value: '100K+', label: 'Population today' },
  { value: '3,623', label: 'Elevation (ft)' },
];

export default function HistoryPage() {
  return (
    <div className="container-app py-8 md:py-12">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-12 border-b border-hair pb-10">
        <SceneHeader
          as="h1"
          kicker="Archive"
          title="Bend, By The Decade."
          meta={
            <>
              1855 — Today
              <br />
              {historyEras.length} eras on record
            </>
          }
        >
          <p className="max-w-md leading-relaxed text-mist md:ml-auto">
            From Indigenous lands to outdoor paradise — a small "Farewell Bend" ranch
            became one of America's most beloved mountain towns.
          </p>
        </SceneHeader>
        <p className="mt-8 max-w-3xl leading-relaxed text-mist">
          Bend's story spans thousands of years — from the Indigenous peoples who first
          called this land home, through the lumber boom that built the city, to today's
          thriving outdoor recreation community.
        </p>
      </div>

      {/* ── Timeline ─────────────────────────────────────────────── */}
      <div className="border-t border-hair">
        {historyEras.map((era) => (
          <EraRow key={era.id} era={era} />
        ))}
      </div>

      {/* ── Historic Landmarks ───────────────────────────────────── */}
      <section className="mt-16">
        <h2 className="small-caps text-whisper">Historic landmarks</h2>
        <div className="mt-4 grid grid-cols-1 divide-y divide-hair border border-hair md:grid-cols-3 md:divide-x md:divide-y-0">
          {landmarks.map((landmark) => (
            <div key={landmark.name} className="p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="film-display-thin text-[18px] text-film-white">
                  {landmark.name}
                </h3>
                <span className="font-mono text-[11px] text-ember">{landmark.year}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-mist">
                {landmark.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick Facts ──────────────────────────────────────────── */}
      <section className="mt-16">
        <h2 className="small-caps text-whisper">Bend by the numbers</h2>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-hair pt-10 md:grid-cols-4">
          {quickFacts.map((fact) => (
            <div key={fact.label} className="min-w-0">
              <dd className="film-display text-[clamp(36px,5vw,72px)] text-film-white">
                {fact.value}
              </dd>
              <dt className="small-caps mt-2 text-whisper">{fact.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Sources ──────────────────────────────────────────────── */}
      <section className="mt-16 border-t border-hair pt-10">
        <h2 className="small-caps text-whisper">Sources & further reading</h2>
        <div className="mt-4 border-t border-hair">
          {historySources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="row-hover flex items-center gap-3 border-b border-hair py-4 transition-colors"
            >
              <ExternalLink className="h-4 w-4 flex-shrink-0 text-ember" aria-hidden="true" />
              <span className="font-mono text-[12px] text-mist">{source.name}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function EraRow({ era }: { era: HistoryEra }) {
  const quote = pullQuotes[era.id];

  return (
    <div className="flex flex-col gap-5 border-b border-hair py-10 md:flex-row md:gap-10">
      {/* Fixed-width numeral column — a col-span-1/2 grid track runs
          12–36px on a 390px phone and clips a 4-digit display numeral, so
          this is flex with an explicit width instead (see FACELIFT_BRIEF.md). */}
      <div className="w-24 shrink-0 md:w-32">
        <div className="film-display text-[clamp(30px,5vw,52px)] text-film-white">
          {leadYear(era)}
        </div>
        <div className="small-caps mt-1.5 text-whisper">{era.period}</div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="small-caps text-ember">{era.years}</div>
        <h3 className="film-display-thin mt-1.5 text-[clamp(24px,3vw,32px)] text-film-white">
          {era.title}
        </h3>
        <p className="mt-3 max-w-2xl leading-relaxed text-mist">{era.description}</p>

        {quote && (
          <p className="serif-i mt-4 max-w-xl text-[20px] leading-snug text-film-white">
            &ldquo;{quote}&rdquo;
          </p>
        )}

        <ul className="mt-5 space-y-2">
          {era.highlights.map((highlight, i) => (
            <li
              key={i}
              className="flex items-start gap-2 font-mono text-[11px] leading-relaxed text-whisper"
            >
              <span className="text-ember">—</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
