import React from 'react';

interface QuizOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

interface QuizQuestionCardProps {
  question: string;
  options: QuizOption[];
  selectedValue: string | string[];
  onSelect: (value: string) => void;
  questionNumber: number;
  totalQuestions: number;
  multiSelect?: boolean;
}

const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  question,
  options,
  selectedValue,
  onSelect,
  questionNumber,
  totalQuestions,
  multiSelect = false,
}) => {
  const isSelected = (value: string) => {
    if (Array.isArray(selectedValue)) {
      return selectedValue.includes(value);
    }
    return selectedValue === value;
  };
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-[#30358B]">
            {Math.round((questionNumber / totalQuestions) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#30358B] to-[#FFD447] h-2 rounded-full transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8 animate-fadeIn">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-2">
          {question}
        </h2>
        <p className="text-center text-gray-600">
          {multiSelect ? 'Select all that apply' : 'Select the option that best describes you'}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`
              p-6 rounded-2xl border-2 transition-all duration-300 text-left
              ${
                isSelected(option.value)
                  ? 'border-[#30358B] bg-[#30358B]/5 shadow-lg transform scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-[#30358B]/40 hover:shadow-md hover:transform hover:scale-[1.01]'
              }
            `}
          >
            <div className="flex items-start space-x-4">
              {option.icon && (
                <span className="text-3xl flex-shrink-0">{option.icon}</span>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {option.label}
                </h3>
                {option.description && (
                  <p className="text-sm text-gray-600">{option.description}</p>
                )}
              </div>
              <div
                className={`
                  w-6 h-6 ${multiSelect ? 'rounded-md' : 'rounded-full'} border-2 flex-shrink-0 flex items-center justify-center transition-all
                  ${
                    isSelected(option.value)
                      ? 'border-[#30358B] bg-[#30358B]'
                      : 'border-gray-300'
                  }
                `}
              >
                {isSelected(option.value) && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QuizQuestionCard;

