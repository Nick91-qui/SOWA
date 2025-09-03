import { getTentativaById } from './api';

export function setupViewAttempt(element: HTMLElement) {
  element.innerHTML = `
    <div class="container">
      <h1 id="attempt-title">Attempt Details</h1>
      <p><strong>Prova:</strong> <span id="attempt-prova-title"></span></p>
      <p><strong>Student:</strong> <span id="attempt-student-name"></span></p>
      <p><strong>Score:</strong> <span id="attempt-score"></span></p>
      <div id="attempt-answers"></div>
      <p id="attempt-message" class="message"></p>
    </div>
  `;


  const attemptProvaTitle = element.querySelector<HTMLSpanElement>('#attempt-prova-title');
  const attemptStudentName = element.querySelector<HTMLSpanElement>('#attempt-student-name');
  const attemptScore = element.querySelector<HTMLSpanElement>('#attempt-score');
  const attemptAnswers = element.querySelector<HTMLDivElement>('#attempt-answers');
  const attemptMessage = element.querySelector<HTMLParagraphElement>('#attempt-message');

  const loadAttempt = async () => {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const tentativaId = parseInt(urlParams.get('id') || '');

    if (!tentativaId) {
      if (attemptMessage) attemptMessage.textContent = 'Attempt ID not found in URL.';
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        if (attemptMessage) attemptMessage.textContent = 'Authentication token not found. Please log in.';
        return;
      }

      const attempt = await getTentativaById(token, tentativaId);
      if (attempt) {
        if (attemptProvaTitle) attemptProvaTitle.textContent = attempt.prova.titulo;
        if (attemptStudentName) attemptStudentName.textContent = attempt.aluno.nome;
        if (attemptScore) attemptScore.textContent = attempt.pontuacao !== undefined && attempt.pontuacao !== null ? attempt.pontuacao.toString() : 'N/A';

        attemptAnswers!.innerHTML = '';
        attempt.respostas.forEach((resposta: any, index: number) => {
          const questionDiv = document.createElement('div');
          questionDiv.classList.add('question-block');
          questionDiv.innerHTML = `
            <h3>Question ${index + 1}: ${resposta.questao.texto}</h3>
            <p><strong>Your Answer:</strong> ${resposta.resposta}</p>
            <p><strong>Correct Answer:</strong> ${resposta.questao.resposta_correta || 'N/A'}</p>
            <p><strong>Score:</strong> ${resposta.pontuacao_obtida !== null ? resposta.pontuacao_obtida : 'N/A'}</p>
          `;
          attemptAnswers?.appendChild(questionDiv);
        });
      } else {
        if (attemptMessage) attemptMessage.textContent = 'Attempt not found.';
      }
    } catch (error: any) {
      if (attemptMessage) attemptMessage.textContent = `Error loading attempt: ${error.response?.data?.detail || error.message}`;
    }
  };

  loadAttempt();
}