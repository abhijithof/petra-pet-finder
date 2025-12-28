import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { supabaseAdmin } from '../../../lib/supabase';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { data: subscription, error } = await supabaseAdmin
      .from('subscriptions')
      .select(`
        *,
        subscription_plans (
          id,
          name,
          description,
          price_monthly,
          price_yearly,
          features
        )
      `)
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching subscription:', error);
      return res.status(500).json({ message: 'Failed to fetch subscription' });
    }

    res.status(200).json({ subscription: subscription || null });
  } catch (err: any) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

