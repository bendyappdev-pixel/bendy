import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  limit as firestoreLimit,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CrowdReport, CrowdLevel } from '../types';

const COLLECTION_NAME = 'crowdReports';

export interface DailyReportSummary {
  date: Date;
  reports: CrowdReport[];
  averageLevel: CrowdLevel;
  peakLevel: CrowdLevel;
  peakTime: Date;
  reportCount: number;
}

const crowdLevelValues: Record<CrowdLevel, number> = {
  empty: 1,
  moderate: 2,
  busy: 3,
  packed: 4,
};

const valueToCrowdLevel = (value: number): CrowdLevel => {
  if (value <= 1.5) return 'empty';
  if (value <= 2.5) return 'moderate';
  if (value <= 3.5) return 'busy';
  return 'packed';
};

export function useLocationHistory(locationId: string | null, daysBack: number = 7) {
  const [reports, setReports] = useState<CrowdReport[]>([]);
  const [dailySummaries, setDailySummaries] = useState<DailyReportSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!locationId) {
      setReports([]);
      setDailySummaries([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);
      startDate.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, COLLECTION_NAME),
        where('locationId', '==', locationId),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        orderBy('timestamp', 'desc'),
        firestoreLimit(100)
      );

      const snapshot = await getDocs(q);
      const fetchedReports: CrowdReport[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          locationId: data.locationId,
          locationName: data.locationName,
          crowdLevel: data.crowdLevel as CrowdLevel,
          comment: data.comment,
          timestamp: data.timestamp?.toDate() || new Date(),
          expiresAt: data.expiresAt?.toDate() || new Date(),
        };
      });

      setReports(fetchedReports);

      // Group reports by day and create summaries
      const reportsByDay = new Map<string, CrowdReport[]>();

      fetchedReports.forEach((report) => {
        const dateKey = report.timestamp.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        if (!reportsByDay.has(dateKey)) {
          reportsByDay.set(dateKey, []);
        }
        reportsByDay.get(dateKey)!.push(report);
      });

      const summaries: DailyReportSummary[] = [];

      reportsByDay.forEach((dayReports) => {
        // Sort by timestamp (newest first already, but ensure)
        dayReports.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        // Calculate average level
        const totalValue = dayReports.reduce(
          (sum, r) => sum + crowdLevelValues[r.crowdLevel],
          0
        );
        const avgValue = totalValue / dayReports.length;

        // Find peak level and time
        let peakReport = dayReports[0];
        dayReports.forEach((r) => {
          if (crowdLevelValues[r.crowdLevel] > crowdLevelValues[peakReport.crowdLevel]) {
            peakReport = r;
          }
        });

        summaries.push({
          date: dayReports[0].timestamp,
          reports: dayReports,
          averageLevel: valueToCrowdLevel(avgValue),
          peakLevel: peakReport.crowdLevel,
          peakTime: peakReport.timestamp,
          reportCount: dayReports.length,
        });
      });

      // Sort summaries by date (newest first)
      summaries.sort((a, b) => b.date.getTime() - a.date.getTime());
      setDailySummaries(summaries);
    } catch (err) {
      console.error('Error fetching location history:', err);
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [locationId, daysBack]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    reports,
    dailySummaries,
    loading,
    error,
    refetch: fetchHistory,
  };
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
