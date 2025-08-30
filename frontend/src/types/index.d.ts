export interface Exam {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  questions: Question[];
}

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

export interface ExamResponse {
  id: string;
  exam_session_id: string;
  question_id: string;
  answer: string | string[];
  is_correct: boolean | null;
  created_at: string;
}