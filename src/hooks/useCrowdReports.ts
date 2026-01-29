import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CrowdReport, CrowdLevel } from '../types';

const COLLECTION_NAME = 'crowdReports';
const REPORT_DURATION_HOURS = 4;
const RATE_LIMIT_KEY = 'bendy_crowd_report_limits';

export const popularSpots = [
  { id: 'elk-lake', name: 'Elk Lake' },
  { id: 'sparks-lake', name: 'Sparks Lake' },
  { id: 'tumalo-falls', name: 'Tumalo Falls' },
  { id: 'phils-trail', name: "Phil's Trail" },
  { id: 'downtown-bend', name: 'Downtown Bend' },
  { id: 'deschutes-river-trail', name: 'Deschutes River Trail' },
  { id: 'smith-rock', name: 'Smith Rock' },
  { id: 'mt-bachelor', name: 'Mt. Bachelor' },
  { id: 'todd-lake', name: 'Todd Lake' },
  { id: 'lava-river-cave', name: 'Lava River Cave' },
];

interface RateLimitRecord {
  [locationId: string]: number; // timestamp of last report
}

function getRateLimits(): RateLimitRecord {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function setRateLimit(locationId: string): void {
  const limits = getRateLimits();
  limits[locationId] = Date.now();
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(limits));
}

function canSubmitReport(locationId: string): boolean {
  const limits = getRateLimits();
  const lastReport = limits[locationId];
  if (!lastReport) return true;

  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  return lastReport < oneHourAgo;
}

function getTimeUntilCanReport(locationId: string): number {
  const limits = getRateLimits();
  const lastReport = limits[locationId];
  if (!lastReport) return 0;

  const nextAllowed = lastReport + 60 * 60 * 1000;
  return Math.max(0, nextAllowed - Date.now());
}

export function useCrowdReports() {
  const [reports, setReports] = useState<CrowdReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('expiresAt', '>', Timestamp.fromDate(new Date())),
      orderBy('expiresAt', 'desc'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newReports: CrowdReport[] = snapshot.docs.map((doc) => {
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
        setReports(newReports);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching crowd reports:', err);
        setError('Failed to load crowd reports');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const submitReport = useCallback(
    async (
      locationId: string,
      locationName: string,
      crowdLevel: CrowdLevel,
      comment?: string
    ): Promise<{ success: boolean; message: string }> => {
      if (!canSubmitReport(locationId)) {
        const waitTime = getTimeUntilCanReport(locationId);
        const minutes = Math.ceil(waitTime / 60000);
        return {
          success: false,
          message: `Please wait ${minutes} minute${minutes !== 1 ? 's' : ''} before reporting on this location again.`,
        };
      }

      try {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + REPORT_DURATION_HOURS * 60 * 60 * 1000);

        await addDoc(collection(db, COLLECTION_NAME), {
          locationId,
          locationName,
          crowdLevel,
          comment: comment?.trim() || null,
          timestamp: serverTimestamp(),
          expiresAt: Timestamp.fromDate(expiresAt),
        });

        setRateLimit(locationId);

        return {
          success: true,
          message: 'Thanks! Your report helps locals and visitors.',
        };
      } catch (err) {
        console.error('Error submitting crowd report:', err);
        return {
          success: false,
          message: 'Failed to submit report. Please try again.',
        };
      }
    },
    []
  );

  const getReportsForLocation = useCallback(
    (locationId: string): CrowdReport[] => {
      return reports.filter((r) => r.locationId === locationId);
    },
    [reports]
  );

  const getLatestReportForLocation = useCallback(
    (locationId: string): CrowdReport | null => {
      const locationReports = getReportsForLocation(locationId);
      return locationReports[0] || null;
    },
    [getReportsForLocation]
  );

  return {
    reports,
    loading,
    error,
    submitReport,
    getReportsForLocation,
    getLatestReportForLocation,
    canSubmitReport,
    getTimeUntilCanReport,
  };
}

export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  const days = Math.floor(seconds / 86400);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

export const crowdLevelConfig: Record<
  CrowdLevel,
  { label: string; emoji: string; color: string; bgColor: string }
> = {
  empty: {
    label: 'Empty',
    emoji: '🟢',
    color: '#22c55e',
    bgColor: 'bg-green-100',
  },
  moderate: {
    label: 'Moderate',
    emoji: '🟡',
    color: '#eab308',
    bgColor: 'bg-yellow-100',
  },
  busy: {
    label: 'Busy',
    emoji: '🟠',
    color: '#f97316',
    bgColor: 'bg-orange-100',
  },
  packed: {
    label: 'Packed',
    emoji: '🔴',
    color: '#ef4444',
    bgColor: 'bg-red-100',
  },
};
