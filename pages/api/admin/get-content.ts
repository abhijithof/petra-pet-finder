import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'content.json');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(200).json({ 
        success: true, 
        content: null,
        message: 'No saved content found' 
      });
    }
    
    // Read content from file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const content = JSON.parse(fileContent);
    
    return res.status(200).json({ 
      success: true, 
      content 
    });
  } catch (error) {
    console.error('Error loading content:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to load content' 
    });
  }
}

