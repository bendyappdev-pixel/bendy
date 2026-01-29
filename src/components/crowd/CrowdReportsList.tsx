import { useEffect, useState } from 'react';
import { Clock, MapPin, Users } from 'lucide-react';
import { CrowdReport } from '../../types';
import {
  useCrowdReports,
  formatTimeAgo,
  crowdLevelConfig,
} from '../../hooks/useCrowdReports';

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
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{error}</p>
      </div>
    );
  }

  if (displayReports.length === 0) {
    return (
      <div className="text-center py-8 bg-sand rounded-xl">
        <Users className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No recent crowd reports</p>
        <p className="text-sm text-gray-400 mt-1">
          Be the first to share conditions!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-forest" />
          Current Conditions
        </h3>
      )}

      <div className={compact ? 'space-y-2' : 'space-y-3'}>
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
  const config = crowdLevelConfig[report.crowdLevel];

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: `${config.color}20` }}
        >
          {config.emoji}
        </div>
        <div className="flex-1 min-w-0">
          {showLocation && (
            <p className="font-medium text-gray-900 truncate">
              {report.locationName}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span style={{ color: config.color }} className="font-medium">
              {config.label}
            </span>
            <span>·</span>
            <span>{formatTimeAgo(report.timestamp)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: `${config.color}20` }}
        >
          {config.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            {showLocation && (
              <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                <MapPin className="w-4 h-4 text-forest" />
                <span className="truncate">{report.locationName}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimeAgo(report.timestamp)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${config.color}20`,
                color: config.color,
              }}
            >
              {config.emoji} {config.label}
            </span>
          </div>

          {report.comment && (
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
              "{report.comment}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { CrowdReportCard };
