import React from 'react';
import Link from 'next/link';

interface ExamFinishedProps {
  isSubmitting: boolean;
  submitError: string | null;
}

const ExamFinished: React.FC<ExamFinishedProps> = ({ isSubmitting, submitError }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Exame Finalizado!</h1>
      {isSubmitting ? (
        <p className="text-lg text-gray-700">Enviando suas respostas...</p>
      ) : submitError ? (
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Erro ao enviar respostas: {submitError}</p>
          <Link href="/dashboard">
            <p className="text-blue-500 hover:underline">Voltar para o Dashboard</p>
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-green-600 mb-4">Suas respostas foram enviadas com sucesso!</p>
          <Link href="/results">
            <p className="text-blue-500 hover:underline">Ver Resultados</p>
          </Link>
        </div>
      )}
    </main>
  );
};

export default ExamFinished;