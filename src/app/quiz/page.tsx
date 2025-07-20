// src/app/quiz/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type Question = {
  question: string;
  options: string[];
  answer: number;
};

// Exactly 10 questions temporarily
const questions: Question[] = [
  { question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answer: 1 },
  { question: 'Capital of India?', options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'], answer: 1 },
  { question: 'Color of sky?', options: ['Blue', 'Green', 'Red', 'Yellow'], answer: 0 },
  { question: 'Mix blue & yellow gives?', options: ['Purple', 'Orange', 'Green', 'Brown'], answer: 2 },
  { question: '5 x 5?', options: ['10', '15', '20', '25'], answer: 3 },
  { question: 'Fastest animal on land?', options: ['Lion', 'Tiger', 'Cheetah', 'Elephant'], answer: 2 },
  { question: 'H2O stands for?', options: ['Hydrogen', 'Oxygen', 'Water', 'Helium'], answer: 2 },
  { question: 'Opposite of "hot"?', options: ['Cold', 'Warm', 'Heat', 'Ice'], answer: 0 },
  { question: 'Number of days in leap year?', options: ['365', '366', '364', '367'], answer: 1 },
  { question: 'Primary colors?', options: ['Red-Green-Blue', 'Red-Yellow-Blue', 'Purple-Green-Orange', 'Black-White-Grey'], answer: 1 },
];

export default function QuizPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [loading, user, router]);

  // Display loading only until auth resolves clearly
  if (loading) {
    return <div className="text-center p-6 text-gray-400">Loading quiz...</div>;
  }

  // Explicitly handle user not found scenario
  if (!user) {
    router.replace('/auth/login');
    return null;
  }

  const handleAnswer = (idx: number) => {
    if (idx === questions[current].answer) setScore(score + 1);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setQuizComplete(true);
    }
  };

  useEffect(() => {
    if (!quizComplete) return;

    const saveResults = async () => {
      setSaving(true);
      try {
        await addDoc(collection(db, 'results'), {
          userId: user.uid,
          score,
          total: questions.length,
          timestamp: serverTimestamp(),
        });
      } catch (err) {
        console.error('Save error:', err);
      } finally {
        router.replace('/student/dashboard');
      }
    };

    saveResults();
  }, [quizComplete, score, user, router]);

  return (
    <div className="p-6 max-w-md mx-auto">
      {!quizComplete ? (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Question {current + 1} of {questions.length}
          </h2>
          <p className="mb-4">{questions[current].question}</p>
          <div className="space-y-2">
            {questions[current].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-400">
          {saving ? 'Saving results...' : 'Redirecting to dashboard...'}
        </div>
      )}
    </div>
  );
}
