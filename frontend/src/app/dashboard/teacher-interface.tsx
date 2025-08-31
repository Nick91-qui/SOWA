'use client';

import React, { useEffect, useState } from 'react';
import { ExamSession } from '@/types';
import { getExamSessions } from '../api/examService'; // Precisaremos criar esta função

/**
 * @component TeacherInterface
 * @description Componente da interface do professor para gerenciar sessões de prova.
 * Exibe uma lista de sessões de prova, seus status e pontuações.
 * @returns {JSX.Element} O componente da interface do professor.
 */
const TeacherInterface = () => {
  const [examSessions, setExamSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  /**
   * @function fetchExamSessions
   * @description Busca as sessões de exame disponíveis na API e atualiza o estado do componente.
   * Lida com estados de carregamento e erro.
   */
    const fetchExamSessions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Esta função ainda não existe, precisaremos criá-la no examService.ts
        const { data, error } = await getExamSessions(); 
        if (error) {
          throw new Error(error);
        }
        setExamSessions(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExamSessions();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Carregando sessões de prova...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gerenciar Sessões de Prova</h2>
      {examSessions.length === 0 ? (
        <p>Nenhuma sessão de prova encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {examSessions.map((session) => (
            <li key={session.id} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">Sessão ID: {session.id}</p>
              <p>Exame ID: {session.exam_id}</p>
              <p>Usuário ID: {session.user_id}</p>
              <p>Status: {session.status}</p>
              <p>Pontuação: {session.score !== null ? session.score : 'N/A'}</p>
              {/* Adicionar mais detalhes e ações aqui, como ver respostas, finalizar sessão, etc. */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeacherInterface;