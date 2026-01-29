import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { CrowdLevel } from '../../types';
import {
  useCrowdReports,
  popularSpots,
  crowdLevelConfig,
} from '../../hooks/useCrowdReports';

interface CrowdReportFormProps {
  onSuccess?: () => void;
  preselectedLocation?: string;
}

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

    const response = await submitReport(
      locationId,
      selectedSpot.name,
      crowdLevel,
      comment
    );

    setResult(response);
    setSubmitting(false);

    if (response.success) {
      setCrowdLevel(null);
      setComment('');
      setLocationId('');
      onSuccess?.();
    }
  };

  const crowdLevels: CrowdLevel[] = ['empty', 'moderate', 'busy', 'packed'];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Location Select */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Location
        </label>
        <select
          id="location"
          value={locationId}
          onChange={(e) => {
            setLocationId(e.target.value);
            setResult(null);
          }}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest focus:border-forest transition-colors"
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How crowded is it?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {crowdLevels.map((level) => {
            const config = crowdLevelConfig[level];
            const isSelected = crowdLevel === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setCrowdLevel(level)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-forest'
                    : 'hover:bg-gray-50'
                } ${config.bgColor}`}
                style={{
                  backgroundColor: isSelected ? config.color : undefined,
                  color: isSelected ? 'white' : undefined,
                }}
              >
                <span>{config.emoji}</span>
                <span className="text-sm">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Comment */}
      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Add a note (optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 150))}
          placeholder="e.g., Parking lot half full, trails are muddy..."
          rows={2}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest focus:border-forest transition-colors resize-none"
        />
        <p className="text-xs text-gray-500 mt-1 text-right">
          {comment.length}/150
        </p>
      </div>

      {/* Result Message */}
      {result && (
        <div
          className={`flex items-center gap-2 p-4 rounded-xl ${
            result.success
              ? 'bg-green-50 text-green-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {result.success ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm">{result.message}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!locationId || !crowdLevel || submitting || !canSubmit}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Report
          </>
        )}
      </button>

      {locationId && !canSubmit && (
        <p className="text-xs text-center text-gray-500">
          You recently reported on this location. Please wait before reporting
          again.
        </p>
      )}
    </form>
  );
}
