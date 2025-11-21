import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * AI-Powered Pet Guide Generation using Open Source Models
 * 
 * This implementation uses FREE open-source AI models via:
 * 1. Groq API (Llama 3 - FREE with 14,400 requests/day)
 * 2. Hugging Face Inference API (FREE tier available)
 * 3. Together AI (Free credits available)
 * 
 * Setup instructions in comments below
 */

interface PetProfile {
  situation?: string;
  experienceLevel?: string;
  concern?: string; // Can be comma-separated for multiple concerns
  breed?: string;
  ageInWeeks?: number;
}

// Choose your AI provider (uncomment one)
const AI_PROVIDER: 'groq' | 'huggingface' | 'together' | 'local-ollama' = 'groq';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { profile, source } = req.body as { profile: PetProfile; source: 'quiz' | 'direct' };

    // Generate content using AI
    const sections = await generateWithAI(profile, source);

    return res.status(200).json({
      success: true,
      sections,
      generatedAt: new Date().toISOString(),
      aiProvider: AI_PROVIDER,
    });
  } catch (error) {
    console.error('Error generating guide with AI:', error);
    return res.status(500).json({ message: 'Failed to generate guide' });
  }
}

/**
 * Generate content using AI based on selected provider
 */
async function generateWithAI(profile: PetProfile, source: 'quiz' | 'direct') {
  const prompt = createPrompt(profile, source);

  let aiResponse: string;

  switch (AI_PROVIDER) {
    case 'groq':
      aiResponse = await generateWithGroq(prompt);
      break;
    case 'huggingface':
      aiResponse = await generateWithHuggingFace(prompt);
      break;
    case 'together':
      aiResponse = await generateWithTogether(prompt);
      break;
    case 'local-ollama':
      aiResponse = await generateWithOllama(prompt);
      break;
    default:
      throw new Error('Invalid AI provider');
  }

  return parseAIResponse(aiResponse);
}

/**
 * Create structured prompt for AI
 */
