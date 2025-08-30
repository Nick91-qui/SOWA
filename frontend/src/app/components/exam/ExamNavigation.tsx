import React from 'react';

interface ExamNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  isSubmitting: boolean;
  handlePreviousQuestion: () => void;
  handleNextQuestion: () => void;
  handleSubmitClick: () => void;
}

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