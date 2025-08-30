import { useState, useEffect, useCallback } from 'react';
import { ExamSession, Question } from '@/types';

// Utility function for debouncing
const debounce = (func: Function, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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

  const handleAnswerChange = useCallback((questionId: string, answer: string | string[]) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  }, []);

  return { answers, handleAnswerChange, setAnswers };
};