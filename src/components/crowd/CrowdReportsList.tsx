import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { CrowdReport } from '../../types';
import { useCrowdReports, formatTimeAgo } from '../../hooks/useCrowdReports';
import { crowdMeta } from '../ui/CrowdBadge';

interface CrowdReportsListProps {
  limit?: number;
  locationId?: string;
  showTitle?: boolean;
  compact?: boolean;
}

export default function CrowdReportsList({
  limit,
  locationId,
  showTitle = true,
  compact = false,
}: CrowdReportsListProps) {
  const { reports, loading, error, getReportsForLocation } = useCrowdReports();
  const [, setTick] = useState(0);

  // Force re-render every 2 minutes to update "time ago"
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  let displayReports: CrowdReport[] = locationId
    ? getReportsForLocation(locationId)
    : reports;

  if (limit) {
    displayReports = displayReports.slice(0, limit);
  }

  if (loading) {
    return (
      <div className="border border-hair py-8 text-center">
        <p className="font-mono text-[12px] text-whisper">Reading the reports…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-hair py-8 text-center">
        <p className="font-mono text-[12px] text-whisper">{error}</p>
      </div>
    );
  }

  if (displayReports.length === 0) {
    return (
      <div className="border border-hair py-8 text-center">
        <Users className="mx-auto mb-3 h-8 w-8 text-whisper" aria-hidden="true" />
        <p className="font-mono text-[12px] text-mist">No recent crowd reports</p>
        <p className="mt-1 font-mono text-[11px] text-whisper">
          Be the first to share conditions!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showTitle && (
        <h3 className="small-caps flex items-center gap-2 text-whisper">
          <Users className="h-3.5 w-3.5 text-ember" aria-hidden="true" />
          Current Conditions
        </h3>
      )}

      <div className="divide-y divide-white/10 border-t border-hair">
        {displayReports.map((report) => (
          <CrowdReportCard
            key={report.id}
            report={report}
            compact={compact}
            showLocation={!locationId}
          />
        ))}
      </div>
    </div>
  );
}

interface CrowdReportCardProps {
  report: CrowdReport;
  compact?: boolean;
  showLocation?: boolean;
}

function CrowdReportCard({
  report,
  compact = false,
  showLocation = true,
}: CrowdReportCardProps) {
  const meta = crowdMeta(report.crowdLevel);

  return (
    <div className={`flex items-center gap-3 ${compact ? 'py-3' : 'py-4'}`}>
      <span
        aria-hidden="true"
        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
      />
      <div className="min-w-0 flex-1">
        {showLocation && (
          <div
            className={`film-display-thin truncate text-film-white ${
              compact ? 'text-[16px]' : 'text-[20px]'
            }`}
          >
            {report.locationName}
          </div>
        )}
        {report.comment && (
          <div className="mt-0.5 truncate font-mono text-[11px] text-whisper">
            “{report.comment}”
          </div>
        )}
      </div>
      <div className="shrink-0 text-right font-mono text-[10px]">
        <div style={{ color: meta.color }}>{meta.label}</div>
        <div className="text-whisper">{formatTimeAgo(report.timestamp)}</div>
      </div>
    </div>
  );
}

export { CrowdReportCard };
