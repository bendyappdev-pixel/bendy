import { CrowdReport } from '../../types';
import { crowdLevelConfig, formatTimeAgo } from '../../hooks/useCrowdReports';

interface CrowdReportBadgeProps {
  report: CrowdReport;
  size?: 'sm' | 'md';
}

export default function CrowdReportBadge({
  report,
  size = 'md',
}: CrowdReportBadgeProps) {
  const config = crowdLevelConfig[report.crowdLevel];

  if (size === 'sm') {
    return (
      <div
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
        style={{
          backgroundColor: `${config.color}20`,
          color: config.color,
        }}
        title={`${config.label} - ${formatTimeAgo(report.timestamp)}`}
      >
        {config.emoji} {config.label}
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
      style={{
        backgroundColor: `${config.color}20`,
        color: config.color,
      }}
    >
      {config.emoji}
      <span>{config.label}</span>
      <span className="text-gray-400">·</span>
      <span className="text-gray-500 font-normal">
        {formatTimeAgo(report.timestamp)}
      </span>
    </div>
  );
}
