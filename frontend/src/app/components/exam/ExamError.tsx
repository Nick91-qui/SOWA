import React from 'react';

/**
 * @interface ExamErrorProps
 * @description Propriedades para o componente ExamError.
 * @property {string | null | undefined} message - A mensagem de erro a ser exibida.
 */
interface ExamErrorProps {
  message: string | null | undefined;
}

/**
 * @component ExamError
 * @description Componente para exibir uma mensagem de erro na página do exame.
 * Ele exibe uma mensagem de erro fornecida e um botão para recarregar a página, permitindo que o usuário tente novamente.
 * @param {ExamErrorProps} props - As propriedades do componente.
 */
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