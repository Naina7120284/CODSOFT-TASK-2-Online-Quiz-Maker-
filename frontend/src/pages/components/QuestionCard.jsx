import React from 'react';

const QuestionCard = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  selectedOption, 
  onOptionSelect 
}) => {
  if (!question) return null;

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-6">
        {question.questionText}
      </h3>

      <div className="grid gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onOptionSelect(index)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center ${
              selectedOption === index
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold shadow-sm'
                : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 border ${
              selectedOption === index 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}>
              {String.fromCharCode(65 + index)} 
            </span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;