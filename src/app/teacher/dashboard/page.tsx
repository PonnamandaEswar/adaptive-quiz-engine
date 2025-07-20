'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function TeacherDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <nav className="flex space-x-4">
        <Link
          href="/teacher/dashboard/performance"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Class Performance
        </Link>
        <Link
          href="/teacher/dashboard/questions"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Question Management
        </Link>
      </nav>
    </div>
  );
}