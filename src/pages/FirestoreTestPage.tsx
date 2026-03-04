import { useState } from 'react';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function FirestoreTestPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const runTest = async (label: string, data: Record<string, unknown>) => {
    setLoading(true);
    setResults((prev) => [...prev, `\n--- ${label} ---\nPayload: ${JSON.stringify(data, null, 2)}\nWriting...`]);

    try {
      const docRef = await addDoc(collection(db, 'crowdReports'), data);
      setResults((prev) => [...prev, `SUCCESS! ID: ${docRef.id}`]);
    } catch (error: unknown) {
      console.error(`[${label}] Full error:`, error);
      if (error instanceof Error) {
        const fe = error as Error & { code?: string };
        setResults((prev) => [...prev, `FAILED! Code: ${fe.code ?? 'N/A'}\nMessage: ${fe.message}`]);
      } else {
        setResults((prev) => [...prev, `FAILED: ${String(error)}`]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRunAll = async () => {
    setResults([]);
    const base = {
      locationId: 'elk-lake',
      locationName: 'Elk Lake',
      crowdLevel: 'moderate',
      timestamp: serverTimestamp(),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 4 * 60 * 60 * 1000)),
    };

    // Test 1: No comment (matches original test page)
    await runTest('Test 1: No comment field', { ...base });

    // Test 2: comment: null (matches what the form sends for empty comment)
    await runTest('Test 2: comment: null', { ...base, timestamp: serverTimestamp(), comment: null });

    // Test 3: comment with a string (matches form with user text)
    await runTest('Test 3: comment: "Test"', { ...base, timestamp: serverTimestamp(), comment: 'Test' });

    // Test 4: Non-whitelisted location (e.g. south-sister)
    await runTest('Test 4: non-whitelisted location', {
      ...base,
      timestamp: serverTimestamp(),
      locationId: 'south-sister',
      locationName: 'South Sister',
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Firestore Debug Test</h1>
      <p className="text-gray-600 mb-6">
        Runs 4 tests to isolate which field breaks Firestore rules.
      </p>
      <button
        onClick={handleRunAll}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Running...' : 'Run All Tests'}
      </button>
      {results.length > 0 && (
        <pre className="mt-6 p-4 bg-gray-100 rounded-lg text-sm whitespace-pre-wrap break-words">
          {results.join('\n')}
        </pre>
      )}
    </div>
  );
}
