import React from 'react';

/**
 * @interface ExamContainerProps
 * @description Propriedades para o componente ExamContainer.
 * @property {React.ReactNode} children - Os elementos filhos a serem renderizados dentro do container.
 */
interface ExamContainerProps {
  children: React.ReactNode;
}

/**
 * @component ExamContainer
 * @description Um componente de container para a página do exame.
 * Ele fornece um layout básico com centralização e preenchimento, e renderiza os elementos filhos dentro de um elemento `main`.
 * @param {ExamContainerProps} props - As propriedades do componente.
 */
const ExamContainer: React.FC<ExamContainerProps> = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24 bg-gray-100">
      {children}
    </main>
  );
};

export default ExamContainer;