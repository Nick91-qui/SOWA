import React from 'react';

/**
 * @interface ExamProgressProps
 * @description Propriedades para o componente ExamProgress.
 * @property {number} currentQuestionIndex - O índice da pergunta atual (baseado em zero).
 * @property {number} totalQuestions - O número total de perguntas no exame.
 */
interface ExamProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

/**
 * @component ExamProgress
 * @description Componente que exibe o progresso atual do usuário no exame, mostrando qual questão ele está respondendo em relação ao total.
 * @param {ExamProgressProps} props - As propriedades para o componente.
 */
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