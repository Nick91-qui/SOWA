import { createProva } from './api';

export function setupCreateExam(element: HTMLElement) {
  element.innerHTML = `
    <div class="container">
      <h1>Create New Exam</h1>
      <form id="create-exam-form">
        <input type="text" id="exam-title" placeholder="Exam Title" required />
        <textarea id="exam-description" placeholder="Exam Description"></textarea>
        <input type="datetime-local" id="exam-start-date" required />
        <input type="datetime-local" id="exam-end-date" required />
        <div id="questions-container">
          <h2>Questions</h2>
          <button type="button" id="add-question">Add Question</button>
        </div>
        <button type="submit">Create Exam</button>
      </form>
      <p id="create-exam-message" class="message"></p>
    </div>
  `;

  const createExamForm = element.querySelector<HTMLFormElement>('#create-exam-form');
  const addQuestionButton = element.querySelector<HTMLButtonElement>('#add-question');
  const questionsContainer = element.querySelector<HTMLDivElement>('#questions-container');
  const createExamMessage = element.querySelector<HTMLParagraphElement>('#create-exam-message');

  let questionCount = 0;

  const addQuestion = () => {
    questionCount++;
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question-block');
    questionDiv.innerHTML = `
      <h3>Question ${questionCount}</h3>
      <input type="text" class="question-text" placeholder="Question Text" required />
      <select class="question-type">
        <option value="multiple_choice">Multiple Choice</option>
        <option value="true_false">True/False</option>
        <option value="essay">Essay</option>
      </select>
      <div class="options-container">
        <h4>Options (for Multiple Choice/True False)</h4>
        <button type="button" class="add-option">Add Option</button>
      </div>
      <input type="text" class="correct-answer" placeholder="Correct Answer (for Multiple Choice/True False)" />
    `;
    questionsContainer?.insertBefore(questionDiv, addQuestionButton);

    const addOptionButton = questionDiv.querySelector<HTMLButtonElement>('.add-option');
    const optionsContainer = questionDiv.querySelector<HTMLDivElement>('.options-container');
    let optionCount = 0;

    addOptionButton?.addEventListener('click', () => {
      optionCount++;
      const optionInput = document.createElement('input');
      optionInput.type = 'text';
      optionInput.classList.add('option-text');
      optionInput.placeholder = `Option ${optionCount}`;
      optionsContainer?.appendChild(optionInput);
    });

    const questionTypeSelect = questionDiv.querySelector<HTMLSelectElement>('.question-type');
    questionTypeSelect?.addEventListener('change', () => {
      const selectedType = questionTypeSelect.value;
      if (selectedType === 'multiple_choice' || selectedType === 'true_false') {
        if (optionsContainer) optionsContainer.style.display = 'block';
        const correctAnswerInput = questionDiv.querySelector<HTMLInputElement>('.correct-answer');
        if (correctAnswerInput) correctAnswerInput.style.display = 'block';
      } else {
        if (optionsContainer) optionsContainer.style.display = 'none';
        const correctAnswerInput = questionDiv.querySelector<HTMLInputElement>('.correct-answer');
        if (correctAnswerInput) correctAnswerInput.style.display = 'none';
      }
    });
  };

  addQuestionButton?.addEventListener('click', addQuestion);

  createExamForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = (element.querySelector<HTMLInputElement>('#exam-title') as HTMLInputElement).value;
    const description = (element.querySelector<HTMLTextAreaElement>('#exam-description') as HTMLTextAreaElement).value;
    const startDate = (element.querySelector<HTMLInputElement>('#exam-start-date') as HTMLInputElement).value;
    const endDate = (element.querySelector<HTMLInputElement>('#exam-end-date') as HTMLInputElement).value;

    const questions: any[] = [];
    element.querySelectorAll('.question-block').forEach(qBlock => {
      const questionText = (qBlock.querySelector<HTMLInputElement>('.question-text') as HTMLInputElement).value;
      const questionType = (qBlock.querySelector<HTMLSelectElement>('.question-type') as HTMLSelectElement).value;
      const correctAnswer = (qBlock.querySelector<HTMLInputElement>('.correct-answer') as HTMLInputElement).value;
      const options: string[] = [];
      qBlock.querySelectorAll('.option-text').forEach(optionInput => {
        options.push((optionInput as HTMLInputElement).value);
      });

      questions.push({
        texto: questionText,
        tipo: questionType,
        resposta_correta: correctAnswer,
        opcoes: options,
      });
    });

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        if (createExamMessage) createExamMessage.textContent = 'Authentication token not found. Please log in.';
        return;
      }

      const newExam = await createProva(token, {
        titulo: title,
        descricao: description,
        data_inicio: startDate,
        data_fim: endDate,
        questoes: questions,
        turmas_ids: [] // Assuming classes will be added later or via another interface
      });

      if (newExam) {
        if (createExamMessage) createExamMessage.textContent = 'Exam created successfully!';
        createExamForm.reset();
        questionsContainer!.innerHTML = `<h2>Questions</h2><button type="button" id="add-question">Add Question</button>`;
        questionCount = 0;
        const newAddQuestionButton = questionsContainer?.querySelector<HTMLButtonElement>('#add-question');
        newAddQuestionButton?.addEventListener('click', addQuestion);
      } else {
        if (createExamMessage) createExamMessage.textContent = 'Failed to create exam.';
      }
    } catch (error: any) {
      if (createExamMessage) createExamMessage.textContent = `Error: ${error.response?.data?.detail || error.message}`;
    }
  });
}