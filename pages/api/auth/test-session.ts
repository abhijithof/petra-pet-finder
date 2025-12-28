import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    res.status(200).json({
      hasSession: !!session,
      session: session ? {
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name,
        },
        expires: session.expires,
      } : null,
      message: session ? 'Session exists' : 'No session found',
    });
  } catch (error: any) {
    console.error('Error checking session:', error);
    res.status(500).json({
      hasSession: false,
      error: error.message,
      message: 'Error checking session',
    });
  }
}

