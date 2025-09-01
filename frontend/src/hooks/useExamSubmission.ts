import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitExamResponse } from '@/app/api/examService';
import { ExamSession } from '@/types';

/**
 * @fileoverview Hook para gerenciar a submissão de um exame, incluindo o envio das respostas
 * e a navegação para a página de resultados.
 * @hook useExamSubmission
 * @param {ExamSession | null} examSession - A sessão atual do exame.
 * @param {(finished: boolean) => void} setExamFinished - Função para definir o estado de conclusão do exame.
 * @param {(answers: Record<string, string | string[]>) => void} setAnswers - Função para definir as respostas do exame.
 */
export const useExamSubmission = (examSession: ExamSession | null, setExamFinished: (finished: boolean) => void, setAnswers: (answers: Record<string, string | string[]>) => void) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Confirma e submete as respostas do exame.
   * Envia cada resposta individualmente e, em caso de sucesso, limpa o armazenamento local
   * e redireciona para a página de resultados. Em caso de erro, define a mensagem de erro.
   * @function confirmSubmit
   * @async
   * @param {Record<string, string | string[]>} answers - As respostas do usuário para o exame.
   */
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
      console.error('Erro na submissão do exame:', err);
      const errorMessage = typeof err === 'object' && err !== null && 'message' in err ? err.message : String(err);
      setError(errorMessage || 'Erro ao submeter o exame.');
      setExamFinished(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, error, confirmSubmit };
};