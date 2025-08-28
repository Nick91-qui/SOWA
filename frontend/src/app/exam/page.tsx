// frontend/src/app/exam/page.tsx

'use client';

import React, { useState } from 'react';
import QuestionDisplay from '../components/QuestionDisplay';
import ExamTimer from '../components/ExamTimer';

const mockQuestions = [
  {
    id: 'q1',
    text: 'Qual é a capital do Brasil?',
    options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Belo Horizonte'],
    type: 'single_choice',
  },
  {
    id: 'q2',
    text: 'Quais destes são frameworks JavaScript?',
    options: ['React', 'Angular', 'Vue', 'Python'],
    type: 'multiple_choice',
  },
  {
    id: 'q3',
    text: 'Descreva o conceito de inteligência artificial.',
    options: [],
    type: 'text_input',
  },
];

const ExamPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [examFinished, setExamFinished] = useState(false);

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setExamFinished(true);
      submitExam();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitExam = async () => {
    setExamFinished(true);
    console.log('Exame finalizado! Respostas:', answers);
    // TODO: Enviar respostas para o backend
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/exam/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Adicionar token de autenticação se necessário
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Erro ao submeter o exame');
      }

      const data = await response.json();
      console.log('Exame submetido com sucesso:', data);
      // TODO: Redirecionar para a página de resultados com base na resposta do backend

    } catch (err: any) {
      console.error('Erro na submissão do exame:', err.message);
      // Tratar erro, talvez exibir uma mensagem para o usuário
    }
  };

  const handleTimeUp = async () => {
    console.log('Tempo esgotado! Respostas:', answers);
    await submitExam();
  };

  const currentQuestion = mockQuestions[currentQuestionIndex];

  if (examFinished) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Exame Concluído!</h1>
        <p className="text-lg text-gray-700">Suas respostas foram registradas. Redirecionando para os resultados...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Exame SOWA</h1>
      <ExamTimer durationInMinutes={1} onTimeUp={handleTimeUp} />

      <div className="w-full max-w-2xl">
        <QuestionDisplay
          question={currentQuestion as { id: string; text: string; options: string[]; type: "single_choice" | "multiple_choice" | "text_input" }}
          onAnswerChange={handleAnswerChange}
          currentAnswer={answers[currentQuestion.id] || (currentQuestion.type === 'multiple_choice' ? [] : '')}
        />

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            onClick={handleNextQuestion}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {currentQuestionIndex === mockQuestions.length - 1 ? 'Finalizar Exame' : 'Próxima'}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ExamPage;