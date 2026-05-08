import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, phone, petStatus, petType, breed } = req.body;

        // Validate required fields
        if (!name || !phone) {
            return res.status(400).json({ message: 'Missing name or phone' });
        }

        // Log the lead data to console
        console.log('📱 New AI Pet Preview Lead:');
        console.log('================================');
        console.log('Name:', name);
        console.log('Phone:', phone);
        console.log('Pet Status:', petStatus);
        console.log('Selected Pet:', petType);
        console.log('Selected Breed:', breed);
        console.log('Timestamp:', new Date().toISOString());
        console.log('================================');

        // In a real app, you'd save this to Supabase or Google Sheets
        // For now, we'll just return success
        res.status(200).json({
            success: true,
            message: 'Lead saved successfully!'
        });
    } catch (error) {
        console.error('Error saving lead:', error);
        res.status(500).json({ message: 'Failed to save lead' });
    }
}
