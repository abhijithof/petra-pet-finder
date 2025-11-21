import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * AI-Powered Breed Recommendation API
 * Recommends pet breeds available in Kerala based on user's quiz answers
 */

interface QuizProfile {
  situation: string;
  experienceLevel: string;
  concern: string; // Can be comma-separated for multiple concerns
}

// Pet breeds commonly available in Kerala (legally sold, standard breeds)
const KERALA_AVAILABLE_BREEDS = {
  dogs: [
    'Labrador Retriever',
    'Golden Retriever',
    'German Shepherd',
    'Beagle',
    'Pug',
    'Shih Tzu',
    'Cocker Spaniel',
    'Pomeranian',
    'Dachshund',
    'Rottweiler',
    'Doberman',
    'Boxer',
    'Siberian Husky',
    'Great Dane',
    'Bulldog',
    'French Bulldog',
    'Yorkshire Terrier',
    'Maltese',
  ],
  cats: [
    'Persian Cat',
    'Siamese Cat',
    'British Shorthair',
    'Maine Coon',
    'Bengal Cat',
    'Ragdoll',
    'Himalayan Cat',
    'American Shorthair',
    'Exotic Shorthair',
    'Scottish Fold',
  ],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { profile } = req.body as { profile: QuizProfile };

    // Get AI recommendations
    const recommendations = await getBreedRecommendations(profile);

    return res.status(200).json({
      success: true,
      recommendations,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error recommending breeds:', error);
    return res.status(500).json({ message: 'Failed to recommend breeds' });
  }
}

async function getBreedRecommendations(profile: QuizProfile) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    // Fallback to rule-based recommendations
    return getRuleBasedRecommendations(profile);
  }

  try {
    const prompt = createRecommendationPrompt(profile);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Updated model
        messages: [
          {
            role: 'system',
            content: 'You are a pet expert in Kerala, India. You analyze each person\'s unique situation, lifestyle, and concerns before recommending breeds. Think carefully about what they can handle and what will make them successful. Recommend only breeds available in Kerala. Always respond with valid JSON only after thorough analysis.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.85, // High for unique recommendations
        max_tokens: 2500, // More tokens for thinking
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      throw new Error('AI API failed');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return parseRecommendations(aiResponse);
  } catch (error) {
    console.error('AI recommendation failed, using fallback:', error);
    return getRuleBasedRecommendations(profile);
  }
}

function createRecommendationPrompt(profile: QuizProfile): string {
  const availableBreeds = [...KERALA_AVAILABLE_BREEDS.dogs, ...KERALA_AVAILABLE_BREEDS.cats];
  const breedList = availableBreeds.join(', ');

  // Create specific requirements based on profile
  const situationContext: any = {
    'thinking': 'is researching pets. Recommend breeds that are good starter pets with clear expectations.',
    'getting-week': 'is getting a pet THIS WEEK. Recommend readily available breeds that settle quickly.',
    'new-parent': 'JUST GOT their first pet (0-3 months ago). Recommend what would have been best for them.',
    'experienced-new-breed': 'is experienced but trying a new breed. Can handle more challenging breeds.'
  };

  const experienceContext: any = {
    'first-time': 'has NEVER owned a pet. Prioritize LOW MAINTENANCE, FORGIVING breeds. Avoid high-maintenance.',
    'family-pet': 'had pets at home but never primary responsibility. Recommend MODERATE care needs.',
    'experienced': 'is very experienced. Can handle HIGH MAINTENANCE and challenging breeds.'
  };

  // Handle multiple concerns (comma-separated)
  const concerns = profile.concern.split(',').map(c => c.trim());
  
  const concernContext: any = {
    'basic-care': 'worried about daily routines. Recommend LOW MAINTENANCE breeds with simple care needs like Pugs, Beagles, Persians.',
    'health': 'worried about vet visits and health. Recommend HEALTHY, ROBUST breeds with good health records like Labradors, Beagles.',
    'behavior': 'worried about training. Recommend EASY TO TRAIN, INTELLIGENT, OBEDIENT breeds like Labs, Goldens, German Shepherds.',
    'emergency': 'worried about emergencies. Recommend RESILIENT, HARDY breeds with stable temperaments.'
  };
  
  const concernDescriptions = concerns.map(c => concernContext[c] || '').filter(Boolean).join(' ALSO ');

  return `You are a pet expert in Kerala, India. 

STEP 1: ANALYZE THIS USER
Think carefully about what this person needs:

USER PROFILE:
- Situation: ${profile.situation} - ${situationContext[profile.situation]}
- Experience: ${profile.experienceLevel} - ${experienceContext[profile.experienceLevel]}
- Concerns: ${concerns.join(', ')} - ${concernDescriptions}

THINK THROUGH:
1. Given their experience (${profile.experienceLevel}), what care level can they handle?
2. Given their concern (${profile.concern}), what traits should I prioritize?
3. Given their situation (${profile.situation}), what timeline/urgency do they have?
4. What breeds will thrive in Kerala's hot, humid climate?
5. What breeds will match their lifestyle and reduce their concerns?

STEP 2: CREATE RECOMMENDATION STRATEGY
Based on analysis:
- If first-time → ONLY recommend beginner-friendly, low-maintenance breeds
- If experienced → Can recommend challenging breeds
- If health concern → Prioritize robust, healthy breeds (Indian breeds!)
- If behavior concern → Prioritize trainable, intelligent breeds
- If basic care concern → Prioritize low-maintenance breeds
- ALWAYS prioritize breeds adapted to Kerala climate

AVAILABLE BREEDS (Kerala only):
${breedList}

STEP 3: RECOMMEND 4-5 BREEDS
Now recommend breeds based on your strategy.

EXAMPLE THINKING PROCESS:

Example 1: "First-time, basic care concern"
Analysis: Complete beginner, needs success. Will be overwhelmed by high maintenance.
Strategy: Recommend friendly, forgiving breeds perfect for beginners.
Breeds: Labrador (95%), Beagle (92%), Pug (88%), Golden Retriever (85%)

Example 2: "Experienced, behavior concern"  
Analysis: Can handle training challenges. Wants smart, trainable pet.
Strategy: Recommend intelligent, working breeds that need mental stimulation.
Breeds: German Shepherd (94%), Golden Retriever (91%), Doberman (87%), Bengal Cat (84%)

Example 3: "Getting this week, health concern"
Analysis: Urgent timeline, worried about vet bills. Needs healthy, hardy breed.
Strategy: Recommend robust breeds with good health records, readily available.
Breeds: Labrador (93%), Beagle (90%), Golden Retriever (87%), Persian Cat (84%)

CRITICAL REQUIREMENTS:
1. First-time owner → ONLY beginner-friendly, low-maintenance breeds
2. Experienced → Can suggest challenging breeds (GSD, Husky, Doberman, Bengal)
3. Health concern → Recommend breeds with good health records
4. Behavior concern → Trainable, intelligent breeds (Labs, Shepherds, Goldens)
5. Basic care concern → Easy maintenance breeds (Pugs, Beagles, Persians)
6. Getting this week → Readily available, adaptable breeds
7. Kerala climate → Heat-tolerant breeds ONLY (avoid thick-coated breeds)
8. Each recommendation must have DIFFERENT match scores (don't repeat 90% five times)

Return ONLY valid JSON (no markdown, no explanations):
{
  "recommendations": [
    {
      "breed": "Exact breed name from the list",
      "type": "dog" or "cat",
      "matchScore": 95,
      "bestFor": "Brief phrase like 'First-time owners' or 'Active families'",
      "whyRecommended": "2-3 sentences explaining why this breed suits them",
      "climateNote": "How well suited for Kerala climate",
      "careLevel": "low" or "medium" or "high",
      "estimatedAge": "Recommended age to start with (e.g., '8-12 weeks')",
      "keyTraits": ["friendly", "easy to train", "adaptable"],
      "considerations": "Important things to know before choosing"
    }
  ]
}

Prioritize:
1. Indian/Indie breeds first (better adapted to Kerala)
2. Breeds suited to hot climate
3. Match to user's experience level
4. Consider their main concern`;
}

function parseRecommendations(response: string): any {
  try {
    let cleaned = response.trim();
    cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
      throw new Error('Invalid response structure');
    }

    return parsed.recommendations;
  } catch (error) {
    console.error('Error parsing AI recommendations:', error);
    throw error;
  }
}

