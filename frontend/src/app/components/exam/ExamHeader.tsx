import React from 'react';
import ExamTimer from '@/app/components/ExamTimer';

/**
 * @interface ExamHeaderProps
 * @description Propriedades para o componente ExamHeader.
 * @property {string} examTitle - O título do exame a ser exibido.
 * @property {number} [durationInMinutes] - A duração do exame em minutos (opcional). Se fornecido, o cronômetro do exame será exibido.
 * @property {() => void} onTimeUp - Função de callback a ser chamada quando o tempo do exame se esgotar.
 */
interface ExamHeaderProps {
  examTitle: string;
  durationInMinutes?: number;
  onTimeUp: () => void;
}

/**
 * @component ExamHeader
 * @description Componente de cabeçalho para a página do exame.
 * Exibe o título do exame e, opcionalmente, um cronômetro regressivo se a duração for fornecida.
 * @param {ExamHeaderProps} props - As propriedades do componente.
 */
const ExamHeader: React.FC<ExamHeaderProps> = ({
  examTitle,
  durationInMinutes,
  onTimeUp,
}) => {
  return (
    <div className="w-full flex flex-col items-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800">{examTitle}</h1>
      {durationInMinutes && (
        <ExamTimer durationInMinutes={durationInMinutes} onTimeUp={onTimeUp} />
      )}
    </div>
  );
};

export default ExamHeader;