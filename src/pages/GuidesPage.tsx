import SequenceCard from '../components/guides/SequenceCard';
import SceneHeader from '../components/ui/SceneHeader';
import { guides } from '../data/guides';

export default function GuidesPage() {
  const totalStops = guides.reduce((acc, g) => acc + g.stops.length, 0);

  return (
    <div>
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="container-app pb-10 pt-16 md:pt-20">
        <SceneHeader
          as="h1"
          kicker="Sequences"
          title={
            <>
              Your Perfect Day.
              <br />
              Shot Lists Included.
            </>
          }
          meta={`${guides.length} sequences · ${totalStops} stops`}
        >
          <p className="max-w-md leading-relaxed text-mist md:ml-auto">
            Skip the research and get straight to the adventure. Each sequence is
            crafted by locals who've spent years exploring Central Oregon — sunrise
            to sunset, best stops, optimal timing, insider tips.
          </p>
        </SceneHeader>
      </div>

      {/* ── Sequences ────────────────────────────────────────────── */}
      <div className="border-t border-hair bg-black">
        {guides.map((guide, i) => (
          <SequenceCard
            key={guide.id}
            guide={guide}
            index={i + 1}
            leak={i % 2 === 1}
            priority={i === 0}
          />
        ))}
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <div className="container-app border-t border-hair py-14 text-center">
        <p className="small-caps text-whisper">
          Have a favorite local itinerary? We'd love to feature it.
        </p>
        <button className="btn-secondary mt-5">Submit a Guide</button>
      </div>
    </div>
  );
}
