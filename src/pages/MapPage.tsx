import { useState } from 'react';
import { Users, X, History } from 'lucide-react';
import InteractiveMap from '../components/map/InteractiveMap';
import SceneHeader from '../components/ui/SceneHeader';
import { CrowdLegend } from '../components/ui/CrowdBadge';
import { ContextualBanner } from '../components/ads';
import { CrowdReportForm, CrowdReportsList, CrowdReportHistory } from '../components/crowd';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../components/ui/dialog';
import { useCrowdReports, formatTimeAgo } from '../hooks/useCrowdReports';
import { cn } from '../lib/utils';

type CrowdTab = 'current' | 'history';

export default function MapPage() {
  const [showReportModal, setShowReportModal] = useState(false);
  const [crowdTab, setCrowdTab] = useState<CrowdTab>('current');
  const { reports } = useCrowdReports();
  const latest = reports[0];

  return (
    <div className="container-app py-8 md:py-12">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-10 border-b border-hair pb-8">
        <SceneHeader
          as="h1"
          kicker="Live from the Field"
          title="Every Pin On The Map."
          meta={
            <>
              Bend & Central Oregon
              <br />
              Parks · trails · breweries · family fun
            </>
          }
        >
          <p className="max-w-md leading-relaxed text-mist md:ml-auto">
            Real-time crowd, weather and trail conditions, layered onto the geography
            that shapes Bend. Click a peak. Drop a pin. File a report.
          </p>
          <button onClick={() => setShowReportModal(true)} className="btn-primary mt-5">
            <Users className="h-4 w-4" aria-hidden="true" />
            Report conditions
          </button>
        </SceneHeader>
      </div>

      {/* ── Plain-language crowd readout ─────────────────────────── */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="film-display-thin text-[clamp(24px,3vw,30px)] text-film-white">
            How busy is it right now?
          </div>
          <div className="mt-1 font-mono text-[11px] text-whisper">
            {latest
              ? `Reported by locals · latest ${formatTimeAgo(latest.timestamp)}`
              : 'Reported by locals · Bend & Central Oregon'}
          </div>
        </div>
        <CrowdLegend />
      </div>

      {/* ── Map ──────────────────────────────────────────────────── */}
      <div className="border border-hair">
        <InteractiveMap height="h-[420px] md:h-[560px]" showCrowdPins />
      </div>

      {/* ── Crowd reports ────────────────────────────────────────── */}
      <div className="mt-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCrowdTab('current')}
            aria-pressed={crowdTab === 'current'}
            className={cn(
              'small-caps flex items-center gap-2 border px-4 py-2.5 transition-colors',
              crowdTab === 'current'
                ? 'border-ember text-ember'
                : 'border-hair text-whisper hover:text-film-white'
            )}
          >
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            Current
          </button>
          <button
            onClick={() => setCrowdTab('history')}
            aria-pressed={crowdTab === 'history'}
            className={cn(
              'small-caps flex items-center gap-2 border px-4 py-2.5 transition-colors',
              crowdTab === 'history'
                ? 'border-ember text-ember'
                : 'border-hair text-whisper hover:text-film-white'
            )}
          >
            <History className="h-3.5 w-3.5" aria-hidden="true" />
            History
          </button>
        </div>

        <div className="mt-6">
          {crowdTab === 'current' ? (
            <CrowdReportsList limit={5} compact showTitle={false} />
          ) : (
            <CrowdReportHistory />
          )}
        </div>
      </div>

      {/* Contextual Banner Ad (hidden when no ads) */}
      <div className="mt-10">
        <ContextualBanner />
      </div>

      {/* ── BPRD attribution ─────────────────────────────────────── */}
      <div className="mt-10 border-t border-hair pt-6 text-center font-mono text-[11px] text-whisper">
        Park and recreation data from{' '}
        <a
          href="https://www.bendparksandrec.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ember"
        >
          Bend Park and Recreation District
        </a>{' '}
        — 84 parks, 80+ miles of trails
      </div>

      {/* ── Map tips ─────────────────────────────────────────────── */}
      <div className="mt-8 border border-hair p-6 md:p-8">
        <h3 className="small-caps text-whisper">Map tips</h3>
        <ul className="mt-4 space-y-2.5 font-mono text-[11px] leading-relaxed text-mist">
          <li>— Click the filter chips above the map to show or hide location types</li>
          <li>— Click any marker to see details about that location</li>
          <li>— Use the navigation controls or pinch-to-zoom on mobile</li>
          <li>— Click the location button to centre the map on your position</li>
        </ul>
      </div>

      {/* ── Report Conditions Modal ──────────────────────────────── */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Conditions</DialogTitle>
            <DialogClose className="p-2 transition-colors hover:bg-white/10">
              <X className="h-5 w-5 text-mist" />
            </DialogClose>
          </DialogHeader>
          <div className="p-6">
            <DialogDescription className="mb-6">
              Help others plan their visit by sharing current crowd conditions at popular spots.
            </DialogDescription>
            <CrowdReportForm onSuccess={() => setShowReportModal(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
