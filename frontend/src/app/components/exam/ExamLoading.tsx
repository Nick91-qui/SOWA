import React from 'react';

/**
 * @component ExamLoading
 * @description Componente exibido enquanto o exame está sendo carregado.
 * Ele fornece um feedback visual simples para o usuário de que o conteúdo está sendo preparado.
 */
const ExamLoading = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Carregando exame...</h1>
    </main>
  );
};

export default ExamLoading;