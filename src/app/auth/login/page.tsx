// src/app/auth/login/page.tsx
'use client';

import React, { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // 1) Sign in with Firebase Auth
      const userCred: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCred.user.uid;

      // 2) Look up the user's role in Firestore
      const snap = await getDoc(doc(db, 'users', uid));
      const data = snap.data() as { role?: 'student' | 'teacher' };
      const role = data?.role ?? 'student';

      // 3) Redirect based on role
      if (role === 'teacher') {
        router.push('/teacher/dashboard');
      } else {
        // students go straight into the quiz
        router.push('/quiz');
      }
      return;
    } catch (err: any) {
      console.error('Login error:', err);

      switch (err.code) {
        case 'auth/user-not-found':
          router.push('/auth/signup');
          return;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('That email address is invalid.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid credentials – please check your email & password.');
          break;
        default:
          setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded space-y-4 w-full max-w-sm"
      >
        <h2 className="text-white text-2xl">Log In</h2>
        {error && <p className="text-red-400">{error}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          disabled={submitting}
          className="w-full p-2 rounded bg-zinc-800 text-white"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          disabled={submitting}
          className="w-full p-2 rounded bg-zinc-800 text-white"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 p-2 rounded text-white"
        >
          {submitting ? 'Logging in…' : 'Log In'}
        </button>

        <p className="text-sm text-gray-400">
          New here?{' '}
          <Link href="/auth/signup">
            <span className="text-green-400 cursor-pointer">Sign up</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
