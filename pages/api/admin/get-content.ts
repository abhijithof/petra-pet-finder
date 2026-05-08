import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

function isAdmin(email: string): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorised' });
  }
  if (!isAdmin(session.user.email)) {
    return res.status(403).json({ message: 'Forbidden' });
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

