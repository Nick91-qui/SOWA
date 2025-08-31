// frontend/src/app/components/QuestionDisplay.tsx

import React from 'react';

/**
 * @interface QuestionDisplayProps
 * @description Propriedades para o componente QuestionDisplay.
 * @property {object} question - O objeto da questão a ser exibida.
 * @property {string} question.id - O ID da questão.
 * @property {string} question.text - O texto da questão.
 * @property {string[]} question.options - As opções de resposta para a questão (se aplicável).
 * @property {'single_choice' | 'multiple_choice' | 'multiple_selection' | 'text_input'} question.type - O tipo da questão.
 * @property {(questionId: string, answer: string | string[]) => void} onAnswerChange - Função de callback para lidar com a mudança da resposta.
 * @property {string | string[]} currentAnswer - A resposta atual para a questão.
 */
interface QuestionDisplayProps {
  question: {
    id: string;
    text: string;
    options: string[];
    type: 'single_choice' | 'multiple_choice' | 'multiple_selection' | 'text_input';
  };
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
  currentAnswer: string | string[];
}

/**
 * @component QuestionDisplay
 * @description Componente React para exibir uma questão de exame e permitir que o usuário selecione ou insira uma resposta.
 * Renderiza diferentes tipos de entrada com base no tipo da questão (múltipla escolha, única escolha, texto).
 * @param {QuestionDisplayProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente de exibição da questão.
 */
const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, onAnswerChange, currentAnswer }) => {
  /**
   * @function handleSingleChoiceChange
   * @description Lida com a mudança de seleção para questões de escolha única.
   * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança do input.
   */
  const handleSingleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAnswerChange(question.id, e.target.value);
  };

  /**
   * @function handleMultipleChoiceChange
   * @description Lida com a mudança de seleção para questões de múltipla escolha/seleção.
   * Adiciona ou remove a opção selecionada da lista de respostas.
   * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança do input.
   */
  const handleMultipleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let newAnswer = Array.isArray(currentAnswer) ? [...currentAnswer] : [];

    if (e.target.checked) {
      newAnswer.push(value);
    } else {
      newAnswer = newAnswer.filter((ans) => ans !== value);
    }
    onAnswerChange(question.id, newAnswer);
  };

  /**
   * @function handleTextInputChange
   * @description Lida com a mudança de texto para questões de entrada de texto.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - O evento de mudança da textarea.
   */
  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAnswerChange(question.id, e.target.value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{question.text}</h3>
      <div className="space-y-3">
        {question.type === 'single_choice' && (
          question.options.map((option, index) => (
            <label key={index} className="flex items-center text-gray-700">
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={currentAnswer === option}
                onChange={handleSingleChoiceChange}
                className="mr-2"
              />
              {option}
            </label>
          ))
        )}

        {question.type === 'multiple_choice' && (
          question.options.map((option, index) => (
            <label key={index} className="flex items-center text-gray-700">
              <input
                type="checkbox"
                name={question.id}
                value={option}
                checked={Array.isArray(currentAnswer) && currentAnswer.includes(option)}
                onChange={handleMultipleChoiceChange}
                className="mr-2"
              />
              {option}
            </label>
          ))
        )}

        {question.type === 'text_input' && (
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            value={currentAnswer as string}
            onChange={handleTextInputChange}
            placeholder="Digite sua resposta aqui..."
          />
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;