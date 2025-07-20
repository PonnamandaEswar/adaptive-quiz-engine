// src/app/student/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';

interface Result {
  id: string;
  score: number;
  timestamp: Timestamp;
}

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [loading, user, router]);

  // Listen to student's quiz results
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'results'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setResults(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Result, 'id'>),
        }))
      );
    });
    return () => unsub();
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <p>Welcome, {user.email}!</p>

      <Link
        href="/quiz"
        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Take Quiz
      </Link>

      <section>
        <h2 className="text-xl font-semibold mt-8">Your Quiz History</h2>
        {results.length === 0 ? (
          <p className="mt-2 text-gray-400">No quizzes taken yet.</p>
        ) : (
          <ul className="space-y-3 mt-2">
            {results.map((r) => (
              <li
                key={r.id}
                className="flex justify-between bg-zinc-800 p-4 rounded"
              >
                <span>Score: {r.score}</span>
                <span>{r.timestamp.toDate().toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
