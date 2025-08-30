'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setupSecurityMonitoring } from '../../../utils/securityMonitor';
import { endExamSession } from '../api/examService';
import { ExamResponse } from '@/types';
import QuestionDisplay from '../components/QuestionDisplay';
import ExamHeader from '@/app/components/exam/ExamHeader';
import ExamProgress from '@/app/components/exam/ExamProgress';
import ExamNavigation from '@/app/components/exam/ExamNavigation';
import ExamContainer from '@/app/components/exam/ExamContainer';
import { useExamSession } from '@/hooks/useExamSession';
import { useExamAnswers, clearExpiredExamData } from '@/hooks/useExamAnswers';
import { useExamSubmission } from '@/hooks/useExamSubmission';
import { useExamNavigation } from '@/hooks/useExamNavigation';
import ExamLoading from '@/app/components/exam/ExamLoading';
import ExamError from '@/app/components/exam/ExamError';
import ExamFinished from '@/app/components/exam/ExamFinished';


const ExamPage = () => {
    const router = useRouter();
    const { questions, examSession, isLoading, error, setExamSession } = useExamSession();
    const [examFinished, setExamFinished] = useState(false);
    const { answers, handleAnswerChange, setAnswers } = useExamAnswers(examSession, examFinished);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { isSubmitting, error: submitError, confirmSubmit } = useExamSubmission(examSession, setExamFinished, setAnswers);
    const { currentQuestionIndex, handleNextQuestion, handlePreviousQuestion } = useExamNavigation(questions, examFinished, confirmSubmit, answers);



    const handleSubmitClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    confirmSubmit(answers);
  };

  const handleTimeUp = async () => {
    console.log('Tempo esgotado! Respostas:', answers);
    await confirmSubmit(answers);
  };

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (examFinished && examSession) {
      const timer = setTimeout(() => {
        router.push(`/results/${examSession.id}`);
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [examFinished, examSession, router]);

  useEffect(() => {
    setupSecurityMonitoring();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!examFinished) {
        event.preventDefault();
        event.returnValue = ''; // Required for Chrome
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [examFinished]);



  if (isLoading) {
    return <ExamLoading />;
  }

  if (error || submitError) {
    return <ExamError message={error || submitError} />;
  }

  if (examFinished) {
    return <ExamFinished isSubmitting={isSubmitting} submitError={submitError} />;
  }

  if (!questions.length || !examSession || !currentQuestion) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Nenhum exame disponível, sessão não iniciada ou questão inválida.</h1>
      </main>
    );
  }

  return (
    <>
      <ExamContainer>
      <ExamHeader
        examTitle="Exame SOWA"
        durationInMinutes={examSession?.duration}
        onTimeUp={handleTimeUp}
      />
      <ExamProgress
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
      />

      <div className="w-full max-w-2xl">
        <QuestionDisplay
          question={currentQuestion}
          onAnswerChange={handleAnswerChange}
          currentAnswer={answers[currentQuestion.id] || (['multiple_choice', 'multiple_selection'].includes(currentQuestion.type) ? [] : '')}
        />

        <ExamNavigation
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          isSubmitting={isSubmitting}
          handlePreviousQuestion={handlePreviousQuestion}
          handleNextQuestion={handleNextQuestion}
          handleSubmitClick={handleSubmitClick}
        />
      </div>
    </ExamContainer>

      {showConfirmModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Confirmar Finalização do Exame</h2>
            <p className="mb-2">Tem certeza de que deseja finalizar o exame? Esta ação não pode ser desfeita.</p>
            <div className="mb-6 text-sm text-gray-700">
              <p>Questões Respondidas: {Object.keys(answers).length}</p>
              <p>Questões Não Respondidas: {questions.length - Object.keys(answers).length}</p>
            </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ExamPage;