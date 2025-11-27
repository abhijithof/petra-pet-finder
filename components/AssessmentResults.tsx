import React from 'react';
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Sparkle } from 'phosphor-react';

interface AssessmentResultsProps {
  score: number;
  recommendations: any[];
  answers: Record<string, any>;
  onStartOver: () => void;
  onSelectBreed: (breed: string) => void;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  score,
  recommendations,
  answers,
  onStartOver,
  onSelectBreed,
}) => {
  const getScoreLevel = (score: number) => {
    if (score >= 80) {
      return {
        level: 'Highly Ready',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-500',
        icon: CheckCircle,
        message: "You're exceptionally well-prepared! 🎉",
        description: 'You have the perfect setup and lifestyle for pet ownership.',
      };
    }
    if (score >= 60) {
      return {
        level: 'Ready',
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-500',
        icon: CheckCircle,
        message: "You're ready to welcome a pet! 🐾",
        description: 'You have good preparation and can start looking for your perfect companion.',
      };
    }
    if (score >= 40) {
      return {
        level: 'Needs Preparation',
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-500',
        icon: AlertCircle,
        message: 'A few adjustments needed ⚠️',
        description: 'Make some changes to your setup or lifestyle before getting a pet.',
      };
    }
    return {
      level: 'Not Ready',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-500',
      icon: XCircle,
      message: 'More preparation recommended 🛑',
      description: 'Consider waiting until your situation is more suitable for pet ownership.',
    };
  };

  const scoreInfo = getScoreLevel(score);
  const Icon = scoreInfo.icon;

  const getChecklist = () => {
    const checklist: Array<{ task: string; priority: 'high' | 'medium' | 'low'; completed: boolean }> = [];

    // Home preparation
    if (!answers.outdoorAccess || answers.outdoorAccess.includes('none')) {
      checklist.push({ task: 'Set up safe indoor space for pet', priority: 'high', completed: false });
    }
    if (answers.hoursEmpty === '9+') {
      checklist.push({ task: 'Arrange pet care for long absences', priority: 'high', completed: false });
    }

    // Pet-specific
    const petTypes = answers.consideringPetTypes || [];
    if (petTypes.includes('dog')) {
      if (!answers.petSpecificAnswers?.dogs?.safeWalking) {
        checklist.push({ task: 'Find safe walking routes near home', priority: 'high', completed: false });
      }
      checklist.push({ task: 'Get dog essentials (leash, collar, bowls, bed)', priority: 'high', completed: false });
    }
    if (petTypes.includes('cat')) {
      if (!answers.petSpecificAnswers?.cats?.securedSpaces) {
        checklist.push({ task: 'Secure windows and balconies', priority: 'high', completed: false });
      }
      checklist.push({ task: 'Set up litter box area', priority: 'high', completed: false });
    }
    if (petTypes.includes('bird')) {
      checklist.push({ task: 'Set up cage in safe, ventilated area', priority: 'high', completed: false });
    }
    if (petTypes.includes('fish')) {
      checklist.push({ task: 'Set up aquarium with filter and heater', priority: 'high', completed: false });
    }

    // Budget
    if (answers.monthlyBudget === 'up-to-1k') {
      checklist.push({ task: 'Plan for unexpected vet expenses', priority: 'medium', completed: false });
    }

    // Family
    if (answers.hasAllergies === 'yes' || answers.hasAllergies === true) {
      checklist.push({ task: 'Consult doctor about pet allergies', priority: 'high', completed: false });
    }

    return checklist;
  };

  const checklist = getChecklist();

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      {/* Score Card */}
      <div className={`bg-white rounded-3xl p-8 md:p-12 border-4 ${scoreInfo.borderColor} shadow-xl mb-8`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#30358B] to-[#FFD447] mb-6">
            <Icon size={48} weight="fill" className="text-white" />
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-2">{score}%</h2>
          <div className={`inline-block px-6 py-2 ${scoreInfo.bgColor} ${scoreInfo.textColor} rounded-full font-bold text-xl mb-4`}>
            {scoreInfo.level}
          </div>
          <p className="text-2xl font-semibold text-gray-800 mb-2">{scoreInfo.message}</p>
          <p className="text-lg text-gray-600">{scoreInfo.description}</p>
        </div>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-800">Home</div>
            <div className="text-sm text-gray-600 mt-1">Suitability</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-800">Lifestyle</div>
            <div className="text-sm text-gray-600 mt-1">Fit</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-800">Practical</div>
            <div className="text-sm text-gray-600 mt-1">Readiness</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-800">Pet-Specific</div>
            <div className="text-sm text-gray-600 mt-1">Preparation</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Sparkle size={32} weight="fill" className="text-[#FFD447]" />
            <h3 className="text-3xl font-bold text-gray-800">Perfect Pets for You</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 6).map((rec, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#30358B] hover:shadow-xl transition-all cursor-pointer"
                onClick={() => onSelectBreed(rec.breed)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-2xl">{rec.type === 'dog' ? '🐕' : '🐱'}</span>
                      <h4 className="text-xl font-bold text-gray-800">{rec.breed}</h4>
                    </div>
                    <p className="text-sm text-[#30358B] font-semibold">{rec.bestFor}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <span className="text-white font-bold">{rec.matchScore}%</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Match</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 text-sm">{rec.whyRecommended}</p>
                <button className="w-full px-4 py-2 bg-[#30358B] text-white font-semibold rounded-xl hover:bg-[#252756] transition-all">
                  Choose {rec.breed}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklist */}
      {checklist.length > 0 && (
        <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle size={32} weight="fill" className="text-green-600" />
            <h3 className="text-3xl font-bold text-gray-800">Preparation Checklist</h3>
          </div>
          <div className="space-y-3">
            {checklist.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-4 rounded-xl ${
                  item.priority === 'high' ? 'bg-red-50 border-2 border-red-200' :
                  item.priority === 'medium' ? 'bg-yellow-50 border-2 border-yellow-200' :
                  'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                }`}>
                  {item.completed && <CheckCircle size={16} weight="fill" className="text-white" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.task}</p>
                  <span className={`text-xs font-semibold ${
                    item.priority === 'high' ? 'text-red-600' :
                    item.priority === 'medium' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {item.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onStartOver}
          className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
        >
          Start Over
        </button>
        {recommendations.length > 0 && (
          <button
            onClick={() => onSelectBreed(recommendations[0].breed)}
            className="px-8 py-4 bg-gradient-to-r from-[#30358B] to-[#30358B] text-white font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-105"
          >
            Get Care Guide for {recommendations[0].breed}
          </button>
        )}
      </div>
    </div>
  );
};

export default AssessmentResults;

