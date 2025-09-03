import { getProva, startTentativa, submitTentativa } from './api';

export function setupTakeExam(element: HTMLElement) {
  element.innerHTML = `
    <div class="container">
      <h1 id="exam-title"></h1>
      <p id="exam-description"></p>
      <div id="exam-questions"></div>
      <button type="button" id="start-exam-button">Start Exam</button>
      <button type="button" id="submit-exam-button" style="display:none;">Submit Exam</button>
      <p id="exam-message" class="message"></p>
    </div>
  `;

  const examTitle = element.querySelector<HTMLHeadingElement>('#exam-title');
  const examDescription = element.querySelector<HTMLParagraphElement>('#exam-description');
  const examQuestions = element.querySelector<HTMLDivElement>('#exam-questions');
  const startExamButton = element.querySelector<HTMLButtonElement>('#start-exam-button');
  const submitExamButton = element.querySelector<HTMLButtonElement>('#submit-exam-button');
  const examMessage = element.querySelector<HTMLParagraphElement>('#exam-message');

  let provaId: number | null = null;
  let tentativaId: number | null = null;

  const loadExam = async () => {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    provaId = parseInt(urlParams.get('id') || '');

    if (!provaId) {
      if (examMessage) examMessage.textContent = 'Exam ID not found in URL.';
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        if (examMessage) examMessage.textContent = 'Authentication token not found. Please log in.';
        return;
      }

      const prova = await getProva(token, provaId);
      if (prova) {
        if (examTitle) examTitle.textContent = prova.titulo;
        if (examDescription) examDescription.textContent = prova.descricao || '';
        examQuestions!.innerHTML = ''; // Clear previous questions

        prova.questoes.forEach((question: any, index: number) => {
          const questionDiv = document.createElement('div');
          questionDiv.classList.add('question-block');
          questionDiv.innerHTML = `
            <h3>Question ${index + 1}: ${question.texto}</h3>
            <div class="answer-input" data-question-id="${question.id}" data-question-type="${question.tipo}">
              ${renderQuestionInput(question)}
            </div>
          `;
          examQuestions?.appendChild(questionDiv);
        });

        startExamButton!.style.display = 'block';
        submitExamButton!.style.display = 'none';
      } else {
        if (examMessage) examMessage.textContent = 'Exam not found.';
      }
    } catch (error: any) {
      if (examMessage) examMessage.textContent = `Error loading exam: ${error.response?.data?.detail || error.message}`;
    }
  };

  const renderQuestionInput = (question: any) => {
    switch (question.tipo) {
      case 'multiple_choice':
        return question.opcoes.map((option: string) => `
          <label>
            <input type="radio" name="question-${question.id}" value="${option}" />
            ${option}
          </label>
        `).join('');
      case 'true_false':
        return `
          <label><input type="radio" name="question-${question.id}" value="True" /> True</label>
          <label><input type="radio" name="question-${question.id}" value="False" /> False</label>
        `;
      case 'essay':
        return `<textarea class="essay-answer" placeholder="Your answer"></textarea>`;
      default:
        return '';
    }
  };

  startExamButton?.addEventListener('click', async () => {
    if (!provaId) return;

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        if (examMessage) examMessage.textContent = 'Authentication token not found. Please log in.';
        return;
      }

      const tentativa = await startTentativa(token, provaId);
      if (tentativa) {
        tentativaId = tentativa.id;
        if (examMessage) examMessage.textContent = 'Exam started!';
        startExamButton!.style.display = 'none';
        submitExamButton!.style.display = 'block';
        // Enable inputs
        examQuestions?.querySelectorAll('input, textarea').forEach(input => (input as HTMLInputElement | HTMLTextAreaElement).disabled = false);
      } else {
        if (examMessage) examMessage.textContent = 'Failed to start exam.';
      }
    } catch (error: any) {
      if (examMessage) examMessage.textContent = `Error starting exam: ${error.response?.data?.detail || error.message}`;
    }
  });

  submitExamButton?.addEventListener('click', async () => {
    if (!provaId || !tentativaId) return;

    const respostas: { questao_id: number; resposta: string }[] = [];
    examQuestions?.querySelectorAll('.answer-input').forEach(answerInputDiv => {
      const questionId = parseInt(answerInputDiv.getAttribute('data-question-id') || '');
      const questionType = answerInputDiv.getAttribute('data-question-type');
      let resposta = '';

      if (questionType === 'multiple_choice' || questionType === 'true_false') {
        const selectedOption = answerInputDiv.querySelector<HTMLInputElement>('input[type="radio"]:checked');
        if (selectedOption) {
          resposta = selectedOption.value;
        }
      } else if (questionType === 'essay') {
        const essayAnswer = answerInputDiv.querySelector<HTMLTextAreaElement>('.essay-answer');
        if (essayAnswer) {
          resposta = essayAnswer.value;
        }
      }
      respostas.push({ questao_id: questionId, resposta: resposta });
    });

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        if (examMessage) examMessage.textContent = 'Authentication token not found. Please log in.';
        return;
      }

      const submissionResult = await submitTentativa(token, tentativaId, { respostas: respostas });
      if (submissionResult) {
        if (examMessage) examMessage.textContent = 'Exam submitted successfully! Score: ' + submissionResult.pontuacao;
        submitExamButton!.style.display = 'none';
        // Disable inputs after submission
        examQuestions?.querySelectorAll('input, textarea').forEach(input => (input as HTMLInputElement | HTMLTextAreaElement).disabled = true);
      } else {
        if (examMessage) examMessage.textContent = 'Failed to submit exam.';
      }
    } catch (error: any) {
      if (examMessage) examMessage.textContent = `Error submitting exam: ${error.response?.data?.detail || error.message}`;
    }
  });

  loadExam();
}