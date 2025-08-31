/**
 * @interface Exam
 * @description Representa a estrutura de um exame.
 * @property {string} id - O identificador único do exame.
 * @property {string} title - O título do exame.
 * @property {string} description - A descrição do exame.
 * @property {string} owner_id - O identificador do proprietário (criador) do exame.
 * @property {string} created_at - A data e hora de criação do exame.
 * @property {string} updated_at - A data e hora da última atualização do exame.
 * @property {Question[]} questions - Um array de questões associadas a este exame.
 */
export interface Exam {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  questions: Question[];
}

/**
 * @interface Question
 * @description Representa a estrutura de uma questão de exame.
 * @property {string} id - O identificador único da questão.
 * @property {string} exam_id - O identificador do exame ao qual esta questão pertence.
 * @property {string} text - O texto da questão.
 * @property {'single_choice' | 'multiple_choice' | 'multiple_selection' | 'text_input'} type - O tipo da questão (e.g., 'single_choice', 'multiple_choice').
 * @property {string[]} options - Um array de opções de resposta para a questão (se aplicável).
 * @property {string | string[]} correct_answer - A resposta correta para a questão. Pode ser uma string ou um array de strings.
 * @property {string} created_at - A data e hora de criação da questão.
 * @property {string} updated_at - A data e hora da última atualização da questão.
 */
export interface Question {
  id: string;
  exam_id: string;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'multiple_selection' | 'text_input';
  options: string[];
  correct_answer: string | string[];
  created_at: string;
  updated_at: string;
}

/**
 * @interface ExamSession
 * @description Representa a estrutura de uma sessão de exame de um usuário.
 * @property {string} id - O identificador único da sessão de exame.
 * @property {string} exam_id - O identificador do exame associado a esta sessão.
 * @property {string} user_id - O identificador do usuário que está realizando o exame.
 * @property {string} start_time - A data e hora de início da sessão do exame.
 * @property {string | null} end_time - A data e hora de término da sessão do exame, ou null se ainda não terminou.
 * @property {number | null} score - A pontuação obtida na sessão do exame, ou null se ainda não foi avaliado.
 * @property {string} status - O status atual da sessão do exame (e.g., 'in_progress', 'completed').
 * @property {number} duration - A duração do exame em minutos.
 * @property {ExamResponse[]} responses - Um array de respostas do usuário para as questões do exame.
 */
export interface ExamSession {
  id: string;
  exam_id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  score: number | null;
  status: string;
  duration: number; // in minutes
  responses: ExamResponse[];
}

/**
 * @interface ExamResponse
 * @description Representa a estrutura da resposta de um usuário a uma questão específica dentro de uma sessão de exame.
 * @property {string} id - O identificador único da resposta.
 * @property {string} exam_session_id - O identificador da sessão de exame à qual esta resposta pertence.
 * @property {string} question_id - O identificador da questão à qual esta resposta se refere.
 * @property {string | string[]} answer - A resposta fornecida pelo usuário. Pode ser uma string ou um array de strings.
 * @property {boolean | null} is_correct - Indica se a resposta está correta, ou null se ainda não foi avaliada.
 * @property {string} created_at - A data e hora em que a resposta foi registrada.
 */
export interface ExamResponse {
  id: string;
  exam_session_id: string;
  question_id: string;
  answer: string | string[];
  is_correct: boolean | null;
  created_at: string;
}