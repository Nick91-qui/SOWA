'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';

interface LockdownExamProps {
  children: React.ReactNode;
  sessionId: number;
}

const LockdownExam: React.FC<LockdownExamProps> = ({ children, sessionId }) => {
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const MAX_VIOLATIONS = 3; // Define um limite de violações antes de encerrar a prova

  const reportFraud = useMutation({
    mutationFn: async (fraudData: { sessionId: number; type: string; details?: string }) => {
      const response = await axios.post('/api/fraud', fraudData);
      return response.data;
    },
    onError: (error) => {
      console.error('Erro ao reportar fraude:', error);
      toast.error('Erro ao registrar violação.');
    },
  });

  const handleFullScreenChange = useCallback(() => {
    const fullscreenElement = document.fullscreenElement;
    setIsFullScreen(!!fullscreenElement);
    if (!fullscreenElement && violationCount < MAX_VIOLATIONS) {
      const fraudDetails = 'Saiu do modo tela cheia.';
      reportFraud.mutate({ sessionId, type: 'FULLSCREEN_EXIT', details: fraudDetails });
      setViolationCount(prev => prev + 1);
      toast.warn(`Comportamento suspeito detectado: ${fraudDetails} (${violationCount + 1}/${MAX_VIOLATIONS})`);
    }
  }, [sessionId, violationCount, reportFraud]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && violationCount < MAX_VIOLATIONS) {
      const fraudDetails = 'Mudou de aba/janela.';
      reportFraud.mutate({ sessionId, type: 'TAB_CHANGE', details: fraudDetails });
      setViolationCount(prev => prev + 1);
      toast.warn(`Comportamento suspeito detectado: ${fraudDetails} (${violationCount + 1}/${MAX_VIOLATIONS})`);
    }
  }, [sessionId, violationCount, reportFraud]);

  useEffect(() => {
    // Solicitar tela cheia ao montar o componente
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erro ao tentar entrar em tela cheia: ${err.message}`);
        toast.error('Não foi possível entrar em modo tela cheia. Por favor, permita o modo tela cheia para continuar a prova.');
      });
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Sair do modo tela cheia ao desmontar o componente, se ainda estiver nele
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [handleFullScreenChange, handleVisibilityChange]);

  useEffect(() => {
    if (violationCount >= MAX_VIOLATIONS) {
      // Encerrar a prova ou tomar outra ação drástica
      toast.error('Muitas violações detectadas. A prova será encerrada.');
      // Aqui você pode adicionar a lógica para submeter a prova automaticamente
      // ou redirecionar o usuário para uma página de encerramento.
      // Submeter a prova automaticamente
      axios.post(`/api/exam-sessions/${sessionId}/auto-submit/`)
        .then(() => {
          toast.success('Prova encerrada automaticamente devido a violações.');
          router.push(`/exam-finished/${sessionId}`);
        })
        .catch(error => {
          console.error('Erro ao submeter prova automaticamente:', error);
          toast.error('Erro ao encerrar a prova automaticamente.');
          router.push(`/exam-finished/${sessionId}`); // Redireciona mesmo com erro para evitar loop
        });
    }
  }, [violationCount, sessionId, router]);

  return (
    <>
      {!isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <p className="text-white text-xl text-center">Por favor, entre no modo tela cheia para continuar a prova.</p>
        </div>
      )}
      {children}
    </>
  );
};

export default LockdownExam;