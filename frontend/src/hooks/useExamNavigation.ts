import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types';

/**
 * Hook personalizado para gerenciar a navegação entre as questões de um exame.
 * Fornece funcionalidades para avançar e retroceder entre as questões, além de lidar com a submissão do exame.
 * 
 * @param {Question[]} questions Array de objetos de questão do exame.
 * @param {boolean} examFinished Indica se o exame foi finalizado.
 * @param {(answers: Record<string, string | string[]>) => void} confirmSubmit Função de callback para confirmar a submissão do exame.
 * @param {Record<string, string | string[]>} answers Objeto contendo as respostas do usuário para cada questão.
 * @returns {{ currentQuestionIndex: number, handleNextQuestion: () => void, handlePreviousQuestion: () => void }} Um objeto contendo o índice da questão atual e as funções para navegar.
 */
export const useExamNavigation = (
  questions: Question[],
  examFinished: boolean,
  confirmSubmit: (answers: Record<string, string | string[]>) => void,
  answers: Record<string, string | string[]>,
) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  /**
   * Lida com a navegação para a próxima questão.
   * Se for a última questão e o exame não estiver finalizado, aciona a confirmação de submissão.
   */
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // If it's the last question, trigger exam submission confirmation
      if (!examFinished) {
        confirmSubmit(answers);
      }
    }
  }, [currentQuestionIndex, questions.length, examFinished, confirmSubmit, answers]);

  /**
   * Lida com a navegação para a questão anterior.
   */
  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNextQuestion();
      } else if (event.key === 'ArrowLeft') {
        handlePreviousQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNextQuestion, handlePreviousQuestion]);

  return { currentQuestionIndex, handleNextQuestion, handlePreviousQuestion };
};