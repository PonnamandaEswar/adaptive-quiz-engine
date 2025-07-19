// src/data/questions.ts

export type Question = {
  id: string;
  question: string;
  options: string[];
  answer: number; // index of correct answer
  difficulty: 'easy' | 'medium' | 'hard';
};

export const questions: Question[] = [
  {
    id: 'q1',
    question: 'What is the capital of India?',
    options: ['Mumbai', 'Delhi', 'Chennai', 'Kolkata'],
    answer: 1,
    difficulty: 'easy'
  },
  {
    id: 'q2',
    question: 'Who wrote the Ramayana?',
    options: ['Vyasa', 'Tulsidas', 'Valmiki', 'Kalidasa'],
    answer: 2,
    difficulty: 'medium'
  },
  {
    id: 'q3',
    question: 'Which element has atomic number 8?',
    options: ['Nitrogen', 'Oxygen', 'Carbon', 'Hydrogen'],
    answer: 1,
    difficulty: 'easy'
  },
  {
    id: 'q4',
    question: 'What is 15 x 13?',
    options: ['195', '200', '180', '210'],
    answer: 0,
    difficulty: 'hard'
  },
  // ...add more as you wish
];
