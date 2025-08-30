import React from 'react';

interface ExamErrorProps {
  message: string | null | undefined;
}

const ExamError: React.FC<ExamErrorProps> = ({ message }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Erro</h1>
      <p className="text-lg text-red-600 mb-4">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Tentar Novamente
      </button>
    </main>
  );
};

export default ExamError;