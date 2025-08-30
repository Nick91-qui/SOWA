import { ExamResponse } from '@/types';

const EXAM_ANSWERS_PREFIX = 'examAnswers_';
const EXAM_SESSION_PREFIX = 'examSession_';

export const saveExamAnswers = (examId: string, answers: Record<string, any>) => {
  try {
    localStorage.setItem(`${EXAM_ANSWERS_PREFIX}${examId}`, JSON.stringify(answers));
  } catch (error) {
    console.error('Erro ao salvar respostas no localStorage:', error);
  }
};

export const loadExamAnswers = (examId: string): Record<string, any> => {
  try {
    const storedAnswers = localStorage.getItem(`${EXAM_ANSWERS_PREFIX}${examId}`);
    return storedAnswers ? JSON.parse(storedAnswers) : {};
  } catch (error) {
    console.error('Erro ao carregar respostas do localStorage:', error);
    return {};
  }
};

export const clearExamAnswers = (examId: string) => {
  try {
    localStorage.removeItem(`${EXAM_ANSWERS_PREFIX}${examId}`);
  } catch (error) {
    console.error('Erro ao limpar respostas do localStorage:', error);
  }
};

export const saveExamSession = (examSession: ExamResponse) => {
  try {
    localStorage.setItem(`${EXAM_SESSION_PREFIX}${examSession.id}`, JSON.stringify(examSession));
  } catch (error) {
    console.error('Erro ao salvar sessão do exame no localStorage:', error);
  }
};

export const loadExamSession = (examId: string): ExamResponse | null => {
  try {
    const storedSession = localStorage.getItem(`${EXAM_SESSION_PREFIX}${examId}`);
    return storedSession ? JSON.parse(storedSession) : null;
  } catch (error) {
    console.error('Erro ao carregar sessão do exame do localStorage:', error);
    return null;
  }
};

export const clearExamSession = (examId: string) => {
  try {
    localStorage.removeItem(`${EXAM_SESSION_PREFIX}${examId}`);
  } catch (error) {
    console.error('Erro ao limpar sessão do exame do localStorage:', error);
  }
};

export const clearExpiredExamData = () => {
  const now = new Date().getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith(EXAM_ANSWERS_PREFIX) || key.startsWith(EXAM_SESSION_PREFIX))) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsedItem = JSON.parse(item);
          // Verifica se o item tem uma propriedade 'timestamp' ou 'startTime' para expiração
          // Para respostas, podemos usar a data de modificação ou a data da sessão
          // Para a sessão, podemos usar o startTime
          const itemTimestamp = parsedItem.startTime || parsedItem.timestamp; // Assumindo que a sessão tem startTime

          if (itemTimestamp && (now - itemTimestamp > twentyFourHours)) {
            console.log(`Removendo item expirado do localStorage: ${key}`);
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.error(`Erro ao analisar ou remover item do localStorage com a chave ${key}:`, error);
        // Se houver um erro ao analisar, remove o item para evitar problemas futuros
        localStorage.removeItem(key);
      }
    }
  }
};