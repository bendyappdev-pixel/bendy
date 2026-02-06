import { useState } from 'react';
import { History, ChevronDown, ChevronUp, Clock, TrendingUp } from 'lucide-react';
import { CrowdReport } from '../../types';
import {
  useLocationHistory,
  DailyReportSummary,
  formatTime,
  formatDate,
} from '../../hooks/useLocationHistory';
import { crowdLevelConfig, popularSpots } from '../../hooks/useCrowdReports';

interface CrowdReportHistoryProps {
  locationId?: string;
  showLocationPicker?: boolean;
}

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
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-forest" />
        <h3 className="text-lg font-semibold text-gray-900">Crowd History</h3>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {showLocationPicker && (
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="flex-1 px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest focus:border-forest transition-colors"
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
          className="px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest focus:border-forest transition-colors"
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
        <div className="text-center py-8 bg-sand rounded-xl">
          <History className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Select a location to view crowd history</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : dailySummaries.length === 0 ? (
        <div className="text-center py-8 bg-sand rounded-xl">
          <History className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No reports for {selectedSpot?.name}</p>
          <p className="text-sm text-gray-400 mt-1">
            in the last {daysBack} day{daysBack !== 1 ? 's' : ''}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
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
  const avgConfig = crowdLevelConfig[summary.averageLevel];
  const peakConfig = crowdLevelConfig[summary.peakLevel];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Summary Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            style={{ backgroundColor: `${avgConfig.color}20` }}
          >
            {avgConfig.emoji}
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">{formatDate(summary.date)}</p>
            <p className="text-sm text-gray-500">
              {summary.reportCount} report{summary.reportCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500">Peak:</span>
              <span style={{ color: peakConfig.color }} className="font-medium">
                {peakConfig.label}
              </span>
              <span className="text-gray-400">at {formatTime(summary.peakTime)}</span>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Timeline */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="sm:hidden mb-3 text-sm">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500">Peak:</span>
              <span style={{ color: peakConfig.color }} className="font-medium">
                {peakConfig.label}
              </span>
              <span className="text-gray-400">at {formatTime(summary.peakTime)}</span>
            </div>
          </div>

          <div className="space-y-2">
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
  const config = crowdLevelConfig[report.crowdLevel];

  return (
    <div className="flex items-start gap-3 p-2 bg-white rounded-lg">
      <div className="flex items-center gap-2 min-w-[80px] text-sm text-gray-500">
        <Clock className="w-3.5 h-3.5" />
        <span>{formatTime(report.timestamp)}</span>
      </div>
      <div
        className="px-2 py-0.5 rounded-full text-xs font-medium"
        style={{
          backgroundColor: `${config.color}20`,
          color: config.color,
        }}
      >
        {config.emoji} {config.label}
      </div>
      {report.comment && (
        <p className="text-sm text-gray-600 flex-1 truncate">"{report.comment}"</p>
      )}
    </div>
  );
}
