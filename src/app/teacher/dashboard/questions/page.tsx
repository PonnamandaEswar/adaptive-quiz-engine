'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

interface Question {
  id?: string;
  question: string;
  options: string[];
  answer: number;
}

export default function QuestionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Protect route
  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [loading, user, router]);
  if (loading || !user) return null;

  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  // Form state
  const [newQuestion, setNewQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch classes taught by this teacher
  useEffect(() => {
    if (!user) return;
    const fetchClasses = async () => {
      const q = query(
        collection(db, 'classes'),
        where('teacherId', '==', user.uid)
      );
      const snap = await getDocs(q);
      setClasses(snap.docs.map(d => ({ id: d.id, name: (d.data() as any).name })));
    };
    fetchClasses();
  }, [user]);

  // Fetch existing questions for selected class
  useEffect(() => {
    if (!selectedClass) return;
    const fetchQuestions = async () => {
      const q = query(
        collection(db, 'questions'),
        where('classId', '==', selectedClass)
      );
      const snap = await getDocs(q);
      setQuestions(
        snap.docs.map(d => ({ id: d.id, ...(d.data() as Question) }))
      );
    };
    fetchQuestions();
  }, [selectedClass]);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) {
      setMessage('Please select a class first.');
      return;
    }
    setSubmitting(true);
    setMessage('');
    try {
      const payload = {
        classId: selectedClass,
        question: newQuestion,
        options,
        answer: correctIndex,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'questions'), payload);
      setMessage('Question added successfully.');
      // clear inputs
      setNewQuestion('');
      setOptions(['', '', '', '']);
      setCorrectIndex(0);
      // refresh list
      const snap = await getDocs(
        query(collection(db, 'questions'), where('classId', '==', selectedClass))
      );
      setQuestions(snap.docs.map(d => ({ id: d.id, ...(d.data() as Question) })));
    } catch (err: any) {
      console.error(err);
      setMessage('Failed to add question.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">Question Management</h2>

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
        <>
          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div>
              <label className="block text-white">Question Text</label>
              <input
                type="text"
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                required
                className="w-full p-2 bg-zinc-800 text-white rounded"
                disabled={submitting}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={correctIndex === idx}
                    onChange={() => setCorrectIndex(idx)}
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={e => {
                      const arr = [...options]; arr[idx] = e.target.value; setOptions(arr);
                    }}
                    required
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 p-2 bg-zinc-800 text-white rounded"
                    disabled={submitting}
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {submitting ? 'Adding…' : 'Add Question'}
            </button>
          </form>
          {message && <p className="text-sm text-gray-400">{message}</p>}

          <div className="mt-6 space-y-2">
            <h3 className="font-semibold text-white">Existing Questions</h3>
            {questions.map(q => (
              <div key={q.id} className="p-3 bg-zinc-800 rounded">
                <p className="text-gray-200">{q.question}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-gray-400">🚧 Upload document for auto‑generate questions (future)</p>
            <button disabled className="mt-2 px-4 py-2 bg-zinc-600 text-white rounded opacity-50 cursor-not-allowed">
              Upload PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
