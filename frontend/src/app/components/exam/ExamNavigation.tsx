import React from 'react';

/**
 * @interface ExamNavigationProps
 * @description Propriedades para o componente ExamNavigation.
 * @property {number} currentQuestionIndex - O índice da pergunta atual no exame.
 * @property {number} totalQuestions - O número total de perguntas no exame.
 * @property {boolean} isSubmitting - Indica se o exame está sendo submetido.
 * @property {() => void} handlePreviousQuestion - Função para navegar para a pergunta anterior.
 * @property {() => void} handleNextQuestion - Função para navegar para a próxima pergunta.
 * @property {() => void} handleSubmitClick - Função para lidar com o clique no botão de finalizar exame.
 */
interface ExamNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  isSubmitting: boolean;
  handlePreviousQuestion: () => void;
  handleNextQuestion: () => void;
  handleSubmitClick: () => void;
}

/**
 * @component ExamNavigation
 * @description Componente de navegação para o exame, permitindo ao usuário avançar, retroceder entre as perguntas e finalizar o exame.
 * @param {ExamNavigationProps} props - As propriedades para o componente.
 */
const ExamNavigation: React.FC<ExamNavigationProps> = ({
  currentQuestionIndex,
  totalQuestions,
  isSubmitting,
  handlePreviousQuestion,
  handleNextQuestion,
  handleSubmitClick,
}) => {
  return (
    <div className="flex justify-between mt-6">
      <button
        onClick={handlePreviousQuestion}
        disabled={currentQuestionIndex === 0}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      <button
        onClick={currentQuestionIndex === totalQuestions - 1 ? handleSubmitClick : handleNextQuestion}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={currentQuestionIndex === totalQuestions - 1 && isSubmitting}
      >
        {currentQuestionIndex === totalQuestions - 1 ? (isSubmitting ? 'Finalizando...' : 'Finalizar Exame') : 'Próxima'}
      </button>
    </div>
  );
};

export default ExamNavigation;