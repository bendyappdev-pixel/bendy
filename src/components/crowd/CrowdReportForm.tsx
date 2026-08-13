import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CrowdLevel } from '../../types';
import { useCrowdReports, popularSpots } from '../../hooks/useCrowdReports';
import { crowdMeta } from '../ui/CrowdBadge';
import { cn } from '../../lib/utils';

interface CrowdReportFormProps {
  onSuccess?: () => void;
  preselectedLocation?: string;
}

const fieldClass =
  'w-full border border-hair bg-transparent px-4 py-3 font-mono text-[13px] text-film-white placeholder:text-whisper focus:border-ember focus:outline-none transition-colors';

export default function CrowdReportForm({
  onSuccess,
  preselectedLocation,
}: CrowdReportFormProps) {
  const { submitReport, canSubmitReport } = useCrowdReports();

  const [locationId, setLocationId] = useState(preselectedLocation || '');
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const selectedSpot = popularSpots.find((s) => s.id === locationId);
  const canSubmit = locationId && canSubmitReport(locationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationId || !crowdLevel || !selectedSpot) return;

    setSubmitting(true);
    setResult(null);

    try {
      const response = await submitReport(
        locationId,
        selectedSpot.name,
        crowdLevel,
        comment
      );

      setResult(response);

      if (response.success) {
        setCrowdLevel(null);
        setComment('');
        setLocationId('');
        setTimeout(() => onSuccess?.(), 1500);
      }
    } catch {
      setResult({ success: false, message: 'Failed to submit report. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const crowdLevels: CrowdLevel[] = ['empty', 'moderate', 'busy', 'packed'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Location Select */}
      <div>
        <label htmlFor="location" className="small-caps mb-2 block text-whisper">
          Location
        </label>
        <select
          id="location"
          value={locationId}
          onChange={(e) => {
            setLocationId(e.target.value);
            setResult(null);
          }}
          className={fieldClass}
        >
          <option value="">Select a location...</option>
          {popularSpots.map((spot) => (
            <option key={spot.id} value={spot.id}>
              {spot.name}
            </option>
          ))}
        </select>
      </div>

      {/* Crowd Level Buttons */}
      <div>
        <label className="small-caps mb-2 block text-whisper">How crowded is it?</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {crowdLevels.map((level) => {
            const meta = crowdMeta(level);
            const isSelected = crowdLevel === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setCrowdLevel(level)}
                aria-pressed={isSelected}
                className={cn(
                  'flex items-center justify-center gap-2 border px-3 py-3 font-mono text-[11px] uppercase tracking-wide transition-colors',
                  isSelected
                    ? 'text-film-white'
                    : 'border-hair text-whisper hover:border-white/30 hover:text-film-white'
                )}
                style={
                  isSelected
                    ? { borderColor: meta.color, backgroundColor: `${meta.color}1f` }
                    : undefined
                }
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-2 w-2 shrink-0 rounded-full"
                  style={{
                    background: meta.color,
                    boxShadow: isSelected ? `0 0 8px ${meta.color}` : undefined,
                  }}
                />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Comment */}
      <div>
        <label htmlFor="comment" className="small-caps mb-2 block text-whisper">
          Add a note (optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 150))}
          placeholder="e.g., Parking lot half full, trails are muddy..."
          rows={2}
          className={cn(fieldClass, 'resize-none')}
        />
        <p className="mt-1 text-right font-mono text-[10px] text-whisper">
          {comment.length}/150
        </p>
      </div>

      {/* Result Message */}
      {result && (
        <div
          className={cn(
            'flex items-center gap-3 border px-4 py-3 font-mono text-[12px] text-mist',
            result.success ? 'border-hair' : 'border-[var(--ember-50)]'
          )}
        >
          {result.success ? (
            <CheckCircle className="h-4 w-4 shrink-0 text-pine" aria-hidden="true" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-ember" aria-hidden="true" />
          )}
          <p>{result.message}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!locationId || !crowdLevel || submitting || !canSubmit}
        className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Submit Report
          </>
        )}
      </button>

      {locationId && !canSubmit && (
        <p className="text-center font-mono text-[11px] text-whisper">
          You recently reported on this location. Please wait before reporting again.
        </p>
      )}
    </form>
  );
}
