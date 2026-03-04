import { useState } from 'react';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function FirestoreTestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleTestWrite = async () => {
    setLoading(true);
    setResult('Writing to Firestore...');

    const testData = {
      locationId: 'elk-lake',
      locationName: 'Elk Lake',
      crowdLevel: 'moderate',
      timestamp: serverTimestamp(),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 4 * 60 * 60 * 1000)),
    };

    try {
      const docRef = await addDoc(collection(db, 'crowdReports'), testData);
      const msg = `SUCCESS! Document written with ID: ${docRef.id}`;
      console.log(msg);
      setResult(msg);
    } catch (error: unknown) {
      console.error('Full error object:', error);
      if (error instanceof Error) {
        const firebaseError = error as Error & { code?: string };
        console.error('Error code:', firebaseError.code);
        console.error('Error message:', firebaseError.message);
        setResult(
          `FAILED!\n\nCode: ${firebaseError.code ?? 'N/A'}\nMessage: ${firebaseError.message}\n\nFull error:\n${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`
        );
      } else {
        setResult(`FAILED with non-Error: ${String(error)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Firestore Debug Test</h1>
      <p className="text-gray-600 mb-6">
        Writes a hardcoded valid doc to <code>crowdReports</code> using location{' '}
        <code>elk-lake</code>. Check the on-screen result and browser console.
      </p>
      <button
        onClick={handleTestWrite}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Writing...' : 'Test Firestore Write'}
      </button>
      {result && (
        <pre className="mt-6 p-4 bg-gray-100 rounded-lg text-sm whitespace-pre-wrap break-words">
          {result}
        </pre>
      )}
    </div>
  );
}
