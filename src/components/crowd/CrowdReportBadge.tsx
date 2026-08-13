import { CrowdReport } from '../../types';
import { formatTimeAgo } from '../../hooks/useCrowdReports';
import CrowdBadge, { crowdMeta } from '../ui/CrowdBadge';

interface CrowdReportBadgeProps {
  report: CrowdReport;
  size?: 'sm' | 'md';
}

export default function CrowdReportBadge({
  report,
  size = 'md',
}: CrowdReportBadgeProps) {
  const timeAgo = formatTimeAgo(report.timestamp);

  if (size === 'sm') {
    const meta = crowdMeta(report.crowdLevel);
    return (
      <span title={`${meta.label} · ${timeAgo}`}>
        <CrowdBadge level={report.crowdLevel} className="text-[10px]" />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <CrowdBadge level={report.crowdLevel} verbose />
      <span className="text-whisper">·</span>
      <span className="font-mono text-[11px] text-whisper">{timeAgo}</span>
    </span>
  );
}
