import { ExamResponse } from '@/types';

const EXAM_ANSWERS_PREFIX = 'examAnswers_';
const EXAM_SESSION_PREFIX = 'examSession_';

/**
 * Salva as respostas de um exame no localStorage.
 * @function saveExamAnswers
 * @param {string} examId - O ID do exame.
 * @param {Record<string, any>} answers - As respostas do exame a serem salvas.
 */
export const saveExamAnswers = (examId: string, answers: Record<string, any>) => {
  try {
    localStorage.setItem(`${EXAM_ANSWERS_PREFIX}${examId}`, JSON.stringify(answers));
  } catch (error) {
    console.error('Erro ao salvar respostas no localStorage:', error);
  }
};

/**
 * Carrega as respostas de um exame do localStorage.
 * @function loadExamAnswers
 * @param {string} examId - O ID do exame.
 * @returns {Record<string, any>} As respostas do exame carregadas ou um objeto vazio se não houver respostas.
 */
export const loadExamAnswers = (examId: string): Record<string, any> => {
  try {
    const storedAnswers = localStorage.getItem(`${EXAM_ANSWERS_PREFIX}${examId}`);
    return storedAnswers ? JSON.parse(storedAnswers) : {};
  } catch (error) {
    console.error('Erro ao carregar respostas do localStorage:', error);
    return {};
  }
};

/**
 * Limpa as respostas de um exame do localStorage.
 * @function clearExamAnswers
 * @param {string} examId - O ID do exame.
 */
export const clearExamAnswers = (examId: string) => {
  try {
    localStorage.removeItem(`${EXAM_ANSWERS_PREFIX}${examId}`);
  } catch (error) {
    console.error('Erro ao limpar respostas do localStorage:', error);
  }
};

/**
 * Salva a sessão de um exame no localStorage.
 * @function saveExamSession
 * @param {ExamResponse} examSession - A sessão do exame a ser salva.
 */
export const saveExamSession = (examSession: ExamResponse) => {
  try {
    localStorage.setItem(`${EXAM_SESSION_PREFIX}${examSession.id}`, JSON.stringify(examSession));
  } catch (error) {
    console.error('Erro ao salvar sessão do exame no localStorage:', error);
  }
};

/**
 * Carrega a sessão de um exame do localStorage.
 * @function loadExamSession
 * @param {string} examId - O ID do exame.
 * @returns {ExamResponse | null} A sessão do exame carregada ou null se não houver sessão.
 */
export const loadExamSession = (examId: string): ExamResponse | null => {
  try {
    const storedSession = localStorage.getItem(`${EXAM_SESSION_PREFIX}${examId}`);
    return storedSession ? JSON.parse(storedSession) : null;
  } catch (error) {
    console.error('Erro ao carregar sessão do exame do localStorage:', error);
    return null;
  }
};

/**
 * Limpa a sessão de um exame do localStorage.
 * @function clearExamSession
 * @param {string} examId - O ID do exame.
 */
export const clearExamSession = (examId: string) => {
  try {
    localStorage.removeItem(`${EXAM_SESSION_PREFIX}${examId}`);
  } catch (error) {
    console.error('Erro ao limpar sessão do exame do localStorage:', error);
  }
};

/**
 * Limpa dados de exames expirados do localStorage.
 * Remove respostas e sessões de exames que excederam 24 horas de armazenamento.
 * @function clearExpiredExamData
 */
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