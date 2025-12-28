import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseSecret) {
    return res.status(200).json({
      status: 'missing',
      message: 'Supabase environment variables are missing',
      hasUrl: !!supabaseUrl,
      hasSecret: !!supabaseSecret,
      recommendation: 'Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables',
    });
  }

  // Validate format
  if (!supabaseUrl.startsWith('https://')) {
    return res.status(200).json({
      status: 'invalid',
      message: 'NEXT_PUBLIC_SUPABASE_URL must start with https://',
      url: supabaseUrl.substring(0, 20) + '...',
    });
  }

  if (supabaseSecret.length < 20) {
    return res.status(200).json({
      status: 'invalid',
      message: 'SUPABASE_SERVICE_ROLE_KEY appears to be too short or invalid',
      secretLength: supabaseSecret.length,
    });
  }

  // Test the connection
  try {
    const supabase = createClient(supabaseUrl, supabaseSecret, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Try a simple query to test the connection
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      // Check if it's an auth error (invalid key)
      if (error.message?.includes('Invalid API key') || error.code === 'PGRST301') {
        return res.status(200).json({
          status: 'invalid_key',
          message: 'Supabase service role key is invalid',
          error: error.message,
          recommendation: 'Get the correct service_role key from Supabase Dashboard → Settings → API',
        });
      }

      // Other errors (like table doesn't exist) are less critical
      return res.status(200).json({
        status: 'connection_ok',
        message: 'Supabase connection works, but query failed (this might be OK)',
        error: error.message,
        errorCode: error.code,
      });
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Supabase connection is working correctly',
      url: supabaseUrl,
      canQuery: true,
    });
  } catch (error: any) {
    return res.status(200).json({
      status: 'error',
      message: 'Failed to connect to Supabase',
      error: error.message,
      recommendation: 'Check your Supabase URL and service role key',
    });
  }
}

