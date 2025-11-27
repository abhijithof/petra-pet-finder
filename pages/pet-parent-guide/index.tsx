import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import QuizQuestionCard from '../../components/QuizQuestionCard';
import ContentCard from '../../components/ContentCard';
import AssessmentFlow from '../../components/AssessmentFlow';
import AssessmentResults from '../../components/AssessmentResults';
import { 
  MagnifyingGlass, 
  Lightbulb, 
  Warning, 
  CalendarCheck, 
  BookOpen,
  FilePdf,
  Lock,
  ArrowLeft,
  Sparkle
} from 'phosphor-react';
import { PetLearningProfile, DirectEntryProfile, LearningContent, ContentSection } from '../../types/petParent';

type FlowType = 'selection' | 'quiz' | 'assessment' | 'breed-selection' | 'direct' | 'content';

interface BreedRecommendation {
  breed: string;
  type: 'dog' | 'cat';
  matchScore: number;
  bestFor: string;
  whyRecommended: string;
  climateNote: string;
  careLevel: 'low' | 'medium' | 'high';
  estimatedAge: string;
  keyTraits: string[];
  considerations: string;
}

const PetParentGuide: React.FC = () => {
  const router = useRouter();
  const [currentFlow, setCurrentFlow] = useState<FlowType>('selection');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  // Quiz state
  const [quizProfile, setQuizProfile] = useState<Partial<PetLearningProfile>>({});
  
  // Breed recommendation state
  const [breedRecommendations, setBreedRecommendations] = useState<BreedRecommendation[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  // Direct entry state
  const [directProfile, setDirectProfile] = useState<Partial<DirectEntryProfile>>({
    breed: '',
    ageInWeeks: 0,
  });
  const [ageUnit, setAgeUnit] = useState<'weeks' | 'months' | 'years'>('months');
  const [ageValue, setAgeValue] = useState<number>(0);
  const [breedSuggestions, setBreedSuggestions] = useState<string[]>([]);
  const [showBreedSuggestions, setShowBreedSuggestions] = useState(false);

  // Content state
  const [generatedContent, setGeneratedContent] = useState<ContentSection[]>([]);
  const [bookmarkedCards, setBookmarkedCards] = useState<Set<string>>(new Set());

  // Assessment state
  const [assessmentResults, setAssessmentResults] = useState<any>(null);

  // Common breed list for autocomplete (standard, legally sold breeds)
  const allBreeds = [
    'Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'Beagle', 'Bulldog',
    'Poodle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dachshund',
    'Siberian Husky', 'Great Dane', 'Doberman', 'Shih Tzu', 'Pug',
    'Cocker Spaniel', 'Pomeranian', 'Chihuahua', 'Border Collie', 'Dalmatian',
    'French Bulldog', 'Maltese',
    'Persian Cat', 'Maine Coon', 'Siamese', 'Bengal Cat', 'Ragdoll',
    'British Shorthair', 'Sphynx', 'Scottish Fold', 'Russian Blue', 'Himalayan Cat',
    'American Shorthair', 'Exotic Shorthair'
  ];

  // Quiz questions
  const quizQuestions = [
    {
      key: 'situation' as keyof PetLearningProfile,
      question: "What's your situation?",
      options: [
        {
          value: 'thinking',
          label: 'Just Thinking',
          icon: '🤔',
          description: 'Exploring the idea of getting a pet',
        },
        {
          value: 'getting-week',
          label: 'Getting This Week',
          icon: '📅',
          description: 'About to bring home a new pet',
        },
        {
          value: 'new-parent',
          label: 'New Parent (0-3 months)',
          icon: '🐾',
          description: 'Recently got my first pet',
        },
        {
          value: 'experienced-new-breed',
          label: 'Experienced, New Breed',
          icon: '⭐',
          description: 'Had pets before, new to this breed',
        },
      ],
    },
    {
      key: 'experienceLevel' as keyof PetLearningProfile,
      question: 'Which best describes you?',
      options: [
        {
          value: 'first-time',
          label: 'First-Time Ever',
          icon: '🌟',
          description: 'Never had a pet before',
        },
        {
          value: 'family-pet',
          label: 'Had Family Pets',
          icon: '🏠',
          description: 'Grew up with pets at home',
        },
        {
          value: 'experienced',
          label: 'Experienced with Species',
          icon: '🎓',
          description: 'Have owned and cared for pets before',
        },
      ],
    },
    {
      key: 'concern' as keyof PetLearningProfile,
      question: "What's your immediate concern?",
      options: [
        {
          value: 'basic-care',
          label: 'Basic Care',
          icon: '🍽️',
          description: 'Feeding, grooming, daily routines',
        },
        {
          value: 'health',
          label: 'Health & Wellness',
          icon: '🏥',
          description: 'Vaccinations, vet visits, illness',
        },
        {
          value: 'behavior',
          label: 'Behavior & Training',
          icon: '🎾',
          description: 'Training, socialization, discipline',
        },
        {
          value: 'emergency',
          label: 'Emergency Prep',
          icon: '🚨',
          description: 'What to do in emergencies',
        },
      ],
    },
  ];

  // Handle flow parameter from URL
  useEffect(() => {
    const { flow } = router.query;
    if (flow === 'quiz') {
      setCurrentFlow('quiz');
    } else if (flow === 'direct') {
      setCurrentFlow('direct');
    }
  }, [router.query]);

  // Handle breed search
  const handleBreedSearch = (value: string) => {
    setDirectProfile({ ...directProfile, breed: value });
    if (value.length > 0) {
      const filtered = allBreeds.filter((breed) =>
        breed.toLowerCase().includes(value.toLowerCase())
      );
      setBreedSuggestions(filtered);
      setShowBreedSuggestions(filtered.length > 0);
    } else {
      setShowBreedSuggestions(false);
    }
  };

  // Convert age to weeks
  const convertToWeeks = () => {
    let weeks = ageValue;
    if (ageUnit === 'months') {
      weeks = ageValue * 4;
    } else if (ageUnit === 'years') {
      weeks = ageValue * 52;
    }
    return weeks;
  };

  // Handle quiz answer
  const handleQuizAnswer = (value: string) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    // If it's the concern question (multi-select), toggle the value in array
    if (currentQuestion.key === 'concern') {
      const currentConcerns = (quizProfile.concern as string | string[]) || [];
      const concernArray = Array.isArray(currentConcerns) ? currentConcerns : [currentConcerns].filter(Boolean);
      
      if (concernArray.includes(value)) {
        // Remove if already selected
        const newConcerns = concernArray.filter(c => c !== value);
        setQuizProfile({ ...quizProfile, concern: newConcerns.length > 0 ? newConcerns.join(',') : '' });
      } else {
        // Add if not selected
        const newConcerns = [...concernArray, value];
        setQuizProfile({ ...quizProfile, concern: newConcerns.join(',') });
      }
    } else {
      // Single select for other questions
      setQuizProfile({ ...quizProfile, [currentQuestion.key]: value });
    }
  };

  // Move to next question or get breed recommendations
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      getBreedRecommendations();
    }
  };

  // Get AI-powered breed recommendations based on quiz answers
  const getBreedRecommendations = async () => {
    setIsLoadingRecommendations(true);

    try {
      const response = await fetch('/api/recommend-breeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: quizProfile }),
      });

      if (response.ok) {
        const data = await response.json();
        setBreedRecommendations(data.recommendations);
        setCurrentFlow('breed-selection');
      } else {
        throw new Error('Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error getting breed recommendations:', error);
      alert('Unable to load breed recommendations. Please try again.');
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Handle breed selection and generate guide
  const handleBreedSelection = (breed: string) => {
    setSelectedBreed(breed);
    generateContentWithBreed(breed);
  };

  // Generate content with selected breed from quiz flow
  const generateContentWithBreed = async (breed: string) => {
    setIsGenerating(true);

    try {
      // Find the selected breed details
      const breedDetails = breedRecommendations.find(b => b.breed === breed);
      const estimatedWeeks = breedDetails?.estimatedAge.includes('months') 
        ? parseInt(breedDetails.estimatedAge) * 4 
        : 8;

      // Combine quiz profile with selected breed
      const combinedProfile = {
        ...quizProfile,
        breed: breed,
        ageInWeeks: estimatedWeeks,
      };
      
      const response = await fetch('/api/generate-pet-guide-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: combinedProfile, source: 'quiz' }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedContent(data.sections);
        setCurrentFlow('content');
      } else {
        throw new Error('Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      // Fallback to sample content
      setGeneratedContent(getSampleContent('quiz'));
      setCurrentFlow('content');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate content based on profile (for direct entry)
  const generateContent = async (source: 'quiz' | 'direct') => {
    setIsGenerating(true);

    try {
      const profile = source === 'quiz' ? quizProfile : { ...directProfile, ageInWeeks: convertToWeeks() };
      
      const response = await fetch('/api/generate-pet-guide-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, source }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedContent(data.sections);
        setCurrentFlow('content');
      } else {
        throw new Error('Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      // Fallback to sample content
      setGeneratedContent(getSampleContent(source));
      setCurrentFlow('content');
    } finally {
      setIsGenerating(false);
    }
  };

  // Sample content fallback
  const getSampleContent = (source: 'quiz' | 'direct'): ContentSection[] => {
    return [
      {
        title: "Today's Priority",
        description: 'Most important things to focus on right now',
        icon: '🎯',
        contents: [
          {
            id: '1',
            title: 'Establish a Feeding Schedule',
            content:
              'Create a consistent feeding routine with 3-4 meals per day for puppies. Use high-quality puppy food and avoid human food. Always keep fresh water available.',
            category: 'priority',
            difficulty: 'beginner',
            isPremium: false,
            order: 1,
          },
          {
            id: '2',
            title: 'Set Up Safe Space',
            content:
              'Designate a quiet, comfortable area where your pet can rest undisturbed. Include a bed, toys, and water. This becomes their safe retreat.',
            category: 'priority',
            difficulty: 'beginner',
            isPremium: false,
            order: 2,
          },
          {
            id: '3',
            title: 'Schedule First Vet Visit',
            content:
              'Book a wellness check within the first week. Bring any medical records from the breeder. Discuss vaccination schedule and deworming.',
            category: 'priority',
            difficulty: 'beginner',
            isPremium: false,
            order: 3,
          },
        ],
      },
      {
        title: "This Week's Focus",
        description: 'Key milestones and activities for the coming days',
        icon: '📅',
        contents: [
          {
            id: '4',
            title: 'Start House Training',
            content:
              'Take your puppy outside every 2 hours, after meals, and after waking up. Praise immediately when they go in the right spot. Be patient and consistent.',
            category: 'weekly',
            difficulty: 'intermediate',
            isPremium: false,
            order: 1,
          },
          {
            id: '5',
            title: 'Begin Socialization',
            content:
              'Introduce your pet to different sounds, sights, and gentle handling. Keep interactions positive and calm. Avoid overwhelming situations in early weeks.',
            category: 'weekly',
            difficulty: 'intermediate',
            isPremium: false,
            order: 2,
          },
          {
            id: '6',
            title: 'Basic Commands Training',
            content:
              'Start with "sit" and "come" using treats and positive reinforcement. Keep sessions short (5-10 minutes). Make it fun and rewarding.',
            category: 'weekly',
            difficulty: 'intermediate',
            isPremium: true,
            order: 3,
          },
        ],
      },
      {
        title: 'Common Mistakes to Avoid',
        description: 'Learn from others and avoid these pitfalls',
        icon: '⚠️',
        contents: [
          {
            id: '7',
            title: 'Overfeeding',
            content:
              "Don't give in to those puppy eyes! Overfeeding leads to obesity and health issues. Follow the food package guidelines based on weight and age.",
            category: 'mistakes',
            difficulty: 'beginner',
            isPremium: false,
            order: 1,
          },
          {
            id: '8',
            title: 'Skipping Socialization Window',
            content:
              'The critical socialization period is 3-14 weeks. Missing this window can lead to fearful or aggressive behavior. Introduce controlled experiences early.',
            category: 'mistakes',
            difficulty: 'advanced',
            isPremium: false,
            order: 2,
          },
          {
            id: '9',
            title: 'Inconsistent Training',
            content:
              'Everyone in the household must use the same commands and rules. Mixed signals confuse your pet and slow down training progress.',
            category: 'mistakes',
            difficulty: 'intermediate',
            isPremium: true,
            order: 3,
          },
        ],
      },
      {
        title: 'Breed-Specific Alerts',
        description: 'Important considerations for your specific breed',
        icon: '🔔',
        contents: [
          {
            id: '10',
            title: 'Exercise Requirements',
            content:
              'This breed needs 30-60 minutes of daily exercise. Under-exercising can lead to destructive behavior. Plan for walks, play time, and mental stimulation.',
            category: 'alerts',
            difficulty: 'intermediate',
            isPremium: false,
            order: 1,
          },
          {
            id: '11',
            title: 'Grooming Needs',
            content:
              'Brush coat 2-3 times per week to prevent matting. Regular ear cleaning is essential. Schedule professional grooming every 6-8 weeks.',
            category: 'alerts',
            difficulty: 'beginner',
            isPremium: true,
            order: 2,
          },
          {
            id: '12',
            title: 'Health Watch Points',
            content:
              'This breed is prone to hip dysplasia and eye issues. Watch for limping or cloudiness in eyes. Keep annual vet checkups and maintain healthy weight.',
            category: 'alerts',
            difficulty: 'advanced',
            isPremium: true,
            order: 3,
          },
        ],
      },
    ];
  };

  // Toggle bookmark
  const toggleBookmark = (contentId: string) => {
    const newBookmarks = new Set(bookmarkedCards);
    if (newBookmarks.has(contentId)) {
      newBookmarks.delete(contentId);
    } else {
      newBookmarks.add(contentId);
    }
    setBookmarkedCards(newBookmarks);
  };

  // Get current quiz question value
  const getCurrentQuizValue = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const value = quizProfile[currentQuestion.key];
    
    // If it's concern (multi-select), return as array
    if (currentQuestion.key === 'concern' && typeof value === 'string') {
      return value ? value.split(',') : [];
    }
    
    return (value as string) || '';
  };

  // Check if can proceed
  const canProceedQuiz = () => {
    const value = getCurrentQuizValue();
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== '';
  };
  const canProceedDirect = directProfile.breed && ageValue > 0;

  return (
    <>
      <Head>
        <title>Pet Parent Guide - Pet.Ra</title>
        <meta
          name="description"
          content="Get your personalized pet parenting guide based on your experience level and pet's breed. Learn essential care tips, training techniques, and avoid common mistakes."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <div className="flex items-center space-x-3 cursor-pointer">
                  <img src="/petra-logo-blue-2.png" alt="Pet.Ra" className="h-10 w-auto" />
                  <span className="text-xl font-bold text-gray-800">Pet Parent Guide</span>
                </div>
              </Link>
              {currentFlow !== 'selection' && (
                <button
                  onClick={() => {
                    setCurrentFlow('selection');
                    setCurrentQuestionIndex(0);
                    setQuizProfile({});
                    setDirectProfile({ breed: '', ageInWeeks: 0 });
                    setGeneratedContent([]);
                    setBreedRecommendations([]);
                    setSelectedBreed('');
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                >
                  <ArrowLeft size={20} />
                  <span className="font-medium">Start Over</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Flow Selection */}
          {currentFlow === 'selection' && (
            <div className="text-center mb-12 animate-fadeIn">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Become a Confident Pet Parent in 7 Days
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Get your personalized guide based on your pet's breed, age, and your experience
                level
              </p>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Quick Quiz Card */}
                <div
                  onClick={() => setCurrentFlow('quiz')}
                  className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-[#30358B] hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#30358B] to-[#FFD447] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Lightbulb size={32} weight="fill" className="text-white" />
                  </div>
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-3">
                      ⚡ 30 SECONDS
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Quick Quiz</h2>
                  <p className="text-gray-600 mb-6">
                    Just 3 questions to get instant breed recommendations and basic guidance
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-[#30358B] font-semibold">
                    <span>Fast Track</span>
                    <span>→</span>
                  </div>
                </div>

                {/* Full Assessment Card */}
                <div
                  onClick={() => setCurrentFlow('assessment')}
                  className="bg-gradient-to-br from-[#30358B] to-[#252756] rounded-3xl p-8 border-2 border-[#30358B] shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                  {/* Recommended badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-[#FFD447] text-[#171739] text-xs font-bold rounded-full">
                      ⭐ RECOMMENDED
                    </span>
                  </div>
                  
                  <div className="w-16 h-16 bg-[#FFD447] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-[#30358B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-3">
                      📊 2-3 MINUTES
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Full Assessment</h2>
                  <p className="text-gray-200 mb-6">
                    ~15 smart questions for personalized pet recommendations, readiness score, and detailed checklist
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-[#FFD447] font-semibold">
                    <span>Get My Score</span>
                    <span>→</span>
                  </div>
                </div>
              </div>

              {/* Info Text */}
              <div className="text-center mt-8 text-gray-600">
                <p>Both options end with personalized breed recommendations & care guides</p>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-8 mt-16">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">Vet-Reviewed Content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FilePdf size={20} weight="fill" className="text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Export as PDF</span>
                </div>
              </div>

              {/* Already Have Pet - Direct Entry */}
              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-4">Already have a pet?</p>
                <button
                  onClick={() => setCurrentFlow('direct')}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  <MagnifyingGlass size={20} />
                  <span>Enter Breed Directly for Care Guide</span>
                </button>
              </div>
            </div>
          )}

          {/* Full Assessment Flow */}
          {currentFlow === 'assessment' && !assessmentResults && (
            <AssessmentFlow
              onComplete={(results) => {
                setAssessmentResults(results);
              }}
              onBack={() => setCurrentFlow('selection')}
            />
          )}

          {/* Assessment Results */}
          {currentFlow === 'assessment' && assessmentResults && (
            <AssessmentResults
              score={assessmentResults.score}
              recommendations={assessmentResults.recommendations}
              answers={assessmentResults.answers}
              onStartOver={() => {
                setCurrentFlow('selection');
                setAssessmentResults(null);
              }}
              onSelectBreed={async (breed) => {
                // Generate guide for selected breed
                const breedDetails = assessmentResults.recommendations.find((r: any) => r.breed === breed);
                if (breedDetails) {
                  setIsGenerating(true);
                  try {
                    const estimatedWeeks = breedDetails.estimatedAge?.includes('months') 
                      ? parseInt(breedDetails.estimatedAge) * 4 
                      : 8;

                    const combinedProfile = {
                      situation: 'thinking',
                      experienceLevel: assessmentResults.answers.experienceLevel || 'first-time',
                      concern: assessmentResults.answers.lookingFor?.join(',') || 'basic-care',
                      breed: breed,
                      ageInWeeks: estimatedWeeks,
                    };
                    
                    const response = await fetch('/api/generate-pet-guide-ai', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ profile: combinedProfile, source: 'quiz' }),
                    });

                    if (response.ok) {
                      const data = await response.json();
                      setGeneratedContent(data.sections);
                      setCurrentFlow('content');
                    } else {
                      throw new Error('Failed to generate content');
                    }
                  } catch (error) {
                    console.error('Error generating content:', error);
                    setGeneratedContent(getSampleContent('quiz'));
                    setCurrentFlow('content');
                  } finally {
                    setIsGenerating(false);
                  }
                }
              }}
            />
          )}

          {/* Quiz Flow */}
          {currentFlow === 'quiz' && !isGenerating && !isLoadingRecommendations && (
            <div className="animate-fadeIn">
              <QuizQuestionCard
                question={quizQuestions[currentQuestionIndex].question}
                options={quizQuestions[currentQuestionIndex].options}
                selectedValue={getCurrentQuizValue()}
                onSelect={handleQuizAnswer}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={quizQuestions.length}
                multiSelect={quizQuestions[currentQuestionIndex].key === 'concern'}
              />

              <div className="flex justify-center mt-8">
                <button
                  onClick={handleNextQuestion}
                  disabled={!canProceedQuiz()}
                  className="px-12 py-4 bg-gradient-to-r from-[#30358B] to-[#30358B] text-white text-lg font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                >
                  {currentQuestionIndex < quizQuestions.length - 1
                    ? 'Next Question →'
                    : 'Find My Perfect Pet ✨'}
                </button>
              </div>
            </div>
          )}

          {/* Loading Breed Recommendations */}
          {isLoadingRecommendations && (
            <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
              <div className="w-20 h-20 border-4 border-[#30358B] border-t-[#FFD447] rounded-full animate-spin mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Finding Perfect Pets for You...
              </h3>
              <p className="text-gray-600">Analyzing your preferences and Kerala's best breeds</p>
            </div>
          )}

          {/* Breed Selection Screen */}
          {currentFlow === 'breed-selection' && !isGenerating && (
            <div className="animate-fadeIn">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Perfect Pets for You 🐾
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Based on your answers, here are the best breeds available in Kerala that match your needs
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {breedRecommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#30358B] hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => handleBreedSelection(rec.breed)}
                  >
                    {/* Header with Match Score */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-2xl">{rec.type === 'dog' ? '🐕' : '🐱'}</span>
                          <h3 className="text-2xl font-bold text-gray-800">{rec.breed}</h3>
                        </div>
                        <p className="text-sm text-[#30358B] font-semibold">{rec.bestFor}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-1">
                          <span className="text-white font-bold text-lg">{rec.matchScore}%</span>
                        </div>
                        <span className="text-xs text-gray-500">Match</span>
                      </div>
                    </div>

                    {/* Why Recommended */}
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed">{rec.whyRecommended}</p>
                    </div>

                    {/* Key Traits */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {rec.keyTraits.map((trait, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Care Level</p>
                        <p className="text-sm font-semibold text-gray-800 capitalize">{rec.careLevel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Starting Age</p>
                        <p className="text-sm font-semibold text-gray-800">{rec.estimatedAge}</p>
                      </div>
                    </div>

                    {/* Climate Note */}
                    <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">🌡️</span>
                        <div>
                          <p className="text-xs font-semibold text-amber-800 mb-1">Kerala Climate</p>
                          <p className="text-sm text-amber-700">{rec.climateNote}</p>
                        </div>
                      </div>
                    </div>

                    {/* Considerations */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">💡</span>
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Important to Know</p>
                          <p className="text-sm text-gray-600">{rec.considerations}</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-[#30358B] to-[#30358B] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center space-x-2">
                      <span>Choose {rec.breed}</span>
                      <span>→</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Back button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => {
                    setCurrentFlow('quiz');
                    setCurrentQuestionIndex(quizQuestions.length - 1);
                  }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
                >
                  ← Back to Quiz
                </button>
              </div>
            </div>
          )}

          {/* Direct Entry Flow */}
          {currentFlow === 'direct' && !isGenerating && (
            <div className="max-w-2xl mx-auto animate-fadeIn">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Tell Us About Your Pet
                </h2>
                <p className="text-lg text-gray-600">
                  Enter your pet's breed and age to get a customized care guide
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
                <div className="space-y-6">
                  {/* Breed Search */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Breed Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={directProfile.breed}
                        onChange={(e) => handleBreedSearch(e.target.value)}
                        onBlur={() => setTimeout(() => setShowBreedSuggestions(false), 200)}
                        onFocus={() => directProfile.breed && setShowBreedSuggestions(true)}
                        placeholder="Start typing breed name..."
                        className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-[#30358B] focus:outline-none text-lg"
                      />
                      <MagnifyingGlass
                        size={24}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                    </div>

                    {/* Breed Suggestions Dropdown */}
                    {showBreedSuggestions && breedSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        {breedSuggestions.map((breed) => (
                          <button
                            key={breed}
                            onMouseDown={() => {
                              setDirectProfile({ ...directProfile, breed });
                              setShowBreedSuggestions(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            {breed}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Age Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pet's Age *
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        min="0"
                        value={ageValue || ''}
                        onChange={(e) => setAgeValue(parseInt(e.target.value) || 0)}
                        placeholder="Enter age"
                        className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#30358B] focus:outline-none text-lg"
                      />
                      <select
                        value={ageUnit}
                        onChange={(e) => setAgeUnit(e.target.value as 'weeks' | 'months' | 'years')}
                        className="px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#30358B] focus:outline-none text-lg bg-white cursor-pointer"
                      >
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={() => generateContent('direct')}
                    disabled={!canProceedDirect}
                    className="w-full px-8 py-5 bg-gradient-to-r from-[#30358B] to-[#30358B] text-white text-xl font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
                  >
                    <Sparkle size={24} weight="fill" />
                    <span>Generate My Guide</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
              <div className="w-20 h-20 border-4 border-[#30358B] border-t-[#FFD447] rounded-full animate-spin mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Generating Your Personalized Guide...
              </h3>
              <p className="text-gray-600">This will just take a moment</p>
            </div>
          )}

          {/* Content Display */}
          {currentFlow === 'content' && generatedContent.length > 0 && (
            <div className="animate-fadeIn">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Your Personalized Pet Parent Guide
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Here's everything you need to know to succeed as a pet parent
                </p>

                {/* Progress Tracker */}
                <div className="flex items-center justify-center space-x-4 flex-wrap gap-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-full">
                    <span className="text-green-600 font-semibold">✓</span>
                    <span className="text-green-800 font-medium">Profile Complete</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 rounded-full">
                    <BookOpen size={20} weight="fill" className="text-blue-600" />
                    <span className="text-blue-800 font-medium">
                      {bookmarkedCards.size} Items Saved
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              {generatedContent.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-16">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-4xl">{section.icon}</span>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-800">{section.title}</h3>
                      <p className="text-gray-600">{section.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.contents.map((content) => (
                      <ContentCard
                        key={content.id}
                        title={content.title}
                        content={content.content}
                        difficulty={content.difficulty}
                        category={section.title}
                        isPremium={content.isPremium}
                        onBookmark={() => toggleBookmark(content.id)}
                        isBookmarked={bookmarkedCards.has(content.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* PDF Export Section */}
              <div className="mt-16 bg-gradient-to-r from-amber-50 to-amber-100 rounded-3xl p-8 md:p-12 border-2 border-amber-200">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0 md:mr-8">
                    <div className="flex items-center space-x-2 mb-3">
                      <FilePdf size={32} weight="fill" className="text-amber-600" />
                      <h3 className="text-2xl font-bold text-gray-800">
                        Get Your Complete PDF Guide
                      </h3>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Download a beautifully formatted 20-30 page personalized guide with:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span>Month-by-month development roadmap</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span>Vet visit checklists and schedules</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span>Emergency contacts template</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span>Training progress trackers</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      onClick={() => setShowPDFPreview(true)}
                      className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-lg font-bold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
                    >
                      <Lock size={24} weight="fill" />
                      <div className="text-left">
                        <div>Export as PDF</div>
                        <div className="text-sm font-normal opacity-90">₹99 one-time</div>
                      </div>
                    </button>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      Or included in subscription
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* PDF Preview Modal */}
        {showPDFPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FilePdf size={40} weight="fill" className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  Unlock Your Complete Guide
                </h3>
                <p className="text-gray-600">
                  Get lifetime access to your personalized PDF guide
                </p>
              </div>

              {/* PDF Preview Image */}
              <div className="bg-gray-100 rounded-2xl p-8 mb-6 text-center">
                <div className="bg-white rounded-lg shadow-lg p-6 mx-auto max-w-sm">
                  <div className="text-left">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Your Pet Parenting Guide
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>✓ 20-30 pages of expert content</p>
                      <p>✓ Customized for your situation</p>
                      <p>✓ Printable & shareable</p>
                      <p>✓ Lifetime access</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-800">₹99</div>
                    <div className="text-sm text-gray-600">One-time payment</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 line-through">₹299</div>
                    <div className="text-green-600 font-semibold">Save 67%</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    // Handle payment
                    alert('Payment integration coming soon!');
                  }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-lg font-bold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Purchase PDF Guide - ₹99
                </button>
                <button
                  onClick={() => setShowPDFPreview(false)}
                  className="w-full px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Maybe Later
                </button>
              </div>

              <p className="text-center text-xs text-gray-500 mt-4">
                Free for subscription members • Secure payment via Razorpay
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </>
  );
};

export default PetParentGuide;

