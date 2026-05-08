import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { selfie, petType, breed } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!selfie || !petType || !breed) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!apiKey) {
    console.error('OPENAI_API_KEY is not set');
    return res.status(500).json({ message: 'AI service configuration error' });
  }

  try {
    const base64Data = selfie.split(',')[1] || selfie;

    // Step 1: Analyze the selfie using GPT-4o-mini (Visions) - more efficient and usually higher limits
    console.log('Analyzing selfie with GPT-4o-mini...');
    const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe this person in detail for a high-fidelity image generation prompt. Focus on facial features, hairstyle, and clothing. Keep it concise. Return ONLY the description.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      }),
    });

    const visionData = await visionResponse.json();
    if (!visionResponse.ok) {
      console.error('Vision API Full Error:', JSON.stringify(visionData));
      throw new Error(`Vision Error: ${visionData.error?.message || 'Unknown error'}`);
    }

    const personDescription = visionData.choices[0].message.content;
    console.log('Person description obtained:', personDescription);

    // Step 2: Generate the image with DALL-E 3 using the description
    console.log('Generating image with DALL-E 3...');
    const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `A photorealistic, professional DSLR portrait of a person with the following features: ${personDescription}. They are standing in a warm, cozy home environment, gently holding a fluffy ${breed} ${petType}. The person has a joyful, heartwarming expression. The ${petType} looks calm and affectionate. Cinematic lighting, soft 85mm lens background blur, hyper-realistic, 8k resolution, documentary style photography.`,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
      }),
    });

    const dalleData = await dalleResponse.json();
    if (!dalleResponse.ok) {
      console.error('DALL-E API Full Error:', JSON.stringify(dalleData));
      throw new Error(`DALL-E Error: ${dalleData.error?.message || 'Unknown error'}`);
    }

    const generatedImageUrl = dalleData.data[0].url;

    return res.status(200).json({
      success: true,
      imageUrl: generatedImageUrl,
      message: 'Magic moment created with OpenAI DALL-E 3',
    });

  } catch (error: any) {
    console.error('OpenAI API Error:', error);

    // Booth Fallback: Always return the selfie if DALL-E fails or takes too long
    // to ensure the user flow isn't broken during the event.
    return res.status(200).json({
      success: true,
      imageUrl: selfie,
      message: 'Preview generated successfully (Demo Mode)',
    });
  }
}
