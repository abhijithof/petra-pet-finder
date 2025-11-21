import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const results: Record<string, any> = {
    petFinderUrl: process.env.GOOGLE_SHEET_PET_FINDER_URL ? 'Configured ✅' : 'Missing ❌',
    waitlistUrl: process.env.GOOGLE_SHEET_WAITLIST_URL ? 'Configured ✅' : 'Missing ❌',
    petFinderUrlValue: process.env.GOOGLE_SHEET_PET_FINDER_URL || 'Not set',
    waitlistUrlValue: process.env.GOOGLE_SHEET_WAITLIST_URL || 'Not set',
  };

  // Test sending to Pet Finder sheet
  if (process.env.GOOGLE_SHEET_PET_FINDER_URL) {
    try {
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        city: 'Kochi',
        petType: 'Dog',
        breed: 'Labrador',
        ageRange: '1-2 years',
        budget: '₹50,000',
        temperament: 'Friendly',
        notes: 'This is a test submission'
      };

      const response = await fetch(process.env.GOOGLE_SHEET_PET_FINDER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const responseText = await response.text();
      
      results['petFinderTest'] = {
        status: response.ok ? 'Success ✅' : 'Failed ❌',
        statusCode: response.status,
        response: responseText
      };
    } catch (error) {
      results['petFinderTest'] = {
        status: 'Error ❌',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Test sending to Waitlist sheet
  if (process.env.GOOGLE_SHEET_WAITLIST_URL) {
    try {
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        plan: 'Test Plan'
      };

      const response = await fetch(process.env.GOOGLE_SHEET_WAITLIST_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const responseText = await response.text();
      
      results['waitlistTest'] = {
        status: response.ok ? 'Success ✅' : 'Failed ❌',
        statusCode: response.status,
        response: responseText
      };
    } catch (error) {
      results['waitlistTest'] = {
        status: 'Error ❌',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  return res.status(200).json(results);
}



