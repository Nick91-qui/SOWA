// frontend/src/app/components/ExamResults.tsx

import React from 'react';

/**
 * @interface ExamResultsProps
 * @description Propriedades para o componente ExamResults.
 * @property {number} score - A pontuação obtida no exame.
 * @property {number} totalQuestions - O número total de questões no exame.
 * @property {string} [feedback] - Um feedback opcional sobre o desempenho no exame.
 */
interface ExamResultsProps {
  score: number;
  totalQuestions: number;
  feedback?: string;
}

/**
 * @component ExamResults
 * @description Componente React que exibe os resultados de um exame, incluindo pontuação, percentual e feedback.
 * @param {ExamResultsProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente de resultados do exame.
 */
const ExamResults: React.FC<ExamResultsProps> = ({ score, totalQuestions, feedback }) => {
  const percentage = (score / totalQuestions) * 100;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Resultados do Exame</h2>
      <p className="text-xl text-gray-700 mb-2">
        Sua pontuação: <span className="font-semibold text-blue-600">{score}</span> de <span className="font-semibold text-blue-600">{totalQuestions}</span>
      </p>
      <p className="text-2xl font-bold mb-6">
        Percentual: <span className="text-green-600">{percentage.toFixed(2)}%</span>
      </p>
      {feedback && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Feedback:</h3>
          <p className="text-gray-700">{feedback}</p>
        </div>
      )}
      <button
        onClick={() => window.location.href = '/dashboard'}
        className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Voltar para o Dashboard
      </button>
    </div>
  );
};

export default ExamResults;