function createPrompt(profile: PetProfile, source: 'quiz' | 'direct'): string {
  // Build detailed context based on profile
  let context = '';
  let specificRequirements = '';

  if (source === 'quiz') {
    // Map situation to specific context
    const situationMap: any = {
      'thinking': 'is researching and considering getting their first pet',
      'getting-week': 'is getting a pet THIS WEEK and needs immediate preparation advice',
      'new-parent': 'just got their first pet within the last 0-3 months',
      'experienced-new-breed': 'is an experienced pet owner but new to this specific breed'
    };

    const experienceMap: any = {
      'first-time': 'has NEVER owned a pet before (complete beginner)',
      'family-pet': 'grew up with family pets but never had personal responsibility',
      'experienced': 'is an experienced pet owner with years of hands-on experience'
    };

    const situation = profile.situation || 'new-parent';
    const experience = profile.experienceLevel || 'first-time';
    const concern = profile.concern || 'basic-care';
    
    // Handle multiple concerns (comma-separated)
    const concerns = concern.split(',').map(c => c.trim());
    
    const concernMap: any = {
      'basic-care': 'BASIC DAILY CARE (feeding, grooming, routines)',
      'health': 'HEALTH & WELLNESS (vet visits, vaccinations, illnesses)',
      'behavior': 'BEHAVIOR & TRAINING (commands, socialization, discipline)',
      'emergency': 'EMERGENCY PREPAREDNESS (first aid, emergencies)'
    };
    
    const concernText = concerns.length > 1 
      ? `is concerned about multiple areas: ${concerns.map(c => concernMap[c]).filter(Boolean).join(', ')}`
      : `is most concerned about ${concernMap[concerns[0]]}`;
    
    context = `User ${situationMap[situation]}, ${experienceMap[experience]}, and ${concernText}.`;
    
    if (profile.breed) {
      context += ` They have selected a ${profile.breed}.`;
    }

    // Add specific requirements based on their concerns
    const primaryConcern = concerns[0];
    const hasMultipleConcerns = concerns.length > 1;
    
    if (hasMultipleConcerns) {
      specificRequirements = `
CRITICAL: User has MULTIPLE concerns (${concerns.join(', ')}). Address ALL of them:
${concerns.map(c => `- ${concernMap[c]}`).join('\n')}
Distribute advice across all their concerns evenly.`;
    }
    
    // Add specific requirements based on their situation
    if (profile.situation === 'getting-week') {
      specificRequirements = `
CRITICAL: They need IMMEDIATE action items for THIS WEEK. Focus on urgent prep before pet arrives.
- What to buy TODAY
- How to pet-proof home NOW
- Emergency contacts to set up BEFORE pet arrives`;
    } else if (profile.situation === 'new-parent') {
      specificRequirements = `
CRITICAL: They ALREADY HAVE the pet (0-3 months). Focus on immediate challenges they're facing NOW.
- Current issues new parents face
- What to do in first few weeks
- How to handle accidents and mistakes`;
    } else if (profile.concern === 'health') {
      specificRequirements = `
CRITICAL: Prioritize HEALTH topics heavily.
- Vet schedules and what to expect
- Vaccination timelines
- Signs of illness to watch for
- Preventive care`;
    } else if (profile.concern === 'behavior') {
      specificRequirements = `
CRITICAL: Prioritize TRAINING and BEHAVIOR heavily.
- Specific training commands and techniques
- How to handle unwanted behaviors
- Socialization strategies
- Positive reinforcement methods`;
    } else if (profile.concern === 'emergency') {
      specificRequirements = `
CRITICAL: Prioritize EMERGENCY PREP heavily.
- First aid basics
- Emergency vet contacts
- What to do in common emergencies
- Warning signs that need immediate attention`;
    }

  } else {
    // Direct entry - focus on breed and age
    const ageInMonths = Math.round((profile.ageInWeeks || 8) / 4);
    const isPuppy = (profile.ageInWeeks || 8) < 52;
    
    context = `User has a ${profile.breed}, currently ${ageInMonths} month(s) old (${profile.ageInWeeks} weeks).`;
    
    if (isPuppy) {
      specificRequirements = `
CRITICAL: This is a YOUNG pet (puppy/kitten). Focus on:
- Age-appropriate development milestones
- Puppy/kitten specific care (feeding frequency, sleep needs)
- Early socialization windows
- Teething and growth`;
    } else {
      specificRequirements = `
CRITICAL: This is an ADULT pet. Focus on:
- Adult care requirements
- Maintaining health and fitness
- Behavior maintenance
- Long-term care`;
    }

    if (profile.breed) {
      specificRequirements += `

CRITICAL: Make ALL advice SPECIFIC to ${profile.breed}:
- Breed-specific health issues
- Breed-specific exercise needs
- Breed-specific grooming requirements
- Breed-specific temperament and behavior`;
    }
  }

  return `You are an expert veterinarian and pet care advisor in Kerala, India. 

STEP 1: ANALYZE THE USER (Think before responding)
First, analyze this user profile and create a personalized content strategy:

USER PROFILE:
${context}

${specificRequirements}

THINK THROUGH:
1. What are this user's biggest challenges RIGHT NOW?
2. What mistakes are they likely to make given their experience level?
3. What does ${profile.breed || 'their pet'} specifically need at this age/stage?
4. How does Kerala's climate affect their situation?
5. What's the most urgent thing they need to know TODAY?

STEP 2: CREATE CONTENT STRATEGY
Based on your analysis, decide:
- What should be their #1 priority today?
- What 3-4 things should they focus on this week?
- What mistakes do people with their profile commonly make?
- What breed-specific issues must they know?

STEP 3: GENERATE PERSONALIZED GUIDE
Now create the guide based on your analysis

INSTRUCTIONS:
1. Generate 4 sections of pet care advice
2. Each section must have EXACTLY 4 tips
3. Make EVERY tip specific to their situation (${profile.situation}, ${profile.experienceLevel}, ${profile.concern})
${profile.breed ? `4. Reference "${profile.breed}" specifically in breed-related tips` : ''}
5. Consider Kerala's hot, humid climate in all advice
6. DO NOT give generic advice - personalize based on their profile

Return ONLY valid JSON (no markdown, no explanations):

{
  "sections": [
    {
      "title": "Today's Priority",
      "description": "${profile.situation === 'getting-week' ? 'Urgent prep before pet arrives' : profile.situation === 'new-parent' ? 'Critical first steps for new parents' : 'Most important things to focus on right now'}",
      "icon": "🎯",
      "contents": [
        {
          "id": "1",
          "title": "Specific actionable title relevant to their situation",
          "content": "2-3 sentences of SPECIFIC advice tailored to their experience level and breed. Include specific steps.",
          "category": "priority",
          "difficulty": "beginner OR intermediate OR advanced (based on experience)",
          "isPremium": false,
          "order": 1
        },
        {
          "id": "2",
          "title": "Another specific title addressing their main concern",
          "content": "Address their specific concern with actionable steps.",
          "category": "priority",
          "difficulty": "beginner OR intermediate",
          "isPremium": false,
          "order": 2
        },
        {
          "id": "3",
          "title": "Third priority based on their situation",
          "content": "Specific advice considering Kerala climate and their unique situation.",
          "category": "priority",
          "difficulty": "intermediate",
          "isPremium": true,
          "order": 3
        },
        {
          "id": "4",
          "title": "Fourth priority item",
          "content": "Advanced tip specific to their needs.",
          "category": "priority",
          "difficulty": "intermediate",
          "isPremium": true,
          "order": 4
        }
      ]
    },
    {
      "title": "This Week's Focus",
      "description": "Key activities for the next 7 days (adjust based on their situation)",
      "icon": "📅",
      "contents": [
        /* 4 tips focused on their main concern and breed-specific needs */
      ]
    },
    {
      "title": "Common Mistakes to Avoid",
      "description": "Pitfalls specific to their experience level",
      "icon": "⚠️",
      "contents": [
        /* 4 mistakes common for their experience level with their specific breed */
      ]
    },
    {
      "title": "Breed-Specific Alerts OR [Breed Name] Specific Tips",
      "description": "Important considerations for their breed in Kerala",
      "icon": "🔔",
      "contents": [
        /* 4 tips specific to their breed, mentioning breed name explicitly in each tip */
      ]
    }
  ]
}

EXAMPLE THINKING PATTERNS:

Example 1: First-timer, getting pet this week, basic care concern
Analysis: Panicking about what to buy, how to prepare, completely overwhelmed
Priority Today: Buy essentials BEFORE pet arrives (list specific items)
This Week: Pet-proof home, find emergency vet, learn feeding schedule
Mistakes: Overbuying toys, forgetting health records, no emergency plan

Example 2: Experienced owner, new breed (Husky), behavior concern
Analysis: Knows general care but Huskies are VERY different, need specific training
Priority Today: Understand Husky temperament (escape artists, high energy)
This Week: Start recall training, secure yard, find dog trainer specializing in Huskies
Mistakes: Treating like previous breeds, underestimating exercise needs

Example 3: New parent (3 months), health concern, has Indie Dog
Analysis: Already have pet, worried about vaccinations and health issues
Priority Today: Check vaccination schedule, book next vet visit
This Week: Watch for common puppy illnesses, establish vet relationship
Mistakes: Skipping vaccines, ignoring early warning signs

CRITICAL RULES:
1. Make EVERY section different based on: situation + experience + concern + breed
2. If "getting-week" → All tips about PREPARATION before arrival
3. If "new-parent" → All tips about CURRENT challenges they're facing NOW
4. If "experienced" → Skip basics, give ADVANCED tips they don't know
5. If "first-time" → Step-by-step beginner instructions
6. If health concern → 75% of tips must be health-related
7. If behavior concern → 75% of tips must be training/behavior-related
8. Mention the breed BY NAME in at least 8 tips
9. Reference Kerala's heat/humidity in at least 4 tips
10. Each tip must have specific actions ("Do X, then Y"), not vague advice`;
}

