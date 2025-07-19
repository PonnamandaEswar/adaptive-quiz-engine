'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow space-y-4 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h2>
        <p className="mb-2">
          <span className="font-semibold">Logged in as:</span> {user?.email}
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600git add .
git commit -m "Add protected dashboard page with user info and logout"
git push origin main
 text-white p-2 rounded"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
