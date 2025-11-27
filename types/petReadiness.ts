// Pet Readiness Assessment Types

export interface PetReadinessProfile {
  // Section 1: You and your home
  ageGroup: string;
  city: string;
  area: string;
  pincode: string;
  homeType: string;
  outdoorAccess: string;
  hoursEmpty: string;
  hasAllergies: boolean;

  // Section 2: Lifestyle and time
  travelFrequency: string;
  dailyTimeAvailable: string;
  mainTransport: string;
  primaryCaregiver: string;

  // Section 3: Experience and expectations
  previousPets: string[];
  experienceLevel: string;
  lookingFor: string;
  commitmentYears: string;

  // Section 4: Pet type planning
  consideringPetTypes: string[];
  sizePreference: string;
  singleOrMultiple: string;
  specificBreeds: string;

  // Section 5: Environment & care (conditional based on pet type)
  dogCare?: {
    safeWalking: boolean;
    dailyWalks: string;
    stayLocation: string;
    openToAdult: boolean;
    readyForCare: boolean;
  };
  catCare?: {
    livingArrangement: string;
    securedSpaces: boolean;
    litterBoxReady: boolean;
    scratchingReady: boolean;
  };
  birdCare?: {
    groupSize: string;
    cageLocation: boolean;
    cleaningReady: boolean;
    noiseOk: boolean;
    outOfCageTime: boolean;
  };
  fishCare?: {
    tankSize: string;
    tankLocation: boolean;
    maintenanceReady: boolean;
    tankInterest: string;
    powerBackup: boolean;
  };
  smallAnimalCare?: {
    enclosureLocation: string;
    cleaningReady: boolean;
    freeRoamTime: boolean;
    dietAware: boolean;
  };
  reptileCare?: {
    setupReady: boolean;
    feedingComfortable: boolean;
    legalityChecked: boolean;
  };

  // Section 6: Health, safety and rules
  healthConditions: string;
  familySupport: boolean;
  restrictions: string;
  culturalBoundaries: string;
  spayNeuterReady: boolean;

  // Section 7: Money and services
  monthlyBudget: string;
  servicesNeeded: string[];
  bundleImportance: string;

  // Section 8: Support preferences
  reminderChannel: string;
  wantReadinessScore: boolean;
  wantPetSuggestions: boolean;
  wantStarterGuides: boolean;
  consentForSuggestions: boolean;

  // Generated
  readinessScore?: number;
  recommendedPets?: string[];
  createdAt?: Date;
}

export interface ReadinessResult {
  score: number;
  level: 'Not Ready' | 'Needs Preparation' | 'Ready' | 'Highly Ready';
  recommendedPets: Array<{
    petType: string;
    matchPercentage: number;
    reasons: string[];
    considerations: string[];
  }>;
  checklist: Array<{
    category: string;
    items: Array<{
      task: string;
      priority: 'high' | 'medium' | 'low';
      completed: boolean;
    }>;
  }>;
  petraServices: Array<{
    service: string;
    relevance: string;
    estimatedCost: string;
  }>;
}