// Fallback rule-based recommendations if AI fails
function getRuleBasedRecommendations(profile: QuizProfile) {
  const isFirstTime = profile.experienceLevel === 'first-time';
  const isNewParent = profile.situation === 'new-parent' || profile.situation === 'getting-week';

  if (isFirstTime) {
    return [
      {
        breed: 'Labrador Retriever',
        type: 'dog',
        matchScore: 90,
        bestFor: 'Families and first-time owners',
        whyRecommended: 'Labs are friendly, easy to train, and great with families. They\'re one of the most popular breeds in Kerala for good reason - gentle temperament and high intelligence make them ideal for beginners.',
        climateNote: 'Adapts well but needs AC/cool space during summer',
        careLevel: 'medium',
        estimatedAge: '8-12 weeks',
        keyTraits: ['friendly', 'easy to train', 'family-oriented', 'gentle'],
        considerations: 'Need daily exercise and space to play. Moderate grooming required.',
      },
      {
        breed: 'Beagle',
        type: 'dog',
        matchScore: 88,
        bestFor: 'Active first-time owners',
        whyRecommended: 'Beagles are small to medium-sized, friendly, and great with children. They\'re relatively easy to care for and their size makes them suitable for apartments. Very playful and social.',
        climateNote: 'Handles Kerala climate reasonably well',
        careLevel: 'medium',
        estimatedAge: '8-10 weeks',
        keyTraits: ['friendly', 'playful', 'compact size', 'social'],
        considerations: 'Can be vocal (barking). Need daily walks and mental stimulation.',
      },
      {
        breed: 'Pug',
        type: 'dog',
        matchScore: 92,
        bestFor: 'First-time owners in apartments',
        whyRecommended: 'Pugs are small, affectionate, and perfect for first-time owners. They\'re low-energy, great with families, and adapt well to apartment living. Their playful personality and manageable size make them ideal beginners\' pets.',
        climateNote: 'Moderate heat tolerance, needs cool indoor space',
        careLevel: 'low',
        estimatedAge: '8-10 weeks',
        keyTraits: ['affectionate', 'low-energy', 'compact', 'family-friendly'],
        considerations: 'Watch for breathing issues in hot weather. Keep indoors during peak heat. Regular but simple grooming needed.',
      },
      {
        breed: 'Persian Cat',
        type: 'cat',
        matchScore: 89,
        bestFor: 'Indoor-only, calm environments',
        whyRecommended: 'Persian cats are calm, gentle, and perfect for indoor living. They\'re low-energy and enjoy a peaceful home. Great for apartments and families seeking a relaxed companion.',
        climateNote: 'Needs AC in hot weather due to thick coat',
        careLevel: 'medium',
        estimatedAge: '3-4 months',
        keyTraits: ['calm', 'gentle', 'indoor-friendly', 'quiet'],
        considerations: 'Requires daily grooming due to long coat. Must be kept indoors in AC.',
      },
    ];
  }

  // For experienced owners
  return [
    {
      breed: 'German Shepherd',
      type: 'dog',
      matchScore: 94,
      bestFor: 'Experienced owners',
      whyRecommended: 'Highly intelligent, loyal, and versatile. German Shepherds excel in training and are excellent protectors. They form strong bonds with families and are very trainable. Perfect for experienced handlers.',
      climateNote: 'Needs cool environment, AC recommended',
      careLevel: 'high',
      estimatedAge: '8-10 weeks',
      keyTraits: ['intelligent', 'loyal', 'protective', 'trainable'],
      considerations: 'Need significant exercise, mental stimulation, and space. Regular grooming required.',
    },
    {
      breed: 'Golden Retriever',
      type: 'dog',
      matchScore: 91,
      bestFor: 'Active families',
      whyRecommended: 'Golden Retrievers are friendly, intelligent, and excellent with families. They\'re highly trainable and make wonderful companions. Great for those who want an active, loving pet.',
      climateNote: 'Adapts well but needs AC during hot months',
      careLevel: 'medium',
      estimatedAge: '8-12 weeks',
      keyTraits: ['friendly', 'intelligent', 'gentle', 'active'],
      considerations: 'Need daily exercise and space to play. Regular grooming and coat care needed.',
    },
    {
      breed: 'Doberman',
      type: 'dog',
      matchScore: 88,
      bestFor: 'Experienced owners with space',
      whyRecommended: 'Dobermans are highly intelligent, protective, and loyal. They\'re excellent guard dogs and form strong bonds with families. Perfect for experienced handlers who want a protective companion.',
      climateNote: 'Short coat handles Kerala heat reasonably well',
      careLevel: 'high',
      estimatedAge: '8-10 weeks',
      keyTraits: ['loyal', 'protective', 'intelligent', 'alert'],
      considerations: 'Need space, regular exercise, and consistent training. Can be protective of territory.',
    },
    {
      breed: 'Bengal Cat',
      type: 'cat',
      matchScore: 87,
      bestFor: 'Active, experienced cat owners',
      whyRecommended: 'Intelligent, active, and stunning. Bengal cats are highly interactive and can be trained. They\'re perfect for experienced owners who want an engaging, dog-like cat.',
      climateNote: 'Short coat handles Kerala climate well',
      careLevel: 'medium',
      estimatedAge: '3-4 months',
      keyTraits: ['intelligent', 'active', 'playful', 'trainable'],
      considerations: 'Very active, needs lots of play and stimulation. Can be demanding.',
    },
  ];
}

