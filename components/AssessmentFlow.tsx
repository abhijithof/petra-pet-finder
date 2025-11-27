import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'phosphor-react';
import { QUICK_ASSESSMENT_QUESTIONS, CONDITIONAL_PET_QUESTIONS } from '../data/assessmentQuestions';

interface AssessmentFlowProps {
  onComplete: (results: any) => void;
  onBack: () => void;
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ onComplete, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [conditionalQuestions, setConditionalQuestions] = useState<any[]>([]);
  const [allQuestions, setAllQuestions] = useState(QUICK_ASSESSMENT_QUESTIONS);

  // Calculate total questions including conditionals
  useEffect(() => {
    const baseQuestions = [...QUICK_ASSESSMENT_QUESTIONS];
    const petTypes = answers.consideringPetTypes || [];
    
    // Find index of "consideringPetTypes" question
    const petTypeQuestionIndex = baseQuestions.findIndex(q => q.key === 'consideringPetTypes');
    
    if (petTypeQuestionIndex >= 0 && petTypes.length > 0) {
      // Insert conditional questions right after pet type question
      let additionalQuestions: any[] = [];
      
      petTypes.forEach((petType: string) => {
        const questions = CONDITIONAL_PET_QUESTIONS[petType as keyof typeof CONDITIONAL_PET_QUESTIONS];
        if (questions) {
          questions.forEach((q: any) => {
            additionalQuestions.push({
              ...q,
              section: 'pet-specific',
              petType: petType,
            });
          });
        }
      });

      setConditionalQuestions(additionalQuestions);
      
      // Insert conditional questions after pet type question
      const newQuestions = [
        ...baseQuestions.slice(0, petTypeQuestionIndex + 1),
        ...additionalQuestions,
        ...baseQuestions.slice(petTypeQuestionIndex + 1),
      ];
      
      setAllQuestions(newQuestions);
    } else {
      setConditionalQuestions([]);
      setAllQuestions(baseQuestions);
    }
  }, [answers.consideringPetTypes]);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

