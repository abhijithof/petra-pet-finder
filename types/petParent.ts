// Pet Parent Learning Hub Types

export interface QuizAnswer {
  question: string;
  answer: string;
}

export interface PetLearningProfile {
  id?: string;
  situation: 'thinking' | 'getting-week' | 'new-parent' | 'experienced-new-breed';
  experienceLevel: 'first-time' | 'family-pet' | 'experienced';
  concern: string; // Can be single value or comma-separated for multiple concerns
  breed?: string;
  ageInWeeks?: number;
  createdAt?: Date;
}

export interface DirectEntryProfile {
  breed: string;
  ageInWeeks: number;
}

export interface LearningContent {
  id: string;
  title: string;
  content: string;
  category: 'priority' | 'weekly' | 'mistakes' | 'alerts';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPremium: boolean;
  order: number;
}

export interface ContentSection {
  title: string;
  description: string;
  icon: string;
  contents: LearningContent[];
}

export interface GeneratedGuide {
  profile: PetLearningProfile | DirectEntryProfile;
  sections: ContentSection[];
  generatedAt: Date;
}

export interface PDFExportData {
  petName?: string;
  ownerName?: string;
  guide: GeneratedGuide;
  isPaid: boolean;
}

