'use client';

import { useState } from 'react';
import { questions, Question } from '@/data/questions';

type Difficulty = 'easy' | 'medium' | 'hard';

function getNextDifficulty(current: Difficulty, correct: boolean): Difficulty {
  if (current === 'medium') return correct ? 'hard' : 'easy';
  if (current === 'easy') return correct ? 'medium' : 'easy';
  if (current === 'hard') return correct ? 'hard' : 'medium';
  return 'medium';
}

export default function QuizPage() {
  const [score, setScore] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('medium');
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Pick the first question on load
  React.useEffect(() => {
    pickQuestion('medium');
    // eslint-disable-next-line
  }, []);

  function pickQuestion(difficulty: Difficulty) {
    // Find questions of this difficulty that haven't been used
    const available = questions.filter(q => q.difficulty === difficulty && !usedIds.includes(q.id));
    if (available.length === 0) {
      // Fallback to any not-yet-used question
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
    if (idx === current.answer) setScore(score + 1);
  };

  const handleNext = () => {
    if (!current) return;
    // Determine next difficulty
    const correct = selected === current.answer;
    const nextDifficulty = getNextDifficulty(currentDifficulty, correct);

    setUsedIds([...usedIds, current.id]);
    setSelected(null);
    setShowAnswer(false);

    // Wait a tick before picking next
    setTimeout(() => pickQuestion(nextDifficulty), 200);
  };

  if (completed || !current) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow text-center space-y-4">
          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-xl">Your Score: <span className="font-semibold">{score}</span> / {usedIds.length}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              setScore(0);
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

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
        <div className="flex justify-between mb-2">
          <span>Question {usedIds.length + 1} / {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <progress
          className="w-full"
          value={usedIds.length + 1}
          max={questions.length}
        />
        <h3 className="text-lg font-semibold mb-2">{current.question}</h3>
        <div className="space-y-2">
          {current.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={selected !== null}
              onClick={() => handleOptionClick(idx)}
              className={`block w-full text-left p-2 rounded border transition
                ${selected === idx
                  ? idx === current.answer
                    ? 'bg-green-200 border-green-600'
                    : 'bg-red-200 border-red-600'
                  : 'bg-gray-50 border-gray-300'}
                hover:bg-blue-50
              `}
            >
              {opt}
            </button>
          ))}
        </div>
        {showAnswer && (
          <div className="mt-4 text-center">
            {selected === current.answer ? (
              <span className="text-green-600 font-semibold">Correct!</span>
            ) : (
              <span className="text-red-600 font-semibold">
                Incorrect. Correct answer: {current.options[current.answer]}
              </span>
            )}
          </div>
        )}
        {showAnswer && (
          <button
            onClick={handleNext}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
