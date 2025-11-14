import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const content = req.body;
    
    // Save to a JSON file in the data directory
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'content.json');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write content to file
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Content saved successfully' 
    });
  } catch (error) {
    console.error('Error saving content:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to save content' 
    });
  }
}

