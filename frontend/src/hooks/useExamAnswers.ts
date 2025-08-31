import { useState, useEffect, useCallback } from 'react';
import { ExamSession, Question } from '@/types';

/**
 * Função utilitária para debouncing.
 * Garante que uma função seja executada apenas após um certo atraso
 * desde a última vez que foi invocada.
 * 
 * @param {Function} func A função a ser 'debounced'.
 * @param {number} delay O atraso em milissegundos antes da execução da função.
 * @returns {Function} A função 'debounced'.
 */
const debounce = (func: Function, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

/**
 * Tempo de expiração para os dados do exame no localStorage (24 horas em milissegundos).
 */
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Limpa dados de exames expirados do localStorage.
 * Percorre todos os itens do localStorage que começam com 'exam-' e terminam com '-answers',
 * verifica se o timestamp salvo excedeu o tempo de expiração e remove os dados expirados ou corrompidos.
 */
export const clearExpiredExamData = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('exam-') && key.endsWith('-answers')) {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        try {
          const { timestamp } = JSON.parse(savedData);
          if (Date.now() - timestamp >= EXPIRATION_TIME) {
            localStorage.removeItem(key);
            console.log(`Removed expired exam data for key: ${key}`);
          }
        } catch (e) {
          console.error(`Error parsing localStorage data for key ${key}:`, e);
          localStorage.removeItem(key); // Remove corrupted data
        }
      }
    }
  }
};

/**
 * Hook personalizado para gerenciar as respostas do usuário durante uma sessão de exame.
 * Salva e carrega automaticamente as respostas do localStorage e fornece uma função para atualizar as respostas.
 * 
 * @param {ExamSession | null} examSession Os dados da sessão do exame atual.
 * @param {boolean} examFinished Indica se o exame foi finalizado.
 * @returns {{ answers: Record<string, string | string[]>, handleAnswerChange: (questionId: string, answer: string | string[]) => void, setAnswers: React.Dispatch<React.SetStateAction<Record<string, string | string[]>>> }} Um objeto contendo as respostas, a função para lidar com a mudança de resposta e a função para definir as respostas.
 */
export const useExamAnswers = (examSession: ExamSession | null, examFinished: boolean) => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  // Auto-save answers to localStorage with debounce
  useEffect(() => {
    const saveAnswers = () => {
      if (examSession?.id && Object.keys(answers).length > 0 && !examFinished) {
        const dataToSave = {
          answers: answers,
          timestamp: Date.now(),
        };
        localStorage.setItem(`exam-${examSession.id}-answers`, JSON.stringify(dataToSave));
      }
    };

    const debouncedSave = debounce(saveAnswers, 1000);
    debouncedSave();
  }, [answers, examFinished, examSession]);

  // Load answers from localStorage on component mount
  useEffect(() => {
    if (examSession?.id && !examFinished) {
      const savedData = localStorage.getItem(`exam-${examSession.id}-answers`);
      if (savedData) {
        try {
          const { answers: savedAnswers, timestamp } = JSON.parse(savedData);
          if (Date.now() - timestamp < EXPIRATION_TIME) {
            setAnswers(savedAnswers);
          } else {
            localStorage.removeItem(`exam-${examSession.id}-answers`);
          }
        } catch (e) {
          console.error(`Error parsing saved answers for exam ${examSession.id}:`, e);
          localStorage.removeItem(`exam-${examSession.id}-answers`); // Remove corrupted data
        }
      }
    }
  }, [examSession, examFinished]);

  /**
   * Callback para lidar com a mudança de resposta de uma questão.
   * Atualiza o estado das respostas com a nova resposta para a questão específica.
   * 
   * @param {string} questionId O ID da questão cuja resposta foi alterada.
   * @param {string | string[]} answer A nova resposta para a questão (pode ser uma string ou um array de strings).
   */
  const handleAnswerChange = useCallback((questionId: string, answer: string | string[]) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  }, []);

  return { answers, handleAnswerChange, setAnswers };
};