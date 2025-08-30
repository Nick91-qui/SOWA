'use client';

import { Exam, Question, ExamSession, ExamResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const getAvailableExams = async (): Promise<ApiResponse<Exam[]>> => {
  try {
    const response = await fetch(`${API_URL}/exams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.detail || 'Erro ao buscar exames disponíveis' };
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    return { error: 'Erro de conexão com o servidor' };
  }
};

export const startExamSession = async (examId: string): Promise<ApiResponse<ExamSession>> => {
  try {
    const response = await fetch(`${API_URL}/exam-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ exam_id: examId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.detail || 'Erro ao iniciar sessão de prova' };
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    return { error: 'Erro de conexão com o servidor' };
  }
};

export const submitExamResponse = async (
  sessionId: string,
  questionId: string,
  answer: string | string[]
): Promise<ApiResponse<ExamResponse>> => {
  try {
    const response = await fetch(`${API_URL}/exam-responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exam_session_id: sessionId,
        question_id: questionId,
        answer,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.detail || 'Erro ao registrar resposta' };
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    return { error: 'Erro de conexão com o servidor' };
  }
};

export const endExamSession = async (sessionId: string): Promise<ApiResponse<ExamSession>> => {
  try {
    const response = await fetch(`${API_URL}/exam-sessions/${sessionId}/end`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.detail || 'Erro ao finalizar sessão de prova' };
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    return { error: 'Erro de conexão com o servidor' };
  }
};

export const getExamSessions = async (): Promise<ApiResponse<ExamSession[]>> => {
  try {
    const response = await fetch(`${API_URL}/exam-sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.detail || 'Erro ao buscar sessões de prova' };
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    return { error: 'Erro de conexão com o servidor' };
  }
};