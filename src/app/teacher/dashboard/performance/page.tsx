'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

export default function PerformancePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [loading, user, router]);

  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [stats, setStats] = useState<{ avg: string; total: number }>({ avg: '0.00', total: 0 });
  const [students, setStudents] = useState<{ id: string; avg: string; attempts: number }[]>([]);

  // fetch classes taught by this teacher
  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const q = query(
        collection(db, 'classes'),
        where('teacherId', '==', user.uid)
      );
      const snap = await getDocs(q);
      const arr = snap.docs.map(d => ({ id: d.id, name: (d.data() as any).name }));
      setClasses(arr);
    };
    fetch();
  }, [user]);

  // fetch results for selected class
  useEffect(() => {
    if (!selectedClass) return;
    const fetch = async () => {
      const q = query(
        collection(db, 'results'),
        where('classId', '==', selectedClass)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(d => d.data() as any);
      // compute aggregate
      let sum = 0;
      data.forEach(r => { sum += r.score; });
      const avg = data.length ? (sum / data.length).toFixed(2) : '0.00';
      setStats({ avg, total: data.length });
      // by student
      const byStudent: Record<string, { sum: number; count: number }> = {};
      data.forEach(r => {
        const sid = r.userId;
        if (!byStudent[sid]) byStudent[sid] = { sum: 0, count: 0 };
        byStudent[sid].sum += r.score;
        byStudent[sid].count++;
      });
      setStudents(
        Object.entries(byStudent).map(([id, { sum, count }]) => ({
          id,
          avg: (sum / count).toFixed(2),
          attempts: count,
        }))
      );
    };
    fetch();
  }, [selectedClass]);

  if (loading || !user) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">Class Performance</h2>
      <select
        className="p-2 bg-zinc-800 text-white rounded"
        value={selectedClass}
        onChange={e => setSelectedClass(e.target.value)}
      >
        <option value="">Select a class...</option>
        {classes.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {selectedClass && (
        <div className="bg-zinc-900 p-4 rounded space-y-4">
          <p>Average Score: <b>{stats.avg}</b></p>
          <p>Total Attempts: <b>{stats.total}</b></p>

          <h3 className="font-semibold">By Student</h3>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-2 py-1">Student ID</th>
                <th className="px-2 py-1">Avg Score</th>
                <th className="px-2 py-1">Attempts</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="even:bg-zinc-800">
                  <td className="px-2 py-1">{s.id}</td>
                  <td className="px-2 py-1">{s.avg}</td>
                  <td className="px-2 py-1">{s.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}