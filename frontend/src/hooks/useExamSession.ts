import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAvailableExams, startExamSession } from '@/app/api/examService';
import { Exam, ExamSession, Question } from '@/types';

export const useExamSession = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examSession, setExamSession] = useState<ExamSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExam = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data: exams, error: examsError } = await getAvailableExams();
        if (examsError || !exams?.length) {
          throw new Error(examsError || 'Nenhum exame disponível');
        }

        const { data: session, error: sessionError } = await startExamSession(exams[0].id);
        if (sessionError || !session) {
          throw new Error(sessionError || 'Erro ao iniciar sessão de exame');
        }

        setQuestions(exams[0].questions);
        setExamSession(session);
      } catch (err: any) {
        console.error('Erro ao carregar exame:', err);
        setError(err.message || 'Erro ao carregar exame.');
      } finally {
        setIsLoading(false);
      }
    };

    loadExam();
  }, []);

  return { questions, examSession, isLoading, error, setExamSession };
};