import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { data: plans, error } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true });

    if (error) {
      console.error('Error fetching plans:', error);
      return res.status(500).json({ message: 'Failed to fetch plans' });
    }

    res.status(200).json({ plans: plans || [] });
  } catch (err: any) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

