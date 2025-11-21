import type { NextApiRequest, NextApiResponse } from 'next';

interface PetProfile {
  situation?: string;
  experienceLevel?: string;
  concern?: string;
  breed?: string;
  ageInWeeks?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { profile, source } = req.body as { profile: PetProfile; source: 'quiz' | 'direct' };

    // Generate content based on profile
    const sections = generatePersonalizedContent(profile, source);

    return res.status(200).json({
      success: true,
      sections,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating guide:', error);
    return res.status(500).json({ message: 'Failed to generate guide' });
  }
}

function generatePersonalizedContent(profile: PetProfile, source: 'quiz' | 'direct') {
  // This is a simplified content generation
  // In production, this would call an AI service (OpenAI, Claude, etc.)
  
  const isNewParent = profile.situation === 'new-parent' || profile.situation === 'getting-week';
  const isFirstTime = profile.experienceLevel === 'first-time';
  const ageInWeeks = profile.ageInWeeks || 8;
  const isPuppy = ageInWeeks < 52; // Less than 1 year

  return [
    {
      title: "Today's Priority",
      description: isNewParent ? 'Critical first steps for new pet parents' : 'Most important things to focus on right now',
      icon: '🎯',
      contents: [
        {
          id: '1',
          title: isFirstTime ? 'Set Up Essential Supplies' : 'Review Your Setup',
          content: isFirstTime
            ? 'Get the basics ready: food and water bowls, bed, collar with ID tag, leash, and age-appropriate food. Choose a quiet spot for feeding and sleeping away from high-traffic areas.'
            : 'Double-check that you have all essentials in place. Ensure food is age-appropriate, water is fresh, and sleeping area is comfortable. Update ID tags with current contact information.',
          category: 'priority',
          difficulty: 'beginner',
          isPremium: false,
          order: 1,
        },
        {
          id: '2',
          title: 'Establish Feeding Routine',
          content: isPuppy
            ? `Puppies need ${ageInWeeks < 16 ? '4 meals' : '3 meals'} per day at consistent times. Measure portions according to food guidelines for their weight. Never free-feed puppies as it makes house training harder.`
            : 'Adult pets do well with 2 meals daily. Maintain consistent feeding times to establish routine. Avoid feeding human food to prevent digestive issues and obesity.',
          category: 'priority',
          difficulty: 'beginner',
          isPremium: false,
          order: 2,
        },
        {
          id: '3',
          title: profile.concern === 'health' ? 'Schedule Urgent Vet Visit' : 'Book Wellness Check',
          content: profile.concern === 'health'
            ? 'Book a vet appointment within 48 hours. Bring any medical records from breeder. Discuss your health concerns in detail. Ask about vaccination schedule and preventive care.'
            : 'Schedule a wellness check within the first week. This establishes a baseline for future care. Bring medical records and prepare questions about diet, exercise, and behavior.',
          category: 'priority',
          difficulty: 'beginner',
          isPremium: false,
          order: 3,
        },
        {
          id: '4',
          title: 'Create Safe Environment',
          content: 'Pet-proof your home by removing toxic plants, securing cabinets, covering electrical cords, and removing small objects. Set up a safe space where your pet can retreat when overwhelmed.',
          category: 'priority',
          difficulty: 'beginner',
          isPremium: false,
          order: 4,
        },
      ],
    },
    {
      title: "This Week's Focus",
      description: 'Key activities and milestones for the next 7 days',
      icon: '📅',
      contents: [
        {
          id: '5',
          title: profile.concern === 'behavior' ? 'Start Training Basics' : 'Begin House Training',
          content: profile.concern === 'behavior'
            ? 'Start with simple commands: "sit", "stay", and "come". Use positive reinforcement with treats and praise. Keep sessions short (5-10 minutes) and fun. Practice multiple times daily in different locations.'
            : 'Take your pet outside every 2 hours, after meals, after naps, and first thing in morning. Praise immediately when they go in the right spot. Clean accidents with enzymatic cleaner to remove scent.',
          category: 'weekly',
          difficulty: 'intermediate',
          isPremium: false,
          order: 1,
        },
        {
          id: '6',
          title: isPuppy ? 'Start Early Socialization' : 'Maintain Social Skills',
          content: isPuppy
            ? 'Introduce your puppy to different people, sounds, and sights in a controlled way. Keep experiences positive. Avoid overwhelming situations. The socialization window (3-14 weeks) is critical for lifelong behavior.'
            : 'Continue exposing your pet to various situations to prevent fear or aggression. Regular walks, visits to pet-friendly stores, and controlled interactions with other pets help maintain social skills.',
          category: 'weekly',
          difficulty: 'intermediate',
          isPremium: false,
          order: 2,
        },
        {
          id: '7',
          title: 'Establish Daily Routine',
          content: 'Create a consistent schedule for feeding, walks, play, and sleep. Pets thrive on routine. Post the schedule where everyone can see it. Get all family members involved in daily care.',
          category: 'weekly',
          difficulty: 'beginner',
          isPremium: true,
          order: 3,
        },
        {
          id: '8',
          title: profile.concern === 'emergency' ? 'Prepare Emergency Kit' : 'Plan Exercise Routine',
          content: profile.concern === 'emergency'
            ? 'Assemble a pet first aid kit with gauze, antiseptic, tweezers, and emergency contact numbers. Save 24-hour vet clinic contact. Learn basic first aid: how to handle bleeding, choking, and heatstroke.'
            : 'Plan age and breed-appropriate exercise. Puppies need short, frequent play sessions. Adults need daily walks and mental stimulation. Mix physical exercise with training and puzzle toys.',
          category: 'weekly',
          difficulty: 'intermediate',
          isPremium: true,
          order: 4,
        },
      ],
    },
    {
      title: 'Common Mistakes to Avoid',
      description: 'Learn from others and skip these pitfalls',
      icon: '⚠️',
      contents: [
        {
          id: '9',
          title: isFirstTime ? 'Expecting Too Much Too Soon' : 'Inconsistent Rules',
          content: isFirstTime
            ? 'Your pet needs time to adjust (typically 3 days to 3 weeks). Don\'t expect perfect behavior immediately. Be patient with accidents and mistakes. Focus on bonding before intensive training.'
            : 'Everyone in household must enforce same rules. If one person allows couch access and another doesn\'t, you\'ll confuse your pet. Hold a family meeting to agree on boundaries and commands.',
          category: 'mistakes',
          difficulty: 'beginner',
          isPremium: false,
          order: 1,
        },
        {
          id: '10',
          title: 'Overfeeding Treats',
          content: 'Treats should be less than 10% of daily calories. Many new parents over-treat during training. Use tiny pieces or part of regular food as rewards. Obesity is a serious health risk.',
          category: 'mistakes',
          difficulty: 'beginner',
          isPremium: false,
          order: 2,
        },
        {
          id: '11',
          title: isPuppy ? 'Skipping Socialization' : 'Neglecting Exercise',
          content: isPuppy
            ? 'The critical socialization window is 3-14 weeks. Missing it leads to fearful or aggressive adult behavior. Safely expose puppies to various people, animals, sounds, and environments.'
            : 'Insufficient exercise leads to destructive behavior, obesity, and anxiety. Your pet needs daily physical and mental stimulation appropriate to age and breed. Bored pets develop bad habits.',
          category: 'mistakes',
          difficulty: 'advanced',
          isPremium: false,
          order: 3,
        },
        {
          id: '12',
          title: 'Using Punishment-Based Training',
          content: 'Yelling, hitting, or "dominance" methods damage trust and can create aggressive behavior. Use positive reinforcement instead. Reward good behavior, redirect unwanted behavior, and be patient.',
          category: 'mistakes',
          difficulty: 'intermediate',
          isPremium: true,
          order: 4,
        },
      ],
    },
    {
      title: source === 'direct' && profile.breed ? `${profile.breed} Specific Tips` : 'Breed-Specific Alerts',
      description: 'Important considerations for your pet',
      icon: '🔔',
      contents: [
        {
          id: '13',
          title: 'Exercise Requirements',
          content: getExerciseRequirements(profile.breed),
          category: 'alerts',
          difficulty: 'intermediate',
          isPremium: false,
          order: 1,
        },
        {
          id: '14',
          title: 'Grooming Essentials',
          content: getGroomingRequirements(profile.breed),
          category: 'alerts',
          difficulty: 'beginner',
          isPremium: true,
          order: 2,
        },
        {
          id: '15',
          title: 'Health Watch Points',
          content: getHealthAlerts(profile.breed),
          category: 'alerts',
          difficulty: 'advanced',
          isPremium: true,
          order: 3,
        },
        {
          id: '16',
          title: 'Training Considerations',
          content: getTrainingTips(profile.breed),
          category: 'alerts',
          difficulty: 'intermediate',
          isPremium: true,
          order: 4,
        },
      ],
    },
  ];
}

function getExerciseRequirements(breed?: string): string {
  if (!breed) return 'Most pets need 30-60 minutes of daily exercise. Adjust based on age, health, and energy level. Include walks, play time, and mental stimulation like puzzle toys.';
  
  const breedLower = breed.toLowerCase();
  
  if (breedLower.includes('husky') || breedLower.includes('shepherd') || breedLower.includes('retriever')) {
    return 'This high-energy breed needs 60-90 minutes of vigorous exercise daily. Include running, swimming, or hiking. Under-exercising leads to destructive behavior. Mental challenges are equally important.';
  }
  if (breedLower.includes('bulldog') || breedLower.includes('pug')) {
    return 'This breed has moderate exercise needs due to brachycephalic (flat-faced) features. 20-30 minutes daily in cooler temperatures. Avoid overexertion and watch for breathing difficulties.';
  }
  if (breedLower.includes('cat')) {
    return 'Cats need 20-30 minutes of active play daily. Use interactive toys, laser pointers, and climbing structures. Indoor cats especially need regular exercise to prevent obesity.';
  }
  
  return 'This breed typically needs 30-45 minutes of daily exercise. Include walks, play sessions, and training. Adjust based on individual energy levels and weather conditions.';
}

function getGroomingRequirements(breed?: string): string {
  if (!breed) return 'Brush coat weekly, trim nails monthly, clean ears as needed. Bath when dirty using pet-safe shampoo. Check for skin issues, lumps, or parasites during grooming.';
  
  const breedLower = breed.toLowerCase();
  
  if (breedLower.includes('poodle') || breedLower.includes('shih tzu') || breedLower.includes('maltese')) {
    return 'This breed requires daily brushing and professional grooming every 4-6 weeks. Hair grows continuously and mats easily. Regular eye cleaning is essential. Consider keeping coat trimmed short for easier maintenance.';
  }
  if (breedLower.includes('husky') || breedLower.includes('retriever')) {
    return 'Expect heavy shedding, especially seasonally. Brush 2-3 times weekly (daily during shedding season). Bath monthly. Check and clean ears after swimming. Trim nails regularly.';
  }
  if (breedLower.includes('persian') || breedLower.includes('maine coon')) {
    return 'Long-haired cats need daily brushing to prevent mats. Clean face folds daily on flat-faced breeds. Trim nails every 2-3 weeks. Most cats don\'t need baths unless very dirty.';
  }
  
  return 'Brush 2-3 times weekly to reduce shedding and keep coat healthy. Trim nails every 2-3 weeks. Clean ears monthly. Bath every 2-3 months or as needed. Check paws and teeth regularly.';
}

function getHealthAlerts(breed?: string): string {
  if (!breed) return 'Schedule annual wellness checks. Keep vaccinations current. Use monthly flea, tick, and heartworm prevention. Watch for changes in appetite, energy, or bathroom habits. Address concerns promptly.';
  
  const breedLower = breed.toLowerCase();
  
  if (breedLower.includes('shepherd') || breedLower.includes('retriever') || breedLower.includes('labrador')) {
    return 'This breed is prone to hip and elbow dysplasia. Maintain healthy weight to reduce joint stress. Consider joint supplements. Watch for limping or difficulty rising. Screen for hereditary eye conditions annually.';
  }
  if (breedLower.includes('bulldog') || breedLower.includes('pug')) {
    return 'Brachycephalic breeds face breathing issues. Watch for overheating, especially in hot/humid weather. Monitor breathing during exercise. Prone to eye injuries and skin fold infections. Keep facial wrinkles clean and dry.';
  }
  if (breedLower.includes('persian') || breedLower.includes('siamese')) {
    return 'Monitor for kidney disease (common in cats). Ensure plenty of water intake. Persian cats prone to eye tearing and breathing issues. Schedule dental cleanings. Watch for signs of urinary blockage in males.';
  }
  
  return 'Keep up with preventive care including vaccinations and parasite control. Watch for breed-specific issues. Maintain healthy weight. Address any changes in behavior or health immediately. Build relationship with trusted vet.';
}

function getTrainingTips(breed?: string): string {
  if (!breed) return 'Use positive reinforcement consistently. Start with basic commands. Keep sessions short and fun. Be patient and consistent. Socialize early and often. Consider professional training classes.';
  
  const breedLower = breed.toLowerCase();
  
  if (breedLower.includes('shepherd') || breedLower.includes('border collie')) {
    return 'This intelligent breed learns quickly but needs mental stimulation. Teach advanced commands and tricks. Use puzzle toys and varied activities. Without challenges, they become bored and destructive. Excellent for agility training.';
  }
  if (breedLower.includes('bulldog') || breedLower.includes('beagle')) {
    return 'This breed can be stubborn. Use high-value treats and keep training fun. Short, frequent sessions work best. Be patient and consistent. They may be food-motivated, making treat-based training effective.';
  }
  if (breedLower.includes('cat')) {
    return 'Cats respond to positive reinforcement. Use clicker training for tricks. Train using play and treats. Keep sessions very short (2-3 minutes). Focus on litter training, scratching post use, and basic commands like "come".';
  }
  
  return 'Start training early using positive reinforcement. This breed responds well to consistency and patience. Keep sessions engaging with treats and praise. Socialize with other pets and people. Consider group classes for structure.';
}