  const handleAnswer = (value: string | string[] | boolean) => {
    let newAnswers = { ...answers };
    
    // Handle pet-specific answers
    const questionWithPetType = currentQuestion as any;
    if (questionWithPetType.petType) {
      if (!newAnswers.petSpecificAnswers) {
        newAnswers.petSpecificAnswers = {};
      }
      if (!newAnswers.petSpecificAnswers[questionWithPetType.petType]) {
        newAnswers.petSpecificAnswers[questionWithPetType.petType] = {};
      }
      newAnswers.petSpecificAnswers[questionWithPetType.petType][currentQuestion.key] = value;
    } else {
      newAnswers[currentQuestion.key] = value;
    }
    
    setAnswers(newAnswers);

    // Auto-advance for single-select questions
    if (currentQuestion.type === 'single-select' || currentQuestion.type === 'boolean') {
      setTimeout(() => {
        if (currentQuestionIndex < allQuestions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          handleComplete(newAnswers);
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      onBack();
    }
  };

  const handleComplete = async (finalAnswers: Record<string, any>) => {
    // Calculate readiness score
    const score = calculateReadinessScore(finalAnswers);
    
    // Get recommendations
    const recommendations = await getRecommendations(finalAnswers);
    
    onComplete({
      answers: finalAnswers,
      score,
      recommendations,
    });
  };

  const calculateReadinessScore = (ans: Record<string, any>): number => {
    let score = 0;
    let maxScore = 0;

    // Home suitability (25 points)
    maxScore += 25;
    if (ans.homeType === 'independent-house' || ans.homeType === 'farmhouse') score += 10;
    if (ans.outdoorAccess && ans.outdoorAccess.length > 0 && !ans.outdoorAccess.includes('none')) score += 10;
    if (ans.hoursEmpty === '0-2' || ans.hoursEmpty === '3-5') score += 5;

    // Lifestyle fit (25 points)
    maxScore += 25;
    if (ans.dailyTimeAvailable === '1-2' || ans.dailyTimeAvailable === '2+') score += 10;
    if (ans.travelFrequency === 'rarely' || ans.travelFrequency === 'monthly') score += 10;
    if (ans.experienceLevel === 'some-experience' || ans.experienceLevel === 'very-experienced') score += 5;

    // Practical readiness (25 points)
    maxScore += 25;
    if (ans.monthlyBudget === '3k-6k' || ans.monthlyBudget === '6k+') score += 10;
    if (ans.familySupport === 'yes' || ans.familySupport === true) score += 10;
    if (ans.hasAllergies === 'no' || ans.hasAllergies === false) score += 5;

    // Pet-specific readiness (25 points)
    maxScore += 25;
    const petTypes = ans.consideringPetTypes || [];
    if (petTypes.length > 0) {
      score += 10; // Has preferences
      if (ans.petSpecificAnswers) {
        // Check dog-specific
        if (petTypes.includes('dog') && ans.petSpecificAnswers.dogs?.safeWalking) score += 5;
        if (petTypes.includes('cat') && ans.petSpecificAnswers.cats?.securedSpaces) score += 5;
        if (petTypes.includes('bird') && ans.petSpecificAnswers.birds?.noiseOk) score += 5;
      }
    }

    return Math.round((score / maxScore) * 100);
  };

  const getRecommendations = async (ans: Record<string, any>) => {
    try {
      const response = await fetch('/api/recommend-breeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            situation: 'thinking',
            experienceLevel: ans.experienceLevel || 'first-time',
            concern: ans.lookingFor?.join(',') || 'basic-care',
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.recommendations || [];
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
    }
    return [];
  };

  const getScoreLevel = (score: number): { level: string; color: string; message: string } => {
    if (score >= 80) return { level: 'Highly Ready', color: 'green', message: 'You\'re well-prepared!' };
    if (score >= 60) return { level: 'Ready', color: 'blue', message: 'You\'re ready to welcome a pet!' };
    if (score >= 40) return { level: 'Needs Preparation', color: 'yellow', message: 'A few adjustments needed' };
    return { level: 'Not Ready', color: 'red', message: 'More preparation recommended' };
  };

  const isSelected = (value: string) => {
    let answer;
    const questionWithPetType = currentQuestion as any;
    if (questionWithPetType.petType) {
      answer = answers.petSpecificAnswers?.[questionWithPetType.petType]?.[currentQuestion.key];
    } else {
      answer = answers[currentQuestion.key];
    }
    
    if (Array.isArray(answer)) {
      return answer.includes(value);
    }
    return answer === value;
  };

  const canProceed = () => {
    let answer;
    const questionWithPetType = currentQuestion as any;
    if (questionWithPetType.petType) {
      answer = answers.petSpecificAnswers?.[questionWithPetType.petType]?.[currentQuestion.key];
    } else {
      answer = answers[currentQuestion.key];
    }
    
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    if (typeof answer === 'boolean') {
      return true;
    }
    return answer !== undefined && answer !== '';
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestionIndex + 1} of {allQuestions.length}
          </span>
          <span className="text-sm font-medium text-[#30358B]">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-[#30358B] to-[#FFD447] h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-gray-200 shadow-lg mb-8">
        <div className="mb-8">
          <div className="inline-block px-4 py-2 bg-[#30358B]/10 text-[#30358B] text-sm font-semibold rounded-full mb-4">
            {currentQuestion.section?.toUpperCase() || 'ASSESSMENT'}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {currentQuestion.question}
          </h2>
          {currentQuestion.subtitle && (
            <p className="text-lg text-gray-600">{currentQuestion.subtitle}</p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-4">
          {currentQuestion.options.map((option: any) => {
            const selected = isSelected(option.value);
            const isMultiSelect = currentQuestion.type === 'multi-select';

            return (
              <button
                key={option.value}
                onClick={() => {
                  if (isMultiSelect) {
                    const current = answers[currentQuestion.key] || [];
                    const newValue = Array.isArray(current) ? current : [];
                    if (selected) {
                      handleAnswer(newValue.filter((v: string) => v !== option.value));
                    } else {
                      handleAnswer([...newValue, option.value]);
                    }
                  } else {
                    handleAnswer(option.value);
                  }
                }}
                className={`
                  w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left
                  ${
                    selected
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
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {option.label}
                    </h3>
                    {option.description && (
                      <p className="text-sm text-gray-600">{option.description}</p>
                    )}
                  </div>
                  <div
                    className={`
                      w-6 h-6 ${isMultiSelect ? 'rounded-md' : 'rounded-full'} border-2 flex-shrink-0 flex items-center justify-center transition-all
                      ${
                        selected
                          ? 'border-[#30358B] bg-[#30358B]'
                          : 'border-gray-300'
                      }
                    `}
                  >
                    {selected && (
                      <CheckCircle size={16} weight="fill" className="text-white" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
        >
          <ArrowLeft size={20} />
          <span>{currentQuestionIndex === 0 ? 'Back to Options' : 'Previous'}</span>
        </button>

        {(currentQuestion.type === 'multi-select' || currentQuestion.type === 'single-select') && (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#30358B] to-[#30358B] text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
          >
            <span>{currentQuestionIndex === allQuestions.length - 1 ? 'Get Results' : 'Next'}</span>
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AssessmentFlow;

