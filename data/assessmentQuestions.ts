// Streamlined Pet Readiness Assessment (2-3 minutes)

export interface StreamlinedReadinessProfile {
  // Essential basics (4 questions)
  city: string;
  homeType: 'apartment' | 'independent-house' | 'farmhouse' | 'hostel-pg';
  outdoorAccess: string[];
  hoursEmpty: string;
  
  // Lifestyle (3 questions)
  travelFrequency: string;
  dailyTimeAvailable: string;
  experienceLevel: 'first-time' | 'some-experience' | 'very-experienced';
  
  // What you want (3 questions)
  consideringPetTypes: string[]; // Multi-select
  sizePreference: string;
  lookingFor: string[];
  
  // Conditional pet-specific (2-3 questions based on selection)
  petSpecificAnswers: {
    dogs?: {
      safeWalking: boolean;
      indoorOutdoor: string;
    };
    cats?: {
      indoorOnly: boolean;
      securedSpaces: boolean;
    };
    birds?: {
      noiseOk: boolean;
    };
    fish?: {
      tankSizeReady: string;
    };
  };
  
  // Practical (3 questions)
  monthlyBudget: string;
  hasAllergies: boolean;
  familySupport: boolean;
  
  // Generated
  readinessScore?: number;
  recommendedPets?: Array<{
    type: string;
    breed: string;
    matchScore: number;
    whyGoodFit: string[];
  }>;
}

export const QUICK_ASSESSMENT_QUESTIONS = [
  // Section 1: Your Home (4 questions)
  {
    section: 'home',
    key: 'city',
    question: 'Which city are you in?',
    subtitle: 'To check if Petra services are available',
    type: 'single-select',
    options: [
      { value: 'kochi', label: 'Kochi', icon: '📍' },
      { value: 'other', label: 'Other City', icon: '🌍' },
    ],
  },
  {
    section: 'home',
    key: 'homeType',
    question: 'What type of home do you live in?',
    type: 'single-select',
    options: [
      { value: 'apartment', label: 'Apartment', icon: '🏢' },
      { value: 'independent-house', label: 'Independent House', icon: '🏠' },
      { value: 'farmhouse', label: 'Farmhouse', icon: '🌾' },
      { value: 'hostel-pg', label: 'Hostel / PG', icon: '🏘️' },
    ],
  },
  {
    section: 'home',
    key: 'outdoorAccess',
    question: 'What outdoor spaces do you have?',
    subtitle: 'Select all that apply',
    type: 'multi-select',
    options: [
      { value: 'balcony', label: 'Balcony', icon: '🪟' },
      { value: 'terrace', label: 'Terrace', icon: '🏔️' },
      { value: 'private-yard', label: 'Private Yard', icon: '🌳' },
      { value: 'shared-area', label: 'Shared Area', icon: '🏞️' },
      { value: 'none', label: 'No Outdoor Space', icon: '🚫' },
    ],
  },
  {
    section: 'home',
    key: 'hoursEmpty',
    question: 'How many hours is your home empty on weekdays?',
    type: 'single-select',
    options: [
      { value: '0-2', label: '0-2 hours', description: 'Someone usually home' },
      { value: '3-5', label: '3-5 hours', description: 'Short periods alone' },
      { value: '6-8', label: '6-8 hours', description: 'Regular work hours' },
      { value: '9+', label: '9+ hours', description: 'Long periods alone' },
    ],
  },
  
  // Section 2: Lifestyle (3 questions)
  {
    section: 'lifestyle',
    key: 'travelFrequency',
    question: 'How often do you travel overnight?',
    type: 'single-select',
    options: [
      { value: 'rarely', label: 'Rarely', description: 'Few times a year' },
      { value: 'monthly', label: 'Once a Month' },
      { value: 'few-times-month', label: 'Few Times a Month' },
      { value: 'weekly', label: 'Weekly or More' },
    ],
  },
  {
    section: 'lifestyle',
    key: 'dailyTimeAvailable',
    question: 'Daily time you can give for pet care?',
    subtitle: 'Feeding, cleaning, play, walks, training',
    type: 'single-select',
    options: [
      { value: '15-30', label: '15-30 minutes' },
      { value: '30-60', label: '30-60 minutes' },
      { value: '1-2', label: '1-2 hours' },
      { value: '2+', label: '2+ hours' },
    ],
  },
  {
    section: 'lifestyle',
    key: 'experienceLevel',
    question: 'Your pet parenting experience?',
    type: 'single-select',
    options: [
      { value: 'first-time', label: 'First Time', icon: '🌟', description: 'Never had pets' },
      { value: 'some-experience', label: 'Some Experience', icon: '👍', description: 'Had family pets' },
      { value: 'very-experienced', label: 'Very Experienced', icon: '⭐', description: 'Owned & cared for pets' },
    ],
  },
  
  // Section 3: What You Want (3 questions)
  {
    section: 'preferences',
    key: 'consideringPetTypes',
    question: 'Which pets are you considering?',
    subtitle: 'Select all you\'re open to',
    type: 'multi-select',
    options: [
      { value: 'dog', label: 'Dog', icon: '🐕' },
      { value: 'cat', label: 'Cat', icon: '🐱' },
      { value: 'bird', label: 'Bird', icon: '🐦' },
      { value: 'fish', label: 'Fish', icon: '🐠' },
      { value: 'small-animal', label: 'Rabbit / Guinea Pig / Hamster', icon: '🐹' },
    ],
  },
  {
    section: 'preferences',
    key: 'sizePreference',
    question: 'Size preference for your pet?',
    type: 'single-select',
    options: [
      { value: 'small', label: 'Small', description: 'Easy to handle, less space' },
      { value: 'medium', label: 'Medium', description: 'Moderate size & needs' },
      { value: 'large', label: 'Large', description: 'Need more space & exercise' },
      { value: 'any', label: 'Any Size', description: 'Open to all' },
    ],
  },
  {
    section: 'preferences',
    key: 'lookingFor',
    question: 'What are you mainly looking for?',
    subtitle: 'Select all that apply',
    type: 'multi-select',
    options: [
      { value: 'playful', label: 'Playful Companion', icon: '🎾' },
      { value: 'calm', label: 'Calm Companion', icon: '😌' },
      { value: 'observe', label: 'To Observe & Enjoy', icon: '👀' },
      { value: 'kids', label: 'For Kids to Learn', icon: '👨‍👩‍👧' },
    ],
  },
  
  // Section 4: Practical Matters (3 questions)
  {
    section: 'practical',
    key: 'monthlyBudget',
    question: 'Comfortable monthly budget for pet care?',
    subtitle: 'Food, vet, grooming, supplies',
    type: 'single-select',
    options: [
      { value: 'up-to-1k', label: 'Up to ₹1,000' },
      { value: '1k-3k', label: '₹1,000 - ₹3,000' },
      { value: '3k-6k', label: '₹3,000 - ₹6,000' },
      { value: '6k+', label: '₹6,000+' },
    ],
  },
  {
    section: 'practical',
    key: 'hasAllergies',
    question: 'Anyone in family with pet-related allergies?',
    subtitle: 'Fur, feathers, hay, dust',
    type: 'boolean',
    options: [
      { value: 'no', label: 'No Allergies', icon: '✅' },
      { value: 'yes', label: 'Yes, We Have Allergies', icon: '⚠️' },
    ],
  },
  {
    section: 'practical',
    key: 'familySupport',
    question: 'Is everyone at home supportive of getting a pet?',
    type: 'boolean',
    options: [
      { value: 'yes', label: 'Yes, Everyone\'s On Board!', icon: '👨‍👩‍👧' },
      { value: 'no', label: 'Not Everyone Agrees', icon: '🤔' },
    ],
  },
];

