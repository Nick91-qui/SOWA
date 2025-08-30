import React from 'react';

interface ExamProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

const ExamProgress: React.FC<ExamProgressProps> = ({
  currentQuestionIndex,
  totalQuestions,
}) => {
  return (
    <p className="text-lg text-gray-700 mb-4">
      Questão {currentQuestionIndex + 1} de {totalQuestions}
    </p>
  );
};

export default ExamProgress;