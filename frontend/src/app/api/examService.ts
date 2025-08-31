'use client';

/**
 * @file examService.ts
 * @description Este módulo fornece funções para interagir com a API de exames e sessões de exame.
 * Ele lida com a busca de exames disponíveis, início de sessões de exame, submissão de respostas,
 * obtenção de detalhes da sessão e finalização da sessão.
 */

import { Exam, Question, ExamSession, ExamResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Busca todos os exames disponíveis na API.
 * @returns Uma Promise que resolve para um objeto ApiResponse contendo uma lista de exames ou um erro.
 */
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

/**
 * Inicia uma nova sessão de exame para um dado ID de exame.
 * @param examId O ID do exame para o qual iniciar a sessão.
 * @returns Uma Promise que resolve para um objeto ApiResponse contendo a sessão de exame criada ou um erro.
 */
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

/**
 * Envia a resposta de uma questão para uma sessão de exame específica.
 * @param sessionId O ID da sessão de exame.
 * @param questionId O ID da questão.
 * @param answer A resposta do usuário para a questão.
 * @returns Uma Promise que resolve para um objeto ApiResponse contendo a resposta do exame criada ou um erro.
 */
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

/**
 * Finaliza uma sessão de exame específica.
 * @param sessionId O ID da sessão de exame a ser finalizada.
 * @returns Uma Promise que resolve para um objeto ApiResponse contendo a sessão de exame finalizada ou um erro.
 */
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

/**
 * Busca todas as sessões de exame do usuário atual.
 * @returns Uma Promise que resolve para um objeto ApiResponse contendo uma lista de sessões de exame ou um erro.
 */
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