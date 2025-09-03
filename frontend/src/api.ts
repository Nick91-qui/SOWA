import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function getRootMessage(): Promise<string> {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data.message;
  } catch (error) {
    console.error('Error fetching root message:', error);
    return 'Failed to connect to backend.';
  }
}

export async function loginUser(email: string, password: string): Promise<{ access_token: string; token_type: string, user_type: string } | null> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/token`,
      new URLSearchParams({
        username: email,
        password: password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Re-throw to be handled by the calling component
  }
}

export async function getCurrentUserType(): Promise<string | null> {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return null;
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.tipo; // Assuming the user type is returned as 'tipo'
  } catch (error) {
    console.error('Error fetching user type:', error);
    return null;
  }
}

export async function registerUser(name: string, email: string, password: string, type: string): Promise<any> {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      nome: name,
      email: email,
      senha: password,
      tipo: type,
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error; // Re-throw to be handled by the calling component
  }
}

interface Question {
  texto: string;
  tipo: string;
  resposta_correta?: string;
  opcoes?: string[];
}

interface ProvaCreate {
  titulo: string;
  descricao?: string;
  data_inicio: string;
  data_fim: string;
  questoes: Question[];
  turmas_ids: number[];
}

export async function createProva(token: string, provaData: ProvaCreate): Promise<any> {
  try {
    const response = await axios.post(`${API_BASE_URL}/provas/`, provaData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Create prova error:', error);
    throw error;
  }
}

interface QuestionResponse {
  id: number;
  texto: string;
  tipo: string;
  opcoes?: string[];
}

interface ProvaResponse {
  id: number;
  titulo: string;
  descricao?: string;
  data_inicio: string;
  data_fim: string;
  professor_id: number;
  questoes: QuestionResponse[];
}

export async function getProva(token: string, provaId: number): Promise<ProvaResponse | null> {
  try {
    const response = await axios.get(`${API_BASE_URL}/provas/${provaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get prova error:', error);
    throw error;
  }
}

interface TentativaStartResponse {
  id: number;
  aluno_id: number;
  prova_id: number;
  data_inicio: string;
}

export async function startTentativa(token: string, provaId: number): Promise<TentativaStartResponse | null> {
  try {
    const response = await axios.post(`${API_BASE_URL}/tentativas/start/${provaId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Start tentativa error:', error);
    throw error;
  }
}

interface Resposta {
  questao_id: number;
  resposta: string;
}

interface TentativaSubmit {
  respostas: Resposta[];
}

interface TentativaSubmitResponse {
  id: number;
  pontuacao: number;
  feedback_liberado: boolean;
}

export async function submitTentativa(token: string, tentativaId: number, submission: TentativaSubmit): Promise<TentativaSubmitResponse | null> {
  try {
    const response = await axios.post(`${API_BASE_URL}/tentativas/submit/${tentativaId}`, submission, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Submit tentativa error:', error);
    throw error;
  }
}

interface TentativaResponse {
  id: number;
  aluno_id: number;
  prova_id: number;
  data_inicio: string;
  data_fim?: string;
  pontuacao?: number;
  feedback_liberado: boolean;
  prova: {
    titulo: string;
  };
  aluno: {
    nome: string;
  };
  respostas: {
    questao_id: number;
    resposta: string;
    pontuacao_obtida?: number;
    questao: {


      texto: string;
      resposta_correta?: string;
    };
  }[];
}

export async function getTentativaById(token: string, tentativaId: number): Promise<TentativaResponse | null> {
  try {
    const response = await axios.get(`${API_BASE_URL}/tentativas/${tentativaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get tentativa by ID error:', error);
    throw error;
  }
}

export function logoutUser(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_type');
  window.location.hash = '#login';
}