// frontend/src/app/components/QuestionDisplay.tsx

import React from 'react';

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

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, onAnswerChange, currentAnswer }) => {
  const handleSingleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAnswerChange(question.id, e.target.value);
  };

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