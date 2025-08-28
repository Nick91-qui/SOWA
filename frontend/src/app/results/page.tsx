// frontend/src/app/results/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import ExamResults from '../components/ExamResults';

const ResultsPage = () => {
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Buscar os resultados do exame do backend
    // Por enquanto, usando dados mockados
    const mockScore = 7;
    const mockTotalQuestions = 10;
    const mockFeedback = 'Bom trabalho! Continue estudando para melhorar.';

    setScore(mockScore);
    setTotalQuestions(mockTotalQuestions);
    setFeedback(mockFeedback);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 sm:p-24 bg-gray-100">
        <p className="text-lg text-gray-700">Carregando resultados...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <ExamResults score={score} totalQuestions={totalQuestions} feedback={feedback} />
    </main>
  );
};

export default ResultsPage;