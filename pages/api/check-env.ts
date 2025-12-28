import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check environment variables (don't expose secrets, just check if they exist)
  const envCheck = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSupabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nodeEnv: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
  };

  const allRequired = 
    envCheck.hasSupabaseUrl &&
    envCheck.hasSupabaseAnonKey &&
    envCheck.hasSupabaseServiceRoleKey &&
    envCheck.hasGoogleClientId &&
    envCheck.hasGoogleClientSecret &&
    envCheck.hasNextAuthSecret;

  res.status(200).json({
    status: allRequired ? 'ok' : 'missing_vars',
    environment: envCheck,
    message: allRequired 
      ? 'All required environment variables are set' 
      : 'Some required environment variables are missing',
  });
}

