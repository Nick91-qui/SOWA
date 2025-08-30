import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitExamResponse } from '@/app/api/examService';
import { ExamSession } from '@/types';

export const useExamSubmission = (examSession: ExamSession | null, setExamFinished: (finished: boolean) => void, setAnswers: (answers: Record<string, string | string[]>) => void) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmSubmit = async (answers: Record<string, string | string[]>) => {
    if (!examSession) return;

    setExamFinished(true);

    try {
      setIsSubmitting(true);
      setError(null);
      for (const [questionId, answer] of Object.entries(answers)) {
        await submitExamResponse(examSession.id, questionId, answer);
      }
      localStorage.removeItem(`exam-${examSession.id}-answers`);
      router.push(`/exam/result/${examSession.id}`);
      console.log('Exame submetido com sucesso!');
    } catch (err: any) {
      console.error('Erro na submissão do exame:', err.message);
      setError(err.message || 'Erro ao submeter o exame.');
      setExamFinished(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, error, confirmSubmit };
};