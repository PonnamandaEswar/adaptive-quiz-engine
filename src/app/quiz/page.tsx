'use client';

import React, { useState, useEffect } from 'react';
import { questions, Question } from '@/data/questions';

type Difficulty = 'easy' | 'medium' | 'hard';

function getNextDifficulty(current: Difficulty, correct: boolean): Difficulty {
  if (current === 'medium') return correct ? 'hard' : 'easy';
  if (current === 'easy') return correct ? 'medium' : 'easy';
  if (current === 'hard') return correct ? 'hard' : 'medium';
  return 'medium';
}

const XP_PER_CORRECT = 1;
const XP_PER_LEVEL = 5;

export default function QuizPage() {
  const [score, setScore] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('medium');
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Gamification state
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    pickQuestion('medium');
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (xp > 0 && xp % XP_PER_LEVEL === 0) {
      setLevel(level + 1);
      setShowBadge(true);
      setTimeout(() => setShowBadge(false), 2500);
    }
    // eslint-disable-next-line
  }, [xp]);

  function pickQuestion(difficulty: Difficulty) {
    const available = questions.filter(q => q.difficulty === difficulty && !usedIds.includes(q.id));
    if (available.length === 0) {
      const anyLeft = questions.filter(q => !usedIds.includes(q.id));
      if (anyLeft.length === 0) {
        setCompleted(true);
        setCurrent(null);
        return;
      }
      setCurrent(anyLeft[Math.floor(Math.random() * anyLeft.length)]);
      setCurrentDifficulty(anyLeft[0].difficulty);
    } else {
      setCurrent(available[Math.floor(Math.random() * available.length)]);
      setCurrentDifficulty(difficulty);
    }
  }

  const handleOptionClick = (idx: number) => {
    if (selected !== null || !current) return;
    setSelected(idx);
    setShowAnswer(true);
    if (idx === current.answer) {
      setScore(score + 1);
      setXp(xp + XP_PER_CORRECT);
    }
  };

  const handleNext = () => {
    if (!current) return;
    const correct = selected === current.answer;
    const nextDifficulty = getNextDifficulty(currentDifficulty, correct);

    setUsedIds([...usedIds, current.id]);
    setSelected(null);
    setShowAnswer(false);

    setTimeout(() => pickQuestion(nextDifficulty), 200);
  };

  if (completed) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-black">
        <div className="bg-zinc-900 p-6 rounded-2xl shadow-2xl text-center space-y-4 border border-zinc-700">
          <h2 className="text-3xl font-bold mb-2 text-white">Quiz Complete!</h2>
          <p className="text-xl text-green-400">Your Score: <span className="font-semibold">{score}</span> / {usedIds.length}</p>
          <p className="text-lg text-yellow-300">Final Level: <span className="font-semibold">{level}</span></p>
          <button
            className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded shadow hover:from-purple-700 hover:to-blue-700"
            onClick={() => {
              setScore(0);
              setXp(0);
              setLevel(1);
              setUsedIds([]);
              setCompleted(false);
              pickQuestion('medium');
            }}
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="bg-zinc-900 p-6 rounded-2xl shadow-2xl text-center border border-zinc-700">
          <p className="text-white">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-black">
      {showBadge && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 border-4 border-yellow-700 px-10 py-5 rounded-2xl shadow-2xl z-50 text-2xl font-bold text-black animate-bounce neon-glow">
          🎉 Achievement Unlocked: Level Up!
        </div>
      )}
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-zinc-700 relative">
        <div className="flex justify-between mb-2 text-white font-mono">
          <span>Q {usedIds.length + 1} / {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        {/* Gamification section */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-sm font-semibold text-white font-mono">
            <span>Level: {level}</span>
            <span>XP: {xp % XP_PER_LEVEL}/{XP_PER_LEVEL}</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full mt-1 mb-1">
            <div
              className="bg-green-400 h-3 rounded-full neon-glow"
              style={{
                width: `${((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100}%`,
                boxShadow: '0 0 12px 3px #22ff99'
              }}
            />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">{current.question}</h3>
        <div className="space-y-2">
          {current.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={selected !== null}
              onClick={() => handleOptionClick(idx)}
              className={`
                block w-full text-left p-3 rounded-lg border transition font-semibold
                ${selected === idx
                  ? idx === current.answer
                    ? 'bg-green-700 border-green-400 text-white neon-glow'
                    : 'bg-red-800 border-red-400 text-white neon-glow'
                  : 'bg-zinc-800 border-zinc-700 text-gray-200'}
                hover:bg-blue-700 hover:text-white hover:border-blue-500
              `}
            >
              {opt}
            </button>
          ))}
        </div>
        {showAnswer && (
          <div className="mt-4 text-center">
            {selected === current.answer ? (
              <span className="text-green-300 font-semibold text-lg">Correct!</span>
            ) : (
              <span className="text-red-400 font-semibold text-lg">
                Incorrect. Correct answer: {current.options[current.answer]}
              </span>
            )}
          </div>
        )}
        {showAnswer && (
          <button
            onClick={handleNext}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded shadow hover:from-purple-700 hover:to-blue-700"
          >
            Next Question
          </button>
        )}
      </div>
      <style jsx global>{`
        .neon-glow {
          text-shadow:
            0 0 4px #fff,
            0 0 10px #22ff99,
            0 0 20px #22ff99,
            0 0 40px #22ff99;
          box-shadow:
            0 0 12px 3px #22ff99 !important;
        }
      `}</style>
    </div>
  );
}
