'use client';
import React, { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState<'student' | 'teacher'>('student');
  const [error, setError]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // 1) Create the Auth user
      const userCred: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCred.user.uid;

      // 2) Write profile with role into Firestore
      await setDoc(doc(db, 'users', uid), {
        email,
        role,
        createdAt: serverTimestamp(),
      });

      // 3) Redirect based on role
      if (role === 'teacher') {
        router.push('/teacher/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('That email is already registered. Try logging in.');
      } else {
        setError(err.message || 'Failed to create account');
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
        <h2 className="text-white text-2xl">Create Account</h2>
        {error && <p className="text-red-400">{error}</p>}

        <label className="block text-white">Role:</label>
        <div className="flex space-x-4 text-white">
          <label>
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === 'student'}
              onChange={() => setRole('student')}
            />{' '}
            Student
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="teacher"
              checked={role === 'teacher'}
              onChange={() => setRole('teacher')}
            />{' '}
            Teacher
          </label>
        </div>

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
          className="w-full bg-green-600 p-2 rounded text-white"
        >
          {submitting ? 'Signing up…' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
