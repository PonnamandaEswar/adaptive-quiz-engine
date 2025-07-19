'use client';

import { useState } from 'react';
import { questions, Question } from '@/data/questions';

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);

  const question: Question = questions[current];

  const handleOptionClick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowAnswer(true);
    if (idx === question.answer) setScore(score + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setShowAnswer(false);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow text-center space-y-4">
          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-xl">Your Score: <span className="font-semibold">{score}</span> / {questions.length}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              setCurrent(0);
              setScore(0);
              setCompleted(false);
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
          <span>Question {current + 1} / {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <progress
          className="w-full"
          value={current + 1}
          max={questions.length}
        />
        <h3 className="text-lg font-semibold mb-2">{question.question}</h3>
        <div className="space-y-2">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={selected !== null}
              onClick={() => handleOptionClick(idx)}
              className={`block w-full text-left p-2 rounded border transition
                ${selected === idx
                  ? idx === question.answer
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
            {selected === question.answer ? (
              <span className="text-green-600 font-semibold">Correct!</span>
            ) : (
              <span className="text-red-600 font-semibold">
                Incorrect. Correct answer: {question.options[question.answer]}
              </span>
            )}
          </div>
        )}
        {showAnswer && (
          <button
            onClick={handleNext}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            {current < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}
git add .
git commit -m "Add quiz UI page with local questions and scoring"
git push origin main
