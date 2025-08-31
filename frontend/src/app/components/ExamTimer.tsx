// frontend/src/app/components/ExamTimer.tsx

'use client';

import React, { useState, useEffect } from 'react';

/**
 * @interface ExamTimerProps
 * @description Propriedades para o componente ExamTimer.
 * @property {number} durationInMinutes - A duração do temporizador em minutos.
 * @property {() => void} onTimeUp - Função de callback a ser chamada quando o tempo acabar.
 */
interface ExamTimerProps {
  durationInMinutes: number;
  onTimeUp: () => void;
}

/**
 * @component ExamTimer
 * @description Componente React que exibe um temporizador para exames.
 * Gerencia o tempo restante e executa uma função de callback quando o tempo se esgota.
 * @param {ExamTimerProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente do temporizador do exame.
 */
const ExamTimer: React.FC<ExamTimerProps> = ({ durationInMinutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);

  /**
   * @function useEffect
   * @description Hook de efeito para gerenciar o temporizador.
   * Configura um intervalo para decrementar o tempo restante a cada segundo e chama `onTimeUp` quando o tempo chega a zero.
   * Limpa o intervalo quando o componente é desmontado ou as dependências mudam.
   */
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  /**
   * @function formatTime
   * @description Formata o número de segundos em uma string de tempo (MM:SS).
   * @param {number} seconds - O número de segundos a serem formatados.
   * @returns {string} A string formatada no padrão MM:SS.
   */   * @returns {string} A string de tempo formatada.
   */
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-2xl font-bold text-gray-800 mb-6 text-center">
      Tempo Restante: <span className="text-blue-600">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default ExamTimer;