/**
 * OPTION 1: Groq API (RECOMMENDED - FREE & FAST)
 * 
 * Setup:
 * 1. Get free API key from https://console.groq.com
 * 2. Add to .env.local: GROQ_API_KEY=your_key_here
 * 3. 14,400 free requests per day
 * 4. Ultra-fast inference (faster than OpenAI)
 * 
 * Install: npm install groq-sdk
 */
async function generateWithGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not found in environment variables');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Updated model - free and powerful
        messages: [
          {
            role: 'system',
            content: 'You are an expert pet care advisor in Kerala, India. You carefully analyze each user\'s unique situation before providing advice. Think step-by-step about their needs, then provide highly personalized guidance. Always respond with valid JSON only after your analysis.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.85, // High creativity for unique responses
        max_tokens: 3000, // More tokens for thinking + content
        top_p: 0.95,
      }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * OPTION 2: Hugging Face Inference API (FREE)
 * 
 * Setup:
 * 1. Get free API key from https://huggingface.co/settings/tokens
 * 2. Add to .env.local: HUGGINGFACE_API_KEY=your_key_here
 * 3. Free tier: 1,000 requests/day
 * 
 * No installation needed - uses fetch
 */
async function generateWithHuggingFace(prompt: string): Promise<string> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY not found in environment variables');
  }

  const response = await fetch(
    'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 2000,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${error}`);
  }

  const data = await response.json();
  return data[0].generated_text;
}

/**
 * OPTION 3: Together AI (FREE CREDITS)
 * 
 * Setup:
 * 1. Get free API key from https://api.together.xyz
 * 2. Add to .env.local: TOGETHER_API_KEY=your_key_here
 * 3. $25 free credits
 * 
 * No installation needed - uses fetch
 */
async function generateWithTogether(prompt: string): Promise<string> {
  const apiKey = process.env.TOGETHER_API_KEY;
  
  if (!apiKey) {
    throw new Error('TOGETHER_API_KEY not found in environment variables');
  }

  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful pet care expert. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Together AI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * OPTION 4: Local Ollama (100% FREE & PRIVATE)
 * 
 * Setup:
 * 1. Install Ollama: https://ollama.ai/download
 * 2. Run: ollama pull llama3.1
 * 3. Start server: ollama serve
 * 4. No API key needed - runs locally!
 * 
 * No installation needed - uses fetch
 */
async function generateWithOllama(prompt: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.1',
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Ollama is not running. Start it with: ollama serve');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    throw new Error('Ollama error: Make sure Ollama is installed and running (ollama serve)');
  }
}

/**
 * Parse AI response and extract JSON
 */
function parseAIResponse(response: string): any {
  try {
    // Remove markdown code blocks if present
    let cleaned = response.trim();
    
    // Remove ```json and ``` markers
    cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Find JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate structure
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      throw new Error('Invalid response structure');
    }

    return parsed.sections;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    console.error('Raw response:', response);
    throw new Error('Failed to parse AI response');
  }
}

