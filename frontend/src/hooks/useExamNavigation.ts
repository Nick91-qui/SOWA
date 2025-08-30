import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types';

export const useExamNavigation = (
  questions: Question[],
  examFinished: boolean,
  confirmSubmit: (answers: Record<string, string | string[]>) => void,
  answers: Record<string, string | string[]>,
) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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