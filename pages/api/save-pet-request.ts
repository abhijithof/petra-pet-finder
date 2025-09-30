import { NextApiRequest, NextApiResponse } from 'next';

interface FormData {
  fullName: string;
  emailOrPhone: string;
  petType: string;
  breedSizePreference: string;
  agePreference: string;
  budgetRange: string;
  location: string;
  additionalNotes: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const formData: FormData = req.body;

    // Validate required fields
    if (!formData.fullName || !formData.emailOrPhone || !formData.petType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Log the form data to console (you can see this in your terminal)
    console.log('🐾 New Pet Request Received:');
    console.log('================================');
    console.log('Name:', formData.fullName);
    console.log('Contact:', formData.emailOrPhone);
    console.log('Pet Type:', formData.petType);
    console.log('Breed/Size:', formData.breedSizePreference || 'Not specified');
    console.log('Age:', formData.agePreference || 'Not specified');
    console.log('Budget:', formData.budgetRange || 'Not specified');
    console.log('Location:', formData.location || 'Not specified');
    console.log('Notes:', formData.additionalNotes || 'None');
    console.log('================================');
    console.log('Timestamp:', new Date().toISOString());
    console.log('');

    // In a real app, you'd save this to a database
    // For now, we'll just return success
    res.status(200).json({ 
      message: 'Pet request received successfully!',
      data: formData 
    });
  } catch (error) {
    console.error('Error processing pet request:', error);
    res.status(500).json({ message: 'Failed to process request' });
  }
}