// Conditional questions based on pet type selected
export const CONDITIONAL_PET_QUESTIONS = {
  dog: [
    {
      key: 'safeWalking',
      question: 'Do you have safe walking options near your home?',
      type: 'boolean',
      options: [
        { value: 'yes', label: 'Yes, Safe Walking Areas' },
        { value: 'no', label: 'No Safe Areas' },
      ],
    },
    {
      key: 'indoorOutdoor',
      question: 'Where will the dog stay mostly?',
      type: 'single-select',
      options: [
        { value: 'indoor', label: 'Indoors', icon: '🏠' },
        { value: 'outdoor', label: 'Outdoors', icon: '🌳' },
        { value: 'both', label: 'Both', icon: '🏠🌳' },
      ],
    },
  ],
  cat: [
    {
      key: 'indoorOnly',
      question: 'Will your cat be indoor-only?',
      type: 'boolean',
      options: [
        { value: 'yes', label: 'Indoor Only', description: 'Safer & recommended' },
        { value: 'no', label: 'Indoor-Outdoor', description: 'Higher risks' },
      ],
    },
    {
      key: 'securedSpaces',
      question: 'Are windows & balconies secured?',
      subtitle: 'To prevent falls/escapes',
      type: 'boolean',
      options: [
        { value: 'yes', label: 'Yes, Secured' },
        { value: 'no', label: 'Not Yet / No' },
      ],
    },
  ],
  bird: [
    {
      key: 'noiseOk',
      question: 'Comfortable with bird noise?',
      subtitle: 'Chirping, squawking, especially mornings',
      type: 'boolean',
      options: [
        { value: 'yes', label: 'Yes, It\'s Fine!' },
        { value: 'no', label: 'Prefer Quieter Pets' },
      ],
    },
  ],
  fish: [
    {
      key: 'tankSizeReady',
      question: 'What tank size are you thinking?',
      type: 'single-select',
      options: [
        { value: 'small', label: 'Small (< 50L)', description: 'Few fish' },
        { value: 'medium', label: 'Medium (50-150L)', description: 'Community tank' },
        { value: 'large', label: 'Large (150L+)', description: 'Full setup' },
      ],
    },
  ],
  'small-animal': [
    {
      key: 'freeRoamTime',
      question: 'Will they get supervised free-roam time?',
      type: 'boolean',
      options: [
        { value: 'yes', label: 'Yes, Daily Free Time' },
        { value: 'no', label: 'Mostly in Enclosure' },
      ],
    },
  ],
};

