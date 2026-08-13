import { useState } from 'react';
import { History, ChevronDown, ChevronUp, Clock, TrendingUp } from 'lucide-react';
import { CrowdReport } from '../../types';
import {
  useLocationHistory,
  DailyReportSummary,
  formatTime,
  formatDate,
} from '../../hooks/useLocationHistory';
import { popularSpots } from '../../hooks/useCrowdReports';
import { crowdMeta } from '../ui/CrowdBadge';

interface CrowdReportHistoryProps {
  locationId?: string;
  showLocationPicker?: boolean;
}

const selectClass =
  'border border-hair bg-transparent px-4 py-2.5 font-mono text-[12px] text-film-white focus:border-ember focus:outline-none transition-colors';

export default function CrowdReportHistory({
  locationId: initialLocationId,
  showLocationPicker = true,
}: CrowdReportHistoryProps) {
  const [selectedLocation, setSelectedLocation] = useState(initialLocationId || '');
  const [daysBack, setDaysBack] = useState(7);

  const { dailySummaries, loading, error } = useLocationHistory(
    selectedLocation || null,
    daysBack
  );

  const selectedSpot = popularSpots.find((s) => s.id === selectedLocation);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-ember" aria-hidden="true" />
        <h3 className="small-caps text-whisper">Crowd History</h3>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {showLocationPicker && (
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className={`flex-1 ${selectClass}`}
          >
            <option value="">Select a location...</option>
            {popularSpots.map((spot) => (
              <option key={spot.id} value={spot.id}>
                {spot.name}
              </option>
            ))}
          </select>
        )}

        <select
          value={daysBack}
          onChange={(e) => setDaysBack(Number(e.target.value))}
          className={selectClass}
        >
          <option value={1}>Today</option>
          <option value={3}>Last 3 days</option>
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      {/* Content */}
      {!selectedLocation ? (
        <div className="border border-hair py-8 text-center">
          <History className="mx-auto mb-3 h-8 w-8 text-whisper" aria-hidden="true" />
          <p className="font-mono text-[12px] text-mist">
            Select a location to view crowd history
          </p>
        </div>
      ) : loading ? (
        <div className="border border-hair py-8 text-center">
          <p className="font-mono text-[12px] text-whisper">Loading history…</p>
        </div>
      ) : error ? (
        <div className="border border-hair py-8 text-center">
          <p className="font-mono text-[12px] text-whisper">{error}</p>
        </div>
      ) : dailySummaries.length === 0 ? (
        <div className="border border-hair py-8 text-center">
          <History className="mx-auto mb-3 h-8 w-8 text-whisper" aria-hidden="true" />
          <p className="font-mono text-[12px] text-mist">No reports for {selectedSpot?.name}</p>
          <p className="mt-1 font-mono text-[11px] text-whisper">
            in the last {daysBack} day{daysBack !== 1 ? 's' : ''}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/10 border-y border-hair">
          {dailySummaries.map((summary) => (
            <DaySummaryCard key={summary.date.toISOString()} summary={summary} />
          ))}
        </div>
      )}
    </div>
  );
}

interface DaySummaryCardProps {
  summary: DailyReportSummary;
}

function DaySummaryCard({ summary }: DaySummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const avgMeta = crowdMeta(summary.averageLevel);
  const peakMeta = crowdMeta(summary.peakLevel);

  return (
    <div>
      {/* Summary Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="row-hover flex w-full items-center justify-between p-4 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: avgMeta.color, boxShadow: `0 0 8px ${avgMeta.color}` }}
          />
          <div className="text-left">
            <p className="film-display-thin text-[18px] text-film-white">
              {formatDate(summary.date)}
            </p>
            <p className="font-mono text-[11px] text-whisper">
              {summary.reportCount} report{summary.reportCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right font-mono text-[11px] text-whisper sm:block">
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              Peak <span style={{ color: peakMeta.color }}>{peakMeta.label}</span>
              <span>at {formatTime(summary.peakTime)}</span>
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-whisper" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4 text-whisper" aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Expanded Timeline */}
      {isExpanded && (
        <div className="border-t border-hair p-4">
          <div className="mb-3 font-mono text-[11px] text-whisper sm:hidden">
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              Peak <span style={{ color: peakMeta.color }}>{peakMeta.label}</span>
              <span>at {formatTime(summary.peakTime)}</span>
            </span>
          </div>

          <div className="divide-y divide-white/10">
            {summary.reports.map((report) => (
              <ReportTimelineItem key={report.id} report={report} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ReportTimelineItemProps {
  report: CrowdReport;
}

function ReportTimelineItem({ report }: ReportTimelineItemProps) {
  const meta = crowdMeta(report.crowdLevel);

  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="flex min-w-[76px] items-center gap-1.5 font-mono text-[11px] text-whisper">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{formatTime(report.timestamp)}</span>
      </div>
      <span className="shrink-0 font-mono text-[11px]" style={{ color: meta.color }}>
        {meta.label}
      </span>
      {report.comment && (
        <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-mist">
          "{report.comment}"
        </p>
      )}
    </div>
  );
}
